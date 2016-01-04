import models


# def delegate_task(task):
#     members = models.get_members_list()
#     total_diff = float(models.get_household_key_for_current_user().get().total_difficulty)
#     least_full = 1000
#     zero_diff = total_diff == 0
#
#     # Assign a default member
#     assign_key = members[0].key
#
#     for member in members:
#         member_key = member.key
#         if zero_diff:
#             scaler = 0
#         else:
#             scaler = 1 - member.difficulty_done/total_diff*len(members)
#             scaler = 0 if scaler < 0 else scaler
#         bin_size = float(round(5 + scaler*20))
#         bin_perc_full_new = (member.difficulty_assigned + task.difficulty)/bin_size
#         if bin_perc_full_new <= least_full:
#             least_full = bin_perc_full_new
#             assign_key = member_key
#             assign = member
#     task.assigned = assign_key
#     assign.difficulty_assigned = assign.difficulty_assigned + task.difficulty
#     assign.put()
#     task.put()
#     return task

#
# def delegate_task_loop():
#     tasks = models.get_all_tasks()
#     members = models.get_members_list()
#     house = models.get_household_key_for_current_user().get()
#     for member in members:
#         member.difficulty_assigned = 0
#     for task in tasks:
#         total_diff = float(house.total_difficulty)
#         least_full = 1000
#         zero_diff = total_diff == 0
#
#         # Assign a default member
#         assign_key = members[0].key
#
#         for member in members:
#             member_key = member.key
#             if zero_diff:
#                 scaler = 0
#             else:
#                 scaler = 1 - member.difficulty_done/total_diff*len(members)
#                 scaler = 0 if scaler < 0 else scaler
#             bin_size = float(round(5 + scaler*20))
#             bin_perc_full_new = (member.difficulty_assigned + task.difficulty)/bin_size
#             if bin_perc_full_new <= least_full:
#                 least_full = bin_perc_full_new
#                 assign_key = member_key
#                 assign = member
#         task.assigned = assign_key
#         assign.difficulty_assigned = assign.difficulty_assigned + task.difficulty
#         task.put()
#     for member in members:
#         member.put()

def delegate_task_loop():
    tasks = models.get_all_tasks()
    for task in tasks:
        if not task.assigned:
            delegate_task(task)
            task.put()

def get_member_with_highest_feedback_score(memberList, task):
    """
    Computes the feedback score of all members for this task.

    :param memberList: list of members
    :param task: the Task entity
    :return: a member Entity
    """

    # Array of tuples. Each tuple is feedback_score and member entity
    members_with_score = []

    for member in memberList:
        positive, negative =  models.get_positive_negative_feedback(member.key,task.key)
        if positive + negative > 0:
            feedback_score = (positive - negative ) / (positive + negative)
        else:
            feedback_score = 0
        members_with_score.append((feedback_score,member))

    # We return the member entitiy of the sorted array of tuples. It sorts by the first element of the tuple -
    #   feedback_score
    return sorted(members_with_score)[0][1]

def delegate_task(task):
    """
    Assign the task to the next member who should complete it, based on a smart and fair algorithm.
    NOTE: The caller is responsible for saving the task back to the database

    The algorithm assigns the tasks based on the difficulty of each task and the sum of all the difficulties of all
        tasks that the member has completed.

    TotalDifficultyDoneAssigned (TDDA) is the sum of all completed tasks' difficulties for a member.
        It is computed by summing the difficulty of each time, each task was completed and including the difficulty of
        all tasks, which are already assigned to this user.

    This achieves fairness of the algorithm -  the tasks in the house are distributed evenly among the users, not simply
        based on the number of tasks, but on the actual difficulty of each task.

    Furthermore, to achieve smartness of the algorithm, we assign the task to people with relatively equal TDDA, based
        on the Feedback score

    Feedback score is the score of all positive_feedbacks minus all negative_feedbacks divided by the total number of
        feedbacks.

    :param task:
    :return:
    """

    # Fairness of the algorithm
    # members are sorted by TDDA in ascending order
    members = models.get_members_list(orderBy=models.Member.total_difficulty_done_assigned)


    # Smartness of the algorithm
    # equal_members - a list of members, which have TDDA within the range of >=min(TDDA) <= min(TDDA) + task.difficulty
    # This way we consider all members with relatively similar TDDA, to be equal for this tasks and we assign it to the
    # member with the highest Feedback score
    equal_members = [members[0]]
    range_bottom = members[0].total_difficulty_done_assigned
    range_top = range_bottom + task.difficulty
    for member in members[1:]:
        if member.total_difficulty_done_assigned > range_top:
            # The members are sorted, so if the current member's TDDA is higher we can safely break
            break
        else:
            equal_members.append(member)

    if len(equal_members)>1:
        # Only if there are more than 1 equal members
        final_asignee = get_member_with_highest_feedback_score(equal_members,task)
    else:
        final_asignee = equal_members[0]

    # We have add the difficulty of the current task to the TDDA of the asignee

    final_asignee.total_difficulty_done_assigned += task.difficulty
    final_asignee.put()

    task.assigned = final_asignee.key

    return task
