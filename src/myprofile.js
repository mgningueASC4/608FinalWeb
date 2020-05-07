let username;
let password;
let numFollowees=1;
let numFollowers=1;
var total;

$(document).ready(function(){
  let dateG = new Date();
  date = dateG.mmddyyyy();
  time = dateG.hhminsec();
  username=localStorage.getItem('usernameStored');
  console.log(username);
  getFollowers(username);
  getFollowees(username);
  getProfileFeedPosts(date, time, 0, username);

  $(".usernameSite").text(username);
  $(".searchButton").click(function(){
    let usernameSearch = $("#usernameSearch").val();
    getProfileFeedPostsSearch(date, time, 0, usernameSearch);
    getProfileFeedPostsSearch(date, time, 1, usernameSearch);
  });

  $(".logOutButton").click(function(){
    localStorage.clear();
    window.location.replace("index.html");
  })
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
    console.log(`#numLikes${cursor}`);
    $(`#numLikes${cursor}`).text(data.split(",")[1]);
  });
}

//places number on profile page
//who you follow
function getFollowees(userID){
  let url = `http://608dev-2.net/sandbox/sc/team006/project/follow.py?query=getFollowing&userID=${username}`;

  $.get(url, function(data, status){
    //change numFollowees value here
    numFollowees = data.split(')').length-1;
    $('.followees-numbers').text(`${numFollowees}`);
  });
}

//who follows you
function getFollowers(userID){
  let url = `http://608dev-2.net/sandbox/sc/team006/project/follow.py?query=getFollowers&userID=${username}`;

  $.get(url, function(data, status){
    //change numFollowers value here
    numFollowers=data.split(')').length-1;
    $('.followers-numbers').text(`${numFollowers}`);
  });
}

//ask for cursor length or how to get
//post My Profiles
function getProfileFeedPosts(date, time, cursor, userID){
  let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=profile&cursor=${cursor}&userID=${userID}`;
  console.log(url);
  $.get(url, function(data,status){
    if(data.indexOf("S") == 0){
      getHomeFeedPosts(date, time, cursor+1, userID);
      return;
    }
    let jsonData = $.parseJSON(data);
    total = jsonData.total;

    for (i=0; i<total; i++){
      getData(i, userID);
    }
  });
}

function getData(index, userID){
  let urlLoop=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=profile&cursor=${index}&userID=${userID}`;
  $.get(urlLoop, function(dataLoop,status){
      if(dataLoop.indexOf("S") != 0){
        let jsonDataLoop = $.parseJSON(dataLoop);
        $('.myPostsHere').append(
          `
          <div class="col-4">
            <div class="card postCard" style="width: 22rem;">
              <div class="card-header">
                <img src="https://lafeber.com/pet-birds/wp-content/uploads/2018/06/Parakeet.jpg" height=15 style="border-radius:5px;">
                <span><button id="clickFollow${index}">${jsonDataLoop.userID}</button></span>
              </div>
              <img class="card-img-top post-images" src="data:image/png;base64, ${jsonDataLoop.data}" alt="Card image cap">
              <div class="card-body">
                <h5 class="card-title">Location: ${jsonDataLoop.location}</h5>
                <button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
                ${jsonDataLoop.tags} </button>
                <button id="likeButton${index}"><i class="fas fa-thumbs-up"></i></button> <span id="numLikes${index}">${jsonDataLoop.likes}</span><span hidden id="postID${index}">${jsonDataLoop.postID}</span>
              </div>
            </div>
          </div>
          `
        );
        $("body").delegate(`#likeButton${index}`, "click", function(){
          like(username, $(`#postID${index}`).text(), index);
        });

        $("body").delegate(`#clickFollow${index}`, "click", function(){
          follow(username, $(`#clickFollow${index}`).text())
        })
      }
  });
}




