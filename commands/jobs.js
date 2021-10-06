const { MessageEmbed } = require("discord.js")
const { pagination } = require("reconlx")

module.exports = {
  name: "jobs",
  cooldown: 0,
  async execute(message, args, client) {
    const jobs = [
      {job: "YouTuber", salary: 10000},
      {job: "Streamer", salary: 15000}
    ]
    
    const chunk = (array, chunkSize = 15) => {
            const chunked = [];
            for(let i = 0; i < array.length; i += chunkSize) {
                chunked.push(array.slice(i, i + chunkSize));
            }

            return chunked;
        }

        // This is used by the library
        const embedPages = [];

        // Store all client commands in this array.
        const jobList = [];
        for(const i of jobs) {
            jobList.push({ name: i.job, value: `Salary: **$${i.salary || "none"}**` });
        }
        // Chunking the commands in smaller arrays. Leave second parameter blank to use default of 15, or choose your own size.
        // Note that Discord doesn't allow any embed to go over 25 fields, 2000 characters.
        chunk(jobList, 6).forEach((chunks) => {
            const embed = new MessageEmbed().setColor("YELLOW").setAuthor(`Job List`, client.user.displayAvatarURL(), 'https://discord-power-bot.glitch.me/commands.html').setFooter(`lol`);
            embed.addFields(chunks);
            embedPages.push(embed);
        });
        
        pagination({
            embeds: embedPages,
            channel: message.channel,
            author: message.author,
            time: 15000,
        });

        message.channel.send({ embeds: [embed] })

    //const response = await profileModel.findOneAndUpdate(
    //  {
    //    userID: message.author.id,
    //  },
    //  {
    //    $inc: {
    //      coins: randomNumber,
    //    },
    //  }
    //);
    //return message.channel.send(`${message.author}, You worked and you earnt ${randomNumber} coins!`);
  },
};
