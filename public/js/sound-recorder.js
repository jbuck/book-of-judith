SC.initialize({
	client_id: "cd7613b1b7b2d481b1cb0858e102cc7d",
	redirect_uri: "http://book-of-judith.herokuapp.com/sccallback.html",
});

initializeRecorder();

var myAudio = document.getElementById('choirplayer'),
	statusDiv = document.getElementById('status'),
	selStart = 0,
	selEnd = -1,
	selduration = -1,
	selTitle = "";

function setSelection(start, end, title) {
	selStart = start;
	selEnd = (end == -1) ? myAudio.duration : end;
	selDuration = end - start;
	selTitle = title;
	$('#selected').html(title);
}

function playSelection(recording) {
	console.log("Start: " + selStart + " end: " + selEnd + " duration: " + selDuration);
	myAudio.currentTime = selStart;
	myAudio.play();
	var playerInterval = setInterval(function() {
    	console.log("current time: " + Math.floor(myAudio.currentTime));
		if (Math.ceil(myAudio.currentTime) == selEnd) {
			if (recording) {
				$('#controlButton').click();
			}
			myAudio.pause();
    		window.clearInterval(playerInterval);
		}
    }, 1000);
}

function playForRecording(msDelay) {
	setTimeout(function() {
		playSelection(true);
	}, msDelay);
}

function initializeRecorder() {
	$("#recorderUI.reset #controlButton").live("click", function(e) {
		updateTimer(0);
		SC.record({
			start: function() {
				setRecorderUIState("recording");
				playForRecording(900);
			},
			progress: function(ms, avgPeak) {
				updateTimer(ms);
			}
		});
		e.preventDefault();
	});

	$("#recorderUI.recording #controlButton, #recorderUI.playing #controlButton").live("click", function(e) {
		setRecorderUIState("recorded");
		SC.recordStop();
		e.preventDefault();
	});

	$("#recorderUI.recorded #controlButton").live("click", function(e) {
		updateTimer(0);
		setRecorderUIState("playing");
		SC.recordPlay({
			progress: function(ms){
				updateTimer(ms);
			},
			finished: function(){
				setRecorderUIState("recorded");
			}
		});
		e.preventDefault();
	});

	$("#reset").live("click", function(e) {
		SC.recordStop();
		setRecorderUIState("reset");
		e.preventDefault();
	});

	$("#upload").live("click", function(e) {
		setRecorderUIState("uploading");
		var ds = new Date().getTime();

		SC.connect({
			connected: function() {
				$("#uploadStatus").html("Uploading...");
				SC.recordUpload({
					track: {
						title: ds + "_boj_" + selTitle,
						sharing: "private"
					}
				},
				function(track) {
					$("#uploadStatus").html("Uploaded: <a href='" + track.permalink_url + "'>" + track.permalink_url + "</a>");

					console.log('uploaded...record to db now');
					var recordingData = {};
					recordingData["start"] = selStart;
					recordingData["duration"] = selDuration;
					recordingData["url"] = track.permalink_url;
					console.log(JSON.stringify(recordingData, null, 2));
					localStorage.setItem('bojAudio', JSON.stringify(recordingData));
				});
			}
		});

		e.preventDefault();
	});

	function updateTimer(ms) {
		$("#timer").text(SC.Helper.millisecondsToHMS(ms));
	}

	function setRecorderUIState(state) {
		// state can be reset, recording, recorded, playing, uploading
		// visibility of buttons is managed via CSS
		$("#recorderUI").attr("class", state);
	}
}

function pad (str, max) {
	return str.length < max ? pad("0" + str, max) : str;
}