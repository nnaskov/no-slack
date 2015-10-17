__author__ = 'dominicsmith'

import webapp2
import json
from app import models

class RegisterHandler(webapp2.RequestHandler):

    def get(self):
        REGISTRATION_HTML = open('./templates/register.html').read()
        self.response.out.write(REGISTRATION_HTML)

    def post(self):
        debug = self.request
        json_data = json.loads(self.request.body)
        first_name = json_data.get('firstName')
        last_name = json_data.get('lastName')
        house_name = json_data.get('houseName')

        member_key = models.add_member(first_name, last_name)

        if not models.household_exists(house_name):
            models.add_household(house_name)

        models.setup_house(member_key, house_name)


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
