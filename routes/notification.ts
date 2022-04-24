import express from "express";
import {sendFCMtoTopic} from "../util/firebase";
import {Notification} from "../model";
import {ResponseData} from "../custom";

const notificationRouter = express.Router();

// - 유저의 알림 모두 조회
notificationRouter.get("/:userId", async (req, res, next) => {
  const { userId } = req.params;
  const messages = await Notification.findAll({
    where:{
      userId
    }
  })

  let responseData: ResponseData = {
    isSuccess: true,
    message: `${userId}의 알림 목록입니다`,
    data: messages,
  };
  res.status(200).json(responseData);
});

notificationRouter.post('/:userId',(req,res)=>{
  sendFCMtoTopic(req.params.userId,req.body.topic as string,{
    title:'라온 네비게이터',
    body:req.body.body,
    type:req.body.topic
  })
  res.send('done!')
})

notificationRouter.delete('/:id',async(req,res)=>{
  const result = Notification.destroy({
    where:{
      id:req.params.id
    }
  })

  let responseData: ResponseData = {
    isSuccess: true,
    message: `삭제성공(없는 id여도 성공만 반환합니다)`,
    data: result,
  };
  res.status(200).json(responseData);
})

export default notificationRouter;
