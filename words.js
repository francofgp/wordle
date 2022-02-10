
import { commonWords } from "./data/commonWords.js"
import { rareWords } from "./data/rareWords.js"


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Words {

    getRandomWord(probabilityEasy = 0.85) {
        const probability = Math.random()

        if (probability <= probabilityEasy) {
            return commonWords[getRandomInt(0, commonWords.length)].toUpperCase()
        }
        return rareWords[getRandomInt(0, rareWords.length)].toUpperCase()
    }

    isInDictionary(word) {
        const combined = [...commonWords, ...rareWords]
        return combined.includes(word.toUpperCase())
    }
}


export default Words