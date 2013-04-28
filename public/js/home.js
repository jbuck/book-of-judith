var Home = {
    contributions = {
        "voice": false,
        "images": false,
        "words": false
    },
    $voiceButton: null,
    $imagesButton: null,
    $wordsButton: null,
    
    init: function () {
        this.buildObjects();
        this.buildHandlers();
    },
    
    buildObjects: function () {
        $voiceButton = $("#voiceButton");
        $imagesButton = $("#imagesButton");
        $wordsButton = $("#wordsButton");
    },
    
    buildHandlers: function () {
        $voiceButton.click(function (e) {
            e.preventDefault();
        });
        
        $imagesButton.click(function (e) {
            e.preventDefault();
        });
        
        $wordsButton.click(function (e) {
            e.preventDefault();
        });
    },
    
    saveContributions: function () {
        localStorage["contributions"] = contributions;
    }
};

$(document).ready(function() {
    Home.init();
});