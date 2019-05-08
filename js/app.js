// Global Declaration
const btnToggle = document.getElementById('btnMobileToggle');
const body = document.body;

const overlay = document.querySelector('div.overlay');
let properties = []; //Expects an array of property objects
let socialMedia = []; //Expects an Array of Social media objects
let blog = []; //Expects an Array of blog objects
let slider = []; //Expects an Array of slider objects
let sliderProperty = []; //Expects an Array of slider objects

//Const Locations
const imgPropertiesFolder = "images/properties";
const imgBlogFolder = "images/blog-post";

const slideSecDuration = 6; //Number of seconds before image changes;
const slideDur = slideSecDuration * 1000; //Number of milliseconds before image changes
let slideIndex = 0;
let timeId; //I use this to control timer on slider
let timeIdS; //I use this to control timer on slider

//Individual URL for blog and property
const propertyURL = "./property.html";
const blogURL = "./blog-post.html";
// const logoURL = "images/logo.png";

//Object for image size and width
const imgSrcSetWidths = [
	{
		"size": "150px",
		"width": "150w"
	},
	{
		"size": "300px",
		"width": "300w"
	},
	{
		"size": "480px",
		"width": "480w"
	},
	{
		"size": "600px",
		"width": "600w"
	},
	// {
	// 	"size": "800px",
	// 	"width": "800w"
	// }
]


/*Adding service Worker*/

if ('serviceWorker' in navigator) {
	window.addEventListener('load', function() {
			navigator.serviceWorker.register('../sw.js')
			.then(function(registration) {
				console.log('ServiceWorker registration successful');
			})
		.catch(function(err) {
				console.log('ServiceWorker registration failed: ' + err);
	});
	});
};
//////////////////////////

