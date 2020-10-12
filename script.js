var DDRUI = function () {
	var notes = [];
	var gameStarted = false;
	var Score = 0;

	// For random arrows
	var randNum = 0;

	// Frame increasing
	var frame = 0;

	var song = new Audio("./Bad Apple!!.wav");
	// Determines the speed of notes
	var arrowSpawnRate = 25;

	var self = this;
	this.game = undefined;
	this.running = false;
	this.initialize = function () {
		$('#GameStopped').show();
		$('#GameRunning').hide();
		$('#DanceFloor').hide();

		$('#StartBtn').on('click', function () {
			$('#GameStopped').hide();
			$('#GameRunning').show();
			$('#DanceFloor').show();
			self.running = true;
			gameStarted = true;

			if (self.running) {
				song.play();
			}
		});

		// code below controls stopping the game with space bar
		$(document).keydown(function (event) {
			if (event.keyCode == 32) {
				$('#GameStopped').show();
				$('#GameRunning').hide();
				$('#DanceFloor').hide();
				self.running = false;
				if (self.running == false) {
					song.pause();
				}
			}
		});

		$(document).keydown(function (event) {
			if (event.keyCode == 82) {
				location.reload();
			}
		});

		// $('#StopBtn').on('click', function () {
		// 	$('#GameStopped').show();
		// 	$('#GameRunning').hide();
		// 	$('#DanceFloor').hide();
		// 	self.running = false;
		// });
	};

	function Arrow(direction) {
		// CSS spacings for the arrows //
		var xPos = null;

		switch (direction) {
			case "left":
				xPos = "123px";
				break;
			case "up":
				xPos = "499px";
				break;
			case "down":
				xPos = "306px";
				break;
			case "right":
				xPos = "672px";
				break;
		}

		this.direction = direction;
		this.image = $("<img src='./images/" + direction + ".gif'/>");
		this.image.css({
			position: "absolute",
			top: "0px",
			left: xPos
		});
		$('#DanceFloor').append(this.image);
	} // ends CLASS Arrow


	// To enable animating the arrows
	Arrow.prototype.step = function () {
		// Controls the speed of the arrows
		this.image.css("top", "+=4px");
	};

	// Deletes arrows when they get to bottom of page
	Arrow.prototype.destroy = function () {
		// removes the image of the DOM
		this.image.remove();
		// Removes the note/arrow from memory/array
		notes.splice(0, 1);
	};

	// Explodes arrow when hit
	Arrow.prototype.explode = function () {
		this.image.remove();
	};

	// Random generator for arrows
	function randomGen() {
		// Randomizes between 1 and 4
		randNum = Math.floor(Math.random() * 4) + 1;
		if (randNum === 1) {
			notes.push(new Arrow("left"));
		}
		if (randNum === 2) {
			notes.push(new Arrow("right"));
		}
		if (randNum === 3) {
			notes.push(new Arrow("up"));
		}
		if (randNum === 4) {
			notes.push(new Arrow("down"));
		}
	} // ends randomGen()

	// Render function //
	function render() {
		if (frame++ % arrowSpawnRate === 0) {
			randomGen();
		};

		// Animate arrows showering down //
		for (var i = notes.length - 1; i >= 0; i--) {
			notes[i].step();
			// Check for cleanup
			if (notes[i].image.position().top > 445) {
				notes[i].destroy();
			}
		}
	} // ends render()

	// jQuery to animate arrows //
	$(document).ready(function () {
		// shim layer with setTimeout fallback
		window.requestAnimFrame = (function () {
			return window.requestAnimationFrame ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame ||
				function (callback) {
					window.setTimeout(callback, 40 / 75);
				};
		})();

		// Infinte loop for game play
		(function animloop() {
			if (gameStarted) {
				requestAnimFrame(animloop);
				render();
			} else {
				window.setTimeout(animloop, 1000); // check the state per second
			}
		})(); // ends (function animloop() )
	}); // ends $(doc).ready


	// Listening for when the key is pressed
	$(document).keydown(function (event) {
		for (var i = 0; i < notes.length; i++) {
			if (event.keyCode == 37 && notes[i].direction == "left") {
				if (notes[i].image.position().top > 385 && notes[i].image.position().top < 500) {
					console.log("LEFT! " + notes[i].explode());
					Score++;
					score();
				}
			}
			if (event.keyCode == 38 && notes[i].direction == "up") {
				if (notes[i].image.position().top > 385 && notes[i].image.position().top < 500) {
					console.log("UP! " + notes[i].explode());
					Score++;
					score();
				}
			}
			if (event.keyCode == 40 && notes[i].direction == "down") {
				if (notes[i].image.position().top > 385 && notes[i].image.position().top < 500) {
					console.log("DOWN! " + notes[i].explode());
					Score++;
					score();
				}
			}
			if (event.keyCode == 39 && notes[i].direction == "right") {
				if (notes[i].image.position().top > 385 && notes[i].image.position().top < 500) {
					console.log("RIGHT! " + notes[i].explode());
					Score++;
					score();
				}
			}
		} // ends loop
	}); // ends $(doc).keyup

	// function that will display the score up in the top right of the page
	function score() {
		document.querySelector("#dancePoints").textContent = "Points Earned: " + Score;
	}

	this.initialize();
}