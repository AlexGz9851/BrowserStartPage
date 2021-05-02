import { Logger } from '@overnightjs/logger';

class GeneralError extends Error {
  timestamp = new Date().getTime();
  code: string;
  serverMessage?: string;
  message: string;
  constructor(clientMessage: string, serverMessage: string, code: string, showCode: boolean = true) {
    super()
    this.code = code ? code + this.timestamp : this.timestamp + "";
    this.serverMessage = `${this.code} -- ${serverMessage} `;
    this.message = showCode ? `${this.code} -- ${clientMessage} ` : clientMessage;
    if (showCode) {
      Logger.Err(this.serverMessage)
      Logger.Err(this, true);
    }
  }

}

export default GeneralError;