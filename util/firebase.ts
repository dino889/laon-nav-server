import { initializeApp } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'
import {credential} from "firebase-admin";
import {Notification, User} from "../model";
const serviceAccount = require("../fbkey.json");

const jiwooToken = 'dX_PCzgCSyaMWPtF7BQiW9:APA91bGG2L5NTyudbaeES9clAhn89P7pQ86ZM8vHEo1BL1ixULxKwPNYrPHg9FowQRdleLk_vkVk-8LsILjiLmjZ6uFa8oydI_v3HJHLwSfsU8pLUuUiZOu0CSWdDh9cds53pJvKBiGk';
const boToken = 'eYII9TlUShCkQcBo4N8Q5W:APA91bFyoRLpirrhlSLVCeGhfvTSV82q3Iftg81H9S-UA1bXjZVxbUZ1rPVhTbgiNiNXA5dHrDIeHuDk3VYi4kOLA_HqpL4LjK-F2bHEEU7EHLJp88lr_TEZDrkLVPQ45Iv5eoGPaYDj';

const app = initializeApp({
    credential: credential.cert(serviceAccount)
});
const messaging = getMessaging(app);

export async function sendFCMtoTopic(userid:string,topic:string,data:{[key:string]:string}){
    const target:any = await User.findByPk(Number(userid));
    const userToken = target.dataValues.token;
    const message = {
        notification:{
            title:data.title,
            body:data.body
        },
        data,
        // token:userToken,
        topic
    };
    messaging.send(message).then((response:string)=>{
        console.log('메세지 전송 성공 : ' ,response);
        Notification.create({
            userId:userid,
            ...data
        }).catch(console.log)
    }).catch((e:any)=>{
        console.log('메세지 전송 에러 : ',e)
    })
}

