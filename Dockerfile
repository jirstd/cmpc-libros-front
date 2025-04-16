# Etapa de desarrollo
FROM node:18

# Crear directorio de trabajo
WORKDIR /app

# Copiar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del proyecto
COPY . .

# Exponer puerto del Vite dev server
EXPOSE 5173

# Comando para entorno de desarrollo
CMD ["npm", "run", "dev", "--", "--host"]
