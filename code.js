// Here we are accessing the Elements: 
const welcomePage = document.getElementById('welcomePage');
const startBtn = document.getElementById('startBtn');
const firstPage = document.getElementById('firstPage');
const form = document.getElementById('form');
const firstPlayer = document.getElementById('firstPlayer');
const secondPlayer = document.getElementById('secondPlayer');
const categories = document.getElementById('categories');
const notes = document.getElementById('notes');
const gameContainer = document.getElementById('gameContainer');
const playerNames = document.getElementById('playerNames');

// Here we will store the played categories : 
let playerCategories = [];

// Here we will store the names like category name, player's name : 
let categoryName;
let firstPlayerName;
let secondPlayerName;
let currentPlayerName;

// Here we will store difficulty levels while playing and the questions : 
let currentDifficulty;
let storeQuestions;

// Here we will store current index number of the questions and the players score : 
let currentQuestionIndex = 0;
let firstPlayerScore = 0;
let secondPlayerScore = 0;

// Here we have created some elements to store the score : 
let scoreDiv = document.createElement('div');
let firstPlayerScoreContainer = document.createElement('h3');
let secondPlayerScoreContainer = document.createElement('h3');
let msg = document.createElement('p');

// This will take you to the next page : 
startBtn.addEventListener('clickc', () => {
    welcomePage;
});

// This function will display the first page and hide the welcome page : 
function nextDiv() {
    welcomePage.style.display = 'none';
    firstPage.style.display = 'block';
}

// In this form the players will add their names and select the categories : 
form.addEventListener('submit', (e) => {
    e.preventDefault();
    firstPlayerName = firstPlayer.value;
    secondPlayerName = secondPlayer.value;

    let category = categories.value;
    console.log(category);
    categoryName = document.querySelector(`[value=${category}]`).innerHTML;
    console.log(categoryName);

    chooseCategory(category);
});

// This function will help us to choose the category and if the category is not chosen the it will give you a msg and if the category is not played then it will fetch the questions and if the category is already played then it show you another msg : 
function chooseCategory(category) {
    if (category === 'choose') {
        notes.innerHTML = 'Please select the Category';
    }
    else if (!playerCategories.includes(category)) {
        notes.innerHTML = '';
        firstPage.style.display = 'none';
        playerCategories.push(category);
        fetchQuestions(category);
    }
    else {
        notes.innerHTML = 'please select another category';
    }
}

// These are the difficulty levels of questions : 
let difficultyLevels = ['easy', 'medium', 'hard'];

// This function will fetch the questions : 
async function fetchQuestions(category) {
    try {
        storeQuestions = [];
        let arrLength = difficultyLevels.length;

        for (let i = 0; i < arrLength; i++) {
            const response = await fetch(`https://the-trivia-api.com/v2/questions?categories=${category}&limit=2&difficulties=${difficultyLevels[i]}`);
            let data = await response.json();
            storeQuestions.push(...data);
        }
        // console.log(`Questions : ${storeQuestions}`);
        displayQuestions(storeQuestions);
    }
    catch (error) {
        console.error(`Error in fetching questions : ${error}`);

        firstPage.style.display = 'none';
        gameContainer.style.display = 'flex';
        gameContainer.style.color = 'red';
        gameContainer.style.margin = '20px';
        gameContainer.innerHTML = `<h2> ${error} </h2>`;
    }
}

// This function is to display the questions : 
function displayQuestions(storeQuestions) {
    gameContainer.style.display = 'flex';

    let question = storeQuestions[currentQuestionIndex];
    // console.log(`The current question is : ${question.question.text}`);

    currentDifficulty = question.difficulty;
    let correctOption = question.correctAnswer;
    console.log(`Correct Answer is : ${correctOption}`);
    let incorrectOptions = question.incorrectAnswers;
    console.log(`Incorrect Answers are : ${incorrectOptions}`);
    incorrectOptions.push(correctOption);

    // calling the suffleOptions function and assigning it in a variable : 
    let allOptions = suffleOptions(incorrectOptions);

    let currentQuestion = question.question.text;
    console.log(currentQuestion);

    if (currentQuestionIndex % 2 === 0) {
        currentPlayerName = firstPlayerName;
    }
    else {
        currentPlayerName = secondPlayerName;
    }

    questionWithOptions(currentQuestion, allOptions, correctOption);
}

