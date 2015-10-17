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
    members = ndb.StructuredProperty(Member, repeated=True)


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

def household_exists(household_id=None):
    key = ndb.Key('HouseHold', household_id)
    house_hold = key.get()

    if house_hold:
        return True
    else:
        return False

def add_default_tasks():
    add_task("Washing up", frequency=2)
    add_task("Hoover lounge", frequency=10)

def setup_house(member_key, house_name):
    member = member_key.get()
    member.household = ndb.Key('HouseHold', house_name)
    member.put()
    household = HouseHold.get_by_id(house_name)
    household.owner = member_key
    household.members.append(member)
    household.put()

    add_default_tasks()


def get_member(user_id=None):
    if not user_id:
        user = users.get_current_user()
        if not user:
            return None
        user_id = user.user_id()

    key = ndb.Key('Member', user_id)
    member = key.get()

    return member

def get_member_household_key():
    return get_member().household


def get_household_tasks():
    household = get_member_household_key()
    q = Task.query(Task.household == household)
    return q.fetch(limit=100)

def add_task(task_name, frequency=None):
    household = get_member_household_key()
    new_task = Task(name=task_name, frequency=frequency, household=household, user_who_added=get_member().key)
    new_task.put()

def add_task_event(task_type):
    completed_by = ndb.Key('Member', users.get_current_user().user_id())
    new_task_event = TaskEvent(task_type=task_type, completed_by=completed_by)
    new_task_event.put()


def add_member(first_name, last_name):
    user = users.get_current_user()
    if not user:
        return None
    user_id = user.user_id()

    member = Member(id=user_id, first_name=first_name, last_name=last_name)
    key = member.put()

    return key

def add_household(household_id):

    new_household = HouseHold(id=household_id, name=household_id)
    new_household.put()
    return new_household





