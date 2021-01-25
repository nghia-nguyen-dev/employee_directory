const randomUserAPI = 'https://randomuser.me/api/?results=12&nat=us';
const main = document.querySelector('main');
const modal = document.querySelector('.modal')
const userData = [];
const overlayContent = document.querySelector('.overlay-content')
const filter = document.querySelector('.filter')
const searchInput = document.querySelector('.search')
const arrowsDiv = document.querySelector('.arrows')

let counter;
let rightArrow;
let leftArrow;

// --------------------------- FUNCTIONS ---------------------------

    function createProfileCard(userInfo) {
        const div = document.createElement('div');
        div.classList.add('profile-card');
        div.innerHTML = `        
        <img src="${userInfo.img}" alt="profile image of ${userInfo.name}" class="profile-img">
        <div class="content">
            <h2 class="name">${userInfo.name}</h2>
            <p class="email">${userInfo.email}</p>
            <p class="user-location">${userInfo.userLocation}</p>
        </div>`;
        main.appendChild(div);
    };

    function move(direction) {
        // current overlay needs to be populated with previous profile data
        overlayContent.children[2].src = direction.img;
        overlayContent.children[3].textContent = direction.name;
        overlayContent.children[4].textContent = direction.email;
        overlayContent.children[6].children[0].textContent = direction.cell;
        overlayContent.children[6].children[1].textContent = direction.address;
        overlayContent.children[6].children[2].textContent = direction.dob;
    }

// --------------------------- FETCH DATA FROM SERVER ---------------------------

fetch(randomUserAPI)
    .then(response => response.json()) // convert response into json
    .then(json => {
        json.results.map(profile => {
            // data fetch from random user API
            const userInfo = {
                img: profile.picture.large,
                name: `${profile.name.first} ${profile.name.last}`,
                email: `${profile.email}`,
                userLocation: `${profile.location.city} ${profile.location.state}`,
                cell: profile.cell,
                dob: profile.dob.date,
                address: `${profile.location.street.name} ${profile.location.street.number}, ${profile.location.city}, ${profile.location.state} ${profile.location.postcode}`,
            };
            // create card and pass in user data
            createProfileCard(userInfo)
            userData.push(userInfo)
            // console.log(profile)
        })
    })
    .catch(err => console.error(err))

// --------------------------- SHOW MODAL ---------------------------
main.addEventListener('click', (e) => {
    if (e.target.className !== 'grid') {
        counter = e.target;
        const employeeName = e.target.children[1].children[0].textContent
        const found = userData.filter(user => user.name === employeeName)[0]; // use employee name to filter userData array

        e.target.classList.add('hover'); // force hover state to remain
        filter.style.filter = 'blur(2px)';
        modal.style.display = 'block';
        
        overlayContent.innerHTML = `
            <div class="close">X</div>
            <div class="arrows">
                <img src="icons/left_arrow.png" alt="" class="l-arrow">
                <img src="icons/right_arrow.png" alt="" class="r-arrow">
            </div>
            <img src="${found.img}" alt="profile image of ${found.name}" class="profile-img">
            <h2 class="name">${found.name}</h2>
            <p class="email">${found.email}</p>
            <hr>
            <div class="side-info">
                <p class="phone">${found.cell}</p>
                <p class="address">${found.address}</p>
                <p class="dob">${found.dob}</p>
            </div>`;

        leftArrow = document.querySelector('.l-arrow')
        rightArrow = document.querySelector('.r-arrow')
        
        // hides left/right arrow if profile clicked is the last/first card
        if (counter.nextElementSibling === null) {
            rightArrow.style.visibility = 'hidden'
        } else if (counter.previousElementSibling === null) {
            leftArrow.style.visibility = 'hidden'
        }
    }
})


// --------------------------- MODAL FUNCTIONALITY ---------------------------
modal.addEventListener('click', (e) => {
    leftArrow = document.querySelector('.l-arrow')
    rightArrow = document.querySelector('.r-arrow')

    if (e.target.className === 'l-arrow') {
        if (counter.previousElementSibling.previousElementSibling === null) { 
            leftArrow.style.visibility = 'hidden'; // hide arrow when prev card is first in the pile
        }
        if (counter.previousElementSibling !== null) {
            rightArrow.style.visibility = ''
            counter = counter.previousElementSibling;
            const prevPersonName = counter.lastElementChild.children[0].textContent; 
            const prevPersonData = userData.filter(user => user.name === prevPersonName)[0]; 
            move(prevPersonData);
        }
    };

    if (e.target.className === 'r-arrow') {
        if (counter.nextElementSibling.nextElementSibling === null) {
            rightArrow.style.visibility = 'hidden'; // hide arrow when next card is last in the pile
        }
        if (counter.nextElementSibling !== null) {
            leftArrow.style.visibility = ''
            counter = counter.nextElementSibling;
            const nextPersonName = counter.lastElementChild.children[0].textContent;
            const nextPersonData = userData.filter(user => user.name === nextPersonName)[0];
            move(nextPersonData);
        } 
    };

    if (e.target.className === 'close') {
        modal.style.display = '';
        filter.style.filter = '';
        // checks for hover class on nodelist then remove
        const profileCards = document.querySelectorAll('.profile-card');
        profileCards.forEach(card => {
            if (card.className.includes('hover')) {
                card.classList.remove('hover');
            }
        })
    }
});

// -------------------- SEARCH FUNCTIONALITY --------------------
searchInput.addEventListener('keyup', () => {

    const input = searchInput.value.toLowerCase().trim()
    const profiles = document.querySelectorAll('.profile-card')
  
    if (input) {
        profiles.forEach(profile => {
            profile.style.opacity = 0;
            const name = profile.children[1].children[0].textContent.toLowerCase().trim();
            if (name.startsWith(input)) {
                profile.style.opacity = 1;
                main.prepend(profile) // inserts matching div to the very top
            } 
        })
    } else {
        profiles.forEach(profile => {
            profile.style.opacity = 1;
        })
    }

})


