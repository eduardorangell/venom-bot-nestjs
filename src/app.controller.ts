import {
  Controller,
  Post,
  Body,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerOptions } from './helpers/multer.config';
import { AppService } from './app.service';
import env from '@environments';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  /* Just sending a text */
  @Post('send-text')
  async sendText(@Body() body: { phone: number; text: string }) {
    return await this.appService.sendTextMessage(body.phone, body.text);
  }

  /* Post to send an image by sendind an url */
  @Post('send-image')
  @UseInterceptors(FilesInterceptor('files', env().MAX_FILES, multerOptions))
  async sendImg(@UploadedFiles() files: any, @Body() body: any) {
    /* returning the file to venom so the service can upload */
    const data = JSON.parse(body.body);
    const verified = await this.appService.isValidNumber(
      +data.phone?.replace(/\D/g, ''),
    );
    let result = '';
    if (verified.canReceiveMessage === false) {
      await this.appService.deleteFile(files[0]?.path);
      result = 'Invalid number';
    }

    if (verified.canReceiveMessage === true) {
      result = await this.appService.sendImageMessage(
        +data.phone?.replace(/\D/g, ''),
        files[0]?.path,
        files[0]?.originalFilename,
        data.caption,
      );
      await this.appService.deleteFile(files[0]?.path);
    }

    return result;
  }

  /* Post send image in base64 version */
  @Post('send-img-base-64')
  async sendImgBase64(
    @Body() body: { phone: number; base64: string; fileName: string },
  ) {
    return await this.appService.sendBase64Image(
      body.phone,
      body.base64,
      body.fileName,
    );
  }

  /* Checking if is a valid whatsapp number */
  @Post('is-valid-number')
  async isValidNumber(@Body() body: { phone: number }): Promise<boolean> {
    const result = await this.appService.isValidNumber(body.phone);
    return result.canReceiveMessage;
  }
}
