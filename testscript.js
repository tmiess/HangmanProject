var hang = {
    wordListIndex: 0,
    guessesLeft: 8,
    currentWord: '',
    indexes: [],
    wordDisplay: [],
    lettersGuessed: [], // Added to track which letters have already been guessed for a given word - Stephen
    wordsLeft: 10,

    createWord: function() {
        hang.currentWord = arrayOfWords[hang.wordListIndex].toLowerCase();
        var firstDisplay = '';

        if (hang.currentWord.includes(" ") || hang.currentWord.includes("-") || hang.currentWord.includes("'")) {
            hang.wordListIndex++;
            if (hang.wordListIndex > 9) {
                hang.reset();
            }
            else {
                hang.createWord();
            }
        }

        else {
            for (var i = 0; i < hang.currentWord.length; i++) {
                hang.wordDisplay.push("_");
                firstDisplay = firstDisplay + " " + hang.wordDisplay[i];
            }

            console.log("word is: " + hang.currentWord);
            console.log("display is: " + firstDisplay);
            $("#currentWord").text(firstDisplay);

            //update number of words left in case some were skipped with qualifier
            hang.wordsLeft = 10 - hang.wordListIndex;
            $("#numWords").text(hang.wordsLeft);
        }
        //here should we use a variable
        //(for example here I used wordListIndex) so that we can keep calling this function
        //each time we need a new word from array wordList?

        //dictAPI.js will give you an array of 10 random words. When you include this library into project
        //(or simple copy source code to this file, as I did today morning),
        //you will have access to array named "arrayOfWords". You can use it instead of using your "wordList",
        //Or simply make this "wordList: arrayOfWords" - it will assign array of 10 random words to "wordList" var,
        //and you dont need to change your code at all, because we will have the same name.
        //                      And about "calling this function each time we need a new word":
        //              No, you don't have to - as you can see, it gives you an array of 10 random words from dictionary
        //      and you can simply work with this array, and its index, as you did with yours.
        //      IMPORTANT: we have to put "hang.createWord();" into callback function
        //      Otherwise, you will not get an array right way due to dictAPI.js uses AJAX, and AJAX is asynchronous function
        //                                                                                          Vitaliy

        //p.s. Please, do not delete my code in future - if you don't need it, or it doesn't work - just put comment tags around
        //This code works, but google chrome doesnt like HTTP-mode of AJAX-request (it likes HTTPS), when you open index.html and run it - click icon of shield
        // in your adress bar, and then "Load unsafe script".

    },

    //check letter clicked:
    checkLetter: function(letter) {
        console.log("letter guessed: " + letter);
        if (hang.currentWord.indexOf(letter) == -1) {
            console.log("no match found");

            //Check if letter has been guessed before - Stephen
            if (!hang.lettersGuessed.includes(letter)) {
                hang.guessesLeft--;

                //Update guessesLeft on screen - Stephen
                $("#numGuesses").text(hang.guessesLeft);

                //Push the guessed letter to lettersGuessed array - Stephen
                hang.lettersGuessed.push(letter);

                if (hang.guessesLeft === 0) {
                    alert("Almost! The correct word is: " + this.currentWord);
                    hang.wordsLeft--;
                    hang.reset();
                }

            }
            else {
                console.log("Letter already guessed.");
            }
        }
        else {
            console.log("match found");
            hang.getIndexes(letter);
        }
    },

    //find indexes if letter is correct
    getIndexes: function(letter) {
        for (var i = 0; i < hang.currentWord.length; i++) {
            if (hang.currentWord[i] === letter) {
                hang.indexes.push(i);
            }
        }
        console.log("indexes for " + letter + ": " + hang.indexes);
        hang.replace(letter);
    },

    //replace the underscore with the letter
    replace: function(letter) {
        for (var i = 0; i < hang.indexes.length; i++) {
            hang.wordDisplay[hang.indexes[i]] = letter;
            console.log("replacing " + i + "th underscore with " + letter + ": " + hang.wordDisplay);
        }
        console.log("current wordDisplay: " + hang.wordDisplay);
        hang.wordDisplayUpdate();
    },

    //update the display
    wordDisplayUpdate: function() {
        var newDisplay = "";

        for (var i = 0; i < hang.currentWord.length; i++) {
            newDisplay = newDisplay + " " + hang.wordDisplay[i];
        }

        console.log("updated display is: " + newDisplay);
        $("#currentWord").text(newDisplay);
        hang.indexes = [];

        if (hang.currentWord === hang.wordDisplay.join("")) {
            alert("Correct! The word is: " + hang.currentWord);
            if (hang.wordsLeft === 0) {
                alert("Game over.");
            }
            hang.reset();
        }
    },

    reset: function() {
        hang.wordListIndex++;
        if (hang.wordListIndex > 9) {
            alert("Congratulations, you've made it through the world's hardest hangman.");

            hang.wordListIndex = 0;
            hang.guessesLeft = 8;
            hang.currentWord = '';
            hang.indexes = [];
            hang.wordDisplay = [];
            hang.lettersGuessed = [];
            hang.wordsLeft = 10;

            // Reset opacity of all letters on keyboard to 1.0 - Stephen
            $("#keyBoard img").css("opacity", "initial");

            var request = makeWordnikRequest();
            request.done(function() {
                console.log(arrayOfWords);
                hang.createWord();
                $("#currentWord").text(hang.emptyWord);
                $("#numGuesses").text(hang.guessesLeft);
                $("#numWords").empty().text(hang.wordsLeft);
            });
            //now we can use arrayOfWords array - it stores 10 random words - but, dont forget about async and request.done function;

        }

        else {
            hang.guessesLeft = 8;
            hang.currentWord = '';
            hang.indexes = [];
            hang.wordDisplay = [];

            // Reset opacity of all letters on keyboard to 1.0 - Stephen
            $("#keyBoard img").css("opacity", "initial");

            // Reset number of guesses on screen - Stephen
            $("#numGuesses").text(hang.guessesLeft);

            // Update number of words left
            $("#numWords").text(hang.wordsLeft);

            // Reset lettersGuessed array - Stephen
            hang.lettersGuessed = [];

            // Create new word
            hang.createWord();
        }
    },
};

$(document).ready(function() {
    console.log("script.js connected");

    var request = makeWordnikRequest();
    request.done(function() {
        console.log(arrayOfWords);
        hang.createWord();
        $("#currentWord").text(hang.emptyWord);
        $("#numGuesses").text(hang.guessesLeft);
        $("#numWords").empty().text(hang.wordsLeft);
    });
    //now we can use arrayOfWords array - it stores 10 random words - but, dont forget about async and request.done function;

    $(".letter").click(function() {
        console.log($(this).data("letter"));

        //Make clicked letter 0.5 opacity.  I didn't put in checkLetter function because of $(this) being tied to the click listenter. - Stephen
        $(this).css("opacity", "0.5");

        hang.checkLetter($(this).data("letter"));

    });

});
