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
  getHomeFeedPosts(date, time, 0, username);

  $(".searchButton").click(function(){
    let usernameSearch = $("#usernameSearch").val();
    getProfileFeedPostsSearch(date, time, 0, usernameSearch);
  });

  $(".logOutButton").click(function(){
    localStorage.clear();
    window.location.replace("index.html");
  })

  $(".searchTag").click(function(){
    let tag = $("#tagSearch").val();
    let userIDSearch = $("#usernameSearch").val();
    getTagsSearch(username, "search", userIDSearch, tag, 0);
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
    console.log(data);
    console.log(`#numLikes${cursor}`);
    $(`#numLikes${cursor}`).text(data.split(",")[1]);
  });
}

function getData(index, userID, type){
  let urlLoop=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=${type}&cursor=${index}&userID=${userID}`;
  $.get(urlLoop, function(dataLoop,status){
      if(dataLoop.indexOf("S") != 0){
        let jsonDataLoop = $.parseJSON(dataLoop);
        $('.postsHere').append(
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
//ask for cursor length or how to get
//post My Profiles
function getHomeFeedPosts(date, time, cursor, userID){
  let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=home&cursor=${cursor}&userID=${userID}`;
  $.get(url, function(data,status){
    if(data.indexOf("S") == 0){
      getHomeFeedPosts(date, time, cursor+1, userID);
      return;
    }
    let jsonData = $.parseJSON(data);
    total = jsonData.total;

    for (i=0; i<total; i++){
      getData(i, userID, "home");
    }
  });
}

function getProfileFeedPostsSearch(date, time, cursor, userID){
  let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?time=${date}%20${time}&type=profile&cursor=${cursor}&userID=${userID}`;
  $.get(url, function(data,status){
    if(data.indexOf("S") == 0){
      getProfileFeedPostsSearch(date, time, cursor+1, userID);
      return;
    }
    let jsonData = $.parseJSON(data);
    total = jsonData.total;
    $('.postsHere').empty();

    for (i=0; i<total; i++){
      getData(i, userID, "profile");
    }
  });
}

function getTagsSearch(userID, type, userIDSearch, tagSearch, cursor){
  let url=`http://608dev-2.net/sandbox/sc/team006/project/post.py?userID=${userID}&type=${type}&userIDSearch=${userIDSearch}&cursor=${cursor}&tagSearch=${tagSearch}`;
  console.log(url);
  $.get(url, function(data, status){
    if(data.indexOf("S") == 0){
      getTags(userID, type, userIDSearch, tagSearch, cursor+1);
      return;
    }
    let jsonData = $.parseJSON(data);
    total = jsonData.total;

    $('.postsHere').empty();
    for (i=0; i<total; i++){
      getDataTag(i, userID, type, userIDSearch, tagSearch);
    }
  });
}

function getDataTag(index, userID, type, userIDSearch, tagSearch){
  let urlLoop=`http://608dev-2.net/sandbox/sc/team006/project/post.py?userID=${userID}&type=${type}&userIDSearch=${userIDSearch}&cursor=${index}&tagSearch=${tagSearch}`;
  $.get(urlLoop, function(dataLoop,status){
      if(dataLoop.indexOf("S") != 0){
        let jsonDataLoop = $.parseJSON(dataLoop);
        $('.postsHere').append(
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
