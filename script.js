// ------------------------------------------------------------------
// 프리티걸 옷입히기 - vanilla JS dress-up game
// Character is rendered as a single layered SVG built from string
// templates. Each category (hair/outfit/shoes/...) contributes one
// or more layers; recoloring is done via CSS custom properties.
// ------------------------------------------------------------------

const VIEW_W = 320;
const VIEW_H = 520;

function shade(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0x00ff) + amt;
  let b = (num & 0x0000ff) + amt;
  r = Math.max(Math.min(255, r), 0);
  g = Math.max(Math.min(255, g), 0);
  b = Math.max(Math.min(255, b), 0);
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

const SKIN_TONES = ["#ffe6d2", "#ffd8b8", "#f0b988", "#d69465", "#a8683f", "#6f4327"];
const HAIR_COLORS = ["#3b2314", "#6b4226", "#a86b3c", "#d4a24e", "#e8c56b", "#e894b0", "#c74b6b", "#7a4fb5", "#4a6fd4", "#2e2e2e", "#f4f1ea"];
const CLOTHING_COLORS = ["#ff6f91", "#ff9671", "#ffc75f", "#f9f871", "#7ee8a4", "#68d8d6", "#6a9bf4", "#a58bff", "#d16ba5", "#4a4a68", "#ffffff", "#2e2e2e"];

// ---------------------------------------------------------------
// Body base (skin) — head, neck, torso, arms, legs, ears
// ---------------------------------------------------------------
function renderBody() {
  return `
    <g id="layer-legs">
      <rect x="130" y="330" width="26" height="128" rx="13" fill="var(--skin-color)" />
      <rect x="164" y="330" width="26" height="128" rx="13" fill="var(--skin-color)" />
    </g>
    <g id="layer-arms">
      <path d="M122,188 C104,196 93,222 90,262 C88,292 90,310 97,323 C103,327 111,324 111,315 C107,299 107,268 113,238 C117,218 123,202 132,192 Z" fill="var(--skin-color)" />
      <path d="M198,188 C216,196 227,222 230,262 C232,292 230,310 223,323 C217,327 209,324 209,315 C213,299 213,268 207,238 C203,218 197,202 188,192 Z" fill="var(--skin-color)" />
      <circle cx="98" cy="320" r="11" fill="var(--skin-color)" />
      <circle cx="222" cy="320" r="11" fill="var(--skin-color)" />
    </g>
    <g id="layer-torso">
      <path d="M120,186 C120,172 136,163 160,163 C184,163 200,172 200,186 L206,300 C206,316 186,327 160,327 C134,327 114,316 114,300 Z" fill="var(--skin-color)" />
    </g>
    <g id="layer-neck-head">
      <rect x="143" y="148" width="34" height="32" rx="10" fill="var(--skin-color)" />
      <ellipse cx="104" cy="118" rx="8" ry="13" fill="var(--skin-color)" />
      <ellipse cx="216" cy="118" rx="8" ry="13" fill="var(--skin-color)" />
      <circle cx="160" cy="108" r="58" fill="var(--skin-color)" />
    </g>
  `;
}

