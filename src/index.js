import { readData, writeData } from "./read-write-data.js";

async function run() {
  const data = await readData("mock_application.json");
  await writeData(data, "clean_application.json");
}

run();
