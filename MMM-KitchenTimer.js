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

	alarmSound: "TimerAlarm.mp3",

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

	getDom: function () {
		var wrapper = document.createElement("div");

		var timerWrapper = document.createElement("div");
		timerWrapper.classList.add("medium");
		timerWrapper.innerHTML = `<div class="timer">
			<div class="title">Kitchen Timer</div>
			<div class="display" id="display">00:00:00</div>
			<button id="more" class="bt1"><i class="material-icons md-36">add_circle</i></button>
			<button id="less" class="bt1"><i class="material-icons md-36">remove_circle</i></button>
			&nbsp;&nbsp;
			<button id="start" class="bt2"><i class="material-icons">play_arrow</i></button>
			<button id="pause" class="bt2"><i class="material-icons">pause</i></button>
			<button id="reset" class="bt2"><i class="material-icons">loop</i></button>
		</div>`;

		var clock, start, length, end, x, now, remaining, minutes, seconds;
		var pauseTime, pauseLength;
		var checkRunning = 0;

		$(document).ready(function() {
			clock = 0;
			$("#display").html("00:00:00");
		});

		function display() {
			$("#display").empty().html(clock + ":00");
		}

		$("#more").on("click", function() {
			if(checkRunning == 0) {
				clock += 1;
				display();
			}
		});

		$("#less").on("click", function() {
			if(clock > 1 && checkRunning == 0) {
				clock -= 1;
				display();
			}
		});

		function a() {
			x = setInterval(function() {
				now = $.now();
				remaining = end - now;
				minutes = Math.floor((remaining % (1000 * 60 * 60))/(1000 * 60));
				seconds = Math.round((remaining % (1000 * 60))/1000);
				if(seconds == 60) {
					document.getElementById("display").innerHTML = "1:00";
				} else if(seconds<10) {
					document.getElementById("display").innerHTML = minutes + ":0" + seconds;
				} else {
					document.getElementById("display").innerHTML = minutes + ":" + seconds;
				}
				if(remaining < 0) {
					clearInterval(x);
					
					// Start alarm sound
					this.playAlarmSound();
					document.getElementById("display").innerHTML = "DONE!";
				}
			},1000)
		}

		$("#start").on("click", function() {
			if(isNaN(pauseTime) && checkRunning == 0) {
				start = $.now();
				length = clock * 60 * 1000;
				end = start + length;
				a();
				checkRunning = 1;
			} else if(checkRunning == 2) {
				start = $.now();
				end = start + pauseLength;
				a();
				checkRunning = 1;
			}
		});

		$("#pause").on("click", function() {
			if(checkRunning == 1) {
				pauseTime = $.now();
				pauseLength = end - pauseTime;
				clearInterval(x);
				checkRunning = 2;
				this.stopAlarmSound();
			}
		});

		$("#reset").on("click", function() {
			clearInterval(x);
			clock = 0;
			$("#display").html("00:00:00");
			pauseTime = NaN;
			checkRunning = 0;
			this.stopAlarmSound();
		})

		wrapper.appendChild(timerWrapper);
		return wrapper;
	},

	//////////////////////////////////////////////////
	playAlarmSound() {
		const audio = document.createElement("audio");
		let srcAudio = this.config.alarmSound;
		audio.src = srcAudio;
		audio.volume = this.config.volume;
		audio.setAttribute('id', 'MMM-KitchenTimer-Player');
		audio.setAttribute('autoplay', true);
		audio.setAttribute('loop', true);
		wrapper.appendChild(audio);
	}
	//////////////////////////////////////////////////

});
