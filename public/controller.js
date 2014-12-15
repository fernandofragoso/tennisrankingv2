var rankingApp = angular.module("RankingApp", []);

rankingApp.controller("RankingController", function($scope, $http){
	
	$scope.playerList = [];
	$scope.matchList = [];
	$scope.isLoaded = false;
	
	//HTTP REQUEST - GET JSON
	// $http.get("data/players.json").success(function(dataPlayer){
		// $scope.playerList = dataPlayer;
		// $http.get("data/matches.json").success(function(dataMatch){
			// $scope.matchList = dataMatch;
			// $scope.updateRanking();
		// });
	// });

	//HTTP REQUEST - GET JSON (FROM DROPBOX)
	// $http.get("https://dl.dropboxusercontent.com/u/1113919/tennisranking/data/players.json").success(function(dataPlayer){
	// 	$scope.playerList = dataPlayer;
	// 	$scope.isLoaded = true;
	// 	$http.get("https://dl.dropboxusercontent.com/u/1113919/tennisranking/data/matches.json").success(function(dataMatch){
	// 		$scope.matchList = dataMatch;
	// 		$scope.updateRanking();
	// 	});
	// });

	//HTTP REQUEST - GET JSON (FROM DROPBOX)
	$http.get("http://localhost:3000/api/players").success(function(dataPlayer){
		$scope.playerList = dataPlayer;
		$scope.isLoaded = true;
		$http.get("https://dl.dropboxusercontent.com/u/1113919/tennisranking/data/matches.json").success(function(dataMatch){
			$scope.matchList = dataMatch;
			$scope.updateRanking();
		});
	});

	$scope.selectedPlayer = {__id:0,name:"Selecione um jogador"};
	$scope.playerMatchList = [];
	
	//FILTER MATCHES PER PLAYER
	$scope.filterPlayerMatches = function(playerId){
		
		$scope.selectedPlayer = $scope.findPlayerById(playerId);
		$scope.playerMatchList = [];
		
		for (var i=0; i < $scope.matchList.length; i++) {
			if ($scope.matchList[i].player1 == playerId) {
				
				if ($scope.matchList[i].score1 > $scope.matchList[i].score2){
					$scope.matchList[i].victory = true;
				} else {
					$scope.matchList[i].victory = false;
				}
				$scope.playerMatchList.push($scope.matchList[i]);
				
			}
			if ($scope.matchList[i].player2 == playerId){
				
				if ($scope.matchList[i].score2 > $scope.matchList[i].score1){
					$scope.matchList[i].victory = true;
				} else {
					$scope.matchList[i].victory = false;
				}
				$scope.playerMatchList.push($scope.matchList[i]);
				
			}
		}
		
		element_to_scroll_to = document.getElementById('matches');
		element_to_scroll_to.scrollIntoView();
		
	};
	
	//CALCULATE RANKING POINTS
	$scope.calculatePoints = function(player, match){
		
		var points = 0;
		
		if (match.player1 == player.__id){
			
			if (match.score1 == match.score2) {
				return 0;
			}	
			else if (match.score1 > match.score2) {
				points += 3;
			} else {
				points += 1;
			}
			points += match.score1;
			
		} else if (match.player2 == player.__id) {
			
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
				
				if ($scope.matchList[j].player1 == $scope.playerList[i].__id 
					|| $scope.matchList[j].player2 == $scope.playerList[i].__id){
				
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
		
		var player;
		
		for (var i=0; i<$scope.playerList.length; i++) {
			if ($scope.playerList[i].__id === playerId) {
				player = $scope.playerList[i];
				return angular.copy(player);
			}
		}
		
	};
	
	//NEXT PLAYER
	$scope.nextPlayer = function(){
		
		var id = $scope.selectedPlayer.__id;
		
		if (id+1 > $scope.playerList.length) {
			$scope.filterPlayerMatches(1);
		} else {
			$scope.filterPlayerMatches(id+1);
		}
		
	};
	
	//PREVIOUS PLAYER
	$scope.previousPlayer = function(){
		
		var id = $scope.selectedPlayer.__id;
		if (id-1 < 1) {
			$scope.filterPlayerMatches($scope.playerList.length);
		} else {
			$scope.filterPlayerMatches(id-1);			
		}
		
	};
	
}); 
