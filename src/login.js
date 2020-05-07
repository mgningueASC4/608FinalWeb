$(document).ready(function(){
  $( "#login-button" ).click(function() {
    let username = $("#login-username").val();
    let password= $("#login-password").val();
    let url = `http://608dev-2.net/sandbox/sc/team006/project/create_user.py?username=${username}&password=${password}`;

    $.get(url, function(data, status){
      alert(`${data}`);
      if (data.indexOf("s")==6){
        console.log("Got it!");
        localStorage.setItem('usernameStored', username);
        let testUser = localStorage.getItem('usernameStored');
        console.log(testUser);
        window.location.replace("myprofile.html");
      }
      else{
        console.log("This works, no user here")
      }
      console.log(`${data}`);
    });
  });
});
