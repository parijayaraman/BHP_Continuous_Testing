# Build:
# docker build -t birthday_app/birthday .
#
# Run:
# docker run -it birthday_app/birthday
#
# Compose:
# docker-compose up -d

FROM ubuntu:latest
MAINTAINER birthday_app.JS

# 80 = HTTP, 443 = HTTPS, 3000 = birthday_app.JS server, 35729 = livereload, 8080 = node-inspector
EXPOSE 80 443 3000 35729 8080

# Set development environment as default
ENV NODE_ENV development

# Install Utilities
RUN apt-get update -q  \
 && apt-get install -yqq \
 curl \
 git \
 ssh \
 gcc \
 make \
 build-essential \
 libkrb5-dev \
 sudo \
 apt-utils \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install nodejs
RUN curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
RUN sudo apt-get install -yq nodejs \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# Install birthday_app.JS Prerequisites
RUN npm install --quiet -g gulp bower yo mocha karma-cli pm2 && npm cache clean

RUN mkdir -p /opt/birthday_app.js/public/lib
WORKDIR /opt/birthday_app.js

# Copies the local package.json file to the container
# and utilities docker container cache to not needing to rebuild
# and install node_modules/ everytime we build the docker, but only
# when the local package.json file changes.
# Install npm packages
COPY package.json /opt/birthday_app.js/package.json
RUN npm install --quiet && npm cache clean

# Install bower packages
COPY bower.json /opt/birthday_app.js/bower.json
COPY .bowerrc /opt/birthday_app.js/.bowerrc
RUN bower install --quiet --allow-root --config.interactive=false

COPY . /opt/birthday_app.js

# Run birthday_app.JS server
CMD npm install && npm start
