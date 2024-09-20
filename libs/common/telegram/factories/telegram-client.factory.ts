import { TelegramClient } from "../client";

export class TelegramClientFactory {
  static create(token: string) {
    return new TelegramClient(token);
  }
}
