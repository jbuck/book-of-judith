$(function() {
	$('#txtImageUrl').blur(function() {
		updateImagePreview();
	});

	$('#imgselected').bind({
	    load: function() {
	        $('#btncontribute').removeAttr('disabled');
	    },
	    error: function() {
	        $('#btncontribute').attr('disabled', 'disabled');
	    }
	});

	$('#judithsArt img').click(function() {
		clearJudithsArtSelection();
		$('#imgselected').attr('src', $(this).attr('src'));
		$(this).css('outline', '2px solid #0BE232')
		$('#btncontribute').removeAttr('disabled');
	});
});

function clearJudithsArtSelection() {
	$('#judithsArt img').each(function(){
		$(this).css('outline', '');
	});
}

function updateImagePreview() {
	var selectedImage = $('#txtImageUrl').val();
	$('#imgselected').attr('src', selectedImage);
	if (selectedImage == "") {
		$('#btncontribute').attr('disabled', 'disabled');
	}
}

function contributeImage() {
  var images = JSON.parse(localStorage.getItem('images')) || [];
  images.push($('#imgselected').attr('src'));
	localStorage.setItem('images', JSON.stringify(images))
}

function backToStart() {
	clearJudithsArtSelection();
	$('#btncontribute').attr('disabled', 'disabled');
	$('#imgselected').attr('src', '');
	$('#imguploaded').attr('src', '');
	$('#contributeblock, .contribute').hide();
	$('#selecttype').show();
	// clear the input fields
	$('#txtImageUrl, #imageLoader').val('');
}

function selectJudithsArt() {
	$('#selecttype').hide();
	$('#contributeblock, #judithsArt').show();
}

function selectWebArt() {
	$('#selecttype').hide();
	$('#contributeblock, #webArt').show();
}

function selectOwnArt() {
	$('#selecttype').hide();
	$('#contributeblock, #ownArt').show();
}

var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);

function handleImage(event) {
  var files = [];

  for ( var i = 0; i < event.target.files.length; i++ ) {
    files.push( event.target.files[ i ]);
  }

  files.forEach(function(f) {
    var xhr = new XMLHttpRequest();
    var fd = new FormData();

    fd.append( "image", f );

    xhr.addEventListener( "load", function() {
      if (this.status != 200) {
        return;
      }

      var url = JSON.parse( this.responseText ).url;

      $('#imguploaded').attr('src', url);
      $('#imgselected').attr('src', url);
    });
    xhr.open( "POST", "/upload", false );
    xhr.send( fd );
  });
}
