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
            that.stage.toDataURL({
                callback: function(dataUrl) {
                    that.fileHandler(dataUrl);
                }
            });
        });

    },

    // Create Word/Phrase Objects
    buildMagnets: function () {
        this.words.quote01 = this.buildMagnet("quote01");
        this.words.quote02 = this.buildMagnet("quote02");
        this.words.quote03 = this.buildMagnet("quote03");
        this.words.quote04 = this.buildMagnet("quote04");
        this.words.quote05 = this.buildMagnet("quote05");
        this.words.quote06 = this.buildMagnet("quote06");
        this.words.quote07 = this.buildMagnet("quote07");
        this.words.quote08 = this.buildMagnet("quote08");
        this.words.quote09 = this.buildMagnet("quote09");
        this.words.quote10 = this.buildMagnet("quote10");
        
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
            x: Math.random() * 480,
            y: Math.random() * 450,
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
            width: 960,
            height: 500
        });
        this.layer = new Kinetic.Layer();

        for (var key in this.words) {
           if (this.words.hasOwnProperty(key)) {
              this.layer.add(this.words[key]);
           }
        }

        this.stage.add(this.layer);
    },
    
    dataURLtoBlob: function (dataURL) {
      // Decode the dataURL    
      var binary = atob(dataURL.split(',')[1]);
      // Create 8-bit unsigned array
      var array = [];
      for(var i = 0; i < binary.length; i++) {
          array.push(binary.charCodeAt(i));
      }
      // Return our Blob object
      return new Blob([new Uint8Array(array)], {type: 'image/png'});
    },

    fileHandler: function(imageData) {
        var xhr = new XMLHttpRequest();
        var fd = new FormData();

        fd.append( "image", this.dataURLtoBlob(imageData), 'poetry.png' );

        xhr.addEventListener( "load", function() {
          if (this.status != 200) {
            return;
          }

          var url = JSON.parse( this.responseText ).url;

          var tags = JSON.parse( localStorage.getItem( "tags" ) ) || [];
          tags.push( url );
          localStorage.setItem( "tags", JSON.stringify( tags ) );
          window.location = "main-menu.html";
        });
        xhr.open( "POST", "/upload", false );
        xhr.send( fd );
    }
}

$(document).ready(function() {
    Poetry.init();
});
