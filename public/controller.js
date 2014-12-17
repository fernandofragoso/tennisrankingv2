var rankingApp = angular.module("RankingApp", ['ngResource']);

rankingApp.controller("RankingController", function($scope, $resource){
	
	//$RESOURCE CONFIGURATION
	var Player = $resource('https://tenisranking.herokuapp.com/api/players/:id', {id:'@_id'});

	var Tournament = $resource('https://tenisranking.herokuapp.com/api/tournaments/:id', {id:'@_id'});

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
	Player.query(function(data){
		$scope.playerList = data;
		Tournament.query(function(data){
			$scope.tournList = data;
			$scope.listLoaded = true;
		});
	});
	
	//FILTER MATCHES PER PLAYER
	$scope.filterPlayerMatches = function(playerId){

		Player.get({id:playerId}, function(data){
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
	
}); 
