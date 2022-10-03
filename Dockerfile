FROM node:12.21.0

WORKDIR /mirza

COPY package.json yarn.lock /mirza/

RUN yarn && yarn cache clean
RUN npm i --global @adonisjs/cli nodemon
RUN yarn install

EXPOSE 3333

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

COPY . /mirza

CMD adonis serve --dev --watch=app,config,database,providers,resources,start,test
