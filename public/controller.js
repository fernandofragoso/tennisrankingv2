var rankingApp = angular
	.module("RankingApp", ['ngRoute','ngResource'])
	.config(['$routeProvider', function($routeProvider){
		$routeProvider.
			when("/login",{templateUrl:'partials/login.html',controller:'LoginController'}).
			when("/players",{templateUrl:'partials/players.html',controller:'PlayerController'}).
			when("/matches",{templateUrl:'partials/matches.html',controller:'MatchController'}).
			when("/matches/:tournId",{templateUrl:'partials/matches.html',controller:'MatchController'}).
			otherwise({redirectTo:'/'});
	}]);

// rankingApp.factory('Data', function(){

// });

rankingApp.controller("LoginController",['$scope','$http', function($scope, $http){

	$('#loginmodal').modal('show');

	$('#loginmodal').on('hidden.bs.modal', function () {
	    $window.location.href = '/';
	})

	$scope.submit = function(){

		$http.post('/adm/login').success(function(data){
			alert(data);
		}).error(function(data){
			alert(data);
		});
	}

}]);

rankingApp.controller("PlayerController",['$scope','$window','$routeParams', function($scope, $window, $routeParams){

	//SHOW MODAL
	$('#playermodal').modal('show');

	$('#playermodal').on('hidden.bs.modal', function () {
	    //$window.location.href = '/';
	    $scope.changeRoute('/#/');
	});

	$scope.submit = function(){

		this.player.points = 0;
		$scope.Player.save(this.player, function(data){
			$scope.changeRoute('/#/');
		});
	}

}]);

rankingApp.controller("MatchController",['$scope','$window','$routeParams', function($scope, $window, $routeParams){

	$scope.setsp1 = [];
	$scope.setsp2 = [];
	$scope.tournid_test = "TESTE";

	//SHOW MODAL
	$('#matchmodal').modal('show');

	$('#matchmodal').on('hidden.bs.modal', function () {
	    //$window.location.href = '/';
	    $scope.changeRoute('/#/');
	})

	$scope.tournId = $routeParams.tournId;

	$scope.submit = function(){

		//INITIALIZE SCORES
		this.match.score = {};
		this.match.score.games = [];
		this.match.score.set_p1 = 0;
		this.match.score.set_p2 = 0;

		//SET TOURN ID
		this.match.tourn_id = $scope.tournId;

		//CHECKING WO
		if ($scope.setsp1[0] == "W") {
			this.match.score.wo = true;
			this.match.score.set_p1 = 2;
			this.match.score.set_p2 = 0;
			//SET GAMES
			this.match.score.games[0] = {};
			this.match.score.games[0].game_p1 = "W";
			this.match.score.games[0].game_p2 = "O";
		} else if ($scope.setsp2[0] == "W") {
			this.match.score.wo = true;
			this.match.score.set_p1 = 0;
			this.match.score.set_p2 = 2;
			//SET GAMES
			this.match.score.games[0] = {};
			this.match.score.games[0].game_p1 = "O";
			this.match.score.games[0].game_p2 = "W";
		} else {
			this.match.score.wo = false;

			//COUNTING SCORES
			if ($scope.setsp1[0]!=$scope.setsp2[0]) {
				if ($scope.setsp1[0] > $scope.setsp2[0]) {
					this.match.score.set_p1++;
				} else {
					this.match.score.set_p2++;
				}
			}

			if ($scope.setsp1[1]!=$scope.setsp2[1]) {
				if ($scope.setsp1[1] > $scope.setsp2[1]) {
					this.match.score.set_p1++;
				} else {
					this.match.score.set_p2++;
				}
			}

			if ($scope.setsp1[2]!=$scope.setsp2[2]) {
				if (parseInt($scope.setsp1[2]) > parseInt($scope.setsp2[2])) {
					this.match.score.set_p1++;
				} else {
					this.match.score.set_p2++;
				}
			}

			//SET GAMES
			this.match.score.games[0] = {};
			this.match.score.games[0].game_p1 = $scope.setsp1[0];
			this.match.score.games[0].game_p2 = $scope.setsp2[0];
			this.match.score.games[1] = {};
			this.match.score.games[1].game_p1 = $scope.setsp1[1];
			this.match.score.games[1].game_p2 = $scope.setsp2[1];
			if ($scope.setsp1[2]!=$scope.setsp2[2]) {
				this.match.score.games[2] = {};
				this.match.score.games[2].game_p1 = $scope.setsp1[2];
				this.match.score.games[2].game_p2 = $scope.setsp2[2];
			}

		}

		//CALCULATE POINTS
		//RR - 10/5
		//R32 - 10
		//R16 - 10
		//R8 - 10
		//Q - 20
		//S - 20
		//F - 50/20
		// var player1 = $scope.findPlayerById(this.match.p1_id);
		// var player2 = $scope.findPlayerById(this.match.p2_id);
		var points_p1 = 0;
		var points_p2 = 0;

		if (this.match.score.set_p1!=this.match.score.set_p2) {

			switch(this.match.round){
				case "RR":
					console.log("RR");
					if (this.match.score.set_p1>this.match.score.set_p2){
						points_p1 += 10;
						if(!this.match.score.wo){
							points_p2 += 5;
						}
					} else {
						points_p2 += 10;
						if(!this.match.score.wo){
							points_p1 += 5;
						}
					}
					console.log(points_p1);
					console.log(points_p2);
					break;
				case "R32":
				case "R16":
				case "R8":
					points_p1 += 10;
					points_p2 += 10;
					break;
				case "Q":
				case "S":
					points_p1 += 20;
					points_p2 += 20;
					break;
				case "F":
					points_p1 += 20;
					points_p2 += 20;
					if (this.match.score.set_p1>this.match.score.set_p2){
						points_p1 += 30;
					} else {
						points_p2 += 30;
					}
					break;
			}

			$scope.Player.get({id:this.match.p1_id},function(data){
				var player1 = data;
				player1.points += points_p1;
				$scope.Player.update({ id:player1._id }, player1);
			});
			$scope.Player.get({id:this.match.p2_id},function(data){
				var player2 = data;
				player2.points += points_p2;
				$scope.Player.update({ id:player2._id }, player2);
			});

		}
		
		$scope.Match.save(this.match, function(data){
			//$scope.changeRoute('/#/');
		});
	}

}]);


