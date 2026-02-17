FROM node:20-alpine AS react-build
WORKDIR /workspace/react
COPY react/package.json react/package-lock.json ./
RUN npm ci
COPY react/ ./
RUN npm run build

FROM gradle:8.7-jdk17 AS build
WORKDIR /workspace
COPY . .
COPY --from=react-build /workspace/react/dist ./src/main/resources/static
RUN ./gradlew installDist --no-daemon

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=build /workspace/build/install/srodenas-sample-employee2 /app
EXPOSE 8080
CMD ["/app/bin/srodenas-sample-employee2"]
