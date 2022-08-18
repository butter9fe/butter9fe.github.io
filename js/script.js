// Prevent mobile from scrolling
window.addEventListener("scroll", preventMotion, false);
window.addEventListener("touchmove", preventMotion, false);

function preventMotion(event)
{
    window.scrollTo(0, 0);
    event.preventDefault();
    event.stopPropagation();
}

//Change nav background from transparent to opaque after scrolling
let page = document.querySelector(".page");
let navBar = document.querySelector("nav");
page.addEventListener('scroll', () => {
    if (page.scrollTop >= 100)
    {
        navBar.classList.add("scrolled");
    }
    else
    {
        navBar.classList.remove("scrolled");
    }
});

// Mobile navbar
let hamburger = document.querySelector(".hamburger-button");
let mobileNav = document.getElementById("mobile-nav");
hamburger.addEventListener('click', () => mobileNav.classList.toggle("active"))

//
// First Page Functions
//
if (document.URL.includes("index.html"))
{
    // Landing animations
    let title = document.getElementById("title");
    let para = document.querySelector(".landing > div:first-child p");
    let scroll = document.getElementById("scroll");
    let glowsticks = document.getElementById("glowsticks");

    page.addEventListener('scroll', () => landingScrollEvents(title, para, scroll, glowsticks));

    // Infinitely draggable carousel
    let sliderContainer = document.querySelector('.slides-container');
    let sliderItems = document.querySelector('.slides');
    let prev = document.getElementById('prev');
    let next = document.getElementById('next');

    slide(sliderContainer, sliderItems, prev, next);
}

// Landing animations
function landingScrollEvents(title, para, scroll, glowsticks) {
    // Move elements according to scroll
    let value = page.scrollTop;
    title.style.transform = `translateX(${value}px)`;
    para.style.transform  = `translateX(${value}px)`;
    glowsticks.style.transform = `translateY(-50%) translateX(${value}px)`;
    scroll.style.transform =`translateY(${value}px)`;

    //Make "scroll for more" fade away with scroll, with 200 px being completely invisble
    scroll.style.opacity = `calc((200 - ${value}) / 2)`;

    // Make elements actually hidden when scrolling after breakpoint
    if (page.scrollTop >= 400)
    {
        title.classList.add("hide");
    }
}

