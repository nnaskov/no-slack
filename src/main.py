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
               template = JINJA_ENVIRONMENT.get_template('dashboard.html')
               self.response.out.write(template.render())

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


class UnitTestsHandler(webapp2.RequestHandler):
    """
     This class is used for visually showing the results of the unittests.
     To use it open:
     http://localhost:8080/tests
     http://no-slack.appspot.com/tests
    """
    from app.unittests.test_models import BlankDatastoreTestCase, LocalDatastoreTesetCase
    from app.unittests.jsons_test import JSONSTestCase

    # List of all unittest.TestCase classes to be run
    unitTestClasses = [BlankDatastoreTestCase, LocalDatastoreTesetCase, JSONSTestCase]

    def get(self):
        import app.external.HTMLTestRunner as HTMLTestRunner
        import unittest

        # Creating HTMLTest Runner
        runner = HTMLTestRunner.HTMLTestRunner(
            stream=self.response,
            title='No-Slack Unit Test',
            description='All unit tests in the app.'
        )

        # creating a new test suite
        newSuite = unittest.TestSuite()

        for testCase in self.unitTestClasses:
            # adding a test case
            newSuite.addTest(unittest.makeSuite(testCase))
        runner.run(newSuite)


app = webapp2.WSGIApplication([
    ('/', HomePageHandler),
    (r'/index/?', IndexHandler),
    (r'/tests/?', UnitTestsHandler)
], debug=True)
