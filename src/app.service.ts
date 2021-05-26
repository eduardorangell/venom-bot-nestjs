import { Injectable, Logger } from '@nestjs/common';
import * as venom from 'venom-bot';

@Injectable()
export class AppService {
  public cliente: any;
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
          browserArgs: ['--no-sandbox'], // Parameters to be added into the chrome browser instance
          puppeteerOptions: {}, // Will be passed to puppeteer.launch
          logQR: true, // Logs QR automatically in terminal
          disableWelcome: true, // Will disable the welcoming message which appears in the beginning
          updatesLog: true, // Logs info updates automatically in terminal
          autoClose: 60000, // Automatically closes the venom-bot only when scanning the QR code (default 60 seconds, if you want to turn it off, assign 0 or false)
          createPathFileToken: true,
          waitForLogin: true,
        },
      )
      .then((client) => {
        // Exporting client so external functions can use it
        this.cliente = client;
        this.start(this.cliente);
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

  start(client: any) {
    this.cliente.onMessage((message: any) => {
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

  /* Envia mensagem de texto */
  async enviarMensagem(phone: string, text: string) {
    return await this.cliente
      .sendText(phone, text)
      .then((result: any) => {
        console.log('Result: ', result);
        return result; //return object success
      })
      .catch((erro: any) => {
        console.error('Error when sending: ', erro);
        return erro; //return object error
      });
  }
}
