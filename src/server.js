import express from "express";
import morgan from "morgan";
import MongoStore from "connect-mongo";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";
import apiRouter from './routers/apiRouter';
import flash from 'express-flash';

const app = express();
const logger = morgan("dev");

app.set("views", process.cwd() + "/src/views");
app.set("view engine", "pug");
app.use(logger);
app.use(express.urlencoded());
app.use(express.json());

app.use(
	session({
		secret: process.env.COOKIE_SECRET,
		resave: false,
		saveUninitialized: false,
		store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
	})
);


app.use(flash())
app.use(localsMiddleware);

app.use("/uploads", express.static("uploads"));
app.use("/static", express.static("static"));
app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
app.use("/api", apiRouter);

export default app;
