rankingApp.directive('confirmationNeeded', function () {
  return {
    priority: 1,
    terminal: true,
    link: function (scope, element, attr) {
      var msg = attr.confirmationNeeded || "Are you sure?";
      var clickAction = attr.ngClick;
      element.bind('click',function () {
        if ( window.confirm(msg) ) {
          scope.$eval(clickAction)
        }
      });
    }
  };
});

rankingApp.controller("RankingController",['$scope','$timeout','$resource', '$location', 'Session', function($scope, $timeout, $resource, $location, Session){

	//$RESOURCE CONFIGURATION
	$scope.Player = $resource('http://tenisranking.herokuapp.com/api/players/:id', {id:'@_id'}, { 'update': {method:'PUT'} });
	$scope.Tournament = $resource('http://tenisranking.herokuapp.com/api/tournaments/:id', {id:'@_id'}, { 'update': {method:'PUT'} });
	$scope.Match = $resource('http://tenisranking.herokuapp.com/api/matches/:id', {id:'@_id'}, { 'update': {method:'PUT'} });
	$scope.User = $resource('http://tenisranking.herokuapp.com/adm/login',
		null,
		{ 'login': {
			method: 'POST',
			params: { login: '@login', password: '@password'},
			isArray: false
		}
	});

	//SESSION
	$scope.session = Session;

	//VARIABLES
	$scope.sessionUser = null;

	$scope.playerList = [];
	$scope.tournList = [];
	$scope.matchList = [];
	$scope.listLoaded = false;
	$scope.playerLoaded = false;
	$scope.tournamentLoaded = false;
	$scope.selectedPlayer = {_id:0,name:"Selecione um jogador"};

	$scope.selectedMatch = null;

	$scope.playerMatchList = [];
	$scope.tournamentMatchList = [];

	$scope.tempTournId = "";
	$scope.sameTournament = false;

	$scope.Player.query(function(data){
		$scope.playerList = data;
		$scope.Tournament.query(function(data){
			$scope.tournList = data;
			$scope.listLoaded = true;

			for (var i = 0;i<$scope.tournList.length;i++){
				if ($scope.tournList[i].running) {
					var id = $scope.tournList[i]._id;
					console.log("running: " + $scope.tournList[i]._id);
				}
			}
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

    $scope.setSelectedMatch = function(match){

    	$scope.selectedMatch = match;

    };

    $scope.removeMatch = function(match){
    	console.log("Remove Match");

    	var points_p1 = 0;
    	var points_p2 = 0;

      //CALCULATE POINTS
  		//
  		//RR - 10/5
  		//R32 - 20
  		//R16 - 20
  		//Q - 20
  		//S - 40
  		//F - 120/60
  		//
  		//BRACKET_B - 25%

      //BRACKET B GIVES 25% OF POINTS
  		var multiplier = 1;
  		if (match.bracket_b) {
  			multiplier = 0.25;
  		}

    	//IF THE MATCH IS ALREADY FINISHED, REMOVE POINTS
    	if(match.score.set_p1==0 && match.score.set_p2==0){
    		$scope.Match.remove({id:match._id});
    		$scope.updatePlayerList(function(){});
    	} else {
	    	console.log("REMOVING POINTS...");
	    	if(match.score.set_p1 > match.score.set_p2) {

	    		switch(match.round){
	    			case "RR":
	    				//P1 WINNER
	    				//REMOVE 10 POINTS
	    				console.log("REMOVE 10 POINTS FROM " + $scope.getPlayerName(match.p1_id));
			    		points_p1 = -10;
			    		if(!match.score.wo){
			    			//P2 LOSER
			    			//IF NOT WO REMOVE 5 POINTS
			    			console.log("REMOVE 5 POINTS FROM " + $scope.getPlayerName(match.p2_id));
			    			points_p2 = -5;
			    		}
	    				break;
	    			case "R32":
					  case "R16":
            case "Q":
  						points_p1 = -20;
  						points_p2 = -20;
  						break;
  					case "S":
  						points_p1 = -40;
  						points_p2 = -40;
  						break;
  					case "F":
  						points_p1 = -120;
  						points_p2 = -60;
  						break;
  	    		}

	    	} else {

	    		switch(match.round){
	    			case "RR":
	    				//P2 WINNER
	    				//REMOVE 10 POINTS
	    				console.log("REMOVE 10 POINTS FROM " + $scope.getPlayerName(match.p2_id));
			    		points_p2 = -10;
			    		if(!match.score.wo){
			    			//P1 LOSER
			    			//IF NOT WO REMOVE 5 POINTS
			    			console.log("REMOVE 5 POINTS FROM " + $scope.getPlayerName(match.p1_id));
			    			points_p1 = -5;
			    		}
	    				break;
	    			case "R32":
  					case "R16":
  					case "Q":
  						points_p1 = -20;
  						points_p2 = -20;
  						break;
  					case "S":
  						points_p1 = -40;
  						points_p2 = -40;
  						break;
  					case "F":
  						points_p1 = -60;
  						points_p2 = -120;
  						break;
  	    		}

	    	}

	    	$scope.updatePlayerList(function(){

				var player1 = $scope.findPlayerById(match.p1_id);
				var player2 = $scope.findPlayerById(match.p2_id);

				player1.points += points_p1 * multiplier;
				$scope.Player.update({ id:player1._id }, player1);

				player2.points += points_p2 * multiplier;
				$scope.Player.update({ id:player2._id }, player2);

			});

	    	$scope.Match.remove({id:match._id});
	    }

    };

	//FILTER MATCHES PER PLAYER
	$scope.filterPlayerMatches = function(playerId){

		$scope.playerLoaded = false;

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

			element_to_scroll_to = document.getElementById('matches');
			element_to_scroll_to.scrollIntoView();

		});



	};

	//GET PLAYER NAMES FOR MATCH VIEW
	$scope.getFullMatch = function(matchId) {

		var match = $scope.findMatchById(matchId);

		console.log(JSON.stringify(match));

		// var player1 = $scope.findPlayerById(match.p1_id);
		// match.player1 = player1.name;

		// var player2 = $scope.findPlayerById(match.p2_id);
		// match.player2 = player2.name;

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
		console.log("TAMANHO: " + $scope.matchList.length);
		for (var i=0; i<$scope.matchList.length; i++) {
			if ($scope.matchList[i]._id === matchId) {
				console.log("SIM");
				match = $scope.matchList[i];
				return angular.copy(match);
			} else {
				console.log("NAO");
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

		if (playerId == "" || playerId == null)
			return "BYE"

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

	// $scope.tournamentPlayerList = [];
	// $scope.tournamentMatchList = [];
	// $scope.selectedTournament = {_id:0,name:"Selecione um torneio"};

	// //FILTER MATCHES PER TOURNAMENT
	// $scope.filterTournamentMatches = function(tournamentId){
	// 	console.log("filterTournamentMatches");

	// 	$scope.clearLists();

	// 	$scope.Tournament.get({id:tournamentId}, function(data){
	// 		$scope.selectedTournament = data;

	// 		$scope.tournamentMatchList = $scope.selectedTournament.matches;

	// 		$scope.filterTournamentPlayers();

	// 		$scope.updateRanking();

	// 		$scope.tournamentLoaded = true;

	// 		element_to_scroll_to = document.getElementById('tournmatches');
	// 		element_to_scroll_to.scrollIntoView();
	// 	});



	// };

	// //FILTER PLAYERS PER TOURNAMENT
	// $scope.filterTournamentPlayers = function(tournamentId){
	// 	console.log("filterTournamentPlayers");

	// 	for (var i = 0; i<$scope.playerList.length; i++){
	// 		if ($scope.selectedTournament.players.indexOf($scope.playerList[i]._id)!=-1){
	// 			$scope.tournamentPlayerList.push($scope.playerList[i]);
	// 		}
	// 	}
	// 	console.log("$scope.tournamentPlayerList.length: " + $scope.tournamentPlayerList.length);

	// }

	// //CLEAR LISTS
	// $scope.clearLists = function(){
	// 	console.log("clearLists");

	// 	while ($scope.tournamentPlayerList.length > 0){
	// 		$scope.tournamentPlayerList.pop();
	// 	}

	// 	while ($scope.tournamentMatchList.length > 0){
	// 		$scope.tournamentMatchList.pop();
	// 	}

	// }

	// //UPDATE RANKING RESULTS
	// $scope.updateRanking = function(){

	// 	for (var i=0; i < $scope.tournamentPlayerList.length; i++) {

	// 		$scope.tournamentPlayerList[i].tournamentpoints = 0;

	// 		for (var j=0; j < $scope.tournamentMatchList.length; j++) {

	// 			if ($scope.tournamentMatchList[j].score == undefined) {
	// 				continue;
	// 			}

	// 			if ($scope.tournamentMatchList[j].p1_id == $scope.tournamentPlayerList[i].id
	// 				|| $scope.tournamentMatchList[j].player2 == $scope.tournamentPlayerList[i].id){

	// 				$scope.tournamentPlayerList[i].tournamentpoints += $scope.calculatePoints($scope.tournamentPlayerList[i],$scope.tournamentMatchList[j]);


	// 				// $scope.tournamentPlayerList[i].matches.push($scope.tournamentMatchList[j].id);

	// 			}

	// 		};

	// 	};

	// };

	// //CALCULATE TOURNAMENT POINTS
	// //
	// // VICTORY = 3 + WINNING SETS (ALWAYS 5)
	// // LOSE = 1 + WINNING SETS (1 OR 2)
	// // LOSE BY WO = 0
	// //
	// $scope.calculatePoints = function(player, match){

	// 	var points = 0;

	// 	if (match.round == "RR"){

	// 		if (match.p1_id == player._id){

	// 			if (match.score.wo) {
	// 				if (match.score.set_p1 > match.score.set_p2){
	// 					points += 3;
	// 				}
	// 			}
	// 			else if (match.score.set_p1 == match.score.set_p2) {
	// 				return 0;
	// 			}
	// 			else if (match.score.set_p1 > match.score.set_p2) {
	// 				points += 3;
	// 			} else {
	// 				points += 1;
	// 			}
	// 			points += match.score.set_p1;

	// 		} else if (match.p2_id == player._id) {

	// 			if (match.score.wo) {
	// 				if (match.score.set_p2 > match.score.set_p1){
	// 					points += 3;
	// 				}
	// 			}
	// 			else if (match.score.set_p1 == match.score.set_p2) {
	// 				return 0;
	// 			}
	// 			else if (match.score.set_p2 > match.score.set_p1) {
	// 				points += 3;
	// 			} else {
	// 				points += 1;
	// 			}
	// 			points += match.score.set_p2;

	// 		}

	// 	}

	// 	return points;
	// };

}]);
