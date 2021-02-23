function ExecuteScript(strId)
{
  switch (strId)
  {
      case "5j0CDVzdHWk":
        Script1();
        break;
      case "6D1NwfspfxB":
        Script2();
        break;
      case "5dnwRzDUpgk":
        Script3();
        break;
      case "6SHb0EINPyy":
        Script4();
        break;
      case "6rIx8MLYLXw":
        Script5();
        break;
      case "6f3gMSty5pi":
        Script6();
        break;
      case "5pEn6AIZ5Ix":
        Script7();
        break;
      case "6Wz5QAVdBDA":
        Script8();
        break;
      case "5mYt2zwQCq2":
        Script9();
        break;
      case "5vsowKPUnYg":
        Script10();
        break;
      case "696q0F110Pm":
        Script11();
        break;
      case "6FRCYO9z1q8":
        Script12();
        break;
      case "6CrygVDpzjT":
        Script13();
        break;
      case "64z88rEV0dg":
        Script14();
        break;
      case "6bxDcmn9cZQ":
        Script15();
        break;
      case "5s4WJiuddRk":
        Script16();
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
audio.volume = 0.2;
}



}

function Script2()
{
  var player = GetPlayer();
this.Location= player.GetVar("location");

var audio = document.getElementById('bgSong');
audio.src=Location+"bensound-smile_edited.mp3";
audio.load();
audio.play();
}

function Script3()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0;
}

function Script4()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.2;
}

function Script5()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.2;
}

function Script6()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.18;
}

function Script7()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.16;
}

function Script8()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.14;
}

function Script9()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.12;
}

function Script10()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script11()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.08;
}

function Script12()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.06;
}

function Script13()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.04;
}

function Script14()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.02;
}

function Script15()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0;
}

function Script16()
{
  if ((document.fullScreenElement && document.fullScreenElement !== null) || 
 (!document.mozFullScreen && !document.webkitIsFullScreen)) {
 if (document.documentElement.requestFullScreen) { 
 document.documentElement.requestFullScreen(); 
 } else if (document.documentElement.mozRequestFullScreen) { 
 document.documentElement.mozRequestFullScreen(); 
 } else if (document.documentElement.webkitRequestFullScreen) { 
 document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT); 
 } 
 } else { 
 if (document.cancelFullScreen) { 
 document.cancelFullScreen(); 
 } else if (document.mozCancelFullScreen) { 
 document.mozCancelFullScreen(); 
 } else if (document.webkitCancelFullScreen) { 
 document.webkitCancelFullScreen(); 
 } 
 }
}

