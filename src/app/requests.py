import webapp2
import json
import jsons
import models
import publisher
import delegator
from google.appengine.api import channel
import logging
import strings
import datetime

class HouseHandler(webapp2.RequestHandler):
    '''
    GET returns name of the current house and the users in it
    '''

    def get(self):
        self.response.headers['Content-Type'] = 'application/json'
        house_json = jsons.get_house_json()
        self.response.out.write(json.dumps(house_json))


class HouseNamesHandler(webapp2.RequestHandler):
    '''
    Checks if a house exist in the name given
    '''

    def get(self, house_name):
        house_exists = models.household_exists(house_name.lower())

        self.response.headers['Content-Type'] = 'application/json'

        obj = {
            'exists': house_exists

        }

        self.response.out.write(json.dumps(obj))


class TaskHandler(webapp2.RequestHandler):
    '''
    GET returns all Tasks relevant to the user logged in

    DELETE method get tasksId sent from front end and deletes this task from the data store.
    Returns a JSON containing all of the Tasks a house has associated with it (minus the deleted
    task

    POST adds a Task to data store and returns all the tasks that a house
    has in JSON format.
    '''
    def get(self, task_id=None):
        if task_id is None:
            tasks_list = models.get_household_tasks()
            task_list_json = jsons.get_all_tasks_json(tasks_list)
            json_data = json.dumps(task_list_json)
            self.response.out.write(json_data)
        else:
            task = models.get_task(int(task_id))
            task_json = jsons.get_task_json(task)
            json_data = json.dumps(task_json)
            self.response.out.write(json_data)

    def delete(self, task_id):
        task_id_int = int(task_id)
        models.delete_task(task_id_int)

        obj = {
            'taskId': task_id_int
        }
        update_json = {}
        update_json['eventType'] = 'deleteTask'
        update_json['taskId'] = task_id_int
        json_data = json.dumps(obj)
        update_data = json.dumps(update_json)
        publisher.update_clients(models.get_members_list(), update_data)
        self.response.out.write(json_data)

    def put(self):
        json_data = json.loads(self.request.body)
        task_id = json_data.get("taskID")
        task = models.edit_task(task_id, json_data)

        task_json = jsons.get_task_json(task)
        update_json = {}
        update_json['eventType'] = 'editTask'
        update_json['task'] = task_json
        json_data = json.dumps(task_json)
        update_data = json.dumps(update_json)
        publisher.update_clients(models.get_members_list(), update_data)
        self.response.out.write(json_data)


    def post(self):
        json_data = json.loads(self.request.body)
        task_name = json_data.get("name")
        frequency = int(json_data.get("frequency"))
        description = json_data.get("description")
        difficulty = int(json_data.get("difficulty"))
        style = json_data.get("iconClass")

        task = models.add_task(task_name, difficulty, description, frequency, style)
        task = task.get()

        task = delegator.delegate_task(task)
        task_json = jsons.get_task_json(task)
        update_json = {}
        update_json['eventType'] = 'addTask'
        update_json['task'] = task_json
        json_data = json.dumps(task_json)
        update_data = json.dumps(update_json)
        publisher.update_clients(models.get_members_list(), update_data)
        self.response.out.write(json_data)


