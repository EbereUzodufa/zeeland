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

//Get the JSON from a lcation
const fetchJSONFromFile = (arrayEle, file) =>{
	let arrValue = [];

	function status(response) {
		//if Promise is Resolsved
	  if (response.status >= 200 && response.status < 300) {
	    return Promise.resolve(response)
	  } else {
	  	// else - Promise fails/rejected
	    return Promise.reject(new Error(response.statusText))
	  }
	}

	function json(response) {
	  return response.json()
	}

	//Fetch to get file using chained Promise
	fetch(file)
	  .then(status) 
	  .then(json)
	  .then(function(data) {
	  	//add the values of the data from the JSON file
	  	const [values] = Object.values(data);
	  	values.map(value => {
	  		arrValue.push(value);
	  		arrayEle.push(value);
	  	})
	    console.log('Request succeeded with JSON response', data);
	  }).catch(function(error) {
	    console.log('Request failed', error);
	  });
}

const fetchProperties = () =>{
	fetchJSONFromFile(properties, './data/properties.json');
	console.log("properties", properties);
}

// On application start, perform these
const startApp = () => {
	toggleMenuBtn(); //Enable Toggle Menu
	SetAriaBasedOnScreen();
};

startApp();