// ---------------------------------------------------------------
// Hair — each style provides a back layer (drawn behind body/head)
// and a front layer / bangs (drawn above the face).
// ---------------------------------------------------------------
const HAIR_STYLES = {
  long: {
    label: "롱헤어",
    back: `
      <circle cx="160" cy="102" r="66" fill="var(--hair-color)" />
      <path d="M100,140 C88,220 86,305 94,348 C104,360 126,360 133,348 C129,300 121,215 119,140 Z" fill="var(--hair-color)" />
      <path d="M220,140 C232,220 234,305 226,348 C216,360 194,360 187,348 C191,300 199,215 201,140 Z" fill="var(--hair-color)" />
    `,
    bangs: `<path d="M104,96 C104,66 128,48 160,48 C192,48 216,66 216,96 C216,78 194,70 160,70 C126,70 104,78 104,96 Z" fill="var(--hair-color)" />
      <path d="M104,96 C100,110 100,122 104,132 C110,118 112,104 112,92 Z" fill="var(--hair-color)" />`,
  },
  twintail: {
    label: "트윈테일",
    back: `
      <circle cx="160" cy="98" r="60" fill="var(--hair-color)" />
      <circle cx="93" cy="140" r="15" fill="var(--hair-color)" />
      <ellipse cx="86" cy="205" rx="15" ry="58" fill="var(--hair-color)" />
      <circle cx="227" cy="140" r="15" fill="var(--hair-color)" />
      <ellipse cx="234" cy="205" rx="15" ry="58" fill="var(--hair-color)" />
    `,
    bangs: `<path d="M108,92 C108,64 130,50 160,50 C160,50 160,66 160,80 C136,80 118,84 108,96 Z" fill="var(--hair-color)" />
      <path d="M212,92 C212,64 190,50 160,50 C160,50 160,66 160,80 C184,80 202,84 212,96 Z" fill="var(--hair-color)" />`,
  },
  bob: {
    label: "단발",
    back: `
      <circle cx="160" cy="100" r="68" fill="var(--hair-color)" />
      <ellipse cx="106" cy="165" rx="16" ry="32" fill="var(--hair-color)" />
      <ellipse cx="214" cy="165" rx="16" ry="32" fill="var(--hair-color)" />
    `,
    bangs: `<path d="M102,94 C102,64 128,48 160,48 C192,48 218,64 218,94 C218,76 194,68 160,68 C126,68 102,76 102,94 Z" fill="var(--hair-color)" />`,
  },
  curly: {
    label: "웨이브",
    back: `
      <circle cx="160" cy="100" r="64" fill="var(--hair-color)" />
      <circle cx="98" cy="150" r="20" fill="var(--hair-color)" />
      <circle cx="100" cy="195" r="18" fill="var(--hair-color)" />
      <circle cx="110" cy="238" r="16" fill="var(--hair-color)" />
      <circle cx="222" cy="150" r="20" fill="var(--hair-color)" />
      <circle cx="220" cy="195" r="18" fill="var(--hair-color)" />
      <circle cx="210" cy="238" r="16" fill="var(--hair-color)" />
    `,
    bangs: `<path d="M106,92 C106,64 130,48 160,48 C190,48 214,64 214,92 C214,74 192,66 160,66 C128,66 106,74 106,92 Z" fill="var(--hair-color)" />
      <circle cx="108" cy="90" r="12" fill="var(--hair-color)" />
      <circle cx="212" cy="90" r="12" fill="var(--hair-color)" />`,
  },
  ponytail: {
    label: "포니테일",
    back: `
      <circle cx="160" cy="98" r="60" fill="var(--hair-color)" />
      <circle cx="205" cy="62" r="14" fill="var(--hair-color)" />
      <path d="M210,58 C240,70 258,110 250,165 C246,190 232,205 218,208 C224,170 222,120 208,80 Z" fill="var(--hair-color)" />
    `,
    bangs: `<path d="M104,92 C104,64 128,48 160,48 C192,48 216,64 216,92 C216,74 194,66 160,66 C126,66 104,74 104,92 Z" fill="var(--hair-color)" />`,
  },
};

