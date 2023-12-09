// Expand and Collapse DatePicker
var datepickerFrom = flatpickr("#datepicker-from", {
  dateFormat: "d-m-Y",
  altInput: true,
  altFormat: "d-m-Y",
  appendTo: document.getElementById("date-picker-popup-from"),
  onClose: function (selectedDates, dateStr, instance) {
    // Gán giá trị ngày đã chọn vào thẻ input khi người dùng đóng datepicker
    $("#datepicker-from").value = dateStr;
  },
});
var datepickerTo = flatpickr("#datepicker-to", {
  dateFormat: "d-m-Y",
  altInput: true,
  altFormat: "d-m-Y",
  appendTo: document.getElementById("date-picker-popup-to"),
  onClose: function (selectedDates, dateStr, instance) {
    // Gán giá trị ngày đã chọn vào thẻ input khi người dùng đóng datepicker
    $("#datepicker-to").value = dateStr;
  },
});
document
  .getElementById("date-icon-from")
  .addEventListener("click", function (event) {
    event.stopPropagation();
    datepickerFrom.open();
  });
document
  .getElementById("date-icon-to")
  .addEventListener("click", function (event) {
    event.stopPropagation();
    datepickerTo.open();
  });

const datepickerFromInput = $("#datepicker-from");
datepickerFromInput.addEventListener("input", function (event) {
  // In ra giá trị của ô input khi nó thay đổi
  datepickerFromInput.value = event.target.value;
});
// Expand and Collapse Sort Panel, Filter Panel
$(".sort-heading").addEventListener("click", (event) => {
  const sortPannel = $(".sort-panel").classList;
  $(".sort-icon-panel").classList.toggle("closed");
  sortPannel.toggle("active");
});

$(".filter-heading").addEventListener("click", () => {
  const filterPannels = $$(".filter-panel");
  $(".filter-icon-panel").classList.toggle("closed");
  for (filterPannel of filterPannels) {
    filterPannel.classList.toggle("active");
  }
});
///////////////////////////////////////////////////

///////////////////// Get all genre ////////////////////////////
const contentGernes = $("#with-genres");
const gernes = {
  mountUi: function () {
    fetch("https://tmdb-backend-phi.vercel.app/api/genres", {
      method: "GET",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        data.forEach((gerne) => {
          const markup = `
                  <li class="${gerne.id}">${gerne.name}</li>
                `;
          contentGernes.insertAdjacentHTML(`beforeend`, markup);
        });
      })
      .then(() => {
        /////////////////////// Xử lý gerne được click //////////////////
        const genres = $$("#with-genres li");
        genres.forEach((gerne) => {
          gerne.addEventListener("click", () => {
            gerne.classList.toggle("isClicked");
          });
        });
      })
      .catch((error) => console.log(error));
  },
  start: function () {
    this.mountUi();
  },
};
gernes.start();

