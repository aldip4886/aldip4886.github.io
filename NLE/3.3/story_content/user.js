function ExecuteScript(strId)
{
  switch (strId)
  {
      case "5xspKV6FNIa":
        Script1();
        break;
      case "6pL7xt7Msd6":
        Script2();
        break;
      case "6MdIH3hndbd":
        Script3();
        break;
      case "67oEFe06d8g":
        Script4();
        break;
      case "6poIjU0EdoD":
        Script5();
        break;
      case "6d1JRQXxdLW":
        Script6();
        break;
      case "6pN4IYpudB9":
        Script7();
        break;
      case "6r2jldrxMTG":
        Script8();
        break;
      case "6pxyt5AYBMx":
        Script9();
        break;
      case "6NUrPH3UrVf":
        Script10();
        break;
      case "6ik1qVzCHJ4":
        Script11();
        break;
      case "6pIgbGxgUoS":
        Script12();
        break;
      case "60NTU5atoY6":
        Script13();
        break;
      case "5jCEM9Es3M8":
        Script14();
        break;
      case "5vfJfZUxX8e":
        Script15();
        break;
      case "68hUPHEfR3F":
        Script16();
        break;
      case "6QcYnVkitOM":
        Script17();
        break;
      case "5gBjWJILntF":
        Script18();
        break;
      case "6oQqvYEFLUS":
        Script19();
        break;
      case "64kcAfiQc9s":
        Script20();
        break;
      case "6qvIETl2uDa":
        Script21();
        break;
      case "6rW2N9KtIv1":
        Script22();
        break;
      case "5xl6U8Acw5X":
        Script23();
        break;
      case "6QKnz7U2K17":
        Script24();
        break;
      case "6KgyIrPfadO":
        Script25();
        break;
      case "5m1I7n6B2ht":
        Script26();
        break;
      case "5Vnj2l6L1fB":
        Script27();
        break;
      case "6ChC1TURUzp":
        Script28();
        break;
      case "6OGnlm5z1HJ":
        Script29();
        break;
      case "5WVoVCwH4W5":
        Script30();
        break;
      case "65j8N3vMAaV":
        Script31();
        break;
      case "6SlVvDrMksd":
        Script32();
        break;
      case "6EiQQ0mxTjL":
        Script33();
        break;
      case "5rOABDLGMVi":
        Script34();
        break;
      case "5WskrACZSWx":
        Script35();
        break;
      case "6AW1KvALAPk":
        Script36();
        break;
      case "5yxPQ091nus":
        Script37();
        break;
      case "5aCbR7MeEU7":
        Script38();
        break;
      case "6Jd3MRT5i2a":
        Script39();
        break;
      case "6E9Q5wk11Pi":
        Script40();
        break;
      case "62uuo9xBv8U":
        Script41();
        break;
      case "5iN7DBt9wXs":
        Script42();
        break;
      case "6dPzpA0SoPh":
        Script43();
        break;
      case "65IhB2ouJAm":
        Script44();
        break;
      case "5gJFxFUCjLL":
        Script45();
        break;
      case "6KwqHSPymSj":
        Script46();
        break;
      case "6c9GdIUMrOF":
        Script47();
        break;
      case "6ZRyR9h7mdm":
        Script48();
        break;
      case "5ufxJzdRF7A":
        Script49();
        break;
      case "65TW4VRwCyF":
        Script50();
        break;
      case "694oEF3r3XA":
        Script51();
        break;
      case "62jY6MTHE3R":
        Script52();
        break;
      case "6nAqTQuLyVP":
        Script53();
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
audio.volume = 0.1;
}
}

function Script2()
{
  var player = GetPlayer();
this.Location= player.GetVar("location");

var audio = document.getElementById('bgSong');
audio.src=Location+"song.mp3";
audio.load();
audio.play();
}

function Script3()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script4()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script5()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script6()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script7()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script8()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script9()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script10()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script11()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script12()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script13()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script14()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script15()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script16()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script17()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script18()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script19()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script20()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script21()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script22()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script23()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script24()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script25()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script26()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script27()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script28()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script29()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script30()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script31()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script32()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script33()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script34()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script35()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script36()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script37()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script38()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script39()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script40()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script41()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script42()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script43()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script44()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script45()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script46()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script47()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script48()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script49()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script50()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script51()
{
  var docElm = document.documentElement;
if (docElm.requestFullscreen) {
 docElm.requestFullscreen();
}
else if (docElm.mozRequestFullScreen) {
 docElm.mozRequestFullScreen();
}
else if (docElm.webkitRequestFullScreen) {
 docElm.webkitRequestFullScreen();
}
}

function Script52()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script53()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

