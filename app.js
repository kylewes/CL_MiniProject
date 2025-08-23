// Basic ID
let __id = 1;
function makeId(prefix) { return `${prefix}_${__id++}`;}

// Models
// Builds Members
class Member {
    constructor(name, role = "member") {
        this.id = makeId("m");
        this.name = name;
        this.role = role;
    }
}
// Builds Events 
class EventItem {
    constructor(title, dateStr, description = "", capacity = 100) {
        this.id = makeId("e");
        this.title = title;
        this.date = new Date(dateStr);
        this.description = description;
        this.capacity = capacity;
        this.rsvp = new Set();
    }
    toggleRsvp(memberId) {
    if (this.rsvp.has(memberId)) {
      this.rsvp.delete(memberId);
    } else if (this.rsvp.size < this.capacity) {
      this.rsvp.add(memberId);
    }
  }
}

// Builds Clubs
class Club {
    constructor(name, capacity = 1) {
        this.id = makeId("c");
        this.name = name;
        this.capacity = capacity 
        this.members = [];
        this.events = [];
    }

    // Getters (Data)
    get current() { return this.members.length;}
    get seatsLeft() { return Math.max(this.capacity - this.current);}
    get percentFull() { return this.capacity > 0 ? Math.round((this.current / this.capacity) * 100) : 0;}

    // Actions (Options)
    addMember(name, role = "member") {
        if (!name || typeof name != "string") return { valid: false, reason: "invalid-name"};
        if (this.seatsLeft <= 0 ) return { valid: false, reason: "full" };
        if (this.members.some(m => m.name.toLowerCase() === name.toLowerCase())){ return { valid: false, reason: "duplicate"};
        }
        const m = new Member(name, role);
        this.members.push(m);
        return {valid: true, member: m};
    }

    removeMember(memeberId) {
        const i = this.members.findIndex(m => m.id === memeberId);
        if (i >= 0) { this.members.splice(i, 1); return true;}
        return false;
    }

    addEvent(evt) {
        if (evt instanceof EventItem) this.events.push(evt);
    }

    upcomingEvents() {
        const now = new Date();
        return this.events.filter(e => e.date >= now).sort((a,b) => a.date - b.date);
    }

    static fromPlain(obj) {
        const c = new Club(obj.name, obj.capacity);
        for (let i = 0; i < (obj.current || 0); i++) {
            c.addMember(`Member ${i + 1}`);
        }
        return c;
    }
    
}

let clubs = [
    Club.fromPlain({name: "War Gaming", current: 15, capacity: 20}),
    Club.fromPlain({name: "Video Game Club", current: 30, capacity: 30}),
];

// function seatsLeft(club) {
//     return club.capacity - club.current;
// }

// function percentFull(club) {
//     if (club.capacity <= 0) return 0;
//     return Math.round((club.current / club.capacity) * 100);
// }

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

    // const msg = `${club.name}: ${club.current}/${club.capacity} seats filled (${seatsLeft(club)} left, ${percentFull(club)}% full)`;
    // card.textContent = msg;

    const line1 = `${club.name}`
    const line2 = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;
    card.innerHTML = `<strong>${line1}</strong><br>${line2}`;
    container.appendChild(card);
    });
}

function addClub(name, capacity) {
    clubs.push(new Club(name, capacity));
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





