/*const randomWords = [
  'condition',
  'bottom',
  'lineage',
  'trip',
  'reporter',
  'paper',
  'colorful',
  'agent',
  'justify',
  'torture',
  'cap',
  'earthflax',
  'payment',
  'research',
  'picture',
  'garage',
  'honor',
  'memorial',
  'planet',
  'biography',
  'profound',
  'rumor',
  'gear',
  'bedroom',
  'orthodox',
  'penalty',
  'grief',
  'promote',
  'roof',
  'suite',
  'moving',
  'killer',
  'museum',
  'essay',
  'fever',
  'dignity',
  'shadow',
  'enjoy',
  'kill',
  'shy',
  'counter',
  'pawn',
  'button',
  'bullet',
  'skin',
  'rate',
  'shop',
  'consider',
  'other',
  'prospect',
];*/
const hangManImage = document.querySelector('#image');
const solutionContainer = document.querySelector('#solution-container');
const winOrLoseContainer = document.querySelector('#win-lose-container');
const letterContainer = document.querySelector('#letter-container');
const gameState = {
  word: [],
  hangman: 1,
  turn: 1,
  lettersFound: 0,
  won: false,
  lost: false,
};

function createNewSolutionLetter() {
  const newDiv = document.createElement('div');
  newDiv.classList.add('solution-letter');
  return newDiv;
}

function selectRandomWord() {
  const randomIndex = Math.floor(Math.random() * randomWords.length);
  return randomWords[randomIndex].split('');
}

function emptySolutionContainer() {
  solutionContainer.innerHTML = '';
}

function fillSolutionContainer() {
  emptySolutionContainer();
  for (let i = 0; i < gameState.word.length; i++) {
    solutionContainer.appendChild(createNewSolutionLetter());
  }
}

function removeClassesFromAllLetters() {
  const letters = document.querySelectorAll('.letter');
  letters.forEach(function (letter) {
    letter.classList.remove('failed');
    letter.classList.remove('success');
  });
}

function updateHangmanPicture() {
  hangManImage.src = 'images/hangman0' + gameState.hangman + '.png';
}


function initGameState(newWord) {
  gameState.word = newWord;
  gameState.hangman = 1;
  gameState.turn = 1;
  gameState.lettersFound = 0;
  gameState.won = false;
  gameState.lost = false;
  fillSolutionContainer();
  winOrLoseContainer.textContent = '';
  removeClassesFromAllLetters();
  updateHangmanPicture();
}

function winOrLose() {
  if (gameState.lettersFound === gameState.word.length) {
    gameState.won = true;
    winOrLoseContainer.textContent = 'You won!!';
  }

  if (gameState.hangman === 9) {
    gameState.lost = true;
    winOrLoseContainer.textContent = 'You lost!! The word was: ' + gameState.word.join('');
  }
}

function letterClicked(event) {
  if (event.target.matches('.letter') && !gameState.lost && !gameState.won) {
    if (!event.target.matches('.success') && !event.target.matches('.failed')) {
      const selectedLetter = event.target.textContent;
      let lettersFound = 0;
      gameState.word.forEach(function (letter, index) {
        if (letter.toUpperCase() === selectedLetter) {
          lettersFound++;
          const solutionLetter = document.querySelector('.solution-letter:nth-child(' + (index + 1) + ')');
          solutionLetter.textContent = letter.toUpperCase();
        }
      });
      gameState.turn++;
      if (lettersFound > 0) {
        gameState.lettersFound += lettersFound;
        event.target.classList.add('success');
      } else {
        event.target.classList.add('failed');
        gameState.hangman++;
        updateHangmanPicture();
      }
      winOrLose();
    }
  }
}



function newWordRequest() {
  const request = new XMLHttpRequest();
  request.addEventListener('readystatechange', function(event){
  if (request.readyState === 4) {
    console.log(request.status);
    if (request.status >= 200 && request.status < 300) {
      const response = JSON.parse(request.responseText);
      const NewWord = response.random_word.split('');
      initGameState(NewWord)
    } else {
      console.log('error');
    }
  }
  });
  request.open('GET', 'http://connect4.pienter.space/api/random_word');
  request.send();
}


newWordRequest();

letterContainer.addEventListener('click', letterClicked);
winOrLoseContainer.addEventListener('click', newWordRequest);