//Set aria-hidden property
const setAriaHidden = (val) =>{
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
		setAriaHidden('false');
	} else{
		overlay.style.width = '0%';
		body.classList.remove('noScroll');
		setAriaHidden('true');
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
setAriaBasedOnScreen = () =>{
	const screenWidth = screen.width;
	if (screenWidth >= 1024) {
		setAriaHidden('false');
	} else {
		setAriaHidden('true');
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
		
		return;
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
	img.srcset = generateImgSrcset(img.src);

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
const getSlide = () =>{
	fetchSlider();
	window.addEventListener('load', function() {
		generateSliderHTML();
	});
}

//Let the slider begin
const activateSlider = () =>{
	let i;
	let slides = document.querySelectorAll("div.container.slide.fade");
	console.log(slides);
	if(slides.length != 0){
		for (i = 0; i < slides.length; i++) {
			slides[i].style.display = "none";  
		}
		slideIndex++;
		if (slideIndex > slides.length) {slideIndex = 1}
			if (slideIndex < 1) {slideIndex = slides.length}    
		
		// console.log(slideIndex);
		slides[slideIndex-1].style.display = "grid";
	}
	startSliderTimeOut();
}

const startSliderTimeOut = () =>{
	timeId = 	window.setTimeout(activateSlider, slideDur); // Change image every slideDur seconds
}

const endSliderTimeOut = () =>{
	window.clearTimeout(timeId);
}

const resetSlider = () =>{
	endSliderTimeOut();
	activateSlider();
}

//Show previous and next slide
const navSlider = () => {
	const nextBtn = document.querySelector('a.slide-nav.right');
	const prevBtn = document.querySelector('a.slide-nav.left');

	if(nextBtn){
		nextBtn.addEventListener('click', function(){
			slideIndex += 0;
			resetSlider();
		});
	}

	if(prevBtn){
		prevBtn.addEventListener('click', function(){
			slideIndex += -2;
			resetSlider();
		});
	}

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
	const link = socialMedia.link;

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
const getSocialMedia = () =>{
	$.ajax({
		url:fetchSocialMedia(),
		success:function(){
			generateSocialMediaHTML();
		}
	})
	// $.when(fetchSocialMedia()).done(generateSocialMediaHTML());
	// fetchSocialMedia();
	// window.addEventListener('load', function() {
	// 	generateSocialMediaHTML();
	// });
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
			console.log(property.id, property);
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
			console.log(i, properties[i]);
			div.append(createPropertyHTML(properties[i]));
		}
		propertyArticle.append(div);
	}
}

//Create HTML for Property
const createPropertyHTML = (property) =>{
	console.log(property);
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
	imgProperty.srcset = generateImgSrcset(imgProperty.src);

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
	aLink.href = createItemURL(propertyURL,id);
	//Append aLink to divConProperty
	divConProperty.append(aLink);

	// console.log(id, divConProperty);

	return divConProperty;
}

const getProperties = () =>{
	// $.when(fetchProperties()).then(
	// 	$.ajax({
	// 		url:generatePropertyHTML(),
	// 		success:function(){
	// 			// generatePropertyHTML();
	// 			generateFeaturedPropertyHTML();
	// 		}
	// 	})
	// )
	fetchProperties();
	window.addEventListener('load', function() {
		console.log(properties);
		if(properties.length != 0){
			generatePropertyHTML();
			generateFeaturedPropertyHTML();
		}
	});

	// new Promise(() => {
	// 	fetchProperties();
	// })
	// .then(generatePropertyHTML())
	// // .then(generateFeaturedPropertyHTML())
	// .catch(console.log('Err in getProperties'));
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
	img.srcset = generateImgSrcset(img.src);

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
	aBlog.href = createItemURL(blogURL,id);
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

const getBlog = () =>{
	// $.ajax({
	// 	url:generateBlogHTML(),
	// 	success:function(){
	// 		generateBlogHTML();
	// 		generateFeaturedBlogHTML();
	// 	}
	// })
	fetchBlog();
	window.addEventListener('load', function() {
		if(blog.length != 0){
			generateBlogHTML();
			generateFeaturedBlogHTML();
		}
	});
}

const generateImgSrcset = (img) =>{
	const syntax = ".jpg"
	const syntaxPos = img.indexOf(syntax);
	const imgSrc = img.slice(0, (syntaxPos));
	let imgSrcSet = "";

	imgSrcSetWidths.forEach(imgSrcSetWidth =>{
		imgSrcSet += imgSrc + "-" + imgSrcSetWidth.size +  syntax + " " + imgSrcSetWidth.width + ", ";
	})

	return imgSrcSet;
}


//This area has functions that help display the individual properties

//Create property/blog URL
const createItemURL = (itemURL, id) =>{
	return (itemURL + '?id=' + id);
}

//Get this Item (property/blog) ID from URL
getItemId = (url) => {
	let id = 'id';
	if (!url)
	  url = window.location.href;
	id = id.replace(/[\[\]]/g, '\\$&');
	const regex = new RegExp(`[?&]${id}(=([^&#]*)|&|#|$)`),
	  results = regex.exec(url);
	if (!results)
	  return null;
	if (!results[2])
	  return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

//Show clicked Property
const displayProperty = () => {
	const id = getItemId();
	if(id) {
		properties.map(prop =>{
			if (prop.id == id) {
				document.title = prop.name +' | Zeeland Homes Limited, the most valuable real estate deals under the safest terms';
				selectedPropertyHTML(prop);
				// return console.log(prop);
			}
		});
	}
	// console.log(id);
}

const selectedPropertyHTML = (property) =>{
	const name = property.name;
	const type = property.type;
	const address = property.address;
	const images = property.images;
	const writeUp = property.writeUp;
	const bottomWriteUp = property.bottomWriteUp;
	const price = property.price;
	const propertySize = property.propertySize;
	const propertyTitle = property.propertyTitle;
	const propertyOfferType = property.propertyOfferType;
	const propertyNeighborhood = property.propertyNeighborhood;
	const propertyFeatures = property.propertyFeatures;

	//if there is property name
	if(name){
		const divH1 = document.createElement('div');//h1 div
		divH1.classList.add("title-wrap", "container");

		const h1 = document.createElement('h1');
		h1.innerHTML = name;
		//APpend h1 to div
		divH1.append(h1);

		//the Section for title
		const sec = document.querySelector('section.property-title-header');

		if(sec){
			//Append h1 div
			sec.append(divH1);
		}

		const span = document.querySelector('span#property-name');
		if(span){
			span.innerHTML = name;	
		}
	}

	//Create price if we have a price
	if (price) {
		const articlePrice = document.querySelector('article.property-price');

		//Segment the different types of prices
		const mainPrice = price.mainPrice;
		const otherPrices = price.otherPrices;

		//Check main price
		if (mainPrice) {
			const pMainPrice = document.createElement('p');
			pMainPrice.classList.add("property-mainPrice");
			pMainPrice.innerHTML = mainPrice;

			//Create div for main price
			const div = document.createElement('div');
			div.classList.add("container");

			//Append mainPrice to div
			div.append(pMainPrice);

			//Append div to article
			articlePrice.append(div);
		}

		if(otherPrices){
			//Create div for other prices
			const divPropertyOtherPrices = document.createElement('div');
			divPropertyOtherPrices.classList.add("container");

			if(Array.isArray(otherPrices)){
				if(otherPrices.length != 0){
					const fragPropPrices = document.createDocumentFragment();
					otherPrices.forEach(otherPrice =>{
						//list for property Prices(s)
						const liPPrices = document.createElement('li');
						liPPrices.classList.add("property-prices-list-item");
						liPPrices.innerHTML = otherPrice;

						//Append the li to fragment
						fragPropPrices.append(liPPrices);
					});

					//Append the fragment to ul
					const ulPPrices = document.createElement('ul');
					ulPPrices.classList.add("property-prices-list", "property-characteristic");
					ulPPrices.innerHTML = "Other Prices";
					
					//Append fragment to ul
					ulPPrices.append(fragPropPrices);

					//Append ul ie list to div
					divPropertyOtherPrices.append(ulPPrices);
				}
			} else{
				//Paragraph for otjer prices
				const pOtherPrice = document.createElement('p');
				pOtherPrice.classList.add("property-characteristic");
				pOtherPrice.innerHTML = "Other Price <span>" +  otherPrices + "</span>";

				//Append pOtherPrice ie list to div
				divPropertyOtherPrices.append(pOtherPrice)
			}
			//Append divPropertyOtherPrices to article
			articlePrice.append(divPropertyOtherPrices);
		}
	}

	//Get article for prperty contents
	const articleProp = document.querySelector("article.property-content");

	//if we find this article
	if (articleProp) {
		const frag = document.createDocumentFragment();

		//I refer to the main features as characteristic(s)

		//So I create a div to wrap all of them
		const divXterisitics = document.createElement('div');
		divXterisitics.classList.add("container", "property-characteristics");

		if(type){
			//div for Type
			const divType = document.createElement("div");
			divType.classList.add("property-type-container","property-characteristic-container");

			//Paragraph for Type
			const pType = document.createElement('p');
			pType.classList.add("property-type","property-characteristic");
			pType.innerHTML = "Type: <span>" + type + "</span>";

			//Append the Type to div
			divType.append(pType);

			//Append div to divXteristics
			divXterisitics.append(divType);
		}

		if(address){
			//div for Address
			const divAddress = document.createElement("div");
			divAddress.classList.add("property-address-container","property-characteristic-container");

			//Paragraph for Address
			const pAddress = document.createElement('p');
			pAddress.classList.add("property-address","property-characteristic");
			pAddress.innerHTML = "Location: <span>" + address + "</span>";

			//Append the Address to div
			divAddress.append(pAddress);

			//Append div to divXteristics
			divXterisitics.append(divAddress);
		}

		if(propertySize){
			//div for propertySize
			const divPropertySize = document.createElement("div");
			divPropertySize.classList.add("property-propertySize-container","property-characteristic-container");

			//Paragraph for propertySize
			const pPropertySize = document.createElement('p');
			pPropertySize.classList.add("property-propertySize","property-characteristic");
			pPropertySize.innerHTML = "property size: <span>" + propertySize + "</span>";

			//Append the propertySize to div
			divPropertySize.append(pPropertySize);

			//Append div to divXteristics
			divXterisitics.append(divPropertySize);
		}

		if (propertyTitle) {
			//div for propertyTitle
			const divPropertyTitle = document.createElement("div");
			divPropertyTitle.classList.add("property-propertyTitle-container","property-characteristic-container", "container");

			if (Array.isArray(propertyTitle)) {
				if(propertyTitle.length != 0){	
					const fragPropTitle = document.createDocumentFragment();
					propertyTitle.forEach(pT =>{
						//list for property title(s)
						const liPTitle = document.createElement('li');
						liPTitle.classList.add("property-title-list-item");
						liPTitle.innerHTML = pT;

						//Append the li to fragment
						fragPropTitle.append(liPTitle);
					});

					//Append the fragment to ul
					const ulPTitle = document.createElement('ul');
					ulPTitle.classList.add("property-title-list", "property-characteristic", "container");
					ulPTitle.innerHTML = "Property Title";
					
					//Append fragment to ul
					ulPTitle.append(fragPropTitle);

					//Append ul ie list to div
					divPropertyTitle.append(ulPTitle);
				}
			} else{
				//Paragraph for Title
				const pPropertyTitle = document.createElement('p');
				pPropertyTitle.classList.add("property-characteristic");
				pPropertyTitle.innerHTML = "Property Title <span>" +  propertyTitle + "</span>";

				//Append the PropertyTitle to div
				divPropertyTitle.append(pPropertyTitle);
			}

			//Append div to divXteristics
			divXterisitics.append(divPropertyTitle);
		}

		//Append the major features to frag
		frag.append(divXterisitics);

		//Features of the property
		if(propertyFeatures){
			//div for Features
			const divPropertyFeatures = document.createElement("div");
			divPropertyFeatures.classList.add("property-propertyFeatures-container", "container");

			//Check if propertyFeatures is an array
			if (Array.isArray(propertyFeatures)) {
				if(propertyFeatures.length != 0){	
					const fragPropFeatures = document.createDocumentFragment();
					propertyFeatures.forEach(feat =>{
						//list for property title(s)
						const liFeat = document.createElement('li');
						liFeat.classList.add("property-feature-list-item");
						liFeat.innerHTML = feat;

						//Append the li to fragment
						fragPropFeatures.append(liFeat);
					});

					//Append the fragment to ul
					const ulFeat = document.createElement('ul');
					ulFeat.classList.add("property-feature-list", "container");
					ulFeat.innerHTML = "Property Features and Facilities";
					
					//Append fragment to ul
					ulFeat.append(fragPropFeatures);

					//Append ul ie list to div
					divPropertyFeatures.append(ulFeat);
				}
			} else{
				//Paragraph for propertyFeatures
				const pPropertyFeatures = document.createElement('p');
				pPropertyFeatures.classList.add("property-propertyFeatures");
				pPropertyFeatures.innerHTML = "Property Feature and Facility <span>" + propertyFeatures + "</span>";

				//Append the propertyFeatures to div
				divPropertyFeatures.append(pPropertyFeatures);
			}

			//Append div to fragment
			frag.append(divPropertyFeatures);
		}

		//Write up about property
		if(writeUp){
			//div for writeUp
			const divWriteUp = document.createElement("div");
			divWriteUp.classList.add("property-writeUp-container", "container");

			//Check if writeUp is an array
			if (Array.isArray(writeUp)) {
				if(writeUp.length != 0){	
					const fragWriteUp = document.createDocumentFragment();
					writeUp.forEach(w =>{
						//Paragraph for WriteUp
						const pWriteUp = document.createElement('p');
						pWriteUp.classList.add("property-writeUp");
						pWriteUp.innerHTML = w;

						//Append the p to fragment
						fragWriteUp.append(pWriteUp);
					});

					//Append the fragment to div
					divWriteUp.append(fragWriteUp);
				}
			} else{
				//Paragraph for WriteUp
				const pWriteUp = document.createElement('p');
				pWriteUp.classList.add("property-writeUp");
				pWriteUp.innerHTML = writeUp;

				//Append the WriteUp to div
				divWriteUp.append(pWriteUp);
			}

			//Append div to fragment
			frag.append(divWriteUp);
		}

		//Property Neighborhood
		if(propertyNeighborhood){
			//div for Features
			const divPropertyNeighborhood = document.createElement("div");
			divPropertyNeighborhood.classList.add("property-propertyNeighborhood-container", "container");

			//Check if propertyNeighborhood is an array
			if (Array.isArray(propertyNeighborhood)) {
				if(propertyNeighborhood.length != 0){	
					const fragPropNeighborhood = document.createDocumentFragment();
					propertyNeighborhood.forEach(neighborhood =>{
						//list for property Neighborhood(s)
						const liNeighborhood = document.createElement('li');
						liNeighborhood.classList.add("property-neighborhood-list-item");
						liNeighborhood.innerHTML = neighborhood;

						//Append the li to fragment
						fragPropNeighborhood.append(liNeighborhood);
					});

					//Append the fragment to ul
					const ulNeighborhood = document.createElement('ul');
					ulNeighborhood.classList.add("property-neighborhood-list", "container");
					ulNeighborhood.innerHTML = "Property Neighborhoods";
					
					//Append fragment to ul
					ulNeighborhood.append(fragPropNeighborhood);

					//Append ul ie list to div
					divPropertyNeighborhood.append(ulNeighborhood);
				}
			} else{
				//Paragraph for propertyNeighborhood
				const ppropertyNeighborhood = document.createElement('p');
				ppropertyNeighborhood.classList.add("property-propertyNeighborhood");
				ppropertyNeighborhood.innerHTML = "Property Neighborhood <span>" + propertyNeighborhood + "</span>";

				//Append the propertyNeighborhood to div
				divPropertyNeighborhood.append(ppropertyNeighborhood);
			}

			//Append div to fragment
			frag.append(divPropertyNeighborhood);
		}

		//bottom write up about property
		if(bottomWriteUp){
			//div for bottomWriteUp
			const divBottomWriteUp = document.createElement("div");
			divBottomWriteUp.classList.add("property-bottomWriteUp-container", "container");

			//Check if bottomWriteUp is an array
			if (Array.isArray(bottomWriteUp)) {
				if(bottomWriteUp.length != 0){	
					const fragBottomWriteUp = document.createDocumentFragment();
					bottomWriteUp.forEach(w =>{
						//Paragraph for bottomWriteUp
						const pBottomWriteUp = document.createElement('p');
						pBottomWriteUp.classList.add("property-bottomWriteUp");
						pBottomWriteUp.innerHTML = w;

						//Append the p to fragment
						fragBottomWriteUp.append(pBottomWriteUp);
					});

					//Append the fragment to div
					divBottomWriteUp.append(fragBottomWriteUp);
				}
			} else{
				//Paragraph for bottomWriteUp
				const pBottomWriteUp = document.createElement('p');
				pBottomWriteUp.classList.add("property-bottomWriteUp");
				pBottomWriteUp.innerHTML = bottomWriteUp;

				//Append the bottomWriteUp to div
				divBottomWriteUp.append(pBottomWriteUp);
			}

			//Append div to fragment
			frag.append(divBottomWriteUp);
		}
		
		articleProp.append(frag);
	}

	if(images){
		//Find the div for property slider
		const sliderPropDiv = document.querySelector('div.property.slider.image');
		if(sliderPropDiv){
			const frag = document.createDocumentFragment();
			images.forEach(image => {
				frag.append(generatePropertySlider(image));
			});
			sliderPropDiv.append(frag);
			activateSlider();
		}
		//Create thumbnails of images
		const propThumbnail = document.querySelector('div.property-images-thumbnail');
		if (propThumbnail) {
			const fragThumbnail = document.createDocumentFragment();
			images.forEach(image => {
				const img = document.createElement('img'); //create slide image
				img.src = imgPropertiesFolder + "/" + image;
				img.classList.add('slide-img-thumbnail');
				img.srcset = generateImgSrcset(img.src);

				//Append image to fragment
				fragThumbnail.append(img);
			});
		
			//Append fragment to div
			propThumbnail.append(fragThumbnail);
		}
	}
	
	initMap();
}

//Property slider
//Create property slider array
const generatePropertySlider = (image) =>{
	//create div image slider
	const divImageSlider = document.createElement('div');
	divImageSlider.classList.add('container', 'slide', 'fade');

	//Create fragment for optimization
	const img = document.createElement('img'); //create slide image
	img.src = imgPropertiesFolder + "/" + image;
	img.classList.add('slide-img');
	img.srcset = generateImgSrcset(img.src);

	//Append image to div
	divImageSlider.append(img);

	return divImageSlider;
}

function initMap() {
	// The location
	const id = getItemId();

	if(id){
		let property;
		let mapLoc
		properties.map(prop =>{
			if (prop.id == id) {
				property = prop;
				mapLoc = property.map;
			}
		});

		// //Get section for map
		const divMap = document.querySelector("div#map");

		if (divMap) {
			// The map, centered at property
			const mapCenter = new google.maps.LatLng(parseFloat(mapLoc.lat),parseFloat(mapLoc.lng));
			// const mapCenter = [mapLoc.lat, mapLoc.lng]
			console.log("lan",mapCenter);
			const map = new google.maps.Map(
				document.getElementById('map'), {
					zoom: 12,
					center: mapCenter,
					mapTypeControl: true,
					mapTypeControlOptions: {
					  style:google.maps.MapTypeControlStyle.VERTICAL_BAR,
					  position: google.maps.ControlPosition.BOTTOM_CENTER,
					},
					panControl: true,
					panControlOptions: {
					  position: google.maps.ControlPosition.TOP_LEFT,
					},
					zoomControl: true,
					zoomControlOptions: {
					  style: google.maps.ZoomControlStyle.LARGE,
					  position: google.maps.ControlPosition.LEFT_CENTER,
					},
					scaleConrol: true,
					scaleControlOptions:{
					  position: google.maps.ControlPosition.TOP_LEFT ,
					},
					style: [
						{
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#ebe3cd"
							}
						  ]
						},
						{
						  "elementType": "labels.text.fill",
						  "stylers": [
							{
							  "color": "#523735"
							}
						  ]
						},
						{
						  "elementType": "labels.text.stroke",
						  "stylers": [
							{
							  "color": "#f5f1e6"
							}
						  ]
						},
						{
						  "featureType": "administrative",
						  "elementType": "geometry.stroke",
						  "stylers": [
							{
							  "color": "#c9b2a6"
							}
						  ]
						},
						{
						  "featureType": "administrative.land_parcel",
						  "elementType": "geometry.stroke",
						  "stylers": [
							{
							  "color": "#dcd2be"
							}
						  ]
						},
						{
						  "featureType": "administrative.land_parcel",
						  "elementType": "labels.text.fill",
						  "stylers": [
							{
							  "color": "#ae9e90"
							}
						  ]
						},
						{
						  "featureType": "landscape.natural",
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#dfd2ae"
							}
						  ]
						},
						{
						  "featureType": "poi",
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#dfd2ae"
							}
						  ]
						},
						{
						  "featureType": "poi",
						  "elementType": "labels.text.fill",
						  "stylers": [
							{
							  "color": "#93817c"
							}
						  ]
						},
						{
						  "featureType": "poi.park",
						  "elementType": "geometry.fill",
						  "stylers": [
							{
							  "color": "#a5b076"
							}
						  ]
						},
						{
						  "featureType": "poi.park",
						  "elementType": "labels.text.fill",
						  "stylers": [
							{
							  "color": "#447530"
							}
						  ]
						},
						{
						  "featureType": "road",
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#f5f1e6"
							}
						  ]
						},
						{
						  "featureType": "road.arterial",
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#fdfcf8"
							}
						  ]
						},
						{
						  "featureType": "road.highway",
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#f8c967"
							}
						  ]
						},
						{
						  "featureType": "road.highway",
						  "elementType": "geometry.stroke",
						  "stylers": [
							{
							  "color": "#e9bc62"
							}
						  ]
						},
						{
						  "featureType": "road.highway.controlled_access",
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#e98d58"
							}
						  ]
						},
						{
						  "featureType": "road.highway.controlled_access",
						  "elementType": "geometry.stroke",
						  "stylers": [
							{
							  "color": "#db8555"
							}
						  ]
						},
						{
						  "featureType": "road.local",
						  "elementType": "labels.text.fill",
						  "stylers": [
							{
							  "color": "#806b63"
							}
						  ]
						},
						{
						  "featureType": "transit.line",
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#dfd2ae"
							}
						  ]
						},
						{
						  "featureType": "transit.line",
						  "elementType": "labels.text.fill",
						  "stylers": [
							{
							  "color": "#8f7d77"
							}
						  ]
						},
						{
						  "featureType": "transit.line",
						  "elementType": "labels.text.stroke",
						  "stylers": [
							{
							  "color": "#ebe3cd"
							}
						  ]
						},
						{
						  "featureType": "transit.station",
						  "elementType": "geometry",
						  "stylers": [
							{
							  "color": "#dfd2ae"
							}
						  ]
						},
						{
						  "featureType": "water",
						  "elementType": "geometry.fill",
						  "stylers": [
							{
							  "color": "#b9d3c2"
							}
						  ]
						},
						{
						  "featureType": "water",
						  "elementType": "labels.text.fill",
						  "stylers": [
							{
							  "color": "#92998d"
							}
						  ]
						}
					]
				}
			);

			console.log("the map", map)
			
			// var markerIcon = new google.maps.MarkerImage(logoURL,
			// 	// This marker is 20 pixels wide by 32 pixels tall.
			// 	new google.maps.Size(25, 25),
			// 	// The origin for this image is 0,0.
			// 	new google.maps.Point(0,0),
			// 	// The anchor for this image is the base of the flagpole at 0,32.
			// 	new google.maps.Point(0, 32)
			// );

			// The marker, positioned at property
			var marker = new google.maps.Marker({
				position: mapCenter, 
				map: map,
				// icon : markerIcon
			});

			divMap.style.height = "500px";
		}

	}
}

