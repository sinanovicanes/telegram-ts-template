import { Logger } from "@app/common";
import { Glob } from "bun";
import { Command } from "../classes";

export class CommandLoader {
  private static readonly logger = new Logger(CommandLoader.name);

  static async load(path: string): Promise<Command[]> {
    const commands: Command[] = [];
    const glob = new Glob(path);

    for await (const filePath of glob.scan()) {
      let file: any;

      try {
        file = await import(filePath);
      } catch {
        this.logger.error(`Failed to load file: ${filePath}`);
        continue;
      }

      for (const key in file) {
        if (file[key].prototype instanceof Command) {
          try {
            const command = new file[key]();

            commands.push(command);
          } catch (e) {
            this.logger.error(`Failed to load ${file[key].name}: ${e}`);
          }
        }
      }
    }

    return commands;
  }
}
