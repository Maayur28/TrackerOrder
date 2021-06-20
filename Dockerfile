FROM node:14-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
ENV TOKEN_SECRET=804612ec03a367985477dc14e8e5dd24ae809daa812ac263733f8d0815e3e6df319aafad7735c5c4d0af387751f931443f642a6d3858d604e2a3fd71c5cb386b
ENV PORT=2222 
ENV email=pricetracking28@gmail.com
ENV password=M@yur2821
ENV URL=mongodb+srv://Mayur28:Mayur2821@cluster0.bun1u.mongodb.net/PriceTracker?retryWrites=true&w=majority
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 2222
CMD [ "node", "app.js" ]