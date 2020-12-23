FROM node:12
# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

#install dependencies
RUN npm install

# Bundle app source
COPY . .

# expose ports
EXPOSE 5000

CMD [ "npm", "run dev" ]