class TaskEventHandler(webapp2.RequestHandler):
    '''
    The is the handler called when a user has done a Task. The taskId is sent via JSON and the datastore
    is updated to reflect that the task is done. A JSON containing the updated version / info of the task
    that has been done is sent back via JSON.

    PUT is called when a user gives a Task positive or negative feedback. Updated in model and
    returns the updated version of the Task JSON
    '''
    def post(self, task_id):
        task_id = int(task_id)
        new_task_event = models.add_task_event(task_id).get()
        task = models.get_task(task_id)
        task = delegator.delegate_task(task)

        obj = jsons.get_task_json(task)

        update_json = {}
        update_json['eventType'] = 'taskEvent'
        update_json['taskId'] = task_id
        update_json[strings.assignedInitials] = task.get_delagated_initials()
        update_json[strings.completedByInitials] = new_task_event.completed_by.get().get_initials()

        member = models.get_member_key().get()
        update_json['doneBy'] = member.first_name + " " + member.last_name
        #if member.avatar:
            #update_json['avatar'] = member.avatar
        json_data = json.dumps(obj)
        update_data = json.dumps(update_json)
        publisher.update_clients(models.get_members_list(), update_data)
        self.response.out.write(json_data)

    def get(self, task_id):
        task_id = int(task_id)
        datastore_events_list = models.get_task_events(task_id)
        datastore_events = jsons.get_all_events_json(datastore_events_list)
        json_data = json.dumps(datastore_events)
        self.response.out.write(json_data)

    def put(self, task_id):
        task_id = int(task_id)
        json_data = json.loads(self.request.body)
        was_positive = json_data.get("goodJob")
        task_event = models.update_task_event_feedback(task_id, was_positive)

        if task_event:
            task = models.get_task(task_id)

            obj = jsons.get_task_json(task)

            update_json = {}
            update_json['eventType'] = 'taskFeedback'
            update_json['taskId'] = task_id
            update_json['positive'] = task_event.positive_feedback
            update_json['negative'] = task_event.negative_feedback
            member = models.get_member_key().get()
            update_json['doneBy'] = member.first_name + " " + member.last_name
            #if member.avatar:
                #update_json['avatar'] = member.avatar

            json_data = json.dumps(obj)
            update_data = json.dumps(update_json)
            publisher.update_clients(models.get_members_list(), update_data)
            self.response.out.write(json_data)


class MemberHandler(webapp2.RequestHandler):
    '''
    GET request - Given the user who is logged in, this returns a list of all members of the household in the JSON format
    outlined in jsons.get_member_json
    '''

    def get(self):
        members_list = models.get_members_list()
        members = jsons.get_all_members_json(members_list)
        json_data = {}
        json_data["houseName"] = models.get_household_key_for_current_user().get().name
        json_data["members"] = members
        json_data = json.dumps(json_data)
        self.response.out.write(json_data)

    """
    A user is able to update their first or last name using request handler. JSON is sent containing
    desired first and last name. Data store then updated to reflect this.
    """
    def put(self):
        first_name = self.request.get('firstName')
        last_name = self.request.get('lastName')
        house_name = self.request.get('houseName')
        avatar = self.request.get('avatar')
        notifications_on = self.request.get('notificationsOn')

        models.update_house(house_name);
        member = models.update_member(first_name, last_name, notifications_on, avatar)
        json_data = jsons.get_member_json(member)
        json_data = json.dumps(json_data)
        self.response.out.write(json_data)

