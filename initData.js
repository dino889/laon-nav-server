const fs = require("fs");
const cheerio = require("cheerio");
const request = require("request-promise");
const axios = require("axios");

async function placeJoinURL() {
  //   let data = await fs.promises.readFile("./data/place-names.json", { encoding: "utf8" });
  //   data = JSON.parse(data);
  // data.forEach((d) => {
  //   console.log(d);
  // });

  const placeName = "심우장";
  const url = `https://search.naver.com/search.naver?where=image&sm=tab_jum&query=${encodeURI(placeName)}`;
  console.log(url);
  axios
    .get(url)
    .then((res) => {
      const $ = cheerio.load(res.data);
      //   console.log(res.data);
      console.log($(".photo_tile _grid").html());
    })
    .catch((e) => {
      console.log(e);
    });

  // data = JSON.stringify(data);
  // let wr = await fs.promises.writeFile("./data/place-names.json", data);
}

placeJoinURL();
// https://www.google.com/search?q=&tbm=isch
