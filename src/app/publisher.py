from google.appengine.api import channel

def update_clients(user_id, user_list, json):
    for user in user_list:
        id = user.key.id()
        if id != user_id:
            channel.send_message(id, json)