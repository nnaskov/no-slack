__author__ = 'dominicsmith'

import webapp2
import json
from app import models

class RegisterHandler(webapp2.RequestHandler):

    def get(self):
        models.add_household("KitchenerRd")
        REGISTRATION_HTML = open('./templates/register.html').read()
        self.response.out.write(REGISTRATION_HTML)

    def post(self):
        first_name = self.request.get("firstName")
        last_name = self.request.get("lastName")
        house_name = self.request.get("houseName")

        self.response.headers['Content-Type'] = 'application/json'

        obj = {
            'redirect': '/app/'
        }

        self.response.out.write(json.dumps(obj))

        # JSON object containing info variable called redirect whose values is where
        # we are going to redirect the person


app = webapp2.WSGIApplication([
    ('/register/', RegisterHandler),
], debug=True)
