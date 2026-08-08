// All 78 tarot card definitions

const MAJOR_ARCANA = [
  { id:"major_0",  name:"The Fool",          numeral:"0",    type:"major", element:"Air",   planet:"Uranus",
    keywords:["beginnings","innocence","spontaneity","leap of faith"],
    palette:["#0a1628","#5ba3c9","#ffd54f","#ffffff","#87ceeb","#ff9800"], motif:"fool",
    upright:"New beginnings, freedom, innocence, originality. A call to step into the unknown with trust.",
    reversed:"Holding back, recklessness, naivety. Fear of the new journey." },
  { id:"major_1",  name:"The Magician",      numeral:"I",    type:"major", element:"Air",   planet:"Mercury",
    keywords:["willpower","manifestation","skill","resourcefulness"],
    palette:["#1a0a28","#ffd700","#ff4500","#ffffff","#8b0000","#c0392b"], motif:"magician",
    upright:"Willpower, desire, creation, manifestation. You have all the tools you need.",
    reversed:"Trickery, illusions, out of touch, untapped talents." },
  { id:"major_2",  name:"The High Priestess",numeral:"II",   type:"major", element:"Water", planet:"Moon",
    keywords:["intuition","sacred knowledge","divine feminine","subconscious"],
    palette:["#060d1f","#191970","#c0c0c0","#ffffff","#4169e1","#b8d4f5"], motif:"highpriestess",
    upright:"Intuition, sacred knowledge, divine feminine. Trust what cannot be seen.",
    reversed:"Secrets, disconnected from intuition, withdrawal." },
  { id:"major_3",  name:"The Empress",       numeral:"III",  type:"major", element:"Earth", planet:"Venus",
    keywords:["femininity","beauty","nature","abundance"],
    palette:["#0d1a0a","#228b22","#ff69b4","#ffd700","#90ee90","#f5deb3"], motif:"empress",
    upright:"Femininity, beauty, nature, abundance, fertility. Life in full bloom.",
    reversed:"Creative block, dependence on others, neglect of self-care." },
  { id:"major_4",  name:"The Emperor",       numeral:"IV",   type:"major", element:"Fire",  planet:"Mars",
    keywords:["authority","structure","stability","father figure"],
    palette:["#1a0a0a","#8b0000","#ffd700","#c0392b","#4a4a4a","#f4e2c4"], motif:"emperor",
    upright:"Authority, establishment, structure. Order from chaos. Stability through discipline.",
    reversed:"Domination, excessive control, inflexibility." },
  { id:"major_5",  name:"The Hierophant",    numeral:"V",    type:"major", element:"Earth", planet:"Venus",
    keywords:["tradition","spiritual wisdom","conformity","institution"],
    palette:["#100a1a","#4b0082","#ffd700","#ffffff","#8b4513","#e8d5b7"], motif:"hierophant",
    upright:"Spiritual wisdom, tradition, institutions. The sacred teacher.",
    reversed:"Personal beliefs, freedom, challenging the status quo." },
  { id:"major_6",  name:"The Lovers",        numeral:"VI",   type:"major", element:"Air",   planet:"Mercury",
    keywords:["love","harmony","alignment","choices"],
    palette:["#1a0814","#ff69b4","#ffd700","#87ceeb","#ffffff","#ff1493"], motif:"lovers",
    upright:"Love, harmony, relationships, values alignment. A pivotal decision.",
    reversed:"Self-love, disharmony, imbalance, misalignment of values." },
  { id:"major_7",  name:"The Chariot",       numeral:"VII",  type:"major", element:"Water", planet:"Moon",
    keywords:["control","willpower","victory","direction"],
    palette:["#050a1a","#000080","#ffd700","#ffffff","#c0c0c0","#87ceeb"], motif:"chariot",
    upright:"Control, willpower, success, determination. Victory through focus.",
    reversed:"Self-discipline, opposition, lack of direction." },
  { id:"major_8",  name:"Strength",          numeral:"VIII", type:"major", element:"Fire",  planet:"Sun",
    keywords:["strength","courage","patience","inner power"],
    palette:["#1a0d00","#ff8c00","#ffd700","#8b4513","#ffffff","#ff4500"], motif:"strength",
    upright:"Strength, courage, patience, compassion. Gentleness is power.",
    reversed:"Inner strength, self-doubt, low energy, raw emotion." },
  { id:"major_9",  name:"The Hermit",        numeral:"IX",   type:"major", element:"Earth", planet:"Mercury",
    keywords:["soul-searching","introspection","solitude","inner guidance"],
    palette:["#0a0a0a","#708090","#f0e68c","#2f4f4f","#d3d3d3","#1e2a3a"], motif:"hermit",
    upright:"Soul-searching, introspection, inner guidance. The lantern lights the way.",
    reversed:"Isolation, loneliness, withdrawal from the world." },
  { id:"major_10", name:"Wheel of Fortune",  numeral:"X",    type:"major", element:"Fire",  planet:"Jupiter",
    keywords:["cycles","fate","turning point","karma"],
    palette:["#080d1a","#4169e1","#ffd700","#8b0000","#228b22","#ffffff"], motif:"wheel",
    upright:"Good luck, karma, life cycles, destiny. The wheel turns.",
    reversed:"Bad luck, resistance to change, breaking cycles." },
  { id:"major_11", name:"Justice",           numeral:"XI",   type:"major", element:"Air",   planet:"Venus",
    keywords:["fairness","truth","cause and effect","law"],
    palette:["#0a0a14","#8b0000","#ffd700","#4169e1","#ffffff","#c0392b"], motif:"justice",
    upright:"Justice, fairness, truth, cause and effect. The scales do not lie.",
    reversed:"Unfairness, lack of accountability, dishonesty." },
  { id:"major_12", name:"The Hanged Man",    numeral:"XII",  type:"major", element:"Water", planet:"Neptune",
    keywords:["surrender","new perspective","letting go","pause"],
    palette:["#061420","#4169e1","#90ee90","#8b4513","#87ceeb","#ffffff"], motif:"hangedman",
    upright:"Pause, surrender, letting go. Inversion reveals what could not be seen.",
    reversed:"Delays, resistance, stalling, refusal to release." },
  { id:"major_13", name:"Death",             numeral:"XIII", type:"major", element:"Water", planet:"Pluto",
    keywords:["endings","transformation","transition","change"],
    palette:["#050508","#1a1a2e","#ffffff","#8b0000","#708090","#ff4500"], motif:"death",
    upright:"Endings, change, transformation. Not an ending but a metamorphosis.",
    reversed:"Resistance to change, stagnation, clinging to the dead." },
  { id:"major_14", name:"Temperance",        numeral:"XIV",  type:"major", element:"Fire",  planet:"Jupiter",
    keywords:["balance","moderation","patience","flow"],
    palette:["#081428","#87ceeb","#ffd700","#ffffff","#90ee90","#4169e1"], motif:"temperance",
    upright:"Balance, moderation, patience, purpose. Two streams become one.",
    reversed:"Imbalance, excess, lack of long-term vision." },
  { id:"major_15", name:"The Devil",         numeral:"XV",   type:"major", element:"Earth", planet:"Saturn",
    keywords:["shadow self","attachment","addiction","restriction"],
    palette:["#040408","#1a1a2e","#8b0000","#ffd700","#4a4a4a","#ff4500"], motif:"devil",
    upright:"Shadow self, attachment, addiction. The chains are loose — you keep them on by choice.",
    reversed:"Releasing limiting beliefs, detachment, reclaiming freedom." },
  { id:"major_16", name:"The Tower",         numeral:"XVI",  type:"major", element:"Fire",  planet:"Mars",
    keywords:["sudden change","upheaval","revelation","chaos"],
    palette:["#020206","#1a1a2e","#ff4500","#ffd700","#8b0000","#ffffff"], motif:"tower",
    upright:"Sudden change, upheaval, chaos, revelation. The false structure must fall.",
    reversed:"Personal transformation, fear of change, averting disaster." },
  { id:"major_17", name:"The Star",          numeral:"XVII", type:"major", element:"Air",   planet:"Uranus",
    keywords:["hope","faith","renewal","purpose"],
    palette:["#030610","#191970","#ffd700","#87ceeb","#ffffff","#b8c9e8"], motif:"star",
    upright:"Hope, faith, purpose, renewal. A light that never goes out.",
    reversed:"Lack of faith, despair, disconnection from the divine." },
  { id:"major_18", name:"The Moon",          numeral:"XVIII",type:"major", element:"Water", planet:"Neptune",
    keywords:["illusion","fear","the unconscious","mystery"],
    palette:["#030610","#191970","#c0c0c0","#4169e1","#2f4f4f","#9ba8d0"], motif:"moon",
    upright:"Illusion, fear, the unconscious, dreams. Not all is as it appears.",
    reversed:"Release of fear, repressed emotion, unveiling illusion." },
  { id:"major_19", name:"The Sun",           numeral:"XIX",  type:"major", element:"Fire",  planet:"Sun",
    keywords:["positivity","joy","warmth","success"],
    palette:["#1a0e00","#ffd700","#ff8c00","#ffffff","#ff4500","#fffde7"], motif:"sun",
    upright:"Positivity, fun, warmth, success, vitality. Life in full radiance.",
    reversed:"Inner child blocked, feeling down, temporary setbacks." },
  { id:"major_20", name:"Judgement",         numeral:"XX",   type:"major", element:"Fire",  planet:"Pluto",
    keywords:["judgement","rebirth","inner calling","absolution"],
    palette:["#050814","#4169e1","#ffd700","#ffffff","#c0c0c0","#1a1a2e"], motif:"judgement",
    upright:"Judgement, rebirth, inner calling, absolution. Rise and be renewed.",
    reversed:"Self-doubt, inner critic, ignoring the call." },
  { id:"major_21", name:"The World",         numeral:"XXI",  type:"major", element:"Earth", planet:"Saturn",
    keywords:["completion","integration","wholeness","achievement"],
    palette:["#050a14","#4169e1","#228b22","#ffd700","#8b4513","#e0e8f0"], motif:"world",
    upright:"Completion, integration, accomplishment. The journey complete — and complete again.",
    reversed:"Seeking closure, short-cuts, delays, incomplete cycles." }
];

