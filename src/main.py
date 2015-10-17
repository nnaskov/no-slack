import webapp2
from app import models
from google.appengine.api import users


class HomePageHandler(webapp2.RequestHandler):

    def get(self):
        INDEX_HTML = open('./templates/index.html').read()
        self.response.out.write(INDEX_HTML)


class MainAppHandler(webapp2.RequestHandler):

    def get(self):
        self.response.out.write("This is the app page!")


app = webapp2.WSGIApplication([
    ('/', HomePageHandler),
    (r'/app/?', MainAppHandler),
], debug=True)


