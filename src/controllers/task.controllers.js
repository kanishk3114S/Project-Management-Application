import { User } from "../models/user.models.js"
import { Task } from "../models/task.models.js"
import { SubTask } from "../models/subtask.models.js"
import { Project } from "../models/project.models.js"
import { ApiResponse } from "../utils/api-response.js"
import { ApiError } from "../utils/api-error.js"
import { AsyncHandler } from "../utils/async-handler.js"
import mongoose from "mongoose"
import { AvailableUserRole, userRoleEnum } from "../utils/constants.js"


const getTasks = AsyncHandler(async(req,res)=>{
    //just get me the projectId and i will give u all the tasks....//

    const {projectId} = req.params
    const project = await Project.findById(projectId)
    
    if (!project) {
        throw new ApiError(404 , "Project does not exist")
    }

    const tasks = await Task.aggregate([
        {
            $match: {
                project: new mongoose.Types.ObjectId(projectId)
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "assignedTo",
                foreignField: "_id",
                as: "assignedTo",
                pipeline: [
                    {
                        $project: {
                            _id: 1,
                            username: 1,
                            fullName: 1,
                            avatar: 1
                        }
                    }
                ]
            }
        },
        {
            $addFields: {
                assignedTo: {
                    $arrayElementAt: ["$assignedTo", 0]
                }
            }
        },
        {
            $lookup: {
                from: "subtasks",
                localField: "_id",
                foreignField: "task",
                as: "subtasks"
            }
        }
    ]);

    return res
    .status(200)
    .json(new ApiResponse(200 , tasks , "Tasks fetched successfully"));

})


const createTask = AsyncHandler(async(req,res)=>{
    
    const {title , description , assignedTo , status} = req.body;
    const {projectId} = req.params;
    const project = await Project.findById(projectId)

    if (!project) {
        throw new ApiError(404 , "Project not found")
    }

    const files = req.files || []

    const attachments = files.map((file)=>{
        return {
            url: `${process.env.SERVER_URL || "http://localhost:8000"}/images/${file.filename || file.originalname}`,
            mimetype : file.mimetype,
            size : file.size
        }
    })

    const task = await Task.create({
        title ,
        description , 
        project : new mongoose.Types.ObjectId(projectId),
        assignedTo : assignedTo ? new mongoose.Types.ObjectId(assignedTo):undefined,
        status,
        assignedBy : new mongoose.Types.ObjectId(req.user._id),
        attachments : attachments
    });

    return res.status(201).json(
        new ApiResponse(201 , task , "task created successfully")
    )

})


const deleteTask = AsyncHandler(async(req,res)=>{
    //test
    const {taskId} = req.params;

    const task = await Task.findByIdAndDelete(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    // Delete associated subtasks
    await SubTask.deleteMany({ task: taskId });

    return res.status(200).json(
        new ApiResponse(200, {}, "Task deleted successfully")
    );
})

const updateTask = AsyncHandler(async(req,res)=>{
    //test
    const {taskId} = req.params;
    const {title, description, assignedTo, status} = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const files = req.files || [];

    const attachments = files.map((file)=>{
        return {
            url: `${process.env.SERVER_URL || "http://localhost:8000"}/images/${file.filename || file.originalname}`,
            mimetype : file.mimetype,
            size : file.size
        }
    });

    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (assignedTo !== undefined) task.assignedTo = assignedTo ? new mongoose.Types.ObjectId(assignedTo) : undefined;
    if (status !== undefined) task.status = status;
    if (attachments.length > 0) task.attachments.push(...attachments);

    await task.save();

    return res.status(200).json(
        new ApiResponse(200, task, "Task updated successfully")
    );
})


const updatesubTask = AsyncHandler(async(req,res)=>{
    //test
    const {subTaskId} = req.params;
    const {title, isCompleted} = req.body;

    const subTask = await SubTask.findById(subTaskId);

    if (!subTask) {
        throw new ApiError(404, "Subtask not found");
    }

    if (title !== undefined) subTask.title = title;
    if (isCompleted !== undefined) subTask.isCompleted = isCompleted;

    await subTask.save();

    return res.status(200).json(
        new ApiResponse(200, subTask, "Subtask updated successfully")
    );
})

const createsubTask = AsyncHandler(async(req,res)=>{
    //test
    const {taskId} = req.params;
    const {title} = req.body;

    const task = await Task.findById(taskId);

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const subTask = await SubTask.create({
        title,
        task: new mongoose.Types.ObjectId(taskId),
        isCompleted: false
    });

    return res.status(201).json(
        new ApiResponse(201, subTask, "Subtask created successfully")
    );
})


const deletesubTask = AsyncHandler(async(req,res)=>{
    //test
    const {subTaskId} = req.params;

    const subTask = await SubTask.findByIdAndDelete(subTaskId);

    if (!subTask) {
        throw new ApiError(404, "Subtask not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Subtask deleted successfully")
    );
})


const getTaskbyId = AsyncHandler(async(req,res)=>{
    //test
    const {taskId} = req.params;

    const task = await Task.findById(taskId).populate("assignedTo", "avatar username fullName");

    if (!task) {
        throw new ApiError(404, "Task not found");
    }

    const subtasks = await SubTask.find({ task: taskId });

    return res.status(200).json(
        new ApiResponse(200, { ...task.toObject(), subtasks }, "Task fetched successfully")
    );
})


export {
    getTasks,
    createTask,
    deleteTask,
    updateTask,
    updatesubTask,
    createsubTask,
    deletesubTask,
    getTaskbyId
}