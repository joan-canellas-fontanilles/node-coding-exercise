import { readData, writeData } from "./read-write-data.js";
import { DuplicationRemover } from "./duplication-remover/duplication-remover.js";
import { ConfigurationBuilder } from "./duplication-remover/configuration/configuration-builder.js";

const configuration = new ConfigurationBuilder()
  .addCustomObjectIdentity(/fields$/, ["key", "type"])
  .addCustomObjectIdentity(/objects$/, ["key", "profile_key", "identifier"])
  .addCustomObjectIdentity(/scenes$/, ["slug", "key", "parent"])
  .addCustomObjectIdentity(/views$/, ["key"])
  .build();

const duplicationRemover = new DuplicationRemover(configuration);

async function run() {
  const data = await readData("mock_application.json");
  const sanitizedData = duplicationRemover.sanitize(data);
  await writeData(sanitizedData, "clean_application.json");
}

run();
