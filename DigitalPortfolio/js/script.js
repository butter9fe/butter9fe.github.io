//Navbar
let hamburger = document.querySelector(".hamburger-button");
let mobileNav = document.getElementById("navigation");
hamburger.addEventListener("click", () => mobileNav.classList.toggle("active"));
const page = document.getElementsByClassName("page")[0];

if (document.URL.includes("index.html")) {
  // hide navbar until toggled
  const navbar = document.querySelector("#navigation.landingNav");
  const wrapper = document.getElementById("tiles");
  const title1 = document.getElementById("title");
  const title2 = document.getElementById("slide2");
  const floatingItems = document.getElementById("floating-items");
  const scrollDown = document.getElementById("scroll");

  let columns = 0,
    rows = 0,
    toggled = false;

  const toggle = () => {
    let value = page.scrollTop;
    if (value > 0) return;

    toggled = !toggled;

    document.body.classList.toggle("toggled");
    if (toggled) {
      title1.style.opacity = "0%";

      navbar.style.opacity = "100%";
      setTimeout(() => {
        navbar.style.zIndex = "9";
        title2.style.opacity = "100%";
        const normals = title2.getElementsByClassName("normal");
        for (var i = 0; i < normals.length; i++) {
          normals[i].style.opacity = "60%";
        }
        floatingItems.style.opacity = "80%";
        page.style.overflowY = "auto";
      }, 300);
    } else {
      navbar.style.zIndex = "0";
      navbar.style.opacity = "0%";
      title2.style.opacity = "0%";
      page.style.overflowY = "hidden";

      setTimeout(() => {
        title1.style.opacity = "100%";
      }, 300);
    }
  };

  const handleOnClick = (index) => {
    toggle();

    anime({
      targets: ".tile",
      opacity: toggled ? 0 : 1,
      delay: anime.stagger(50, {
        grid: [columns, rows],
        from: index,
      }),
    });
  };

  const createTile = (index) => {
    const tile = document.createElement("div");

    tile.classList.add("tile");

    tile.style.opacity = toggled ? 0 : 1;

    tile.onclick = (e) => handleOnClick(index);

    return tile;
  };

  const createTiles = (quantity) => {
    Array.from(Array(quantity)).map((tile, index) => {
      wrapper.appendChild(createTile(index));
    });
  };

  const createGrid = () => {
    wrapper.innerHTML = "";

    const size = document.body.clientWidth > 800 ? 100 : 50;

    columns = Math.floor(document.body.clientWidth / size);
    rows = Math.floor(document.body.clientHeight / size);

    wrapper.style.setProperty("--columns", columns);
    wrapper.style.setProperty("--rows", rows);

    createTiles(columns * rows);
  };

  createGrid();

  window.onresize = () => createGrid();

  // Landing animations
  function landingScrollEvents() {
    // Move elements according to scroll
    let value = page.scrollTop;
    //title2.style.transform = `translate(-50%, -50%)`;
    floatingItems.style.transform = `translateY(-50%) translateX(${value}px)`;
    scrollDown.style.transform = `translateY(${value}px)`;

    //Make "scroll for more" fade away with scroll, with 200 px being completely invisble
    const landing = document.getElementsByClassName("landing")[0];
    landing.style.opacity = `calc((400 - ${value}) / 2)`;
    scrollDown.style.opacity = `calc((200 - ${value}) / 2)`;

    // Make elements actually hidden when scrolling after breakpoint
    if (page.scrollTop >= 400) {
      landing.style.opacity = "0";
      landing.style.pointerEvents = "none";
    } else if (page.scrollTop == 0) {
      landing.style.pointerEvents = "auto";
    }
  }

  page.addEventListener("scroll", () => landingScrollEvents());

  // About parallax
  const about = document.getElementsByClassName("about")[0];
  const photoItem = document.getElementsByClassName("photo-item")[0];
  const photoItemSub = document.querySelector(".photo-item > div");

  about.addEventListener("mousemove", (e) =>
    transformCard(e, photoItem, photoItemSub)
  );
  about.addEventListener("mouseenter", () => handleMouseEnter(photoItemSub));
  about.addEventListener("mouseleave", () => handleMouseLeave(photoItemSub));

  function transformCard(mouseEvent, photoItem, photoItemSub) {
    let mouseX, mouseY;
    mouseX = mouseEvent.pageX;
    mouseY = mouseEvent.pageY - 400;

    const centerX = photoItem.offsetLeft + photoItem.clientWidth / 2;
    let centerY = photoItem.offsetTop + photoItem.clientHeight / 2;
    if (window.innerWidth <= 720) centerY = photoItem.clientHeight / 2;

    const percentX = (mouseX - centerX) / (photoItem.clientWidth / 2);
    const percentY = -((mouseY - centerY) / (photoItem.clientHeight / 2));

    photoItemSub.style.transform =
      "perspective(400px) rotateY(" +
      percentX * 5 +
      "deg) rotateX(" +
      percentY * 5 +
      "deg)";
  }
}

