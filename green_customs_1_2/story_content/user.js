window.InitUserScripts = function()
{
var player = GetPlayer();
var object = player.object;
var once = player.once;
var addToTimeline = player.addToTimeline;
var setVar = player.SetVar;
var getVar = player.GetVar;
var update = player.update;
var pointerX = player.pointerX;
var pointerY = player.pointerY;
var showPointer = player.showPointer;
var hidePointer = player.hidePointer;
var slideWidth = player.slideWidth;
var slideHeight = player.slideHeight;
window.Script1 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script2 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script3 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script4 = function()
{
  let player = GetPlayer();

var date1 = new Date(player.GetVar("License_CreationDate"));
var date2 = new Date();
var date3 = new Date(player.GetVar("License_ExpirationDate"));
var elapsedTime = date2.getTime() - date1.getTime();
var elapsedDays = elapsedTime/(1000 * 3600 * 24);
var totalTime = date3.getTime() - date1.getTime();
var totalDays = totalTime/(1000 * 3600 * 24);


player.SetVar("License_DaysUsed", elapsedDays);
player.SetVar("License_ValidDays", totalDays);
}

window.Script5 = function()
{
  (function() {
    var activeVideo = null;

    // cari semua video di slide
    var videos = document.querySelectorAll("video");

    // deteksi video yang aktif
    videos.forEach(function(vid) {
        vid.addEventListener("play", function() {
            activeVideo = vid;
        });

        vid.addEventListener("click", function() {
            activeVideo = vid;
        });
    });

    // kontrol dengan tombol spasi
    window.addEventListener("keydown", function(event) {
        // jika yang aktif adalah input atau textarea, biarkan spasi berfungsi normal
        var tag = document.activeElement.tagName.toLowerCase();
        var isTyping = (tag === "input" || tag === "textarea");

        // hanya jalankan kontrol video jika user TIDAK sedang mengetik
        if (!isTyping && event.code === "Space") {
            event.preventDefault(); // hentikan fungsi default Storyline

            if (activeVideo) {
                if (activeVideo.paused) {
                    activeVideo.play();
                } else {
                    activeVideo.pause();
                }
            }
        }
    }, true);
})();
}

window.Script6 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script7 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script8 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script9 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script10 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script11 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script12 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script13 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script14 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script15 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script16 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script17 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script18 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script19 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script20 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script21 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script22 = function()
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

window.Script23 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script24 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script25 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script26 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script27 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script28 = function()
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

window.Script29 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script30 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script31 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script32 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script33 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script34 = function()
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

window.Script35 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script36 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script37 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script38 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script39 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script40 = function()
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

window.Script41 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script42 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script43 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script44 = function()
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

window.Script45 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script46 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script47 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script48 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script49 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script50 = function()
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

window.Script51 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script52 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script53 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script54 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script55 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script56 = function()
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

window.Script57 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script58 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script59 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script60 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script61 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script62 = function()
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

window.Script63 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script64 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script65 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script66 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script67 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script68 = function()
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

window.Script69 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script70 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script71 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script72 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script73 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script74 = function()
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

window.Script75 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script76 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script77 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script78 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script79 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script80 = function()
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

window.Script81 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script82 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script83 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script84 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script85 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script86 = function()
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

window.Script87 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script88 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script89 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script90 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script91 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script92 = function()
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

window.Script93 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script94 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script95 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script96 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script97 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script98 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script99 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script100 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script101 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script102 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script103 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script104 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script105 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script106 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script107 = function()
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

window.Script108 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script109 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script110 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script111 = function()
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

window.Script112 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script113 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script114 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script115 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script116 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script117 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script118 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script119 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script120 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script121 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script122 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script123 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script124 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script125 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script126 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script127 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script128 = function()
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

window.Script129 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script130 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script131 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script132 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script133 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script134 = function()
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

window.Script135 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script136 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script137 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script138 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script139 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script140 = function()
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

window.Script141 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script142 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script143 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script144 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script145 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script146 = function()
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

window.Script147 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script148 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script149 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script150 = function()
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

window.Script151 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script152 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script153 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script154 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script155 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script156 = function()
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

window.Script157 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script158 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script159 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script160 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script161 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script162 = function()
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

window.Script163 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script164 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script165 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script166 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script167 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script168 = function()
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

window.Script169 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script170 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script171 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script172 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script173 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script174 = function()
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

window.Script175 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script176 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script177 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script178 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script179 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script180 = function()
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

window.Script181 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script182 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script183 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script184 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script185 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script186 = function()
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

window.Script187 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script188 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script189 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script190 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script191 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script192 = function()
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

window.Script193 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script194 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script195 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script196 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script197 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script198 = function()
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

window.Script199 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script200 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script201 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script202 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script203 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script204 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script205 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script206 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script207 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script208 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script209 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script210 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script211 = function()
{
  document.getElementsByTagName("video")[0].style.float = 'right';
}

window.Script212 = function()
{
  document.getElementsByTagName("video")[0].setAttribute("controls", "true");
}

window.Script213 = function()
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

window.Script214 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script215 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script216 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script217 = function()
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

window.Script218 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script219 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script220 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script221 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script222 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script223 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script224 = function()
{
  let player = GetPlayer();
let message = player.GetVar('clabsAnswersUserMessage');
clabsChatbotProcessUserMessage({text: message});
}

window.Script225 = function()
{
  document.activeElement.blur();
}

window.Script226 = function()
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

window.Script227 = function()
{
  if(void 0===window.stencilsetanswers){let e="https://cluelabs.com/ai/display/chatbotops.js.php";(xhttp=new XMLHttpRequest).onreadystatechange=function(){if(4==this.readyState&&200==this.status&&""!=this.responseText){let e=this.responseText,t=document.getElementsByTagName("head")[0],i=document.createElement("script");t.appendChild(i),i.appendChild(document.createTextNode(e)),clabsChatbotRecorder.mode="storyline";let s=`
    <style>.clabs_waiting_container{width:100%;height:100%;background-color:rgba(0,0,0,.5);z-index:1000;position:absolute;top:0;left:0;display:none;align-items:center;justify-content:center}.clabs_waiting_loader{width:60px;height:60px;border:10px solid #587885;border-top-color:#708c98;animation:1s linear infinite spin013151;border-radius:100%}@keyframes spin013151{to{transform:rotate(360deg)}}</style>
    <div id="clabs_waiting_container" class="clabs_waiting_container"><div class="clabs_waiting_loader"></div></div>
      `;document.body.insertAdjacentHTML("beforeend",s),window.stencilsetanswers=!0;GetPlayer().SetVar("clabsAnswersWidgetLoaded",1)}},xhttp.open("GET",e,!0),xhttp.send()}

}

window.Script228 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'flex';
}

window.Script229 = function()
{
  document.getElementsByClassName('clabs_waiting_container')[0].style.display = 'none';
}

window.Script230 = function()
{
  let player = GetPlayer();
var duration = player.GetVar("License_ValidDays");
var date1 = new Date(player.GetVar("License_CreationDate"));
var date2 = new Date();
var date3 = new Date(player.GetVar("License_ExpirationDate"));
var elapsedTime = date2.getTime() - date1.getTime();
var elapsedDays = elapsedTime/(1000 * 3600 * 24);
var totalTime = date3.getTime() - date1.getTime();
var totalDays = totalTime/(1000 * 3600 * 24);


player.SetVar("License_DaysUsed", elapsedDays);
player.SetVar("License_ValidDays", totalDays);
}

};
