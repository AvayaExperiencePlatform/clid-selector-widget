FROM node:18-alpine as build 
WORKDIR /app
COPY package.json package.json
RUN yarn install
COPY . .
ENV NODE_ENV=production
RUN npm run build

FROM nginx:1.19.2-alpine
WORKDIR /
COPY --from=build /app/entrypoint.sh ./entrypoint.sh
COPY --from=build /app/build /build
COPY server.conf /etc/nginx/conf.d/server.conf
ENTRYPOINT ["/bin/sh"]
CMD ["./entrypoint.sh"]
EXPOSE 8443