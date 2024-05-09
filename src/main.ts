import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomValidationPipe } from './class-validation.pipe';
import { EitherExceptionFilter } from './error-handler';
import { Logger } from '@nestjs/common';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
    autoFlushLogs: true,
  });
  app.setGlobalPrefix('v1');
  app.enableCors();
  // Middleware para logar a rota chamada
  app.use((req, res, next) => {
    res.on('finish', () => {
      Logger.log(`${req.method} ${req.originalUrl}`, 'RouteCalled');
    });
    next();
  });

  app.useGlobalPipes(new CustomValidationPipe());

  const httpAdapterHost = app.get(HttpAdapterHost);

  app.useGlobalFilters(new EitherExceptionFilter(httpAdapterHost));

  const config = new DocumentBuilder()
    .setTitle('e-commerce')
    .setDescription('The e-commerce API description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/api', app, document);

  await app.listen(process.env.PORT);
}
bootstrap();
