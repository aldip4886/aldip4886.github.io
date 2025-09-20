function ExecuteScript(strId)
{
  switch (strId)
  {
      case "6CyRmHt2X1h":
        Script1();
        break;
  }
}

window.InitExecuteScripts = function()
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
