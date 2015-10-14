from google.appengine.ext import ndb
from google.appengine.ext import db
from google.appengine.api import users

class Member(ndb.Model):
    user = ndb.UserProperty(auto_current_user_add=True)
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    household = ndb.KeyProperty()



class HouseHold(ndb.Model):
    name = ndb.StringProperty(required=True)
    owner = ndb.StructuredProperty(Member, required=True)
    members = ndb.StructuredProperty(Member, repeated=True)


class Task(ndb.Model):
    name = ndb.TextProperty(required=True)
    date_created = ndb.DateTimeProperty(auto_now_add=True)
    date_modified = ndb.DateTimeProperty(auto_now=True)
    completed = ndb.BooleanProperty(default=False)
    user_who_added = ndb.StructuredProperty(Member)
    user_modified = ndb.StructuredProperty(Member)
    positive_feedback = ndb.IntegerProperty(default=0)
    negative_feedback = ndb.IntegerProperty(default=0)

def household_exists(household_id=None):
    key = ndb.Key('HouseHold', household_id)
    house_hold = key.get()

    if house_hold:
        return True
    else:
        return False


def get_member(user_id=None):
    if not user_id:
        user = users.get_current_user()
        if not user:
            return None
        user_id = user.user_id()

    key = ndb.Key('Member', user_id)
    member = key.get()

    return member

def add_member(first_name, last_name):
    user = users.get_current_user()
    if not user:
        return None
    user_id = user.user_id()

    member = Member(id=user_id, user=user, first_name=first_name, last_name=last_name)
    member.put()

def add_household(household_id):
    # to do make this actually work

    user = users.get_current_user()
    user_id = user.user_id()

    member = Member(id=user_id, user=user)


    new_household = HouseHold(id=household_id, name=household_id,owner=member)
    new_household.put()

