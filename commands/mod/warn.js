module.exports.run = async (client, message, args) => {

    const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

    if (!mentionedUser) return message.reply('Please provide a valid member to warn.');

    if (mentionedUser.roles.cache.has(client.config.modRole)) return message.reply(`Staff members cannot be warned.`);

    const reason = args.slice(1).join(' ');

    if (!reason) return message.reply('Please provide a reason to warn the user.');

    const confirmmsg = await message.channel.send(`User ${mentionedUser.user.tag} has been successfully warned with reason: *${reason}*`);

    mentionedUser.send(`You have been warned in ${message.guild.name} for: *${reason}*`)
        .catch(error => {
            console.log(error);
            if (error.code === 50007) {
                confirmmsg.edit(`Failed to send DM message to ${mentionedUser.user.tag} with warn reason: *${reason}*. Warn has been only logged.`)
            }
        });

    const dateMS = Date.now();
    const date = new Date(dateMS).toISOString();

    const userLog = await client.db.member.findOne({ 
        userID: mentionedUser.id
    }).catch(err => console.log(err));

    if (userLog) {

        userLog.moderations.warns.push({
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
                warns: [{
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
    .setDescription(`User has been warned by ${message.author.tag} for: *${reason}*`)
    .setTimestamp();

    message.guild.channels.cache.get(client.config.logChannel).send(logEmbed);
}

module.exports.help = {
    name: "warn",
    description: "Warn a member."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    modOnly: true
}

