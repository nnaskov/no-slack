import webapp2
import json
import models
from google.appengine.api import users

class HouseNamesHandler(webapp2.RequestHandler):

    def get(self):
        housename_req = self.request.get('houseName')

        house_exists = models.household_exists(housename_req)

        self.response.headers['Content-Type'] = 'application/json'
        obj = {
            'exists': house_exists

        }

        self.response.out.write(json.dumps(obj))


app = webapp2.WSGIApplication([
    ('/requests/checkhousename', HouseNamesHandler),
], debug=True)