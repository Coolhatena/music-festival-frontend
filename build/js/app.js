document.addEventListener('DOMContentLoaded', () => {
	fixedNav();
	createGallery();
	highlightSection();
	scrollNav();
})

// Keep the nav bar at the top on large screens
const fixedNav = () => {
	const header = document.querySelector('.header');
	const aboutFestival = document.querySelector('.about-festival');

	window.addEventListener('scroll', () => {
		if( aboutFestival.getBoundingClientRect().bottom < 1 ){
			header.classList.add('fixed');
		} else {
			header.classList.remove('fixed');
		}
	})
}

// Close gallery imagen modal
const closeImageModal = () => {
	const modal = document.querySelector('.modal');
	modal.classList.add('fadeOut');
	const body = document.querySelector('body');
	body.classList.remove('overflow-hidden');
	
	setTimeout(() => {
		modal?.remove();
	}, 500)
}

// Open gallery imagen
const openImgModal = index => {
	// Create image element
	const img = document.createElement('IMG');
	img.src = `src/img/gallery/full/${index}.jpg`;
	img.alt = "Imagen Galeria";

	
	// Generate close button
	const btnClose = document.createElement('BUTTON');
	btnClose.textContent = 'X';
	btnClose.classList.add('btn-close');
	btnClose.onclick = closeImageModal;

	// Generate modal
	const modal = document.createElement('DIV');
	modal.classList.add('modal');
	modal.onclick = closeImageModal;

	// Add elements to modal
	modal.appendChild(img);
	modal.appendChild(btnClose);

	// Disable scroll
	const body = document.querySelector('body');
	body.classList.add('overflow-hidden');

	// Add to hmtl
	body.appendChild(modal);
}

// Create the gallery section
const createGallery = () => {
	const gallery = document.querySelector('.gallery-images');

	const imageQuantity = 16;
	for( let i = 1; i <= imageQuantity; i++ ){
		const img = document.createElement('IMG');
		img.src = `src/img/gallery/full/${i}.jpg`;
		img.alt = "Imagen Galeria";

		// Event handler
		img.onclick = () => openImgModal(i);

		gallery.appendChild( img );
	}
}

// Highlight the section on screen with yellow text on the nav
const highlightSection = () => {
	document.addEventListener('scroll', () => {
		const sections = document.querySelectorAll('section');
		const navLinks = document.querySelectorAll('.main-nav a');
		let actualSectionId = "";

		sections.forEach( section => {
			const sectionTop = section.offsetTop;
			const sectionHeight = section.clientHeight;
			const sectionScrollPosition = (sectionTop - sectionHeight / 3); // The distance from the section to the top of the image minus a third of the section height
			
			if( window.scrollY >= sectionScrollPosition ){
				actualSectionId = section.id;
			}
		})

		navLinks.forEach( link => {
			if (link.getAttribute('href') == `#${actualSectionId}`){
				link.classList.add('active');
			} else {
				link.classList.remove('active');
			}
		})
	})
}

// Customize the way the nav bar scrolls to the sections 
const scrollNav = () => {
	const navLinks = document.querySelectorAll('.main-nav a');

	navLinks.forEach( link => {
		link.addEventListener('click', e => {
			e.preventDefault();

			targetSectionID = e.target.getAttribute('href');
			const section = document.querySelector(targetSectionID);
			section.scrollIntoView({behavior: 'smooth'}); // 'smooth' makes the scrolling more visually comfortable
		})
	})
}