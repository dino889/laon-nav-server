import express from "express";
import { Like, Place, PlaceList, PlaceListLike, PlaceListReview, Review, User } from "../model";
import * as SQ from "sequelize";
import { ResponseData } from "../custom";
const Op = SQ.Op;

// sort = reivew, reivew_asc (default : rating)
export const getPlaceListByArea = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  let { areaName, sort } = req.query;

  if (!sort) {
    sort = "default";
  }
  const orderOption: any = {
    default: [["rating", "DESC"]],
    reivew: [[SQ.Sequelize.literal("reivewCnt"), "DESC"]],
    reivew_asc: [[SQ.Sequelize.literal("reivewCnt"), "ASC"]],
  };

  const result = await PlaceList.findAll({
    where: {
      name: {
        [Op.like]: `${areaName}%`,
      },
    },
    attributes: [
      "id",
      "name",
      "description",
      "heartCount",
      "rating",
      "imgURL",
      "type",
      "placeIdList",
      [SQ.Sequelize.fn("COUNT", SQ.Sequelize.col("place_list_reviews.id")), "reivewCnt"],
    ],
    include: {
      model: PlaceListReview,
      attributes: [],
    },
    group: ["id"],
    order: orderOption[sort as string],
    // ["rating", "DESC"]
  });
  let responseData: ResponseData = {
    isSuccess: true,
    message: `${areaName} 지역의 추천경로들 입니다`,
    data: result,
  };
  res.status(200).json(responseData);
};

export const getLikedPlaceListByUserId = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) => {
  const { userid } = req.params;
  const result = await PlaceListLike.findAll({
    where: {
      userId: Number(userid),
    },
    attributes: [],
    include: { model: PlaceList },
  });
  let responseData: ResponseData = {
    isSuccess: true,
    message: `${userid} 유저의 찜한 경로 리스트입니다`,
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

export const togglePlaceListLike = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { userId, placeListId } = req.body;
  let result;
  const isExist = await PlaceListLike.findOne({
    where: {
      userId: Number(userId),
      placeListId: Number(placeListId),
    },
  });
  if (isExist) {
    await PlaceListLike.destroy({
      where: {
        userId: Number(userId),
        placeListId: Number(placeListId),
      },
    });
    await PlaceList.decrement("heartCount", {
      by: 1,
      where: {
        id: Number(placeListId),
      },
    });
  } else {
    result = await PlaceListLike.create({
      userId: Number(userId),
      placeListId: Number(placeListId),
    });

    await PlaceList.increment("heartCount", {
      by: 1,
      where: {
        id: Number(placeListId),
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

export const initPlaceList = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const areaList = [
    "대구광역시",
    "경기도",
    "부산광역시",
    "인천광역시",
    "전라남도",
    "서울특별시",
    "경상북도",
    "전라북도",
    "제주도",
    "경상남도",
  ];

  areaList.forEach(async (area) => {
    const areaName = area;
    const result: { [key: string]: any } = await Place.findAll({
      where: {
        address: {
          [Op.like]: `${areaName}%`,
        },
      },
    });
    const total = result.length; // 9

    let startPoint = 0;
    for (let i = 0; i < total / 4; i++) {
      let placeIdlist: number[] | string = [
        result[startPoint].id,
        result[startPoint + 1].id,
        result[startPoint + 2].id,
        result[startPoint + 3].id,
      ];
      placeIdlist = JSON.stringify(placeIdlist);
      const placeList = await PlaceList.create({
        name: `${areaName} 추천 경로${i + 1}`,
        description: `올해의 ${areaName} 추천 경로입니다`,
        rating: Math.floor(Math.random() * 5),
        imgURL: result[startPoint].imgURL,
        type: result[startPoint].type,
        placeIdList: placeIdlist,
      });

      placeList.save();
      startPoint += 4;
    }
  });
  res.status(200).json("done");
};
