import express from "express";
import { Like, Place, Review, sequelize, User } from "../model";
import * as SQ from "sequelize";
import { ResponseData } from "../custom";
const Op = SQ.Op;

// sort = reivew, reivew_asc (default : rating)
export const getPlaceByArea = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let { areaName, sort } = req.query;

  if (!sort) {
    sort = "default";
  }
  const orderOption: any = {
    default: [["rating", "DESC"]],
    reivew: [[SQ.Sequelize.literal("reivewCnt"), "DESC"]],
    reivew_asc: [[SQ.Sequelize.literal("reivewCnt"), "ASC"]],
  };

  const result = await Place.findAll({
    where: {
      address: {
        [Op.like]: `${areaName}%`,
      },
    },
    attributes: [
      "id",
      "name",
      "summary",
      "description",
      "heartCount",
      "rating",
      "lat",
      "long",
      "imgURL",
      "type",
      "address",
      [SQ.Sequelize.fn("COUNT", SQ.Sequelize.col("reviews.id")), "reivewCnt"],
    ],
    include: {
      model: Review,
      attributes: [],
    },
    group: ["id"],
    order: orderOption[sort as string],
    // ["rating", "DESC"]
  });
  let responseData: ResponseData = {
    isSuccess: true,
    message: `${areaName} 지역의 장소리스트입니다`,
    data: result,
  };
  res.status(200).json(responseData);
};

export const getLikedPlaceByUserId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { userid } = req.params;
  const result = await Like.findAll({
    where: {
      userId: Number(userid),
    },
    attributes: [],
    include: { model: Place },
  });
  let responseData: ResponseData = {
    isSuccess: true,
    message: `${userid}유저의 찜한 장소리스트입니다`,
    data: result,
  };
  res.status(200).json(responseData);
};

export const getCategory = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const result = await Place.findAll({
    attributes: ["type"],
    group: ["type"],
  });
  let responseData: ResponseData = {
    isSuccess: true,
    message: `장소의 모든 카테고리 목록입니다`,
    data: result.map((r: any) => r.type),
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

export const getPlaceByIdArray = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { arr } = req.params;
  const result = await Place.findAll({
    where: {
      id: JSON.parse(arr),
    },
  });
  console.log(result);
  let responseData: ResponseData = {
    isSuccess: result ? true : false,
    message: ``,
    data: result,
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
    await Place.decrement("heartCount", {
      by: 1,
      where: {
        id: Number(placeId),
      },
    });
  } else {
    result = await Like.create({
      userId: Number(userId),
      placeId: Number(placeId),
    });

    await Place.increment("heartCount", {
      by: 1,
      where: {
        id: Number(placeId),
      },
    });
  }

  let responseData: ResponseData = {
    isSuccess: true,
    message: isExist ? "찜(좋아요) 취소되었습니다." : "찜(좋아요) 하였습니다",
    data: result ? { ...result.toJSON } : {},
  };
  res.status(200).json(responseData);
};

// sort = reivew, reivew_asc (default : rating)
export const getPlaceByGPS = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let { lat, long, range } = req.query;

  const result = await sequelize.query(
    `SELECT * , (6371 * acos(cos(radians(${lat})) * cos(radians(places.lat)) * cos(radians(places.long) - radians(${long})) + sin(radians(${lat}))*sin(radians(places.lat)))) AS distance FROM places HAVING distance <= ${range} ORDER BY distance;`,
    { type: SQ.QueryTypes.SELECT }
  );
  let responseData: ResponseData = {
    isSuccess: true,
    message: `${lat} ${long} 위치의 장소리스트입니다`,
    data: result,
  };
  res.status(200).json(responseData);
};
