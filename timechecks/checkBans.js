module.exports.run = (client) => {

    async function checkExpiredBans() {

        const member = client.db.member

        const query = member.find({ isBanned: true })

        for await (const member of query) {

            const bansArray = member.moderations.bans
            const lastBan = bansArray[bansArray.length - 1]

            if ((Date.now() - lastBan.timeAtEnd) > 0) {

                const guild = client.guilds.cache.get('717406545159389226');
                guild.members.unban(member.userID, 'Ban time completed')
                    .then(user => {

                        const timeBanned = (lastBan.timeAtEnd - lastBan.timeAtGive) > 3600000 ?
                        Math.round((lastBan.timeAtEnd - lastBan.timeAtGive)*2.77*Math.pow(10, -7)) + ' hours':
                        Math.round((lastBan.timeAtEnd - lastBan.timeAtGive)*1.66*Math.pow(10, -5)) + ' minutes'

                        const logEmbed = new client.discordjs.MessageEmbed()
                            .setColor('#119afd')
                            .setTitle(`${member.userTag} | ${member.userID}`)
                            .setDescription(`User has been unbanned after ${timeBanned}`);

                        guild.channels.cache.get(client.config.logChannel).send(logEmbed)
                    }) 
                    .catch(console.error);

                query.updateOne({ $set: { isBanned: false }}, (error) => {
                    if (error) {
                        console.log(error);
                    }
                });

            } else {
                // Do nothing
            }
        }
    }

    setTimeout(checkExpiredBans, 5000);
    setInterval(checkExpiredBans, 60*1000);
}