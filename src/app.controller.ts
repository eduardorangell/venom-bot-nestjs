import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private appService: AppService) {}

  @Post('enviar')
  async texto(@Body() body: { phone: string; text: string }) {
    return await this.appService.enviarMensagem(body.phone, body.text);
  }
}
