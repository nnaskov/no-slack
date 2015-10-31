from google.appengine.ext import ndb
from google.appengine.api import users


class Member(ndb.Model):
    first_name = ndb.StringProperty()
    last_name = ndb.StringProperty()
    household = ndb.KeyProperty()


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


def household_exists(house_name):
    return True if get_house(house_name) else False


def add_default_tasks(house_key):
    add_task_given_key(house_key=house_key, task_name="Washing up", frequency=2,
                       description="Please clean the dirty plates and dishes")
    add_task_given_key(house_key=house_key, task_name="Hoover lounge", frequency=10,
                       description="Get rid of all the bits on the floor")


def get_member(user_id=None):
    if not user_id:
        user = users.get_current_user()
        if not user:
            return None
        user_id = user.user_id()

    key = ndb.Key('Member', user_id)

    return key


def get_member_household_key():
    return get_member().get().household


def get_household_tasks():
    household = get_member_household_key()
    q = Task.query(Task.household == household).order(Task.date_created)
    return q.fetch(limit=100)


def add_task_given_key(house_key, task_name, description=None, frequency=None, style=None):
    new_task = Task(name=task_name, frequency=frequency, household=house_key,
                    user_who_added=get_member(), style=style, description=description)
    new_task.put()


def add_task(task_name, description=None, frequency=None, style=None):
    add_task_given_key(get_member_household_key(), task_name, frequency, style)


def add_task_event(task_id):
    completed_by = get_member()
    task_key = ndb.Key("Task", task_id)
    new_task_event = TaskEvent(task_type=task_key, completed_by=completed_by)
    key = new_task_event.put()

    update_task(task_key, key)


def update_task_event_feedback(id, was_positive):
    task = get_task(id)
    if task.most_recent:
        task_event = task.most_recent.get()
        user_key = get_member()
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
            new_event_feedback = EventFeedback(task_event=task_event.key, user=user_key, was_positive=was_positive)
            new_event_feedback.put()


def get_task_events(task_id):
    get_task(task_id)
    q = TaskEvent.query(TaskEvent.task_type == ndb.Key('Task', task_id))
    return q.fetch(limit=100)


def update_task(task_key, task_event_key):
        task = task_key.get()
        if not task:
            return None
        else:
            task.most_recent = task_event_key
            task.put()





def delete_task(id):
    ndb.Key('Task', id).delete()


def get_task(id):
    task = ndb.Key('Task', id).get()
    return task


def add_member(first_name, last_name):
    user = users.get_current_user()
    if not user:
        return None
    user_id = user.user_id()

    member = Member(id=user_id, first_name=first_name, last_name=last_name)
    key = member.put()

    return key.get()


def add_household(household_id):
    owner = get_member()
    new_household = HouseHold(name=household_id, owner=owner)
    new_household.put()
    add_default_tasks(new_household.key) #SHOULD BE MOVED WHEN IN PROD
    return new_household


def get_house(house_name):
    q = HouseHold.query(HouseHold.name==house_name)
    house_list = q.fetch(limit=1)
    if len(house_list):
        return house_list[0]
    else:
        return None


def register_user(first_name, last_name, house_name):
    user = add_member(first_name, last_name)

    if not household_exists(house_name):
        house = add_household(house_name)
    else:
        house = get_house(house_name)

    user.household = house.key
    user.put()