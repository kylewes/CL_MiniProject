let __id = 1;
function makeId(prefix) { return `${prefix}_${__id++}`;}

export class EventItem {
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

