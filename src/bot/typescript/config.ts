import { con } from "./configurations";

export let config = {
    token: con.token,
    prefix: "?",
    commands: {
        admin: ["ban", "kick", "softban"],
        mod: ["mute", "unmute"],
        eco: ["balance"],
        util: ["aliases", "help", "test", "userinfo", "serverinfo"]
    }
};
