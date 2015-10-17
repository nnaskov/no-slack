import webapp2
import json
import models
from google.appengine.api import users

class HouseNamesHandler(webapp2.RequestHandler):

    def get(self):
        housename_req = self.request.get('houseName')

        house_exists = models.household_exists(housename_req)

        self.response.headers['Content-Type'] = 'application/json'
        obj = {
            'exists': house_exists

        }

        self.response.out.write(json.dumps(obj))

class TaskHandler(webapp2.RequestHandler):

    def get(self):
        complete_tasks_iter = models.get_completed_household_tasks()

        completed_tasks = []

        for task in complete_tasks_iter:
            task_dict = {}
            task_dict["taskname"] = task.name
            task_dict["dateCreated"] = task.date_created
            task_dict["dateModified"] = task.date_modified
            task_dict["completed"] = task.completed
            task_dict["userWhoAddedFirstName"] = task.user_who_added.first_name
            task_dict["userWhoAddedLastName"] = task.user_who_added.last_name
            task_dict["positiveFeedback"] = task.positive_feedback
            task_dict["negativeFeedback"] = task.negative_feedback

            completed_tasks.append(task_dict)

        json_data = json.dumps(completed_tasks)
        self.response.out.write(json_data)

















app = webapp2.WSGIApplication([
    ('/requests/checkhousename', HouseNamesHandler,
     '/requests/alltasks', TaskHandler),
], debug=True)