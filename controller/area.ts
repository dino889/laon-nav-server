import express from "express";
import { ResponseData } from "../custom";
import { Area } from "../model";

export const getAreaAll = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const result = await Area.findAll();
  let responseData: ResponseData = {
    isSuccess: true,
    message: "",
    data: result,
  };
  res.status(200).json(responseData);
};
