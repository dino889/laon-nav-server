import express from "express";

const placeRouter = express.Router();

// TODO: place를 가져오는 라우터 하나에 query로 만능 필터링으로 구현하기
placeRouter.get("/", (req, res, next) => {
  const { areaId, typeId, id, userId, like } = req.query;
  res.send(`GET place by areaId:${areaId} typeId:${typeId} placeId:${id} userId:${userId} like:${like}`);
});

// TODO: toggle 로 동작하도록 해야됨
placeRouter.post("/like", (req, res, next) => {
  const { id } = req.query;
  res.send(`POST place like toggle by placeId:${id}`);
});

// place id를 받아서 reivew 가져오기
placeRouter.get("/review", (req, res, next) => {
  const { id } = req.query;
  res.send(`GET place review by id:${id}`);
});

// reivew 작성
placeRouter.post("/review", (req, res, next) => {
  const { placeId, userId, content, rate } = req.body;
  res.send(`POST place review create with ${placeId} ${userId} ${rate} ${content}`);
});

placeRouter.put("/review/:id", (req, res, next) => {
  const { id } = req.params;
  const { content, rate } = req.body;
  res.send(`PUT reivew update by id : ${id} ${content} ${rate}`);
});

placeRouter.delete("/review/:id", (req, res, next) => {
  const { id } = req.params;
  res.send(`DELETE reivew by id : ${id}`);
});

export default placeRouter;
