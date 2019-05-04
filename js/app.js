// Global Declaration
const btnToggle = document.getElementById('btnMobileToggle');
const body = document.body;

const overlay = document.querySelector('div.overlay');
let properties = []; //Expects an array of property objects
let socialMedia = []; //Expects an Array of Social media objects
let blog = []; //Expects an Array of blog objects
let slider = []; //Expects an Array of slider objects

//Const Locations
const imgPropertiesFolder = "images/properties";
const imgBlogFolder = "images/blog-post";

const slideSecDuration = 6; //Number of seconds before image changes;
const slideDur = slideSecDuration * 1000; //Number of milliseconds before image changes
let slideIndex = 0;
let timeId; //I use this to control timer on slider

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
		setZnav();
		setOverlay(giveOverlay);
	});
}

//Handles/toggle navigation arrow keys z-index
const setZnav = () =>{
	const zNav = document.querySelectorAll('div.slide-nav-container');
	if(zNav){
		for (let index = 0; index < zNav.length; index++) {
			const element = zNav[index];
			if(element.style.zIndex == 1){
				element.style.zIndex = 0;
			} else{
				element.style.zIndex = 1;
			}
		}
	}
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

//Fetch JSON for slider
const fetchSlider = () =>{
	fetchJSONFromFile(slider, './data/slider-images.json');
} 

const generateSliderHTML = () =>{
	const sliderDiv = document.querySelector('div.homepage.slider.image');
	if (sliderDiv) {
		const div = document.createDocumentFragment();
		slider.forEach(slide =>{
			div.append(createSliderHTML(slide));
		});
		sliderDiv.append(div);
		activateSlider();
	}
}

const createSliderHTML = (slide) =>{
	const name = slide.name;
	const amt = slide.amt;
	const address = slide.address;
	const image = slide.image;

	const divCSF = document.createElement('div'); //div with class container slide fade, the grand parent div
	divCSF.classList.add('container', 'slide', 'fade');

	const img = document.createElement('img'); //create slide image
	img.src = imgPropertiesFolder + "/" + image;
	img.alt = "image of property, " + name;
	img.classList.add('slide-img');
	//Append img to divCSF
	divCSF.append(img);
	
	const divSD = document.createElement('div'); //div with class container slide-detail
	divSD.classList.add('slide-detail');

	const pSlidName = document.createElement('p'); //paragraph for slide name
	pSlidName.classList.add("slide-name");
	pSlidName.innerHTML = name;
	//Append pSlideName to divSD
	divSD.append(pSlidName);

	const divLoc = document.createElement('div'); //Create the div for location
	divLoc.classList.add('container');

	const iLoc = document.createElement('i');//create fontawesome icon for location
	iLoc.classList.add('fas', 'fa-map-marker-alt', 'prop-loc');
	divLoc.append(iLoc);

	const pSlidLoc = document.createElement('p'); //paragraph for slide city/address
	pSlidLoc.classList.add("slide-city");
	pSlidLoc.innerHTML = address;
	//Append pSlideName to divSD
	divLoc.append(pSlidLoc);

	//Append divLoc to divSD
	divSD.append(divLoc);

	const divAmt = document.createElement('div'); //Create the div for property amt
	divAmt.classList.add('container', 'slide-amt-container');

	const pSlidAmt = document.createElement('p'); //paragraph for slide property amount
	pSlidAmt.classList.add("slide-amt");
	pSlidAmt.innerHTML = amt;
	//Append pSlideAmt to divAmt
	divAmt.append(pSlidAmt);

	//Append divAmt to divSD
	divSD.append(divAmt);

	//Append divSD to divCSF
	divCSF.append(divSD);

	return divCSF;
}

//Lets make us our slider
getSlide = () =>{
	fetchSlider();
	window.addEventListener('load', function() {
		generateSliderHTML();
	});
}

//Let the slider begin
const activateSlider = () =>{
	let i;
	let slides = document.querySelectorAll("div.container.slide.fade");
	for (i = 0; i < slides.length; i++) {
		slides[i].style.display = "none";  
	}
	slideIndex++;
	if (slideIndex > slides.length) {slideIndex = 1}
  	if (slideIndex < 1) {slideIndex = slides.length}    
	
	console.log(slideIndex);
	slides[slideIndex-1].style.display = "grid";  
	startSliderTimeOut();
}

const startSliderTimeOut = () =>{
	timeId = 	window.setTimeout(activateSlider, slideDur); // Change image every slideDur seconds
}

const endSliderTimeOut = () =>{
	window.clearTimeout(timeId);
}

//Show previous and next slide
const navSlider = () => {
	const nextBtn = document.querySelector('a.slide-nav.right');
	const prevBtn = document.querySelector('a.slide-nav.left');

	nextBtn.addEventListener('click', function(){
		slideIndex += 0;
		endSliderTimeOut();
		activateSlider();
	});

	prevBtn.addEventListener('click', function(){
		slideIndex += -2;
		endSliderTimeOut();
		activateSlider();
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
	const title = socialMedia.title;
	const link = socialMedia;

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
	const id = property.id;
	const name = property.name;
	const address = property.address;
	const images = property.images;
	const price = property.price;
	const propertySize = property.propertySize;

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
	aLink.href = propertyURL(id);
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

const generateFeaturedBlogHTML = () =>{
	const blogArticle = document.querySelector('article.article-feartured-blog-post');
	if (blogArticle) {
		const div = document.createDocumentFragment();
		for (let i = 0; i < 4; i++) {
			div.append(createBlogHTML(blog[i]));
		}
		blogArticle.append(div);
	}
}

//Create Blog HTML
const createBlogHTML = (post) =>{
	const id = post.id;
	const title = post.title;
	const image = post.image;
	const publishDate = post.publishDate;
	const structure = post.structure;

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
	pExcerpt.innerHTML = getBlogExcerpt(structure);
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
	let firstPara; //Delcare first paragraph

	//Loop to ensure we are getting a para not an article
	for (let i = 0; i < struc.length; i++) {
		const element = struc[i];
		if (element.type == "p") {
			//Get contents of the element
			const thisContent = element.content;
			// use tenary conditional statement to check if array
			firstPara = getOutPara(thisContent);
			break;
		} else if (element.type == "article") {
			const items = element.content;
			// console.log(items);
			for (let k = 0; k < items.length; k++) {
				const item = items[k];
				if (item.type == "p") {
					const thisContent = item.content;
					// use tenary conditional statement to check if array
					firstPara = getOutPara(thisContent);
					// console.log('in it', firstPara);
					break;
				}
			}
			break;
		}
	}

	const syntax = "."
	const syntaxPos = firstPara.indexOf(syntax);
	const excerpt = firstPara.slice(0, (syntaxPos + 1));
	// console.log(excerpt);
	return excerpt;
}

const getOutPara = (value) =>{
	//Get the paragraph by checking if array or not
	return (Array.isArray(value) ? value[0] : value)
}

getBlog = () =>{
	fetchBlog();
	window.addEventListener('load', function() {
		generateBlogHTML();
		generateFeaturedBlogHTML();
	});
}

//This area has functions that help display the individual properties

//Create property URL
const propertyURL = (id) =>{
	return (`./property.html?id=${id}`);
}


// On application start, perform these
const startApp = () => {
	toggleMenuBtn(); //Enable Toggle Menu
	SetAriaBasedOnScreen();
	getSocialMedia();
	getProperties();
	getBlog();
	getSlide();
	navSlider();
};

startApp();
