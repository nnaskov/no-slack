import webapp2
import json
import jsons
import models


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

        tasks_list = models.get_household_tasks()
        task_list_json = jsons.get_all_tasks_json(tasks_list)
        json_data = json.dumps(task_list_json)
        self.response.out.write(json_data)


    def post(self):
        task_name = self.request.get("taskName")
        frequency = self.request.get("frequency")
        style = self.request.get("taskStyle")

        models.add_task(task_name, frequency, style)

        tasks_list = models.get_household_tasks()
        task_list_json = jsons.get_all_tasks_json(tasks_list)
        json_data = json.dumps(task_list_json)
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
        models.add_task_event(task_id)
        task = models.get_task(task_id)

        obj = jsons.get_task_json(task)

        json_data = json.dumps(obj)
        self.response.out.write(json_data)

    def get(self, task_id):
        datastore_events_list = models.get_task_events(int(task_id))
        datastore_events = jsons.get_all_events_json(datastore_events_list)
        json_data = json.dumps(datastore_events)
        self.response.out.write(json_data)

    def put(self, task_id):
        json_data = json.loads(self.request.body)
        was_positive = json_data.get("goodJob")

        models.update_task_event_feedback(task_id, was_positive)
        task = models.get_task(task_id)

        obj = jsons.get_task_json(task)

        json_data = json.dumps(obj)
        self.response.out.write(json_data)



app = webapp2.WSGIApplication([
    (r'/requests/house/check/[\w]+', HouseNamesHandler),
    ('/requests/task/', TaskHandler),
    (r'/requests/task/[\d]+/taskevent/', TaskEventHandler),
], debug=True)