const wordContainer = document.querySelector('.game')
const pageContainer = document.querySelector('.container')

// Statement ***************************
const russianWords = [
    "дом", "кот", "мед", "вино", "дверь", "стол", "стул", "окно", 
    "ночь", "день", "луна", "лес", "мир", "друг", "папа", "мама", 
    "сын", "дочь", "зима", "лето", "осень", "весна", "долг", 
    "брат", "снег", "мост", "путь", "рад", "душа", 
    "время", "соль", "масло", "круг", "нос", "шум", "кот", 
    "пик", "шар", "миф", "жизнь", "соль", "каша", "рука", 
    "лампа", "дождь", "день", "гром", "класс", "много", 
    "песня", "сосна", "мор", "арка"
]
const englishWords = [
    "cat", "dog", "fish", "grape", "juice", "bread", 
    "chair", "table", "door", "night", "day", "moon", 
    "star", "tree", "hill", "rock", "sand", "key", 
    "lock", "coin", "book", "brush", "glue", "smile", 
    "joy", "water", "whale", "zebra", "mango"
]
let currentRow = 0
let currentLetter = 0
let wrongLetters = ''
let spottedLetters = ''
let hasLetters = ''
let gameRows = []
let playerWin = false
let language = 'russian'
let isWordExisting = null

// Game Settings *************************
let attempts = 6
let hiddenWord = null
getRandomWord()

// Game Logic ****************************
function createGameRows() {
    gameRows = []
    for (let i = 0; i < attempts; i++) {
        let wordToPush = []
        for (let j = 0; j < hiddenWord.length; j++) {
            wordToPush.push('#')
        }
        gameRows.push(wordToPush)
    }
}
createGameRows()

function renderGameRows() {
    wordContainer.innerHTML =  ''
    gameRows.forEach((row, rowIndex) => {
        const gameRow = document.createElement('div')
        gameRow.classList.add('gameRow')

        row.forEach((letter, letterIndex) => {
            const gameCell = document.createElement('div')
            gameCell.classList.add('gameRow-cell') 
            if (letter !== '#') {
                gameCell.textContent = letter
            }

            // Reveal letter colors
            if (rowIndex < currentRow) {
                if (hiddenWord.includes(letter)) {
                    gameCell.classList.add('hasLetter')
                    hasLetters += letter
                } else if (!hiddenWord.includes(letter)) {
                    gameCell.classList.add('wrongLetter')
                    wrongLetters += letter
                }
                if (letter === hiddenWord[letterIndex]) {
                    gameCell.classList.add('correctLetter')
                    spottedLetters += letter
                }
            }

            gameRow.appendChild(gameCell)
        })

        wordContainer.appendChild(gameRow)
    })
}
renderGameRows()

function renderKeyBoard() {
    const keyBoardRowsRussian = ['йцукенгшщзхъ', 'фывапролджэ', 'ячсмитьбю']
    const keyBoardRowsQWERTY = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

    const keyBoardRows = language === 'russian' ? keyBoardRowsRussian : keyBoardRowsQWERTY
    const keyBoard = document.querySelector('.keyBoard')
    keyBoard.classList.add('keyBoard')

    for (let row of keyBoardRows) {

        const keyBoardRow = document.createElement('div')
        keyBoardRow.classList.add('keyBoard-row')

        for (let letter of row) {

            if (letter === 'я' || letter === 'z') {
                const deleteButton = document.createElement('button')
                deleteButton.style.width = '4rem'
                deleteButton.style.display = 'flex'
                deleteButton.style.alignItems = 'center'
                deleteButton.style.justifyContent = 'center'
                const img = document.createElement('img')
                img.src = 'assets/delete.png'
                deleteButton.appendChild(img)
                deleteButton.classList.add('keyBoard-row-button')
                deleteButton.addEventListener('click', handleDeleteLetter)
                keyBoardRow.appendChild(deleteButton)
            }

            const keyBoardButton = document.createElement('button')
            keyBoardButton.textContent = letter
            keyBoardButton.classList.add('keyBoard-row-button')

            // Coloring buttons
            if (wrongLetters.includes(letter)) {
                keyBoardButton.classList.add('keyBoard-row-button-wrongLetter')
            }
            if (spottedLetters.includes(letter)) {
                keyBoardButton.classList.add('keyBoard-row-button-spottedLetter')
            }
            if (hasLetters.includes(letter)) {
                keyBoardButton.classList.add('keyBoard-row-button-hasLetter')
            }

            keyBoardButton.addEventListener('click', () => handleClickLetter(letter))
            keyBoardRow.appendChild(keyBoardButton)

            if (letter === 'ю' || letter === 'm') {
                const enterButton = document.createElement('button')
                enterButton.addEventListener('click', handleConfirmAttempt)
                enterButton.textContent = 'Enter'
                enterButton.style.fontSize = '1rem'
                enterButton.style.width = '3rem'
                enterButton.classList.add('keyBoard-row-button')
                keyBoardRow.appendChild(enterButton)
            }
        }

        keyBoard.appendChild(keyBoardRow)
    }


    pageContainer.appendChild(keyBoard)
}
renderKeyBoard()

function handleClickLetter(letter) {
    gameRows = gameRows.map((row, i) => {
        if (i === currentRow) {
            return row.map((e, i) => {
                if (i === currentLetter) {
                    return letter
                } else {
                    return e
                }
            })
        } else {
            return row
        }
    })
    renderGameRows()

    if (currentLetter < hiddenWord.length) {
        currentLetter++
    }
}

