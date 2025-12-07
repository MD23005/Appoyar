# ====== STAGE 1: build con Maven + JDK 21 ======
FROM maven:3.9.5-eclipse-temurin-21 AS build
WORKDIR /app

# Opcional: aumentar memoria para Maven si fuera necesario
ARG MAVEN_OPTS="-Xmx1024m"
ENV MAVEN_OPTS=${MAVEN_OPTS}

# Copiar pom primero para cache de dependencias
COPY pom.xml ./
COPY .mvn .mvn
COPY mvnw ./mvnw

# Descargar dependencias (capa cacheable)
RUN ./mvnw -B -q -ntp dependency:go-offline

# Copiar fuente y empaquetar
COPY src ./src
RUN ./mvnw -B -q -ntp package -DskipTests

# ====== STAGE 2: runtime con JRE 21 ======
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

# Puerto que usará la app dentro del contenedor
ENV PORT=8080

# Copiamos el JAR generado en la etapa de build
COPY --from=build /app/target/*.jar app.jar

# Carpeta para uploads (opcional)
RUN mkdir -p /uploads && chown -R 1000:1000 /uploads
VOLUME ["/uploads"]

# Exponemos el puerto interno del contenedor
EXPOSE 8080

# Usuario no root (buena práctica; Render lo soporta sin problema)
USER 1000

ENTRYPOINT ["java", "-jar", "app.jar"]
