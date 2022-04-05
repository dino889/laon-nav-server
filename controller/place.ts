import express from "express";
import { Like, Place, Review, User } from "../model";
import * as SQ from "sequelize";
import { ResponseData } from "../custom";
const Op = SQ.Op;

export const getPlaceByArea = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { areaName } = req.query;
  const result = await Place.findAll({
    where: {
      address: {
        [Op.like]: `${areaName}%`,
      },
    },
    order: [["rating", "DESC"]],
  });
  let responseData: ResponseData = {
    isSuccess: true,
    message: `${areaName} 지역의 장소리스트입니다`,
    data: result,
  };
  res.status(200).json(responseData);
};

export const getPlaceById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.params;
  const result = await Place.findByPk(Number(id));
  console.log(result);
  let responseData: ResponseData = {
    isSuccess: result ? true : false,
    message: ``,
    data: result ? result.toJSON() : {},
  };
  res.status(200).json(responseData);
};

export const createReview = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { placeId, userId, content, rate } = req.body;
  const result = await Review.create({
    rate,
    content,
    userId,
    placeId,
  });

  let responseData: ResponseData = {
    isSuccess: result ? true : false,
    message: `리뷰가 성공적으로 작성되었습니다`,
    data: result ? result.toJSON() : {},
  };
  res.status(201).json(responseData);
};

export const getReviewByPlaceId = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { placeId } = req.query;
  const result = await Review.findAll({
    where: {
      placeId: Number(placeId),
    },
    include: [{ model: User, as: "user", attributes: ["nickname"] }],
  });

  let responseData: ResponseData = {
    isSuccess: result ? true : false,
    message: `${placeId} 의 리뷰목록입니다.`,
    data: result ? result : {},
  };
  res.status(201).json(responseData);
};

export const removeReviewById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.params;
  const result = await Review.destroy({
    where: {
      id,
    },
  });

  let responseData: ResponseData = {
    isSuccess: result ? true : false,
    message: ``,
    data: {},
  };
  res.status(200).json(responseData);
};

export const toggleLike = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { userId, placeId } = req.body;
  let result;
  const isExist = await Like.findOne({
    where: {
      userId: Number(userId),
      placeId: Number(placeId),
    },
  });
  if (isExist) {
    await Like.destroy({
      where: {
        userId: Number(userId),
        placeId: Number(placeId),
      },
    });
  } else {
    result = await Like.create({
      userId: Number(userId),
      placeId: Number(placeId),
    });
  }

  let responseData: ResponseData = {
    isSuccess: true,
    message: isExist ? "찜(좋아요) 취소되었습니다." : "찜(좋아요) 하였습니다",
    data: result ? result.toJSON : {},
  };
  res.status(200).json(responseData);
};
