/** 
In the name of god
**/

var $window = $(window);

function Yalda() {
	var debug = true;
	var all_participants = [];
	var participants = all_participants.slice(0); // Copy values
	var participants_ordered = participants.slice(0); // Copy values
	var turn = 0;
	
	this.leftPeople = function () {
		return participants;
	}
	
	this.remove = function (name) {
		var index = participants.indexOf(name);
		participants.splice(index, 1);
		participants_ordered.splice(participants_ordered.indexOf(name), 1);
		
		if (debug)
			this.print();
	};
	
	this.add = function (name) {
		all_participants.push(name);
		participants.push(name);
		participants_ordered.push(name);
		if (debug)
			this.print();
	};
	
	this.shuffle = function() {
		for(var i = participants.length;i;) {
			var j = Math.floor(Math.random() * i);
			--i;
			var x = participants[i];
			participants[i] = participants[j];
			participants[j] = x;
		}
		if (debug)
			this.print();
	}
	
	this.getRandomName = function() {
		return participants[Math.floor(Math.random() * participants.length)];
	}
	
	this.nextLevel = function(correct) {
		if (!correct) {
			this.remove(this.getCurrentName());
		} else {
			++turn;
		}
		if (turn >= participants.length) {
			turn = 0;
			this.nextStage();
		}
		
		return this.getCurrentName();
	}
	
	this.getCurrentName = function () {
		return participants[turn];
	}
	
	this.nextStage = function() {
		console.log('Next stage');
		this.shuffle();
		$window.trigger('yalda.nextStage');
	}
	
	this.print = function () {
		console.log(participants);
	};
}

function YaldaHelper(y, _duration) {
	var yalda = y;
	var duration = _duration;
	
	this.animateRandomName = function () {
		var ds = [100, 50, 25, 10, 5];
		var dd = [];
		for (var i=0; i<ds.length; ++i) {
			var n = ds[i];
			var timeSlice = duration/ds.length;
			dd.push(timeSlice/n);
		}
		
		var times = 0;
		makeTimeout(0);
		var name = '';
		
		$window.trigger('yalda.startRand');
		
		function makeTimeout(i) {
			setTimeout(function() {
				do {
					newName = yalda.getRandomName();
				} while (name == newName);
				name = newName;
				$window.trigger('yalda.setName', [newName]);
				++times;
				if (times >= ds[i]) {
					times = 0;
					if (i < ds.length-1) {
						makeTimeout(i+1); 
					} else {
						$window.trigger('yalda.setName', [yalda.getCurrentName()]);
						$window.trigger('yalda.endRand');
					}
				} else {
					makeTimeout(i);
				}
			}, dd[i]);
		}
	}
	
	this.answered = function(correct) {
		yalda.nextLevel(correct);
		if (yalda.leftPeople().length == 1) {
			console.log('We have winner');
			$window.trigger('yalda.winner');
		} else {
			this.animateRandomName();
		}
	}
}