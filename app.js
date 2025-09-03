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
    // Remove Members
    removeMember(memberId) {
        const i = this.members.findIndex(m => m.id === memberId);
        if (i >= 0) { this.members.splice(i, 1); return true;}
        return false;
    }
    // Add Events
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
    Club.fromPlain({name: "War Gaming", current: 3, capacity: 10}),
    Club.fromPlain({name: "Video Game Club", current: 4, capacity: 5}),
    Club.fromPlain({name: "Art Club", current: 8, capacity: 10}),
    Club.fromPlain({name: "Baseketball", current: 10, capacity: 15})
];

const ui = {
    searchText: "",
    onlyOpen: false,
    sortBy: "name-asc",
};

function getVisibleClubs() {
    let list = clubs.slice();

    const q = ui.searchText.trim().toLowerCase();
    if (q) {
        list = list.filter(c => c.name.toLowerCase().includes(q));
    }

    if (ui.onlyOpen) {
        list = list.filter(c => c.seatsLeft > 0);
    }
    
    list.sort((a,b) => {
        switch (ui.sortBy) {
            case "name-asc": return a.name.localeCompare(b.name);
            case "name-desc": return b.name.localeCompare(a.name);
            case "seats-desc": return b.seatsLeft - a.seatsLeft;
            case "capacity-desc": return b.capacity - a.capacity;
            default: return 0;
        }
    });
    return list;
}

function renderClubs() {
    const container = document.getElementById("club-info");
    container.innerHTML = "";

    const visible = getVisibleClubs();
    if (visible.length === 0) {
        const p = document.createElement("p");
        p.textContent = "No clubs match your filters.";
        container.appendChild(p);
        return;
    }

    visible.forEach((club) => {
    const card = document.createElement("div");
    card.className = "club-card";
    card.dataset.clubId = club.id;
    
    const stats = `${club.current}/${club.capacity} seats filled (${club.seatsLeft} left, ${club.percentFull}% full)`;

    const membersHtml = club.members.map(m =>`
        <li>${m.name}
            <button class="link-btn" data-action="remove-member" data-club-id="${club.id}" data-member-id="${m.id}">
                Remove
            </button>
        </li>
    `).join(" ");

        card.innerHTML = `
        <div><strong>${club.name}</strong></div>
        
        <div class="member-section">
            <h4> Members (${club.current})</h4>
            <ul class="member-list">
                    ${membersHtml || "<li><em>No members yet</em></li>"} 
            </ul>
        
            <div class="inline-form">
                <input id="member-name-${club.id}" type="text" placeholder="e.g. Tracie" />
                <button class="btn" data-action="add-member" data-club-id="${club.id}">Add Member</button>
                <span id="status-${club.id}" class="note"></span>
            </div>
        </div>
        `;

    container.appendChild(card);

    });
}

function setStatus(clubId, message){
    const el = document.getElementById(`status-${clubId}`);
    if (el) el.textContent = message;
}

const clubContainer =document.getElementById("club-info");

clubContainer.addEventListener("click", (e)=> {
const btn = e.target.closest("[data-action]")
if (!btn) return;

const action = btn.dataset.action;
const clubId = btn.dataset.clubId
const club = clubs.find(c => c.id === clubId);
if (!club) return;

if (action === "add-member") {
    const input = document.getElementById(`member-name-${clubId}`);
    const name = (input?.value || "").trim();

    if (name === "") { setStatus(clubId, "Please enter a member name."); return;}

    const result = club.addMember(name);
    if (!result.valid) { 
        const msg = result.reason === "full" ? "Club is at Capacity." 
            : result.reason === "duplicate" ? "Member name already exists."
            : "Invalid member name.";
        setStatus(clubId, msg);
        return;
        }
    
    setStatus(clubId, "Member added.");
    renderClubs();
    }

    if (action === "remove-member") {
        const memberId = btn.dataset.memberId;
        club.removeMember(memberId)
        renderClubs();
    }

});

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
}
    errorMessage.textContent = "";
    clubs.push(new Club(name, capacity));
    renderClubs();

    nameInput.value = "";
    capacityInput.value = "";
    nameInput.focus();
});

document.getElementById("search").addEventListener("input", (e) => {
    ui.searchText = e.target.value;
    renderClubs();
});

document.getElementById("only-open").addEventListener("change", (e) =>{
    ui.onlyOpen = e.target.checked;
    renderClubs();
});

document.getElementById("sort-by").addEventListener("change", (e) => {
    ui.sortBy = e.target.value;
    renderClubs();
})

document.getElementById("year").textContent = new Date().getFullYear();

renderClubs();





