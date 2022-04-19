import express from "express";
import {
  createReview,
  getPlaceByArea,
  getPlaceById,
  getReviewByPlaceId,
  removeReviewById,
  toggleLike,
  getLikedPlaceByUserId,
  getPlaceByGPS,
  getCategory,
  getPlaceByIdArray,
} from "../controller/place";

const placeRouter = express.Router();

// place by 지역
placeRouter.get("/userlike/:userid", getLikedPlaceByUserId);

placeRouter.get("/", getPlaceByArea);

// review 삭제
placeRouter.delete("/review/:id", removeReviewById);

// place id를 받아서 reivew 가져오기
placeRouter.get("/review", getReviewByPlaceId);

// review 작성
placeRouter.post("/review", createReview);

// type 목록 반환
placeRouter.get("/category", getCategory);

// GPS기반 경로 추천 받기
placeRouter.get("/gps", getPlaceByGPS);

// TODO: toggle 로 동작하도록 해야됨
placeRouter.post("/like", toggleLike);

placeRouter.get("/array/:arr", getPlaceByIdArray);

// place by ID
placeRouter.get("/:id", getPlaceById);

export default placeRouter;
