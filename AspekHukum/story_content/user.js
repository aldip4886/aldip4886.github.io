function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6DF1K5PD5in":
        Script1();
        break;
      case "5xqkvXWuKPA":
        Script2();
        break;
      case "5cAUZStdWvR":
        Script3();
        break;
      case "6EH2NMfPgyA":
        Script4();
        break;
  }
}

function Script1()
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
audio.volume = 0.4;
}

}

function Script2()
{
  var player = GetPlayer();
this.Location= player.GetVar("location");

var audio = document.getElementById('bgSong');
audio.src=Location+"[No Copyright Music] Uplifting & Inspiring Corporate Background - Ramol (Original).mp3";
audio.load();
audio.play();
}

function Script3()
{
  var player=GetPlayer();
var theScore=player.GetVar("nilai");
top.postMessage(theScore,"*");

}

function Script4()
{
  var player=GetPlayer();
var theScore=player.GetVar("nilai");
top.postMessage(theScore,"*");

}

