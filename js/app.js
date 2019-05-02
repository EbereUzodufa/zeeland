// Global Declaration
const btnToggle = document.getElementById('btnMobileToggle');
const body = document.body;

const overlay = document.querySelector('div.overlay');
let properties = []; //Expects an array of property objects
let socialMedia = []; //Expects an Array of Social media objects
let blog = []; //Expects an Array of blog objects

//Const Locations
const imgPropertiesFolder = "images/properties";
const imgBlogFolder = "images/blog-post";

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

//Get the JSON from a location
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

//Fecth JSON for social Media Icons
const fetchSocialMedia = () =>{
	fetchJSONFromFile(socialMedia, './data/socialMediaLinks.json');
}

//Generate HTML by first, getting each social media link
const generateSocialMediaHTML = () =>{
	const socialMediaDiv = document.querySelector('div.social-media-container');
	if (socialMediaDiv) {
		const div = document.createDocumentFragment();
		socialMedia.forEach(socialMedia =>{
			div.append(createSocialMediaHTML(socialMedia));
		});
		socialMediaDiv.append(div);
	}
}

//Create HTML for social media
const createSocialMediaHTML = (socialMedia) =>{
	const {
		id,
		name,
		title,
		link
	} = socialMedia;

	const divConSocialMedia = document.createElement('div');
	divConSocialMedia.classList.add('social-media');

	//Create Link
	const aLink = document.createElement('a');
	aLink.href = link;
	aLink.target = "blank";
	aLink.classList.add('social-link');

	//create abbr
	const abbr = document.createElement('abbr');
	abbr.title = title;

	//append i to abbr
	abbr.append(createFontAwesomeIcon(title));

	//append abbr to aLink
	aLink.append(abbr);
	//append abbr to aLink
	divConSocialMedia.append(aLink);
	
	return divConSocialMedia;
}

//Make me a font awesome icon
const createFontAwesomeIcon = (title) =>{
	//create font Awesome icon
	const iAwesome = document.createElement('i');

	if (title == "facebook") {
		iAwesome.classList.add('fab', 'fa-facebook', 'social-media-icon');
	}

	if (title == "twitter") {
		iAwesome.classList.add('fab', 'fa-twitter-square', 'social-media-icon');
	}

	if (title == "linkedin") {
		iAwesome.classList.add('fab', 'fa-linkedin', 'social-media-icon');
	}

	if (title == "youtube") {
		iAwesome.classList.add('fab', 'fa-youtube', 'social-media-icon');
	}

	if (title == "instagram") {
		iAwesome.classList.add('fab', 'fa-instagram', 'social-media-icon');
	}

	return iAwesome;
}

//Let's do this. Get our social media and load them in
getSocialMedia = () =>{
	fetchSocialMedia();
	window.addEventListener('load', function() {
		generateSocialMediaHTML();
	});
}

//Fecth JSON for Property
const fetchProperties = () =>{
	fetchJSONFromFile(properties, './data/properties.json');
	// console.log("properties", properties);
}

//Generate HTML by first, getting each property
const generatePropertyHTML = () =>{
	const propertyArticle = document.querySelector('article.article-properties');
	if (propertyArticle) {
		const div = document.createDocumentFragment();
		properties.forEach(property =>{
			// console.log(property.id, property);
			div.append(createPropertyHTML(property));
		});
		propertyArticle.append(div);
	}
}

