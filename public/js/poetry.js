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
            console.log("Saving Image..." + that.stage);
            that.stage.toDataURL({
                callback: function(dataUrl) {
                    // window.open(dataUrl);
                    console.log(dataUrl);
                    that.fileHandler(dataUrl);
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

        xhr.addEventListener( "progress", function( event ) {
          if ( event.lengthComputable ) {
            console.log( "%d%% complete", oEvent.loaded / oEvent.total * 100 );
          }
        });
        xhr.addEventListener( "load", function() {
          if (this.status != 200) {
            return;
          }

          var url = JSON.parse( this.responseText ).url;
            
          console.log(url);
          console.log( "Done uploading %s", fd.name );
        });
        xhr.open( "POST", "/upload", false );
        xhr.send( fd );
    }
}

$(document).ready(function() {
    Poetry.init();
});