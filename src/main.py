import webapp2
from google.appengine.api import users


class MainAppHandler(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()

        if user:
            self.response.out.write("Somebody is logged in!")
            print("hello")
        else:
            self.response.out.write("Nobody is logged in!")
            print("goodbye")


app = webapp2.WSGIApplication([
    ('/app/', MainAppHandler),
], debug=True)


