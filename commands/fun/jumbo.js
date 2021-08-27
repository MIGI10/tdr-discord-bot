module.exports.run = (client, message, args) => {

    const emojiarg = args.toString().match(/\<(.*?)\>/g); // <:auronHappy:760125087520653353>

    if (!emojiarg) {
        return message.reply('You must provide an emoji after the `jumbo` command!');

    } else {    
        const emojiargSplit = emojiarg.toString().split(':'); // <,auronHappy,760125087520653353>
        const emojiID = emojiargSplit[2].split('>')[0]; // 760125087520653353 

        if (emojiargSplit[0] === '<a') {
            message.channel.send({
                files: [ "https://cdn.discordapp.com/emojis/" + emojiID + ".gif" ]
            })
            .catch(console.error);
    
        } else {
            message.channel.send({
                files: [ "https://cdn.discordapp.com/emojis/" + emojiID + ".png" ]
            })
            .catch(console.error);
        }
    }
}

module.exports.help = {
    name: "jumbo",
    description: "Enlarge any emote with the jumbo command."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    modOnly: false
}