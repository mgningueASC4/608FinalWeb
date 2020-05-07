let binData;

$(document).ready(function(){
  $(".logOutButton").click(function(){
    localStorage.clear();
    window.location.replace("login.html");
  })

  $( "#createButton" ).click(function() {
    let username=localStorage.getItem('usernameStored');
    console.log(username);
    let tags=$("#tags").val();;
    let lat=$("#lat").val();;
    let long=$("#long").val();;
    let url = `http://608dev-2.net/sandbox/sc/team006/project/post.py`;
    let likeUrl = `http://608dev-2.net/sandbox/sc/team006/project/like.py`;

    let data = {
      fileData: binData,
      userID: username,
      tags:tags,
      lat:lat,
      lon:long
    }

    $.post(url, data, function(data, status){
      console.log(data.indexOf("Something"));
      if (data.indexOf("Something") == 0){
        alert("Post not created. Please fill in all data points!");
      }
      else{
        alert("Post created!");
        window.location.replace("myprofile.html");
      }
    });
  });
});

//select Image
//add image, gives you image path
//image convert to base64
function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
            $('#imageResult')
                .attr('src', e.target.result);
                binData=e.target.result.split(",").pop();
        };
        reader.readAsDataURL(input.files[0]);
    }
}




//who you follow
function getLikes(userID, postID){
  let url = `http://608dev-2.net/sandbox/sc/team006/project/follow.py?query=getFollowing&userID=${username}`;

  $.get(url, function(data, status){
    //change numFollowees value here
    $('.followees-numbers').text(`${numFollowees}`);
  });
}
