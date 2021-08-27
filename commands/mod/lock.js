module.exports.run = (client, message, args) => {

    const mentionedChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

    if (!mentionedChannel) return message.channel.send('Please provide a valid channel to lock');

    const lockMsg = args[1] ?
    args.slice(1).join(' '):
    'No lock message provided.';
    //
    if (mentionedChannel.permissionOverwrites.get(client.config.everyoneRole).SEND_MESSAGES === false) return message.channel.send('That channel is already locked.');
    // doesnt work
    mentionedChannel.updateOverwrite(client.config.everyoneRole, {
        SEND_MESSAGES: false
      }, `Channel locked  by ${message.author.tag} with message: ${lockMsg}`);

    message.channel.send(`Channel <#${mentionedChannel.id}> has been successfully locked with message: *${lockMsg}*`);
    
    if (args[1]) {

        const lockMsgEmbed = new client.discordjs.MessageEmbed()
        .setColor('#ff3434')
        .setTitle(`Channel has been locked`)
        .setDescription(`🔐 ${lockMsg}`);

        mentionedChannel.send(lockMsgEmbed);
    }

    const logEmbed = new client.discordjs.MessageEmbed()
    .setColor('#119afd')
    .setTitle(`Channel locked`)
    .setDescription(`<#${mentionedChannel.id}> has been locked by ${message.author.tag} with message: *${lockMsg}*`)
    .setTimestamp();

    message.guild.channels.cache.get(client.config.logChannel).send(logEmbed);

}

module.exports.help = {
    name: "lock",
    description: "Lock a channel (deny send messages for everyone)"
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['MANAGE_ROLES'],
    ownerOnly: false,
    modOnly: true
}