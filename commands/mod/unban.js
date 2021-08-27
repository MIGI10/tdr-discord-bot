module.exports.run = async (client, message, args) => {

    const mentionedUser = args[0];

    if (!mentionedUser || !(args[0].length > 15 && args[0].match(/^\d+$/g))) return message.channel.send('Please provide a valid user ID to unban.');

    const fetchAllBans = await message.guild.fetchBans();

    const bannedUser = fetchAllBans.get(mentionedUser);

    if (!bannedUser) return message.channel.send('User provided is not banned from this guild.');
 
    const reason = args[1] ?
        args.slice(1).join(' '):
        'No reason provided.';

    message.guild.members.unban(mentionedUser, `User unbanned | Reason: ${reason} | By: ${message.author.tag}`);

    const bannedUserTag = bannedUser.user.username + '#' + bannedUser.user.discriminator;

    await message.channel.send(`User ${bannedUserTag} has been successfully unbanned with reason: *${reason}*`);

    const dateMS = Date.now();
    const date = new Date(dateMS).toISOString();

    const userLog = await client.db.member.findOne({ 
        userID: mentionedUser
    }).catch(err => console.log(err));

    if (userLog) {
        userLog.updateOne({ $set: { isBanned: false }}, (error) => {
            if (error) {
                console.log(error);
            }
        });
        userLog.moderations.bans.push({
            unban: true,
            date: date,
            moderator: message.author.tag,
            reason: reason,
            timeAtGive: dateMS
        });

        await userLog.save().catch(err => console.log(err));

    } else {

        const createUserLog = new client.db.member({
            userTag: bannedUserTag,
            userID: mentionedUser,
            moderations: {
                bans: [{
                    unban: true,
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
        .setTitle(`${bannedUserTag} | ${mentionedUser}`)
        .setDescription(`User has been unbanned by ${message.author.tag} with reason: ${reason}`)
        .setTimestamp();

    message.guild.channels.cache.get(client.config.logChannel).send(logEmbed);
}

module.exports.help = {
    name: "unban",
    description: "Unban a user from the guild."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: ['MANAGE_ROLES'],
    ownerOnly: false,
    modOnly: true
}