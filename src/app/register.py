__author__ = 'dominicsmith'

import webapp2
import json
from app import models

class RegisterHandler(webapp2.RequestHandler):

    def get(self):
        REGISTRATION_HTML = open('./templates/register.html').read()
        self.response.out.write(REGISTRATION_HTML)

    def post(self):
        json_data = json.loads(self.request.body)
        first_name = json_data.get('firstName')
        last_name = json_data.get('lastName')
        house_name = json_data.get('houseName')

        models.register_user(first_name, last_name, house_name)

        self.response.headers['Content-Type'] = 'application/json'

        obj = {
            'redirect': '/app/'
        }

        self.response.out.write(json.dumps(obj))

        # JSON object containing info variable called redirect whose values is where
        # we are going to redirect the person


app = webapp2.WSGIApplication([
    (r'/register/?', RegisterHandler),
], debug=True)
