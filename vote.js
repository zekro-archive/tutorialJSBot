const fs = require('fs')
const Discord = require('discord.js')


const EMOTIS = '🍏 🍎 🍐 🍊 🍋 🍌 🍉 🍇 🍓 🍈 🍒 🍑 🍍 🥝 🥑 🍅 🍆 🥒 🥕 🌽 🌶 🥔 🍠 🌰 🥜 🍯 🥐 🍞 🥖 🧀 🥚 🍳 🥓 🥞 🍤 🍗 🍖 🍕 🌭 🍔 🍟 🥙 🌮 🌯 🥗 🥘 🍝 🍜 🍲 🍥 🍣 🍱 🍛 🍚 🍙 🍘'.split(' ')
var t_emotis
var bot, set_bot = (b) => bot = b

// Alle votes aller member:
// MEMBER: VOTE
var votes = {}


class Vote {
    constructor(msg, author, cont, poss) {
        this.msg = msg
        this.author = author
        this.cont = cont

        var t_emotis = EMOTIS
        this.poss = poss.map(p => {
            let em = t_emotis[Math.floor(Math.random() * t_emotis.length)]
            t_emotis = t_emotis.filter(e => e != em)
            return [p, em]
        })

        this.ans = {}
        this.votemsg = null

        this.create()

        // Does not work currently :^)
        bot.on('messageReactionAdd', (reaction, memb) => {
            let v = votes[Object.keys(votes).find(k => votes[k].votemsg == reaction.message)]
            let authorid = v.author
            if (!v || memb.id == bot.user.id)
                return
            let emoti_in_poss = v.poss.map(a => a[1]).indexOf(reaction.emoji.name)
            if (emoti_in_poss) {
                if (authorid in v.ans)
                    error(reaction.message.channel, 'You can only vote once!')
                else
                    v.add(memb.id, v.poss.find(p => p[1] == reaction.emoji.name)[0])
                reaction.remove()
            }
        })

        return this
    }

    add(memb, ans) {
        if (!memb in this.ans)
            return false
        this.ans[memb.id] = ans
        // TODO: votemsg muss mit aktueller votezahl aktualisiert werden
        return true
    }

    print(chan) {
        let tmsg
        chan.send('', new Discord.RichEmbed()
            .setAuthor(this.author.displayName, this.author.user.avatarURL)
            .setDescription(this.cont + "\n\n" + this.poss.map(p => `${p[1]} - ${p[0]}`).join('\n'))
            .setColor(0x8bc34a))
        .then(m => tmsg = m)
        return tmsg
    }

    create() {
        this.msg.channel.send('', new Discord.RichEmbed()
            .setAuthor(this.author.displayName, this.author.user.avatarURL)
            .setDescription(this.cont + "\n\n" + this.poss.map(p => `${p[1]} - ${p[0]}`).join('\n'))
            .setColor(0x8bc34a))
        .then(m => {
            this.votemsg = m
            this.poss.forEach(p => m.react(p[1]))
        })
    }
}


function error(chan, cont) {
    chan.send('', new Discord.RichEmbed()
        .setColor(0xf44336)
        .setTitle('Error')
        .setDescription(cont))
    .then(m => setTimeout(() => m.delete(), 4000))
}

function help(chan) {
    chan.send('', new Discord.RichEmbed()
        .setColor(0xff9800)
        .setTitle('USAGE')
        .setDescription('...'))
}

function ex(msg, args) {
    let memb = msg.member
    let chan = msg.channel

    console.log(args.length)

    if (args.lenght < 1) {
        help(chan)
        return
    }

    if (args[0] == "close") {
        if (memb.id in votes) {
            let v = votes[memb.id]         
            v.print(chan)
            chan.send('', new Discord.RichEmbed()
                .setColor(0xff9800)
                .setDescription(`Vote closed by author (${memb})`))
            v.msg.delete()
            delete votes[memb.id]
        }
        else {
            error(chan, 'You don\'t have started any votes yet!')      
        }
        return
    }

    if (memb.id in votes) {
        error(chan, 'You can only create one vote per member!')
        console.log("TEST")
        return
    }

    let s_args = args.join(' ')
    let cont = s_args.split('|')[0]
    let poss = s_args.split('|').slice(1)

    if (cont.length > 0 && poss.length > 0) {
        votes[memb.id] = new Vote(msg, memb, cont, poss)
        console.log(votes)
    }
    else
        help(chan)        
}


exports.ex = ex
exports.Vote = Vote
exports.votes = votes
exports.set_bot = set_bot