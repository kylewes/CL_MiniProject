import { Club } from '../models/Club.js';

export let clubs = [
    Club.fromPlain({name: "War Gaming", current: 3, capacity: 10}),
    Club.fromPlain({name: "Video Game Club", current: 4, capacity: 5}),
    Club.fromPlain({name: "Art Club", current: 8, capacity: 10}),
    Club.fromPlain({name: "Basketball", current: 10, capacity: 15})
];

export function addClub(name, capacity) {
    clubs.push(new Club(name, capacity));
}

export function findClubById(id) {
    return clubs.find(c => c.id === id);
}