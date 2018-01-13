const Discord = require('discord.js')
const fs = require('fs')
const Embeds = require('./embed')
const vote = require('./vote')

const config = JSON.parse(fs.readFileSync('config.json', 'utf8'))

var client = new Discord.Client()

vote.set_bot(client)

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}...`)
})


var cmdmap = {
    say: cmd_say,
    test: cmd_test,
    vote: vote.ex
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

// https://discord.gg/uPsQQn

const AUTOROLEID = "332164463186673666"

client.on('guildMemberAdd', (memb) => {

    var role = memb.guild.roles.find(r => r.id == AUTOROLEID)

    if (role) {
        memb.addRole(role).then(() => {
            memb.send('', new Discord.RichEmbed().setColor(0x29B6F6).setDescription(`You got automatically assigned the role ${role.name}!`))
        })
    }

})


const PRES = {
    "289901406985388033": "[MOD]",
    "289901361951277056": "[ADMIN]"
}


client.on('guildMemberUpdate', (mold, mnew) => {
    var guild = mnew.guild
    if (mold.roles.array().length < mnew.roles.array().length) {
        var role = mnew.roles.find(r => mold.roles.find(rold => rold.id == r.id) == null)
        if (role.id in PRES) {
            mnew.setNickname(`${PRES[role.id]} ${mnew.displayName}`)
        }
    }
    else if (mold.roles.array().length > mnew.roles.array().length) {
        var role = mold.roles.find(r => mnew.roles.find(rold => rold.id == r.id) == null)
        if (role.id in PRES) {
            mnew.setNickname(mnew.displayName.substr(PRES[role.id].length + 1))
        }
    }
})


const pres = {
    "289901406985388033": "[MOD]"
}

client.on('guildMemberUpdate', (mold, mnew) => {
    var guild = mnew.guild
    if (mold.roles.array().length < mnew.roles.array().length) {
        var role = mnew.roles.find(r => mold.roles.find(r2 => r2.id == r.id) == null)
        if (role.id in pres)
            mnew.setNickname(`${pres[role.id]} ${mnew.displayName}`)
    }
    else if (mold.roles.array().length > mnew.roles.array().length) {
        var role = mold.roles.find(r => mnew.roles.find(r2 => r2.id == r.id) == null)
        if (role.id in pres)
            mnew.setNickname(mnew.displayName.substr(pres[role.id].length + 1))
    }
})


client.login(config.token)