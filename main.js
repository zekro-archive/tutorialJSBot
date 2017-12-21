const Discord = require('discord.js')
const fs      = require('fs')
const Embeds = require('./embed')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

var client = new Discord.Client()



client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`)
})


var cmdmap = {
    say: cmd_say,
    test: cmd_test
}

function cmd_say(msg, args) {
    msg.channel.send(args.join(' '))
}

function cmd_test(msg, args) {
    //Embeds.error(msg.channel, 'This is actuially not an error', 'Not an error')
    Embeds.info(msg.channel, "this is a content lel")
}


client.on('message', (msg) => {

    var cont   = msg.content,
        author = msg.member,
        chan   = msg.channel,
        guild  = msg.guild

    if (msg.channel.type == "text" && author.id != client.user.id && cont.startsWith(config.prefix)) {

        // ::say hello world!
        var invoke = cont.split(' ')[0].substr(config.prefix.length),
            args   = cont.split(' ').slice(1)

        if (invoke in cmdmap) {
            cmdmap[invoke](msg, args)
        }
    }

})


client.login(config.token)