rankingApp.controller("TournamentController",['$scope','$timeout','$resource', function($scope, $timeout, $resource){

	$scope.tournamentPlayerList = [];
	$scope.tournamentMatchList = [];
	$scope.selectedTournament = {_id:0,name:"Selecione um torneio"};

	//UPDATE TOURNAMENT
	$scope.updateTournament = function(){
		$scope.filterTournamentMatches($scope.selectedTournament._id);
	}

	//OPEN TOURNAMENT IF RUNNING
	$scope.checkRunning = function(tournament){
		if(tournament.running){
			console.log(tournament.name + " IS RUNNING");
			$scope.filterTournamentMatches(tournament._id);
		}
	}

	//FILTER MATCHES PER TOURNAMENT
	$scope.filterTournamentMatches = function(tournamentId){
		console.log("filterTournamentMatches");
		$scope.tournamentLoaded = false;
		
		$scope.clearLists();

		$scope.Tournament.get({id:tournamentId}, function(data){
			$scope.selectedTournament = data;

			$scope.tournamentMatchList = $scope.selectedTournament.matches;

			$scope.filterTournamentPlayers();

			$scope.updateRanking();

			$scope.tournamentLoaded = true;
		});
		
		// element_to_scroll_to = document.getElementById('tournmatches');
		// element_to_scroll_to.scrollIntoView();
		
	};

	//FILTER PLAYERS PER TOURNAMENT
	$scope.filterTournamentPlayers = function(tournamentId){
		console.log("filterTournamentPlayers");

		for (var i = 0; i<$scope.playerList.length; i++){
			if ($scope.selectedTournament.players.indexOf($scope.playerList[i]._id)!=-1){
				
				//CHECKS IF TOURNAMENT HAVE GROUPS
				if($scope.selectedTournament.groups.length > 0){
					
					//FIND PLAYER GROUP
					for(var j = 0;j<$scope.selectedTournament.groups.length;j++){
						if($scope.selectedTournament.groups[j].players.indexOf($scope.playerList[i]._id)!=-1){
							$scope.playerList[i].group = $scope.selectedTournament.groups[j].groupname;
						}
					}

				} else {
					$scope.playerList[i].group = "";
				}

				$scope.tournamentPlayerList.push($scope.playerList[i]);
			}
		}

	}

	//CLEAR LISTS
	$scope.clearLists = function(){
		console.log("clearLists");

		while ($scope.tournamentPlayerList.length > 0){
			$scope.tournamentPlayerList.pop();
		}

		while ($scope.tournamentMatchList.length > 0){
			$scope.tournamentMatchList.pop();
		}

	}

	//UPDATE RANKING RESULTS
	$scope.updateRanking = function(){
		
		for (var i=0; i < $scope.tournamentPlayerList.length; i++) {
			
			$scope.tournamentPlayerList[i].tournamentpoints = 0;

			for (var j=0; j < $scope.tournamentMatchList.length; j++) {
				
				if ($scope.tournamentMatchList[j].score == undefined) {
					continue;
				} 
				
				if ($scope.tournamentMatchList[j].p1_id == $scope.tournamentPlayerList[i].id 
					|| $scope.tournamentMatchList[j].player2 == $scope.tournamentPlayerList[i].id){
				
					$scope.tournamentPlayerList[i].tournamentpoints += 
						$scope.calculatePoints($scope.tournamentPlayerList[i],$scope.tournamentMatchList[j]);
				
				}
				
			};
			
		};
		
	};

	//CALCULATE TOURNAMENT POINTS
	//
	// VICTORY = 3 + WINNING SETS (ALWAYS 5)
	// LOSE = 1 + WINNING SETS (1 OR 2)
	// LOSE BY WO = 0
	//
	$scope.calculatePoints = function(player, match){
		
		var points = 0;
		
		if (match.round == "RR"){

			if (match.p1_id == player._id){
				
				if (match.score.wo) {
					if (match.score.set_p1 > match.score.set_p2){
						points += 3;
					}
				} 
				else if (match.score.set_p1 == match.score.set_p2) {
					return 0;
				}	
				else if (match.score.set_p1 > match.score.set_p2) {
					points += 3;
				} else {
					points += 1;
				}
				points += match.score.set_p1;
				
			} else if (match.p2_id == player._id) {
				
				if (match.score.wo) {
					if (match.score.set_p2 > match.score.set_p1){
						points += 3;
					}
				} 
				else if (match.score.set_p1 == match.score.set_p2) {
					return 0;
				}
				else if (match.score.set_p2 > match.score.set_p1) {
					points += 3;
				} else {
					points += 1;
				}
				points += match.score.set_p2;
				
			}

		}
		
		return points;
	};
	
	$scope.saveTournament = function(tournament){
		$scope.Tournament.update({ _id:tournament._id },tournament);
		alert("Chaves atualizadas");
	};
	

}]);