//Infinitely draggable carousel
function slide(sliderContainer, sliderItems, prev, next) {
    let posX1 = 0;
    let posX2 = 0;
    let posInitial, posFinal;
    let threshold = 100;
    let slides = document.querySelectorAll('.slides > div');
    let slidesLength = slides.length;
    let slideSize = 26 * 16;
    let firstSlide = slides[0];
    let lastSlide = slides[slidesLength - 1];
    let cloneFirst = firstSlide.cloneNode(true);
    let cloneLast = lastSlide.cloneNode(true);
    let prevIndex = slidesLength - 1;
    let index = 0;
    let allowShift = true;
    slides[0].classList.add('selected');

    // Clone first and last slide to allow scrolling infinitely
    sliderItems.appendChild(cloneFirst);
    sliderItems.insertBefore(cloneLast, firstSlide);

    // Mouse events (for PC)
    sliderItems.onmousedown = dragStart;

    // Touch events (for Mobile)
    sliderItems.addEventListener('touchstart', dragStart);
    sliderItems.addEventListener('touchend', dragEnd);
    sliderItems.addEventListener('touchmove', dragAction);

    // Click events
    prev.addEventListener('click', () => shiftSlide(-1) );
    next.addEventListener('click', () => shiftSlide(1) );
  
    // Transition events
    sliderItems.addEventListener('transitionend', checkIndex);

    // Mouse down/Touch on slides
    function dragStart (e) {
        e.preventDefault();
        sliderContainer.style.cursor = "grabbing";
        posInitial = sliderItems.offsetLeft;

        if (e.type == 'touchstart') {
            posX1 = e.touches[0].clientX;
        } else {
            posX1 = e.clientX;
            document.onmouseup = dragEnd;
            document.onmousemove = dragAction;
        }
    }


    function dragAction(e) {
        sliderContainer.style.cursor = "grabbing";
        if (e.type == 'touchmove') {
            posX2 = posX1 - e.touches[0].clientX;
            posX1 = e.touches[0].clientX;
          } else {
            posX2 = posX1 - e.clientX;
            posX1 = e.clientX;
          }
          sliderItems.style.left = (sliderItems.offsetLeft - posX2) + "px";
    }

    function dragEnd () {
        sliderContainer.style.cursor = "grab";
        posFinal = sliderItems.offsetLeft;
        if (posFinal - posInitial < -threshold) {
          shiftSlide(1, 'drag');
        } else if (posFinal - posInitial > threshold) {
          shiftSlide(-1, 'drag');
        } else {
          sliderItems.style.left = (posInitial) + "px";
        }
    
        document.onmouseup = null;
        document.onmousemove = null;
      }

       
  function shiftSlide(dir, action) {
    sliderItems.classList.add('shifting');
    
    if (allowShift) {
      if (!action) { posInitial = sliderItems.offsetLeft; }

      prevIndex = index;
      if (dir == 1) {
        sliderItems.style.left = (posInitial - slideSize) + "px";
        index++;      
      } else if (dir == -1) {
        sliderItems.style.left = (posInitial + slideSize) + "px";
        index--;      
      }
    }
    
    allowShift = false;
  }
    
  function checkIndex () {
    sliderItems.classList.remove('shifting');

    if (index == -1) {
      sliderItems.style.left = -(slidesLength * slideSize) + "px";
      index = slidesLength - 1;
    }

    if (index == slidesLength) {
      sliderItems.style.left = -(1 * slideSize) + "px";
      index = 0;
    }
    
    allowShift = true;
    slides[prevIndex].classList.remove('selected');
    slides[index].classList.add('selected');
  }
}

//
// Second Page Functions
//
if(document.URL.includes("rise.html"))
{
    let timelineItems = document.querySelectorAll(".timeline-item");

    page.addEventListener('scroll', () => updateHighlights(timelineItems));
}

//Highlight timeline when passed the dot
function updateHighlights (timelineItems) {
    console.log(timelineItems[0].getBoundingClientRect().top);
    timelineItems.forEach((item) => {
        let itemBounds = item.getBoundingClientRect();
        
        if (itemBounds.top < 450)
        {
            item.classList.add('highlighted');
        }
        else
        {
            item.classList.remove('highlighted');
        }
    });
}

//
// Third Page Functions
//
if (document.URL.includes("technology.html"))
{
  // Parallax effect for cards
  let cards = document.querySelectorAll('.tech-item');
  let cardSubs = document.querySelectorAll('.tech-item > div');

  cards.forEach((card, index) => {
    card.addEventListener('mousemove', (e) => transformCard(e, card, cardSubs[index]));
    card.addEventListener('mouseenter', () => handleMouseEnter(cardSubs[index]));
    card.addEventListener('mouseleave', () => handleMouseLeave(cardSubs[index]));
  });

  // Pop up modal
  let modals = document.querySelectorAll('.modal');
  let buttons = document.querySelectorAll('.tech-item button');
  let closeButtons = document.querySelectorAll('.modal-header span');
  
  buttons.forEach((button, index) => {
    // Open respective modal on click
    button.addEventListener('click', () => modals[index].style.display = 'block');
    // Close modal when clicking on closebutton or outside of modal
    closeButtons[index].addEventListener('click', () => modals[index].style.display = 'none');

    window.addEventListener('click', (e) => {
      if (e.target == modals[index]) {
        modals[index].style.display = 'none';
      }
    });
  });
}

function transformCard(mouseEvent, card, cardSub) {
  let mouseX, mouseY;
  mouseX = mouseEvent.pageX;
  mouseY = mouseEvent.pageY;

  const centerX = card.offsetLeft + card.clientWidth / 2;
  let centerY = card.offsetTop  + card.clientHeight / 2;
  if (window.innerWidth <= 720)
    centerY =  card.clientHeight / 2;
  
  const percentX = (mouseX - centerX) / (card.clientWidth / 2);
  const percentY = -((mouseY - centerY) / (card.clientHeight / 2));

  cardSub.style.transform = "perspective(400px) rotateY(" + percentX * 5 + "deg) rotateX(" + percentY * 5 + "deg)";
}

