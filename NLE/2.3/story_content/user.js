function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6c3sObynC6k":
        Script1();
        break;
      case "5ZIHKHRTUhm":
        Script2();
        break;
      case "5nF09fOpu81":
        Script3();
        break;
      case "6170v7fCX6l":
        Script4();
        break;
      case "6VJLz1ZnT8e":
        Script5();
        break;
      case "6J8OLPhe8o6":
        Script6();
        break;
      case "6C3HKqu3BZZ":
        Script7();
        break;
      case "6ThcxlDMUQl":
        Script8();
        break;
      case "5WlJTEJDiiK":
        Script9();
        break;
      case "6bDP0uewOCh":
        Script10();
        break;
      case "6meu2syU1b8":
        Script11();
        break;
      case "6igmDlXk65H":
        Script12();
        break;
      case "5x2CPwzIhbW":
        Script13();
        break;
      case "6lhB0MVQq5J":
        Script14();
        break;
      case "5oS22TZUDQR":
        Script15();
        break;
      case "5wM2YqVoqL4":
        Script16();
        break;
      case "6FzOjjzPEW6":
        Script17();
        break;
      case "6ZL4wLdp2hu":
        Script18();
        break;
      case "5wGoPR1d1TG":
        Script19();
        break;
      case "5ynv6ODd9g6":
        Script20();
        break;
      case "5WFQFgIzQog":
        Script21();
        break;
      case "5oXqLH7U3Wv":
        Script22();
        break;
      case "5YjqEyeTLXE":
        Script23();
        break;
      case "5WPYVjnTxfV":
        Script24();
        break;
      case "6PmQVi5zz0J":
        Script25();
        break;
      case "6VdsKqi93qZ":
        Script26();
        break;
      case "6XXi0YcRFbi":
        Script27();
        break;
      case "5wbl07BfsXa":
        Script28();
        break;
      case "63dGvS3WVcp":
        Script29();
        break;
      case "6BgqBfa3Irg":
        Script30();
        break;
      case "5Y8GtxjQMUo":
        Script31();
        break;
      case "6diaKv1unxk":
        Script32();
        break;
      case "60obCOxS5RJ":
        Script33();
        break;
      case "6KE3GGreEKn":
        Script34();
        break;
      case "6LMS0uf0OfP":
        Script35();
        break;
      case "6ghd0lSMGqS":
        Script36();
        break;
      case "6Ox8bC7txqL":
        Script37();
        break;
      case "68IQo6Tl6kZ":
        Script38();
        break;
      case "5vwVWK0kU6G":
        Script39();
        break;
      case "6EGd6fvEQQA":
        Script40();
        break;
      case "5vMKAtw8R8w":
        Script41();
        break;
      case "6hStukB5aWH":
        Script42();
        break;
      case "6Jo1ZoBTQzd":
        Script43();
        break;
      case "5tzFUmTGepj":
        Script44();
        break;
      case "6SJFKSVCZPh":
        Script45();
        break;
      case "63ZAcRdWV2O":
        Script46();
        break;
      case "5dvbELZVeg8":
        Script47();
        break;
      case "5soL8J3R4Z7":
        Script48();
        break;
      case "5k9Yw9xOnSL":
        Script49();
        break;
      case "60LRQAriVts":
        Script50();
        break;
      case "5ytzFP3zFEl":
        Script51();
        break;
      case "5ugR8vJSJqm":
        Script52();
        break;
      case "6nVAoZxHwHU":
        Script53();
        break;
      case "5sUfZ4Xk7L5":
        Script54();
        break;
      case "6qhXjQ8wXYa":
        Script55();
        break;
      case "5hJDK8LcmTx":
        Script56();
        break;
      case "6FlbJJ24ahd":
        Script57();
        break;
      case "5qku3XIiD0a":
        Script58();
        break;
      case "62uesGRzuAr":
        Script59();
        break;
      case "5VSN5K2g4Fx":
        Script60();
        break;
      case "6hvlqWz6yXl":
        Script61();
        break;
      case "5YnnsQevWXV":
        Script62();
        break;
      case "64loH8cB5pw":
        Script63();
        break;
      case "5vWTudJ7WJb":
        Script64();
        break;
      case "5xDd8rvvsQy":
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

