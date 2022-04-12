import fs from "fs";
import { Area, Place } from "../model";

interface Place {
  trrsrtNm: string;
  trrsrtSe: string;
  rdnmadr: string;
  lnmadr: string;
  latitude: string;
  longitude: string;
  ar: string;
  cnvnncFclty: string;
  stayngInfo: string;
  mvmAmsmtFclty: string;
  recrtClturFclty: string;
  hospitalityFclty: string;
  sportFclty: string;
  appnDate: string;
  aceptncCo: string;
  prkplceCo: string;
  trrsrtIntrcn: string;
  phoneNumber: string;
  institutionNm: string;
  referenceDate: string;
  insttCode: string;
}

interface PlaceDB {
  name: string;
  summary: string;
  description: string;
  rating: number;
  heartCount: number;
  lat: number;
  long: number;
  imgURL: string;
  type?: string;
  address: string;
}

function getRandomRate(range: number) {
  return Math.floor(Math.random() * range);
}

export async function placeDataInsert() {
  const data = await fs.promises.readFile("./data/places.json");
  const places: Place[] = JSON.parse(data.toString()).places;
  places.forEach(async (place) => {
    const data: PlaceDB = {
      name: place.trrsrtNm,
      summary: place.trrsrtIntrcn.slice(0, 100),
      description: place.trrsrtIntrcn,
      rating: getRandomRate(5),
      heartCount: getRandomRate(100),
      lat: Number(place.latitude),
      long: Number(place.longitude),
      imgURL: "https://picsum.photos/250/200",
      address: place.lnmadr,
    };
    const result = await Place.create({ ...data });
    console.log(result);
  });
}

export async function areaDataInsert() {
  const areaList = [
    "경기도",
    "경상남도",
    "충청남도",
    "서울특별시",
    "경상북도",
    "전라남도",
    "전라북도",
    "충청북도",
    "인천광역시",
    "전남",
    "부산광역시",
    "대구광역시",
    "강원도",
    "광주광역시",
    "양구군",
    "안동시",
    "울산광역시",
    "경남",
    "대전광역시",
    "제주특별자치도",
    "목포시",
  ];

  areaList.forEach(async (area) => {
    const result = await Area.create({ name: area });
    console.log(result);
  });
}