// This function will show the question and their options. It will also show you player name, category name, and the difficulty level and score as well : 
function questionWithOptions(currentQuestion, allOptions, correctOption) {
    let infoDiv = document.createElement('div');
    let playerCategory = document.createElement('h2');
    let level = document.createElement('h2');

    playerCategory.textContent = `Chosen Category : ${categoryName}`;
    level.textContent = `Level : ${currentDifficulty}`;

    // Here are the question and their options : 
    gameContainer.innerHTML = `
    <h1> Trivia Quiz Game <h1> 
    <h2> It's your turn ${currentPlayerName} </h2>
    <h3> Ques. ${currentQuestionIndex + 1} : ${currentQuestion} </h3>
    <ol type="a">
        <li>${allOptions[0]}</li>
        <li>${allOptions[1]}</li>
        <li>${allOptions[2]}</li>
        <li>${allOptions[3]}</li>
    </ol>
    `

    infoDiv.style.display = 'flex';
    infoDiv.style.flexDirection = 'column';
    infoDiv.style.width = '100%';
    infoDiv.style.border = '1px solid purple';
    infoDiv.style.borderRadius = '10px';

    firstPlayerScoreContainer.innerHTML = `${firstPlayerName} - ${firstPlayerScore}`;
    secondPlayerScoreContainer.innerHTML = `${secondPlayerName} - ${secondPlayerScore}`;

    scoreDiv.appendChild(firstPlayerScoreContainer);
    scoreDiv.appendChild(secondPlayerScoreContainer);

    infoDiv.appendChild(playerCategory);
    infoDiv.appendChild(level);
    infoDiv.appendChild(scoreDiv);

    gameContainer.appendChild(infoDiv);
    gameContainer.appendChild(msg);
    gameContainer.appendChild(scoreDiv);

    let li = document.querySelectorAll('li');
    li.forEach((e, i) => {
        e.addEventListener('click', () => {
            let clickedOpt = e.textContent;
            updateTheScore(clickedOpt, correctOption, currentDifficulty);
        });
    });
}

let options = ['first', 'second', 'third', 'fourth'];

// This function will suffle all the correct and incorrect options : 
function suffleOptions(options) {
    for (i = 0; i < options.length; i++) {
        let index = Math.floor(Math.random() * (i + 1));
        let temp = options[i];
        options[i] = options[index];
        options[index] = temp;
    }
    return options;
}

