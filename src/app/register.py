__author__ = 'dominicsmith'

import webapp2
import json
from app import models
from google.appengine.api import users

class RegisterHandler(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()
        if user:
            if models.get_users_accounts():
                DASHBOARD_HTML = open('./templates/dashboard.html').read()
                self.response.out.write(DASHBOARD_HTML)

            else:
                REGISTRATION_HTML = open('./templates/register.html').read()
                self.response.out.write(REGISTRATION_HTML)

        else:
            login_url = users.create_login_url(self.request.url)
            self.redirect(login_url)

    def post(self):
        json_data = json.loads(self.request.body)
        first_name = json_data.get('firstName')
        last_name = json_data.get('lastName')
        house_name = json_data.get('houseName').lower()

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
