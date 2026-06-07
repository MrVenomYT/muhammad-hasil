const fs = require("fs");
const path = require("path");

const width = 360;
const height = 450;
const frames = 18;
const palette = [
  [18, 16, 24], [28, 23, 36], [48, 31, 47], [82, 45, 65],
  [240, 180, 91], [248, 241, 231], [61, 170, 162], [216, 100, 124],
  [8, 8, 12], [36, 30, 45], [120, 76, 84], [250, 210, 130],
  [22, 88, 92], [95, 220, 205], [70, 56, 70], [0, 0, 0]
];

function set(px, x, y, color) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  px[y * width + x] = color;
}

function rect(px, x, y, w, h, color) {
  for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) set(px, xx, yy, color);
}

function ellipse(px, cx, cy, rx, ry, color) {
  for (let y = cy - ry; y <= cy + ry; y++) {
    for (let x = cx - rx; x <= cx + rx; x++) {
      const dx = (x - cx) / rx;
      const dy = (y - cy) / ry;
      if (dx * dx + dy * dy <= 1) set(px, x, y, color);
    }
  }
}

function line(px, x0, y0, x1, y1, color) {
  const dx = Math.abs(x1 - x0), sx = x0 < x1 ? 1 : -1;
  const dy = -Math.abs(y1 - y0), sy = y0 < y1 ? 1 : -1;
  let err = dx + dy;
  while (true) {
    set(px, x0, y0, color);
    if (x0 === x1 && y0 === y1) break;
    const e2 = 2 * err;
    if (e2 >= dy) { err += dy; x0 += sx; }
    if (e2 <= dx) { err += dx; y0 += sy; }
  }
}

function drawFrame(frame) {
  const px = new Uint8Array(width * height).fill(0);
  const glow = frame % 6 < 3 ? 13 : 6;
  const gold = frame % 8 < 4 ? 11 : 4;
  rect(px, 0, 0, width, height, 0);
  ellipse(px, 180, 120, 150, 105, 2);
  ellipse(px, 180, 255, 170, 150, 1);
  rect(px, 42, 330, 276, 45, 9);
  rect(px, 66, 246, 228, 92, 8);
  rect(px, 76, 256, 208, 70, 1);
  rect(px, 88, 268, 176, 8, glow);
  rect(px, 88, 286, 122 + (frame % 5) * 8, 7, gold);
  rect(px, 88, 304, 150 - (frame % 4) * 10, 7, 13);
  rect(px, 70, 338, 220, 18, 14);
  ellipse(px, 180, 185, 90, 118, 3);
  ellipse(px, 180, 158, 74, 82, 9);
  ellipse(px, 180, 150, 48, 50, 8);
  ellipse(px, 180, 170, 38, 30, 1);
  rect(px, 135, 218, 90, 55, 3);
  line(px, 132, 216, 88, 286, 3);
  line(px, 228, 216, 272, 286, 3);
  ellipse(px, 112, 306 + (frame % 2), 24, 11, 10);
  ellipse(px, 250, 306 + ((frame + 1) % 2), 24, 11, 10);
  for (let i = 0; i < 9; i++) {
    const x = 93 + i * 20 + ((frame + i) % 3);
    rect(px, x, 350, 12, 5, i % 2 ? 4 : 13);
  }
  rect(px, 52, 376, 256, 14, 10);
  rect(px, 92, 398, 176, 8, 4);
  return px;
}

function lzwEncode(indices, minCodeSize) {
  const clear = 1 << minCodeSize;
  const end = clear + 1;
  let codeSize = minCodeSize + 1;
  let nextCode = end + 1;
  const dict = new Map();
  const reset = () => {
    dict.clear();
    for (let i = 0; i < clear; i++) dict.set(String.fromCharCode(i), i);
    codeSize = minCodeSize + 1;
    nextCode = end + 1;
  };
  const codes = [clear];
  reset();
  let w = String.fromCharCode(indices[0]);
  for (let i = 1; i < indices.length; i++) {
    const k = String.fromCharCode(indices[i]);
    const wk = w + k;
    if (dict.has(wk)) {
      w = wk;
    } else {
      codes.push(dict.get(w));
      if (nextCode < 4096) {
        dict.set(wk, nextCode++);
        if (nextCode === (1 << codeSize) && codeSize < 12) codeSize++;
      }
      w = k;
    }
  }
  codes.push(dict.get(w), end);

  reset();
  let out = [];
  let bitBuffer = 0;
  let bitCount = 0;
  const writeCode = (code) => {
    bitBuffer |= code << bitCount;
    bitCount += codeSize;
    while (bitCount >= 8) {
      out.push(bitBuffer & 255);
      bitBuffer >>= 8;
      bitCount -= 8;
    }
    if (code === clear) reset();
    else if (code !== end && nextCode < 4096) {
      nextCode++;
      if (nextCode === (1 << codeSize) && codeSize < 12) codeSize++;
    }
  };
  codes.forEach(writeCode);
  if (bitCount > 0) out.push(bitBuffer & 255);
  return Buffer.from(out);
}

function subBlocks(buffer) {
  const parts = [];
  for (let i = 0; i < buffer.length; i += 255) {
    const chunk = buffer.subarray(i, i + 255);
    parts.push(Buffer.from([chunk.length]), chunk);
  }
  parts.push(Buffer.from([0]));
  return Buffer.concat(parts);
}

function word(n) {
  return Buffer.from([n & 255, (n >> 8) & 255]);
}

const out = [];
out.push(Buffer.from("GIF89a"));
out.push(word(width), word(height), Buffer.from([0xf3, 0, 0]));
out.push(Buffer.from(palette.flat()));
out.push(Buffer.from([0x21, 0xff, 0x0b]), Buffer.from("NETSCAPE2.0"), Buffer.from([0x03, 0x01, 0x00, 0x00, 0x00]));

for (let f = 0; f < frames; f++) {
  out.push(Buffer.from([0x21, 0xf9, 0x04, 0x04, 8, 0, 0, 0]));
  out.push(Buffer.from([0x2c]), word(0), word(0), word(width), word(height), Buffer.from([0]));
  out.push(Buffer.from([4]));
  out.push(subBlocks(lzwEncode(drawFrame(f), 4)));
}

out.push(Buffer.from([0x3b]));
const target = path.resolve(process.cwd(), "public/assets/hooded-coder.gif");
fs.writeFileSync(target, Buffer.concat(out));
console.log(target);
