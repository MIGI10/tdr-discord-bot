module.exports.run = (client, message, args) => {

    let mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!mentionedUser) {
        mentionedUser = message.member;
    }

    const userAvatar = mentionedUser.user.displayAvatarURL({
        dynamic: true,
        size: 4096
    })
    
    const userColour = mentionedUser.displayHexColor;     

    const avatarEmbed = new client.discordjs.MessageEmbed()
        .setColor(userColour)
        .setAuthor(mentionedUser.user.tag, userAvatar)
        .setTitle(`Avatar`)
        .setImage(userAvatar)
        .setFooter(`Requested by ${message.author.tag}`)

    message.channel.send(avatarEmbed);

}

module.exports.help = {
    name: "avatar",
    description: "avatar command"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    modOnly: false
}