# MMM-KitchenTimer
A 3<sup>rd</sup> Party Module for <a href=https://github.com/MichMich/MagicMirror/tree/developMagicMirror>MagicMirror<sup>2</sup></a><br>
A simple Kitchen Timer module based on the Pomodoro Timer script

## Screenshots

![ScreenShot](https://github.com/justjim1220/MMM-KitchenTimer/blob/master/Screenshot%20(31).png)

## Using the module

To use this module, add it to the modules array in the `config/config.js` file:
````javascript
modules: [
	{
            disabled: false,
	    module: "MMM-KitchenTimer",
	    position: "top_center",
	    config: {
	        volume: 1
	    }
	},
]
````
## Install...
```
cd ~/MagicMirror/modules
git clone https://github.com/justjim1220/MMM-KitchenTimer.git
cd MMM-BornBeforeDate
npm install
```

## Configuration options

changes for colors, sizes, and fonts can be made within the css file or your custom.css file

========================================================================================================================================

## Acknowledgements...

@Seann & @sdetweil for giving me hints on tweaks to get it up and running right, and for teaching me how to get away from JQuery!!!

Enjoy!
