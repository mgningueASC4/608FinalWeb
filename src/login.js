
/*//let responseLOGIN= fetch(url2)
//console.log(responseLOGIN);

$.get(url2, function(data, status){
  console.log(`${data}`)
});
*/

$(document).ready(function(){
  $( "#login-button" ).click(function() {
    let username = $("#login-username").val();
    let password= $("#login-password").val();
    let url = `http://608dev-2.net/sandbox/sc/team006/project/create_user.py?username=${username}&password=${password}`;

    $.get(url, function(data, status){
      alert(`${data}`);
      console.log(`${data}`);
    });
    //let data = await response.json();

  });

});

/*
let url = "http://608dev-2.net/sandbox/sc/team006/project/follow.py?query=getFollowers&userID=yousef";

async function fetchAsync(url){
  let response = await fetch(url, {
      headers : {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
       }

    });
  let data = await response.json();
  console.log(data);
  return data;
}

function getFollowers(url){
  let followers = fetchAsync(url);
  return followers[0].length;
}
*/
