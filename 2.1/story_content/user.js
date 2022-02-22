function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6Px1XHjiqvA":
        Script1();
        break;
      case "60sMb0ftOS2":
        Script2();
        break;
      case "6cSbJ4eAdJ4":
        Script3();
        break;
      case "6Kkh3HDeKwy":
        Script4();
        break;
      case "6o1pLtu177L":
        Script5();
        break;
      case "6MekRGbxN0F":
        Script6();
        break;
      case "613fOQdpiA6":
        Script7();
        break;
      case "6ZBEv4NVGca":
        Script8();
        break;
      case "6Wxo2ZzCLDC":
        Script9();
        break;
      case "5Vt09GN0lyT":
        Script10();
        break;
      case "603aIkTjhYB":
        Script11();
        break;
      case "6oroXI2ExDT":
        Script12();
        break;
      case "6qRaGYcRCMu":
        Script13();
        break;
      case "5vZ6umsREGU":
        Script14();
        break;
      case "63UuAg1FsTv":
        Script15();
        break;
      case "6ba8DcF7h0Y":
        Script16();
        break;
      case "5w4Q7sKnDGr":
        Script17();
        break;
      case "6UHxgWwbhdV":
        Script18();
        break;
      case "60kS3Kx6Wxj":
        Script19();
        break;
      case "6LYQtYI2twS":
        Script20();
        break;
      case "6IJ5DfdbLiP":
        Script21();
        break;
      case "6B6DYLpkRwq":
        Script22();
        break;
      case "68CEUi92iyV":
        Script23();
        break;
      case "5xf0esrZ3LU":
        Script24();
        break;
      case "5g96dIwSaZR":
        Script25();
        break;
      case "5j2qfjmR5fD":
        Script26();
        break;
      case "5VoJULIoQyq":
        Script27();
        break;
      case "6PCcHpQWRro":
        Script28();
        break;
      case "5uSei18n9uz":
        Script29();
        break;
      case "5UydA72yKYh":
        Script30();
        break;
      case "5tIjR36Wxys":
        Script31();
        break;
      case "6LhpMdfJ21A":
        Script32();
        break;
      case "67mMdlJtoTT":
        Script33();
        break;
      case "6pkGyjEadr1":
        Script34();
        break;
      case "6CYffHNSswd":
        Script35();
        break;
      case "6G7VZJC2udC":
        Script36();
        break;
      case "6ayGvlbwOQS":
        Script37();
        break;
      case "6dcI1M2Trga":
        Script38();
        break;
      case "6Ou5ZO7jrIO":
        Script39();
        break;
      case "69fDAKHHMLF":
        Script40();
        break;
      case "6E3ySaDn3lc":
        Script41();
        break;
      case "6iuDIa46qYt":
        Script42();
        break;
      case "60JODCLJhfz":
        Script43();
        break;
      case "5rJJ0qQhqfU":
        Script44();
        break;
      case "5bGwgZVprY2":
        Script45();
        break;
      case "6Fc4ElTPG0r":
        Script46();
        break;
      case "5VVWRJKQzNI":
        Script47();
        break;
      case "6gM4FsYbVeh":
        Script48();
        break;
      case "5tmmo1JIled":
        Script49();
        break;
      case "5jIANjDHWSk":
        Script50();
        break;
      case "6UGd1nzIC1I":
        Script51();
        break;
      case "5aTNUrgvVSN":
        Script52();
        break;
      case "5VDkimTlQHM":
        Script53();
        break;
      case "5blPEmXMIsG":
        Script54();
        break;
      case "6QBHFfFEyY9":
        Script55();
        break;
      case "5WxDm1JLczJ":
        Script56();
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

function Script54()
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

function Script55()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script56()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

