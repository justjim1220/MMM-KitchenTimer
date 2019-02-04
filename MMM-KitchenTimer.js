/* MagicMIrror Module - MMM-KitchenTimer
 *
 * This is a 3rd Party Module for the [MagicMirror² By Michael Teeuw http://michaelteeuw.nl]
 * (https://github.com/MichMich/MagicMirror/).
 *
 * Just a simple Kitchen Timer module based off of the Pomodoro Clock script.
 *
 * Currently uses jquery, would like to convert to moment in the future.
 * If anyone has any ideas how to do that easily, I would appreciate
 * the input!
 *
 * NOT tested with Raspberry Pi or Linux-Based systems.
 * It DOES work with Windows 10!!!
 *
 * version: 1.0.0
 *
 * Module created by justjim1220 aka Jim Hallock (justjim1220@gmail.com)
 *
 * Licensed with a crapload of good ole' Southern Sweet Tea
 * and a lot of Cheyenne Extreme Menthol cigars!!!
 */

Module.register("MMM-KitchenTimer", {

	sound: "TimerAlarm.mp3",

	requiresVersion: "2.1.0",


	// Define required scripts.
	getScripts: function() {
		return ["https://code.jquery.com/jquery-3.3.1.js"];
	},

	// Define styles.
	getStyles: function() {
		return ["MMM-KitchenTimer.css", "font-awesome.css"];
	},

	// Define start sequence.
	start: function() {
		Log.info("Starting module: " + this.name);
	},

	getDom: function() {
		var wrapper = document.createElement("div");

		var timerWrapper = document.createElement("div");
		timerWrapper.className = "timer";

		var title = document.createElement("div");
		title.className = "title";
		title.innerHTML = "Kitchen Timer";
		wrapper.appendChild(title);

		var clock, start, length, end, x, now, remaining, minutes, seconds;
		var pauseTime, pauseLength;
		var checkRunning = 0;

		$(document).ready(function() {
			clock = 0;
			$("#display").html("00:00:00");
		});

		function display() {
			$("#display").empty().html(clock + ":00");
		};

		$("#more").on("click", function() {
			if (checkRunning == 0) {
				clock += 1;
				display();
			};
		});

		$("#less").on("click", function() {
			if (clock > 1 && checkRunning == 0) {
				clock -= 1;
				display();
			};
		});

		var sound = document.createElement("audio");
		let srcSound = this.config.sound;
		sound.src = srcSound;
		sound.id = "MMM-KitchenTimer-Player";
		sound.setAttribute("autoplay", true);
		wrapper.appendChild(sound);

		function a() {
			x = setInterval(function() {
				now = $.now();
				remaining = end - now;
				minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
				seconds = Math.round((remaining % (1000 * 60)) / 1000);
				if (seconds == 60) {
					document.getElementById("display").innerHTML = "1:00";
				} else if (seconds < 10) {
					document.getElementById("display").innerHTML = minutes + ":0" + seconds;
				} else {
					document.getElementById("display").innerHTML = minutes + ":" + seconds;
				}
				if (remaining < 0) {
					document.querySelector(".js-timer").play();
					clearInterval(x);
					document.getElementById("display").innerHTML = "DONE!";
				};

			}, 1000)
		};

		$("#start").on("click", function () {
			if (isNaN(pauseTime) && checkRunning == 0) {
				start = $.now();
				length = clock * 60 * 1000;
				end = start + length;
				a();
				checkRunning = 1;
			} else if (checkRunning == 2) {
				start = $.now();
				end = start + pauseLength;
				a();
				checkRunning = 1;
			};
		});

		$("#pause").on("click", function () {
			if (checkRunning == 1) {
				document.querySelector(".js-timer").pause();
				pauseTime = $.now();
				pauseLength = end - pauseTime;
				clearInterval(x);
				checkRunning = 2;
			};
		});

		$("#reset").on("click", function () {
			document.querySelector(".js-timer").pause();
			clearInterval(x);
			clock = 0;
			display();
			pauseTime = NaN;
			checkRunning = 0
		});

		wrapper.appendChild(timerWrapper);
		return wrapper;
	},
});