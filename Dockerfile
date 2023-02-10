FROM node:lts-alpine AS builder

WORKDIR /build/
COPY . /build/
RUN yarn install --frozen-lockfile && yarn build

FROM node:lts-alpine
WORKDIR /app/
COPY --from=builder /build/package.json /build/yarn.lock /app/
COPY --from=builder /build/dist /app/dist
RUN yarn install --frozen-lockfile --production=true
EXPOSE 8080
CMD yarn serve