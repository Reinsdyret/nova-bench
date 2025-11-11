const maps = [];

for (let i = 0; i < 100000; i++) {
  const m = new Map();
  maps.push(m);
}

for (const map of maps) {
  const start = Date.now().toPrecision(21);
  map.size;
  const elapsed = Date.now().toPrecision(21) - start;
  print(elapsed)
}
