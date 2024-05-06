# Etapa de Build
FROM node:20-alpine as build

# Define o diretório de trabalho no container para a etapa de build
WORKDIR /usr/src/app

# Copia os arquivos do package.json e package-lock.json (ou yarn.lock)
COPY package*.json ./
COPY yarn.lock ./

# Instala as dependências do projeto
RUN yarn

# Copia o restante dos arquivos do projeto para o diretório de trabalho no container
COPY . .

# Compila a aplicação para produção
RUN yarn build

# Etapa de Runtime
FROM node:20-alpine

# Define o diretório de trabalho no container para a etapa de runtime
WORKDIR /usr/src/app

# Copia os artefatos do build para o diretório de trabalho do container de runtime
COPY --from=build /usr/src/app/dist ./dist
COPY --from=build /usr/src/app/package*.json ./
COPY --from=build /usr/src/app/node_modules ./node_modules

# Expõe a porta que o servidor NestJS vai usar
EXPOSE 3333

# Define o diretório de trabalho para o serviço NestJS
WORKDIR /usr/src/app/

# O comando para iniciar a aplicação
CMD ["node", "dist/main"]