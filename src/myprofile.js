let username;
let password;
let numFollowees=1;
let numFollowers=1;
let today = new Date();
//let date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getYear();
//let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
let date;
let time;

$(document).ready(function(){
  date="04-30-20"
  time="10:51:00"
  username="yousef"
  //getFollowers(username);
  getFollowers(username);
  getFollowees(username);
  getProfileFeedPosts(date, time, 0, username);
  getProfileFeedPosts(date, time, 1, username);
  getProfileFeedPosts(date, time, 2, username);

  //getHomeFeedPosts(date, time, 0, username);

  $(".searchButton").click(function(){
    let usernameSearch = $("#usernameSearch").val();
    getProfileFeedPostsSearch(date, time, 0, usernameSearch);
    getProfileFeedPostsSearch(date, time, 1, usernameSearch);
  });

  $("body").delegate("#likeButton", "click", function(){
    like("yousef", $("#postID").text(), "");
  });

  $("body").delegate("#likeButton0", "click", function(){
    like("yousef", $("#postID0").text(), 0);
  });

  $("body").delegate("#likeButton1", "click", function(){
    like("yousef", $("#postID1").text(), 1);
  });

  $("body").delegate("#clickFollow", "click", function(){
    follow("terry", $("#clickFollow").text());
    getFollowers("yousef");
  });

  $("body").delegate("#clickFollow0", "click", function(){
    follow("terry", $("#clickFollow0").text());
    getFollowers("yousef");
  });

  $("body").delegate("#clickFollow1", "click", function(){
    follow("terry", $("#clickFollow1").text());
    getFollowers("yousef");
  });
});

function follow(userID, followeeID){
  let followUrl="http://608dev-2.net/sandbox/sc/team006/project/follow.py"
  let followData={
    userID: userID,
    followeeID: followeeID
  }
  $.post(followUrl, followData,function(data, status){
    console.log(`${data}`);
  });
}

function like(userID, postID, cursor){
  let likeData = {
    userID: userID,
    postID: postID
  }

  let likeUrl="http://608dev-2.net/sandbox/sc/team006/project/like.py"

  $.post(likeUrl, likeData, function(data, status){
  $(`#numLikes${cursor}`).text(data.split(",")[1]);
  });
}

//places number on profile page
//who you follow
function getFollowees(userID){
  let url = `http://608dev-2.net/sandbox/sc/team006/project/follow.py?query=getFollowing&userID=${username}`;

  $.get(url, function(data, status){
    //change numFollowees value here
    $('.followees-numbers').text(`${numFollowees}`);
  });
}

//who follows you
function getFollowers(userID){
  let url = `http://608dev-2.net/sandbox/sc/team006/project/follow.py?query=getFollowers&userID=${username}`;

  $.get(url, function(data, status){
    //change numFollowers value here
    numFollowers=data.split(')').length-1
    $('.followers-numbers').text(`${numFollowers}`);
    console.log(data);
  });
}

//post My profiles
function getProfileFeedPosts(date, time, cursor, userID){
  let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=profile&cursor=${cursor}&userID=${userID}`

  $.get(url, function(data,status){
    let jsonData = $.parseJSON(data);
    $('.myPostsHere').append(
      `
      <div class="col-4">
        <div class="card postCard" style="width: 22rem;">
  				<div class="card-header">
  					<img src="https://lafeber.com/pet-birds/wp-content/uploads/2018/06/Parakeet.jpg" height=15 style="border-radius:5px;">
  				  <span><button id="clickFollow${cursor}">${jsonData.userID}</button></span>
  				</div>
  			  <img class="card-img-top post-images" src="data:image/png;base64, ${jsonData.data}" alt="Card image cap">
  			  <div class="card-body">
  			    <h5 class="card-title">Location: ${jsonData.location}</h5>
  					<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  		  		${jsonData.tags} </button>
            <button id="likeButton${cursor}"><i class="fas fa-thumbs-up"></i></button> <span id="numLikes${cursor}">${jsonData.likes}</span><span hidden id="postID${cursor}">${jsonData.postID}</span>
  			  </div>
  			</div>
      </div>
      `
    )
    //console.log(data);
    //console.log(data["userID"]);
    //console.log(jsonData);
  })
}

//ask for cursor length or how to get
//post My Profiles
function getHomeFeedPosts(date, time, cursor, userID){
  for (i=0; i<2; i++){
    let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=home&cursor=${i}&userID=${userID}`

    $.get(url, function(data,status){
      console.log(data);
      let jsonData = $.parseJSON(data);
      $('.postsHere').append(
        `
        <div class="col-4">
          <div class="card postCard" style="width: 22rem;">
    				<div class="card-header">
    					<img src="https://lafeber.com/pet-birds/wp-content/uploads/2018/06/Parakeet.jpg" height=15 style="border-radius:5px;">
    				  <span><button id="clickFollow${cursor}">${jsonData.userID}</button></span>
    				</div>
    			  <img class="card-img-top post-images" src="data:image/png;base64, ${jsonData.data}" alt="Card image cap">
    			  <div class="card-body">
    			    <h5 class="card-title">Location: ${jsonData.location}</h5>
    					<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
    		  		${jsonData.tags} </button>
              <button id="likeButton${cursor}"><i class="fas fa-thumbs-up"></i></button> <span id="numLikes${cursor}">${jsonData.likes}</span><span hidden id="postID${cursor}">${jsonData.postID}</span>
    			  </div>
    			</div>
        </div>
        `
      );
    });
  }
}

function getProfileFeedPostsSearch(date, time, cursor, userID){
  let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=profile&cursor=${cursor}&userID=${userID}`

  $.get(url, function(data,status){
    let jsonData = $.parseJSON(data);
    $('.postsHere').append(
      `
      <div class="col-4">
        <div class="card postCard" style="width: 22rem;">
  				<div class="card-header">
  					<img src="https://lafeber.com/pet-birds/wp-content/uploads/2018/06/Parakeet.jpg" height=15 style="border-radius:5px;">
  				  <span><button id="clickFollow${cursor}">${jsonData.userID}</button></span>
  				</div>
  			  <img class="card-img-top post-images" src="data:image/png;base64, ${jsonData.data}" alt="Card image cap">
  			  <div class="card-body">
  			    <h5 class="card-title">Location: ${jsonData.location}</h5>
  					<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  		  		${jsonData.tags} </button>
            <button id="likeButton${cursor}"><i class="fas fa-thumbs-up"></i></button> <span id="numLikes${cursor}">${jsonData.likes}</span><span hidden id="postID${cursor}">${jsonData.postID}</span>
  			  </div>
  			</div>
      </div>
      `
    )
    //console.log(data);
    //console.log(data["userID"]);
    //console.log(jsonData);
  })
}
