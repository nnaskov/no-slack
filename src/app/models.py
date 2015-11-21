from google.appengine.ext import ndb
from google.appengine.api import users
import publisher
import random
import threading

class Member(ndb.Model):
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    household = ndb.KeyProperty()

    def is_owner(self):
        return True if(self.household.get().owner == self.key) else False

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
    most_recent = ndb.KeyProperty()
    style = ndb.TextProperty()


class TaskEvent(ndb.Model):
    task_type = ndb.KeyProperty()
    date_completed = ndb.DateTimeProperty(auto_now_add=True)
    completed_by = ndb.KeyProperty(Member)
    positive_feedback = ndb.IntegerProperty(default=0)
    negative_feedback = ndb.IntegerProperty(default=0)

    def get_user_feedback(self):
        q = EventFeedback.query(ndb.AND(EventFeedback.user == get_member(),
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
    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Washing up", frequency=2, difficulty=1,
                       description="Please clean the dirty plates and dishes",  style="fa fa-database"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Clean kitchen", frequency=2, difficulty=1,
                       description="Floor mop, dishes, fridge, dust drawers.",  style="fa fa-cutlery"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Rinse bathroom", frequency=2, difficulty=1,
                       description="Clean the bath, the toilet and the sink",  style="glyphicon glyphicon-tint"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Hoover hallway", frequency=2, difficulty=1,
                       description="The hallway + the stairs",  style="fa fa-sign-in"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Tidy lounge", frequency=10, difficulty=1,
                       description="Dust, clean windows, remove toys", style="fa fa-users"))

    taskKeys.append(add_task_given_key(house_key=house_key, task_name="Take the trash", frequency=10, difficulty=1,
                       description="Every bin: bathroom, bedroom, kitchen, backyard", style="fa fa-trash"))
    return taskKeys

def add_default_members(house_key):
    """
    Add default members and return an array of members

    :param house_name:
    :return:
    """
    import  time
    memberKeys = []
    memberKeys.append(register_member_from_code("Norbert","Naskov",house_key,"id1"))
    memberKeys.append(register_member_from_code("Adam","Noakes",house_key,"id12"))
    memberKeys.append(register_member_from_code("Dominic","Smith",house_key,"id13"))
    memberKeys.append(register_member_from_code("Bogomil","Gospodinov",house_key,"id14"))
    memberKeys.append(register_member_from_code("Darius","Key",house_key,"id15"))
    memberKeys.append(register_member_from_code("Damyan","Rusinov",house_key,"id16"))
    memberKeys.append(register_member_from_code("Richard","Bata",house_key,"id17"))
    return memberKeys

def add_default_task_events_and_feedback(member_keys, task_keys):
    """
    This is a table of 6 rows (each for each task key. And 3 people do the tasks.
    E.g. for task_key[0] person (member_key[0]) has done it 6 times. So we add 6 task_events.
    """
    task_repeat_times = [[6,0,1],[1,0,3],[2,0,0],[3,1,5],[5,4,2],[4,2,1]]
    for i in range(len(task_repeat_times)):
        for j in range(len(task_repeat_times[0])):
            for times in range(task_repeat_times[i][j]):
                task_event_key = add_task_event_given_task_key(task_keys[i],member_keys[j])

                # Add task feedback
                # Get a random # of persons
                for k in range(random.randint(0,3)):
                    update_task_event_feedback_given_key(task_keys[i], True if random.randint(0,1) else False, member_keys[k])




def populate_default_values(house_key):
    """
    Populates database with a lot of default data for a given house_hold_name

    :return:
    """

    # Create members in the database to the same house
    member_keys = add_default_members(house_key)

    # Add default tasks
    task_keys = add_default_tasks(house_key)

    #Add task events
    add_default_task_events_and_feedback(member_keys,task_keys)





def get_member(user_id=None):
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
    return get_member().get().household


def get_household_tasks(limit = 100):
    """
    Get the tasks for this household

    :param limit:
    :return:
    """
    household = get_household_key_for_current_user()
    q = Task.query(Task.household == household).order(Task.date_created)
    return q.fetch(limit)


def add_task_given_key(house_key, task_name, difficulty, description=None, frequency=None, style="glyphicon glyphicon-remove-circle"):
    """
    Creates a new task and gives back the ndb.Key object of it

    :return: ndb.Key of the task
    """
    new_task = Task(name=task_name, frequency=frequency, difficulty=difficulty, household=house_key,
                    user_who_added=get_member(), style=style, description=description)
    return new_task.put()


def add_task(task_name, difficulty, description=None, frequency=None, style=None):
    """
    Creates a new Task and gives back the ndb.Key object of it

    :return: ndb.Key of the task
    """
    return add_task_given_key(get_household_key_for_current_user(), task_name, difficulty, description=description, frequency=frequency, style=style)


def add_task_event(task_id,  member_key=None):
    """
    Add TaskEvent given Task id

    :param task_id:
    :return: ndb.Key for the new TaskEvent
    """
    task_key = ndb.Key("Task", task_id)
    return add_task_event_given_task_key(task_key, member_key)

def add_task_event_given_task_key(task_key, member_key=None):
    """
    Add TaskEvent given ndb.Key of a Task

    :param task_key: ndb.Key of a Task
    :return: ndb.Key for the new TaskEvent
    """
    if not member_key:
        member_key = get_member()
    new_task_event = TaskEvent(task_type=task_key, completed_by=member_key)
    task_event_key = new_task_event.put()
    json = 'test'
    publisher.update_clients(member_key.id(), get_members_list(), json)

    update_task(task_key, task_event_key)

    return task_event_key

def update_task_event_feedback(task_id, was_positive, member_key=None):
    task_key = get_task_key()
    update_task_event_feedback_given_key(task_key,was_positive, member_key)

def update_task_event_feedback_given_key(task_key, was_positive, member_key=None):
    """
    Updates the feedback, only on most recent task!!!!!!

    :param task_id:
    :param was_positive:
    :return:
    """
    task = task_key.get()
    if task.most_recent:
        task_event = task.most_recent.get()
        if not member_key:
            member_key = get_member()
        event_feedback = task_event.get_user_feedback()

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


def get_task_events(task_id):
    task = get_task(task_id)
    q = TaskEvent.query(TaskEvent.task_type == task.key)
    return q.fetch(limit=100)


def update_task(task_key, task_event_key):
        """
        Add task event to the Task

        :param task_key:
        :param task_event_key:
        :return:
        """
        task = task_key.get()
        if not task:
            return None
        else:
            task.most_recent = task_event_key
            task.put()


def delete_task(id):
    ndb.Key('Task', id).delete()


def get_task(id):
    return ndb.Key('Task', id).get()

def get_task_key(task_id):
    return ndb.Key('Task', id)


def add_member(first_name, last_name, user_id=None):
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
    key = member.put()

    return key


def get_members_list():
    house_key = get_household_key_for_current_user()
    q = Member.query(Member.household == house_key)
    return q.fetch(limit=12)


def add_household(household_id):
    owner = get_member()
    new_household = HouseHold(name=household_id, owner=owner)
    new_household.put()
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

def register_user(first_name, last_name, house_name, user_id=None, needs_default_items=False):

    user_key = add_member(first_name, last_name, user_id)

    if not household_exists(house_name):
        house = add_household(house_name)
    else:
        house = get_house(house_name)

    usr = user_key.get()
    usr.household = house.key
    usr.put()

    return user_key
