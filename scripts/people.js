const $ = document.querySelector.bind(document);
const peopleList = $(".row");
fetch('https://tmdb-backend-phi.vercel.app/api/people', {
    method: 'GET'
})
.then((res) => {
    return res.json();
})
.then((data) => {
    data.forEach(person => {
        const unformattedDate = person.dob.split('T')[0];
        const date = formatDate(unformattedDate);
        const html = `<a href="/person.html?id=${person.id}" class="col-lg-3 col-md-4 col-sm-6 people_container" style="padding: 0;">
        <div class="people_card card">
            <img src=${person.imageUrl} alt="person_img">
            <div class="people_detail">
                <h4>${person.fullName}</h4>
                <span>${date}</span>
            </div>
        </div>
    </a>`
        peopleList.insertAdjacentHTML('beforeend', html);
    });
})

const formatDate = (date) => {
    const d = date.split('-');
    const year = d[0];
    const month = d[1];
    const day = d[2];
    return `${months[month]} ${day}, ${year}`
}

const months = {
    '01': 'Jan',
    '02': 'Feb',
    '03': 'Mar',
    '04': 'April',
    '05': 'May',
    '06': 'June',
    '07': 'Jul',
    '08': 'Aug',
    '08': 'Sep',
    '10': 'Oct',
    '11': 'Nov',
    '12': 'Dec'
}

const bars = $(".bars");
const mobileSideBar = $(".mobile-nav-sidebar");
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