FROM node:16-slim

RUN apt update \
    && apt -y install \
        sudo \
        git \
        default-jre

RUN npm install -g npm