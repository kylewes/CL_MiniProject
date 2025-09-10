export function pipe(...fns) {
    return (input) => fns.reduce((val, fn) => fn(val), input);
}
