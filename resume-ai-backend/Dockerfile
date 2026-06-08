# Stage 1 — Build
FROM eclipse-temurin:24-jdk-alpine AS build
WORKDIR /app

COPY pom.xml .
COPY .mvn/ .mvn/
COPY mvnw .
RUN chmod +x mvnw

# Download dependencies first (better layer caching)
RUN ./mvnw dependency:go-offline -B

COPY src ./src
RUN ./mvnw clean package -DskipTests

# Stage 2 — Run
FROM eclipse-temurin:24-jre-alpine
WORKDIR /app

COPY --from=build /app/target/resume-ai-backend-0.0.1-SNAPSHOT.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]