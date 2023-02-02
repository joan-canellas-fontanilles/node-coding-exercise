import fs from "fs";
import path from "path";
import { promisify } from "util";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const dataPath = path.join(__dirname, "..", "data");

export async function readData(fileName) {
  const filePath = path.join(dataPath, fileName);
  const buffer = await readFile(filePath);
  const data = buffer.toString("utf-8");
  return JSON.parse(data);
}

export async function writeData(data, fileName) {
  const filePath = path.join(dataPath, fileName);
  const dataString = JSON.stringify(data, null, 2);
  await writeFile(filePath, dataString);
}
