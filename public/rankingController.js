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
	$scope.tournamentLoaded = false;
	$scope.selectedPlayer = {_id:0,name:"Selecione um jogador"};
	
	$scope.playerMatchList = [];
	$scope.tournamentMatchList = [];

	$scope.tempTournId = "";
	$scope.sameTournament = false;

	$scope.Player.query(function(data){
		$scope.playerList = data;
		$scope.Tournament.query(function(data){
			$scope.tournList = data;
			$scope.listLoaded = true;
		});
	});
	
	$scope.getCounter = function(num) {
	    return new Array(num);   
	}

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

    $scope.updatePlayerList = function(callback){
    	$scope.Player.query(function(data){
			$scope.playerList = data;
			$scope.Tournament.query(function(data){
				$scope.tournList = data;
				callback();
			});
		});
    };

    $scope.getMatchCount = function(playerId){
    	return 1;
  //   	$scope.Player.get({id:playerId}, function(data){
		// 	var player = data;
		// 	return 1;
		// });
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

				
			}

		$scope.playerLoaded = true;

		});
		
		element_to_scroll_to = document.getElementById('matches');
		element_to_scroll_to.scrollIntoView();
		
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