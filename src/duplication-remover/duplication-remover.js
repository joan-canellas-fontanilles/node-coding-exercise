import { ObjectIdentity } from "./configuration/object-identity.js";
import { CustomObjectIdentity } from "./configuration/custom-object-identity.js";

export class DuplicationRemover {
  sanitize(value) {
    return this.#sanitizeValue(value);
  }

  #sanitizeValue(value) {
    return this.#sanitizeArray(value) || this.#sanitizeObject(value) || value;
  }

  #sanitizeArray(array) {
    if (!array || !Array.isArray(array)) return;

    return this.#removeDuplicates(array).map((item) =>
      this.#sanitizeValue(item)
    );
  }

  #sanitizeObject(object) {
    if (!object || typeof object !== "object") return;
    const entries = Object.entries(object).map(
      ([propertyName, propertyValue]) => [
        propertyName,
        this.#sanitizeValue(propertyValue),
      ]
    );
    return Object.fromEntries(entries);
  }

  #removeDuplicates(array) {
    const keys = new Set();

    const identity = new CustomObjectIdentity(["key"]);

    return array.filter((item) => {
      const key = identity.generateIdentity(item);
      const exists = keys.has(key);
      keys.add(key);
      return !exists;
    });
  }
}