// Here we have updateTheScore function which is taking some parameters and it will track the players score according to their difficulty levels : 
function updateTheScore(clickedOpt, correctAnswer, currentDifficulty) {
    if (clickedOpt === correctAnswer) {
        msg.innerHTML = `${currentPlayerName} your answer is correct`;
        msg.style.color = 'green';

        // This is for the first player : 
        if (currentPlayerName === firstPlayerName) {
            if (currentDifficulty === 'easy') {
                firstPlayerScore += 10;
            }
            else if (currentDifficulty === 'medium') {
                firstPlayerScore += 15;
            }
            else if (currentDifficulty === 'hard') {
                firstPlayerScore += 20;
            }
        }
        // This is for the second player : 
        else if (currentPlayerName === secondPlayerName) {
            if (currentDifficulty === 'easy') {
                secondPlayerScore += 10;
            }
            else if (currentDifficulty === 'medium') {
                secondPlayerScore += 15;
            }
            else if (currentDifficulty === 'hard') {
                secondPlayerScore += 20;
            }
        }
        firstPlayerScoreContainer.innerHTML = `${firstPlayerName} - ${firstPlayerScore}`;
        secondPlayerScoreContainer.innerHTML = `${secondPlayerName} - ${secondPlayerScore}`;
    }
    else {
        msg.innerHTML = `${currentPlayerName} your answer is incorrect`;
        msg.style.color = 'red';
    }

    let li = document.querySelectorAll('li');
    // This will remove the addeventlistner from the li's :
    li.forEach((e) => {
        e.style.pointerEvents = 'none';
    });

    // After this I will provide you another button for the next question : 
    const nextQuestionBtnDiv = document.createElement('div');
    const nextQuestionBtn = document.createElement('button');
    nextQuestionBtn.textContent = 'Next Question';
    nextQuestionBtn.id = 'nextQuestionBtn';
    nextQuestionBtnDiv.appendChild(nextQuestionBtn);
    gameContainer.appendChild(nextQuestionBtnDiv);

    if (currentQuestionIndex === 5) {
        nextQuestionBtn.textContent = 'Go to next page';
    }

    nextQuestionBtn.addEventListener('click', () => {
        msg.innerHTML = '';
        displayNextQuestion(storeQuestions);
    });
}

// This function will help us to get the next question : 
function displayNextQuestion(question) {
    currentQuestionIndex++
    
    if (currentQuestionIndex < 6) {
        displayQuestions(question);
    }
    else {
        // This will take you on another page where you will get two buttons to continue the game or quit the game if all the categories have not played : 
        if (playerCategories.length < 10) {
            gameContainer.innerHTML = `
            <h1> Trivia Quiz Game </h1>
            <div id="gameBtn">
                <button id="continueBtn"> Continue Game </button>
                <button id="quitBtn"> Quit Game </button>
            </div>
            `;

            let continueGameBtn = document.getElementById('continueBtn');
            let quitBtn = document.getElementById('quitBtn');

            // Here is the continue button to continue the game with other categories which are not played : 
            continueGameBtn.addEventListener('click', () => {
                console.log('clicked on the continue button');
                gameContainer.style.display = 'none';
                firstPage.style.display = 'flex';
                playerNames.style.display = 'none';
                currentQuestionIndex = 0;
            });

            // Here is the quit button to end the game : 
            quitBtn.addEventListener('click', () => {
                console.log('Clicked on the quit button');
                winnerName();
            });
        }
        // if you have played all the categores then it will show you one msg that all categories have played see the winner : 
        else {
            gameContainer.innerHTML = `
            <h1> All categories have played </h1>
            <button id="theWinner"> See Winner </button>
            `
            const theWinner = document.getElementById('theWinner');
            theWinner.addEventListener('click', () => {
                winnerName();
            });
        }
    }
}

// This function will tell who is the winner of the game : 
function winnerName() {
    let winner;
    
    // if the first player's score is more the second player's score : 
    if (firstPlayerScore > secondPlayerScore) {
        winner = `<h2> ${firstPlayerName} won the game </h2>`;
    }
    // if the second player's score is more the first player's score : 
    else if (secondPlayerScore > firstPlayerScore) {
        winner = `<h2> ${secondPlayerName} won the game </h2>`;
    }
    // if both players score is equal : 
    else {
        winner = `<h2> It's a tie </h2>`;
    }

    gameContainer.innerHTML = `
    <h1> Total Score </h1>
    <h2> ${firstPlayerName} - ${firstPlayerScore} </h2> 
    <h2> ${secondPlayerName} - ${secondPlayerScore} </h2>
    <h3> ${winner} </h3> 
    <div>
        <button id="startAgain"> Start Again </button>
    </div>
    `
    // Taking access of start again button : 
    const startAgain = document.getElementById('startAgain');

    startAgain.addEventListener('click', () => {
        refreshPage();
    });
}

// This function will refresh the page and start the game again : 
function refreshPage() {
    location.reload();
}