const SUITS = {
  cups:      { name:"Cups",      element:"Water", palette:["#040d1a","#1a3a6e","#4169e1","#87ceeb","#ffffff","#b8d4f5"], symbol:"cup",      keywords:["emotions","intuition","relationships","dreams","creativity"] },
  wands:     { name:"Wands",     element:"Fire",  palette:["#140800","#5a2000","#ff8c00","#ffd700","#8b4513","#fff3e0"], symbol:"wand",     keywords:["passion","inspiration","energy","ambition","growth"] },
  swords:    { name:"Swords",    element:"Air",   palette:["#080a0f","#1a2030","#708090","#c0c0c0","#4169e1","#e8eaf0"], symbol:"sword",    keywords:["intellect","conflict","truth","clarity","change"] },
  pentacles: { name:"Pentacles", element:"Earth", palette:["#080f04","#1a3010","#228b22","#ffd700","#8b4513","#e8f5e9"], symbol:"pentacle", keywords:["material","finances","body","nature","practicality"] }
};

const COURT_RANKS = [
  { rank:"Page",   num:11, desc:"student energy, messages, curiosity" },
  { rank:"Knight", num:12, desc:"movement, action, drive" },
  { rank:"Queen",  num:13, desc:"mastery, nurture, depth" },
  { rank:"King",   num:14, desc:"authority, mastery, command" }
];

