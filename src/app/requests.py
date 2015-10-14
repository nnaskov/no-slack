import webapp2
import json


class HouseNamesHandler(webapp2.RequestHandler):

    def get(self):
        housename_req = self.request.get('houseName')

        #check against database and return true if it exists

        self.response.headers['Content-Type'] = 'application/json'
        obj = {
            'exists': 'true'

        }

        self.response.out.write(json.dumps(obj))

    def post(self):
        self.response.headers['Content-Type'] = 'application/json'
        obj = {
            'exists': 'true'

        }

        self.response.out.write(json.dumps(obj))


app = webapp2.WSGIApplication([
    ('/requests/checkhousename', HouseNamesHandler),
], debug=True)