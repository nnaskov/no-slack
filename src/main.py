import webapp2
import jinja2
import os
from app import models
from google.appengine.api import users
from google.appengine.api import channel

JINJA_ENVIRONMENT = jinja2.Environment(
   loader=jinja2.FileSystemLoader(os.path.dirname('./templates/')),
   extensions=['jinja2.ext.autoescape'],
   autoescape=True)


class HomePageHandler(webapp2.RequestHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            user_model = models.get_users_accounts()
            if user_model:
                template_values = {
                    'token' : user_model.channel_token,
                    'userId' : models.get_member_id(),
                    'logout' : users.create_logout_url('/')
                }
                template = JINJA_ENVIRONMENT.get_template('dashboard.html')
                self.response.out.write(template.render(template_values))

            else:
                login_url = users.create_login_url(self.request.url)

                template_values = {
                    'login_url' : login_url
                }

                template = JINJA_ENVIRONMENT.get_template('index.html')
                self.response.write(template.render(template_values))

        else:
            login_url = users.create_login_url(self.request.url)

            template_values = {
                'login_url' : login_url
            }

            template = JINJA_ENVIRONMENT.get_template('index.html')
            self.response.write(template.render(template_values))


class IndexHandler(webapp2.RequestHandler):
    def get(self):
        INDEX_HTML = open('./templates/index.html').read()
        self.response.out.write(INDEX_HTML)


app = webapp2.WSGIApplication([
    ('/', HomePageHandler),
    (r'/index/?', IndexHandler),
], debug=True)
