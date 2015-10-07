import webapp2
import jinja2
import datetime
import os

template_env = jinja2.Environment(loader=jinja2.FileSystemLoader(os.getcwd()))

class MainHandler(webapp2.RequestHandler):
	def get(self):
		current_time = datetime.datetime.now()
		
		template = template_env.get_template('/static/testpage.html')

		context = {
		'current_time': current_time,
		}

		self.response.out.write(template.render(context))

app = webapp2.WSGIApplication([
    ('/', MainHandler)
], debug=True)