function handleMouseEnter(cardSub) {
  setTimeout(() => {
    cardSub.style.transition = "";
  }, 100);
  cardSub.style.transition = "transform 0.3s";
}

function handleMouseLeave(cardSub) {
  cardSub.style.transition = "transform 0.3s";
  setTimeout(() => {
    cardSub.style.transition = "";
  }, 100);

  //reset transform
  cardSub.style.transform = "perspective(400px) rotateY(0deg) rotateX(0deg)";
}

//
// Fourth Page Functions
//
if (document.URL.includes("database.html"))
{
  // Dropdown
  let dropdown = document.querySelector('.dropdown');
  let items = document.querySelectorAll('.dropdown input');
  dropdown.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropdown.classList.toggle('expanded');

    //Sometimes e.target returns a span and breaks this. This check prevents that bug
    if (e.target.nodeName === "LABEL")
    {
      // Remove checked attribute for everything first
      items.forEach((item) => item.removeAttribute("checked"));

      //e.target returns the label. Select the input element from label's for attribute
      let selected = document.querySelector(`.dropdown input[id=${e.target.getAttribute("for")}]`);
      selected.setAttribute("checked", "checked");
    }
  });

  // Close dropdown when clicking outside as well
  document.addEventListener('click', () => {
    dropdown.classList.remove('expanded');
  });

  // Searching
  // Store array of objects of agencies
  const agencies = [
    { name: "hololive", languages: ["English", "Japanese", "Indonesian"], logo: "images/database_hololive.png", genders: 'Female', talents: '71', link: "https://virtualyoutuber.fandom.com/wiki/Hololive" },
    { name: "holostars", languages: ["English", "Japanese"], logo: "images/database_holostars.png", genders: 'Male', talents: '17', link: "https://virtualyoutuber.fandom.com/wiki/Hololive#HOLOSTARS_2" },
    { name: "NIJISANJI", languages: ["English", "Japanese", "Indonesian", "Indian", "Korean"], logo: "images/database_nijisanji.png", genders: 'Mixed', talents: '169', link: "https://virtualyoutuber.fandom.com/wiki/NIJISANJI" },
    { name: "VShojo", languages: ["English", "Japanese"], logo: "images/database_vshojo.png", genders: 'Female', talents: '12', link: "https://virtualyoutuber.fandom.com/wiki/VShojo"},
    { name: "VSPO!", languages: ["Japanese"], logo: "images/database_vspo.png", genders: "Female", talents: '16', link: "https://virtualyoutuber.fandom.com/wiki/VSPO!"},
    { name: "Tsunderia", languages: ["English"], logo: "images/database_tsunderia.png", genders: 'Mixed', talents: '16', link: "https://virtualyoutuber.fandom.com/wiki/Tsunderia"},
    { name: "PRISM Project", languages: ["English"], logo: "images/database_prism.png", genders: 'Female', talents: '12', link: "https://virtualyoutuber.fandom.com/wiki/PRISM_Project"},
    { name: "Production Kawaii", languages: ["English"], logo: "images/database_kawaii.png", genders: 'Female', talents: '7', link: "https://virtualyoutuber.fandom.com/wiki/Production_kawaii"},
    { name: "Phase-Connect", languages: ["English"], logo: "images/database_phase.png", genders: 'Female', talents: '15', link: "https://virtualyoutuber.fandom.com/wiki/Phase-Connect"},
    { name: "Neo-Porte", languages: ["Japanese"], logo: "images/database_neoporte.png", genders: 'Mixed', talents: '8', link: "https://virtualyoutuber.fandom.com/wiki/Neo-Porte"},
    { name: "VirtuaReal", languages: ["Chinese"], logo: "images/database_virtuareal.png", genders: 'Mixed', talents: '72', link: "https://virtualyoutuber.fandom.com/wiki/VirtuaReal"},
    { name: "VOMS Project", languages: ["Japanese"], logo: "images/database_voms.png", genders: 'Mixed', talents: '4', link: "https://virtualyoutuber.fandom.com/wiki/VOMS_Project"},
    { name: "Eilene Family", languages: ["English", "Japanese", "French"], logo: "images/database_eileen.png", genders: 'Mixed', talents: '17', link: "https://virtualyoutuber.fandom.com/wiki/Eilene#Eilene_Family"},
    { name: "774 inc.", languages: ["Japanese"], logo: "images/database_seven.png", genders: 'Female', talents: '27', link: "https://virtualyoutuber.fandom.com/wiki/774_inc."},
    { name: "WAKTAVERSE", languages: ["Korean"], logo: "images/database_wakta.jpg", genders: 'Female', talents: '6', link: "https://www.youtube.com/c/welshcorgimessi/channels"}
  ];
  
  let page = document.querySelector('.database');
  document.body.onload = () => loadResults(page, agencies);
  
  let form = document.querySelector('form');
  form.addEventListener('submit', (e) => {
    // Stop page from reloading on form submit
    e.preventDefault();
    let nameFilter = document.getElementById('name').value.toUpperCase();
    // Select the checked input
    let languageFilter = document.querySelector('.dropdown input:checked').value.toString();
    
    let filteredAgencies = agencies.filter((agency) => {
      if (languageFilter === "All") {
        // Just filter agency name, no need filter language
        return agency.name.toUpperCase().startsWith(nameFilter);
      }
      else if (languageFilter === "Others") {
        // Filters agencies that have neither English nor Japanese nor Indonesian talents
        return agency.name.toUpperCase().startsWith(nameFilter) &&
        !agency.languages.includes("English") &&
        !agency.languages.includes("Japanese") &&
        !agency.languages.includes("Indonesian");
      }
      else {
        // Filters agencies that include talents with the selected language filter
        return agency.name.toUpperCase().startsWith(nameFilter) && 
        agency.languages.includes(languageFilter);
      }
    });
    
    loadResults(page, filteredAgencies);
  });
}

 /* Loop through array to generate these elements for each agency:
  <div class="database-item-wrapper">
      <div class="database-item-decor"></div>
      <a class="database-item" href="LINK" target="_blank">
          <img src="LOGO" alt="NAME" />
          <div>
              <h2>NAME <span>&bull; TALENTS Talents</span></h2>
              <p><strong>Languages: </strong>LANGUAGES</p>
          </div>
      </a>
  </div>
*/
function loadResults(page, agencies) {
  // Clear initial elements if any inside the page, to remove duplicates for multiple calls of this function
  page.innerHTML = '';
  agencies.forEach((agency) => {
    let databaseItemWrapper = document.createElement("div");
    databaseItemWrapper.classList.add('database-item-wrapper');
    page.appendChild(databaseItemWrapper);

    let databaseItemDecor = document.createElement("div");
    databaseItemDecor.classList.add('database-item-decor');
    databaseItemWrapper.appendChild(databaseItemDecor);

    let databaseItem = document.createElement("a");
    databaseItem.classList.add('database-item');
    databaseItem.href = agency.link;
    databaseItem.target = "_blank";
    databaseItemWrapper.appendChild(databaseItem);

    let logo = document.createElement("img");
    logo.src = agency.logo;
    logo.alt = agency.name;
    databaseItem.appendChild(logo);

    let content = document.createElement("div");
    databaseItem.appendChild(content);

    let header = document.createElement("h2");
    header.innerHTML = `${agency.name} <span>&bull; ${agency.talents} ${agency.genders} Talents</span>`;
    content.appendChild(header);

    let info = document.createElement("p");
    // Separate array of languages by a comma
    info.innerHTML = `<strong>Languages:</strong> ${agency.languages.join(", ")}`;
    content.appendChild(info);
  });
}