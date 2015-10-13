import webapp2
from app import models
from google.appengine.api import users


class MainAppHandler(webapp2.RequestHandler):

    def get(self):
        models.add_member()
        self.response.out.write("Member added to the data store!")



app = webapp2.WSGIApplication([
    ('/app/', MainAppHandler),
], debug=True)


