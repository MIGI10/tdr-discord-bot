module.exports = (client) => {
    
    var readymsg = `Bot is now UP as ${client.user.tag} at ${client.readyAt}`;

    console.log(`\n\n-----------------------\n\n${readymsg}\n\n-----------------------`);

    client.user.setPresence({
        activity: { 
            name: 'your messages',
            type: 'WATCHING'
        },
        status: 'dnd'
    })
    .catch(console.error);
}