rankingApp.controller("RankingController",['$scope','$resource', '$location', function($scope, $resource, $location){
	
	//$RESOURCE CONFIGURATION
	$scope.Player = $resource('/api/players/:id', {id:'@_id'}, { 'update': {method:'PUT'} });
	$scope.Tournament = $resource('/api/tournaments/:id', {id:'@_id'}, { 'update': {method:'PUT'} });
	$scope.Match = $resource('/api/matches/:id', {id:'@_id'}, { 'update': {method:'PUT'} });

	//VARIABLES
	$scope.playerList = [];
	$scope.tournList = [];
	$scope.matchList = [];
	$scope.listLoaded = false;
	$scope.playerLoaded = false;
	$scope.selectedPlayer = {_id:0,name:"Selecione um jogador"};
	$scope.playerMatchList = [];

	$scope.tempTournId = "";
	$scope.sameTournament = false;

	$scope.getCounter = function(num) {
	    return new Array(num);   
	}

	//HTTP REQUEST - GET JSON (FROM DROPBOX)
	// $http.get("https://dl.dropboxusercontent.com/u/1113919/tennisranking/data/players.json").success(function(dataPlayer){
	// 	$scope.playerList = dataPlayer;
	// 	$scope.isLoaded = true;
	// 	$http.get("https://dl.dropboxusercontent.com/u/1113919/tennisranking/data/matches.json").success(function(dataMatch){
	// 		$scope.matchList = dataMatch;
	// 		$scope.updateRanking();
	// 	});
	// });

	//HTTP REQUEST - GET PLAYERS FROM API
	// $http.get("http://localhost:3000/api/players").success(function(dataPlayer){
	// 	$scope.playerList = dataPlayer;
	// 	$scope.playersLoaded = true;
	// });

	//GET PLAYER AND TOURNAMENT LIST - USING $RESOURCE
	$scope.Player.query(function(data){
		$scope.playerList = data;
		$scope.Tournament.query(function(data){
			$scope.tournList = data;
			$scope.listLoaded = true;
		});
	});
	
	$scope.objectSize = function(obj) {
	    var size = 0, key;
	    for (key in obj) {
	        if (obj.hasOwnProperty(key)) size++;
	    }
	    return size;
	};

	$scope.changeRoute = function(url, forceReload) {
        $scope = $scope || angular.element(document).scope();
        if(forceReload || $scope.$$phase) { // that's right TWO dollar signs: $$phase
            window.location = url;
        } else {
            $location.path(url);
            $scope.$apply();
        }
    };

	//FILTER MATCHES PER PLAYER
	$scope.filterPlayerMatches = function(playerId){

		$scope.Player.get({id:playerId}, function(data){
			$scope.selectedPlayer = data;

			$scope.playerMatchList = $scope.selectedPlayer.matches;
			
			$scope.tempTournId = "";

			for (var i=0; i < $scope.playerMatchList.length; i++) {
			if ($scope.playerMatchList[i].p1_id == playerId) {
				
				if ($scope.playerMatchList[i].score.set_p1 > $scope.playerMatchList[i].score.set_p2){
					$scope.playerMatchList[i].victory = true;
				} else {
					$scope.playerMatchList[i].victory = false;
				}
				
			}
			if ($scope.playerMatchList[i].p2_id == playerId){
				
				if ($scope.playerMatchList[i].score.set_p2 > $scope.playerMatchList[i].score.set_p1){
					$scope.playerMatchList[i].victory = true;
				} else {
					$scope.playerMatchList[i].victory = false;
				}
				
			}

			$scope.playerLoaded = true;
		}

		});
		
		element_to_scroll_to = document.getElementById('matches');
		element_to_scroll_to.scrollIntoView();
		
	};
	
	//CALCULATE RANKING POINTS
	$scope.calculatePoints = function(player, match){
		
		var points = 0;
		
		if (match.player1 == player._id){
			
			if (match.score1 == match.score2) {
				return 0;
			}	
			else if (match.score1 > match.score2) {
				points += 3;
			} else {
				points += 1;
			}
			points += match.score1;
			
		} else if (match.player2 == player._id) {
			
			if (match.score1 == match.score2) {
				return 0;
			}
			else if (match.score2 > match.score1) {
				points += 3;
			} else {
				points += 1;
			}
			points += match.score2;
			
		}
		
		return points;
	};
	
	//UPDATE RANKING RESULTS
	$scope.updateRanking = function(){
		
		for (var i=0; i < $scope.playerList.length; i++) {
			
			for (var j=0; j < $scope.matchList.length; j++) {
				
				if ($scope.matchList[j].score1 == undefined) {
					continue;
				} 
				
				if ($scope.matchList[j].player1 == $scope.playerList[i]._id 
					|| $scope.matchList[j].player2 == $scope.playerList[i]._id){
				
					$scope.playerList[i].points += $scope.calculatePoints($scope.playerList[i],$scope.matchList[j]);
					$scope.playerList[i].matches.push($scope.matchList[j].id);
				
				}
				
			};
			
		};
		
	};
	
	//GET PLAYER NAMES FOR MATCH VIEW
	$scope.getFullMatch = function(matchId) {
		
		var match = $scope.findMatchById(matchId);
		
		var player1 = $scope.findPlayerById(match.player1);
		match.player1 = player1.name;	
		
		var player2 = $scope.findPlayerById(match.player2);
		match.player2 = player2.name;
		
		return match;
		
	};
	
	//RETURN NUMBER OF MATCHES PLAYED
	$scope.getPlayedMatches = function(playerId){
		
		var cont = 0;
		
		for (var i=0; i < $scope.matchList.length; i++) {
		
			if ($scope.matchList[i].score1 != $scope.matchList[i].score2){
				if ($scope.matchList[i].player1 == playerId || $scope.matchList[i].player2 == playerId) {
					cont = cont + 1;
				}
			}
			
		}
		
		return cont;
		
	};
	
	//FIND MATCH BY ID
	$scope.findMatchById = function(matchId) {
		
		var match;
		
		for (var i=0; i<$scope.matchList.length; i++) {
			if ($scope.matchList[i].id === matchId) {
				match = $scope.matchList[i];
				return angular.copy(match);
			}
		}
		
	};
	
	//FIND PLAYER BY ID
	$scope.findPlayerById = function(playerId) {
		console.log("findPlayerById " + playerId);
		var player;
		
		for (var i=0; i<$scope.playerList.length; i++) {
			if ($scope.playerList[i]._id == playerId) {
				
				player = $scope.playerList[i];
				console.log(player);
				return angular.copy(player);
			}
		}
		
	};

	//GET PLAYER NAME
	$scope.getPlayerName = function(playerId) {
		var playerName = "";
		
		for (var i=0; i<$scope.playerList.length; i++) {
			if ($scope.playerList[i]._id == playerId) {
				
				playerName = $scope.playerList[i].name;
				return playerName;
			}
		}
		
	};

	//GET TOURNAMENT NAME
	$scope.getTournamentName = function(tournId) {
		var tournamentName = "";
		
		for (var i=0; i<$scope.playerList.length; i++) {
			if ($scope.tournList[i]._id == tournId) {
				
				tournamentName = $scope.tournList[i].name;
				return tournamentName;
			}
		}
		
	};

	//GET TOURNAMENT NAME
	$scope.checkTournament = function(match) {
		
		console.log("checkTournament(" + match.tourn_id + ") - tempTournId = " + $scope.tempTournId);

		if($scope.tempTournId == match.tourn_id){
			match.sameTournament = true;
		} else {
			match.sameTournament = false;
		}
		$scope.tempTournId = match.tourn_id;
		
	};
	
}]); 
