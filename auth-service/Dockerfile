FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY out/artifacts/auth_service_jar/auth-service.jar app.jar
EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]