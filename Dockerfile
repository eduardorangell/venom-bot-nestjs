FROM buildkite/puppeteer AS BUILD

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . ./
RUN npm run build && npm prune --production

FROM buildkite/puppeteer
WORKDIR /app
ENV NODE_ENV=production
COPY --from=BUILD /app/node_modules /app/node_modules
COPY --from=BUILD /app/dist /app/dist

EXPOSE 3000
ENTRYPOINT [ "node" ]
CMD [ "dist/main.js" ]