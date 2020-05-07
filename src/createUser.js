let binData;

$(document).ready(function(){
  $( "#createUserButton" ).click(function() {
    let username=$("#createUsername").val();
    let password=$("#createPassword").val();
    let long=$("#long").val();;
    let url = `http://608dev-2.net/sandbox/sc/team006/project/create_user.py`;

    let data = {
      username: username,
      password: password
    }

    $.post(url, data, function(data, status){
      alert(`${data}`);
      window.location.replace("index.html");
    });
  });
});
