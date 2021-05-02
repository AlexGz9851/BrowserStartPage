import { Logger } from '@overnightjs/logger';
import { GraphQLError } from 'graphql';

class GeneralError extends GraphQLError {
  timestamp = new Date().getTime();
  code: string;
  serverMessage?: string;
  constructor(clientMessage: string, serverMessage: string, code: string, showCode: boolean = true) {
    super("")
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