const NUM_NAMES = ["","Ace","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten"];

function buildMinorArcana() {
  const cards = [];
  for (const [suitKey, suit] of Object.entries(SUITS)) {
    for (let n = 1; n <= 10; n++) {
      cards.push({
        id:`${suitKey}_${n}`, name:`${NUM_NAMES[n]} of ${suit.name}`,
        numeral: n===1?"A":String(n), type:"minor", suit:suitKey,
        number:n, isCourtCard:false, element:suit.element, palette:suit.palette,
        motif:"minor", keywords:suit.keywords.slice(0,3),
        upright:`${NUM_NAMES[n]} of ${suit.name}: ${suit.keywords.join(", ")}.`,
        reversed:`Blocked ${suit.keywords[0]}, ${suit.keywords[1]} challenges.`
      });
    }
    for (const cr of COURT_RANKS) {
      cards.push({
        id:`${suitKey}_${cr.rank.toLowerCase()}`, name:`${cr.rank} of ${suit.name}`,
        numeral:cr.rank[0], type:"minor", suit:suitKey,
        number:cr.num, isCourtCard:true, courtRank:cr.rank,
        element:suit.element, palette:suit.palette, motif:"court",
        keywords:[cr.desc.split(", ")[0], suit.keywords[0], suit.keywords[1]],
        upright:`${cr.rank} of ${suit.name}: ${cr.desc}. ${suit.keywords.slice(0,2).join(" and ")}.`,
        reversed:`Immature ${cr.rank.toLowerCase()} energy, blocked ${suit.keywords[0]}.`
      });
    }
  }
  return cards;
}

const MINOR_ARCANA = buildMinorArcana();
const ALL_CARDS = [...MAJOR_ARCANA, ...MINOR_ARCANA];

const SPREADS = {
  single: { name:"Single Card", positions:["The Message"] },
  three:  { name:"Three Card",  positions:["Past","Present","Future"] },
  celtic: { name:"Celtic Cross", positions:["The Present","The Challenge","Above — Conscious","Below — Unconscious","Past","Future","Self","Environment","Hopes & Fears","Outcome"] }
};
