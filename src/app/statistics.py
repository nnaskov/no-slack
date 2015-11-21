from google.appengine.ext import ndb
from app import models
from app.models import TaskEvent


def get_tasks_done_by_user(user_id):
    member_key = ndb.Key('Member', user_id)
    q = TaskEvent.query(TaskEvent.completed_by == member_key)
    return q.fetch(limit=100)

def get_tasks_of_type(task_id):
    members_list = models.get_members_list()
    task = models.get_task(task_id)


    for member in members_list:
        count = TaskEvent.query(ndb.AND(TaskEvent.task_type == task.key))



    q = TaskEvent.query(TaskEvent.task_type == task.key)
    return q.fetch(limit=100)








