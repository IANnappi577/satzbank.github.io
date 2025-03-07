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

let wipe = false;

// TODO: 
// - add a button to clear localstorage (localStorage.clear() with warnings) if users want to flush the cache
// - display a banner that stays for 5 seconds that an item was added successfully
// - set all textfields/forms to null string
// - create edit button to remove words/sentences
window.onload = function() {

    if(wipe) {localStorage.clear();}

    // pull stored wordlists
    let verblist = JSON.parse(localStorage.getItem("verbWortliste")) || {};
    let nounlist = JSON.parse(localStorage.getItem("nomenWortliste")) || {};
    let adjlist = JSON.parse(localStorage.getItem("adjektivWortliste")) || {};

    // load defaults if there is nothing stored
    if (Object.keys(verblist) == 0) {
        localStorage.setItem("verbWortliste", JSON.stringify(
            {  "abholen (sep.)" : ["Ich das Telefon abgeholen.", "Wir holen dich ab."],
               "fühlen (reflx.)" : ["Ich fühle mich Glücklich."]
            }
        ));
    }
    if (Object.keys(nounlist) == 0) {
        localStorage.setItem("nomenWortliste", JSON.stringify(
            { "die Luft" : ["Lass die Luft rein."],
              "der Absender" : ["Schreib den Absender auf den Brief."],
              "das Messer" : ["Er hat ein Messer!"]
            }
        ));
    }
    if (Object.keys(adjlist) == 0) {
        localStorage.setItem("adjektivWortliste", JSON.stringify(
            { "allein" : ["Er kommt allein.", "Ich war allein im Park."],
              "anstrengenden" : ["Er hat morgen einen anstrengenden Tag."]
            }
        ));
    }

    refreshWordlist(0);
    refreshWordlist(1);
    refreshWordlist(2);
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
    } else {
        localStorage.setItem("adjektivWortliste", JSON.stringify(ordered));
    }

    return;
}

function removeWord(word, option) {

    // display an alert to the user to make sure they want to delete
    if(!confirm("Wollen Sie wirklich dieses Wort entfernen?")) { return; }

    // based on the word and option, remove the word from the DB + all sentences
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

    // delete word
    delete wordlist[word];

    // re-write back to the localstorage
    if (option == 0) {
        localStorage.setItem("verbWortliste", JSON.stringify(wordlist));
    } else if (option == 1) {
        localStorage.setItem("nomenWortliste", JSON.stringify(wordlist));
    } else {
        localStorage.setItem("adjektivWortliste", JSON.stringify(wordlist));
    }

    // redraw wordlist
    refreshWordlist(option);
    return;
}

function removeSentence(word, sentence, option) {
    // remove the current sentence from the word

    // display an alert to the user to make sure they want to delete
    if(!confirm("Wollen Sie wirklich dieses Satz entfernen?")) { return; }

    // based on the word and option, remove the word from the DB + all sentences
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

    console.log(sentence);

    // remove the specific sentence from the wordlist
    removeItem(wordlist[word], sentence);

    // re-write back to the localstorage
    if (option == 0) {
        localStorage.setItem("verbWortliste", JSON.stringify(wordlist));
    } else if (option == 1) {
        localStorage.setItem("nomenWortliste", JSON.stringify(wordlist));
    } else {
        localStorage.setItem("adjektivWortliste", JSON.stringify(wordlist));
    }

    // redraw wordlist
    refreshWordlist(option);
    return;
}

function storeSentence(word, sentence, option) {
    let wordlist;

    if (option == 0) {
        // get verb wordlist, append new sentence, then save
        wordlist = JSON.parse(localStorage.getItem("verbWortliste")) || {};
        wordlist[word].push(sentence);
        console.log(wordlist);
        localStorage.setItem("verbWortliste", JSON.stringify(wordlist));
    } else if (option == 1) {
        // get noun wordlist, append new sentence, then save
        wordlist = JSON.parse(localStorage.getItem("nomenWortliste")) || {};
        wordlist[word].push(sentence);
        console.log(wordlist);
        localStorage.setItem("nomenWortliste", JSON.stringify(wordlist));
    } else if (option == 2) {
        // get adjective wordlist, append new sentence, then save
        wordlist = JSON.parse(localStorage.getItem("adjektivWortliste")) || {};
        wordlist[word].push(sentence);
        console.log(wordlist);
        localStorage.setItem("adjektivWortliste", JSON.stringify(wordlist));
    }
    return;
}

function expandNewSentence(word, option) {
    // creates the form for adding new sentences per word
    let wordBox = document.getElementById(word).children[2];

    const form = document.createElement("form");
    form.onsubmit = function() { satzHinzufügen(event, word, option); };
    form.id = word + ".f";  // create unique ID for the form to find it

    // create new LI with input box and button for the form
    const inputLI = document.createElement("li");
    const input = document.createElement("input");
    input.type = "text";
    input.id = word + ".i";
    input.required = true;
    inputLI.appendChild(input);
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "hinzufügen";
    inputLI.appendChild(button);

    // create a minus button to minimize items
    const minusButton = document.createElement("button");
    minusButton.textContent = "-"
    minusButton.classList.add("plus");
    minusButton.style.marginLeft = "5px";
    // add event listener for minimizing the button
    minusButton.addEventListener("click", () => minimizeNewSentence(word));
    minusButton.type = "button";
    inputLI.appendChild(minusButton);

    form.appendChild(inputLI);

    wordBox.appendChild(form);

    // disable add button until the user re-enables it in submitting the sentence
    let addButton = document.getElementById(word + ".b");
    addButton.disabled = true;

    return;
}

