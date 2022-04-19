import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import "express-async-errors";

// 🚀 router
import indexRouter from "./routes/index";
import { dbinit } from "./model";
import userRouter from "./routes/user";
import notificationRouter from "./routes/notification";
import areaRouter from "./routes/area";
import placeRouter from "./routes/place";
import placeListRouter from "./routes/placeList";

// sequelize
dbinit();
const app = express();

app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

app.use(cors());
app.use(logger("common"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/", indexRouter);
app.use("/users", userRouter);
app.use("/notifications", notificationRouter);
app.use("/areas", areaRouter);
app.use("/places", placeRouter);
app.use("/place_list", placeListRouter);

// catch 404 and forward to error handler
app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  // set locals, only providing error in development
  console.log(err);
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