///////////////////// Get all movies ///////////////////////////
const contentMovies = $(".content-media .row");
const moviesResult = {
  pageNumber: 1,
  pageSize: 10,
  mountUi: async function () {
    const loadMore = $(".load_more");
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    await fetch("https://tmdb-backend-phi.vercel.app/api/showsbyfilter", {
      method: "POST",
      body: JSON.stringify({
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        this.pageNumber++;
        data.media.forEach((movie) => {
          const dt = new Date(movie.releasedDay);
          const markup = `
                <a href="/tvDetail.html?id=${
                  movie.id
                }" class="col-lg-3 me-0 media-card">
                  <img class="media-card-img"
                      src="${movie.imageUrl}" 
                      alt="Card image cap"/>
                  <div class="media-card-body">
                    <h5 class="media-card-title">${movie.title}</h5>
                    <p class="media-card-text">
                        ${dt.toLocaleDateString("en-US", options)}
                    </p>
                  </div>
                </a>
              `;
          contentMovies.insertAdjacentHTML(`beforeend`, markup);
        });

        if (data.totalPages >= this.pageNumber) {
          loadMore.innerHTML = `
          <button
                    class="d-flex justify-content-center align-items-center"
                  >
                    Load More
                  </button>
          `;

          const loadMoreButton = $(".load_more button");

          loadMoreButton.addEventListener("click", () => {
            this.mountUi();
          });
        } else {
          loadMore.innerHTML = "";
          this.demountUi();
        }
      })

      .catch((error) => console.log(error));
  },
  demountUi() {
    const loadMoreButton = $(".load_more button");
    if (loadMoreButton) {
      loadMoreButton.removeEventListener("click");
    }
  },
  start: function () {
    this.mountUi();
  },
};
moviesResult.start();
//////////////////////////////////////////////////////////////////
const isoDateString = (date) => {
  var parts = date.split("-");
  var day = parts[0];
  var month = parts[1];
  var year = parts[2];
  var dateObject = new Date(year, month - 1, day);

  return dateObject.toISOString();
};

const moviesFilterResult = {
  pageNumber: 1,
  pageSize: 10,
  mountUi(ref) {
    const loadMore = $(".load_more");
    var datepickerFrom = $("#datepicker-from").value;
    var datepickerTo = $("#datepicker-to").value;
    var keyword = $("#with-keyword").value;
    var genreIds = [];

    const genres = $$("#with-genres li");
    genres.forEach((gerne) => {
      if (gerne.classList.contains("isClicked")) {
        genreIds.push(`${gerne.classList[0]}`);
      }
    });
    const contentMovies = $(".content-media .row");
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    const body = {
      title: keyword === "" ? undefined : `${keyword}`,
      genreIds: genreIds.length === 0 ? undefined : genreIds,
      releasedDayStart:
        datepickerFrom === "" ? undefined : `${isoDateString(datepickerFrom)}`,
      releasedDayEnd:
        datepickerTo === "" ? undefined : `${isoDateString(datepickerTo)}`,
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
    };
    fetch("https://tmdb-backend-phi.vercel.app/api/showsbyfilter", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    })
      .then(async (response) => {
        const res = await response.json();
        return res;
      })
      .then((results) => {
        ref.pageNumber++;
        const movies = results.media;
        movies.forEach((movie) => {
          const dt = new Date(movie.releasedDay);
          const markup = `
                    <a href="/tvDetail.html?id=${
                      movie.id
                    }" class="col-lg-3 me-0 media-card">
                      <img class="media-card-img"
                          src="${movie.imageUrl}" 
                          alt="Card image cap"/>
                      <div class="media-card-body">
                        <h5 class="media-card-title">${movie.title}</h5>
                        <p class="media-card-text">
                            ${dt.toLocaleDateString("en-US", options)}
                        </p>
                      </div>
                    </a>
                  `;
          contentMovies.insertAdjacentHTML(`beforeend`, markup);
        });

        if (results.totalPages >= ref.pageNumber) {
          loadMore.innerHTML = `
          <button
                    class="d-flex justify-content-center align-items-center"
                  >
                    Load More
                  </button>
          `;

          const loadMoreButton = $(".load_more button");

          loadMoreButton.addEventListener("click", () => {
            this.mountUi(ref);
          });
        } else {
          loadMore.innerHTML = "";
          this.demountUi();
        }

        window.scrollTo(0, 0);
      })
      .catch((error) => {
        console.log(error);
      });
  },
  handleEvents() {
    const contentMovies = $(".content-media .row");
    const btnSearch = $(".btn-search");
    const _this = this;

    btnSearch.addEventListener("click", () => {
      contentMovies.innerHTML = "";
      this.pageNumber = 1;
      this.mountUi(_this);
    });
  },
  demountUi() {
    const loadMoreButton = $(".load_more button");
    if (loadMoreButton) {
      loadMoreButton.removeEventListener("click");
    }
  },
  start() {
    this.handleEvents();
  },
};

moviesFilterResult.start();