Date.prototype.mmddyyyy = function() {
  let yyyy = this.getFullYear().toString();
  let mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  let dd  = this.getDate().toString();
  return (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + "-" + yyyy%1000; // padding
};

Date.prototype.hhminsec = function() {
  let hh = this.getHours().toString();
  let min = this.getMinutes().toString(); // getMonth() is zero-based
  let sec  = this.getSeconds().toString();
  return (hh[1]?hh:"0"+hh[0]) + ":" + (min[1]?min:"0"+min[0]) + ":" + (sec[1]?sec:"0"+sec[0]); // padding
};











/*
let username;
let password;
let numFollowees=1;
let numFollowers=1;
var total;

$(document).ready(function(){
  let dateG = new Date();
  date = dateG.mmddyyyy();
  time = dateG.hhminsec();
  console.log(date);
  console.log(time);
  username=localStorage.getItem('usernameStored');
  console.log(username);
  getFollowers(username);
  getFollowees(username);
  getHomeFeedPosts(date, time, 0, username);
  getProfileFeedPosts(date, time, 0, username);

  $(".searchButton").click(function(){
    let usernameSearch = $("#usernameSearch").val();
    getProfileFeedPostsSearch(date, time, 0, usernameSearch);
    getProfileFeedPostsSearch(date, time, 1, usernameSearch);
  });

  $(".logOutButton").click(function(){
    localStorage.clear();
    window.location.replace("login.html");
  })

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
  });
}

//post My profiles
function getProfileFeedPosts(date, time, cursor, userID){
  let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=profile&cursor=${cursor}&userID=${userID}`;
  $.get(url, function(data,status){
    let jsonData = $.parseJSON(data);
    total = jsonData.total;
    console.log(total);
    for (i=0; i<total; i++){
      let urlLoop=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=profile&cursor=${i}&userID=${userID}`;

      $.get(urlLoop, function(data,status){
        let jsonData = $.parseJSON(data);
        $('.postsHere').append(
          `
          <div class="col-4">
            <div class="card postCard" style="width: 22rem;">
      				<div class="card-header">
      					<img src="https://lafeber.com/pet-birds/wp-content/uploads/2018/06/Parakeet.jpg" height=15 style="border-radius:5px;">
      				  <span><button id="clickFollow${i}">${jsonData.userID}</button></span>
      				</div>
      			  <img class="card-img-top post-images" src="data:image/png;base64, ${jsonData.data}" alt="Card image cap">
      			  <div class="card-body">
      			    <h5 class="card-title">Location: ${jsonData.location}</h5>
      					<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
      		  		${jsonData.tags} </button>
                <button id="likeButton${i}"><i class="fas fa-thumbs-up"></i></button> <span id="numLikes${i}">${jsonData.likes}</span><span hidden id="postID${i}">${jsonData.postID}</span>
      			  </div>
      			</div>
          </div>
          `
        );
      });
    }
  });
}

//ask for cursor length or how to get
//post My Profiles
function getHomeFeedPosts(date, time, cursor, userID){
  let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=home&cursor=${cursor}&userID=${userID}`;
  $.get(url, function(data,status){
    let jsonData = $.parseJSON(data);
    total = jsonData.total;
    console.log(total);
    for (i=0; i<total; i++){
      let urlLoop=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=home&cursor=${i}&userID=${userID}`;

      $.get(urlLoop, function(dataLoop,status){
        let jsonDataLoop = $.parseJSON(dataLoop);
        console.log(`Its gonna post ${i}`)
        $('.postsHere').append(
          `
          <div class="col-4">
            <div class="card postCard" style="width: 22rem;">
      				<div class="card-header">
      					<img src="https://lafeber.com/pet-birds/wp-content/uploads/2018/06/Parakeet.jpg" height=15 style="border-radius:5px;">
      				  <span><button id="clickFollow${i}">${jsonDataLoop.userID}</button></span>
      				</div>
      			  <img class="card-img-top post-images" src="data:image/png;base64, ${jsonDataLoop.data}" alt="Card image cap">
      			  <div class="card-body">
      			    <h5 class="card-title">Location: ${jsonDataLoop.location}</h5>
      					<button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="bottom" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
      		  		${jsonDataLoop.tags} </button>
                <button id="likeButton${i}"><i class="fas fa-thumbs-up"></i></button> <span id="numLikes${i}">${jsonDataLoop.likes}</span><span hidden id="postID${i}">${jsonDataLoop.postID}</span>
      			  </div>
      			</div>
          </div>
          `
        );
      });
    }
  });
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

Date.prototype.mmddyyyy = function() {
  let yyyy = this.getFullYear().toString();
  let mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
  let dd  = this.getDate().toString();
  return (mm[1]?mm:"0"+mm[0]) + "-" + (dd[1]?dd:"0"+dd[0]) + "-" + yyyy%1000; // padding
};

Date.prototype.hhminsec = function() {
  let hh = this.getHours().toString();
  let min = this.getMinutes().toString(); // getMonth() is zero-based
  let sec  = this.getSeconds().toString();
  return (hh[1]?hh:"0"+hh[0]) + ":" + (min[1]?min:"0"+min[0]) + ":" + (sec[1]?sec:"0"+sec[0]); // padding
};
*/
