const responses = [ // 20
    'It is certain.',
    "That's for sure.",
    'Without a doubt.',
    'Yes, definitely.',
    'You may rely on it.',
    'As I see it, yes.',
    'Most likely.',
    'You already know the answer.',
    'Yes.',
    'Signs point to yes.',
    'Hmmm, ask again.',
    'Ask again later.',
    'Better not tell you now.',
    'Cannot predict now.',
    'Concentrate and ask again.',
    "Don't count on it.",
    'My reply is no.',
    'My sources say no.',
    "It's a difficult question.",
    'Very doubtful.'
];

module.exports.run = (client, message, args) => {

    if (args === undefined || args.length == 0) {
        return message.reply('You must ask a question!')
    };

    const random = Math.round(-0.5 + Math.random() * responses.length);

    const response = responses[random];

    message.reply(response);

}

module.exports.help = {
    name: "8ball",
    description: "Ask the 8-ball any question, it only replies with the correct answer."
}

module.exports.requirements = {
    userPerms: [],
    clientPerms: [],
    ownerOnly: false,
    modOnly: false
}