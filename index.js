let adjectives;
let nouns;

class WordBuilder {
    constructor(template) {
        this.words = [];
        template = template || "";
        for(let t of template.split("")) {
            if(t === "a") this.addAdjective();
            if(t === "n") this.addNoun();
        }
    }

    addAdjective() {
        this.words.push(WordBuilder.getRandomAdjective());
        return this;
    }

    addNoun() {
        this.words.push(WordBuilder.getRandomNoun());
        return this;
    }

    reloadWordlists() {
        WordBuilder.reloadWordlists();
        return this;
    }

    toString(join) {
        return this.words.join(join);
    }

    static getRandomAdjective() {
        return adjectives[~~(Math.random() * adjectives.length)];
    }
    static getRandomNoun() {
        return nouns[~~(Math.random() * nouns.length)];
    }
    static get adjectives() {
        return adjectives;
    }
    static get nouns() {
        return nouns;
    }
    static reloadWordlists() {
        try {
            delete require.cache[require.resolve(`./words/adjectives.js`)];
            delete require.cache[require.resolve(`./words/nouns.js`)];
            adjectives = require('./words/adjectives.js');
            nouns = require('./words/nouns.js');
        } catch(e) {
            adjectives = ["Missing"];
            nouns = ["Words"];
        }
    }
    static get buildScript() {
        return require("./build");
    }
}

WordBuilder.reloadWordlists();

module.exports = WordBuilder;