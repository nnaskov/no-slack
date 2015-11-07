import unittest
from app import jsons
from google.appengine.ext import ndb

import mock


class TaskTestModel(ndb.Model):
    household = ndb.KeyProperty()
    name = ndb.TextProperty("Washing Up")
    description = ndb.TextProperty("Cleaning those dirty unit tests!")
    date_created = ndb.DateTimeProperty(auto_now=True)
    date_modified = ndb.DateTimeProperty(auto_now=True)
    user_who_added = ndb.KeyProperty()
    frequency = ndb.IntegerProperty()
    most_recent = ndb.KeyProperty()
    style = ndb.TextProperty("glpyh")

class JSONSTestCase(unittest.TestCase):


    def test_task_json(self):
        task = TaskTestModel()
        task.frequency = 5
        task.key.integer.id = 5050505
        task_dict = jsons.get_task_json(task)

        self.assertEquals(type(task_dict), dict)


if __name__ == '__main__':
    unittest.main()