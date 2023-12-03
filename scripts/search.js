const searchFilter = {
  options: [
    {
      label: "Movies",
      model: "movie",
      count: 0,
      isActive: true,
    },
    {
      label: "TV Show",
      model: "show",
      count: 0,
      isActive: false,
    },
  ],
  handleEvents: function () {
    const searchFilterList = $(".filter-option-list");

    this.options.forEach((option) => {
      const markup = `
        <li class="filter-option ${option.isActive ? "active" : ""}">
            <div class="search_tab ${option.isActive ? "active" : ""}">${
        option.label
      }</div>
            <span>${option.count}</span>
        </li>
        `;
      searchFilterList.insertAdjacentHTML(`beforeend`, markup);
    });
  },
  start: function () {
    this.handleEvents();
  },
};

searchFilter.start();