// ---------------------------------------------------------------
// Face expressions
// ---------------------------------------------------------------
const FACES = {
  cute: {
    label: "상냥",
    svg: `
      <ellipse cx="128" cy="122" rx="10" ry="6" fill="#ff9db3" opacity="0.6" />
      <ellipse cx="192" cy="122" rx="10" ry="6" fill="#ff9db3" opacity="0.6" />
      <circle cx="138" cy="108" r="7" fill="#3a2b26" />
      <circle cx="182" cy="108" r="7" fill="#3a2b26" />
      <circle cx="140.5" cy="105.5" r="2" fill="#fff" />
      <circle cx="184.5" cy="105.5" r="2" fill="#fff" />
      <path d="M130,92 Q138,86 146,90" stroke="#3a2b26" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M174,90 Q182,86 190,92" stroke="#3a2b26" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M150,128 Q160,136 170,128" stroke="#c94f6d" stroke-width="3" fill="none" stroke-linecap="round" />
    `,
  },
  wink: {
    label: "윙크",
    svg: `
      <ellipse cx="128" cy="122" rx="10" ry="6" fill="#ff9db3" opacity="0.6" />
      <ellipse cx="192" cy="122" rx="10" ry="6" fill="#ff9db3" opacity="0.6" />
      <circle cx="138" cy="108" r="7" fill="#3a2b26" />
      <circle cx="140.5" cy="105.5" r="2" fill="#fff" />
      <path d="M174,108 Q182,101 190,108" stroke="#3a2b26" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M130,92 Q138,86 146,90" stroke="#3a2b26" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M174,90 Q182,86 190,92" stroke="#3a2b26" stroke-width="2.5" fill="none" stroke-linecap="round" />
      <path d="M148,130 Q160,140 172,128" stroke="#c94f6d" stroke-width="3" fill="none" stroke-linecap="round" />
    `,
  },
  sparkle: {
    label: "반짝",
    svg: `
      <ellipse cx="128" cy="122" rx="10" ry="6" fill="#ff9db3" opacity="0.6" />
      <ellipse cx="192" cy="122" rx="10" ry="6" fill="#ff9db3" opacity="0.6" />
      <path d="M138,98 L141,107 L150,110 L141,113 L138,122 L135,113 L126,110 L135,107 Z" fill="#3a2b26" />
      <path d="M182,98 L185,107 L194,110 L185,113 L182,122 L179,113 L170,110 L179,107 Z" fill="#3a2b26" />
      <path d="M150,130 Q160,140 170,130" stroke="#c94f6d" stroke-width="3" fill="none" stroke-linecap="round" />
    `,
  },
  sleepy: {
    label: "새초롬",
    svg: `
      <ellipse cx="128" cy="122" rx="10" ry="6" fill="#ff9db3" opacity="0.5" />
      <ellipse cx="192" cy="122" rx="10" ry="6" fill="#ff9db3" opacity="0.5" />
      <path d="M128,110 Q138,102 148,110" stroke="#3a2b26" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M172,110 Q182,102 192,110" stroke="#3a2b26" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M155,130 L165,130" stroke="#c94f6d" stroke-width="3" fill="none" stroke-linecap="round" />
    `,
  },
};

