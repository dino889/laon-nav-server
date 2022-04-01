// 프론트에서 요청단 response 규격
export interface ResponseData {
  success: "t" | "f";
  message: string;
  data: object;
}
