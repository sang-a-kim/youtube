import express from "express";
import { createComment, regiseterView } from '../controllers/videoController';

const apiRouter = express.Router();

apiRouter.post("/videos/:id([0-9a-f]{24})/view", regiseterView)
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment)

export default apiRouter;
