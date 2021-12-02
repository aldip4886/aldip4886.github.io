function ExecuteScript(strId)
{
  switch (strId)
  {
      case "5Y7l4dh3aQW":
        Script1();
        break;
  }
}

function Script1()
{
  var player = GetPlayer();

$.ajax({

url:
"https://script.googleusercontent.com/macros/echo?user_content_key=R9yAEDPmP_tR6Bmua7_Oy4zTf70GQnCLZVXrUI1N33qDTKEqFlr0o8Xw9h2b1h5RIiDkTozYSQ0-jMAJAkm-2qGpDG_QiXB4m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnLrZtYeTndQ0Dgq1b3KN2t2QmRjEiDc2HucO9KBPuWISpgYDSOl3QjIHIAz1biNJfhHkjRWEXt1CgjFiQuiAa6k04qGmcNKFhg&lib=MDBures1_C4Aw3JYAiHuaw7egabXMlzsK",

type: "POST",

data: {"name": player.GetVar("name")
, "user_JSExperience": player.GetVar("user_JSExperience")
, "user_LMSRating": player.GetVar("user_LMSRating")
, "user_SLExperience": player.GetVar("user_SLExperience")
, "postname": player.GetVar("postname")
, "postuser_JSExperience": player.GetVar("postuser_JSExperience")
, "postuser_LMSRating": player.GetVar("postuser_LMSRating")
, "postuser_SLExperience": player.GetVar("postuser_SLExperience")},


success: function(data)

{

console.log(data);

},

error: function(err) {
console.log('Error:', err);
}

});

return false;
}