const generateFeaturedPropertyHTML = () =>{
	const propertyArticle = document.querySelector('article.article-feartured-properties');
	if (propertyArticle) {
		const div = document.createDocumentFragment();
		for (let i = 0; i < 6; i++) {
			div.append(createPropertyHTML(properties[i]));
		}
		propertyArticle.append(div);
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

	//Div for row 2
	const divConPropertyDetail = document.createElement('div');
	divConPropertyDetail.classList.add('container', 'details');

	// image from images. For now we are using demo
	const imgProperty = document.createElement('img');
	imgProperty.classList.add('property-image');
	imgProperty.src = imgPropertiesFolder + "/" + images[0];
	imgProperty.alt = "Image of " + name;

	//Append image (imgProperty) to divConProperty
	divConProperty.append(imgProperty);

	//paragraph of propery-name
	const paraPropName = document.createElement('p');
	paraPropName.classList.add('property-name');
	paraPropName.innerHTML = name;
	//Append paragraph prop-name to divConProperty
	divConPropertyDetail.append(paraPropName);

	//paragraph of propery-location
	const paraPropLoc = document.createElement('p');
	paraPropLoc.classList.add('property-location');
	paraPropLoc.innerHTML = address;
	//Append paragraph prop-location to divConProperty
	divConPropertyDetail.append(paraPropLoc);

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
	divConPropertyDetail.append(divConMoney);

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
	divConPropertyDetail.append(divConSize);

	divConProperty.append(divConPropertyDetail);

	//Create link
	const aLink = document.createElement('a');
	aLink.role = "button";
	aLink.classList.add('property-link');
	aLink.innerHTML = "Click here to get Details";
	//Append aLink to divConProperty
	divConProperty.append(aLink);

	// console.log(id, divConProperty);

	return divConProperty;
}

getProperties = () =>{
	fetchProperties();
	window.addEventListener('load', function() {
		generatePropertyHTML();
		generateFeaturedPropertyHTML();
	});
}

//Get Blog data
const fetchBlog = () =>{
	fetchJSONFromFile(blog, './data/blog-posts.json');
}

//Assign each field
const generateBlogHTML = () =>{
	const blogArticle = document.querySelector('article.article-blog');
	if (blogArticle) {
		const div = document.createDocumentFragment();
		blog.forEach(post =>{
			blogArticle.append(createBlogHTML(post));
		});
		blogArticle.append(div);
	}
}

//Create Blog HTML
const createBlogHTML = (post) =>{
	const {
		id,
		title,
		image,
		publishDate,
		structure
	} = post;

	// console.log(id, post);
	
	//Create div wrap
	const divBlogCon = document.createElement('div');
	divBlogCon.classList.add('container', 'blog-post');

	//Create blog post image
	const img = document.createElement('img');
	img.classList.add('blog-post-image');
	img.src = imgBlogFolder + "/" + image;
	img.alt = "Image of blog post, ";
	//Append img to divBlogCon
	divBlogCon.append(img);

	//Create Date Div
	const divBlogDate = document.createElement('div');
	divBlogDate.classList.add('blog-post-date-container');

	//Create Date p
	const pDate = document.createElement('p');
	pDate.classList.add('blog-post-date');
	pDate.innerHTML = getBlogPostDate(publishDate);
	//Append date to it's div
	divBlogDate.append(pDate);

	//Append date div to divBlogCon
	divBlogCon.append(divBlogDate);

	//Create Post name and excerpt
	const divBlogDetail = document.createElement('div');
	divBlogDetail.classList.add('containers', 'details');

	//Create post title p
	const pTitle = document.createElement('p');
	pTitle.classList.add('blog-post-name');
	pTitle.innerHTML = title;
	//Append title to it's div
	divBlogDetail.append(pTitle);

	//Create post Excerpt p
	const pExcerpt = document.createElement('p');
	pExcerpt.classList.add('blog-post-excerpt');
	pExcerpt.innerHTML = getBlogExcerpt(structure[0]);
	//Append title to it's div
	divBlogDetail.append(pExcerpt);

	//Append detail div to divBlogCon
	divBlogCon.append(divBlogDetail);

	const aBlog  = document.createElement('a');
	aBlog.role = "button";
	aBlog.classList.add('blog-post-link');
	aBlog.innerHTML = "Click here to Read more";
	//Append aBlog to divBlogCon
	divBlogCon.append(aBlog);

	return divBlogCon;
}

const getBlogPostDate = (aDate) =>{
	//Parse to Date
	const tDate = new Date(aDate);

	//Declare day, month, year
	const tDay = tDate.getDay();
	const tMonth = tDate.getMonth() + 1;
	const tYear = tDate.getFullYear();
	const dDate = tDay + "/" +  tMonth + "/" + tYear;

	return dDate;
}

const getBlogExcerpt = (struc) =>{
	let writeUp = struc.content;
	const syntax = "."
	// const syntaxPos = writeUp.indexOf(syntax);
	const excerpt = writeUp.slice(0, 100);
	// console.log(excerpt);
	return excerpt;
}

getBlog = () =>{
	fetchBlog();
	window.addEventListener('load', function() {
		generateBlogHTML();
	});
}

// On application start, perform these
const startApp = () => {
	toggleMenuBtn(); //Enable Toggle Menu
	SetAriaBasedOnScreen();
	getSocialMedia();
	getProperties();
	getBlog();
};

startApp();
