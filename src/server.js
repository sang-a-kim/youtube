import express from "express";
import morgan from "morgan";
import MongoStore from 'connect-mongo';
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from './middlewares';

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded());

app.use(
	session({
		secret: "Hello",
		resave: true,
		saveUnintialize: true,
		store: MongoStore.create({mongoUrl : "mongodb://127.0.0.1:27017/youtube"})
	})
);

app.use(localsMiddleware)

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

export default app;
