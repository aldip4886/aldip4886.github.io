function ExecuteScript(strId)
{
  switch (strId)
  {
      case "5f8Ys8DCitg":
        Script1();
        break;
      case "60645CkKLW7":
        Script2();
        break;
      case "5jiaN9rHrg6":
        Script3();
        break;
  }
}

function Script1()
{
  var head = document.getElementsByTagName('head')[0];
var script = document.createElement('script');
script.src = '//code.jquery.com/jquery-1.11.0.min.js';
script.type = 'text/javascript';
head.appendChild(script)
}

function Script2()
{
  var player = GetPlayer();
 
//PLACE YOUR WEB APP URL
WEB_APP_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=4R759QIMVwLI8AFP0eu8B3ECCdvZo9rJnHwSEsoOXgDn0O7zXu1Ev8k-XUtR4aqIaOx097BVPiw3NAO6OKOipO0OkEAz75V9m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnL8RP0Psvx85CDf9kH0Hr9RftcTsnypMI_LqWq_6h6HMuR0uxghd_yZmEMNzP0YWeu6XPjAlVPAWVu_O5cMkJjOEAeSRTMXOLw&lib=MDBures1_C4Aw3JYAiHuaw7egabXMlzsK";
 
// STORE ARTICULATE STORYLINE VARIABLES
// "Columnname_Google_Spreadsheet" : player.GetVar("Name_Storyline_Variable")
// ATTENTION: Use a comma if you use multiple Storyline variables
storyline =
{
 "date" : new Date().toJSON().slice(0,10), //STORE DATE
 "name": player.GetVar("name"),
 "user_JSExperience": player.GetVar("user_JSExperience"),   "user_LMSRating": player.GetVar("user_LMSRating"),
 "user_SLExperience": player.GetVar("user_SLExperience")
}
}

function Script3()
{
  //DELAY SO JQUERY LIBRARY IS LOADED
setTimeout(function (){
 
//Export to Google
$.ajax({
url: https://script.googleusercontent.com/macros/echo?user_content_key=4R759QIMVwLI8AFP0eu8B3ECCdvZo9rJnHwSEsoOXgDn0O7zXu1Ev8k-XUtR4aqIaOx097BVPiw3NAO6OKOipO0OkEAz75V9m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnL8RP0Psvx85CDf9kH0Hr9RftcTsnypMI_LqWq_6h6HMuR0uxghd_yZmEMNzP0YWeu6XPjAlVPAWVu_O5cMkJjOEAeSRTMXOLw&lib=MDBures1_C4Aw3JYAiHuaw7egabXMlzsK,
type: "POST",
data : storyline,
success: function(data)
{
console.log(data);
},
error: function(err) {
console.log('Error:', err);
}
});
return false;
}, 1000);
}