//Create blog post
//Show clicked Blog
const displayBlog = () => {
	const id = getItemId();
	if(id) {
		blog.map(b =>{
			if (b.id == id) {
				document.title = b.title +' | Zeeland Homes Limited, the most valuable real estate deals under the safest terms';
				selectedBlogHTML(b);
			}
		});
	}
}

const selectedBlogHTML = (blog) =>{
	const title = blog.title;
	const image = blog.image;
	const publishDate = blog.publishDate;
	const blogStructure = blog.structure;

	//Get the header section to place image and title
	const headerSection = document.querySelector("section.post-header");

	//if there is header section
	if (headerSection) {
		//Create a fragment to easy append header section elements
		const fragHeader = document.createDocumentFragment(); 

		// if we have title
		if(title){
			const divH1 = document.createElement('div');//h1 div
			divH1.classList.add("title-wrap", "container");

			const h1 = document.createElement('h1');
			h1.innerHTML = title;
			//Append h1 to div
			divH1.append(h1);

			//Append div to header fragment
			fragHeader.append(divH1);
		}

		//if we have publish date
		if(publishDate){
			const divDate = document.createElement('div');//h1 div
			divDate.classList.add("blog-post-date-wrap", "container");

			const p = document.createElement('p');
			const pDate = new Date(publishDate);
			// console.log("Datee", pDate.toDateString());
			//Get the in a human-readable string
			p.innerHTML = pDate.toDateString();
			//Append p to div
			divDate.append(p);

			//Append div to header fragment
			fragHeader.append(divDate);
		}

		//if we have an image
		if(image){
			const divImage = document.createElement('div');//h1 div
			divImage.classList.add("blog-post-image-wrap", "container");

			const img = document.createElement('img');
			img.classList.add('blog-post-header-img');
			img.src = imgBlogFolder + "/" + image;
			img.alt = "Image of blog post, ";
			img.srcset = generateImgSrcset(img.src);

			//Append blog image to div
			divImage.append(img);

			//Append div to header fragment
			fragHeader.append(divImage);
		}

		//Append the fragment to section
		headerSection.append(fragHeader);
	}

	const contentSection = document.querySelector("section.post-content");

	if(contentSection){
		if(blogStructure){
			if (Array.isArray(blogStructure)) {
				//Create fragment for optimization
				const frag = document.createDocumentFragment();
				blogStructure.forEach(struc=>{
					console.log("structure", struc);
					frag.append(createBlogElement(struc));
				});
				//Append fragment to content section
				contentSection.append(frag);
			} else {
				console.log("Warning!!","blog structure is not an array")
			}
		}
	}
}

