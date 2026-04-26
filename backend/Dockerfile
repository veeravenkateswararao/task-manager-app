# Stage 1: Install Dependencies
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .


# Stage 2: Production Runtime
FROM node:18-alpine

WORKDIR /app

COPY --from=builder /app ./

EXPOSE 4000

CMD ["npm", "run", "dev"]
