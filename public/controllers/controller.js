var getUser = angular.module('getUser', []);

getUser.controller('userCtrl',['$scope', '$http', function($scope,$http){

    var refresh = function() {
      $http.get('/contactlist').then(function(response) {
        console.log("I got the data I requested");
        $scope.contactlist = response.data;
        $scope.contact = null;
      });
    };

    refresh();


          $scope.addContact = function() {
            $http.post('/users', $scope.contact).then(function(response) {
              refresh();
            });
          };
          $scope.sendFriend = function(id, name, tname) {
            $http.get('/contactlist').then(function(response){
              angular.forEach(response.data, function(value, index){
                  if(response.data[index].name === name){
                  console.log('id kliknutog je : '+id+' name kliknutog je: '+name);
                  alert('Friend request sent to: '+ tname);
                    $http.put('/users/' + id + '/name/' + name, $scope.contact).then(function(response) {
                      console.log('im gonna put him in right now');
                    });
                  }
              });
            });
          };


        $scope.remove = function(id) {
          $http.delete('/users/' + id).then(function(response){
            refresh();
          });
        };


    $scope.show = function(name, date){
      console.log('show() init');
      $http.get('/name/' + name + '/date/' + date).then(function(response){
        $scope.name = response.data;
        if($scope.name == ""){
          alert('No such user');
        }else{
          $scope.date = response.data[0].date;
        }
      });
    };

    $scope.viewFriendProfile = function(x){
      console.log('Viewing profile now of ' +x);
      var currentProfile = document.getElementById('currentProfile');
      currentProfile.style.display = "block";
      $http.get('/friend/' + x).then(function(response){
        $scope.friend = response.data;
      });

    };

    $scope.acceptFriendship = function(id, name){
      $http.put('/accepted/' + id + '/name/'+ name, $scope.contact).then(function(response) {
        $scope.pendingName = name;
        alert('I accepted your invite: ' +name);
      });
    };
    $scope.rejectFriendship = function(id, name){
      $http.put('/rejected/' + id + '/name/'+ name, $scope.contact).then(function(response) {
        alert('I rejected your invite: ' +name);
      });
    };

  }]);
  getUser.directive("mybtn", function() {
      return {
          template : "<button class='btn btn-success' ng-click='acceptFriendship(contact.pendingFriendReqID, contact.pendingFriendReqName)'>Accept</button> <button class='btn btn-danger' ng-click='rejectFriendship(contact.pendingFriendReqID, contact.pendingFriendReqName)'>Reject</button>"
      };
  });

  getUser.controller('noviControler',['$scope', '$http', function($scope, $http){
    $scope.findDate = function(){
      console.log('findDate() init');
      var date = $scope.date;
      $http.get('/date/' + date).then(function(response){
        $scope.users = response.data;
      });
    };
  }]);
