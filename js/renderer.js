// p5.js card rendering engine — The Generative Tarot

const CARD_W = 160;
const CARD_H = 278;

function cardHash(str) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return h;
}

function renderCard(p, card, readingSeed) {
  const g = p.createGraphics(CARD_W, CARD_H);
  g.pixelDensity(window.devicePixelRatio || 1);
  const seed = (cardHash(card.id) ^ ((readingSeed | 0) & 0xFFFF)) >>> 0;
  g.randomSeed(seed); g.noiseSeed(seed);
  _drawBg(g, card.palette);
  _drawBorder(g, card.palette);
  _drawMotif(g, card, seed, card.palette);
  _drawTitle(g, card, card.palette);
  return g;
}

function _drawBg(g, pal) {
  for (let y = 0; y < CARD_H; y++) {
    const c = g.lerpColor(g.color(pal[0]), g.color(pal[1]), (y / CARD_H) * 0.55);
    g.stroke(c); g.line(0, y, CARD_W, y);
  }
  g.noStroke();
  for (let i = 5; i >= 1; i--) {
    g.fill(0, 0, 0, 12 * i);
    g.ellipse(CARD_W / 2, CARD_H / 2, CARD_W * i * 0.45, CARD_H * i * 0.45);
  }
}

function _drawBorder(g, pal) {
  const light = pal[2] || "#ffffff", dim = pal[3] || pal[1];
  g.noFill();
  g.stroke(light); g.strokeWeight(2); g.rect(5, 5, CARD_W - 10, CARD_H - 10, 3);
  g.stroke(dim);   g.strokeWeight(1); g.rect(9, 9, CARD_W - 18, CARD_H - 18, 2);
  const corners = [[13,13],[CARD_W-13,13],[13,CARD_H-13],[CARD_W-13,CARD_H-13]];
  g.strokeWeight(0.8); g.stroke(light);
  for (const [x, y] of corners) {
    g.fill(light); g.push(); g.translate(x, y); g.rotate(Math.PI / 4); g.rect(-2.5,-2.5,5,5); g.pop();
    g.noFill(); g.circle(x, y, 9);
  }
  g.stroke(light); g.strokeWeight(0.8); g.noFill();
  g.line(20,22,CARD_W-20,22); g.line(20,CARD_H-22,CARD_W-20,CARD_H-22);
}

function _drawTitle(g, card, pal) {
  const light = pal[2] || "#ffffff";
  g.textAlign(g.CENTER, g.CENTER); g.noStroke();
  g.textSize(9); g.fill(light); g.text(card.numeral, CARD_W/2, 15);
  g.fill(0,0,0,100); g.noStroke(); g.rect(12, CARD_H-38, CARD_W-24, 28, 2);
  g.fill(light); g.textSize(8); g.text(card.name.toUpperCase(), CARD_W/2, CARD_H-26);
  if (card.keywords && card.keywords.length) {
    g.textSize(5.5); g.fill(255,255,255,140);
    g.text(card.keywords.slice(0,3).join("  ·  "), CARD_W/2, CARD_H-15);
  }
}

function _drawMotif(g, card, seed, pal) {
  const cx = CARD_W/2, cy = CARD_H/2 - 10, r = Math.min(CARD_W,CARD_H) * 0.32;
  if (card.motif === "minor") { _minor(g, card, cx, cy, r, pal); return; }
  if (card.motif === "court") { _court(g, card, cx, cy, r, pal); return; }
  const fn = MAJOR_MOTIFS[card.motif];
  if (fn) fn(g, cx, cy, r, pal, seed);
}

// ── Helpers ───────────────────────────────────────────────────────
function _star(g, x, y, r1, r2, pts, col) {
  g.noStroke(); g.fill(col);
  g.beginShape();
  for (let i = 0; i < pts*2; i++) {
    const a = (i/(pts*2))*Math.PI*2 - Math.PI/2, rad = i%2===0 ? r2 : r1;
    g.vertex(x + rad*Math.cos(a), y + rad*Math.sin(a));
  }
  g.endShape(g.CLOSE);
}

function _pentagram(g, cx, cy, r, col, inv) {
  const pts=[], sa = inv ? Math.PI/2 : -Math.PI/2;
  for (let i=0;i<5;i++) { const a=sa+(i*4/5)*Math.PI*2; pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]); }
  g.noFill(); g.stroke(col); g.strokeWeight(1.5);
  for (let i=0;i<5;i++) { const n=(i+2)%5; g.line(pts[i][0],pts[i][1],pts[n][0],pts[n][1]); }
}

function _pip(g, suit, x, y, sz, col) {
  if (suit==="cups") {
    g.noFill(); g.stroke(col); g.strokeWeight(sz*0.12);
    g.beginShape(); g.vertex(x-sz*0.45,y-sz*0.3); g.vertex(x+sz*0.45,y-sz*0.3); g.vertex(x+sz*0.32,y+sz*0.28); g.vertex(x-sz*0.32,y+sz*0.28); g.endShape(g.CLOSE);
    g.line(x,y+sz*0.28,x,y+sz*0.48); g.line(x-sz*0.3,y+sz*0.48,x+sz*0.3,y+sz*0.48);
  } else if (suit==="wands") {
    g.stroke(col); g.strokeWeight(sz*0.13); g.noFill();
    g.line(x,y-sz*0.5,x,y+sz*0.5); g.line(x-sz*0.2,y-sz*0.2,x+sz*0.2,y-sz*0.2);
    g.line(x-sz*0.14,y+sz*0.05,x+sz*0.14,y+sz*0.05); g.circle(x,y-sz*0.5,sz*0.22);
  } else if (suit==="swords") {
    g.stroke(col); g.strokeWeight(sz*0.11);
    g.line(x,y-sz*0.55,x,y+sz*0.55); g.line(x-sz*0.28,y-sz*0.12,x+sz*0.28,y-sz*0.12);
    g.noStroke(); g.fill(col); g.triangle(x-sz*0.1,y+sz*0.55,x+sz*0.1,y+sz*0.55,x,y+sz*0.72);
  } else {
    _pentagram(g,x,y,sz*0.42,col,false);
  }
}

