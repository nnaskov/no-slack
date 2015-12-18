'''
These are a set of helper functions. When returning a JSON of a Task ALWAYS use get_task_json
as it ensures the JSONS being sent to the front end have consistency. By doing it this way if
we want to add a new field to send back to Front end we can add it here and the change is seen
throughout the code.
'''

import models
import strings

def get_task_json(task):

    task_dict = {}
    task_dict[strings.taskID] = task.key.integer_id()
    task_dict[strings.taskName] = task.name
    task_dict[strings.description] = task.description
    task_dict[strings.dateModified] = str(task.date_modified)
    task_dict[strings.frequency] = task.frequency
    task_dict[strings.taskStyle] = task.style
    task_dict[strings.everCompleted] = False
    task_dict[strings.assigned] = False

    if task.assigned:
        task_dict[strings.assignedInitials] = task.get_delagated_initials()

    if task.assigned == models.get_member_key():
        task_dict[strings.assigned] = True

    if task.most_recent_event:
        task_dict[strings.everCompleted] = True
        most_recent_event = task.most_recent_event.get()
        task_dict[strings.positiveFeedback] = most_recent_event.positive_feedback
        task_dict[strings.negativeFeedback] = most_recent_event.negative_feedback
        user_feedback = most_recent_event.get_user_feedback()
        if len(user_feedback):
            task_dict[strings.userFeedback] = user_feedback[0].was_positive
        else:
            task_dict[strings.userFeedback] = None

    return task_dict


def get_all_tasks_json(tasks_list):

    datastore_tasks = []

    for task in tasks_list:
        task_dict = get_task_json(task)
        datastore_tasks.append(task_dict)

    return datastore_tasks


def get_event_json(event):
    """
    Get the JSON for a single Event
    :param event:
    :return: json params: name, date, positiveFeedback, negativeFeedback
    """
    event_dict = {}
    event_dict[strings.name] = event.completed_by.get().first_name
    event_dict[strings.date] = str(event.date_completed)
    event_dict[strings.positiveFeedback] = event.positive_feedback
    event_dict[strings.negativeFeedback] = event.negative_feedback
    return event_dict

def get_all_events_json(events_list):

    datastore_events = []

    for event in events_list:
        event_dict = get_event_json(event)
        datastore_events.append(event_dict)

    return datastore_events

def get_member_json(member):
    """
    :return: Params: usedID, firstName, lastName, isOwner.
    """
    member_dict = {}
    member_dict[strings.userID] = member.key.id()
    member_dict[strings.firstName] = member.first_name
    member_dict[strings.lastName] = member.last_name
    member_dict[strings.isOwner] = member.is_owner()
    return member_dict


def get_all_members_json(members_list):
    """

    :param members_list:
    :return:
    """
    all_members = []

    for member in members_list:
        member_dict = get_member_json(member)
        all_members.append(member_dict)

    return all_members


def get_house_json():
    """
    :return: Params:
    """
    house_dict = {}
    users_dict = {}
    house = models.get_household_key_for_current_user().get()
    house_dict['name'] = house.name
    members = models.get_members_list()
    for member in members:
        user_dict = {}
        user_dict['firstName'] = member.first_name
        user_dict['lastName'] = member.last_name
        is_owner = member.key.id() == house.owner.id()
        user_dict['isOwner'] = is_owner
        if is_owner:
            user_dict['notificationsOn'] = member.notifications_on
        user_dict['initials'] = (member.first_name[0] + member.last_name[0]).upper()
        users_dict[member.key.id()] = user_dict
    house_dict['users'] = users_dict
    return house_dict
