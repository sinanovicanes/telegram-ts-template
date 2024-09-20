import { Logger } from "@app/common/logger";
import { Command } from "../classes";
import { CommandLoader } from "../loaders";
import type { TelegramClient } from "../client";

export class CommandManager {
  constructor(private readonly client: TelegramClient) {}

  private readonly logger = new Logger(CommandManager.name);
  private readonly commands: Map<Command["name"], Command> = new Map();

  private loadCommand(command: Command) {
    this.commands.set(command.name, command);

    this.client.command(command.name, async ctx => {
      try {
        await command.handler(ctx);
      } catch (e) {
        this.logger.error(`Failed to execute command ${command.name}: ${e}`);
      }
    });
  }

  async initialize() {
    const commands = await CommandLoader.load("src/commands/**/*.ts");

    for (const command of commands) {
      this.loadCommand(command);
    }

    this.logger.info(`Loaded ${this.commands.size} commands`);
  }
}
