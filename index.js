#!/usr/bin/env node
import chalk from "chalk";
import chalkAnimation from 'chalk-animation';
import inquirer from 'inquirer';
import figlet from 'figlet';
import gradient from 'gradient-string';
import Words from './words.js'
import open from 'open'

let wordleWord
let colorizedArray
let isWin = false
const words = new Words()
let shareData = []
function fillArrayWithZeros(length = 5) {
    colorizedArray = new Array(5).fill(0);
}

const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

async function welcome() {
    figlet(`Wordle.js`, (err, data) => {
        console.log(gradient.pastel.multiline(data) + '\n');
    });

    await sleep()

}

async function showInstructions() {

    console.log(`
      ${chalk.bgBlue('HOW TO PLAY')} 

    Guess the WORDLE in 6 tries.

    Each guess must be a valid 5 letter word. 
    Hit the enter button to submit.

    After each guess, the color of the tiles will change to
    show how close your guess was to the word.
    
    --------------------------------------------------
    Examples

    ${chalk.green('W')} E A R Y
    The letter "W" is in the word and in the correct spot.

    P ${chalk.green('I')} L L S
    The letter "I" is in the word but in the wrong spot.

    V A G U E
    None of the letters are in the word in any spot.

    `);
}



function printWordle(guess) {
    guess = guess.toUpperCase()
    fillArrayWithZeros()
    for (var i = 0; i < guess.length; i++) {

        if (wordleWord.includes(guess[i])) {
            colorizedArray[i] = "inWord"
        }
        if (guess[i] === wordleWord[i]) {
            colorizedArray[i] = "match"
        }

    }

    for (let index = 0; index < colorizedArray.length; index++) {
        switch (colorizedArray[index]) {
            case 'match':
                process.stdout.write(chalk.bold.green(`${guess[index]}`) + ' ');

                break;
            case 'inWord':
                process.stdout.write(chalk.bold.yellow(`${guess[index]}`) + ' ');

                break
            default:
                process.stdout.write(chalk.bold(`${guess[index]}`) + ' ');
                break;
        }


    }
    shareData.push(colorizedArray)
    //break line
    console.log()


}


function checkWin() {
    debugger
    isWin = true
    for (let index = 0; index < colorizedArray.length; index++) {
        if (colorizedArray[index] !== 'match') {
            isWin = false
            break
        }
    }

    return isWin
}


function resetShareData() {
    shareData = []
}
function createMessage() {
    const breakLine = '%0D'
    let message = `Wordle in NodeJS${breakLine}`


    for (let index = 0; index < shareData.length; index++) {
        shareData[index] = shareData[index].map((element) => {
            switch (element) {
                case 'inWord':
                    element = '🟨'
                    break;
                case 'match':
                    element = '🟩'
                    break
                default:
                    element = '⬛'
                    break;
            }
            return element
        })
        message = message + shareData[index].join("") + breakLine
    }
    const githubRepo = `https://github.com/francofgp/wordle`
    message += githubRepo
    return message
}
async function shareOnTwitter() {
    const message = createMessage()
    const questions = [

        {
            type: 'list',
            name: 'options',
            message: "Share on twitter?",
            default() {
                return 'Yes';
            },
            choices: ['Yes', 'No'],

        },
    ];
    const url = `https://twitter.com/intent/tweet?text=${message}`
    const answers = await inquirer.prompt(questions)
    const { options } = answers
    switch (options) {
        case 'Yes':
            await open(url);
            break;
        case 'No':
            break;
        default:
            break;
    }
    resetShareData()

}
async function printVictoryOrDefeat() {

    const text = isWin ? "You won!" : "You lose  : ("
    figlet.text(text, {}, function (err, data) {
        if (err) {
            console.log('Something went wrong...');
            console.dir(err);
            return;
        }
        console.log(gradient.rainbow.multiline(data) + '\n');
    });


    if (!isWin) {
        console.log(`The word was ${chalk.bgMagenta(wordleWord)}`)
    }

    await shareOnTwitter()

}

async function printBye() {
    const rainbow = chalkAnimation.rainbow(`
           Bye       .
                   .'|
                 .'  |
                /'-._'
               /   /
              /   /
             /   /
            ('-./
            )          @francofgp
            '

`); // Animation starts
    rainbow.start()
    await sleep()
    process.exit(1)
}
async function play() {
    wordleWord = words.getRandomWord()

    //If you want to know the word before hand, uncomment this line
    //console.log(wordleWord)
    for (let index = 0; index < 6; index++) {

        const questions = [

            {
                type: 'input',
                name: 'playerGuess',
                message: `Enter a 5 letter word ${index + 1}/6:`,
                validate(value) {
                    value = value.toUpperCase()
                    if (value.length === 5 && words.isInDictionary(value)) {
                        return true;
                    }

                    return 'Please enter a real word ☠';
                },
            },
        ];

        const answers = await inquirer.prompt(questions)
        const { playerGuess } = answers

        printWordle(playerGuess)

        isWin = checkWin()
        if (isWin) {
            break
        }

    }



}

async function showOptions() {

    const questions = [

        {
            type: 'list',
            name: 'options',
            message: "What do yo want to do?",
            default() {
                return 'Play';
            },
            choices: ['Play', 'Visit website', 'Exit'],

        },
    ];

    const answers = await inquirer.prompt(questions)
    const { options } = answers
    switch (options) {
        case 'Play':
            await play()
            await printVictoryOrDefeat()
            await showOptions()
            break;
        case 'Visit website':
            await open('https://twitter.com/intent/tweet?text=Wordle 236 X/6 ⬛🟨⬛⬛⬛%0D⬛⬛⬛⬛🟩%0D⬛⬛🟨⬛⬛%0D⬛⬛⬛⬛🟨%0D🟨🟨🟨⬛⬛%0D🟨⬛🟨⬛🟩');
            await showOptions()
            break;
        default:
            await printBye()
            break;
    }





}

await welcome()
await showInstructions()
await showOptions()




