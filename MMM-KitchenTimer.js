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

var KitchenTimer;
var KTclock, KTstart, KTlength, KTend, KTx, KTnow, KTremaining, KTminutes, KTseconds;
var KTpauseTime, KTpauseLength, KTalarmExists;
var KTcheckRunning = 0;
Module.register("MMM-KitchenTimer", {

	defaults:{
		volume: 1,
		alarmSound: "modules/MMM-KitchenTimer/TimerAlarm.mp3",
	},

	requiresVersion: "2.1.0",

	// Define styles.
	getStyles: function() {
		return ["MMM-KitchenTimer.css", "font-awesome.css"];
	},

	// Define start sequence.
	start: function() {
    KitchenTimer = this;
		Log.info("Starting module: " + this.name);
		KTclock = 0;

	},
  getDom: function(){
		//	Create Elements.
		var wrapper = document.createElement("div");
		var timer = document.createElement("div");
		var title = document.createElement("div");
		var display = document.createElement("div");
		var more = document.createElement("button");
		var less = document.createElement("button");
		var start = document.createElement("button");
		var pause = document.createElement("button");
		var reset = document.createElement("button");
		var add = document.createElement("i");
		var remove = document.createElement("i");
		var startt = document.createElement("i");
		var pausee = document.createElement("i");
		var resett = document.createElement("i");

		//	Set Classes.
		wrapper.className = "medium";
		title.className = "title";
		display.className = "display";
		more.className = less.className = "bt1";
		start.className = pause.className = reset.className = "bt2";
		add.className = remove.className = "material-icons md-36";
		startt.className = pausee.className = resett.className = "material-icons";

		//	Set ID's
		wrapper.id = "KTWrapper";
		display.id = "display";
		more.id = "more";
		less.id = "less";
		start.id = "start";
		pause.id = "pause";
		reset.id = "reset";

		//	Set innerHTML.
		title.innerHTML = "Kitchen Timer";
		display.innerHTML = "00:00:00";
		add.innerHTML = "add_circle";
		remove.innerHTML = "remove_circle";
		startt.innerHTML = "play_arrow";
		pausee.innerHTML = "pause";
		resett.innerHTML = "loop";

		//	Add Event Listeners.

		more.addEventListener("click", KitchenTimer.KTMore);
		less.addEventListener("click", KitchenTimer.KTLess);

		start.addEventListener("click", KitchenTimer.KTStart);
		pause.addEventListener("click", KitchenTimer.KTPause);
		reset.addEventListener("click", KitchenTimer.KTReset);

		//	Append Children.
		more.appendChild(add);
		less.appendChild(remove);
		start.appendChild(startt);
		pause.appendChild(pausee);
		reset.appendChild(resett);
		timer.appendChild(more);
		timer.appendChild(less);
		timer.appendChild(start);
		timer.appendChild(pause);
		timer.appendChild(reset);
		wrapper.appendChild(title);
		wrapper.appendChild(display);
		wrapper.appendChild(timer);
		return wrapper;
  },
	KTMore: function(){
		if(!KTcheckRunning){
			KTclock++;
			KitchenTimer.display();
		}
	},
	KTLess: function(){
		if(KTclock >= 1 && !KTcheckRunning){
			KTclock--;
			KitchenTimer.display();
		}
	},
	KTStart: function(){
		KTstart = Date.now();
		if(isNaN(KTpauseTime) && !KTcheckRunning){
			KTlength = KTclock * 60 * 1000;
			KTend = KTstart + KTlength;
		} else if(KTcheckRunning == 2){
			KTend = KTstart * KTpauseLength;
		}
		KitchenTimer.count();
		KTcheckRunning = 1;
	},
	KTPause: function(){
		if(KTcheckRunning == 1){
			KTpauseTime = Date.now();
			KTpauseLength = KTend - KTpauseTime;
			clearInterval(KTx);
			KTcheckRunning = 2;
			KitchenTimer.stopAlarmSound();
		}
	},
	KTReset: function(){
		clearInterval(KTx);
		KTclock = 0;
		document.getElementById('display').innerHTML = "00:00:00";
		KTpauseTime = NaN;
		KTcheckRunning = 0;
		KitchenTimer.stopAlarmSound();
	},
	count: function(){
		KTx = setInterval(function(){
			KTnow = Date.now();
			KTremaining = KTend - KTnow;
			KTminutes = Math.floor((KTremaining % (1000 * 60 * 60))/(1000 * 60));
			KTseconds = Math.round((KTremaining % (1000 * 60))/1000);
			if(KTseconds == 60)
				document.getElementById("display").innerHTML = "1:00";
			else if(KTseconds < 10)
				document.getElementById("display").innerHTML = KTminutes + ":0" + KTseconds;
			else
				document.getElementById("display").innerHTML = KTminutes + ":" + KTseconds;
			if(KTremaining <= 0){
				clearInterval(KTx);
				KitchenTimer.playAlarmSound();
				document.getElementById("display").innerHTML = "DONE!";
			}
		}, 1000);
	},
	display: function(){
		document.getElementById("display").innerHTML = KTclock + ":00";
	},
	playAlarmSound: function() {
		var wrapper = document.getElementById('KTWrapper');
		const audio = document.createElement("audio");
		let srcAudio = KitchenTimer.config.alarmSound;
		KTalarmExists = true;
		audio.src = srcAudio;
		audio.volume = KitchenTimer.config.volume;
		audio.setAttribute('id', 'MMM-KitchenTimer-Player');
		audio.setAttribute('autoplay', true);
		audio.setAttribute('loop', true);
		wrapper.appendChild(audio);
	},
	stopAlarmSound: function(){
		if(KTalarmExists){
			document.getElementById('MMM-KitchenTimer-Player').remove();
			KTalarmExists = false;
		}
	}
});
