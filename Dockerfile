FROM node:12.18.3-alpine as build 
WORKDIR /app
COPY package.json package.json
COPY package-lock.json package-lock.json
RUN npm install --force
COPY . .
ENV NODE_ENV=production
ARG PORT=8443
RUN npm run build

FROM nginx:1.19.2-alpine
WORKDIR /
COPY --from=build /app/entrypoint.sh ./entrypoint.sh
COPY --from=build /app/build /build
COPY server.conf /etc/nginx/conf.d/server.conf
ENTRYPOINT ["/bin/sh"]
CMD ["./entrypoint.sh"]
EXPOSE 8443