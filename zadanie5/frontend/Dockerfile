FROM node:18.16.0

RUN mkdir frontend
WORKDIR frontend

COPY ./public /frontend/public
COPY ./src /frontend/src
COPY ./index.html /frontend/index.html
COPY ./package.json /frontend/package.json
COPY ./package-lock.json /frontend/package-lock.json
COPY ./tsconfig.json /frontend/tsconfig.json
COPY ./tsconfig.node.json /frontend/tsconfig.node.json
COPY ./vite.config.ts /frontend/vite.config.ts

RUN npm ci --ignore-scripts

RUN chown -R node:node /frontend
RUN chmod -R 755 /frontend

USER node

EXPOSE 5173

CMD ["npm", "run", "dev"]