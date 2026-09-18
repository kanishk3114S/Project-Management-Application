import { Note } from "../models/note.models.js";
import { Project } from "../models/project.models.js";
import { ApiResponse } from "../utils/api-response.js";
import { ApiError } from "../utils/api-error.js";
import { AsyncHandler } from "../utils/async-handler.js";
import mongoose from "mongoose";

const getNotes = AsyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const notes = await Note.find({ project: projectId })
        .populate("createdBy", "avatar username fullName")
        .sort({ createdAt: -1 });

    return res.status(200).json(
        new ApiResponse(200, notes, "Notes fetched successfully")
    );
});

const createNote = AsyncHandler(async (req, res) => {
    const { projectId } = req.params;
    const { content } = req.body;

    const project = await Project.findById(projectId);

    if (!project) {
        throw new ApiError(404, "Project not found");
    }

    const note = await Note.create({
        content,
        project: new mongoose.Types.ObjectId(projectId),
        createdBy: new mongoose.Types.ObjectId(req.user._id)
    });

    return res.status(201).json(
        new ApiResponse(201, note, "Note created successfully")
    );
});

const getNoteById = AsyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findById(noteId).populate("createdBy", "avatar username fullName");

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(200, note, "Note fetched successfully")
    );
});

const updateNote = AsyncHandler(async (req, res) => {
    const { noteId } = req.params;
    const { content } = req.body;

    const note = await Note.findByIdAndUpdate(
        noteId,
        { content },
        { new: true }
    );

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(200, note, "Note updated successfully")
    );
});

const deleteNote = AsyncHandler(async (req, res) => {
    const { noteId } = req.params;

    const note = await Note.findByIdAndDelete(noteId);

    if (!note) {
        throw new ApiError(404, "Note not found");
    }

    return res.status(200).json(
        new ApiResponse(200, {}, "Note deleted successfully")
    );
});

export {
    getNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote
};
