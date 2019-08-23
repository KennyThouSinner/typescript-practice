import { Message, Client, MessageEmbed } from "discord.js";
import { IBotCommand } from "../../api";
import Guild from "../../assets/mongoose/schemas/Guild";

export default class userinfo implements IBotCommand {

      private readonly _command = "userinfo";

      help(): string {
            return "This command does nothing";
      }

      isThisCommand(command: string): boolean {
            return command === this._command;
      };

      usage(): string {
            return "?userinfo @user";
      }

      adminOnly(): boolean {
            return false;
      }

      devOnly(): boolean {
            return false;
      }

      async runCommand(args: string[], message: Message, client: Client): Promise<void> {

            const user = message.author || message.mentions.users.first() || await client.users.fetch(args[0]);
            
            let status = {
                  "dnd": "Do not Disturb",
                  "idle": "Idle",
                  "offline": "Offline",
                  "online": "Online"
            }

            let games = {
                  "PLAYING": "Playing",
                  "STREAMING": "Streaming",
                  "LISTENING": "Listening to",
                  "WATCHING": "Watching"
            }

            const embed = new MessageEmbed()
                  .setTitle(`Information about ${user.tag}`)
                  .addField("Account Created At", user.createdAt, true)
                  .addField("User Joined Guild At", message.guild.member(user).joinedAt, true)
                  .addField("User ID", user.id.split("").splice(0, 9).join("") + "... \n ..." + user.id.slice(9), true)
                  .addField("User Username", user.username, true)
                  .addField("User Discriminator", "#" + user.discriminator, true)
                  .addField("User Tag", user.username + "\n #" + user.discriminator, true)
                  .addField("Nitro Booster", message.guild.member(user).premiumSince ? message.guild.member(user).premiumSince : "False", true)
                  .addField("Bot", user.bot ? "This user is a bot" : "This user is not a bot", true)
                  .addField("Status", status[user.presence.status], true)
                  .addField("Presence", user.presence.activity ? `**${games[user.presence.activity.type]}**` + " " + user.presence.activity.name : "This user isn't playing a game", true)
                  .addField("Spotify", user.presence.activity ? user.presence.activity.name.toLowerCase() === "spotify" ? "**Song**: " + user.presence.activity.details + "\n**Artist(s)**: " + user.presence.activity.state.replace(/;/g, ', ') + "\n**Album**: " + user.presence.activity.assets.largeText : "This user isn't listening to spotify or the bot cannot recognize it since the mentioned user has another presence." : "This user is not using any presence", true)
                  .setThumbnail(user.presence.activity ? user.presence.activity.name.toLowerCase() === "spotify" ? `https://i.scdn.co/image/${user.presence.activity.assets.largeImage.replace('spotify:', '')}` : user.displayAvatarURL() : user.displayAvatarURL())
                  .setFooter(client.user.tag, client.user.displayAvatarURL())
                  .setTimestamp();

            message.channel.send(embed);
      }
}