function handleDeleteLetter() {
    if (currentLetter > 0) {
        --currentLetter
    }
    gameRows = gameRows.map((row, i) => {
        if (i === currentRow) {
            return row.map((e, i) => {
                if (i === currentLetter) {
                    return '#'
                } else {
                    return e
                }
            })
        } else {
            return row
        }
    })
    renderGameRows()
}


function setEndgameWindowText() {
    const rightText = language === 'russian' ? 'Вы отгадали слово:' : 'You guessed the word:'
    const wrongText = language === 'russian' ? 'Вы не отгадали слово:' : "You didn't guess the word:"
    const attemptsText = language === 'russian' ? 'Количество попыток:' : 'Attempts:'

    document.querySelector('.endgameWindow-message-sub').textContent = playerWin ? rightText : wrongText
    document.querySelector('.endgameWindow-message-word').textContent = hiddenWord
    document.querySelector('.endgameWindow-message-word').style.color = playerWin ? '#33ab26' : 'red'
    document.querySelector('.endgameWindow-attempts-text').textContent = attemptsText
    document.querySelector('.endgameWindow-attempts-number').textContent = currentRow + 1
}

async function handleConfirmAttempt() {
    // Chek if word has enough length
    const count = gameRows[currentRow].reduce((acc, cur) => cur !== '#' ? acc + 1 : acc, 0)
    if (count < hiddenWord.length) {
        // Show and hide error window
        const errorWindowWrapper = document.querySelector('.errorWindow-wrapper')
        errorWindowWrapper.classList.add('errorWindow-show')
        document.querySelector('.errorWindow').textContent = language === 'russian' ? 'Слово не достаточной длины' : 'The word is not long enough'
        setTimeout(() => errorWindowWrapper.classList.remove('errorWindow-show'), 2000)

        gameRows = gameRows.map((row, i) => i === currentRow ? row.map(e => e = '#') : row)
        currentLetter = 0
        renderGameRows()
        return
    }

    // Check is word existing
    await checkValidWord(gameRows[currentRow].join(''))
    console.log(isWordExisting + ' sdsda')
    if (!isWordExisting) {
        // Show and hide error window
        const errorWindowWrapper = document.querySelector('.errorWindow-wrapper')
        errorWindowWrapper.classList.add('errorWindow-show')
        document.querySelector('.errorWindow').textContent = language === 'russian' ? 'Такого слова не существует' : 'There is no such word'
        setTimeout(() => errorWindowWrapper.classList.remove('errorWindow-show'), 2000)
    
        gameRows = gameRows.map((row, i) => i === currentRow ? row.map(e => e = '#') : row)
        currentLetter = 0
        renderGameRows()
        return
    }

    // Win or Loss
    if (gameRows[currentRow].join('') === hiddenWord) {
        document.querySelector('.endgameWindow-wrapper').classList.add('endgameWindow-open')
        playerWin = true
        setEndgameWindowText()
    } else if (currentRow === gameRows.length - 1) {
        document.querySelector('.endgameWindow-wrapper').classList.add('endgameWindow-open')
        playerWin = false
        setEndgameWindowText()
    }

    currentRow++
    currentLetter = 0
    renderGameRows()

    // Clear keyboard before render
    document.querySelector('.keyBoard').innerHTML = ''
    renderKeyBoard()
}

function getRandomWord() {
    const words = language === 'russian' ? russianWords : englishWords
    hiddenWord = words[Math.floor(Math.random() * (words.length + 1)) + 0]
}

function handleRestartGame() {
    document.querySelector('.endgameWindow-wrapper').classList.remove('endgameWindow-open')
    playerWin = false
    currentRow = 0
    currentLetter = 0
    wrongLetters = ''
    hasLetters = ''
    spottedLetters = ''
    document.querySelector('.keyBoard').innerHTML = ''
    renderKeyBoard()
    getRandomWord()
    createGameRows()
    renderGameRows()
    setEndgameWindowText()
}
document.querySelector('.endgameWindow-playAgain').addEventListener('click', handleRestartGame)


// Header Buttons **************************************************************************
document.querySelector('.svg-button-reload').addEventListener('click', handleRestartGame)

// Language Selection
document.querySelector('.svg-button-language-img').src = language === 'russian' ? 'assets/russia.png' : 'assets/usa.png'

function handleSelectLanguage() {
    if (language === 'russian') {
        language = 'english'
    } else if (language === 'english') {
        language = 'russian'
    }
    document.querySelector('.svg-button-language-img').src = language === 'russian' ? 'assets/russia.png' : 'assets/usa.png'
    document.querySelector('.endgameWindow-playAgain').textContent = language === 'russian' ? 'Играть снова' : 'Play again'
    handleRestartGame()
}
document.querySelector('.svg-button-language').addEventListener('click', handleSelectLanguage)


// API Яндекс Dictionary проверка существующих слов
async function checkValidWord(text) {
    const lang = language === 'russian' ? 'ru-en' : 'en-ru'
    const API_KEY = 'dict.1.1.20241217T201826Z.8fff9ced0a149268.42a5828cc99f7fdf3ba99894804052410454f0bd'
    const url = `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=${lang}&text=${text}`

    try {
        const response = await fetch(url)

        if (!response.ok) {
            throw new Error('Network error: ' + response.status)
        }

        const data = await response.json()
        isWordExisting = data.def.length > 0
    } catch(e) {
        console.error(e)
    }

}

console.log(`Oh, I see you're very smart to open this menu. Here's an answer for you > ${hiddenWord}`)
// Why you watching my code? 