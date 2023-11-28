const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const bars = $(".bars");
const mobileSideBar = $(".mobile-nav-sidebar");

const header = {
  isMobileSideBarOpen: false,
  handleEvents: function () {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 992) {
        this.isMobileSideBarOpen = false;
        mobileSideBar.classList.remove("slide-out-left");
        mobileSideBar.classList.remove("slide-in-left");
      }
    });

    bars.addEventListener("click", () => {
      if (
        ![...mobileSideBar.classList].includes(`slide-in-left`) &&
        ![...mobileSideBar.classList].includes(`slide-out-left`) &&
        !this.isMobileSideBarOpen
      ) {
        mobileSideBar.classList.add("slide-in-left");
      } else if (
        [...mobileSideBar.classList].includes(`slide-out-left`) &&
        !this.isMobileSideBarOpen
      ) {
        mobileSideBar.classList.remove("slide-out-left");
        mobileSideBar.classList.add("slide-in-left");
      } else {
        mobileSideBar.classList.remove("slide-in-left");
        mobileSideBar.classList.add("slide-out-left");
      }
      this.isMobileSideBarOpen = !this.isMobileSideBarOpen;
    });
  },

  start: function () {
    this.handleEvents();
  },
};

header.start();

const trendingScroller = $(".trending-scroller");

const trending = {
  mountUi: function () {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    fetch("https://tmdb-backend-g5qb.onrender.com/api/movies", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((movie) => {
          const dt = new Date(movie.releasedDay);
          const markup = `
       <a href="/movies/${movie.id}" class="movie-card">
        <img class="movie-card-img" src="${
          movie.imageUrl
        }" alt="Card image cap">
        <div class="movie-card-body">
          <h5 class="movie-card-title">${movie.title}</h5>
          <p class="movie-card-text">${dt.toLocaleDateString(
            "en-US",
            options
          )}</p>
        </div 
       </a>
      `;
          trendingScroller.insertAdjacentHTML(`beforeend`, markup);
        });
      })
      .catch((error) => console.log(error));
  },
  handleEvents: function () {},

  start: function () {
    this.mountUi();
    this.handleEvents();
  },
};

trending.start();


const latestTrailerScroller = $(".latest-trailer-scroller");
const latestTrailer = $(".latest-trailer")

const LatestTrailer = {
  mountUi: function () {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    fetch("http://localhost:5050/api/movies", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((movie) => {
          const dt = new Date(movie.releasedDay);
          const markup = `
       <a href="/movies/${movie.id}" class="movie-card">
        <img class="movie-card-img" src="${
          movie.imageUrl
        }" alt="Card image cap">
        <div class="movie-card-body">
          <h5 class="movie-card-title">${movie.title}</h5>
          <p class="movie-card-text">${dt.toLocaleDateString(
            "en-US",
            options
          )}</p>
        </div 
       </a>
      `;
          latestTrailerScroller.insertAdjacentHTML(`beforeend`, markup);
        });
      })
      .catch((error) => console.log(error));
  },
  handleEvents: function () {},

  start: function () {
    this.mountUi();
    this.handleEvents();
  },
};

LatestTrailer.start();