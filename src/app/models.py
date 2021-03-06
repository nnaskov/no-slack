from google.appengine.ext import ndb
from google.appengine.api import users
import random
import delegator
import datetime

class Member(ndb.Model):
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    household = ndb.KeyProperty()
    # difficulty_done - the sum of the difficulties of all completed tasks by the user + the difficulties of all
    #                   assigned tasks
    total_difficulty_done_assigned = ndb.IntegerProperty(default=0)
    difficulty_assigned = ndb.IntegerProperty(default=0)
    channel_token = ndb.StringProperty()
    avatar = ndb.BlobProperty()
    notifications_on = ndb.BooleanProperty(default=True)

    def is_owner(self):
        return True if(self.household.get().owner.id() == self.key.id()) else False

    def get_initials(self):
        return self.first_name[0].upper() + self.last_name[0].upper()

class HouseHold(ndb.Model):
    name = ndb.StringProperty(required=True)
    owner = ndb.KeyProperty()

class Task(ndb.Model):
    """
    frequency is stored in hours
    """
    household = ndb.KeyProperty(required=True)
    name = ndb.TextProperty(required=True)
    description = ndb.TextProperty()
    date_created = ndb.DateTimeProperty(auto_now_add=True)
    date_modified = ndb.DateTimeProperty(auto_now=True)
    user_who_added = ndb.KeyProperty(required=True)
    frequency = ndb.IntegerProperty(required=True)
    difficulty = ndb.IntegerProperty(required=True)
    most_recent_event = ndb.KeyProperty()
    assigned = ndb.KeyProperty()
    style = ndb.TextProperty()
    order = ndb.IntegerProperty()

    def get_delagated_initials(self):
        if self.assigned:
            return self.assigned.get().get_initials()


class TaskEvent(ndb.Model):
    task_type = ndb.KeyProperty()
    date_completed = ndb.DateTimeProperty(auto_now_add=True)
    completed_by = ndb.KeyProperty(Member)
    positive_feedback = ndb.IntegerProperty(default=0)
    negative_feedback = ndb.IntegerProperty(default=0)

    def get_user_feedback(self, member_key=None):
        if not member_key:
            member_key = get_member_key()
        q = EventFeedback.query(ndb.AND(EventFeedback.user == member_key,
                                        EventFeedback.task_event == self.key))
        return q.fetch(limit=1)



class EventFeedback(ndb.Model):
    task_event = ndb.KeyProperty()
    user = ndb.KeyProperty()
    was_positive = ndb.BooleanProperty()


"""
Functions that work with the Models directly
"""

def household_exists(house_name):
    return True if get_house(house_name) else False


def add_default_tasks(house_key):
    """
    Adds a set of default Tasks and returns an array of their keys

    :param house_key:
    :return:
    
    """
    taskKeys = []
    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Washing up", frequency=2, difficulty=3,
                       description="Please clean the dirty plates and dishes",  style="fa fa-database"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Clean kitchen", frequency=2, difficulty=6,
                       description="Floor mop, dishes, fridge, dust drawers.",  style="fa fa-cutlery"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Rinse bathroom", frequency=2, difficulty=8,
                       description="Clean the bath, the toilet and the sink",  style="glyphicon glyphicon-tint"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Hoover hallway", frequency=2, difficulty=2,
                       description="The hallway + the stairs",  style="fa fa-sign-in"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Tidy lounge", frequency=10, difficulty=4,
                       description="Dust, clean windows, remove toys", style="fa fa-users"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Take the trash", frequency=10, difficulty=1,
                       description="Every bin: bathroom, bedroom, kitchen, backyard", style="fa fa-trash"))
    
    return taskKeys

def add_default_task_events_and_feedback(member_keys, task_keys):


    for i in range(len(task_keys)):

        # This is the number of times this task will be executed by the users
        timesEachTask = len(member_keys)*3

        # For each task the dates of the taskEvents must be ordered by date completed
        # So we start with a date and then randomly incrementally add some time to it
        # To achieve a well distributed random dates we use the number of users as a base
        last_date = datetime.datetime.now() - datetime.timedelta(days=timesEachTask/2)

        for j in range(timesEachTask):

            task_event_key = add_task_event_given_task_key(task_keys[i], random.choice(member_keys))

            # Set a random completed date in the past month
            task_event = task_event_key.get()
            last_date = last_date + datetime.timedelta(hours=random.randint(4, 11), minutes=random.randint(0, 60))
            task_event.date_completed = last_date


            # Add task feedback
            # Get a random # of persons
            for k in range(random.randint(0,len(member_keys))):
                current_member = member_keys[k]
                was_positive = True if random.randint(0,1) else False

                if was_positive:
                    task_event.positive_feedback += 1
                else:
                    task_event.negative_feedback += 1

                new_event_feedback = EventFeedback(task_event=task_event.key, user=current_member, was_positive=was_positive)
                new_event_feedback.put_async()

            task_event.put_async()


