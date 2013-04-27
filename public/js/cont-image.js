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
	alert('adding image: ' + $('#imgselected').attr('src'));
}

function backToStart() {
	clearJudithsArtSelection();
	$('#btncontribute').attr('disabled', 'disabled');
	$('#imgselected').attr('src', '');
	$('#contributeblock, .contribute').hide();
	$('#selecttype').show();
	// clear the canvas
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = 0;
	canvas.height = 0;
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
var canvas = document.getElementById('imageCanvas');
var ctx = canvas.getContext('2d');

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        var img = new Image();
        img.onload = function(){
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img,0,0);
        }
        img.src = event.target.result;
		$('#btncontribute').removeAttr('disabled');
		var imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
    }
    reader.readAsDataURL(e.target.files[0]);
}
