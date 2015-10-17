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

            datastore_tasks.append(task_dict)

        json_data = json.dumps(datastore_tasks)
        self.response.out.write(json_data)

class TaskEventHandler(webapp2.RequestHandler):

    def get(self):
        event_id = self.request.get("taskEventID")




app = webapp2.WSGIApplication([
    ('/requests/checkhousename', HouseNamesHandler),
    ('/requests/getalltasks', TaskHandler),
    ('requests/taskevent', TaskEventHandler),
], debug=True)