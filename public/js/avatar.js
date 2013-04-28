navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

var Avatar = {
    $captureButton: null,
    $saveButton: null,
    webcamFeed: null,
    avatarPreview: null,
    ctx: null,
    
    // Initialization
    init: function () {
        console.log("init.");
        var that = this;
        
        this.buildObjects();
        this.buildHandlers();

        navigator.getUserMedia({video: true}, function(stream) {
            this.webcamFeed.src = window.webkitURL.createObjectURL(stream);
        });
    },

    // Build Objects
    buildObjects: function () {
        this.$captureButton = $("#captureButton");
        this.$saveButton = $("#saveButton");
        this.webcamFeed = document.querySelector('video');
        this.avatarPreview = document.querySelector('canvas');
        this.ctx = this.avatarPreview.getContext('2d');
    },
    
    // Build Handlers
    buildHandlers: function () {
        var that = this;

        this.$captureButton.click(function (e) {
            e.preventDefault();
            console.log("Taking Photo...");
            that.capture();
        });

        this.$saveButton.click(function (e) {
            e.preventDefault();
            console.log("Saving Avatar...");
            that.fileHandler(that.avatarPreview.toDataURL("image/png"));
        });

    },

    capture: function () {
        var that = this;
        
        this.avatarPreview.width = this.webcamFeed.clientWidth;
        this.avatarPreview.height = this.webcamFeed.clientHeight;
        
        this.ctx.drawImage(that.webcamFeed, 0, 0);
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

        fd.append( "image", this.dataURLtoBlob(imageData), 'avatar.png' );

        xhr.addEventListener( "load", function() {
          if (this.status != 200) {
            return;
          }

          var url = JSON.parse( this.responseText ).url;

          var tags = JSON.parse( localStorage.getItem( "tags" ) ) || [];
          tags.push( url );
          localStorage.setItem( "tags", JSON.stringify( tags ) );
        });
        xhr.open( "POST", "/upload", false );
        xhr.send( fd );
    }
};

$(document).ready(function() {
    Avatar.init();
});