// Pip positions (fraction of r, for up to 10 pips)
const PIPS = {
  1:[[0,0]], 2:[[0,-.56],[0,.56]], 3:[[0,-.56],[0,0],[0,.56]],
  4:[[-.35,-.45],[.35,-.45],[-.35,.45],[.35,.45]],
  5:[[-.35,-.45],[.35,-.45],[0,0],[-.35,.45],[.35,.45]],
  6:[[-.35,-.55],[.35,-.55],[-.35,0],[.35,0],[-.35,.55],[.35,.55]],
  7:[[-.35,-.55],[.35,-.55],[0,-.25],[-.35,.1],[.35,.1],[-.35,.6],[.35,.6]],
  8:[[-.35,-.6],[.35,-.6],[-.35,-.2],[.35,-.2],[-.35,.2],[.35,.2],[-.35,.6],[.35,.6]],
  9:[[-.35,-.65],[.35,-.65],[-.35,-.3],[.35,-.3],[0,0],[-.35,.3],[.35,.3],[-.35,.65],[.35,.65]],
  10:[[-.35,-.65],[.35,-.65],[-.35,-.35],[.35,-.35],[-.35,0],[.35,0],[-.35,.35],[.35,.35],[-.35,.65],[.35,.65]]
};

function _minor(g, card, cx, cy, r, pal) {
  const col = pal[2]||"#fff", sz = r*0.38;
  g.noFill(); g.stroke(pal[1]); g.strokeWeight(0.6); g.circle(cx,cy,r*1.5);
  for (const [dx,dy] of (PIPS[card.number]||PIPS[1])) _pip(g, card.suit, cx+dx*r*1.2, cy+dy*r, sz, col);
}

function _court(g, card, cx, cy, r, pal) {
  const col=pal[2]||"#fff", col2=pal[1], rank=card.courtRank;
  g.noFill(); g.stroke(col2); g.strokeWeight(0.8); g.circle(cx,cy-r*0.1,r*1.6);
  g.noStroke(); g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[1]),0.3));
  g.rect(cx-r*0.5,cy+r*0.3,r,r*0.55,3);
  const hy = cy-r*0.35;
  g.fill(col); g.noStroke(); g.circle(cx,hy,rank==="King"?18:rank==="Queen"?16:rank==="Knight"?14:13);
  g.noStroke(); g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[2]),0.35));
  g.beginShape(); g.vertex(cx-14,hy+9); g.vertex(cx+14,hy+9); g.vertex(cx+r*0.5,cy+r*0.32); g.vertex(cx-r*0.5,cy+r*0.32); g.endShape(g.CLOSE);
  _pip(g, card.suit, cx, cy+r*0.05, r*0.28, col2);
  if (rank==="King") {
    g.fill(col2); g.noStroke(); g.rect(cx-12,hy-14,24,8,1);
    for (let i=0;i<5;i++) g.triangle(cx-10+i*5,hy-14,cx-8+i*5,hy-22,cx-6+i*5,hy-14);
    g.stroke(col2); g.strokeWeight(2); g.line(cx+r*0.42,hy-16,cx+r*0.42,cy+r*0.55);
    g.noFill(); g.circle(cx+r*0.42,hy-22,10);
  } else if (rank==="Queen") {
    g.fill(col2); g.noStroke(); g.rect(cx-10,hy-13,20,7,1);
    for (let i=0;i<3;i++) g.circle(cx-6+i*6,hy-16,5);
  } else if (rank==="Knight") {
    g.fill(col2); g.noStroke(); g.arc(cx,hy,24,24,Math.PI,0); g.rect(cx-12,hy-2,24,8,0,0,3,3);
    g.fill(pal[0]); g.rect(cx-10,hy-4,20,5,1);
    g.stroke(col2); g.strokeWeight(2); g.line(cx+r*0.4,hy-18,cx+r*0.4,cy+r*0.6);
  } else {
    g.fill(col2); g.noStroke(); g.rect(cx-9,hy-11,18,5,2);
    g.stroke(col2); g.strokeWeight(1.5); g.line(cx+r*0.35,hy-8,cx+r*0.35,cy+r*0.55);
    g.noFill(); g.circle(cx+r*0.35,hy-12,7);
  }
}

