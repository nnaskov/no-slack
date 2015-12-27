from google.appengine.api import users
from google.appengine.api import channel
import logging


def update_clients(user_list, json, sender_key=None):
    if not sender_key:
        sender_id = users.get_current_user().user_id()
    else:
        sender_id = sender_key.id()

    for user in user_list:
        user_id = user.key.id()
        if user_id != sender_id:
            channel.send_message(user_id, json)
