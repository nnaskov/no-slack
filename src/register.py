__author__ = 'dominicsmith'

import webapp2
import os
from app import models
from google.appengine.api import users


class RegisterHandler(webapp2.RequestHandler):

    def get(self):
        REGISTRATION_HTML = open('./templates/register.html').read()
        self.response.out.write(REGISTRATION_HTML)




app = webapp2.WSGIApplication([
    ('/register/', RegisterHandler),
], debug=True)
