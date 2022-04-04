import express from "express";

const areaRouter = express.Router();

// - 모든 지역 목록 조회
areaRouter.get("/", (req, res, next) => {
  res.send("GET areas");
});

export default areaRouter;
