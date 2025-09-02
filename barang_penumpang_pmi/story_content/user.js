function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6cBYxPF9dEr":
        Script1();
        break;
      case "6SWru4sL5Dw":
        Script2();
        break;
  }
}

window.InitExecuteScripts = function()
{
var player = GetPlayer();
var object = player.object;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
window.Script1 = function()
{
  //load the scripts dynamically into the head of the document
function add_line() {
    var line = document.createElement("audio");
    var head=document.getElementsByTagName('body')[0];
    line.type = "audio/mp3";
    line.src="";
    line.id="bgSong" ;
	line.autoplay = true;
	line.loop = true;
    head.appendChild(line);
}

//but we only want to add these once!
if(document.getElementById('bgSong')==null){
	add_line();
var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}
}

window.Script2 = function()
{
  var player = GetPlayer();
this.Location= player.GetVar("location");

var audio = document.getElementById('bgSong');
audio.src=Location+"Backsound_Corporate Inspirational Uplifting.mp3";
audio.load();
audio.play();
}

};
function getActor() {
  return {
    "objectType": "Agent",
    "account": {
      "homePage": "https://www.example.com",
      "name": "Random" + Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
    }
  };
}
