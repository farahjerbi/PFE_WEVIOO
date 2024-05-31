FROM openjdk:18
ADD target/*.jar  PushMS-docker.jar
EXPOSE 8092
CMD ["java", "-jar", "PushMS-docker.jar"]