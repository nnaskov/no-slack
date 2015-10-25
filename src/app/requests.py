import webapp2
import json
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
        datastore_tasks_list = models.get_household_tasks()

        datastore_tasks = []

        for task in datastore_tasks_list:
            task_dict = {}
            task_dict["taskID"] = task.key.integer_id()
            task_dict["taskName"] = task.name
            task_dict["dateModified"] = str(task.date_modified)
            task_dict["taskStyle"] = task.style

            datastore_tasks.append(task_dict)

        json_data = json.dumps(datastore_tasks)
        self.response.out.write(json_data)


class AddTaskHandler(webapp2.RequestHandler):

    def post(self):
        task_name = self.request.get("taskName")
        frequency = self.request.get("frequency")
        style = self.request.get("taskStyle")

        models.add_task(task_name, frequency, style)


class DeleteTaskHandler(webapp2.RequestHandler):

    def delete(self):
        task_id = self.request.get("taskId")
        models.delete_task(task_id)


class TaskEventHandler(webapp2.RequestHandler):

    def get(self):
        event_id = self.request.get("taskEventID")


app = webapp2.WSGIApplication([
    ('/requests/checkhousename', HouseNamesHandler),
    ('/requests/getalltasks', TaskHandler),
    ('/requests/addtask', AddTaskHandler),
    ('/requests/deletetask', DeleteTaskHandler),
    ('/requests/taskevent', TaskEventHandler),
], debug=True)