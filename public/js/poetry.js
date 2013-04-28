var Poetry = {
    stage: null,
    layer: null,
    words: {},
    $saveButton: null,
    imgPath: '/img/poetry/',
    
    // Initialize
    init: function () {
        var that = this;
        
        this.buildObjects();
        this.buildHandlers();
        this.buildMagnets();
        
        $(window).load(function() {
            that.buildFridge();
        });
    },
    
    // Build Objects
    buildObjects: function () {
        $saveButton = $("#saveButton");
    },
    
    // Build Handlers
    buildHandlers: function () {
        var that = this;
        
        $saveButton.click(function (e) {
            e.preventDefault();
            console.log("Saving Image...");
            that.stage.toDataURL({
                callback: function(dataUrl) {
                    // window.open(dataUrl);
                    console.log(dataUrl);
                }
            });
        });

    },

    // Create Word/Phrase Objects
    buildMagnets: function () {
        this.words.the = this.buildMagnet("the");
        this.words.book = this.buildMagnet("book");
        this.words.of = this.buildMagnet("of");
        this.words.judith = this.buildMagnet("judith");
        
        for (var key in this.words) {
           if (this.words.hasOwnProperty(key)) {
              this.words[key].on('mouseover', function() {
                document.body.style.cursor = 'pointer';
              });
              this.words[key].on('mouseout', function() {
                  document.body.style.cursor = 'default';
              });
           }
        }
    },
    
    buildMagnet: function (word) {
        var wordObj = null,
            newWord = null;
        
        newWord = new Image();
        newWord.src = this.imgPath + word + '.png';
        
        wordObj = new Kinetic.Image({
            image: newWord,
            x: Math.random() * 800 + 100,
            y: Math.random() * 300 + 50,
            width: newWord.width,
            height: newWord.height,
            draggable: true
        });

        return wordObj;
    },
    
    // Prepare the Canvas
    buildFridge: function () {
        var that = this;
        
        this.stage = new Kinetic.Stage({
            container: "container",
            width: 1000,
            height: 500
        });
        this.layer = new Kinetic.Layer();

        for (var key in this.words) {
           if (this.words.hasOwnProperty(key)) {
              this.layer.add(this.words[key]);
           }
        }

        this.stage.add(this.layer);
    }
}

$(document).ready(function() {
    Poetry.init();
});