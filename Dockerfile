FROM node:16

WORKDIR app

COPY . .

RUN ["npm","install"]

RUN ["npm","install","pm2"]

RUN ["npx","pm2", "install", "typescript"]

CMD ["npm","start"]

EXPOSE 7878