class AnalysisHandler(webapp2.RequestHandler):
    """ type of graph and the data
    # switch statement
    # depending on the type of graph dispatch to appropiate method in stats.py
    # returns the json data
    # self.response.out.write(json_data)
    """



    def get(self):

        try:
            charttype = self.request.GET['charttype']

            self.response.headers['Content-Type'] = 'application/json'

            if charttype == "housechart":
                # Get the household key
                houseKey = models.get_household_key_for_current_user()

                #Get all members
                membersKeys = models.get_all_members_for_household(houseKey)

                # response = {"house_name":houseKey.get().name }
                #
                response = {}

                # Array of Arrays with each data point
                data = []
                # Array of Date Strings
                labels = []
                # Array of member Names
                series = []


                # Chart 2 - Activity in the last 7 days

                dateBefore7Days = datetime.datetime.now() - datetime.timedelta(days=6)

                # Add the labels as weekdays
                for j in range(5):
                        day = dateBefore7Days + datetime.timedelta(days=j)
                        labels.append(str(day.strftime("%a")))
                # Add Yesterday and Today as labels

                labels.append("Yesterday")
                labels.append("Today")


                # For 7 days
                for i in range(len(membersKeys)):
                    memberData = []
                    series.append(membersKeys[i].get().first_name)
                    for j in range(7):
                        day = dateBefore7Days + datetime.timedelta(days=j)
                        memberData.append(models.get_all_task_events_count_for_member_for_date(membersKeys[i],day))

                    data.append(memberData)


                response["chart2"]= {
                    "data": data,
                    "labels" : labels,
                    "series": series
                }

                # Chart 3 - Overall task distribution


                # Array of Arrays with each data point
                data = []
                # Array of Tasks
                labels = []
                # Array of member Names
                series = []

                # Get the household key
                houseKey = models.get_household_key_for_current_user()

                #Get all members
                taskKeys = models.get_all_tasks_for_household(houseKey)


                for taskKey in taskKeys:
                    labels.append(taskKey.get().name)

                # For 7 days
                for i in range(len(membersKeys)):

                    memberData = []
                    series.append(membersKeys[i].get().first_name)
                    for taskKey in taskKeys:
                        memberData.append(models.get_all_task_events_count_for_task_and_member(taskKey, membersKeys[i]))

                    data.append(memberData)


                response["chart3"]= {
                    "data": data,
                    "labels" : labels,
                    "series": series
                }

                self.response.out.write(json.dumps(response))

            elif charttype == "userchart":

                if not 'userid' in self.request.GET.keys():
                    #TODO return an error
                    self.response.out.write("ERROR: userid must be present")
                    pass
                else:
                    memberKey = models.get_member_key(self.request.GET['userid'])
                    # Get the household key
                    houseKey = models.get_household_key_for_current_user()

                    #Get all members
                    taskKeys = models.get_all_tasks_for_household(houseKey)

                    response = {}
                    taskEventsPerTask = []

                    for taskKey in taskKeys:
                        numOfTasks = models.get_all_task_events_count_for_task_and_member(taskKey, memberKey)
                        if numOfTasks > 0:
                            element = {
                                'name': taskKey.get().name ,
                                'value': numOfTasks
                            }
                            taskEventsPerTask.append(element)


                    response['taskeventspertask'] = taskEventsPerTask


                    response['feedbackevents'] = models.get_all_positive_negative_labels_for_member(memberKey, taskKeys)

                    self.response.out.write(json.dumps(response))

            elif charttype == "tilechart":
                if not 'taskid' in self.request.GET.keys():

                    #TODO return an error
                    self.response.out.write("ERROR: taskid must be present")
                    pass
                else:
                    taskKey = models.get_task_key(self.request.GET['taskid'])
                    # Get the household key
                    houseKey = models.get_household_key_for_current_user()

                    #Get all members
                    membersKeys = models.get_all_members_for_household(houseKey)
                    response = {}

                    # Array of data points
                    data = []
                    # Array of Member names
                    labels = []

                    for i in range(len(membersKeys)):
                        labels.append(membersKeys[i].get().first_name)
                        data.append(models.get_all_task_events_count_for_task_and_member(taskKey, membersKeys[i]))

                    response["chart1"]= {
                        "data": data,
                        "labels" : labels
                    }


                    self.response.out.write(json.dumps(response))


        except Exception as e:
            # TODO: Return errors.
            # THIS IS ERROR. The chartype must be specified !!!! But for now just send it like that
            print(e)
            # self.response.out.write("""{"house_name":"House 22","pie_elements":[{"name":"Norbert Naskov","value":10},{"name":"Ivan Naskov","value":3},{"name":"Pesho Naskov","value":18},{"name":"Adam Naskov","value":7}]}""")


class PopulateHandler(webapp2.RequestHandler):

    def get(self):

        models.populate_default_values(models.get_household_key_for_current_user())
        delegator.delegate_task_loop()

        # Send an event to everyone that table was repopulated
        update_json = {}
        update_json['eventType'] = 'populatedEvent'
        member = models.get_member_key().get()
        update_json['doneBy'] = member.first_name + " " + member.last_name
        update_data = json.dumps(update_json)
        publisher.update_clients(models.get_members_list(), update_data)

        self.response.out.write("All the data has been populated. <br> NOTE: If you open this URL again, it will be added again.")
        # JSON object containing info variable called redirect whose values is where
        # we are going to redirect the person


