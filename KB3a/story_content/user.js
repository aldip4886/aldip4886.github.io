function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6CPemKnPxns":
        Script1();
        break;
  }
}

function Script1()
{
  var player = GetPlayer();
this.Location= player.GetVar("location");

var audio = document.getElementById('bgSong');
audio.src=Location+"bensound-smile_edited.mp3";
audio.load();
audio.play();
}

