FROM node:20-alpine AS builder
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . ./
ARG BRUSNIKA_TECH_NPM_TOKEN=00000000-0000-0000-0000-000000000000
ENV BRUSNIKA_TECH_NPM_TOKEN=$BRUSNIKA_TECH_NPM_TOKEN
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS backend
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/prisma ./prisma
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3000
CMD [ "npm", "run", "start:migrate:prod" ]
