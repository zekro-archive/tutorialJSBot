const { RichEmbed } = require('discord.js')

const COLORS = {
    red: 0xe74c3c,
    green: 0x2ecc71
}

exports.test = "test"

module.exports = {

    /**
     * Send an error embed message into a channel
     * @param {Discord.Channel} chan Channel where mesage is send to
     * @param {string} cont 
     * @param {string} title 
     */
    error(chan, cont, title) {
        var message
        var emb = new RichEmbed()
            .setColor(COLORS.red)
            .setDescription(cont)
        if (title) {
            emb.setTitle(title)
        }
        chan.send('', emb).then((m) => {
            message = m
        })
        return message
    },

    info(chan, cont, title) {
        var emb = {
            embed: {
                color: COLORS.green,
                description: cont,
                title: title,
                fields: [
                    {
                        name: "test",
                        value: "test",
                        inline: false
                    }
                ]
            }
        }
        chan.send('', emb)
    }

}