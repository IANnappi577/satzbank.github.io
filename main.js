/*
JSON format in storage: 
    {
        "word" : ["sentence1", "sentence2"]
    }

    list names:
        - verbWortliste: verb list
        - nomenWortliste: noun list
        - adjektivWortliste: adjective list
*/

// TODO: 
// - on window.onload, pull from the cached localstorage
// - display a banner that stays for 5 seconds that an item was added successfully
// - set all textfields/forms to null string
window.onload = function() {
    // initialize wordlists
    localStorage.setItem("verbWortliste", JSON.stringify({ "öffnen" : ["Bitte öffnen Sie das Fenster."] }));
    localStorage.setItem("nomenWortliste", JSON.stringify({ "die Luft" : ["Lass die Luft rein."] }));
    localStorage.setItem("adjektivWortliste", JSON.stringify({"vollen" : ["Er hat morgen einen vollen Tag."] }));
}


// option is 0 = verben, 1 = nomen, 2 = adjektive
function storeWord(word, sentences, option) {
    // store a word to existing list locally using client storage
    let wordlist;

    if (option == 0) {
        // get verb wordlist
        wordlist = JSON.parse(localStorage.getItem("verbWortliste")) || {};
    } else if (option == 1) {
        // get noun wordlist
        wordlist = JSON.parse(localStorage.getItem("nomenWortliste")) || {};
    } else if (option == 2) {
        // get adjective wordlist
        wordlist = JSON.parse(localStorage.getItem("adjektivWortliste")) || {};
    }

    // Add new word if its unique
    if(!Object.keys(wordlist).includes(word)) {
        wordlist[word] = sentences;
    } else {
        alert("Sie haben diese Wort schon erstellt. Möchten Sie stattdessen einen neuen Satz hinzufügen?");
        return;
    }

    // sort the new list
    const ordered = Object.keys(wordlist).sort().reduce(
        (obj, key) => {
          obj[key] = wordlist[key]; 
          return obj;
        },
        {}
    );

    // Save updated list back to local storage
    if (option == 0) {
        localStorage.setItem("verbWortliste", JSON.stringify(ordered));
    } else if (option == 1) {
        localStorage.setItem("nomenWortliste", JSON.stringify(ordered));
    } else if (option == 2) {
        localStorage.setItem("adjektivWortliste", JSON.stringify(ordered));
    }

    return;
}

// TODO: add types of deletes w option
function removeWord(word) {
    // remove word from "database"
    let wordlist = JSON.parse(localStorage.getItem("wordlist")) || {};
    delete wordlist[word];
    return;
}

function getWordlist() {
    return JSON.parse(localStorage.getItem("wordlist")) || {};
}

// make a clear function?

function verbHinzufügen(event) {
    event.preventDefault();

    // Wortstring und Satz abrufen
    let wortStr = document.getElementById("verbenWortEingeben");
    let satz = document.getElementById("verbenSatzEingeben");

    // temp convert to list for now
    let sätze = [satz.value];

    storeWord(wortStr.value, sätze, 0);

    // get the wordlist
    let wordlist = JSON.parse(localStorage.getItem("verbWortliste")) || {};

    // wipe original data, then display added word
    let verbUL = document.getElementById("verben");
    verbUL.innerHTML = "";

    for(i=0; i<Object.keys(wordlist).length; i++) {
        const word = Object.keys(wordlist)[i];
        const newitem = document.createElement("li");
        
        // create span and append it
        const spanitem = document.createElement("span");
        spanitem.classList.add("wort");
        spanitem.textContent = word;
        newitem.appendChild(spanitem);

        // create list of UL items
        const newsentencelist = document.createElement("ul");
        
        // append list of sentences
        for(j=0; j<wordlist[word].length; j++) {
            const sentenceLI = document.createElement("li");
            sentenceLI.textContent = wordlist[word][j];
            newsentencelist.appendChild(sentenceLI);
        }
        newitem.appendChild(newsentencelist);
            
        // Append the new li as a child of ul
        verbUL.appendChild(newitem);
    }

    wortStr.value = "";
    satz.value = "";    
}

function nomenHinzufügen() {
}

function adjektivHinzufügen() {
}