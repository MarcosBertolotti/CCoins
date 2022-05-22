FROM node:16.14.2

WORKDIR /app

RUN npm install -g @angular/cli@12.2.17

EXPOSE 4200

CMD ["ng", "serve", "--port", "4200", "--host", "0.0.0.0"]