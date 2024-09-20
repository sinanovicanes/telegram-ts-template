import { Telegraf } from "telegraf";
import { CommandManager } from "./managers";

export class TelegramClient extends Telegraf {
  private readonly commandManager: CommandManager = new CommandManager(this);

  constructor(token: string) {
    super(token);
  }

  async launch(onLaunch?: (() => void) | undefined): Promise<void>;
  async launch(
    config: Telegraf.LaunchOptions,
    onLaunch?: (() => void) | undefined
  ): Promise<void>;
  async launch(config?: unknown, onLaunch?: unknown): Promise<void> {
    await this.commandManager.initialize();
    await super.launch(config as any, onLaunch as any);
  }
}
