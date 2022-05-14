FROM node:16

WORKDIR app

COPY package*.json .

RUN ["npm","install"]

RUN ["npm","install","-g","pm2"]

RUN ["pm2","install","typescript"]

COPY . .

CMD ["pm2-runtime","app.ts"]

EXPOSE 7878