import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as session from 'express-session';
import * as passport from 'passport';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes( new ValidationPipe());
  app.enableCors({origin: 'http://localhost:4200',credentials: true});
  app.use(session({
    secret : "Super_secret",
    resave : false, 
    saveUninitialized : false,
    cookie : {
      maxAge : 1000 * 60 * 24,
      secure : false
    }
  }));
  app.use(passport.session());
  await app.listen(3000); 
}
bootstrap();
