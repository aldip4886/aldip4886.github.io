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
  
// Access Storyline player
var player = GetPlayer();

// Pull variables from Storyline
var totalpoints = player.GetVar("user_total_points");
var maxpoints = player.GetVar("max_points");

// Ensure numeric and avoid divide by zero
totalpoints = Number(totalpoints) || 0;
maxpoints = Number(maxpoints) || 1;

// Calculate scaled score as percentage
var scaledscore = (totalpoints / maxpoints);
var percentage = scaledscore * 100;
// var scaledscore = totalpoints;

// Push back to Storyline variable
player.SetVar("user_scaled_score", scaledscore);
player.SetVar("user_percentage_score", percentage);

}

window.Script2 = function()
{
  
// Access Storyline player
var player = GetPlayer();

// Pull variables from Storyline
var totalpoints = player.GetVar("user_total_points");
var maxpoints = player.GetVar("max_points");

// Ensure numeric and avoid divide by zero
totalpoints = Number(totalpoints) || 0;
maxpoints = Number(maxpoints) || 1;

// Calculate scaled score as percentage
var scaledscore = (totalpoints / maxpoints);
var percentage = scaledscore * 100;
// var scaledscore = totalpoints;

// Push back to Storyline variable
player.SetVar("user_scaled_score", scaledscore);
player.SetVar("user_percentage_score", percentage);

}

};
