from google.appengine.ext import ndb
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


def get_member(user_id=None):
    if not user_id:
        user = users.get_current_user()
        if not user:
            return None
        user_id = user.user_id()

    key = ndb.Key('Member', user_id)
    member = key.get()

    return member

def add_member():
    user = users.get_current_user()
    if not user:
        return None
    user_id = user.user_id()

    member = Member(id=user_id, user=user)
    member.put()

