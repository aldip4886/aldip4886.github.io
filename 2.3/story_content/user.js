function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6axH1JlChkQ":
        Script1();
        break;
      case "688NMsvDL9m":
        Script2();
        break;
      case "5p6yzF2VwFV":
        Script3();
        break;
      case "6VU7VqiYInI":
        Script4();
        break;
      case "695R1RP0tBt":
        Script5();
        break;
      case "60j9sgPNMLa":
        Script6();
        break;
      case "6PW75jHknbl":
        Script7();
        break;
      case "5YONrOh1me1":
        Script8();
        break;
      case "6HXEezlX3Qp":
        Script9();
        break;
      case "6HBrvvqnDBz":
        Script10();
        break;
      case "5WK9p6XwNmt":
        Script11();
        break;
      case "6oulJnVhsyO":
        Script12();
        break;
      case "6ML7daDQ7NJ":
        Script13();
        break;
      case "63UtwDbOZ8m":
        Script14();
        break;
      case "6LrwC3koyhp":
        Script15();
        break;
      case "6mSbPv5F9Sw":
        Script16();
        break;
      case "6lbcJNcnwdg":
        Script17();
        break;
      case "6YbVmR2Xa93":
        Script18();
        break;
      case "5lqmrIdbKBo":
        Script19();
        break;
      case "6N28VDqTDcF":
        Script20();
        break;
      case "64OheDFZyj4":
        Script21();
        break;
      case "6pQmfZIwJPw":
        Script22();
        break;
      case "65Cn7WDOjtV":
        Script23();
        break;
      case "6ErWahJDOv1":
        Script24();
        break;
      case "6ISd13gDsyM":
        Script25();
        break;
      case "6HZUQQF1VGc":
        Script26();
        break;
      case "5yjbCmr4qil":
        Script27();
        break;
      case "6MaFaTkTmH6":
        Script28();
        break;
      case "5rPnBixdMug":
        Script29();
        break;
      case "6EgJemZRWk8":
        Script30();
        break;
      case "5n7Ok57ELnR":
        Script31();
        break;
      case "6QnNR854mFS":
        Script32();
        break;
      case "6aP6HQWIsNZ":
        Script33();
        break;
      case "6prOW0et7iH":
        Script34();
        break;
      case "6P7lfhdIW0n":
        Script35();
        break;
      case "5i3Ud0yBv5r":
        Script36();
        break;
      case "69xeQwajNNm":
        Script37();
        break;
      case "5uaUnCcIfmi":
        Script38();
        break;
      case "6DBgB37HHAb":
        Script39();
        break;
      case "5x9F1pnvFbv":
        Script40();
        break;
      case "6bjDZOLX11u":
        Script41();
        break;
      case "63XYdEyGLYN":
        Script42();
        break;
      case "6km1Uhshyhz":
        Script43();
        break;
      case "6m8myD0niIu":
        Script44();
        break;
      case "6FxsFb06n9b":
        Script45();
        break;
      case "6P0zq4nbeQD":
        Script46();
        break;
      case "6A9l6HDBiSt":
        Script47();
        break;
      case "6JF97m8AuiA":
        Script48();
        break;
      case "6Bj1OtXpogk":
        Script49();
        break;
      case "5gQfKNQyHQm":
        Script50();
        break;
      case "6QqKerN3kuI":
        Script51();
        break;
      case "5wQwx98EDCv":
        Script52();
        break;
      case "5flkTIcQN23":
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

