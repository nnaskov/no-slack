import webapp2
from app import models
from google.appengine.api import users


class HomePageHandler(webapp2.RequestHandler):

    def get(self):
        INDEX_HTML = open('./templates/index.html').read()
        self.response.out.write(INDEX_HTML)


class MainAppHandler(webapp2.RequestHandler):

    def get(self):
        models.add_member()
        self.response.out.write("Member added to the data store!")



app = webapp2.WSGIApplication([
    ('/', HomePageHandler),
    ('/app/', MainAppHandler),
], debug=True)


