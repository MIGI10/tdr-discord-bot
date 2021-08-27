const fetch = require("node-fetch");

module.exports.run = (client, message, args) => {

    fetch("http://meme-api.herokuapp.com/gimme", {
        "method": "GET",
        })
        .then(res => res.json())
        .then(json => {
    
            const memembed = new client.discordjs.MessageEmbed()
            .setColor(65453)
            .setTitle(`Random Reddit Meme`)
            .setImage(json.url)
            .setFooter("Warning: Reddit contains dark humour memes.")
    
            message.channel.send(memembed);
        })
        .catch(err => {
            console.error(err);
        });
}

module.exports.help = {
    name: "meme",
    description: "Retrieves a random meme from Reddit."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    modOnly: false
}