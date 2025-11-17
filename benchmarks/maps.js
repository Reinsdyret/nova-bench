const maps = [];

for (let i = 0; i < 100_000; i++) {
  const m = new Map();
  maps.push(m);
}

const times = [];

for (const map of maps) {
  const start = now();
  map.size;
  const end = now();
  times.push(end - start);
}

const avg = times.reduce((a, b) => a + b, 0n) / BigInt(times.length);
print(`Average time to get size of Map: ${avg} ns`);
