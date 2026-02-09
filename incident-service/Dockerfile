FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY out/artifacts/incident_service_jar/incident-service.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]