def delete_all_default_values():
    """
    Delete all Tasks, TaskEvents and EventFeedback entities from the DB
    :return:
    """

    global order_of_tasks_in_memory
    global is_order_of_tasks_set

    order_of_tasks_in_memory = None
    is_order_of_tasks_set = False

    qTasks = Task.query()
    qTaskEvents = TaskEvent.query()
    qEventFeedback = EventFeedback.query()

    members = get_members_list()
    for member in members:
        member.total_difficulty_done_assigned = 0
        member.put()

    allEntities = [qTasks, qTaskEvents, qEventFeedback]
    for qr in allEntities:
        for entitiy in qr.iter():
            entitiy.key.delete()

def populate_default_values(house_key):
    """
    Populates database with a lot of default data for a given house_hold_name

    :return:
    """

    start = datetime.datetime.now()
    print("Popualate start")
    delete_all_default_values()

    # Create members in the database to the same house
    # member_keys = add_default_members(house_key)

    # Get the members
    member_keys = get_members_list(keys_only=True)

    # Add default tasks
    task_keys = add_default_tasks(house_key)

    # Assign the tasks
    delegator.delegate_task_loop()

    # Add task events
    add_default_task_events_and_feedback(member_keys,task_keys)

    print("Popualate finish:" + str(datetime.datetime.now()-start))


def get_member_id():
    return users.get_current_user().user_id()

def get_member_key(user_id=None):
    """
    Returns the user as a ndb.Key

    :param user_id:
    :return: ndb.Key  of the user
    """
    if not user_id:
        user = users.get_current_user()
        if not user:
            return None
        user_id = user.user_id()

    key = ndb.Key('Member', user_id)

    return key

def get_users_accounts(user_id=None):
    """
    Gets the account (member object) on our system for a Google Account. If

    :param user_id: the Google Account. If None - current logged in Google Account
    :return: ndb.Model - Member the object for the model.
    """
    if not user_id:
        user = users.get_current_user()
        if not user:
            return None
        user_id = user.user_id()

    key = ndb.Key('Member', user_id)

    return key.get()




def get_household_key_for_current_user():
    """
    Get the household key for a memebr
    :return:
    """
    return get_member_key().get().household


def get_household_tasks(limit = 100):
    """
    Get the tasks for this household

    :param limit:
    :return:
    """
    household = get_household_key_for_current_user()
    q = Task.query(Task.household == household).order(Task.date_created)
    return q.fetch(limit)

"""
This variable is used for ordering the new tasks. Task.query(Task.household == house_key).count() doesn't return correct
value since put() is async.
"""
order_of_tasks_in_memory = None
is_order_of_tasks_set = False

def add_task_given_key(house_key, task_name, difficulty, description=None, frequency=None, style="glyphicon glyphicon-remove-circle"):
    """
    Creates a new task and gives back the ndb.Key object of it

    :return: ndb.Key of the task
    """
    global order_of_tasks_in_memory
    global is_order_of_tasks_set

    if not is_order_of_tasks_set:
        # If the app is just started we set the order_of_tasks to equal the current count of Tasks
        order_of_tasks_in_memory = Task.query(Task.household == house_key).count()
        is_order_of_tasks_set = True
    else:
        # Else we just increase the order with one=
        order_of_tasks_in_memory += 1

    new_task = Task(name=task_name, frequency=frequency, difficulty=difficulty, household=house_key,
                    user_who_added=get_member_key(), style=style, description=description, order=order_of_tasks_in_memory)
    return new_task.put()


def add_task(task_name, difficulty, description=None, frequency=None, style=None):
    """
    Creates a new Task and gives back the ndb.Key object of it

    :return: ndb.Key of the task
    """
    return add_task_given_key(get_household_key_for_current_user(), task_name, difficulty, description=description, frequency=frequency, style=style)


def add_task_event(task_id,  member_key=None):
    """
    Add TaskEvent given Task id. Note this automatically delegates the task

    :param task_id:
    :return: ndb.Key for the new TaskEvent
    """
    task_key = ndb.Key("Task", task_id)
    return add_task_event_given_task_key(task_key, member_key)



def add_task_event_given_task_key(task_key, member_key=None):
    """
    Add TaskEvent given ndb.Key of a Task. Note this automatically delegates the task

    :param task_key: ndb.Key of a Task
    :return: ndb.Key for the new TaskEvent
    """
    if not member_key:
        member_key = get_member_key()
        task = task_key.get()
    else:
        task = task_key.get()
        
    new_task_event = TaskEvent(task_type=task_key, completed_by=member_key)
    task_event_key = new_task_event.put()

    update_task(task, task_event_key, member_key)
    return task_event_key