const createBlogElement = (struc) =>{
	if(struc.type == "p"){
		const pCont = struc.content;
		if(Array.isArray(pCont)){
			const frag = document.createDocumentFragment();
			pCont.forEach(pC=>{
				console.log("p is an array", pC);
				const p = document.createElement('p');
				p.classList.add("blog-post-content", "blog-post-p");
				p.innerHTML = pC;
				frag.append(p);
			});
			//Append fragment to content section
			return frag;
		}
		else{
			const p = document.createElement('p');
			p.classList.add("blog-post-content", "blog-post-p");
			p.innerHTML = pCont;

			return p;
		}
	}

	if(struc.type == "h2"){
		const h2 = document.createElement('h2');
		h2.classList.add("blog-post-content", "blog-post-h2");
		h2.innerHTML = struc.content;
		
		return h2;
	}

	if(struc.type == "h3"){
		const h3 = document.createElement('h3');
		h3.classList.add("blog-post-content", "blog-post-h3");
		h3.innerHTML = struc.content;
		
		return h3;
	}

	if(struc.type == "ul"){
		const ul = document.createElement('ul');
		ul.classList.add("blog-post-content", "blog-post-ul", "container");

		//get contents in the ul item
		const ulChildren = struc.content;
		
		if (Array.isArray(ulChildren)) {
			//Create fragment for optimization
			const fragUl = document.createDocumentFragment();

			ulChildren.forEach(cont=>{
				console.log("ul Content", cont);

				//Check if list has an object inside it
				if(toString.call(cont) === "[object Object]" ){
					console.log("KKKK", cont);
					fragUl.append(createBlogElement(cont));
				}
				else{
					const li = document.createElement('li');
					li.classList.add("blog-post-content", "blog-post-li");
					li.innerHTML = cont;
					fragUl.append(li);
				}
			});
			//Append fragment to content ul
			ul.append(fragUl);
		} 
		else {
			console.log("Warning!!","blog ul is not an array")
		}

		return ul;
	}

	if(struc.type == "ol"){
		const ol = document.createElement('ol');
		ol.classList.add("blog-post-content", "blog-post-ol", "container");

		//get contents in the ol item
		const olChildren = struc.content;
		
		if (Array.isArray(olChildren)) {
			//Create fragment for optimization
			const fragOl = document.createDocumentFragment();

			olChildren.forEach(cont=>{
				console.log("ol Content", cont);

				//Check if list has an object inside it
				if(toString.call(cont) === "[object Object]" ){
					console.log("KKKK", cont);
					fragOl.append(createBlogElement(cont));
				}
				else{
					const li = document.createElement('li');
					li.classList.add("blog-post-content", "blog-post-li");
					li.innerHTML = cont;
					fragOl.append(li);
				}
			});
			//Append fragment to content ol
			ol.append(fragOl);
		} 
		else {
			console.log("Warning!!","blog ol is not an array")
		}

		return ol;
	}

	if(struc.type == "article"){
		const article = document.createElement('article');
		article.classList.add("blog-post-content", "blog-post-article", "container");

		//Declare article content
		const articleContent = struc.content;

		if (Array.isArray(articleContent)) {
			//Create fragment for optimization
			const fragArticle = document.createDocumentFragment();

			articleContent.forEach(cont=>{
				console.log("article Content", cont);
				fragArticle.append(createBlogElement(cont));
			});
			//Append fragment to content section
			article.append(fragArticle);
		} else {
			console.log("Warning!!","blog article is not an array")
		}
		
		return article;
	}
}

