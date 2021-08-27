module.exports.run = (client, message, args) => {


    if ((args[0].length > 15 && args[0].match(/^\d+$/g)) || (message.mentions.users.size > 0)) { // if first arg is a mention/ID

        message.delete();

        if (!args[1].match(/^\d+$/g)) return message.reply("You need to specify the amount of messages to purge!");

        if (args[1] > 1000 || args[1] < 1) return message.reply(`Provide a number of messages to purge between 1-1000.`);

        args[1] = parseInt(args[1]);

        const cycles = Math.floor(args[1]/100); 

        const remMessages = Math.trunc((args[1]/100 - cycles)*100);

        async function bulkDeleteCycles(msg) {
            return message.channel.bulkDelete(msg.slice(0, 100))
        };
    
        async function bulkDeleteRemMessages(msg) { 
            //await bulkDeleteCycles();
            return message.channel.bulkDelete(msg.slice(0, remMessages))
        };

        const mentionedUserID = message.mentions.users.size > 0 ?  
            message.mentions.users.first().id:
            null

        if (args[0] === `<@${mentionedUserID}>` || args[0] === `<@!${mentionedUserID}>`) {

            const userMessages = message.channel.messages.fetch().then((messages) => {
                messages = messages.filter(m => m.author.id === mentionedUserID).array();

                for (let i = 0; i < cycles; i++) { 
                    setTimeout(bulkDeleteCycles.bind(null, msg = messages), 2000) 
                };

                if (remMessages) { 
                    setTimeout(bulkDeleteRemMessages.bind(null, msg = messages), 2000); 
                };
            });

        } else { 

            const userMessages = message.channel.messages.fetch().then((messages) => {
                messages = messages.filter(m => m.author.id === args[0]).array();
 
                for (let i = 0; i < cycles; i++) { 
                    setTimeout(bulkDeleteCycles.bind(null, msg = messages), 2500); 
                };

                if (remMessages) { 
                    setTimeout(bulkDeleteRemMessages.bind(null, msg = messages), 2500); 
                };

            });
        }   

    } else { // if first arg is NOT a mention/ID

        const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

        message.delete();

        if (!args[0].match(/^\d+$/g)) return message.reply("You need to specify the amount of messages to purge!");

        if (args[0] > 1000) return message.reply(`for security purposes there's a 1000 cap`);
            
        const cycles = Math.floor(args[0]/100) 

        const remMessages = Math.trunc((args[0]/100 - cycles)*100);

        function bulkDeleteCycles() {
            return message.channel.bulkDelete(100);
        };

        function bulkDeleteRemMessages() {
            return message.channel.bulkDelete(remMessages);
        };

        if (remMessages) {

            for (let i = 0; i < cycles; i++) { 
                delay(1000);
                setTimeout(bulkDeleteCycles, 2500); 
            }
            delay(1000);

            setTimeout(bulkDeleteRemMessages, 2500);

        } else {

            for (let i = 0; i < cycles; i++) { 
                setTimeout(bulkDeleteCycles, 2500); 
            }
        }
    }
}

module.exports.help = {
    name: "purge",
    description: "Purges messages from channel"
}

module.exports.requirements = {
    userPerms: ['MANAGE_MESSAGES'],
    clientPerms: ['MANAGE_MESSAGES'],
    ownerOnly: false,
    modOnly: true
}