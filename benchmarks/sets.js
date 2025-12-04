// Configuration
const NUM_SETS = 10000;
const ELEMENTS_PER_SET = 1000;
const LOOKUP_ITERATIONS = 10;

// Benchmark 1: Creating sets and adding elements
const sets = [];
const creationTimes = [];

for (let i = 0; i < NUM_SETS; i++) {
    const start = now();
    const s = new Set();
    for (let j = 0; j < ELEMENTS_PER_SET; j++) {
        s.add(i * ELEMENTS_PER_SET + j);
    }
    const end = now();
    sets.push(s);
    creationTimes.push(end - start);
}
const sumCreation = creationTimes.reduce((a, b) => a + b, 0n);

// Benchmark 2: Accessing .size on populated sets
const sizeTimes = [];
for (const set of sets) {
    const start = now();
    set.size;
    const end = now();
    sizeTimes.push(end - start);
}
const sumSize = sizeTimes.reduce((a, b) => a + b, 0n);

// Benchmark 3: has() lookups (existing elements)
const hasHitTimes = [];
for (let iter = 0; iter < LOOKUP_ITERATIONS; iter++) {
    for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        const element = i * ELEMENTS_PER_SET + Math.floor(ELEMENTS_PER_SET / 2);
        const start = now();
        set.has(element);
        const end = now();
        hasHitTimes.push(end - start);
    }
}
const sumHasHit = hasHitTimes.reduce((a, b) => a + b, 0n);

// Benchmark 4: has() lookups (missing elements)
const hasMissTimes = [];
for (let iter = 0; iter < LOOKUP_ITERATIONS; iter++) {
    for (let i = 0; i < sets.length; i++) {
        const set = sets[i];
        const element = -1 - i;
        const start = now();
        set.has(element);
        const end = now();
        hasMissTimes.push(end - start);
    }
}
const sumHasMiss = hasMissTimes.reduce((a, b) => a + b, 0n);

// Benchmark 5: Iteration (forEach)
const forEachTimes = [];
let forEachSum = 0;
for (const set of sets) {
    const start = now();
    set.forEach(v => { forEachSum += 1; });
    const end = now();
    forEachTimes.push(end - start);
}
const sumForEach = forEachTimes.reduce((a, b) => a + b, 0n);

// Benchmark 6: delete() operations
const deleteTimes = [];
for (let i = 0; i < sets.length; i++) {
    const set = sets[i];
    const element = i * ELEMENTS_PER_SET;
    const start = now();
    set.delete(element);
    const end = now();
    deleteTimes.push(end - start);
}
const sumDelete = deleteTimes.reduce((a, b) => a + b, 0n);

// Benchmark 7: add() to existing sets (growing)
const addTimes = [];
for (let i = 0; i < sets.length; i++) {
    const set = sets[i];
    const newElement = NUM_SETS * ELEMENTS_PER_SET + i;
    const start = now();
    set.add(newElement);
    const end = now();
    addTimes.push(end - start);
}
const sumAdd = addTimes.reduce((a, b) => a + b, 0n);

// Compact Summary
print(`Sets: ${NUM_SETS} x ${ELEMENTS_PER_SET} elements | Lookups: ${LOOKUP_ITERATIONS}x`);
print(`----------------------------------------`);
print(`create+add : ${String(sumCreation).padStart(15)} ns`);
print(`size       : ${String(sumSize).padStart(15)} ns`);
print(`has (hit)  : ${String(sumHasHit).padStart(15)} ns`);
print(`has (miss) : ${String(sumHasMiss).padStart(15)} ns`);
print(`forEach    : ${String(sumForEach).padStart(15)} ns`);
print(`delete     : ${String(sumDelete).padStart(15)} ns`);
print(`add (grow) : ${String(sumAdd).padStart(15)} ns`);
