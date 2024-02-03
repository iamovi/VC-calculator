let display = document.getElementById("display");
let historyList = document.getElementById("historyList");
let clearHistoryButton = document.getElementById("clearHistoryButton");
let gunSoundEnabled = true;
let historyCount = 1;

const audioFiles = [
  'sound/1.mp3',
  'sound/2.mp3',
  'sound/3.mp3',
  'sound/4.mp3',
  'sound/5.mp3',
  'sound/6.mp3',
  'sound/7.mp3',
];

const audioElements = audioFiles.map(file => {
  const audio = new Audio(file);
  audio.load();
  return audio;
});

const themeAudio = new Audio("assets/theme.m4a");
themeAudio.load();

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
  const historyArray = JSON.parse(localStorage.getItem("calculatorHistory")) || [];
  const emptyMessage = historyList.querySelector('li');

  if (emptyMessage) {
    historyList.removeChild(emptyMessage);
  }

  const historyItem = document.createElement("li");
  historyItem.textContent = `${historyCount}/ ${expression}`;
  historyList.appendChild(historyItem);
  historyCount++;

  historyArray.push(expression);
  localStorage.setItem("calculatorHistory", JSON.stringify(historyArray));

  clearHistoryButton.style.display = "block";
}

function loadHistoryFromLocalStorage() {
  const historyArray = JSON.parse(localStorage.getItem("calculatorHistory")) || [];

  if (historyArray.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.textContent = "Empty";
    historyList.appendChild(emptyMessage);
    clearHistoryButton.style.display = "none";
  } else {
    historyArray.forEach(expression => {
      const historyItem = document.createElement("li");
      historyItem.textContent = `${historyCount}/ ${expression}`;
      historyList.appendChild(historyItem);
      historyCount++;
    });

    clearHistoryButton.style.display = "block";
  }
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

function clearHistory() {
  const modal = document.createElement("div");
  modal.className = "modal";
  
  const modalContent = document.createElement("div");
  modalContent.className = "modal-content";

  const confirmationText = document.createElement("p");
  confirmationText.textContent = "Type 'OK' to confirm:";
  
  const inputField = document.createElement("input");
  inputField.type = "text";

  const confirmButton = document.createElement("button");
  confirmButton.textContent = "Confirm";
  confirmButton.onclick = function() {
    const enteredText = inputField.value.toLowerCase();
    if (enteredText === 'ok') {
      historyList.innerHTML = "";
      historyCount = 1;
      localStorage.removeItem("calculatorHistory");
      clearHistoryButton.style.display = "none";
      loadHistoryFromLocalStorage();
      closeModal();
    } else {
      alert("Confirmation failed. Please type 'OK' to confirm.");
    }
  };

  const closeButton = document.createElement("button");
  closeButton.textContent = "Cancel";
  closeButton.onclick = function() {
    closeModal();
  };

  modalContent.appendChild(confirmationText);
  modalContent.appendChild(inputField);
  modalContent.appendChild(confirmButton);
  modalContent.appendChild(closeButton);
  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  function closeModal() {
    document.body.removeChild(modal);
  }
}

window.onload = () => {
  loadHistoryFromLocalStorage();

  const preloader = document.getElementById('preloader');
  preloader.style.display = 'none';
};
