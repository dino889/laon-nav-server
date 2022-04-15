import express from "express";
import {
  checkEmailExist,
  createUser,
  getUserById,
  removeUserById,
  updateUserById,
  handleLogin,
  verifyToken,
  getUserFromEmailandUserName,
} from "../controller/user";

const userRouter = express.Router();

userRouter.get("/exist", checkEmailExist); // - 이메일 중복확인

userRouter.get("/find", getUserFromEmailandUserName);

userRouter.get("/verify", verifyToken); // 토큰 유효성 검사

userRouter.get("/:id", getUserById); // - GET 회원정보 조회(user_id)

userRouter.post("/", createUser); // - POST 회원가입 (social 여부도 포함) ** 소셜로그인일 경우 uid가 password로 들어옴

userRouter.put("/:id", updateUserById); // - PUT 회원정보 수정(user_id)

userRouter.delete("/:id", removeUserById); // - DELETE(user_id)

userRouter.post("/login", handleLogin); // - 로그인

export default userRouter;
