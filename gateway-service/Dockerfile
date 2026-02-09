FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY out/artifacts/gateway_service_jar/gateway-service.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]