function handleMouseEnter(photoItemSub) {
  setTimeout(() => {
    photoItemSub.style.transition = "";
  }, 100);
  photoItemSub.style.transition = "transform 0.3s";
}

function handleMouseLeave(photoItemSub) {
  photoItemSub.style.transition = "transform 0.3s";
  setTimeout(() => {
    photoItemSub.style.transition = "";
  }, 100);

  //reset transform
  photoItemSub.style.transform =
    "perspective(200px) rotateY(0deg) rotateX(0deg)";
}

if (document.URL.includes("work.html")) {
  const track = document.getElementById("image-track");
  const imageContainers = track.getElementsByClassName("work-image");
  const images = document.querySelectorAll(".work-image img");

  // Make an invisible slider that follows no matter where user presses
  window.onmousedown = (e) => {
    track.dataset.mouseDownAt = e.clientX;
  };

  window.onmousemove = (e) => {
    const track = document.getElementById("image-track");

    const handleOnDown = (e) => {
      track.dataset.mouseDownAt = e.clientX;
      track.style.cursor = "grabbing";
    };

    const handleOnUp = () => {
      track.dataset.mouseDownAt = "0";
      track.dataset.prevPercentage = track.dataset.percentage;
      track.style.cursor = "grab";
    };

    const handleOnMove = (e) => {
      if (track.dataset.mouseDownAt === "0") return;

      const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

      const percentage = (mouseDelta / maxDelta) * -100 - 15,
        nextPercentageUnconstrained =
          parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(
          Math.min(nextPercentageUnconstrained, 20),
          -55
        );

      track.dataset.percentage = nextPercentage;

      track.animate(
        {
          transform: `translate(${nextPercentage}%, -30%)`,
        },
        { duration: 1200, fill: "forwards" }
      );

      for (const image of images) {
        let objPosition = 50 - nextPercentage;
        if (objPosition > 100) objPosition = 100;
        image.animate(
          {
            objectPosition: `${objPosition}% center`,
          },
          { duration: 1200, fill: "forwards" }
        );
      }

      if (nextPercentage >= 15) {
        imageContainers[0].classList.add("selected");
        imageContainers[1].classList.remove("selected");
        imageContainers[2].classList.remove("selected");
      } else if (nextPercentage >= -20 && nextPercentage <= -10) {
        imageContainers[0].classList.remove("selected");
        imageContainers[1].classList.add("selected");
        imageContainers[2].classList.remove("selected");
      } else if (nextPercentage <= -50) {
        imageContainers[0].classList.remove("selected");
        imageContainers[1].classList.remove("selected");
        imageContainers[2].classList.add("selected");
      } else {
        imageContainers[0].classList.remove("selected");
        imageContainers[1].classList.remove("selected");
        imageContainers[2].classList.remove("selected");
      }
    };

    /* -- Had to add extra lines for touch events -- */

    window.onmousedown = (e) => handleOnDown(e);

    window.ontouchstart = (e) => handleOnDown(e.touches[0]);

    window.onmouseup = (e) => handleOnUp(e);

    window.ontouchend = (e) => handleOnUp(e.touches[0]);

    window.onmousemove = (e) => handleOnMove(e);

    window.ontouchmove = (e) => handleOnMove(e.touches[0]);

    track.addEventListener(
      "dragstart",
      function (event) {
        event.dataTransfer.setDragImage(track, 0, 0);
      },
      false
    );
  };
}

