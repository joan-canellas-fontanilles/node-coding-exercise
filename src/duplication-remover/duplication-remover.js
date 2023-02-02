import { ObjectIdentity } from "./configuration/object-identity.js";

export class DuplicationRemover {
  #config = [];

  constructor(config) {
    if (!this.#validateConfig(config)) {
      throw new Error("A valid configuration must be supplied");
    }
    this.#config = config;
  }

  #validateConfig(config) {
    const isArray = Array.isArray(config) && config.length !== 0;
    const correctType = config?.every(
      (config) =>
        config.objectPathRegex instanceof RegExp &&
        (config.identity instanceof ObjectIdentity || config.identity === null)
    );

    return isArray && correctType;
  }

  sanitize(value) {
    return this.#sanitizeValue(value);
  }

  #joinPath(path, propertyValue) {
    path = path ? `${path}.` : "";
    if (typeof propertyValue === "number") {
      return `${path}[${propertyValue}]`;
    }
    return `${path}${propertyValue}`;
  }

  #sanitizeValue(value, path = "") {
    return (
      this.#sanitizeArray(value, path) ||
      this.#sanitizeObject(value, path) ||
      value
    );
  }

  #sanitizeArray(array, path = "") {
    if (!array || !Array.isArray(array)) return;

    return this.#removeDuplicates(array, path).map((item, index) =>
      this.#sanitizeValue(item, this.#joinPath(path, index))
    );
  }

  #sanitizeObject(object, path = "") {
    if (!object || typeof object !== "object") return;
    const entries = Object.entries(object).map(
      ([propertyName, propertyValue]) => [
        propertyName,
        this.#sanitizeValue(propertyValue, this.#joinPath(path, propertyName)),
      ]
    );
    return Object.fromEntries(entries);
  }

  #removeDuplicates(array, path) {
    const keys = new Set();

    const { identity } = this.#config.find(({ objectPathRegex }) =>
      objectPathRegex.test(path)
    );

    if (identity === null) return array;

    return array.filter((item) => {
      const key = identity.generateIdentity(item);
      const exists = keys.has(key);
      keys.add(key);
      return !exists;
    });
  }
}
