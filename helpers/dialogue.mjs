const pick = (lines) => lines[Math.floor(Math.random() * (lines.length - 1))];

const died = (name, coords) => {
  const lines = [
    `${name} died at ${coords}.`
  ];

  return pick(lines);
};

const piss = (name, coords) => {
  const lines = [
    `${name} took a piss at ${coords}.`
  ];

  return pick(lines);
};

const shit = (name, coords) => {
  const lines = [
    `${name} took a shit at ${coords}.`
  ];

  return pick(lines);
};

export {
  died,
  piss,
  shit
};
  
