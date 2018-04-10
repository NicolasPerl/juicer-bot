//var sc2 = require('sc2-sdk');


sc2.init({
  app: 'juicer.app',
  callbackURL: 'http://127.0.0.1:8080/Views/comments.html',
  scope: ['vote', 'comment']
});

angular.module('app', [])
  .config(['$locationProvider', function($locationProvider){
    $locationProvider.html5Mode(true);
  }])
  .controller('Main', function($scope, $location, $http) {
    $scope.loading = false;
    $scope.parentAuthor = 'siol';
    $scope.parentPermlink = '5vdmjq-test';
    $scope.accessToken = $location.search().access_token;
    $scope.expiresIn = $location.search().expires_in;
    $scope.loginURL = sc2.getLoginURL();

    //set the counter 
    var i = 0
    var j = 0
    var repeat_list = [];
    var startTime = new Date().getTime();
    
    var commentGate = true;

    startInterval = function () {
      if (new Date().getTime() - startTime < 172800000) {//2 days
        console.log('inside startInterval() if statement: !!!!!!!!!!!!!!!!!!!!!!!!!')
        var myVar = setInterval(function(){  fetchPosts() }, 300000);//22000   604800000 1 week
      }
    }
    

    $scope.getVal=function(){
      $scope.limit = $scope.limit_model;
      window.limit = $scope.limit
    }
/*
    $scope.getTag=function() {
      //console.log('$scope.tag.tag_model: ', $scope.tag_model);
      $scope.tag = $scope.tag_model;
      window.tag = $scope.tag
      console.log('tag: ', tag);
      window.query = {
        tag: tag,
        limit: limit
      };
      
    }
  */  

  //triggered after user hits submit button
    $scope.fire=function() {
      $scope.loading= true;
      $scope.tag = $scope.tag_model;
        window.tag = $scope.tag
        console.log('tag: ', tag);
        window.query = {
          tag: tag,
          limit: limit
        };
        fetchPosts();
    }


    //grab new posts from blockchain
    function fetchPosts() {
      steem.api.getDiscussionsByCreated(query, function(err, result) {
        console.log('getDiscussionsByCreated: ',result);
        window.stopAfter = result.length;

        //itertate through result 
        function inside() {
          setTimeout(function () {
            console.log('---------------inside set timeout: --------------');
            window.permlinkSlug = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
            window.discussion = result[i];
            console.log(i, discussion);
            window.user_id = discussion.id;
            window.flag = $.inArray(user_id, repeat_list); //check if user_id is already in array
    
            if (flag === -1) {//
              repeat_list.push(user_id);
              window.permlink = discussion.permlink;
              window.author = discussion.author;
              commentCheck(result);
            }
            i++;
            if (i == stopAfter) {
              console.log("startInterval has been called !!!!!!!!!!!!!!!----------------");
            }
            if (i < stopAfter) {
              inside();
            }
          }, 25000)
        }
        inside();
      });
    }

  function commentCheck(result) {
    steem.api.getContentReplies(author, permlink, function(err, result) {
        if (!err) {
          commentGate = true;
          j = 0
          var user = $scope.user.name;
          $scope.$apply();
          console.log('inside api.getContentReplies()--------------------------------');
          console.log('result in commentCheck(): ',result);        
          var checkID = result[j];
          
          if (checkID != null) {            

            console.log("result.length: ",);
            for (j = 0; j < result.length; j++) { 
                checkID = result[j];
                console.log('j inside for loop: ',j);
                var replyAuthor = checkID.author;//.id
                //if replyAuthor matches with $user change commentGate flag
                if (replyAuthor == user) {
                  commentGate = false;
                  console.log('if replyAuthor == user:----------------------- commentGate switched',);
                }
            }
          }
          if (commentGate) {
            console.log('inside commentGate: ');
            $scope.comment();
          }
        }
      });
  }


    if ($scope.accessToken) {
      sc2.setAccessToken($scope.accessToken);
      sc2.me(function (err, result) {
        console.log('/me', err, result);
        if (!err) {
          $scope.user = result.account;
          $scope.metadata = JSON.stringify(result.user_metadata, null, 2);
          $scope.$apply();
          
        }
      });
    }

    $scope.isAuth = function() {
      return !!$scope.user;
    };

    $scope.loadComments = function() {
      steem.api.getContentReplies('techchat', 'hq-the-popular-mobile-live-trivia-game-gave-away-usd250-000', function(err, result) {
        if (!err) {
          $scope.comments = result.slice(-5);
          $scope.$apply();
          console.log('getContentReplies: ', result);
        }
      });
    };
  
    console.log('repeat_list: ',repeat_list);
    /* auto comment*/
    $scope.comment= function() {
      $scope.loading= true;
        //commentCheck();
          /* broadcast comment*/
          console.log('author in comment(): ',author);
          console.log('permlink in comment(): ', permlink);
          sc2.comment(
            author,//$scope.parentAuthor is what is was before 
            permlink, //$scope.parentPermlink  21000
            $scope.user.name, 
            permlinkSlug, 
            '',
            $scope.content,
            { tags: [tag] },
            function(err, result) {
              console.log("comment result: ", result);
              //$scope.$apply();
              console.log('<----------------------------comment fired-------------------------------->');
              
            });
    }    
    // after 1 week stop
    //setTimeout(() => { clearInterval(timerId); alert('stop'); },  604800000);

    $scope.vote = function(author, permlink, weight) {
      sc2.vote($scope.user.name, author, permlink, weight, function (err, result) {
        if (!err) {
          alert('You successfully voted for @' + author + '/' + permlink);
          console.log('You successfully voted for @' + author + '/' + permlink, err, result);
          $scope.loadComments();
        } else {
          console.log(err);
        }
      });
    };

    $scope.updateUserMetadata = function(metadata) {
      sc2.updateUserMetadata(metadata, function (err, result) {
        if (!err) {
          alert('You successfully updated user_metadata');
          console.log('You successfully updated user_metadata', result);
          if (!err) {
            $scope.user = result.account;
            $scope.metadata = JSON.stringify(result.user_metadata, null, 2);
            $scope.$apply();
            window.user = $scope.user;
          }
        } else {
          console.log(err);
        }
      });
    };
    $scope.logout = function() {
      sc2.revokeToken(function (err, result) {
        console.log('You successfully logged out', err, result);
        delete $scope.user;
        delete $scope.accessToken;
        $scope.$apply();
      });
    };
  });