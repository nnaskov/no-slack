import models


def delegate_task(task):
    members = models.get_members_list()
    total_diff = models.get_household_key_for_current_user().get().total_difficulty
    least_full = 1000
    largest_bin = 0

    for member_key in members:
        member = member_key.get()
        bin_size = round(5 + (1 - (member.difficulty_done/total_diff*len(members)))*20)
        bin_perc_full = member.difficulty_assigned/bin_size
        if bin_perc_full <= least_full and bin_size > largest_bin:
            least_full = bin_perc_full
            largest_bin = bin_size
            assign = member_key
    task.assigned = member_key
    return task.put()
