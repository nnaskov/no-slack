from google.appengine.api import users
from google.appengine.ext import ndb

class HouseHold(ndb.Model):
	name = ndb.StringProperty(required=True)
	owner = ndb.StructuredProperty(Member, required=True)
	members = ndb.StructuredProperty(Member, repeated=True)

class Member(ndb.Model):
	user = ndb.UserProperty(auto_current_user_add=True)


class Task(ndb.Model):
	name = ndb.TextProperty()
	date_created = ndb.DateTimeProperty(auto_now_add=True)
	date_modified = ndb.DateTimeProperty(auto_now=True)
	completed = ndb.BooleanProperty(default=False)
	user_who_added = ndb.StructuredProperty(Member)
	user_modified = ndb.StructuredProperty(Member)
	positive_feedback = ndb.IntegerProperty(default=0)
	negative_feedback = ndb.IntegerProperty(default=0)