// ════════════════════════════════════════════════════════════════
//  MAJOR ARCANA MOTIFS  (one function per card)
// ════════════════════════════════════════════════════════════════
const MAJOR_MOTIFS = {

  fool(g,cx,cy,r,pal) {
    g.noStroke(); g.fill(pal[3]||pal[1]);
    g.triangle(cx,cy-r*.8,cx-r,cy+r,cx+r,cy+r);
    g.fill(pal[2]);
    g.beginShape(); g.vertex(cx+r*.25,cy-r*.4); g.vertex(cx+r*.1,cy-r*.2); g.vertex(cx+r*.38,cy-r*.15); g.endShape(g.CLOSE);
    g.noFill(); g.stroke(pal[4]||pal[1]); g.strokeWeight(2);
    g.arc(cx-r*.2,cy+r*.5,r*.9,r*.9,Math.PI,0);
    g.noStroke();
    for (let i=0;i<60;i++) {
      const t=i/60,a=t*Math.PI*5,rad=t*r*.45;
      g.fill(pal[i%pal.length]); g.circle(cx+rad*Math.cos(a),cy-r*.1+rad*Math.sin(a)*.6,g.map(t,0,1,2,6));
    }
    for (let i=0;i<5;i++) _star(g,cx-r*.6+i*r*.3,cy-r*.9+(i%2)*8,1.5,3,5,pal[2]);
  },

  magician(g,cx,cy,r,pal) {
    const top=cy-r*.55,a=r*.3;
    g.noFill(); g.stroke(pal[2]||"#fff"); g.strokeWeight(2.5);
    g.beginShape();
    for (let t=0;t<=Math.PI*2;t+=.05) { const d=1+Math.sin(t)**2; g.curveVertex(cx+a*Math.cos(t)/d,top+a*Math.sin(t)*Math.cos(t)/d); }
    g.endShape(g.CLOSE);
    g.noStroke(); g.fill(pal[3]||pal[2]); g.circle(cx,top,3);
    const ay=cy+r*.15;
    g.stroke(pal[1]); g.strokeWeight(1.5); g.noFill(); g.line(cx-r*.5,ay+18,cx+r*.5,ay+18);
    const glyphs=["◆","≋","✦","⬟"];
    g.textAlign(g.CENTER,g.CENTER); g.textSize(14); g.noStroke();
    for (let i=0;i<4;i++) { g.fill(pal[i]); g.text(glyphs[i],cx-r*.45+i*r*.3,ay); }
    for (let i=0;i<8;i++) {
      const ang=(i/8)*Math.PI*2-Math.PI/2;
      g.stroke(pal[i%pal.length]); g.strokeWeight(1.2);
      g.line(cx+r*.12*Math.cos(ang),top+r*.12*Math.sin(ang),cx+r*.22*Math.cos(ang),top+r*.22*Math.sin(ang));
    }
  },

  highpriestess(g,cx,cy,r,pal) {
    const px=r*.55,pt=cy-r*.9,pb=cy+r*.7;
    g.noStroke();
    g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[3]),0.4)); g.rect(cx-px-10,pt,20,pb-pt,2);
    g.fill(g.lerpColor(g.color(pal[2]),g.color(pal[3]),0.4)); g.rect(cx+px-10,pt,20,pb-pt,2);
    g.fill(pal[1]); g.rect(cx-px-12,pt-6,24,8,1); g.rect(cx+px-12,pt-6,24,8,1);
    g.noFill(); g.stroke(pal[3]); g.strokeWeight(1);
    for (let row=0;row<6;row++) {
      const vy=cy-r*.3+row*14;
      g.beginShape();
      for (let x=cx-px+1;x<=cx+px-1;x+=3) g.curveVertex(x,vy+Math.sin((x-cx)*.15+row)*3);
      g.endShape();
    }
    g.noStroke(); g.fill(pal[2]); g.circle(cx,pt-18,22); g.fill(pal[0]); g.circle(cx+7,pt-20,18);
    for (let i=0;i<5;i++) _star(g,cx-r*.4+i*r*.2,pt-30+(i%2)*6,2,4,5,pal[2]);
  },

  empress(g,cx,cy,r,pal) {
    for (let p=0;p<8;p++) {
      const a=(p/8)*Math.PI*2;
      g.push(); g.translate(cx,cy); g.rotate(a);
      g.noStroke(); g.fill(g.lerpColor(g.color(pal[2]),g.color(pal[1]),p/8));
      g.ellipse(0,-r*.55,r*.35,r*.7); g.pop();
    }
    for (let i=3;i>=1;i--) { g.noFill(); g.stroke(pal[i%pal.length]); g.strokeWeight(1); g.circle(cx,cy,r*i*.45); }
    g.fill(pal[3]||pal[2]); g.noStroke(); g.textAlign(g.CENTER,g.CENTER); g.textSize(30); g.text("♀",cx,cy);
    for (let i=0;i<12;i++) { const a=(i/12)*Math.PI*2; g.fill(pal[i%pal.length]); g.noStroke(); g.circle(cx+r*.85*Math.cos(a),cy+r*.85*Math.sin(a),4); }
  },

  emperor(g,cx,cy,r,pal) {
    g.noStroke(); g.fill(pal[3]||pal[1]); g.triangle(cx,cy-r*.8,cx-r,cy+r,cx+r,cy+r);
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1.5); g.rect(cx-r*.45,cy-r*.5,r*.9,r*.9,2);
    g.strokeWeight(.8); g.stroke(pal[1]); g.rect(cx-r*.35,cy-r*.4,r*.7,r*.7,1);
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(2);
    g.arc(cx-r*.28,cy-r*.35,r*.4,r*.4,Math.PI,Math.PI*1.9);
    g.arc(cx+r*.28,cy-r*.35,r*.4,r*.4,Math.PI*1.1,0);
    g.strokeWeight(2); g.stroke(pal[1]);
    g.line(cx+r*.4,cy-r*.9,cx+r*.4,cy+r*.6); g.noFill(); g.strokeWeight(1.5); g.circle(cx+r*.4,cy-r*.9,10);
    g.line(cx+r*.28,cy-r*.72,cx+r*.52,cy-r*.72);
  },

  hierophant(g,cx,cy,r,pal) {
    for (let i=3;i>=1;i--) {
      g.noFill(); g.stroke(g.lerpColor(g.color(pal[1]),g.color(pal[0]),i/3)); g.strokeWeight(i*2); g.circle(cx,cy-r*.1,r*i*.5);
    }
    const cH=r*1.1,cW=r*.65;
    g.stroke(pal[2]); g.strokeWeight(3); g.noFill();
    g.line(cx,cy-cH*.5,cx,cy+cH*.5); g.line(cx-cW*.5,cy-cH*.28,cx+cW*.5,cy-cH*.28);
    g.strokeWeight(2); g.line(cx-cW*.4,cy,cx+cW*.4,cy);
    g.strokeWeight(1.5); g.line(cx-cW*.25,cy+cH*.22,cx+cW*.25,cy+cH*.22);
    g.noStroke(); g.fill(pal[1]); for (let i=0;i<3;i++) g.circle(cx-8+i*8,cy-cH*.55,5);
    g.stroke(pal[3]||pal[2]); g.strokeWeight(.8);
    for (let i=0;i<6;i++) { const a=(i/6)*Math.PI*2; g.line(cx,cy-r*.1,cx+r*.7*Math.cos(a),cy-r*.1+r*.7*Math.sin(a)); }
  },

  lovers(g,cx,cy,r,pal) {
    const ox=r*.35;
    g.noFill(); g.strokeWeight(1.5);
    g.stroke(pal[2]); g.circle(cx-ox,cy+r*.1,r*1.1);
    g.stroke(pal[3]||pal[4]); g.circle(cx+ox,cy+r*.1,r*1.1);
    g.noStroke(); g.fill(g.lerpColor(g.color(pal[2]),g.color(pal[3]||pal[4]),.5)); g.ellipse(cx,cy+r*.1,ox*1.05,r*1.1);
    g.noFill(); g.stroke(pal[1]); g.strokeWeight(2); g.arc(cx,cy-r*.5,r*1.4,r*.8,Math.PI,0);
    g.noStroke(); g.fill(pal[1]); g.circle(cx,cy-r*.9,12); g.fill(pal[2]); g.circle(cx,cy-r*.9,6);
    _star(g,cx,cy-r*.9,5,9,8,pal[1]);
    g.fill(pal[2]); g.noStroke(); g.textAlign(g.CENTER,g.CENTER); g.textSize(16); g.text("♡",cx,cy+r*.1);
  },

  chariot(g,cx,cy,r,pal) {
    for (let i=0;i<9;i++) _star(g,cx-r*.7+(i%3)*r*.7,cy-r*.8+Math.floor(i/3)*r*.25,2,4,5,pal[2]||"#fff");
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(2); g.rect(cx-r*.55,cy-r*.4,r*1.1,r*.65,3);
    g.strokeWeight(1); g.stroke(pal[1]); g.line(cx-r*.55,cy-r*.1,cx+r*.55,cy-r*.1);
    for (const sx of [cx-r*.35,cx+r*.35]) { g.fill(pal[3]||pal[1]); g.noStroke(); g.ellipse(sx,cy+r*.4,18,12); g.circle(sx,cy+r*.25,11); }
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1.5); g.circle(cx,cy+r*.6,r*.4);
    for (let i=0;i<6;i++) { const a=(i/6)*Math.PI*2; g.line(cx,cy+r*.6,cx+r*.2*Math.cos(a),cy+r*.6+r*.2*Math.sin(a)); }
    const ay=cy-r*.6; g.stroke(pal[1]); g.strokeWeight(2);
    g.line(cx-r*.2,ay,cx+r*.2,ay); g.line(cx+r*.2,ay,cx+r*.1,ay-6); g.line(cx+r*.2,ay,cx+r*.1,ay+6);
  },

  strength(g,cx,cy,r,pal) {
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(2);
    const a=r*.3,ty=cy-r*.65;
    g.beginShape();
    for (let t=0;t<=Math.PI*2;t+=.05) { const d=1+Math.sin(t)**2; g.curveVertex(cx+a*Math.cos(t)/d,ty+a*Math.sin(t)*Math.cos(t)/d); }
    g.endShape(g.CLOSE);
    g.noStroke(); g.fill(pal[1]); g.ellipse(cx,cy+r*.2,r*.95,r*.65); g.circle(cx-r*.3,cy-r*.1,r*.5);
    g.fill(pal[3]||pal[1]);
    for (let i=0;i<8;i++) {
      const ang=(i/8)*Math.PI*2,hx=cx-r*.3,hy=cy-r*.1;
      g.triangle(hx+r*.25*Math.cos(ang),hy+r*.25*Math.sin(ang),hx+r*.38*Math.cos(ang-.3),hy+r*.38*Math.sin(ang-.3),hx+r*.38*Math.cos(ang+.3),hy+r*.38*Math.sin(ang+.3));
    }
    g.fill(pal[2]); g.noStroke(); g.ellipse(cx+r*.22,cy-r*.22,14,22);
    for (let i=0;i<4;i++) g.rect(cx+r*.14+i*6,cy-r*.35,5,14,3);
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1);
    for (let i=0;i<8;i++) { const a=(i/8)*Math.PI*2; g.circle(cx+r*.55*Math.cos(a),cy+r*.1+r*.55*Math.sin(a),5); }
  },

  hermit(g,cx,cy,r,pal) {
    g.noStroke(); g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[2]),.15));
    g.triangle(cx,cy-r*.8,cx-r,cy+r,cx+r,cy+r);
    g.stroke(pal[3]||pal[2]); g.strokeWeight(2.5); g.line(cx+r*.35,cy-r*.7,cx+r*.35,cy+r*.8);
    g.noStroke(); g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[2]),.3));
    g.triangle(cx-r*.1,cy-r*.3,cx-r*.35,cy+r*.55,cx+r*.35,cy+r*.55); g.circle(cx,cy-r*.35,r*.18);
    const lx=cx-r*.25,ly=cy-r*.2;
    for (let i=5;i>=1;i--) { g.noStroke(); g.fill(255,240,180,30*i); g.circle(lx,ly,r*.8*i*.22); }
    g.fill(pal[1]); g.noStroke(); g.rect(lx-5,ly-8,10,14,2); g.triangle(lx-5,ly-8,lx+5,ly-8,lx,ly-14);
    for (let i=0;i<7;i++) { if(i===3)continue; _star(g,cx-r*.8+i*r*.25,cy-r*.92+(i%2)*8,1.5,3,5,pal[2]); }
  },

  wheel(g,cx,cy,r,pal) {
    const z=["♈","♉","♊","♋","♌","♍","♎","♏","♐","♑","♒","♓"];
    g.noFill(); g.stroke(pal[3]||pal[2]); g.strokeWeight(1); g.circle(cx,cy,r*2); g.circle(cx,cy,r*1.75);
    g.textAlign(g.CENTER,g.CENTER); g.textSize(7); g.noStroke(); g.fill(pal[2]);
    for (let i=0;i<12;i++) { const a=(i/12)*Math.PI*2-Math.PI/2; g.text(z[i],cx+r*.92*Math.cos(a),cy+r*.92*Math.sin(a)); }
    g.noFill(); g.stroke(pal[1]); g.strokeWeight(2); g.circle(cx,cy,r*1.3);
    for (let i=0;i<8;i++) { const a=(i/8)*Math.PI*2; g.stroke(pal[i%pal.length]); g.strokeWeight(1.5); g.line(cx+r*.15*Math.cos(a),cy+r*.15*Math.sin(a),cx+r*.63*Math.cos(a),cy+r*.63*Math.sin(a)); }
    g.noFill(); g.stroke(pal[1]); g.strokeWeight(2); g.circle(cx,cy,r*.3);
    const lt=["R","O","T","A"]; g.fill(pal[1]); g.textSize(9); g.noStroke();
    for (let i=0;i<4;i++) { const a=(i/4)*Math.PI*2-Math.PI/2; g.text(lt[i],cx+r*.47*Math.cos(a),cy+r*.47*Math.sin(a)); }
  },

  justice(g,cx,cy,r,pal) {
    g.noStroke(); g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[1]),.2));
    g.rect(cx-r*.8,cy-r*.9,14,r*1.8,1); g.rect(cx+r*.8-14,cy-r*.9,14,r*1.8,1);
    g.stroke(pal[2]); g.strokeWeight(3); g.line(cx,cy-r*.85,cx,cy+r*.65);
    g.strokeWeight(1.5); g.line(cx-10,cy-r*.5,cx+10,cy-r*.5);
    g.noStroke(); g.fill(pal[2]); g.triangle(cx-4,cy+r*.65,cx+4,cy+r*.65,cx,cy+r*.8);
    const by=cy-r*.05; g.stroke(pal[1]); g.strokeWeight(2); g.line(cx-r*.58,by,cx+r*.58,by);
    g.noStroke(); g.fill(pal[1]); g.circle(cx,by,7);
    g.stroke(pal[3]||pal[2]); g.strokeWeight(1);
    g.line(cx-r*.58,by,cx-r*.52,by+24); g.line(cx-r*.58,by,cx-r*.64,by+24);
    g.noFill(); g.arc(cx-r*.58,by+24,r*.25,r*.1,0,Math.PI);
    g.line(cx+r*.58,by,cx+r*.52,by+20); g.line(cx+r*.58,by,cx+r*.64,by+20);
    g.arc(cx+r*.58,by+20,r*.25,r*.1,0,Math.PI);
    g.fill(pal[1]); g.noStroke(); g.rect(cx-12,cy-r*.92,24,10,1);
    for (let i=0;i<5;i++) g.triangle(cx-10+i*5,cy-r*.92,cx-7.5+i*5,cy-r*.92-8,cx-5+i*5,cy-r*.92);
  },

  hangedman(g,cx,cy,r,pal) {
    g.stroke(pal[3]||pal[1]); g.strokeWeight(3);
    g.line(cx,cy-r*.9,cx,cy+r*.85); g.line(cx-r*.55,cy-r*.55,cx+r*.55,cy-r*.55);
    g.strokeWeight(1.5); g.stroke(pal[2]);
    for (let i=0;i<5;i++) { const bx=cx-r*.5+i*r*.25; g.line(bx,cy-r*.55,bx+(i-2)*8,cy-r*.85); }
    g.stroke(pal[1]); g.strokeWeight(1.5); g.line(cx+r*.2,cy-r*.55,cx+r*.2,cy-r*.32);
    g.noStroke(); g.fill(pal[2]); g.circle(cx+r*.2,cy+r*.1,14);
    g.noFill(); g.stroke(pal[1]); g.strokeWeight(1); g.circle(cx+r*.2,cy+r*.1,22);
    g.noStroke(); g.fill(pal[2]); g.rect(cx+r*.2-5,cy-r*.32,10,r*.4,2);
    g.strokeWeight(2); g.stroke(pal[2]);
    g.line(cx+r*.2,cy-r*.32,cx+r*.35,cy-r*.5); g.line(cx+r*.2,cy-r*.32,cx+r*.05,cy-r*.52);
    g.line(cx+r*.35,cy-r*.5,cx+r*.2,cy-r*.7);
  },

  death(g,cx,cy,r,pal) {
    g.noStroke(); g.fill(pal[3]); g.rect(0,CARD_H/2+10,CARD_W,CARD_H/2-10);
    g.fill(pal[2]); g.arc(cx,CARD_H/2+12,r*1.1,r*.5,Math.PI,0);
    g.stroke(pal[2]); g.strokeWeight(2.5); g.line(cx-r*.1,cy-r*.9,cx-r*.1,cy+r*.8);
    g.noStroke(); g.fill(pal[0]); g.rect(cx-r*.1,cy-r*.9,r*.8,r*.4,1);
    g.fill(pal[2]); g.textAlign(g.CENTER,g.CENTER); g.textSize(16); g.noStroke(); g.text("✿",cx+r*.3,cy-r*.7);
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1.5); g.circle(cx+r*.1,cy-r*.2,20);
    g.line(cx+r*.1,cy-r*.1,cx+r*.1,cy+r*.5);
    for (let i=0;i<3;i++) { const ry=cy+i*12; g.noFill(); g.stroke(pal[2]); g.strokeWeight(1); g.arc(cx+r*.1,ry,22,14,Math.PI,0); }
    g.stroke(pal[2]); g.strokeWeight(2); g.line(cx-r*.5,cy+r*.7,cx+r*.3,cy-r*.8);
    g.noFill(); g.arc(cx-r*.25,cy-r*.5,r*.6,r*.6,Math.PI*1.3,Math.PI*1.9);
  },

  temperance(g,cx,cy,r,pal) {
    const cL=[cx-r*.55,cy+r*.1],cR=[cx+r*.55,cy-r*.2];
    for (let s=0;s<3;s++) {
      g.noFill(); g.stroke(pal[2+s%2]); g.strokeWeight(1.5-s*.3);
      g.beginShape();
      for (let t=0;t<=1;t+=.05) g.curveVertex(g.lerp(cL[0],cR[0],t),g.lerp(cL[1],cR[1],t)+Math.sin(t*Math.PI*2.5)*12+s*5);
      g.endShape();
    }
    for (const [cpx,cpy] of [cL,cR]) {
      g.fill(pal[1]); g.noStroke();
      g.beginShape(); g.vertex(cpx-14,cpy-10); g.vertex(cpx+14,cpy-10); g.vertex(cpx+10,cpy+10); g.vertex(cpx-10,cpy+10); g.endShape(g.CLOSE);
      g.rect(cpx-3,cpy+10,6,12,1); g.rect(cpx-9,cpy+22,18,4,1);
    }
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1.5);
    g.arc(cx-r*.6,cy-r*.5,r*.9,r*.7,Math.PI*1.2,Math.PI*1.9);
    g.arc(cx+r*.6,cy-r*.5,r*.9,r*.7,Math.PI*1.1,Math.PI*1.8);
    g.noFill(); g.stroke(pal[1]); g.strokeWeight(1.5); g.triangle(cx,cy-r*.65,cx-10,cy-r*.42,cx+10,cy-r*.42);
    g.strokeWeight(.8); g.arc(cx+r*.35,cy+r*.6,r*.7,r*.4,Math.PI,0);
    _star(g,cx+r*.35,cy+r*.4,4,8,8,pal[1]);
  },

  devil(g,cx,cy,r,pal) {
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1.5);
    g.beginShape(); g.vertex(cx,cy-r*.25); g.vertex(cx-r*.9,cy-r*.7); g.vertex(cx-r*.6,cy-r*.1); g.vertex(cx-r*.2,cy-r*.2); g.endShape();
    g.beginShape(); g.vertex(cx,cy-r*.25); g.vertex(cx+r*.9,cy-r*.7); g.vertex(cx+r*.6,cy-r*.1); g.vertex(cx+r*.2,cy-r*.2); g.endShape();
    _pentagram(g,cx,cy-r*.55,r*.38,pal[2],true);
    g.noStroke(); g.fill(pal[2]); g.circle(cx,cy-r*.2,r*.32);
    g.fill(pal[3]||pal[1]);
    g.triangle(cx-14,cy-r*.35,cx-8,cy-r*.55,cx-4,cy-r*.32);
    g.triangle(cx+14,cy-r*.35,cx+8,cy-r*.55,cx+4,cy-r*.32);
    g.fill(pal[0]); g.circle(cx-6,cy-r*.22,6); g.circle(cx+6,cy-r*.22,6);
    g.fill(pal[2]); g.circle(cx-6,cy-r*.22,2); g.circle(cx+6,cy-r*.22,2);
    for (const fx of [cx-r*.35,cx+r*.35]) { g.fill(pal[2]); g.noStroke(); g.circle(fx,cy+r*.35,9); g.rect(fx-4,cy+r*.4,8,20,1); }
    g.noFill(); g.stroke(pal[3]||pal[2]); g.strokeWeight(1.5);
    g.line(cx-r*.35,cy+r*.35,cx,cy+r*.05); g.line(cx+r*.35,cy+r*.35,cx,cy+r*.05);
    for (let i=0;i<4;i++) g.circle(cx-r*.25+i*r*.165,cy+r*.27-i*r*.055,5);
  },

  tower(g,cx,cy,r,pal) {
    g.noStroke(); g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[2]),.15));
    g.rect(cx-r*.3,cy-r*.4,r*.6,r*1.3,2);
    for (let i=0;i<5;i++) g.rect(cx-r*.3+i*r*.15,cy-r*.4-10,r*.1,10);
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1);
    g.rect(cx-6,cy-r*.2,12,14,1); g.rect(cx-6,cy+r*.1,12,14,1);
    g.noFill(); g.stroke(pal[1]); g.strokeWeight(1.5);
    g.push(); g.translate(cx+r*.4,cy-r*.7); g.rotate(.4);
    g.rect(-10,0,20,8,1); for (let i=0;i<4;i++) g.line(-8+i*6,0,-8+i*6+2,-7); g.pop();
    g.fill(pal[1]); g.stroke(pal[1]); g.strokeWeight(3);
    const lp=[[cx+r*.5,cy-r],[cx+r*.1,cy-r*.35],[cx+r*.35,cy-r*.25],[cx-r*.05,cy+r*.25]];
    for (let i=0;i<lp.length-1;i++) g.line(lp[i][0],lp[i][1],lp[i+1][0],lp[i+1][1]);
    g.stroke(255,240,100,80); g.strokeWeight(7);
    for (let i=0;i<lp.length-1;i++) g.line(lp[i][0],lp[i][1],lp[i+1][0],lp[i+1][1]);
    for (const [fx,fy,rot] of [[cx-r*.55,cy+r*.3,-.6],[cx+r*.7,cy+r*.5,.8]]) {
      g.push(); g.translate(fx,fy); g.rotate(rot);
      g.fill(pal[2]); g.noStroke(); g.circle(0,-10,10); g.rect(-5,-5,10,18,1); g.pop();
    }
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1.5);
    for (let i=0;i<6;i++) g.arc(cx-r*.3+i*r*.12,cy+r*.9,14,20,Math.PI,0);
  },

  star(g,cx,cy,r,pal) {
    for (let i=0;i<7;i++) {
      const sx=cx-r*.75+(i%3)*r*.7,sy=cy-r*.85+Math.floor(i/3)*r*.3,big=(i===2);
      _star(g,sx,sy,big?8:3,big?16:6,7,pal[2]||"#fff");
    }
    g.noStroke(); g.fill(pal[2]); g.ellipse(cx,cy+r*.65,r*1.3,r*.4);
    g.stroke(pal[3]||pal[1]); g.strokeWeight(.8); g.noFill();
    for (let i=0;i<3;i++) g.ellipse(cx,cy+r*.65,r*(.9+i*.25),r*.28);
    g.noStroke(); g.fill(pal[2]);
    g.circle(cx,cy-r*.15,12); g.ellipse(cx,cy+r*.1,14,28); g.rect(cx-5,cy+r*.25,10,16,1); g.rect(cx+5,cy+r*.3,10,14,1);
    g.stroke(pal[2]); g.strokeWeight(1.5); g.noFill();
    g.beginShape(); for (let t=0;t<=1;t+=.1) g.curveVertex(cx-10-t*r*.55,cy-r*.05+t*r*.7+Math.sin(t*Math.PI*3)*5); g.endShape();
    g.beginShape(); for (let t=0;t<=1;t+=.1) g.curveVertex(cx+10+t*r*.55,cy-r*.05+t*r*.65+Math.sin(t*Math.PI*3+1)*5); g.endShape();
  },

  moon(g,cx,cy,r,pal) {
    g.noStroke(); g.fill(pal[2]); g.circle(cx,cy-r*.7,r*.55);
    g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[1]),.4)); g.circle(cx+r*.2,cy-r*.78,r*.45);
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(.8); for (let i=1;i<=3;i++) g.circle(cx,cy-r*.7,r*.55+i*8);
    for (const tx of [cx-r*.65,cx+r*.65]) {
      g.noStroke(); g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[1]),.25));
      g.rect(tx-10,cy-r*.1,20,r*.85,1); for (let i=0;i<3;i++) g.rect(tx-8+i*8,cy-r*.1-8,6,8);
    }
    g.noFill(); g.stroke(pal[3]||pal[2]); g.strokeWeight(1.5);
    g.beginShape(); for (let t=0;t<=1;t+=.05) g.curveVertex(cx-r*.5+t*r,cy+r*.7-Math.sin(t*Math.PI)*r*.1); g.endShape();
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(.8);
    for (let i=0;i<3;i++) g.ellipse(cx,cy+r*.85,r*(1.2-i*.2),r*.12);
    g.noStroke(); g.fill(pal[2]);
    g.circle(cx-r*.35,cy+r*.6,8); g.circle(cx+r*.35,cy+r*.6,8);
    for (let i=0;i<8;i++) g.circle(cx-r*.15+(i%4)*r*.1,cy-r*.3+Math.floor(i/4)*r*.15,3);
  },

  sun(g,cx,cy,r,pal) {
    for (let i=0;i<16;i++) {
      const a=(i/16)*Math.PI*2,lo=i%2===0;
      g.stroke(pal[1]); g.strokeWeight(lo?2:1.2);
      g.line(cx+r*.48*Math.cos(a),cy-r*.22+r*.48*Math.sin(a),cx+r*(lo?.95:.72)*Math.cos(a),cy-r*.22+r*(lo?.95:.72)*Math.sin(a));
    }
    g.noStroke(); g.fill(pal[1]); g.circle(cx,cy-r*.22,r*.9);
    g.fill(pal[3]||pal[2]); g.circle(cx,cy-r*.22,r*.72);
    g.fill(pal[0]); g.circle(cx-10,cy-r*.3,6); g.circle(cx+10,cy-r*.3,6);
    g.fill(pal[1]); g.circle(cx-10,cy-r*.3,2.5); g.circle(cx+10,cy-r*.3,2.5);
    g.noFill(); g.stroke(pal[0]); g.strokeWeight(2); g.arc(cx,cy-r*.1,20,12,0,Math.PI);
    g.noStroke(); g.fill(g.lerpColor(g.color(pal[0]),g.color(pal[2]),.3)); g.rect(0,cy+r*.5,CARD_W,r*.5);
    for (const fx of [cx-r*.7,cx+r*.6]) { g.fill(pal[1]); g.noStroke(); g.circle(fx,cy+r*.35,12); g.stroke(pal[2]); g.strokeWeight(1.5); g.line(fx,cy+r*.41,fx,cy+r*.7); }
    g.noStroke(); g.fill(pal[2]); g.circle(cx,cy+r*.28,11); g.rect(cx-5,cy+r*.34,10,20,1);
    g.fill(pal[3]||pal[1]); g.ellipse(cx,cy+r*.55,32,18); g.circle(cx+15,cy+r*.48,11);
    for (let i=0;i<4;i++) g.rect(cx-14+i*10,cy+r*.64,5,12,1);
  },

  judgement(g,cx,cy,r,pal) {
    g.noStroke(); g.fill(200,210,235,180);
    g.ellipse(cx-r*.3,cy-r*.8,r*.8,r*.35); g.ellipse(cx+r*.25,cy-r*.85,r*.65,r*.28);
    g.fill(pal[2]); g.circle(cx,cy-r*.82,13); g.fill(pal[1]); g.circle(cx,cy-r*.82,8);
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(1.5);
    g.arc(cx-r*.5,cy-r*.7,r,r*.65,Math.PI*1.15,Math.PI*1.85);
    g.arc(cx+r*.5,cy-r*.7,r,r*.65,Math.PI*1.15,Math.PI*1.85);
    g.stroke(pal[1]); g.strokeWeight(2.5); g.line(cx+5,cy-r*.78,cx+r*.55,cy-r*.55);
    g.noFill(); g.stroke(pal[1]); g.strokeWeight(1.5); g.arc(cx+r*.55,cy-r*.45,20,16,Math.PI,0);
    g.noStroke(); g.fill(pal[2]); g.rect(cx+r*.35,cy-r*.65,r*.3,r*.22,1);
    g.fill(pal[0]); g.textAlign(g.CENTER,g.CENTER); g.textSize(9); g.text("+",cx+r*.5,cy-r*.55);
    g.noFill(); g.stroke(pal[1]); g.strokeWeight(.8);
    for (let w=1;w<=3;w++) g.arc(cx+r*.55,cy-r*.45,w*18,w*12,-Math.PI/2,Math.PI/2);
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(.8); g.ellipse(cx,cy+r*.75,r*1.4,r*.25);
    for (const [fx,arm] of [[cx-r*.35,-1],[cx,0],[cx+r*.35,1]]) {
      g.noStroke(); g.fill(pal[2]); g.circle(fx,cy+r*.3,9); g.rect(fx-4,cy+r*.35,8,28,1);
      g.stroke(pal[2]); g.strokeWeight(1.5); g.line(fx,cy+r*.38,fx+arm*16,cy+r*.18);
    }
  },

  world(g,cx,cy,r,pal) {
    g.noFill(); g.stroke(pal[2]); g.strokeWeight(2.5); g.circle(cx,cy,r*1.75); g.strokeWeight(1); g.circle(cx,cy,r*1.9);
    for (let i=0;i<24;i++) {
      const a=(i/24)*Math.PI*2,lx=cx+r*.87*Math.cos(a),ly=cy+r*.87*Math.sin(a);
      g.push(); g.translate(lx,ly); g.rotate(a+Math.PI/2); g.noStroke(); g.fill(pal[2]); g.ellipse(0,0,5,9); g.pop();
    }
    g.fill(pal[1]); g.noStroke(); g.ellipse(cx,cy-r*.88,20,10); g.ellipse(cx,cy+r*.88,20,10);
    const ev=["♈","♌","♏","♒"],co=[[cx-r*.85,cy-r*.85],[cx+r*.85,cy-r*.85],[cx-r*.85,cy+r*.85],[cx+r*.85,cy+r*.85]];
    g.textAlign(g.CENTER,g.CENTER); g.textSize(11); g.fill(pal[2]); g.noStroke();
    for (let i=0;i<4;i++) g.text(ev[i],co[i][0],co[i][1]);
    g.noStroke(); g.fill(pal[3]||pal[2]); g.circle(cx,cy-r*.42,14); g.ellipse(cx,cy-r*.15,18,30);
    g.stroke(pal[3]||pal[2]); g.strokeWeight(2.5);
    g.line(cx,cy-r*.3,cx-r*.38,cy-r*.5); g.line(cx,cy-r*.3,cx+r*.38,cy-r*.18);
    g.line(cx,cy+r*.12,cx-r*.22,cy+r*.42); g.line(cx,cy+r*.12,cx+r*.28,cy+r*.35);
    g.stroke(pal[1]); g.strokeWeight(1.5);
    g.line(cx-r*.38,cy-r*.5,cx-r*.45,cy-r*.25); g.line(cx+r*.38,cy-r*.18,cx+r*.46,cy+r*.05);
  }
};
