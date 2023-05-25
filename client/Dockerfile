FROM node:18-buster

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]

# docker run --env REACT_APP_API_URL=http://localhost:5004 -dp 5000:3000 --name client rofviv/client-whatsapp