function minimizeNewSentence(word) {
    // remove the form list item and get rid of it
    let wordBox = document.getElementById(word).children[2];
    let form = document.getElementById(word + ".f");
    wordBox.removeChild(form);

    // re-enable the add button
    let addButton = document.getElementById(word + ".b");
    addButton.disabled = false;

    return;
}

function refreshWordlist(option) {
    // refreshes the wordlist with the option specified;
    // 0=verb, 1=noun, 2=adjective
    // get the wordlist
    let wordlist;
    let wordUL;
    if(option == 0) {
        wordlist = JSON.parse(localStorage.getItem("verbWortliste")) || {};
        wordUL = document.getElementById("verben");
    } else if (option == 1) {
        wordlist = JSON.parse(localStorage.getItem("nomenWortliste")) || {};
        wordUL = document.getElementById("nomen");
    } else {
        wordlist = JSON.parse(localStorage.getItem("adjektivWortliste")) || {};
        wordUL = document.getElementById("adjektive");
    }
    // wipe original data, then display added word
    wordUL.innerHTML = "";

    for(i=0; i<Object.keys(wordlist).length; i++) {
        const word = Object.keys(wordlist)[i];
        const newitem = document.createElement("li");
        newitem.id = word;
        
        // create span and append it
        let spanitem = document.createElement("span");
        spanitem.classList.add("wort");
        
        // if this is a noun, also add its colored gender
        if(option == 1) {
            const genderNounList = word.split(" ");
            // create coloured span for die/der/das
            let genderspan = document.createElement("span");
            genderspan.textContent = genderNounList[0];
            genderspan.classList.add(genderNounList[0]);
            spanitem.appendChild(genderspan);
            spanitem.appendChild(document.createTextNode(" " + genderNounList[1] + " "));
        } else {
            spanitem.textContent = word + " ";
        }
        newitem.appendChild(spanitem);

        // TODO: activate edit button to add these, not always displaying
        // add remove button after word
        const rem = document.createElement("button");
        rem.textContent = "x";
        rem.classList.add("entfernen");
        rem.addEventListener("click", () => removeWord(word, option));
        newitem.appendChild(rem);

        // create list of UL items
        const newsentencelist = document.createElement("ul");
        
        // append list of sentences
        for(j=0; j<wordlist[word].length; j++) {
            const sentenceLI = document.createElement("li");
            sentenceLI.textContent = wordlist[word][j] + " ";
            
            // if this is the last sentence, append the button
            if(j == wordlist[word].length-1) {
                const plus = document.createElement("button");
                plus.textContent = "+";
                plus.classList.add("plus");
                plus.addEventListener("click", () => expandNewSentence(word, option));
                plus.id = word + ".b";
                sentenceLI.appendChild(plus);
            }

            // append a remove sentence button
            // TODO: back this part of the edit menu, and not inline
            const rem_s = document.createElement("button");
            rem_s.textContent = "x";
            rem_s.classList.add("entfernen");
            const idx = wordlist[word][j];
            rem_s.addEventListener("click", () => removeSentence(word, idx, option));
            sentenceLI.appendChild(document.createTextNode(" "));
            sentenceLI.appendChild(rem_s);

            newsentencelist.appendChild(sentenceLI);
        }
        newitem.appendChild(newsentencelist);
            
        // Append the new li as a child of ul
        wordUL.appendChild(newitem);
    }

    // now redraw the add word forms:
    if(option == 0) {
        let form = document.createElement("form");
        form.onsubmit = function() { verbHinzufügen(event); };
        let inputLI = document.createElement("li");
        inputLI.textContent = "Verben hinzufügen: "
        // create all children within li new input word: input box, ul with sentence input
        let inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "verbenWortEingeben";
        inputBox.required = true;
        inputLI.appendChild(inputBox);
        let sentenceUL = document.createElement("ul");
        let sentenceLI = document.createElement("li");
        sentenceLI.textContent = "Satz: ";
        let sentenceInputBox = document.createElement("input");
        sentenceInputBox.type = "text";
        sentenceInputBox.id = "verbenSatzEingeben";
        sentenceInputBox.required = true;
        sentenceLI.appendChild(sentenceInputBox);
        sentenceUL.appendChild(sentenceLI);  
        inputLI.appendChild(sentenceUL);
        // create the button, then append everything (inputLI, button) to the form
        let button = document.createElement("button");
        button.type = "submit";
        button.textContent = "hinzufügen";
        form.appendChild(inputLI);
        form.appendChild(button);

        // now append the form to the end of the wordlist
        wordUL.appendChild(form);
       
    } else if (option == 1) {
        let form = document.createElement("form");
        form.onsubmit = function() { nomenHinzufügen(event); };
        let inputLI = document.createElement("li");
        inputLI.textContent = "Nomen hinzufügen: "
        // create all children within li new input word: gender selector, input box, ul with sentence input
        let genderSelector = document.createElement("select");
        genderSelector.id = "geschlecht";
        let die = document.createElement("option"); die.value = "die"; die.text = "die";
        let der = document.createElement("option"); der.value = "der"; der.text = "der";
        let das = document.createElement("option"); das.value = "das"; das.text = "das";
        genderSelector.appendChild(die);
        genderSelector.appendChild(der);
        genderSelector.appendChild(das);
        inputLI.appendChild(genderSelector);

        let inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "nomenWortEingeben";
        inputBox.required = true;
        inputLI.appendChild(inputBox);
        let sentenceUL = document.createElement("ul");
        let sentenceLI = document.createElement("li");
        sentenceLI.textContent = "Satz: ";
        let sentenceInputBox = document.createElement("input");
        sentenceInputBox.type = "text";
        sentenceInputBox.id = "nomenSatzEingeben";
        sentenceInputBox.required = true;
        sentenceLI.appendChild(sentenceInputBox);
        sentenceUL.appendChild(sentenceLI);  
        inputLI.appendChild(sentenceUL);
        // create the button, then append everything (inputLI, button) to the form
        let button = document.createElement("button");
        button.type = "submit";
        button.textContent = "hinzufügen";
        form.appendChild(inputLI);
        form.appendChild(button);

        // now append the form to the end of the wordlist
        wordUL.appendChild(form);
    } else {
        let form = document.createElement("form");
        form.onsubmit = function() { adjektivHinzufügen(event); };
        let inputLI = document.createElement("li");
        inputLI.textContent = "Adjektiv hinzufügen: "
        // create all children within li new input word: input box, ul with sentence input
        let inputBox = document.createElement("input");
        inputBox.type = "text";
        inputBox.id = "adjektiveWortEingeben";
        inputBox.required = true;
        inputLI.appendChild(inputBox);
        let sentenceUL = document.createElement("ul");
        let sentenceLI = document.createElement("li");
        sentenceLI.textContent = "Satz: ";
        let sentenceInputBox = document.createElement("input");
        sentenceInputBox.type = "text";
        sentenceInputBox.id = "adjektiveSatzEingeben";
        sentenceInputBox.required = true;
        sentenceLI.appendChild(sentenceInputBox);
        sentenceUL.appendChild(sentenceLI);  
        inputLI.appendChild(sentenceUL);
        // create the button, then append everything (inputLI, button) to the form
        let button = document.createElement("button");
        button.type = "submit";
        button.textContent = "hinzufügen";
        form.appendChild(inputLI);
        form.appendChild(button);

        // now append the form to the end of the wordlist
        wordUL.appendChild(form);
    }
    return;
}

