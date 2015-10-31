'''
These are a set of helper functions. When returning a JSON of a Task ALWAYS use get_task_json
as it ensures the JSONS being sent to the front end have consistency. By doing it this way if
we want to add a new field to send back to Front end we can add it here and the change is seen
throughout the code.
'''

def get_task_json(task):

    task_dict = {}
    task_dict["taskID"] = task.key.integer_id()
    task_dict["taskName"] = task.name
    task_dict["description"] = task.description
    task_dict["dateModified"] = str(task.date_modified)
    task_dict["frequency"] = task.frequency
    task_dict["taskStyle"] = task.style
    task_dict["everCompleted"] = False

    if task.most_recent:
        task_dict["everCompleted"] = True
        most_recent = task.most_recent.get()
        task_dict["positiveFeedback"] = most_recent.positive_feedback
        task_dict["negativeFeedback"] = most_recent.negative_feedback
        user_feedback = most_recent.get_user_feedback()
        if len(user_feedback):
            task_dict['userFeedback'] = user_feedback[0].was_positive
        else:
            task_dict['userFeedback'] = None

    return task_dict


def get_all_tasks_json(tasks_list):

    datastore_tasks = []

    for task in tasks_list:
        task_dict = get_task_json(task)
        datastore_tasks.append(task_dict)

    return datastore_tasks


def get_event_json(event):
    event_dict = {}
    event_dict["name"] = event.completed_by.get().first_name
    event_dict["date"] = event.date_completed
    event_dict["positiveFeedback"] = event.positive_feedback
    event_dict["negativeFeedback"] = event.negative_feedback
    return event_dict

def get_all_events_json(events_list):

    datastore_events = []

    for event in events_list:
        event_dict = get_task_json(event)
        datastore_events.append(event_dict)

    return datastore_events