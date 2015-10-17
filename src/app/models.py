from google.appengine.ext import ndb
from google.appengine.ext import db
from google.appengine.api import users

class Member(ndb.Model):
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    household = ndb.KeyProperty()


class HouseHold(ndb.Model):
    name = ndb.StringProperty(required=True)
    owner = ndb.KeyProperty()


class Task(ndb.Model):
    household = ndb.KeyProperty(required=True)
    name = ndb.TextProperty(required=True)
    date_created = ndb.DateTimeProperty(auto_now_add=True)
    date_modified = ndb.DateTimeProperty(auto_now=True)
    user_who_added = ndb.KeyProperty(required=True)
    frequency = ndb.IntegerProperty(required=True)
    most_recent = ndb.KeyProperty()

class TaskEvent(ndb.Model):
    task_type = ndb.KeyProperty()
    date_completed = ndb.DateTimeProperty(auto_now_add=True)
    completed_by = ndb.KeyProperty(Member)
    positive_feedback = ndb.IntegerProperty(default=0)
    negative_feedback = ndb.IntegerProperty(default=0)

def household_exists(house_name):
    True if get_house(house_name) else False


def add_default_tasks(house_key):
    add_task2(house_key, "Washing up", 2)
    add_task2(house_key, "Hoover lounge", 10)


def get_member(user_id=None):
    if not user_id:
        user = users.get_current_user()
        if not user:
            return None
        user_id = user.user_id()

    key = ndb.Key('Member', user_id)

    return key

def get_member_household_key():
    return get_member().get().household


def get_household_tasks():
    household = get_member_household_key()
    q = Task.query(Task.household == household)
    return q.fetch(limit=100)

def add_task2(house_key, task_name, frequency=None):
    new_task = Task(name=task_name, frequency=frequency, household=house_key, user_who_added=get_member())
    new_task.put()

def add_task(task_name, frequency=None):
    add_task2(get_member_household_key(), task_name, frequency)

def add_task_event(task_type):
    completed_by = get_member()
    new_task_event = TaskEvent(task_type=task_type, completed_by=completed_by)
    new_task_event.put()


def add_member(first_name, last_name):
    user = users.get_current_user()
    if not user:
        return None
    user_id = user.user_id()

    member = Member(id=user_id, first_name=first_name, last_name=last_name)
    key = member.put()

    return key.get()

def add_household(household_id):
    owner = get_member()
    new_household = HouseHold(name=household_id, owner=owner)
    new_household.put()
    add_default_tasks(new_household.key) #SHOULD BE MOVED WHEN IN PROD
    return new_household

def get_house(house_name):
    q = HouseHold.query(HouseHold.name==house_name)
    house_list = q.fetch(limit=1)
    if len(house_list):
        return house_list[0]
    else:
        return None

def register_user(first_name, last_name, house_name):
    user = add_member(first_name, last_name)

    if not household_exists(house_name):
        house = add_household(house_name)
    else:
        house = get_house(house_name)

    user.household = house.key
    user.put()
