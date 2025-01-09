FROM node:18-slim AS build

ENV NPM_CONFIG_UPDATE_NOTIFIER=false
ENV NPM_CONFIG_FUND=false
# ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . ./

# Specify any needed environment variables here
ARG VITE_API_URL

RUN npm run build

COPY --from=build /app/dist /app/dist

CMD [ "run", "--config", "--adapter"]