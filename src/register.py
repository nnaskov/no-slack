__author__ = 'dominicsmith'

import webapp2

class RegisterHandler(webapp2.RequestHandler):

    def get(self):
        REGISTRATION_HTML = open('./templates/register.html').read()
        self.response.out.write(REGISTRATION_HTML)

    def post(self):
        pass
        




app = webapp2.WSGIApplication([
    ('/register/', RegisterHandler),
], debug=True)
