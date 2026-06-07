const fs = require("fs");
const path = require("path");

const target = path.resolve(process.cwd(), ".next");

if (!target.startsWith(process.cwd())) {
  throw new Error("Refusing to remove a path outside the project.");
}

fs.rmSync(target, { force: true, recursive: true });
console.log("Removed .next cache.");
