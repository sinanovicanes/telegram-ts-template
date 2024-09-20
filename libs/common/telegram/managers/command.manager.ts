import { Logger } from "@app/common/logger";
import { Command } from "../classes";
import { CommandLoader } from "../loaders";
import { Injectable } from "@app/common/decorators";
import type { TelegramClient } from "../client";
import { BaseManager } from "./base.manager";
import { GuardError } from "@app/common/errors";

@Injectable()
export class CommandManager extends BaseManager {
  private readonly commands: Map<Command["name"], Command> = new Map();

  private loadCommand(command: Command, client: TelegramClient) {
    this.commands.set(command.name, command);

    client.command(command.name, async ctx => {
      try {
        await this.runExecutors(command as Function & Command, ctx);
        await command.handler(ctx);
      } catch (e) {
        if (e instanceof GuardError) {
          return;
        }
        this.logger.error(`Failed to execute command ${command.name}: ${e}`);
      }
    });
  }

  async initialize(client: TelegramClient) {
    const commands = await CommandLoader.load("src/commands/**/*.ts");

    for (const command of commands) {
      this.loadCommand(command, client);
    }

    this.logger.info(`Loaded ${this.commands.size} commands`);
  }
}
