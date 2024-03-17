//Navbar
let hamburger = document.querySelector(".hamburger-button");
let mobileNav = document.getElementById("navigation");
hamburger.addEventListener("click", () => mobileNav.classList.toggle("active"));
const page = document.getElementsByClassName("page")[0];

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

else if (document.URL.includes("work.html")) {
  const track = document.getElementById("image-track");
  const imageContainers = track.getElementsByClassName("work-image");
  const images = document.querySelectorAll(".work-image img");
  page.style.cursor = "grab";
  // Make an invisible slider that follows no matter where user presses
  window.onmousedown = (e) => {
    track.dataset.mouseDownAt = e.clientX;
  };

  window.onmousemove = (e) => {
    const track = document.getElementById("image-track");

    const handleOnDown = (e) => {
      track.dataset.mouseDownAt = e.clientX;
      page.style.cursor = "grabbing";
    };

    const handleOnUp = () => {
      track.dataset.mouseDownAt = "0";
      track.dataset.prevPercentage = track.dataset.percentage;
      page.style.cursor = "grab";
    };

    const handleOnMove = (e) => {
      if (track.dataset.mouseDownAt === "0") return;

      const mouseDelta = parseFloat(track.dataset.mouseDownAt) - e.clientX,
        maxDelta = window.innerWidth / 2;

      const percentage = (mouseDelta / maxDelta) * -100,
        nextPercentageUnconstrained =
          parseFloat(track.dataset.prevPercentage) + percentage,
        nextPercentage = Math.max(
          Math.min(nextPercentageUnconstrained, -7),
          -93
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

      let selectedIndex;
      if (nextPercentage >= -14) {
        selectedIndex = 0;
      }
      else if (nextPercentage >= -28){
        selectedIndex = 1;
      }
      else if (nextPercentage >= -43){
        selectedIndex = 2;
      }
      else if (nextPercentage >= -58){
        selectedIndex = 3;
      }
      else if (nextPercentage >= -72){
        selectedIndex = 4;
      }
      else if (nextPercentage >= -86){
        selectedIndex = 5;
      }
      else {
        selectedIndex = 6;
      }

      for (var i = 0; i < imageContainers.length; i++) {
        if (i == selectedIndex)   
          imageContainers[i].classList.add("selected");
        else
          imageContainers[i].classList.remove("selected");
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

else if (document.URL.includes("workcontent.html")) {
  page.style.overflowY = "auto";
  const urlParams = new URLSearchParams(window.location.search);
  let id = parseInt(urlParams.get("id") ?? "0");
  if (id > 6 || id < 0) id = 0;

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
      prevButton.style.display = "none";
      videoPlayer.src = "https://www.youtube.com/embed/ImNnt1CScvk?rel=0";
      contentOverview.getElementsByTagName("h2")[0].innerHTML =
        "Flooded Fables<span>.</span>";
        contentOverview.getElementsByTagName("p")[0].innerHTML =
        "A multiplayer puzzle RPG made using <strong>Unreal Engine</strong>";
        personCount.innerHTML = "Team of 9 (3 Developers)";
        madeIn.innerHTML = "August 2023";
        language.innerHTML = "C++ / Unreal Engine";
        sourceLink.style.display = "flex";
        sourceLink.getElementsByTagName("p")[0].innerHTML =
        "<a href='https://butter9fe.itch.io/flooded-fables?secret=RhzulGCdZumNh0abhpI1dYZCO7Y' target='__blank'>Play the game here!</a>";
        contentParagraph.innerHTML = "<p>Flooded Fables is part of an upcoming <strong>metaverse</strong> under Nanyang Polytechnic's School of Design and Media, in partnership with Memotics. It is the project I worked on for my <strong>Final Year Project</strong> alongside 8 other individuals from 3 different diplomas over the course of 3 months.</p><p>My main responsibilities included developing the <strong>multiplayer networking framework</strong>, implementing all the <strong>user interface and menu</strong> functionality, <strong>chat system</strong>, <strong>maze and boss puzzles</strong>, <strong>ending cutscene</strong>, and <strong>VFX</strong>, among other multiplayer features.</p>";
      break;
      case 1:
      videoPlayer.src = "https://www.youtube.com/embed/eulQX1nqBCw?rel=0";
      contentOverview.getElementsByTagName("h2")[0].innerHTML =
        "Hero Killer<span>.</span>";
        contentOverview.getElementsByTagName("p")[0].innerHTML =
        "A 3D action side-scroller developed using <strong>Unreal Engine</strong>";
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "February 2024";
        language.innerHTML = "C++ / Unreal Engine";
        sourceLink.style.display = "flex";
        sourceLink.getElementsByTagName("p")[0].innerHTML =
        "<a href='https://github.com/Butterkn1f/HeroKiller' target='__blank'>Source code here</a>";
        contentParagraph.innerHTML = "<p>Step into Seraphina's shoes in this <strong>stylish action game</strong>, where you utilize her ability to <strong>borrow Gifts</strong> for vengeance against her father's killer. Conquer the hero's clan, strategically managing the <strong>limited space</strong> in her mind amidst ever-changing challenges with <strong>randomized foes</strong> and <strong>dynamic environments</strong>.</p><p>As my <strong>Independent Work Project</strong>, I had to learn to manage and plan my time adequately. As the final project of my studies, I wanted to focus on expanding my horizons and learning to develop new mechanics, hence my choice in Unreal Engine.</p><p>As an aspiring <strong>graphics programmer</strong>, I focused heavily on developing my own post-processing <strong>shaders</strong> and <strong>VFX</strong> for my magic spells. <strong>Style</strong> is the main selling point of this game as well, so I created deep movement with numerous detailed actions that the character can perform - from backflips to slides. Additionally, I implemented smart AI for common enemies and bosses, through the use of <strong>behaviour trees</strong>.</p>"
      break;
    case 2:
      videoPlayer.src = "https://www.youtube.com/embed/GmC1f3_EySE?rel=0";
      contentOverview.getElementsByTagName("h2")[0].innerHTML =
        "Mystic Munchies<span>.</span>";
        contentOverview.getElementsByTagName("p")[0].innerHTML =
        "An adorable fast-paced mobile cooking game developed in <strong>Unity</strong>";
        personCount.innerHTML = "Team of 5 (2 Developers)";
        madeIn.innerHTML = "October 2023";
        language.innerHTML = "C# / Unity";
        sourceLink.style.display = "flex";
        sourceLink.getElementsByTagName("p")[0].innerHTML =
          "<a href='https://butter9fe.itch.io/mystic-munchies' target='__blank'>Play the game here!</a>";
          contentParagraph.innerHTML = 
            "<p>Mystic Munchies is an entry for <strong>NYP x H2's Game Jam</strong>! We were given <strong>5 days</strong> to develop a game from the ground up, given the theme of <strong>hypercasual mobile game</strong>. I worked with a team of 5, consisting of students from different diplomas, and managed to clinch <span>3rd Place</span> with this game!</p><p>As one of the 2 developers in the team, my responsibilities included implementing the <strong>level select</strong>, the <strong>tutorial</strong>, <strong>ingredients</strong>, and the <strong>drawing</strong> and its <strong>recognition system</strong>! The last of which was the one that was the most challenging and the feature that I was most proud of.</p><p>After reading a paper about the <a href='https://faculty.washington.edu/wobbrock/pubs/icmi-12.pdf' target='__blank'>$P Point-Cloud Recognizer</a>, I went about implementing it myself in Unity, which was tough considering our tight timeframe. In the end, with the algorithm implemented, I was able to essentially draw any shapes I want to act as <strong>'templates'</strong>, and the algorithm would try to <strong>match</strong> whatever the user drew to my templates, and figure out the shape from there - while giving me a <strong>score</strong> so that I can reject those that are too far off. <p>This algorithm ensured that the recognition system remained extremely <strong>scalable</strong>, and any additional shapes were doable so long as I drew them enough times. Additionally, as the drawings were converted into <strong>vertex points</strong>, the user could draw the shapes <strong>anywhere</strong> on the screen, and at <strong>any size</strong>, and still get recognized.</p>";
      break;
      case 3:
        videoPlayer.src = "https://www.youtube.com/embed/98ywKI9yVtk?rel=0";
        contentOverview.getElementsByTagName("h2")[0].innerHTML =
        "Hypercasual Games<span>.</span>";
        contentOverview.getElementsByTagName("p")[0].innerHTML =
        "A collection of 3 Hypercasual Games developed in <strong>Unity</strong>: <strong>Dungeon Cuber</strong>, <strong>Pizza Dash</strong>, and <strong>Galatic Guardian</strong>.";
        personCount.innerHTML = "Solo";
        madeIn.innerHTML = "May 2023";
        language.innerHTML = "C# / Unity";
        sourceLink.style.display = "flex";
        sourceLink.getElementsByTagName("p")[0].innerHTML =
          "<a href='images/HypercasualReport.pdf'>View the documentation here!</a>";
          contentParagraph.innerHTML = 
            "<p>View the PDF to the left for more details!</p>";
        break;
    case 4:
      videoPlayer.src = "https://www.youtube.com/embed/DvPKXcdUnf0?rel=0";
      break;
    case 5:
      videoPlayer.src = "https://www.youtube.com/embed/Gq1rKBWCH6Y?rel=0";
      contentOverview.getElementsByTagName("h2")[0].innerHTML =
        "Hollow Knight Remake<span>.</span>";
      contentOverview.getElementsByTagName("p")[0].innerHTML =
        "2D Game made in <strong>Unity</strong>";
      personCount.innerHTML = "Solo";
      madeIn.innerHTML = "August 2022";
      language.innerHTML = "C# / Unity";
      contentParagraph.innerHTML =
        "<p>I tried to remake a simplified version of a popular game <strong>Hollow Knight</strong> in <strong>Unity</strong>. This was the first game I made in this game engine, and it was an interesting and challenging experience. The controls and gameplay are <strong>one-to-one</strong> with the original Hollow Knight series. The player is able to attack, jump, and absorb souls to heal.</p><p>There are a total of <strong>two</strong> separate enemies, and one <strong>boss battle</strong>. Each enemy defeated would fill up a <strong>Soul Gauge</strong> that the player can use to heal. The first enemy is just a normal <strong>Crawlid</strong> with no special moves, each attack by the player would cause it to get <strong>knocked back</strong>. The next enemy is a <strong>Husk Warrior</strong>. It can <strong>attack</strong> with its sword when the player is near. It was a <strong>shield</strong>, which it would use to <strong>block</strong> the player when attacked, and take <strong>no damage</strong>. However, each time it uses its shield, it is <strong>unable to move</strong>, so the player can take this chance to <strong>attack from behind</strong> to damage it.</p><p>The final boss battle is the <strong>False Knight</strong>. Upon entering its arena, gates will close behind you - trapping you with the Knight until he is defeated. The False Knight will try to <strong>jump on the player</strong>, and each time the player's attacks hit him, his <strong>armour</strong> will deteriorate. When his armour is completely broken, he will <strong>lie vulnerable on the floor</strong> for a couple seconds, for the player to actually damage it. Each attack in his vulnerable state will also drop <strong>soul</strong>, so the player can also heal while the boss is down.</p>";
      break;
    case 6:
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
        "<p>I made a website to be based on <strong>Virtual YouTubers</strong>, which is a topic I am really passionate about. The website is also <strong>responsive</strong> on mobile and tablet viewports, as seen in the video.</p><p>The 'VIRTUAL' text is purely animated using CSS animations, and so are the other button glitch effects. In the landing page, there is an <strong>infinitely scrolling carousell</strong>.</p><p>There is a lot of interactivity based on scroll position using <strong>Javascript</strong> <p>There is also a database page, which makes use of a database created inside <strong>MySQL</strong>. The search function then filters the database items, through the use of <strong>PHP</strong> to communicate between the website and the database.</p>";
      nextButton.style.display = "none";
      break;
      default:
        break;
  }
}

else if (!document.URL.includes("contact.html")) {
  // URL is empty
  window.location.replace('/index.html');
}

