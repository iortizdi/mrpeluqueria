angular.module('starter.controllers', [])

.controller('LoginCtrl', function($scope, $state, $rootScope, $ionicLoading, LoginService, $ionicPopup) {

    $scope.user = {
        username: null,
        password: null
    };

    $scope.error = {};

    $scope.login = function() {

        $scope.loading = $ionicLoading.show({
            content: 'Logging in',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = $scope.user;
        Parse.User.logIn(('' + user.username).toLowerCase(), user.password, {
            success: function(user) {

                var verified = user.get("emailVerified");
                if(!verified){
                    console.log("Email not verified.");
                    $ionicLoading.hide();
                    var alertPopup = $ionicPopup.alert({
                        title: 'Cuenta no activada',
                        template: 'Debe activar la cuenta validando el email enviado a la cuenta ' + user.get("email")
                    });

                }else{
                    $ionicLoading.hide();
                    $rootScope.user = user;
                    $rootScope.isLoggedIn = true;
                    $state.go('tab.dash', {
                        clear: true
                    });
                }
            },
            error: function(user, err) {
                $ionicLoading.hide();
                // The login failed. Check error to see why.
                if (err.code === 101) {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Credenciales invalidas',
                        template: 'Debe introducir un email y una constraseña validos.'
                    });
                    //$scope.error.message = 'Invalid login credentials';
                } else {
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error inesperado',
                        template: 'Ha ocurrido un error inesperado, porfavor intentelo de nuevo.'
                    });                  
                    //$scope.error.message = 'An unexpected error has occurred, please try again.';
                }
                $scope.$apply();
            }
        });
    };

    $scope.forgot = function() {
        $state.go('forgot');
    };

})

.controller('RegisterCtrl', function($scope, $state, $ionicLoading, $rootScope, $ionicPopup) {
    $scope.user = {};
    $scope.error = {};

    $scope.signup = function() {

        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        var user = new Parse.User();
        user.set("username", $scope.user.email);
        user.set("password", $scope.user.password);
        user.set("email", $scope.user.email);
        user.set("role", 1);

        user.signUp(null, {
            success: function(user) {
                $ionicLoading.hide();
                $rootScope.user = user;
                $rootScope.isLoggedIn = true;
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: 'Hemos enviado un email de verificacion a la cuenta ' 
                      + user.email + '. La cuenta debe ser validada para poder acceder a la aplicacion'
                });

                $state.go('login', {
                    clear: true
                });

            },
            error: function(user, error) {
                $ionicLoading.hide();
                if (error.code === 125) {
                    $scope.error.message = 'Please specify a valid email ' +
                        'address';
                } else if (error.code === 202) {
                    $scope.error.message = 'The email address is already ' +
                        'registered';
                } else {
                    $scope.error.message = error.message;
                }
                $scope.$apply();
            }
        });
    };
})


.controller('ForgotPasswordCtrl', function($scope, $state, $ionicLoading) {
    $scope.user = {};
    $scope.error = {};
    $scope.state = {
        success: false
    };

    $scope.reset = function() {
        $scope.loading = $ionicLoading.show({
            content: 'Sending',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        Parse.User.requestPasswordReset($scope.user.email, {
            success: function() {
                $ionicLoading.hide();
                $scope.state.success = true;
                $scope.$apply();
            },
            error: function(err) {
                $ionicLoading.hide();
                if (err.code === 125) {
                    $scope.error.message = 'Email address does not exist';
                } else {
                    $scope.error.message = 'An unknown error has occurred, ' +
                        'please try again';
                }
                $scope.$apply();
            }
        });
    };

    $scope.login = function() {
        $state.go('login');
    };
})


.controller('DashCtrl', function($scope, $rootScope) {
    if (!$rootScope.isLoggedIn) {
        $state.go('login');
    }
    var user = $scope.user;
    var role = user.get("role");
    if (role == 1) {
        console.log("login success, role is 1");
    } else {
        console.log("login success, role is " + role);
    }


})

.controller('ChatsCtrl', function($scope, Chats) {
  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  }
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
