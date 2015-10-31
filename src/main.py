import webapp2
from app import models
from google.appengine.api import users


class HomePageHandler(webapp2.RequestHandler):
    def get(self):
        INDEX_HTML = open('./templates/index.html').read()
        self.response.out.write(INDEX_HTML)


class MainAppHandler(webapp2.RequestHandler):
    def get(self):
        DASHBOARD_HTML = open('./templates/dashboard.html').read()
        self.response.out.write(DASHBOARD_HTML)

class HouseHandler(webapp2.RequestHandler):
    def get(self):
        HOUSE_HTML = open('./templates/house.html').read()
        self.response.out.write(HOUSE_HTML)

class UnitTestsHandler(webapp2.RequestHandler):
    """
     This class is used for visually showing the results of the unittests.
     To use it open:
     http://localhost:8080/tests
     http://no-slack.appspot.com/tests
    """
    from app.unittests.test_models import DatastoreTestCase

    # List of all unittest.TestCase classes to be run
    unitTestClasses = [DatastoreTestCase]

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
    (r'/app/?', MainAppHandler),
    (r'/house/?', HouseHandler),
    (r'/tests/?', UnitTestsHandler)
], debug=True)
