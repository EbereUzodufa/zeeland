// Global Declaration
const btnToggle = document.getElementById('btnMobileToggle');
const body = document.body;

const overlay = document.querySelector('div.overlay');
let properties = []; //Expects an array of property objects
let blog = []; //Expects an Array of blog objects

//Set aria-hidden property
SetAriaHidden = (val) =>{
	overlay.setAttribute('aria-hidden', val);
}

// Get current year
// const currentYear = () => {
// 	let d = new Date();
// 	let year = d.getFullYear();
// 	document.getElementById('currentYear').innerHTML = year;
// }

// Set overlay
const setOverlay = (value) =>{
	let setValue = value;
	// console.log(setValue);
	if (setValue == true){
		overlay.style.width = '100%';
		overlay.scrollTop = 0;
		body.classList.add('noScroll');
		SetAriaHidden('false');
	} else{
		overlay.style.width = '0%';
		body.classList.remove('noScroll');
		SetAriaHidden('true');
	}
};

//Toggle Menu Button
const toggleMenuBtn = () =>{
	// Toggle Button
	const iAwesome = document.querySelector('i.fa.fa-bars');
	let giveOverlay = false;
	btnToggle.addEventListener('click', function() {
		if (btnToggle.style.backgroundColor == '' || btnToggle.style.backgroundColor == 'transparent') {
			btnToggle.style.backgroundColor = "#bf9f62";
			iAwesome.style.color = '#fff';
			giveOverlay = true;
		} else{
			btnToggle.style.backgroundColor = "transparent";
			iAwesome.style.color = '#291670';
			giveOverlay = false;
		}
		setOverlay(giveOverlay);
	});
}

//Change ARIA based on screen width
const SetAriaBasedOnScreen = () =>{
	const screenWidth = screen.width;
	if (screenWidth >= 1024) {
		SetAriaHidden('false');
	} else {
		SetAriaHidden('true');
	}
}

// On application start, perform these
const startApp = () => {
	toggleMenuBtn(); //Enable Toggle Menu
	SetAriaBasedOnScreen();
};

startApp();