// make a clear function?

function verbHinzufügen(event) {
    event.preventDefault();
    let wortStr = document.getElementById("verbenWortEingeben");
    let satz = document.getElementById("verbenSatzEingeben");

    // convert to list and store
    storeWord(wortStr.value, [satz.value], 0);

    // pass option=0 because its the verblist
    refreshWordlist(0);

    wortStr.value = "";
    satz.value = "";    
}

function nomenHinzufügen(event) {
    // TODO: make sure to put words in DB in the correct format "gender noun";
    event.preventDefault();
    let wortStr = document.getElementById("nomenWortEingeben");
    let geschlecht = document.getElementById("geschlecht");
    let satz = document.getElementById("nomenSatzEingeben");

    // convert to list and store
    storeWord(geschlecht.value + " " + wortStr.value, [satz.value], 1);
    
    // pass option=1 because its the nounlist
    refreshWordlist(1);

    wortStr.value = "";
    satz.value = "";  
}

function adjektivHinzufügen(event) {
    event.preventDefault();
    let wortStr = document.getElementById("adjektiveWortEingeben");
    let satz = document.getElementById("adjektiveSatzEingeben");

    // convert to list and store
    storeWord(wortStr.value, [satz.value], 2);

    // pass option=2 because its the adjectivelist
    refreshWordlist(2);

    wortStr.value = "";
    satz.value = "";  
}

function satzHinzufügen(event, word, option) {
    // add a sentence to the current word
    event.preventDefault();

    // the id is word + .i:
    let satz = document.getElementById(word + ".i");
    console.log(satz);
    console.log(word);
    console.log(option);

    // convert to list and store
    storeSentence(word, satz.value, option);

    // pass option=2 because its the adjectivelist
    refreshWordlist(option);

    satz.value = "";
}


// ---- HELPER FUNCTIONS ----

// remove a known item from an array by name or value
function removeItem(array, itemToRemove) {
    const index = array.indexOf(itemToRemove);
    if (index !== -1) {
        array.splice(index, 1);
    }
    console.log(array);
}