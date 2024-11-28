FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
ARG BRUSNIKA_TECH_NPM_TOKEN=00000000-0000-0000-0000-000000000000
ENV BRUSNIKA_TECH_NPM_TOKEN=$BRUSNIKA_TECH_NPM_TOKEN
RUN npm run build

FROM node:20-alpine AS backend
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 4000
CMD [ "npm", "run", "start:prod" ]
