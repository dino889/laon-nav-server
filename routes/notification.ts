import express from "express";

const notificationRouter = express.Router();

// - 유저의 알림 모두 조회
notificationRouter.get("/:userid", (req, res, next) => {
  const { userid } = req.params;
  res.send(`GET notification by userid = ${userid}`);
});

export default notificationRouter;
