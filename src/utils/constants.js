export const userRoleEnum = {
    ADMIN : "admin",
    PROJECT_ADMIN : "project_admin",
    MEMBER : "member",
}

export const AvailableUserRole = Object.values(userRoleEnum); //now we have extracted all the values from the arrays to store into this

export const TaskStatusEnum = {
    TODO : "todo",
    IN_PROGRESS : "in_progress",
    DONE: "done",
}

export const AvailableTaskStatues = Object.values(TaskStatusEnum)
