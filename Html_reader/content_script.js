// This script will run on the current page and read the DOM.
// Function to get the entire HTML content of the webpage.
function getPageHTML(row) {
  var table = document.documentElement.childNodes[1].childNodes[1].childNodes[0].childNodes[0].childNodes[1].childNodes[1].childNodes[0].childNodes;
  return table
}

function readFile(callback) {
  const fileReader = new FileReader();

  fileReader.onload = function (event) {
    const content = event.target.result;
    const wordsList = content.split(/\s+/); // Split by whitespace characters
    callback(wordsList);
  };

  // Read the words.txt file from the extension's folder.
  fetch(chrome.runtime.getURL("words.txt"))
    .then(response => response.text())
    .then(fileContent => {
      fileReader.readAsText(new Blob([fileContent]));
    });
}

// Listen for messages from the popup script.
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "get_page_html") {
    const pageHTML = getPageHTML();
    console.log(pageHTML);

  } else if (request.action === "solve_wordle") {
    readFile(function (wordsArray) {
      solveWordle(wordsArray);
    });
  }
});

function simKey(key, eventType) {
  var event = new KeyboardEvent(eventType, { key });
  document.dispatchEvent(event);
}

function sendWord(guess) {
  for (let i = 0; i < 5; i++) {
    simKey(guess[i], "keydown");
  }

  setTimeout(function () {
    simKey("Enter", "keydown");
  }, 100);
}

// function solveWordle(array) {
//   let correct = ['', '', '', '', ''];
//   let no = ["", "", "", "", ""];

//   var finished = false;
//   for (let row = 0; row < 5; row++) {
//     let guess = nextGuess(correct, no, array);
//     console.log("Guessed:", guess[0]);
//     sendWord(guess[0]);

//     const tablePromise = new Promise((resolve) => {
//       setTimeout(function () {
//         var table = getPageHTML(row);
//         resolve(table);
//       }, 100);
//     });

//     // Use async/await to wait for the table data to be fetched
//     (async function () {
//       var table = await tablePromise;
//       console.log("Checkup");
//       for (let i = 0; i < 5; i++) {
//         var param = table[row].childNodes[i]["ariaLabel"].split(": ");
//         var letter = param[0].toLowerCase();
//         var status = param[1];

//         if (status == "correct") correct[i] = letter;
//         else if (status == "elsewhere") {
//           no[i] += letter;
//           finished = false;
//         } else if (status == "no") {
//           for (let j = 0; j < 5; j++) {
//             no[i] += letter;
//           }
//           finished = false;
//         }
//       }
//       console.log("Finished:", finished);
//       if (finished) return;
//     })();
//     if (finished) break;
//   }
// }

function solveWordle(array) {
  let correct = ['', '', '', '', ''];
  let no = ["", "", "", "", ""];
  let remaining = array;

  function processRow(row) {
    if (row >= 5) return; // Base case: Stop recursion when all rows are processed or the word is found
    let guess = nextGuess(correct, no, remaining);
    remaining = guess;
    
    console.log(remaining);

    console.log("Guessed:", guess[0]);
    sendWord(guess[0]);

    // Use a promise to fetch the table data asynchronously
    const tablePromise = new Promise((resolve) => {
      setTimeout(function () {
        var table = getPageHTML(row);
        resolve(table);
      }, 100);
    });

    // Use async/await to wait for the table data to be fetched
    tablePromise.then((table) => {
      console.log("Checkup");
      let finished = true; // Initialize finished to true for this row
      for (let i = 0; i < 5; i++) {
        var param = table[row].childNodes[i]["ariaLabel"].split(": ");
        var letter = param[0].toLowerCase();
        var status = param[1];

        if (status == "correct") correct[i] = letter;
        else if (status == "elsewhere") {
          no[i] += letter;
          finished = false; // If any status is "elsewhere," this row is not finished
        } else if (status == "no") {
          for (let j = 0; j < 5; j++) {
            no[j] += letter;
          }
          finished = false; // If any status is "no," this row is not finished
        }
      }
      console.log("Finished:", finished);
      if (!finished) {
        // If this row is not finished, process the next row recursively
        processRow(row + 1);
      }
    });
    console.log(correct);
    console.log(no);

  }

  // Start processing the rows recursively from row 0
  processRow(0);
}


function nextGuess(correct, no, remaining) {
  var rwords = [];
  for (let word of remaining) {
    var possible = true;
    for (let i = 0; i < 5; i++) {

      if ((correct[i] && word[i] != correct[i])
        || no[i].includes(word[i])){
        possible = false;
        break;
      }
    }
    if (possible) rwords.push(word);
  }

  return rwords;
}