function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6YllEynX2w3":
        Script1();
        break;
      case "5dZ58qA7uuY":
        Script2();
        break;
      case "6aFYkUGDdu4":
        Script3();
        break;
      case "5ejC2PNOjWs":
        Script4();
        break;
      case "6Vn959A8G95":
        Script5();
        break;
      case "6cUKsdzfp85":
        Script6();
        break;
      case "5a2lmqSarvw":
        Script7();
        break;
      case "5WNX8DZWE6e":
        Script8();
        break;
      case "6m8E2jPGfjQ":
        Script9();
        break;
      case "6gQOchm6U8n":
        Script10();
        break;
      case "6BuNFo4t3Vp":
        Script11();
        break;
      case "69RRicJKjOk":
        Script12();
        break;
      case "6VGE36u4Gi8":
        Script13();
        break;
      case "64AwzpSzDR9":
        Script14();
        break;
      case "5wsY0244XAZ":
        Script15();
        break;
      case "5bMn8tn62xJ":
        Script16();
        break;
      case "5UwKAXGXTT5":
        Script17();
        break;
      case "69nLlDRmXyk":
        Script18();
        break;
      case "5dzpkyHtzPC":
        Script19();
        break;
      case "6MgYmamBo68":
        Script20();
        break;
      case "614XtrrJhL8":
        Script21();
        break;
      case "6e5HeqOZ9WE":
        Script22();
        break;
      case "6A8RmwBly2t":
        Script23();
        break;
      case "6aGxBZCk9AG":
        Script24();
        break;
      case "6DhbBVHAa0h":
        Script25();
        break;
      case "6HFv2VE5zVU":
        Script26();
        break;
      case "5pUDEUEs9MZ":
        Script27();
        break;
      case "6h44nduMbb7":
        Script28();
        break;
      case "5n1YZYtEO9P":
        Script29();
        break;
      case "6CH1obBWsWx":
        Script30();
        break;
      case "5mnTvVX1X7k":
        Script31();
        break;
      case "5b8QptH1xe2":
        Script32();
        break;
      case "5tSEgno2Kuz":
        Script33();
        break;
      case "5c2gH4WxfBz":
        Script34();
        break;
      case "5lhQ6ZpWVGR":
        Script35();
        break;
      case "6pNbhSB01NN":
        Script36();
        break;
      case "5rKeHShbemv":
        Script37();
        break;
      case "5u1b0zVfV8r":
        Script38();
        break;
      case "6Qf61q3AFJi":
        Script39();
        break;
      case "5kXm8RcrpY0":
        Script40();
        break;
      case "6WSRCtQ6eoj":
        Script41();
        break;
      case "5qjBLvhrudh":
        Script42();
        break;
      case "6MMaleXtNfa":
        Script43();
        break;
      case "5b6CNuEkQ2A":
        Script44();
        break;
      case "6C3CfX6cjbh":
        Script45();
        break;
      case "6DSXGkvRaJ2":
        Script46();
        break;
      case "6pt1a0VNwN4":
        Script47();
        break;
      case "5wzsrJPiZyY":
        Script48();
        break;
      case "5jMxhLdbLhN":
        Script49();
        break;
      case "5zxfZ69I8gl":
        Script50();
        break;
      case "6rPcc9B1UO6":
        Script51();
        break;
      case "6Ix85yMIIVM":
        Script52();
        break;
      case "5r5B3V9fHwV":
        Script53();
        break;
      case "6HEOG8b7Vbq":
        Script54();
        break;
      case "5lLcQTMbLk2":
        Script55();
        break;
      case "5gbWuTaWvjp":
        Script56();
        break;
      case "5jA2qkfSZUl":
        Script57();
        break;
      case "5rjo6WGvMGH":
        Script58();
        break;
      case "5bNe5HQkBqf":
        Script59();
        break;
      case "6fJwsAAzOu3":
        Script60();
        break;
      case "6B403QPGh21":
        Script61();
        break;
      case "6hdOovtRvON":
        Script62();
        break;
      case "5qf5Wlo6CPC":
        Script63();
        break;
      case "6jrLfFm0DJ5":
        Script64();
        break;
      case "5mRdCatJlhJ":
        Script65();
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

function Script57()
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

function Script58()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script59()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script60()
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

function Script61()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script62()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

function Script63()
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

function Script64()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.1;
}

function Script65()
{
  var audio = document.getElementById('bgSong');
audio.volume = 0.0;
}

