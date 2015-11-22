import webapp2
import json
import jsons
import models
import publisher


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
    def get(self):
        tasks_list = models.get_household_tasks()
        task_list_json = jsons.get_all_tasks_json(tasks_list)
        json_data = json.dumps(task_list_json)
        self.response.out.write(json_data)

    def delete(self):
        task_id = self.request.get("taskId")
        models.delete_task(task_id)

        obj = {
            'taskId': task_id
        }
        update_json = {}
        update_json['eventType'] = 'deleteTask'
        update_json['taskId'] = task_id
        json_data = json.dumps(obj)
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
        models.add_task_event(task_id)
        task = models.get_task(task_id)

        obj = jsons.get_task_json(task)

        update_json = {}
        update_json['eventType'] = 'taskEvent'
        update_json['taskId'] = task_id
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
        task = models.get_task(task_id)

        obj = jsons.get_task_json(task)

        update_json = {}
        update_json['eventType'] = 'taskFeedback'
        update_json['taskId'] = task_id
        update_json['positive'] = task_event.positive_feedback
        update_json['negative'] = task_event.negative_feedback
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
                self.response.out.write("""{"house_name":"House 22","pie_elemnts":[{"name":"Norbert Naskov","value":10},{"name":"Ivan Naskov","value":3},{"name":"Pesho Naskov","value":18},{"name":"Adam Naskov","value":7}]}""")
            elif charttype == "userchart":
                self.response.out.write("""{"pie_elemnts":[{"name":"Washing up","value":10},{"name":"Cleaning","value":3},{"name":"Hoovering","value":18},{"name":"Gardening","value":7}]}""");
            elif charttype == "thumbschart":
                self.response.out.write("""{"pie_elemnts":[{"name":"thumbs_up","value":4},{"name":"thumbs_down","value":1}]}""");
            elif charttype == "taskchart":
                self.response.out.write("""{"pie_elemnts":[{"name":"Norbert Naskov","value":4},{"name":"Ivan Naskov","value":1},{"name":"Pesho Naskov","value":2},{"name":"Adam Naskov","value":6}]}""");

        except:
            # THIS IS ERROR. The chartype must be specified !!!! But for now just send it like that
            self.response.out.write("""{"house_name":"House 22","pie_elemnts":[{"name":"Norbert Naskov","value":10},{"name":"Ivan Naskov","value":3},{"name":"Pesho Naskov","value":18},{"name":"Adam Naskov","value":7}]}""")


class PopulateHandler(webapp2.RequestHandler):

    def get(self):

        models.populate_default_values(models.get_household_key_for_current_user())
        self.response.out.write("All the data has been populated. <br> NOTE: If you open this URL again, it will be added again.")
        # JSON object containing info variable called redirect whose values is where
        # we are going to redirect the person


app = webapp2.WSGIApplication([
    (r'/requests/house/check/(\w+)/?', HouseNamesHandler),
    ('/requests/task/?', TaskHandler),
    (r'/requests/task/(\d+)/taskevent/?', TaskEventHandler),
    (r'/requests/member/?', MemberHandler),
    (r'/requests/analysis/?', AnalysisHandler),
    (r'/requests/populate/?', PopulateHandler),

], debug=True)