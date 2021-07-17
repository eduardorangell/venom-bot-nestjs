import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import env from '@environments';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [env], cache: true }),
    MulterModule.register({
      dest: env().FILE_UPLOAD_DIR,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
