import { con } from "./configurations";

export let config = {
    "token": con.token,
    "prefix": "?",
    "commands": {
        "admin": ["ban", "kick", "tempban"],
        "mod": ["mute", "unmute", "tempmute"],
        "eco": ["balance"],
        "util": ["help", "test", "userinfo", "serverinfo"]
    }
};
