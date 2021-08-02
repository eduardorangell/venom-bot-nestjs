import { Injectable, Logger } from '@nestjs/common';
import * as venom from 'venom-bot';
import * as fs from 'fs';

@Injectable()
export class AppService {
  public exportedClient: any;
  constructor() {
    venom
      .create(
        // session name
        'support',
        (attempts) => {
          Logger.log('Number of attempts to read the qrcode: ', attempts);
        },
        // statusFind
        (statusSession, session) => {
          Logger.log('Status Session: ', statusSession); //return isLogged || notLogged || browserClose || qrReadSuccess || qrReadFail || autocloseCalled || desconnectedMobile || deleteToken
          //Create session wss return "serverClose" case server for close
          Logger.log('Session name: ', session);
        },
        {
          folderNameToken: 'tokens', //folder name when saving tokens
          mkdirFolderToken: '', //folder directory tokens, just inside the venom folder, example:  { mkdirFolderToken: '/node_modules', } //will save the tokens folder in the node_modules directory
          headless: true, // Headless chrome
          devtools: false, // Open devtools by default
          useChrome: false, // If false will use Chromium instance
          debug: false, // Opens a debug session
          browserWS: '', // If u want to use browserWSEndpoint
          browserArgs: ['--no-sandbox', '--disable-setuid-sandbox'], // Parameters to be added into the chrome browser instance
          puppeteerOptions: {},
          logQR: true, // Logs QR automatically in terminal
          disableSpins: false,
          disableWelcome: true, // Will disable the welcoming message which appears in the beginning
          updatesLog: true, // Logs info updates automatically in terminal
          autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
          createPathFileToken: true,
          waitForLogin: true,
        },
      )
      .then((client) => {
        // Exporting client so external functions can use it
        this.exportedClient = client;
        this.start(this.exportedClient);
        // Answer for incoming calls
        client.onStateChange((state) => {
          Logger.log('State changed: ', state);
          // force whatsapp take over
          if ('CONFLICT'.includes(state)) client.useHere();
          // detect disconnect on whatsapp
          if ('UNPAIRED'.includes(state)) Logger.log('logout');
        });
        // function to detect incoming call
        client.onIncomingCall(async (call) => {
          Logger.log(call);
          client.sendText(
            call.peerJid,
            'Me Desculpe, eu ainda não posso receber ligações',
          );
        });
        // Para fechar corretamente
        process.on('SIGINT', () => client.close());
      })
      .catch((erro) => {
        Logger.log(erro);
      });
  }

  /* Start Funcion to reply when get a 'Hi' */
  start(client: any) {
    this.exportedClient.onMessage((message: any) => {
      if (message.body === 'Hi' && message.isGroupMsg === false) {
        client
          .sendText(message.from, 'Welcome Venom 🕷')
          .then((result: any) => {
            console.log('Result: ', result); //return object success
          })
          .catch((erro: any) => {
            console.error('Error when sending: ', erro); //return object error
          });
      }
    });
  }

  /* Send text message */
  async sendTextMessage(phone: number, text: string) {
    return await this.exportedClient
      .sendText(`${phone}@c.us`, text)
      .then((result: any) => {
        console.log('Result: ', result);
        return result; //return object success
      })
      .catch((erro: any) => {
        console.error('Error when sending: ', erro);
        return erro; //return object error
      });
  }

  /* Send image */
  async sendImageMessage(
    phone: number,
    imageUrl: string,
    fileName: string,
    caption: string,
  ) {
    return await this.exportedClient
      .sendImage(`${phone}@c.us`, imageUrl, fileName, caption)
      .then((result: any) => {
        Logger.log(`Result: ${result}`);
        return result;
      })
      .catch((err: any) => {
        Logger.log(`Error: ${err}`);
        return err;
      });
  }

  /* Send image in base64 format */
  async sendBase64Image(phone: number, base64Image: string, fileName: string) {
    return await this.exportedClient
      .sendImageFromBase64(`${phone}@c.us`, base64Image, fileName)
      .then((result: any) => {
        Logger.log(`Result: ${result}`);
        return result;
      })
      .catch((err: any) => {
        Logger.log(`Error: ${err}`);
        return err;
      });
  }

  /* Function to check if this number is a valid whatsapp number  */
  async isValidNumber(phone: number) {
    return await this.exportedClient
      .checkNumberStatus(`${phone}@c.us`)
      .then((result: any) => {
        Logger.log(`Result isValidNumber: ${JSON.stringify(result)}`);
        return result;
      })
      .catch((erro: any) => {
        Logger.log(`Result isValidNumber: ${JSON.stringify(erro)}`);
        return erro;
      });
  }

  /* Delete file */
  async deleteFile(filePath: string) {
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        Logger.log(`File ${filePath} deleted`);
      } else {
        Logger.log(`File ${filePath} do not exist`);
      }
    } catch (error) {
      Logger.log(error);
    }
  }
}
