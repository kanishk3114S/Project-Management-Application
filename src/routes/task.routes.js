import { Router } from "express";
import { verifyUser, permissionValidator } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validator.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import { userRoleEnum, AvailableUserRole } from "../utils/constants.js";
import {
    createTaskValidator,
    updateTaskValidator,
    createSubTaskValidator,
    updateSubTaskValidator
} from "../validators/index.js";
import {
    getTasks,
    createTask,
    getTaskbyId,
    updateTask,
    deleteTask,
    createsubTask,
    updatesubTask,
    deletesubTask
} from "../controllers/task.controllers.js";

const router = Router();
router.use(verifyUser);

router
    .route("/:projectId")
    .get(permissionValidator(AvailableUserRole), getTasks)
    .post(
        permissionValidator([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
        upload.array("attachments", 5),
        createTaskValidator(),
        validate,
        createTask
    );

router
    .route("/:projectId/t/:taskId")
    .get(permissionValidator(AvailableUserRole), getTaskbyId)
    .put(
        permissionValidator([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
        upload.array("attachments", 5),
        updateTaskValidator(),
        validate,
        updateTask
    )
    .delete(
        permissionValidator([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
        deleteTask
    );

router
    .route("/:projectId/t/:taskId/subtasks")
    .post(
        permissionValidator([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
        createSubTaskValidator(),
        validate,
        createsubTask
    );

router
    .route("/:projectId/st/:subTaskId")
    .put(
        permissionValidator(AvailableUserRole),
        updateSubTaskValidator(),
        validate,
        updatesubTask
    )
    .delete(
        permissionValidator([userRoleEnum.ADMIN, userRoleEnum.PROJECT_ADMIN]),
        deletesubTask
    );

export default router;