def update_task_event_feedback(task_id, was_positive, member_key=None):
    task_key = get_task_key(task_id)
    return update_task_event_feedback_given_key(task_key,was_positive, member_key)

def update_task_event_feedback_given_key(task_key, was_positive, member_key=None):
    """
    Updates the TaskEvent object's feedback, only on most recent task_event!!!!!!

    :param task_id:
    :param was_positive:
    :return: ndb.Key for the Task Event
    """
    # Get the task
    task = task_key.get()
    if task and task.most_recent_event:
        # We can change the feedback only on the most recent task_event.
        # TODO: Maybe change that?!
        task_event = task.most_recent_event.get()
        if not member_key:
            member_key = get_member_key()
        event_feedback = task_event.get_user_feedback(member_key)

        if len(event_feedback):
            event_feedback = event_feedback[0]
            if event_feedback.was_positive != was_positive:
                event_feedback.was_positive = was_positive
                event_feedback.put()
                change = 1 if was_positive else -1
                task_event.positive_feedback += change
                task_event.negative_feedback += -change
                task_event.put()

        else:
            if was_positive:
                task_event.positive_feedback += 1
            else:
                task_event.negative_feedback += 1
            task_event.put()
            new_event_feedback = EventFeedback(task_event=task_event.key, user=member_key, was_positive=was_positive)
            new_event_feedback.put()

        return task_event

def get_task_events(task_id):
    task = get_task(task_id)

    if task:
        q = TaskEvent.query(TaskEvent.task_type == task.key)
        return q.fetch(limit=100)
    else:
        return []


def get_all_task_events_count_for_member(member_key):
    """
    
    NOTE: This function relies that you cannot change your household. It must  be re written if this functionality is
    implemented because it doesn't check if the current task_events are for the same household.
    :param member_key: (ndb.Key) - the key for
    :return: (int) - the count of all task events
    """
    q = TaskEvent.query(TaskEvent.completed_by == member_key)
    return q.count()

def get_all_task_events_count_for_member_for_date(member_key, date):
    """

    NOTE: This function relies that you cannot change your household. It must  be re written if this functionality is
    implemented because it doesn't check if the current task_events are for the same household.
    :param member_key: (ndb.Key) - the key for
    :param date: (Date)
    :return: (int) - the count of all task events
    """
    # Make two dates from the given date at 00:00 and 24:00, so we can filter on them
    delta = datetime.timedelta(minutes=date.minute, seconds=date.second, microseconds=date.microsecond, hours=date.hour)
    dateAt00 = date - delta
    dateAt24 = dateAt00 + datetime.timedelta(days=1)

    q = TaskEvent.query(TaskEvent.completed_by == member_key, TaskEvent.date_completed >= dateAt00, TaskEvent.date_completed < dateAt24)
    return q.count()

def get_all_tasks_for_household(house_key):
    """
    Return a list of Task keys
    :param house_key:
    :return:
    """
    tasksKeys = []
    q = Task.query(Task.household == house_key)
    for task in q.fetch():
        tasksKeys.append(task.key)

    return tasksKeys

def get_all_tasks(house_key=None):
    """
    Return a list of Task keys
    :param house_key:
    :return:
    """
    if not house_key:
        house_key = get_household_key_for_current_user()
    q = Task.query(Task.household == house_key)
    return q.fetch(limit=100)


def get_all_task_events_count_for_task_and_member(task_key, member_key):
    """
    Return the number of Tasks events for this member of the speicifc task.
    :param task_key:
    :param member_key:
    :return:
    """
    q = TaskEvent.query(TaskEvent.completed_by == member_key, TaskEvent.task_type == task_key)
    return q.count()

def get_all_positive_negative_labels_for_member(member_key, task_keys = None):
    """
    :param member_key: 
    :param task_keys:
    :return: (dictionary) -
    'labels' - array of string labels of each task.
    'positive' - array of int of positive feedback for each task
    'negative' - array of int of negative feedback for each task

    """
    if not task_keys:
        task_keys = get_all_tasks_for_household(member_key.get().household)
    positive_feedbacks = []
    negative_feedbacks = []
    labels = []

    # For each task we sum up all negative and positive feedbacks
    for taskKey in task_keys:
        task = taskKey.get()

        positive, negative = get_positive_negative_feedback(member_key,taskKey)

        if positive > 0 or negative > 0:
            positive_feedbacks.append(positive)
            negative_feedbacks.append(negative)
            labels.append(task.name)

    return {'labels': labels, 'positive':positive_feedbacks, 'negative': negative_feedbacks}