// ---------------------------------------------------------------
// Outfits — silhouette drawn over torso/legs/arms.
// primary = var(--outfit-color), secondary = var(--outfit-color2)
// ---------------------------------------------------------------
const OUTFITS = {
  mini: {
    label: "미니원피스",
    svg: `
      <path d="M118,190 C118,178 138,170 160,170 C182,170 202,178 202,190 L214,340 C214,352 106,352 106,340 Z" fill="var(--outfit-color)" />
      <path d="M136,172 Q160,190 184,172 Q160,182 136,172 Z" fill="var(--outfit-color2)" />
      <circle cx="112" cy="196" r="15" fill="var(--outfit-color)" />
      <circle cx="208" cy="196" r="15" fill="var(--outfit-color)" />
    `,
  },
  gown: {
    label: "롱드레스",
    svg: `
      <path d="M118,190 C118,178 138,170 160,170 C182,170 202,178 202,190 L232,455 C232,466 88,466 88,455 Z" fill="var(--outfit-color)" />
      <path d="M136,172 Q160,190 184,172 Q160,182 136,172 Z" fill="var(--outfit-color2)" />
      <circle cx="112" cy="196" r="15" fill="var(--outfit-color)" />
      <circle cx="208" cy="196" r="15" fill="var(--outfit-color)" />
      <path d="M120,300 Q160,310 200,300 L206,340 Q160,352 114,340 Z" fill="var(--outfit-color2)" opacity="0.5" />
    `,
  },
  shirtpants: {
    label: "셔츠+팬츠",
    svg: `
      <rect x="127" y="333" width="30" height="122" rx="12" fill="var(--outfit-color2)" />
      <rect x="163" y="333" width="30" height="122" rx="12" fill="var(--outfit-color2)" />
      <path d="M120,188 C120,176 138,168 160,168 C182,168 200,176 200,188 L194,302 L126,302 Z" fill="var(--outfit-color)" />
      <circle cx="113" cy="195" r="14" fill="var(--outfit-color)" />
      <circle cx="207" cy="195" r="14" fill="var(--outfit-color)" />
    `,
  },
  shirtskirt: {
    label: "셔츠+스커트",
    svg: `
      <path d="M120,188 C120,176 138,168 160,168 C182,168 200,176 200,188 L195,296 L125,296 Z" fill="var(--outfit-color)" />
      <circle cx="113" cy="195" r="14" fill="var(--outfit-color)" />
      <circle cx="207" cy="195" r="14" fill="var(--outfit-color)" />
      <path d="M122,296 L198,296 L214,378 C214,388 106,388 106,378 Z" fill="var(--outfit-color2)" />
    `,
  },
  overalls: {
    label: "멜빵바지",
    svg: `
      <path d="M124,188 C124,176 140,169 160,169 C180,169 196,176 196,188 L190,340 L130,340 Z" fill="var(--outfit-color2)" />
      <circle cx="115" cy="194" r="12" fill="var(--outfit-color2)" />
      <circle cx="205" cy="194" r="12" fill="var(--outfit-color2)" />
      <rect x="128" y="333" width="30" height="122" rx="12" fill="var(--outfit-color)" />
      <rect x="164" y="333" width="30" height="122" rx="12" fill="var(--outfit-color)" />
      <path d="M133,225 L183,225 L188,320 C188,330 128,330 128,320 Z" fill="var(--outfit-color)" />
      <rect x="130" y="182" width="12" height="45" rx="5" fill="var(--outfit-color)" />
      <rect x="178" y="182" width="12" height="45" rx="5" fill="var(--outfit-color)" />
    `,
  },
  hoodie: {
    label: "후드+스커트",
    svg: `
      <path d="M150,178 C150,165 170,165 170,178 L172,196 L148,196 Z" fill="var(--outfit-color2)" />
      <path d="M118,188 C118,176 138,168 160,168 C182,168 202,176 202,188 L196,296 L124,296 Z" fill="var(--outfit-color)" />
      <circle cx="111" cy="196" r="16" fill="var(--outfit-color)" />
      <circle cx="209" cy="196" r="16" fill="var(--outfit-color)" />
      <path d="M120,296 L200,296 L216,378 C216,388 104,388 104,378 Z" fill="var(--outfit-color2)" />
    `,
  },
};

