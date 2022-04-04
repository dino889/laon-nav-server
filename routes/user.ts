import express from "express";

const userRouter = express.Router();

// - GET 회원정보 조회(user_id)
userRouter.get("/", (req, res, next) => {
  res.send("GET user");
});

// - POST 회원가입 (social 여부도 포함)
userRouter.post("/", (req, res, next) => {
  res.send("POST user");
});

// - PUT 회원정보 수정(user_id)
userRouter.put("/", (req, res, next) => {
  res.send("PUT user");
});

// - DELETE(user_id)
userRouter.delete("/", (req, res, next) => {
  res.send("DELETE user");
});

// - 이메일 중복확인
userRouter.get("/exist", (req, res, next) => {
  const { email } = req.query;
  res.send(`GET exist email? ${email}`);
});

// - 로그인
userRouter.post("/login", (req, res, next) => {
  res.send("POST user login");
});

// - 패스워드 초기화
userRouter.post("/reset", (req, res, next) => {
  const { password } = req.query;
  res.send(`POST reset password = ${password}`);
});

// - email 인증?

export default userRouter;
