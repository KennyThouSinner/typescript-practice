import { con } from "./configurations";

export let config = {
    token: con.token,
    prefix: "?",
    commands: {
        admin: ["ban", "kick", "tempban", "massban"],
        mod: ["mute", "unmute"],
        eco: ["balance"],
        util: ["help", "test", "userinfo", "serverinfo"]
    }
};