// ---------------------------------------------------------------
// Shoes
// ---------------------------------------------------------------
const SHOES = {
  sneakers: {
    label: "운동화",
    svg: `
      <rect x="126" y="452" width="34" height="20" rx="8" fill="var(--shoe-color)" />
      <rect x="160" y="452" width="34" height="20" rx="8" fill="var(--shoe-color)" />
      <rect x="126" y="466" width="34" height="6" rx="3" fill="#fff" />
      <rect x="160" y="466" width="34" height="6" rx="3" fill="#fff" />
    `,
  },
  boots: {
    label: "부츠",
    svg: `
      <rect x="126" y="425" width="30" height="48" rx="9" fill="var(--shoe-color)" />
      <rect x="164" y="425" width="30" height="48" rx="9" fill="var(--shoe-color)" />
    `,
  },
  heels: {
    label: "힐",
    svg: `
      <path d="M126,452 L158,452 L158,462 L134,468 L126,466 Z" fill="var(--shoe-color)" />
      <path d="M194,452 L162,452 L162,462 L186,468 L194,466 Z" fill="var(--shoe-color)" />
      <rect x="130" y="462" width="4" height="12" fill="var(--shoe-color)" />
      <rect x="186" y="462" width="4" height="12" fill="var(--shoe-color)" />
    `,
  },
  sandals: {
    label: "샌들",
    svg: `
      <rect x="126" y="460" width="34" height="10" rx="5" fill="var(--shoe-color)" />
      <rect x="160" y="460" width="34" height="10" rx="5" fill="var(--shoe-color)" />
      <path d="M136,460 L136,448" stroke="var(--shoe-color)" stroke-width="4" stroke-linecap="round" />
      <path d="M150,460 L150,448" stroke="var(--shoe-color)" stroke-width="4" stroke-linecap="round" />
      <path d="M170,460 L170,448" stroke="var(--shoe-color)" stroke-width="4" stroke-linecap="round" />
      <path d="M184,460 L184,448" stroke="var(--shoe-color)" stroke-width="4" stroke-linecap="round" />
    `,
  },
  maryjane: {
    label: "메리제인",
    svg: `
      <rect x="126" y="450" width="34" height="22" rx="10" fill="var(--shoe-color)" />
      <rect x="160" y="450" width="34" height="22" rx="10" fill="var(--shoe-color)" />
      <path d="M132,452 Q143,446 154,452" stroke="#fff" stroke-width="3" fill="none" />
      <path d="M166,452 Q177,446 188,452" stroke="#fff" stroke-width="3" fill="none" />
      <circle cx="143" cy="450" r="2.5" fill="#fff" />
      <circle cx="177" cy="450" r="2.5" fill="#fff" />
    `,
  },
};

// ---------------------------------------------------------------
// Accessories (multi-select toggles)
// ---------------------------------------------------------------
const ACCESSORIES = {
  glasses: {
    label: "안경",
    svg: `
      <rect x="122" y="99" width="32" height="20" rx="8" fill="none" stroke="#4a4a68" stroke-width="3" />
      <rect x="166" y="99" width="32" height="20" rx="8" fill="none" stroke="#4a4a68" stroke-width="3" />
      <path d="M154,108 L166,108" stroke="#4a4a68" stroke-width="3" />
      <path d="M122,105 L108,100" stroke="#4a4a68" stroke-width="3" />
      <path d="M198,105 L212,100" stroke="#4a4a68" stroke-width="3" />
    `,
  },
  hat: {
    label: "모자",
    svg: `
      <ellipse cx="160" cy="72" rx="66" ry="12" fill="#ff9671" />
      <path d="M116,72 C116,40 138,20 160,20 C182,20 204,40 204,72 Z" fill="#ffab8e" />
      <ellipse cx="160" cy="72" rx="46" ry="8" fill="#ff7a4f" opacity="0.4" />
    `,
  },
  necklace: {
    label: "목걸이",
    svg: `
      <path d="M140,192 Q160,212 180,192" stroke="#ffd93d" stroke-width="3" fill="none" />
      <circle cx="160" cy="212" r="6" fill="#ffd93d" />
    `,
  },
  bow: {
    label: "리본",
    svg: `
      <path d="M205,58 L225,46 L225,70 Z" fill="#ff6f91" />
      <path d="M205,58 L185,46 L185,70 Z" fill="#ff6f91" />
      <circle cx="205" cy="58" r="7" fill="#ff4d79" />
    `,
  },
  earrings: {
    label: "귀걸이",
    svg: `
      <circle cx="104" cy="135" r="4" fill="#ffd93d" />
      <circle cx="216" cy="135" r="4" fill="#ffd93d" />
    `,
  },
};