class TokenHandler(webapp2.RequestHandler):

    def get(self):
        user_id = models.get_member_id()
        if user_id:
            user = models.get_member_key(user_id).get()
            token = channel.create_channel(user_id, 1440)
            user.channel_token = token
            user.put()
            obj = {
                'token' : token
            }
            self.response.out.write(json.dumps(obj))

class AvatarHandler(webapp2.RequestHandler):
    def get(self, user_id=None):
        user = models.get_member_key(user_id).get()
        self.response.headers['Content-Type'] = 'image/png'
        #user.avatar is sometimes string and this breaks the avatar for users who havent uploaded an image
        if user.avatar:
            self.response.out.write(user.avatar)
        else:
            default_picture = open('app/blank-picture.jpg', 'rb').read()
            self.response.out.write(default_picture)

class TaskOrderHandler(webapp2.RequestHandler):
    """
    This handler handles the changes with the task order.
    It receives oldorder (index) and neworder (index) which represent the current (old) order of the task and the new one
    """
    def put(self):

        json_data = json.loads(self.request.body)

        newOrder = json_data['newOrder']
        oldOrder = json_data['oldOrder']


        # This is swap
        # oldOrderTask = models.Task.query(models.Task.order == oldOrder).fetch()[0]
        # oldOrderTask.order = newOrder
        #
        # newOrderTask = models.Task.query(models.Task.order == newOrder).fetch()[0]
        # newOrderTask.order = oldOrder
        #
        # oldOrderTask.put()
        # newOrderTask.put()

        # If the new order (index) is bigger, this means that the task was moved down the list.
        # Hence, all the tasks in between must have their order decreased by 1

        oldOrderTask = models.Task.query(models.Task.order == oldOrder).fetch()[0]

        if newOrder > oldOrder:
            q = models.Task.query(models.Task.order > oldOrder, models.Task.order <= newOrder)
            tasks = q.fetch()
            for task in tasks:
                task.order -= 1
                task.put()



        # Else the new order (index) is smaller, this means that the task was moved up the list.
        # Hence, all the tasks in between must have their order increased by 1
        else:
            q = models.Task.query(models.Task.order >= newOrder, models.Task.order < oldOrder)
            tasks = q.fetch()
            for task in tasks:
                task.order += 1
                task.put()

        oldOrderTask.order = newOrder
        oldOrderTask.put()

        update_json = {}
        update_json['eventType'] = 'orderChangedEvent'
        update_json['taskChangedName'] = oldOrderTask.name
        member = models.get_member_key().get()
        update_json['doneBy'] = member.first_name + " " + member.last_name

        update_data = json.dumps(update_json)
        publisher.update_clients(models.get_members_list(), update_data)
        self.response.out.write(oldOrderTask.name + ": last order " + str(oldOrder) + "   new order:" + str(newOrder))


app = webapp2.WSGIApplication([
    (r'/requests/house/?', HouseHandler),
    (r'/requests/house/check/(\w+)/?', HouseNamesHandler),
    (r'/requests/task/?', TaskHandler),
    (r'/requests/task/(\d+)/?', TaskHandler),
    (r'/requests/task/(\d+)/taskevent/?', TaskEventHandler),
    (r'/requests/taskorder/?', TaskOrderHandler),
    (r'/requests/member/?', MemberHandler),
    (r'/requests/analysis/?', AnalysisHandler),
    (r'/requests/populate/?', PopulateHandler),
    (r'/requests/token/?', TokenHandler),
    (r'/requests/avatar/(\d+)/?', AvatarHandler),
    (r'/requests/avatar/?', AvatarHandler),

], debug=True)