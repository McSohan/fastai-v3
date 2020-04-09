var el = x => document.getElementById(x);

var audio;
var compString;

function setAudio(url) {
  audio = new Audio(url);  
  audio.type = 'audio/wav';
}

function showPicker() {
  el("file-input").click();
}


function showPicked(input) {
  el("upload-label").innerHTML = input.files[0].name;
  var reader = new FileReader();
  reader.onload = function(e) {
    el("image-picked").src = e.target.result;
    el("image-picked").className = "";
  };
  reader.readAsDataURL(input.files[0]);
}

function analyze() {
  var uploadFiles = el("file-input").files;
  if (uploadFiles.length !== 1) alert("Please select a valid INR or USD to analyze!");

  el("analyze-button").innerHTML = "Analyzing. Please don't disconnect from the server";
  var xhr = new XMLHttpRequest();
  var loc = window.location;
  xhr.open("POST", `${loc.protocol}//${loc.hostname}:${loc.port}/analyze`,
    true);
  xhr.onerror = function() {
    alert(xhr.responseText);
  };
  xhr.onload = function(e) {
    if (this.readyState === 4) {
      var response = JSON.parse(e.target.responseText);
      el("result-label").innerHTML = `Predicted note denomination outcome =${response["result"]}`;
      compString = `${response["result"]}`;
      if (compString == `100;inr`)
        setAudio('https://raw.githubusercontent.com/McSohan/fastai-v3/webcam_attempt/100rs.wav');
      else if (compString == `50;inr`)
        setAudio('https://raw.githubusercontent.com/McSohan/fastai-v3/webcam_attempt/50rs.wav');
      else if(compString == `200;inr`)
        setAudio('https://raw.githubusercontent.com/McSohan/fastai-v3/webcam_attempt/200rs.wav');
      else if(compString == `500;inr`)
        setAudio('https://raw.githubusercontent.com/McSohan/fastai-v3/webcam_attempt/500rs.wav');
      else
        setAudio('https://raw.githubusercontent.com/McSohan/fastai-v3/webcam_attempt/notindian.wav');
    }
    el("analyze-button").innerHTML = "Analyze";
    audio.play();
  };

  var fileData = new FormData();
  fileData.append("file", uploadFiles[0]);
  xhr.send(fileData);
}