const BACKGROUNDS = {
  pink: { label: "핑크", from: "#ffd1e3", to: "#ffe9f2" },
  peach: { label: "피치", from: "#ffe0c2", to: "#fff3e6" },
  mint: { label: "민트", from: "#c7f5e6", to: "#eafff9" },
  sky: { label: "하늘", from: "#cfe8ff", to: "#eef7ff" },
  lavender: { label: "라벤더", from: "#e2d6ff", to: "#f4eeff" },
  sunny: { label: "레몬", from: "#fff3b0", to: "#fffbe0" },
};

// ---------------------------------------------------------------
// State
// ---------------------------------------------------------------
const DEFAULT_STATE = {
  bg: "pink",
  skin: SKIN_TONES[0],
  hair: "long",
  hairColor: HAIR_COLORS[0],
  face: "cute",
  outfit: "mini",
  outfitColor: CLOTHING_COLORS[0],
  shoes: "sneakers",
  shoeColor: CLOTHING_COLORS[9],
  acc: { glasses: false, hat: false, necklace: false, bow: true, earrings: false },
};

let state = JSON.parse(JSON.stringify(DEFAULT_STATE));

// ---------------------------------------------------------------
// Main character render
// ---------------------------------------------------------------
function renderStage() {
  const bg = BACKGROUNDS[state.bg];
  const hair = HAIR_STYLES[state.hair];
  const face = FACES[state.face];
  const outfit = OUTFITS[state.outfit];
  const shoe = SHOES[state.shoes];

  const accSvg = Object.keys(ACCESSORIES)
    .filter((k) => state.acc[k])
    .map((k) => ACCESSORIES[k].svg)
    .join("\n");

  const style = `
    --skin-color:${state.skin};
    --hair-color:${state.hairColor};
    --outfit-color:${state.outfitColor};
    --outfit-color2:${shade(state.outfitColor, -18)};
    --shoe-color:${state.shoeColor};
  `;

  return `
    <svg viewBox="0 0 ${VIEW_W} ${VIEW_H}" style="${style}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="${bg.from}" />
          <stop offset="100%" stop-color="${bg.to}" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="${VIEW_W}" height="${VIEW_H}" fill="url(#bgGrad)" />
      <ellipse cx="160" cy="490" rx="90" ry="14" fill="#000" opacity="0.06" />
      <g id="hair-back">${hair.back}</g>
      ${renderBody()}
      <g id="outfit-layer">${outfit.svg}</g>
      <g id="shoes-layer">${shoe.svg}</g>
      <g id="face-layer">${face.svg}</g>
      <g id="hair-front">${hair.bangs}</g>
      <g id="acc-layer">${accSvg}</g>
    </svg>
  `;
}

function paint() {
  document.getElementById("stage").innerHTML = renderStage();
}

// ---------------------------------------------------------------
// UI construction
// ---------------------------------------------------------------
const TABS = [
  { id: "bg", label: "배경" },
  { id: "skin", label: "피부" },
  { id: "hair", label: "헤어" },
  { id: "face", label: "표정" },
  { id: "outfit", label: "의상" },
  { id: "shoes", label: "신발" },
  { id: "acc", label: "소품" },
];

