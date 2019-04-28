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
	// console.log("properties", properties);
}

//Generate HTML by first, getting each property
const generatePropertyHTML = () =>{
	const propertyArticle = document.querySelector('article.article-feartured-properties');
	if (propertyArticle) {
		properties.forEach(property =>{
			// console.log(property.id, property);
			propertyArticle.append(createPropertyHTML(property));
		});
	}
}

//Create HTML for Property
const createPropertyHTML = (property) =>{
	const {
		id,
		name,
		type,
		address,
		images,
		writeUp,
		bottomWriteUp,
		price,
		propertySize,
		propertyTitle,
		propertyOfferType,
		propertyNeighborhood,
		propertyFeatures,
		map,
		videoLink
	} = property;

	// console.log(id,id);
	// console.log(id,name);
	// console.log(id,type);
	// console.log(id,address);
	// console.log(id,images);
	// console.log(id,writeUp);
	// console.log(id,bottomWriteUp);
	// console.log(id,price);
	// console.log(id,propertySize);
	// console.log(id,propertyTitle);
	// console.log(id,propertyOfferType);
	// console.log(id,propertyNeighborhood);
	// console.log(id,propertyFeatures);
	// console.log(id,map);
	// console.log(id,videoLink);

	// parent container <div class="container property">
	const divConProperty = document.createElement('div');
	divConProperty.classList.add('container');
	divConProperty.classList.add('property');

	// image from images. For now we are using demo
	const imgProperty = document.createElement('img');
	imgProperty.classList.add('property-image');
	imgProperty.src = "images/property-test.jpg";
	imgProperty.alt = "Image of property, ";

	//Append image (imgProperty) to divConProperty
	divConProperty.append(imgProperty);

	//paragraph of propery-name
	const paraPropName = document.createElement('p');
	paraPropName.classList.add('property-name');
	paraPropName.innerHTML = name;
	//Append paragraph prop-name to divConProperty
	divConProperty.append(paraPropName);

	//paragraph of propery-location
	const paraPropLoc = document.createElement('p');
	paraPropLoc.classList.add('property-location');
	paraPropLoc.innerHTML = address;
	//Append paragraph prop-location to divConProperty
	divConProperty.append(paraPropLoc);

	//div container for money
	const divConMoney = document.createElement('div');
	divConMoney.classList.add('container');

	//create fontawesome i
	const iMoney = document.createElement('i');
	iMoney.classList.add('fas');
	iMoney.classList.add('fa-money-bill');
	iMoney.classList.add('property');
	//Append iMoney to divConMoney
	divConMoney.append(iMoney);

	//paragraph of propery-price
	const paraPropPrice = document.createElement('p');
	paraPropPrice.classList.add('property-price');
	paraPropPrice.innerHTML = price.mainPrice;
	//Append paragraph prop-price to divConMoney
	divConMoney.append(paraPropPrice);

	//Append divConMoney to divConProperty
	divConProperty.append(divConMoney);

	//div container for property size
	const divConSize = document.createElement('div');
	divConSize.classList.add('container');

	//create fontawesome i
	const iSize = document.createElement('i');
	iSize.classList.add('fas');
	iSize.classList.add('fa-box-open');
	iSize.classList.add('property');
	//Append iSize to divConSize
	divConSize.append(iSize);

	//paragraph of propery-price
	const paraPropSize = document.createElement('p');
	paraPropSize.classList.add('property-size');
	paraPropSize.innerHTML = propertySize;
	//Append paragraph prop-price to divConSize
	divConSize.append(paraPropSize);

	//Append divConSize to divConProperty
	divConProperty.append(divConSize);

	//Create link
	const aLink = document.createElement('a');
	aLink.role = "button";
	aLink.classList.add('property-link');
	//Append aLink to divConProperty
	divConProperty.append(aLink);

	// console.log(id, divConProperty);

	return divConProperty;
}

// On application start, perform these
const startApp = () => {
	toggleMenuBtn(); //Enable Toggle Menu
	SetAriaBasedOnScreen();
};

startApp();
