import { config } from "../config";
import { commands } from "../index";
import { IBotCommand } from "../api";

class loader {

    async loadCmds(path: string) {

        if (!config || Object.keys(config.commands).length <= 0) { return; }

        let z = 0;

        for (let i of Object.keys(config.commands)) {

            const cmdclass = require(`${path}/${i}/${(config.commands[i])[z]}`).default;

            const cmd = new cmdclass() as IBotCommand;
            
            commands.push(cmd);
        };
        z++
    };
};

export { loader };