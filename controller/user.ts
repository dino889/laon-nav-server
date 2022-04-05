import express from "express";
import { ResponseData } from "../custom";
import { User } from "../model";
import tokenManager from "../util/jwt";

export const createUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { email, password, username, nickname, social_type } = req.body;
  const newUser = await User.create({
    email,
    password,
    username,
    nickname,
    social_type,
  });

  newUser.save();

  const responseData: ResponseData = {
    isSuccess: true,
    message: "create user successful",
    data: newUser.toJSON(),
  };

  res.status(201).json(responseData);
};

export const getUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.params;
  const selected = await User.findByPk(id);

  let responseData: ResponseData;
  if (selected) {
    responseData = {
      isSuccess: true,
      message: "",
      data: selected.toJSON(),
    };
  } else {
    responseData = {
      isSuccess: false,
      message: `there is no user(${id})`,
      data: {},
    };
    return res.status(400).json(responseData);
  }

  res.status(200).json(responseData);
};

export const updateUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.params;
  let responseData: ResponseData;
  const result = await User.update(
    { ...req.body },
    {
      where: {
        id,
      },
    }
  );
  console.log(result[0]);

  if (result[0] > 0) {
    responseData = {
      isSuccess: true,
      message: `update successful user(${id})`,
      data: {},
    };
  } else {
    responseData = {
      isSuccess: false,
      message: `nothing to updated with user(${id})`,
      data: {},
    };
    return res.status(400).json(responseData);
  }

  res.status(200).json(responseData);
};

export const removeUserById = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { id } = req.params;
  let responseData: ResponseData;
  const result = await User.destroy({
    where: {
      id,
    },
  });

  if (result > 0) {
    responseData = {
      isSuccess: true,
      message: `delete successful user(${id})`,
      data: {},
    };
  } else {
    responseData = {
      isSuccess: false,
      message: `there is no user(${id})`,
      data: {},
    };
    return res.status(404).json(responseData);
  }

  res.status(200).json(responseData);
};

export const checkEmailExist = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const targetEmail = req.query.email as string;

  let responseData: ResponseData;

  const result = await User.findOne({
    where: {
      email: targetEmail,
    },
  });

  if (result) {
    responseData = {
      isSuccess: true,
      message: `exist email(${targetEmail})`,
      data: {},
    };
  } else {
    responseData = {
      isSuccess: false,
      message: `there is no email(${targetEmail})`,
      data: {},
    };
    return res.status(200).json(responseData);
  }

  res.status(200).json(responseData);
};

export const handleLogin = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { email, password }: { email: string; password: string } = req.body;
  let responseData: ResponseData;

  const result = await User.findOne({
    attributes: ["id", "email", "username", "nickname", "social_type"],
    where: {
      email: email,
      password,
    },
  });

  if (result) {
    const userData = result.toJSON();
    const newToken: string = tokenManager.createToken(userData.id, userData.username, userData.email);
    console.log(newToken);

    responseData = {
      isSuccess: true,
      message: `login success`,
      data: { ...userData, token: newToken },
    };
  } else {
    responseData = {
      isSuccess: false,
      message: `there is no user (${email}, ${password}), check your email or password`,
      data: {},
    };
    return res.status(400).json(responseData);
  }
  res.status(200).json(responseData);
};

export const verifyToken = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const { authorization } = req.headers;
  const token = authorization?.split(" ")[1]!;
  const decoded = tokenManager.verifyToken(token);
  console.log(decoded);
  res.json(decoded);
};
