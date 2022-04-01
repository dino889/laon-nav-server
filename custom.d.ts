// 프론트에서 요청한 response 규격
export interface ResponseData {
  isSuccess: boolean;
  message: string;
  data: object;
}

// 지역 데이터 타입
export interface Area {
  id: number;
  name: String;
  img: String;
  lat: number;
  lng: number;
}