def get_positive_negative_feedback(member_key, taskKey):
    # Get the TaskEvents of this specific member.
    q = TaskEvent.query(TaskEvent.completed_by == member_key, TaskEvent.task_type == taskKey)
    positive = 0; negative = 0
    # Sum up all positive and negative feedbacks
    for event in q.fetch():
        positive += event.positive_feedback
        negative += event.negative_feedback

    return (positive, negative)

def update_task(task, task_event_key, member_key):
    """
    Add task event for the Task

    :param task_key:
    :param task_event_key:
    :param member_key: the member that completed this task.
    :return:
    """
    task.most_recent_event = task_event_key


    if task.assigned != member_key:
        # If the assignee is not the same we need to handle the difficulties - increase the total difficulty for that
        # user with the current task's difficulty
        member = member_key.get()
        member.total_difficulty_done_assigned += task.difficulty
        member.put()

        # Also, we need to subtract the current task's difficulty from the total of it's assignee, since we have already
        # added it, when we assigned it to him

        if task.assigned:
            assigned_member = task.assigned.get()
            assigned_member.total_difficulty_done_assigned -= task.difficulty
            assigned_member.put()
        # Else we do nothing because the assigned difficulty is already added

    # Finally we need to delegate the task again
    delegator.delegate_task_loop(task)


def delete_task(id):
    ndb.Key('Task', id).delete()

def edit_task(task_id, json):
    task = get_task(task_id)
    order = None
    order = json.get("order")
    if order is None:
        task.name = json.get("name")
        task.frequency = int(json.get("frequency"))
        task.description = json.get("description")
        task.difficulty = int(json.get("difficulty"))
        task.style = json.get("iconClass")
    else:
        task.order = order
    task.put()
    return task

def get_task(task_id):
    return ndb.Key('Task', task_id).get()

def get_task_key(task_id):
    return ndb.Key("Task", int(task_id))



def add_member(first_name, last_name, avatar=None, user_id=None):
    """
    Add a new member. If user_id is not set, then get the current Logged in user from GAE

    :param user_id: the Google Account. If None - current logged in Google Account
    :return: ndb.Key of the new member
    """
    if not user_id:
        user = users.get_current_user()
        if not user:
            return None
        user_id = user.user_id()

    member = Member(id=user_id, first_name=first_name, last_name=last_name)
    if avatar:
        member.avatar = avatar
    key = member.put()

    return key


def update_member(first_name, last_name, notifications_on, avatar=None):
    """
    Update a member. If user_id is not set, then get the current Logged in user from GAE

    :param user_id: the Google Account. If None - current logged in Google Account
    :return: ndb.Key of the new member
    """

    member = get_member_key().get()
    member.first_name = first_name
    member.last_name = last_name
    member.notifications_on = notifications_on == u'true'
    
    if avatar:
        member.avatar = avatar
    member.put()

    return member


def update_house(name):
    """
    Update a house.

    :param
    :return:
    """

    house = get_household_key_for_current_user().get()
    house.name = name
    house.put()
    return house


def get_members_list(house_key=None, limit=12, keys_only=False, orderBy=Member.first_name):
    """
    Returns a list of ndb.Key for each member in the house. If no house_key is specified,
    uses the current logged in user
    :param house_key: (ndb.Key) - of the house
    :param limit: (int) - max number of members
    :return: (list) of ndb.Key
    """
    if not house_key:
        house_key = get_household_key_for_current_user()
    q = Member.query(Member.household == house_key).order(orderBy)

    return q.fetch(limit,keys_only=keys_only)


def add_household(household_id):
    owner = get_member_key()
    new_household = HouseHold(name=household_id, owner=owner)
    new_household.put()
    add_default_tasks(new_household.key)  # SHOULD BE MOVED WHEN IN PROD
    return new_household


def get_house(house_name):
    q = HouseHold.query(HouseHold.name == house_name)
    house_list = q.fetch(limit=1)
    if len(house_list):
        return house_list[0]
    else:
        return None

def register_member_from_code(first_name, last_name, house_key, user_id=None):
    user_key = add_member(first_name, last_name, user_id)
    usr = user_key.get()
    usr.household = house_key
    usr.put()
    return user_key

def register_user(first_name, last_name, house_name, avatar, user_id=None, needs_default_items=False):

    user_key = add_member(first_name, last_name, avatar, user_id)

    if not household_exists(house_name):
        house = add_household(house_name)
    else:
        house = get_house(house_name)

    usr = user_key.get()
    usr.household = house.key
    usr.put()

    return user_key
