#!/usr/env node

const https = require("https");
const fs = require("fs");
const adjList = "https://raw.githubusercontent.com/kylestetz/Sentencer/master/words/adjectives.js";
const nounList = "https://raw.githubusercontent.com/kylestetz/Sentencer/master/words/nouns.js";

async function downloadWordLists(adjectiveChance, nounChance) {
    return Promise.all([downloadAdjectiveList(adjectiveChance), downloadNounList(nounChance)]);
}
async function downloadAdjectiveList(adjectiveCount = 200) {
    return httpsGet(adjList)
        .then((data) => {
            data = data.replace(/.*module\.exports = /gs, "").replace(/;$/, ""); // jshint ignore:line
            data = JSON.parse(data);
            return data;
        })
        .then((adjectives) => getRandomItems(adjectives, adjectiveCount))
        .then((adjectives) => adjectives.sort((a,b) => a.localeCompare(b)))
        .then((adjectives) => fs.promises.writeFile(`${__dirname}/words/adjectives.js`, `module.exports = ${JSON.stringify(adjectives)};`));
}
async function downloadNounList(nounCount = 200) {
    return httpsGet(nounList)
        .then((data) => {
            data = data.replace(/.*module\.exports = /gs, "").replace(/;$/, ""); // jshint ignore:line
            data = JSON.parse(data);
            return data;
        })
        .then((nouns) => getRandomItems(nouns, nounCount))
        .then((adjectives) => adjectives.sort((a, b) => a.localeCompare(b)))
        .then((nouns) => fs.promises.writeFile(`${__dirname}/words/nouns.js`, `module.exports = ${JSON.stringify(nouns)};`));
}

function getRandomItems(items, count) {
    items = items.slice();
    let result = [];
    while(result.length < count && items.length > 0) result.push(items.splice(~~(Math.random() * items.length), 1)[0]);
    return result;
}

async function httpsGet(url) {
    return new Promise((resolve, reject) => {
        let chunks = [];
        https.get(adjList, (res) => {
            res.on("data", (d) => {
                chunks.push(d.toString());
            });
            res.on("end", () => {
                resolve(chunks.join(""));
            });
        }).on("error", (e) => {
            reject(e);
        });
    });
}

if(require.main === module) {
    let aCount = process.argv[2] || 200;
    let nCount = process.argv[3] || process.argv[2] || 200;

    process.stdout.write(`Downloading ${aCount} adjectives and ${nCount} nouns...`);
    downloadWordLists(aCount, nCount)
        .then(() => process.stdout.write("\033[32mDone!\033[0m\n"))
        .catch((e) => {
            process.stdout.write("\033[31mError!\033[0m\n");
            process.stderr.write(e);
        });
} else {
    module.exports = {
        downloadWordLists,
        downloadAdjectiveList,
        downloadNounList,
    };
}