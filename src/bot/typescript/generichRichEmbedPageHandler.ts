import { MessageEmbed, Message } from "discord.js";

export class GenericMessageEmbedPageHandler<T> {
      data: T[];
      itemsPerPage: number;
      itemHandler: (embed: MessageEmbed, data: T[]) => MessageEmbed;
      currentPage: number = 1;
      amountOfPages: number;
      embed: MessageEmbed;
      message: Message;

      /**
       *
       */
      constructor(
            data: T[],
            itemsPerPage: number,
            itemHandler: (embed: MessageEmbed, data: T[]) => MessageEmbed,
            embed: MessageEmbed,
            message: Message
      ) {
            this.data = data;
            this.itemsPerPage = itemsPerPage;
            this.itemHandler = itemHandler;
            this.embed = embed;
            this.message = message;

            let totalPages = Math.floor(data.length / itemsPerPage);

            if (data.length % itemsPerPage != 0) {
                  totalPages++;
            }

            this.amountOfPages = totalPages;
      }

      public NextPage = () => {
            if (this.currentPage == this.amountOfPages) {
                  this.currentPage = 1;
            } else {
                  this.currentPage++;
            }

            this.showPage();
      };

      public PreviousPage = () => {
            if (this.currentPage == 1) {
                  this.currentPage = this.amountOfPages;
            } else {
                  this.currentPage--;
            }

            this.showPage();
      };

      public showPage() {
            // Get the start index, if page == 1, the index is 0
            let start =
                  this.currentPage == 1 ? 0 : (this.currentPage - 1) * this.itemsPerPage;

            // Get the end index
            let end =
                  this.itemsPerPage * this.currentPage > this.data.length ? this.data.length : this.itemsPerPage * this.currentPage;

            // Get the section of the data you want to show
            let data = this.data.slice(start, end);

            // Reset fields
            this.embed.fields = [];

            // Set embed fields
            this.embed = this.itemHandler(this.embed, data);

            // Update the message
            this.message.edit(this.embed);
      }

      public async startCollecting(authorId: string, sent: Message) {

            this.showPage();

            await sent.react("◀")
            await sent.react("▶")
            await sent.react("❌")

            const filter = (reaction, user) => (reaction.emoji.name === "◀" || reaction.emoji.name === "▶" || reaction.emoji.name === "❌") && user.id === authorId
            const collector = sent.createReactionCollector(filter);

            collector.on("collect", r => {

                  if (r.emoji.name === "◀") {
                        this.PreviousPage();
                  } else if (r.emoji.name === "▶") {
                        this.NextPage();
                  } else if (r.emoji.name === "❌") {
                        this.message.delete();
                  }

                  r.users.filter(user => !user.bot).forEach(user => {
                        r.users.remove(user);
                  })
            });

            collector.on("end", collected => {

                  let first = collected.first();
                  if (first) first.message.delete();

            })
      }
}