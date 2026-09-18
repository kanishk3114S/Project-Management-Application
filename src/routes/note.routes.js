import { Router } from "express";
import { verifyUser, permissionValidator } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRoleEnum, AvailableUserRole } from "../utils/constants.js";
import { createNoteValidator, updateNoteValidator } from "../validators/index.js";
import {
    getNotes,
    createNote,
    getNoteById,
    updateNote,
    deleteNote
} from "../controllers/note.controllers.js";

const router = Router();
router.use(verifyUser);

router
    .route("/:projectId")
    .get(permissionValidator(AvailableUserRole), getNotes)
    .post(
        permissionValidator([userRoleEnum.ADMIN]),
        createNoteValidator(),
        validate,
        createNote
    );

router
    .route("/:projectId/n/:noteId")
    .get(permissionValidator(AvailableUserRole), getNoteById)
    .put(
        permissionValidator([userRoleEnum.ADMIN]),
        updateNoteValidator(),
        validate,
        updateNote
    )
    .delete(
        permissionValidator([userRoleEnum.ADMIN]),
        deleteNote
    );

export default router;
