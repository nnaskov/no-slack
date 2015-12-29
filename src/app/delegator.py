import models


def delegate_task(task):
    members = models.get_members_list()
    total_diff = float(models.get_household_key_for_current_user().get().total_difficulty)
    least_full = 1000
    zero_diff = total_diff == 0

    # Assign a default member
    assign_key = members[0].key

    for member in members:
        member_key = member.key
        if zero_diff:
            scaler = 0
        else:
            scaler = 1 - member.difficulty_done/total_diff*len(members)
            scaler = 0 if scaler < 0 else scaler
        bin_size = float(round(5 + scaler*20))
        bin_perc_full_new = (member.difficulty_assigned + task.difficulty)/bin_size
        if bin_perc_full_new <= least_full:
            least_full = bin_perc_full_new
            assign_key = member_key
            assign = member
    task.assigned = assign_key
    assign.difficulty_assigned = assign.difficulty_assigned + task.difficulty
    assign.put()
    task.put()
    return task


def delegate_task_loop():
    tasks = models.get_all_tasks()
    members = models.get_members_list()
    house = models.get_household_key_for_current_user().get()
    for member in members:
        member.difficulty_assigned = 0
    for task in tasks:
        total_diff = float(house.total_difficulty)
        least_full = 1000
        zero_diff = total_diff == 0

        # Assign a default member
        assign_key = members[0].key

        for member in members:
            member_key = member.key
            if zero_diff:
                scaler = 0
            else:
                scaler = 1 - member.difficulty_done/total_diff*len(members)
                scaler = 0 if scaler < 0 else scaler
            bin_size = float(round(5 + scaler*20))
            bin_perc_full_new = (member.difficulty_assigned + task.difficulty)/bin_size
            if bin_perc_full_new <= least_full:
                least_full = bin_perc_full_new
                assign_key = member_key
                assign = member
        task.assigned = assign_key
        assign.difficulty_assigned = assign.difficulty_assigned + task.difficulty
        task.put()
    for member in members:
        member.put()
