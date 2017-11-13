//here is the array
var arrayOfWords = [];
//here is the request
var request;

function makeWordnikRequest() {
    request = jQuery.ajax({
        url: "//api.wordnik.com/v4/words.json/randomWords?",
        data: {
            hasDictionaryDef: false,
            minCorpusCount: 0,
            maxCorpusCount: -1,
            minDictionaryCount: 1,
            maxDictionaryCount: -1,
            minLength: 5,
            maxLength: -1,
            //this is my api_key from wordnik
            api_key: '5d8e517b43f30d181800e05a0190ff87b7a061f6b55401a2f',
        },
        success: function(data) {
            data.forEach(function(element, index) {
                arrayOfWords.push(element.word);
            });
            console.log("Array of words - completed!")
        }
    });
    return request;
}

function displayWords() {
    for (var i = 0; i < arrayOfWords.length; i++) {
        $("#wordlist").append("<p>" + arrayOfWords[i] + "</p>")
    }
}
console.log("dictAPI connected")
