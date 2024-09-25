FROM node:20-slim 

WORKDIR /app/medusa

ARG MEDUSA_BACKEND_URL=http://localhost:9000
ENV MEDUSA_BACKEND_URL=$MEDUSA_BACKEND_URL

#COPY package.json yarn.lock ./
COPY package.json ./

RUN apt-get update && apt-get install -y curl \
  && curl -o- -L https://yarnpkg.com/install.sh | bash \
  && apt-get clean

ENV PATH="/root/.yarn/bin:/root/.config/yarn/global/node_modules/.bin:${PATH}"

#RUN yarn set version 3.2.1
#RUN yarn --version

RUN yarn install --frozen-lockfile
RUN yarn global add @medusajs/medusa-cli@preview

COPY . .

RUN chown -R 1000:3000 /app/medusa
RUN yarn build

USER 1000:3000

CMD ["sh", "-c", "yarn migrations && yarn start"]
