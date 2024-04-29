FROM openjdk:18

COPY target/*.jar  /app.jar

EXPOSE 8099

ENTRYPOINT ["java", "-jar", "/app.jar"]