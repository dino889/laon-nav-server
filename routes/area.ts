import express from "express";
import { getAreaAll } from "../controller/area";

const areaRouter = express.Router();

// - 모든 지역 목록 조회
areaRouter.get("/", getAreaAll);

export default areaRouter;