const getDepFunction = () =>{
	generateSocialMediaHTML();

	generatePropertyHTML();
	generateFeaturedPropertyHTML();

	generateBlogHTML();
	generateFeaturedBlogHTML();

	generateSliderHTML();

	if(top.document.location.pathname == "/property.html"){
		displayProperty();
	}

	if(top.document.location.pathname == "/blog-post.html"){
		displayBlog();
	}

	endFunctTimeOut();
}

const startFunctTimeOut = () =>{
	timeIdS = 	window.setTimeout(getDepFunction, 2000); 
	console.log("dd*in");
}

const endFunctTimeOut = () =>{
	window.clearTimeout(timeIdS);
	console.log("dd*out");
}

// On application start, perform these
const startApp = () => {
	toggleMenuBtn(); //Enable Toggle Menu
	setAriaBasedOnScreen();

	// new Promise( () => {
	// 	getSocialMedia()
	// })
	// .then(getProperties())
	// .then(getBlog())
	// .then(getSlide())
	// .then(navSlider())
	// .catch(
	// 	console.log("err!!!", Error)
	// );
	
	// getSocialMedia();
	// getProperties();
	// getBlog();
	// getSlide();
	// navSlider();

	fetchSocialMedia();
	fetchProperties();
	fetchBlog();
	fetchSlider();
	navSlider();

	// // window.addEventListener('load', function() {
	// 	generateSocialMediaHTML();

	// 	generatePropertyHTML();
	// 	generateFeaturedPropertyHTML();

	// 	generateBlogHTML();
	// 	generateFeaturedBlogHTML();

	// 	generateSliderHTML();
	// // })

	// startFunctTimeOut();
	// endFunctTimeOut();
};

// $.ajax({
// 	url:startApp(),
// 	success:function(){
// 		getDepFunction();
// 	}
// })

// $.when(startApp()).then(getDepFunction());

startApp();
// $.ajax({
// 	url:startApp(),
// 	success:function(){
// 		getDepFunction();
// 	}
// })

// window.setInterval(getDepFunction, 4000);

window.addEventListener('load', function() {
	console.log("dd*");
	startFunctTimeOut();
	// endFunctTimeOut();
});