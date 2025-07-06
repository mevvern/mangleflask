"use strict"

document.getElementById("flaskTable").style.transform = `scale(${window.innerWidth / 768})`

const flaskElements = [document.getElementById("flask_0"), document.getElementById("flask_1"), document.getElementById("flask_2"), document.getElementById("flask_3")];
const flaskPolygons = [document.getElementById("flask_0_polygon"), document.getElementById("flask_1_polygon"), document.getElementById("flask_2_polygon"), document.getElementById("flask_3_polygon")];

const flasks = [0, 0, 0, 0]; //flasks all start at 0
const correctSequence = [3, 1, 0, 2];

let maxSteps = 15;
let animationRate = 100;
let playAudio = true;

let currentSolveInterval = null;

//eventListeners

window.addEventListener("resize", () => {
	document.getElementById("flaskTable").style.transform = `scale(${window.innerWidth / 768})`
})

for (let polygon of flaskPolygons) {
	polygon.addEventListener("click", (event) => {
		const index = parseInt(event.target.getAttribute("flask-index"));

		handleFlaskClickEvent(index);
	})
}

document.getElementById("autosolve").addEventListener("click", (event) => {
	animationRate = parseInt(document.getElementById("solveInterval").value);
	if (currentSolveInterval === null) {
		animatedBruteforce();
		event.target.innerHTML = "Stop Solve";
	} else {
		stopCurrentSolve();
		event.target.innerHTML = "Solve Automatically"
	}
})

document.getElementById("hint").addEventListener("click", () => {
	alert("3 1 0 2");
})

document.getElementById("reset").addEventListener("click", () => {
	resetFlasks();
})

document.getElementById("audioEnable").addEventListener("click", (event) => {
	if (playAudio) {
		playAudio = false;
		event.target.innerHTML = "Enable sound: false";
	} else {
		playAudio = true;
		event.target.innerHTML = "Enable sound: true";
	}
})

//user interaction ----------------------------------------------------

function handleFlaskClickEvent(flaskIndex) {
	clickFlask(flaskIndex);
	updateFlasks();
	document.getElementById("winner").removeAttribute("faded-in");
	if (checkSequence()) {
		playSound("win.wav");
		document.getElementById("winner").setAttribute("faded-in", "");
	}
}

function updateFlasks() {
	for (let [index, flask] of flaskElements.entries()) {
		const flaskValue = flasks[index];
		flask.setAttribute("src", `asset/${flaskValue}_${index}.png`);
	}
}

//derived functions ---------------------------------------------------

function animatedBruteforce() {  //finds a solution over time
	resetFlasks();

	let steps = [];
	
	currentSolveInterval = setInterval(() => {
		const randomFlask = Math.floor(Math.random() * 4);
		steps.push(randomFlask + 1); //adding one for reading sanity
		clickFlask(randomFlask);

		if (steps.length > maxSteps) {
			steps = [];
			resetFlasks();
		}

		if (checkSequence()) {
			console.log("found match :3");
			console.log(steps);
			playSound("win.wav");
			clearInterval(currentSolveInterval);
			document.getElementById("autosolve").innerHTML = "Solve Automatically"

			currentSolveInterval = null;
		}
	}, animationRate);
}

function bruteForce() {  //finds a solution instantly
	let steps = [];

	while (true) {
		if (steps.length > maxSteps) {
			steps = [];
			flasks.fill(0);
		}

		const randomFlask = Math.floor(Math.random() * 4);
		steps.push(randomFlask + 1); //adding one for reading sanity
		clickFlask(randomFlask);

		if (checkSequence()) {
			console.log("found match :3");
			break;
		}
	}

	return steps;
}

//basic functions -----------------------------------------------------

function clickFlask(index) {
	for (let i = 0; i < 4; i++) {
		if (i === index) {
			//do nothing
		} else {
			incrementFlask(i);
		}
	}
	updateFlasks();
	playRandomFillSound();
}

function incrementFlask(flaskIndex) {
	let flaskValue = flasks[flaskIndex];
	if (flaskValue < 3) {
		flaskValue++;
	} else {
		flaskValue = 0;
	}

	flasks[flaskIndex] = flaskValue;
}

function resetFlasks() {
	flasks.fill(0);
	updateFlasks();
	playSound("reset_flasks.wav");
}

function checkSequence() { // returns true if sequence matches, false if it doesn't
	let matchFound = true;
	for (let i = 0; i < 4; i++) {
		if (flasks[i] !== correctSequence[i]) {
			matchFound = false;
		}
	}
	return matchFound;
}

//utility functions -----------------------------------------------------

function stopCurrentSolve () {
	clearInterval(currentSolveInterval);
	currentSolveInterval = null;
	resetFlasks();
}

function playRandomFillSound() {
	const rand = Math.floor(Math.random() * 3);
	const soundName = `flask_fill${rand}.wav`;

	playSound(soundName);
}

function playSound(soundName) {
	if (playAudio) {
		const audio = new Audio(`asset/audio/${soundName}`);
		audio.play();
	}
}