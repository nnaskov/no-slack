import webapp2
import json
import jsons
import models
from google.appengine.api import users

class HouseNamesHandler(webapp2.RequestHandler):

    def get(self):
        housename_req = self.request.get('houseName')

        house_exists = models.household_exists(housename_req.lower())

        self.response.headers['Content-Type'] = 'application/json'

        obj = {
            'exists': house_exists

        }

        self.response.out.write(json.dumps(obj))


class TaskHandler(webapp2.RequestHandler):

    def get(self):
        tasks_list = models.get_household_tasks()
        task_list_json = jsons.get_all_tasks_json(tasks_list)
        json_data = json.dumps(task_list_json)
        self.response.out.write(json_data)


class AddTaskHandler(webapp2.RequestHandler):
    '''
    AddTaskHandler adds a Task to data store and returns all the tasks that a house
    has in JSON format.
    '''

    def post(self):
        task_name = self.request.get("taskName")
        frequency = self.request.get("frequency")
        style = self.request.get("taskStyle")

        models.add_task(task_name, frequency, style)

        tasks_list = models.get_household_tasks()
        task_list_json = jsons.get_all_tasks_json(tasks_list)
        json_data = json.dumps(task_list_json)
        self.response.out.write(json_data)


class DeleteTaskHandler(webapp2.RequestHandler):
    '''
    DeleteTaskHandler get tasksId sent from front end and deletes this task from the data store.
    Returns a JSON containing all of the Tasks a house has associated with it (minus the deleted
    task
    '''

    def delete(self):
        task_id = self.request.get("taskId")
        models.delete_task(task_id)

        tasks_list = models.get_household_tasks()
        task_list_json = jsons.get_all_tasks_json(tasks_list)
        json_data = json.dumps(task_list_json)
        self.response.out.write(json_data)


class TaskEventHandler(webapp2.RequestHandler):
    '''
    The is the handler called when a user has done a Task. The taskId is sent via JSON and the datastore
    is updated to reflect that the task is done. A JSON containing the updated version / info of the task
    that has been done is sent back via JSON.
    '''

    def post(self):
        json_data = json.loads(self.request.body)
        task_id = json_data.get("taskID")
        models.add_task_event(task_id)
        task = models.get_task(task_id)

        obj = jsons.get_task_json(task)

        json_data = json.dumps(obj)
        self.response.out.write(json_data)


class GetTaskEventsHandler(webapp2.RequestHandler):

    def get(self):
        json_data = json.loads(self.request.body)
        task_id = json_data.get("taskID")
        datastore_events_list = models.get_task_events(task_id)
        datastore_events = jsons.get_all_events_json(datastore_events_list)
        json_data = json.dumps(datastore_events)
        self.response.out.write(json_data)


class TaskFeedbackHandler(webapp2.RequestHandler):
    '''
    This is called when a user gives a Task positive or negative feedback. Updated in model and
    returns the updated version of the Task JSON
    '''

    def post(self):
        json_data = json.loads(self.request.body)
        task_id = json_data.get("taskID")
        was_positive = json_data.get("goodJob")

        models.update_task_event_feedback(task_id, was_positive)
        task = models.get_task(task_id)

        obj = jsons.get_task_json(task)

        json_data = json.dumps(obj)
        self.response.out.write(json_data)


app = webapp2.WSGIApplication([
    ('/requests/checkhousename', HouseNamesHandler),
    ('/requests/getalltasks', TaskHandler),
    ('/requests/addtask', AddTaskHandler),
    ('/requests/deletetask', DeleteTaskHandler),
    ('/requests/taskevent/add', TaskEventHandler),
    ('/requests/taskevent/getAllForTask', GetTaskEventsHandler),
    ('/requests/tasks/feedback', TaskFeedbackHandler)
], debug=True)