import { readData, writeData } from "./read-write-data.js";
import { DuplicationRemover } from "./duplication-remover/duplication-remover.js";

const duplicationRemover = new DuplicationRemover();

async function run() {
  const data = await readData("mock_application.json");
  const sanitizedData = duplicationRemover.sanitize(data);
  await writeData(sanitizedData, "clean_application.json");
}

run();
