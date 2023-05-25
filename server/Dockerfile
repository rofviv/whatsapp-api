FROM node:18-buster

RUN apt-get update && \
  apt-get install -y \
  chromium \
  libatk-bridge2.0-0 \
  libxkbcommon0 \
  libwayland-client0 \
  libgtk-3-0 && \
  rm -rf /var/lib/apt/lists/*

COPY package.json .
COPY package-lock.json .

RUN npm install

COPY . .

EXPOSE 5004

CMD ["npm", "start"]

# docker run -dp 5004:5004 --name wp-server rofviv/server-whatsapp
