sc2.init({
  app: 'juicer.app',
  callbackURL: 'http://127.0.0.1:8080',
  scope: ['vote', 'comment']
});

// oauth2 url
//https://v2.steemconnect.com/oauth2/authorize?client_id=juicer.app&redirect_uri=http%3A%2F%2F127.0.0.1%3A8080&scope=vote,comment

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
    var i = 1

    $scope.limit = {
      runTime: '4'
    };

    var limit = 7;
    var query = {
      tag: 'introduceyourself',
      limit: limit
    };
    console.log('scope.limit',$scope.limit);

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
      steem.api.getContentReplies($scope.parentAuthor, $scope.parentPermlink, function(err, result) {
        if (!err) {
          $scope.comments = result.slice(-5);
          $scope.$apply();
        }
      });
    };
/*
    var repeat_list = [];
    $scope.comment = function() {
      console.log("repeat_list: ", repeat_list);
      $scope.loading = true;
      var permlink = steem.formatter.commentPermlink($scope.parentAuthor, $scope.parentPermlink);
      sc2.comment($scope.parentAuthor, $scope.parentPermlink, $scope.user.name, permlink, '', $scope.message, '', function(err, result) {
        console.log(err, result);
        $scope.content = '';
        $scope.loading = false;
        $scope.$apply();
        $scope.loadComments();
      });
    };
*/
    var repeat_list = [];
    /* auto comment*/
    $scope.comment= function() {
      $scope.loading= true;
      console.log("repeat_list: ", repeat_list);
      steem.api.getDiscussionsByCreated(query, function(err, result) {
        setTimeout(function () {
          var permlinkSlug = new Date().toISOString().replace(/[^a-zA-Z0-9]+/g, '').toLowerCase();
          var discussion = result[i];
          //console.log(i, discussion);
          var user_id = discussion.id;
          var flag = $.inArray(user_id, repeat_list); //check if user_id is already in array
          if (flag === -1) {
            repeat_list.push(user_id);
            console.log("inside inarray",repeat_list);
            window.permlink = discussion.permlink;
            window.author = discussion.author;
            /*
            console.log(author, 'author');
            console.log('permlink',permlink);
            console.log('permlinkSlug',permlinkSlug);
            console.log('$scope.content', $scope.content);
            */
            /* broadcast comment*/
            sc2.comment(
              author,//$scope.parentAuthor is what is was before 
              permlink, //$scope.parentPermlink  21000
              $scope.user.name, 
              permlinkSlug, 
              '',
              $scope.content,
              { tags: ['introduceyourself'] },
              function(err, result) {
              console.log(err, result);
              //$scope.content = '';
              //$scope.loading = false;
              //$scope.$apply();
            });
          }
          i++;
          if (i < limit) {
            $scope.comment();
          }
        }, 21000)
      }); 
    }

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