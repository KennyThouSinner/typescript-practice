import { config } from "../config";
import { cmds } from "../index";
import { IBotCommand } from "../api";

class loader {

    async loadAdmin(commandsPath: string) {

        if (!config || (config.commands.admin as string[]).length === 0) { return; }

        for (const cmdName of config.commands.admin as string[]) {

            const cmdclass = require(`${commandsPath}/${cmdName}`).default;

            const cmd = new cmdclass() as IBotCommand;

            cmds.commands.push(cmd);
        }
    }

    async loadMod(commandsPath: string) {

        if (!config || (config.commands.mod as string[]).length === 0) { return; }

        for (const cmdName of config.commands.mod as string[]) {

            const cmdclass = require(`${commandsPath}/${cmdName}`).default;

            const cmd = new cmdclass() as IBotCommand;

            cmds.commands.push(cmd);
        }
    }

    async loadEco(commandsPath: string) {

        if (!config || (config.commands.eco as string[]).length === 0) { return; }

        for (const cmdName of config.commands.eco as string[]) {

            const cmdclass = require(`${commandsPath}/${cmdName}`).default;

            const cmd = new cmdclass() as IBotCommand;

            cmds.commands.push(cmd);
        }
    }

    async loadUtil(commandsPath: string) {

        if (!config || (config.commands.util as string[]).length === 0) { return; }

        for (const cmdName of config.commands.util as string[]) {

            const cmdclass = require(`${commandsPath}/${cmdName}`).default;

            const cmd = new cmdclass() as IBotCommand;

            cmds.commands.push(cmd);
        }
    }
}

export { loader };