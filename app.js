let clubs = [
    {name: "Art Club", current: 26, capacity: 30 },
    {name: "Coding Club", current: 22, capacity: 35},
    {name: "War Gaming", current: 13, capacity: 25},
];

function seatsLeft(club) {
    return club.capacity - club.current;
}

function percentFull(club) {
    if (club.capacity <= 0) return 0;
    return Math.round((club.current / club.capacity) * 100);
}

function renderClubs() {
    const container = document.getElementById("club-info");
    container.innerHTML = "";


if (clubs.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No clubs yet. Add one above to get started.";
    container.appendChild(p);
    return;
    }

clubs.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";

    const msg = `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
    card.textContent = msg;
    container.appendChild(card);
    });
}

function addClub(name, capacity) {
    clubs.push({name, current: 0, capacity});
    renderClubs();
}

document.getElementById("club-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const nameInput = document.getElementById("club-name");
    const capacityInput = document.getElementById("club-capacity");
    const errorMessage = document.getElementById("error-message");

    const name = nameInput.value.trim();
    const capacity = parseInt(capacityInput.value, 10);

    if (name === "" || isNaN(capacity) || capacity <= 0) {
    errorMessage.textContent = "Please enter a valid club name and capacity (min 1).";
return;
}

const exists = clubs.some(c => c.name.toLowerCase() === name.toLowerCase());
if (exists) {
    errorMessage.textContent = "A club with this name already exists.";
    return;
} else {
    errorMessage.textContent = " ";
    addClub(name, capacity);
    nameInput.value = "";
    capacityInput.value = "";
    nameInput.focus();
    }
});

document.getElementById("year").textContent = new Date().getFullYear();

renderClubs();