function svgWrap(inner, viewBox) {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

function buildOptionGrid(entries, viewBox, colorVars, selectedId, onPick) {
  const grid = document.createElement("div");
  grid.className = "option-grid";
  entries.forEach(([id, def]) => {
    const item = document.createElement("div");
    item.className = "option-item" + (id === selectedId ? " selected" : "");
    item.title = def.label;
    const styleVars = colorVars ? colorVars : "";
    item.innerHTML = `<div style="width:100%;height:100%;${styleVars}">${svgWrap(
      def.back ? def.back + def.bangs : def.svg,
      viewBox
    )}</div>`;
    item.addEventListener("click", () => onPick(id));
    grid.appendChild(item);
  });
  return grid;
}

function buildSwatchRow(colors, selected, onPick) {
  const row = document.createElement("div");
  row.className = "swatch-row";
  colors.forEach((c) => {
    const sw = document.createElement("div");
    sw.className = "swatch" + (c.toLowerCase() === selected.toLowerCase() ? " selected" : "");
    sw.style.background = c;
    sw.addEventListener("click", () => onPick(c));
    row.appendChild(sw);
  });
  return row;
}

function buildPanelContent(tabId) {
  const wrap = document.createElement("div");

  if (tabId === "bg") {
    const title = document.createElement("p");
    title.className = "section-title";
    title.textContent = "배경 색상";
    wrap.appendChild(title);
    const grid = document.createElement("div");
    grid.className = "chip-grid";
    Object.entries(BACKGROUNDS).forEach(([id, def]) => {
      const chip = document.createElement("button");
      chip.className = "toggle-chip" + (state.bg === id ? " on" : "");
      chip.innerHTML = `<span style="width:14px;height:14px;border-radius:50%;background:linear-gradient(135deg,${def.from},${def.to});display:inline-block;border:1px solid #eee"></span>${def.label}`;
      chip.addEventListener("click", () => {
        state.bg = id;
        paint();
        renderTabPanel("bg");
      });
      grid.appendChild(chip);
    });
    wrap.appendChild(grid);
  }

  if (tabId === "skin") {
    const title = document.createElement("p");
    title.className = "section-title";
    title.textContent = "피부 톤";
    wrap.appendChild(title);
    wrap.appendChild(
      buildSwatchRow(SKIN_TONES, state.skin, (c) => {
        state.skin = c;
        paint();
        renderTabPanel("skin");
      })
    );
  }

  if (tabId === "hair") {
    const title1 = document.createElement("p");
    title1.className = "section-title";
    title1.textContent = "헤어스타일";
    wrap.appendChild(title1);
    wrap.appendChild(
      buildOptionGrid(
        Object.entries(HAIR_STYLES),
        "40 30 240 220",
        `--hair-color:${state.hairColor}`,
        state.hair,
        (id) => {
          state.hair = id;
          paint();
          renderTabPanel("hair");
        }
      )
    );
    const title2 = document.createElement("p");
    title2.className = "section-title";
    title2.textContent = "헤어 컬러";
    wrap.appendChild(title2);
    wrap.appendChild(
      buildSwatchRow(HAIR_COLORS, state.hairColor, (c) => {
        state.hairColor = c;
        paint();
        renderTabPanel("hair");
      })
    );
  }

  if (tabId === "face") {
    const title = document.createElement("p");
    title.className = "section-title";
    title.textContent = "표정";
    wrap.appendChild(title);
    wrap.appendChild(
      buildOptionGrid(
        Object.entries(FACES),
        "90 70 140 90",
        "",
        state.face,
        (id) => {
          state.face = id;
          paint();
          renderTabPanel("face");
        }
      )
    );
  }

  if (tabId === "outfit") {
    const title1 = document.createElement("p");
    title1.className = "section-title";
    title1.textContent = "의상 스타일";
    wrap.appendChild(title1);
    wrap.appendChild(
      buildOptionGrid(
        Object.entries(OUTFITS),
        "80 160 160 260",
        `--outfit-color:${state.outfitColor};--outfit-color2:${shade(state.outfitColor, -18)}`,
        state.outfit,
        (id) => {
          state.outfit = id;
          paint();
          renderTabPanel("outfit");
        }
      )
    );
    const title2 = document.createElement("p");
    title2.className = "section-title";
    title2.textContent = "의상 컬러";
    wrap.appendChild(title2);
    wrap.appendChild(
      buildSwatchRow(CLOTHING_COLORS, state.outfitColor, (c) => {
        state.outfitColor = c;
        paint();
        renderTabPanel("outfit");
      })
    );
  }

  if (tabId === "shoes") {
    const title1 = document.createElement("p");
    title1.className = "section-title";
    title1.textContent = "신발 스타일";
    wrap.appendChild(title1);
    wrap.appendChild(
      buildOptionGrid(
        Object.entries(SHOES),
        "110 415 100 65",
        `--shoe-color:${state.shoeColor}`,
        state.shoes,
        (id) => {
          state.shoes = id;
          paint();
          renderTabPanel("shoes");
        }
      )
    );
    const title2 = document.createElement("p");
    title2.className = "section-title";
    title2.textContent = "신발 컬러";
    wrap.appendChild(title2);
    wrap.appendChild(
      buildSwatchRow(CLOTHING_COLORS, state.shoeColor, (c) => {
        state.shoeColor = c;
        paint();
        renderTabPanel("shoes");
      })
    );
  }

  if (tabId === "acc") {
    const title = document.createElement("p");
    title.className = "section-title";
    title.textContent = "액세서리 (여러 개 선택 가능)";
    wrap.appendChild(title);
    const grid = document.createElement("div");
    grid.className = "chip-grid";
    Object.entries(ACCESSORIES).forEach(([id, def]) => {
      const chip = document.createElement("button");
      chip.className = "toggle-chip" + (state.acc[id] ? " on" : "");
      chip.textContent = def.label;
      chip.addEventListener("click", () => {
        state.acc[id] = !state.acc[id];
        paint();
        renderTabPanel("acc");
      });
      grid.appendChild(chip);
    });
    wrap.appendChild(grid);
  }

  return wrap;
}

let activeTab = "hair";

function renderTabPanel(tabId) {
  const container = document.getElementById("tab-panels");
  container.innerHTML = "";
  const panel = document.createElement("div");
  panel.className = "tab-panel active";
  panel.appendChild(buildPanelContent(tabId));
  container.appendChild(panel);
}

function buildTabs() {
  const tabsEl = document.getElementById("tabs");
  tabsEl.innerHTML = "";
  TABS.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "tab-btn" + (t.id === activeTab ? " active" : "");
    btn.textContent = t.label;
    btn.addEventListener("click", () => {
      activeTab = t.id;
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      renderTabPanel(activeTab);
    });
    tabsEl.appendChild(btn);
  });
  renderTabPanel(activeTab);
}

