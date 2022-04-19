import express from "express";
import {
  initPlaceList,
  getPlaceListByArea,
  getLikedPlaceListByUserId,
  togglePlaceListLike,
  createReview,
  removeReviewById,
  getReviewByPlaceId,
} from "../controller/placeList";

const placeListRouter = express.Router();

placeListRouter.get("/userlike/:userid", getLikedPlaceListByUserId);

// placeList by 지역
placeListRouter.get("/", getPlaceListByArea);

// review 삭제
placeListRouter.delete("/review/:id", removeReviewById);

// placeList id를 받아서 reivew 가져오기
placeListRouter.get("/review", getReviewByPlaceId);

// review 작성
placeListRouter.post("/review", createReview);

// TODO: toggle 로 동작하도록 해야됨
placeListRouter.post("/like", togglePlaceListLike);

// TODO: 경로 만들기
// placeListRouter.get("/init", initPlaceList);

export default placeListRouter;
