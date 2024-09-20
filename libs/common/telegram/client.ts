import { Telegraf } from "telegraf";
import { container } from "tsyringe";
import { CommandManager, ScheduleManager } from "./managers";
import { Injectable } from "../decorators";
import type { Constructor } from "../interfaces";
import type { Guard } from "./classes";

@Injectable()
export class TelegramClient extends Telegraf {
  constructor(
    private readonly commandManager: CommandManager,
    private readonly scheduleManager: ScheduleManager
  ) {
    super(container.resolve("BOT_TOKEN"));
  }

  useCommandGuards(...guards: Constructor<Guard>[]) {
    this.commandManager.useGuards(...guards);
  }

  useGlobalGuards(...guards: Constructor<Guard>[]) {
    this.useCommandGuards(...guards);
  }

  async launch(onLaunch?: (() => void) | undefined): Promise<void>;
  async launch(
    config: Telegraf.LaunchOptions,
    onLaunch?: (() => void) | undefined
  ): Promise<void>;
  async launch(config?: unknown, onLaunch?: unknown): Promise<void> {
    await this.commandManager.initialize(this);
    await this.scheduleManager.initialize();

    super.launch(config as any, () => {
      this.scheduleManager.start();
    });
  }
}
