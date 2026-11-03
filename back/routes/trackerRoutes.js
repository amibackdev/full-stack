import { Router } from "express";
import trackerController from '../controllers/trackerController.js';

const router = new Router();

router.get("/tasks", trackerController.getTasks);
router.get("/task/:id", trackerController.getOneTask);
router.post("/tasks", trackerController.addTask);
router.patch("/task/:id", trackerController.updateTask);
router.delete("/task/:id", trackerController.deleteTask);

export default router