// ---------------------------------------------------------------
// Actions: random / reset / save
// ---------------------------------------------------------------
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomize() {
  state.bg = pick(Object.keys(BACKGROUNDS));
  state.skin = pick(SKIN_TONES);
  state.hair = pick(Object.keys(HAIR_STYLES));
  state.hairColor = pick(HAIR_COLORS);
  state.face = pick(Object.keys(FACES));
  state.outfit = pick(Object.keys(OUTFITS));
  state.outfitColor = pick(CLOTHING_COLORS);
  state.shoes = pick(Object.keys(SHOES));
  state.shoeColor = pick(CLOTHING_COLORS);
  Object.keys(state.acc).forEach((k) => {
    state.acc[k] = Math.random() > 0.6;
  });
  paint();
  renderTabPanel(activeTab);
}

function resetAll() {
  state = JSON.parse(JSON.stringify(DEFAULT_STATE));
  paint();
  renderTabPanel(activeTab);
}

function saveAsImage() {
  const svgEl = document.querySelector("#stage svg");
  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgEl);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement("canvas");
    const scale = 2;
    canvas.width = VIEW_W * scale;
    canvas.height = VIEW_H * scale;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    URL.revokeObjectURL(url);
    canvas.toBlob((blob) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = "pretty-girl.png";
      a.click();
    });
  };
  img.src = url;
}

// ---------------------------------------------------------------
// Init
// ---------------------------------------------------------------
document.getElementById("btn-random").addEventListener("click", randomize);
document.getElementById("btn-reset").addEventListener("click", resetAll);
document.getElementById("btn-save").addEventListener("click", saveAsImage);

paint();
buildTabs();
