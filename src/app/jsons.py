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
    task_dict["dateModified"] = str(task.date_modified)
    task_dict["frequency"] = task.frequency
    task_dict["taskStyle"] = task.style
    task_dict["everCompleted"] = False

    if task.most_recent:
        task_dict["everCompleted"] = True
        most_recent = task.most_recent.get()
        task_dict["positiveFeedback"] = most_recent.positive_feedback
        task_dict["negativeFeedback"] = most_recent.negative_feedback

    return task_dict


def get_all_tasks_json(tasks_list):

    datastore_tasks = []

    for task in tasks_list:
        task_dict = get_task_json(task)
        datastore_tasks.append(task_dict)

    return datastore_tasks


