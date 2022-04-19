import express from "express";
import {
  initPlaceList,
  getPlaceListByArea,
  getLikedPlaceListByUserId,
  togglePlaceListLike,
} from "../controller/placeList";

const placeListRouter = express.Router();

placeListRouter.get("/userlike/:userid", getLikedPlaceListByUserId);

// placeList by 지역
placeListRouter.get("/", getPlaceListByArea);

// review 삭제
placeListRouter.delete("/review/:id", (req, res, next) => {
  res.send("place list API");
});

// placeList id를 받아서 reivew 가져오기
placeListRouter.get("/review", (req, res, next) => {
  res.send("place list API");
});

// review 작성
placeListRouter.post("/review", (req, res, next) => {
  res.send("place list API");
});

// TODO: toggle 로 동작하도록 해야됨
placeListRouter.post("/like", togglePlaceListLike);

// TODO: 경로 만들기
// placeListRouter.get("/init", initPlaceList);

// placeList by ID
placeListRouter.get("/:id", (req, res, next) => {
  res.send("place list API");
});

export default placeListRouter;
