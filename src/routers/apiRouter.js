import express from "express";
import { regiseterView } from '../controllers/videoController';

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", regiseterView)

export default apiRouter;
