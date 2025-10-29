# ============================
# BUILD STAGE
# ============================
FROM node:24-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# ============================
# RUN STAGE
# ============================
FROM node:24-alpine AS production

WORKDIR /app

COPY --from=build /app/dist ./dist

COPY package*.json ./

RUN npm install vite --omit=dev

EXPOSE 80

CMD ["npx", "vite", "preview", "--host", "0.0.0.0", "--port", "80"]
