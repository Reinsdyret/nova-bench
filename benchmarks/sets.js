const sets = [];

for (let i = 0; i < 800_000; i++) {
  const s = new Set();
  sets.push(s);
}

const times = [];

for (const set of sets) {
  const start = now();
  set.size;
  const end = now();
  times.push(end - start);
}

const avg = times.reduce((a, b) => a + b, 0n) / BigInt(times.length);
print(`Average time to get size of Set: ${avg} ns`);
