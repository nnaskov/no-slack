import json

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
