FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY out/artifacts/moderation_service_jar/moderation-service.jar app.jar
EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]