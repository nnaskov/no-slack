__author__ = 'dominicsmith'

import webapp2
import json
import models
import delegator
from google.appengine.api import users

class RegisterHandler(webapp2.RequestHandler):

    def get(self):
        user = users.get_current_user()
        if user:
            if models.get_users_accounts():
                self.redirect('/')

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
        avatar = self.request.get('avatar')

        # Ensure first names and last names start with a capital letter
        first_name = first_name[0].upper()+first_name[1:]
        last_name = last_name[0].upper()+last_name[1:]

        models.register_user(first_name, last_name, house_name, avatar, needs_default_items=True)

        delegator.delegate_task_loop()

        self.response.headers['Content-Type'] = 'application/json'

        obj = {
            'redirect': '/'
        }

        self.response.out.write(json.dumps(obj))

        # JSON object containing info variable called redirect whose values is where
        # we are going to redirect the person



app = webapp2.WSGIApplication([
    (r'/register/?', RegisterHandler),


], debug=True)
