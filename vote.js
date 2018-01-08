const fs = require('fs')
const { RichEmbed } = require('discord.js')



class CmdVote {

    constructor(bot, saveloc) {
        this.bot = bot
        this.saveloc = saveloc ? saveloc : "votes.json"
        this.votes = this.loadVotes()
    }

    loadVotes() {
        if (fs.existsSync(this.saveloc))
            return JSON.parse(fs.readFileSync(this.saveloc))
        return {}
    }

    saveVotes() {
        fs.writeFile(this.saveloc, JSON.stringify(this.votes))
    }

    displayVote(guild) {
        if (guild in this.votes) {
            let vote = this.votes[guild]
            vote.msg.channel.send()
        }
        else 
            this.msg.channel.send('', new RichEmbed()
                    .setColor(0xF44336)
                    .setDescription('There is currently no vote running!'))
                .then(m => setTimeout(() => m.delete()), 4000)
    }

    addVote(guild, vote) {
        if (guild in this.votes)
            this.msg.channel.send('', new RichEmbed()
                    .setColor(0xF44336)
                    .setDescription('You need to close the current vote for this guild before opening another one!'))
                .then(m => setTimeout(() => m.delete()), 4000)
        else {
            this.votes[guild] = vote
            this.saveVotes()
        }
    }

    closeVote(guild) {
        if (guild in this.votes) {
            this.displayVote(guild)
            delete this.votes[guild]
            this.saveVotes()
        }
        else
            this.msg.channel.send('', new RichEmbed()
                    .setColor(0xF44336)
                    .setDescription('There is currently no vote running on this guild!'))
                .then(m => setTimeout(() => m.delete()), 4000)
    }
}

class Vote {

    constructor(msg, author, cont, poss) {
        this.msg = msg
        this.author = author
        this.cont = cont
        this.poss = poss
        this.votes = {}
        
        return this
    }

    vote(memb, ind) {
        if (memb in this.votes)
            this.msg.channel.send('', new RichEmbed()
                    .setColor(0xF44336)
                    .setDescription('You can only vote once!'))
                .then(m => setTimeout(() => m.delete()), 4000)
        else
            this.votes[memb] = ind;
    }
}