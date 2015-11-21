from google.appengine.api import users
from google.appengine.api import channel


def update_clients(user_list, json):
    sender_id = users.get_current_user().user_id()
    for user in user_list:
        user_id = user.key.id()
        if user_id != sender_id:
            channel.send_message(user_id, json)
