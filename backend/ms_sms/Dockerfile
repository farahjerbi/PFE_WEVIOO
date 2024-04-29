FROM openjdk:18
ADD target/*.jar  SmsMS-docker.jar
EXPOSE 8092
CMD ["java", "-jar", "SmsMS-docker.jar"]