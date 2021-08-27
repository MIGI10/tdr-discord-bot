module.exports.run = (client, message, args) => {

    const mentionedChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

    if (!mentionedChannel) return message.channel.send('Please provide a valid channel to unlock');

    const unlockMsg = args[1] ?
    args.slice(1).join(' '):
    'No unlock message provided.';

    if (!mentionedChannel.permissionOverwrites.get(client.config.everyoneRole).SEND_MESSAGES === false) return message.channel.send('That channel is not locked.');

    mentionedChannel.updateOverwrite(client.config.everyoneRole, {
        SEND_MESSAGES: null
      }, `Channel unlocked  by ${message.author.tag} with message: ${unlockMsg}`);

    message.channel.send(`Channel <#${mentionedChannel.id}> has been successfully unlocked with message: *${unlockMsg}*`);
    
    if (args[1]) {

        const unlockMsgEmbed = new client.discordjs.MessageEmbed()
        .setColor('#4df75f')
        .setTitle(`Channel has been unlocked`)
        .setDescription(`🔐 ${unlockMsg}`);

        mentionedChannel.send(unlockMsgEmbed);
    }

    const logEmbed = new client.discordjs.MessageEmbed()
    .setColor('#119afd')
    .setTitle(`Channel unlocked`)
    .setDescription(`<#${mentionedChannel.id}> has been unlocked by ${message.author.tag} with message: *${unlockMsg}*`)
    .setTimestamp();

    message.guild.channels.cache.get(client.config.logChannel).send(logEmbed);

}

module.exports.help = {
    name: "unlock",
    description: "Unlock a channel, revert lock command."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['MANAGE_ROLES'],
    ownerOnly: false,
    modOnly: true
}