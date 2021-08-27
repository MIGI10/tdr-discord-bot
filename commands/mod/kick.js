module.exports.run = async (client, message, args) => {

    const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!mentionedUser) return message.channel.send('Please provide a valid member to kick.');

    if (mentionedUser.roles.cache.has(client.config.modRole)) return message.channel.send(`Staff members cannot be kicked.`);

    const reason = args[1] ?
        args.slice(1).join(' '):
        'No reason provided.';

    const confirmmsg = message.channel.send(`User ${mentionedUser.user.tag} has been successfully kicked with reason: *${reason}*`);

    await mentionedUser.send(`You have been kicked from ${message.guild.name} with the following reason: *${reason}*`)
        .catch(error => {
            console.log(error);
            if (error.code === 50007) {
                confirmmsg.edit(`User ${mentionedUser.user.tag} has been successfully kicked with reason: *${reason}* but DM message failed to send.`)
            }
        });
    
    await mentionedUser.kick(`User kicked | Reason: ${reason} | By: ${message.author.tag}`);

    const dateMS = Date.now();
    const date = new Date(dateMS).toISOString();

    const userLog = await client.db.member.findOne({ 
        userID: mentionedUser.id
    }).catch(err => console.log(err));

    if (userLog) {
        userLog.moderations.kicks.push({
            date: date,
            moderator: message.author.tag,
            reason: reason,
            timeAtGive: dateMS
        });

        await userLog.save().catch(err => console.log(err));

    } else {

        const createUserLog = new client.db.member({
            userTag: mentionedUser.user.tag,
            userID: mentionedUser.id,
            moderations: {
                kicks: [{
                    date: date,
                    moderator: message.author.tag,
                    reason: reason,
                    timeAtGive: dateMS
                }]
            }
        });

        await createUserLog.save().catch(err => console.log(err));
    }

    const logEmbed = new client.discordjs.MessageEmbed()
        .setColor('#119afd')
        .setTitle(`${mentionedUser.user.tag} | ${mentionedUser.id}`)
        .setDescription(`User has been kicked by ${message.author.tag} with reason: *${reason}*`)
        .setTimestamp();

    message.guild.channels.cache.get(client.config.logChannel).send(logEmbed);
}

module.exports.help = {
    name: "kick",
    description: "Kick a member from the guild."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['KICK_MEMBERS'],
    ownerOnly: false,
    modOnly: true
}