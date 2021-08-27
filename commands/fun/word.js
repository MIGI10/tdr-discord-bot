const fetch = require("node-fetch");

module.exports.run = (client, message, args) => {

    fetch("https://random-words-api.vercel.app/word", {
        "method": "GET",
        })
        .then(res => res.json())
        .then(json => {

            const wordembed = new client.discordjs.MessageEmbed()
            .setColor(65453)
            .setTitle(`Random Word Definition`)
            .setFooter("")
            .addField(`__${json[0].word}__`, `Pronunciation: *${json[0].pronunciation}*\n\n Meaning:\n ${json[0].definition}\n\n [View more](https://www.google.com/search?q=${json[0].word})`)

            message.channel.send(wordembed);
        })
        .catch(err => {
            console.error(err);
        });
}

module.exports.help = {
    name: "word",
    description: "random word command"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    modOnly: false
}