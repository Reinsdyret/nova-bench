// Configuration
const NUM_SETS = 10000;
const ELEMENTS_PER_SET = 1000;
const LOOKUP_ITERATIONS = 10;
const RUNS = 5;

function runBenchmark() {
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

    return {
        creation: sumCreation,
        size: sumSize,
        hasHit: sumHasHit,
        hasMiss: sumHasMiss,
        forEach: sumForEach,
        delete: sumDelete,
        add: sumAdd
    };
}

// Collect results from multiple runs
const results = {
    creation: [],
    size: [],
    hasHit: [],
    hasMiss: [],
    forEach: [],
    delete: [],
    add: []
};

print(`Running ${RUNS} iterations...`);
for (let run = 0; run < RUNS; run++) {
    print(`  Run ${run + 1}/${RUNS}`);
    const r = runBenchmark();
    results.creation.push(r.creation);
    results.size.push(r.size);
    results.hasHit.push(r.hasHit);
    results.hasMiss.push(r.hasMiss);
    results.forEach.push(r.forEach);
    results.delete.push(r.delete);
    results.add.push(r.add);
}

// Statistics helpers
function avg(arr) {
    return arr.reduce((a, b) => a + b, 0n) / BigInt(arr.length);
}

function min(arr) {
    let m = arr[0];
    for (const v of arr) if (v < m) m = v;
    return m;
}

function max(arr) {
    let m = arr[0];
    for (const v of arr) if (v > m) m = v;
    return m;
}

function stddev(arr) {
    const mean = avg(arr);
    let sumSq = 0n;
    for (const v of arr) {
        const diff = v - mean;
        sumSq += diff * diff;
    }
    // Integer sqrt approximation
    const variance = sumSq / BigInt(arr.length);
    let x = variance;
    let y = (x + 1n) / 2n;
    while (y < x) {
        x = y;
        y = (x + variance / x) / 2n;
    }
    return x;
}

function formatRow(name, arr) {
    const a = avg(arr);
    const mn = min(arr);
    const mx = max(arr);
    const sd = stddev(arr);
    return `${name.padEnd(12)} ${String(a).padStart(15)} ± ${String(sd).padStart(12)} ns  [${String(mn).padStart(15)} - ${String(mx).padStart(15)}]`;
}

// Output
print(`\nSets: ${NUM_SETS} x ${ELEMENTS_PER_SET} elements | Lookups: ${LOOKUP_ITERATIONS}x | Runs: ${RUNS}`);
print(`${"Operation".padEnd(12)} ${"Average".padStart(15)}   ${"StdDev".padStart(12)}      ${"Min".padStart(15)}   ${"Max".padStart(15)}`);
print(`─`.repeat(90));
print(formatRow("create+add", results.creation));
print(formatRow("size", results.size));
print(formatRow("has (hit)", results.hasHit));
print(formatRow("has (miss)", results.hasMiss));
print(formatRow("forEach", results.forEach));
print(formatRow("delete", results.delete));
print(formatRow("add (grow)", results.add));