if (document.URL.includes("workcontent.html")) {
  page.style.overflowY = "auto";
  const urlParams = new URLSearchParams(window.location.search);
  let id = parseInt(urlParams.get("id") ?? "0");
  if (id > 2 || id < 0) id = 0;

  const nextButton = document.getElementById("nextProject");
  const prevButton = document.getElementById("prevProject");
  const videoPlayer = document.getElementById("video");
  const personCount = document.getElementById("personCount");
  const contentOverview =
    document.getElementsByClassName("content-overview")[0];
  const contentParagraph =
    document.getElementsByClassName("content-paragraph")[0];
  const madeIn = document.getElementById("madeIn");
  const language = document.getElementById("language");
  const sourceLink = document.getElementById("sourceLink");
  sourceLink.style.display = "none";

  nextButton.addEventListener("click", () => {
    window.location.href = `workcontent.html?id=${id + 1}`;
  });
  prevButton.addEventListener("click", () => {
    window.location.href = `workcontent.html?id=${id - 1}`;
  });

  switch (id) {
    case 0:
      videoPlayer.src = "https://www.youtube.com/embed/DvPKXcdUnf0?rel=0";
      prevButton.style.display = "none";
      break;
    case 1:
      videoPlayer.src = "https://www.youtube.com/embed/Gq1rKBWCH6Y?rel=0";
      contentOverview.getElementsByTagName("h2")[0].innerHTML =
        "Hollow Knight Remake<span>.</span>";
      contentOverview.getElementsByTagName("p")[0].innerHTML =
        "2D Game made in <strong>Unity</strong>";
      personCount.innerHTML = "Solo";
      madeIn.innerHTML = "August 2022";
      language.innerHTML = "C# / Unity";
      contentParagraph.innerHTML =
        "<p>I tried to remake a simplified version of a popular game <strong>Hollow Knight</strong> in Unity. The controls and gameplay are <strong>one-to-one</strong> with the original Hollow Knight series. The player is able to attack, jump, and absorb souls to heal.</p><p>There are a total of <strong>two</strong> separate enemies, and one <strong>boss battle</strong>. Each enemy defeated would fill up a <strong>Soul Gauge</strong> that the player can use to heal. The first enemy is just a normal <strong>Crawlid</strong> with no special moves, each attack by the player would cause it to get <strong>knocked back</strong>. The next enemy is a <strong>Husk Warrior</strong>. It can <strong>attack</strong> with its sword when the player is near. It was a <strong>shield</strong>, which it would use to <strong>block</strong> the player when attacked, and take <strong>no damage</strong>. However, each time it uses its shield, it is <strong>unable to move</strong>, so the player can take this chance to <strong>attack from behind</strong> to damage it.</p><p>The final boss battle is the <strong>False Knight</strong>. Upon entering its arena, gates will close behind you - trapping you with the Knight until he is defeated. The False Knight will try to <strong>jump on the player</strong>, and each time the player's attacks hit him, his <strong>armour</strong> will deteriorate. When his armour is completely broken, he will <strong>lie vulnerable on the floor</strong> for a couple seconds, for the player to actually damage it. Each attack in his vulnerable state will also drop <strong>soul</strong>, so the player can also heal while the boss is down.</p>";
      break;
    case 2:
      videoPlayer.src = "https://www.youtube.com/embed/sCDDu0kRNyY?rel=0";
      contentOverview.getElementsByTagName("h2")[0].innerHTML =
        "VTuber Site<span>.</span>";
      contentOverview.getElementsByTagName("p")[0].innerHTML =
        "Website made using <strong>pure CSS, HTML and JS</strong> for Web Development Module.";
      personCount.innerHTML = "Solo";
      madeIn.innerHTML = "August 2022";
      language.innerHTML = "HTML / CSS / Javascript / SQL / PHP";
      sourceLink.style.display = "flex";
      sourceLink.getElementsByTagName("p")[0].innerHTML =
        "<a href='https://butterkn1f.github.io/VTubers/index.html' target='__blank'>Live Website Link</a>";

      contentParagraph.innerHTML =
        "<p>This was the second personal website I created for this module. I decided to make my website to be based on <strong>Virtual YouTubers</strong>, which is a topic I am really passionate about. The website is also <strong>responsive</strong> on mobile and tablet viewports, as seen in the video.</p><p>The 'VIRTUAL' text is purely animated using CSS animations, and so are the other button glitch effects. In the landing page, there is an <strong>infinitely scrolling carousell</strong>.</p><p>There is a lot of interactivity based on scroll position using <strong>Javascript</strong> <p>There is also a database page, which makes use of a database created inside <strong>MySQL</strong>. The search function then filters the database items, through the use of <strong>PHP</strong> to communicate between the website and the database.</p>";
      nextButton.style.display = "none";
      break;
  }
}
