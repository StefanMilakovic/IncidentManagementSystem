FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY out/artifacts/discovery_server_jar/discovery-server.jar app.jar
EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]