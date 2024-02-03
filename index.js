let display = document.getElementById("display");
let historyList = document.getElementById("historyList");
let gunSoundEnabled = true; // Initially set to true

// Array of 7 audio files
const audioFiles = [
  'sound/1.mp3',
  'sound/2.mp3',
  'sound/3.mp3',
  'sound/4.mp3',
  'sound/5.mp3',
  'sound/6.mp3',
  'sound/7.mp3',
];

// Preload audio files to improve playback reliability
const audioElements = audioFiles.map(file => {
  const audio = new Audio(file);
  audio.load();
  return audio;
});

const themeAudio = new Audio("assets/theme.m4a");
themeAudio.load(); // Preload the theme song

function playRandomAudio() {
  if (gunSoundEnabled) {
    const randomIndex = Math.floor(Math.random() * audioFiles.length);
    audioElements[randomIndex].play();
  }
}

function playThemeSong() {
  if (themeAudio.paused) {
    themeAudio.play();
    document.getElementById("themeButton").innerText = "Pause Theme";
  } else {
    themeAudio.pause();
    document.getElementById("themeButton").innerText = "Play Theme";
  }
}

function appendSymbol(symbol) {
  display.value += symbol;
  playRandomAudio();
}

function calculate() {
  try {
    const expression = display.value;
    const result = eval(expression);
    display.value = result;
    addToHistory(expression + " = " + result);
    playRandomAudio();
  } catch (error) {
    display.value = "Error";
  }
}

function clearDisplay() {
  display.value = "";
  playRandomAudio();
}

function addToHistory(expression) {
  const historyItem = document.createElement("li");
  historyItem.textContent = expression;
  historyList.appendChild(historyItem);

  // Save history to local storage
  const historyArray = JSON.parse(localStorage.getItem("calculatorHistory")) || [];
  historyArray.push(expression);
  localStorage.setItem("calculatorHistory", JSON.stringify(historyArray));
}

function loadHistoryFromLocalStorage() {
  const historyArray = JSON.parse(localStorage.getItem("calculatorHistory")) || [];
  historyArray.forEach(expression => {
    const historyItem = document.createElement("li");
    historyItem.textContent = expression;
    historyList.appendChild(historyItem);
  });
}

function startSpeechRecognition() {
  const speakButton = document.getElementById("speakButton");

  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition() || new SpeechRecognition();
    recognition.lang = 'en-US';

    recognition.onstart = function () {
      speakButton.innerText = "Listening...";
    };

    recognition.onresult = function (event) {
      const spokenText = event.results[0][0].transcript.toLowerCase();
      let convertedText = spokenText.trim();

      // Handle each spoken word more precisely
      if (convertedText === 'plus') {
        convertedText = '+';
      } else if (convertedText === 'minus') {
        convertedText = '-';
      } else if (convertedText === 'multiply' || convertedText === 'times') {
        convertedText = '*';
      } else if (convertedText === 'divide') {
        convertedText = '/';
      }

      display.value += convertedText;
    };

    recognition.onerror = function (event) {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = function () {
      speakButton.innerText = "Speak";
    };

    recognition.start();
  } else {
    alert('Speech recognition not supported on your browser. Try using a different browser.');
  }
}

function toggleGunSound() {
  gunSoundEnabled = !gunSoundEnabled;
  const toggleGunSoundButton = document.getElementById("toggleGunSound");
  toggleGunSoundButton.innerText = gunSoundEnabled ? "Off Gun Sound" : "On Gun Sound";
}

// Load history from local storage on page load
window.onload = loadHistoryFromLocalStorage;
