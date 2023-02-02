import { CustomObjectIdentity } from "./custom-object-identity.js";
import { ObjectIdentity } from "./object-identity.js";

export class ConfigurationBuilder {
  #configuration = [];

  addCustomObjectIdentity(objectPathRegex, propertyNames) {
    this.#configuration.push({
      objectPathRegex,
      identity: new CustomObjectIdentity(propertyNames),
    });
    return this;
  }

  addObjectIdentity(objectPathRegex) {
    this.#configuration.push({
      objectPathRegex,
      identity: new ObjectIdentity(),
    });
    return this;
  }

  addSkipCondition(objectPathRegex) {
    this.#configuration.push({
      objectPathRegex,
      identity: null,
    });
    return this;
  }

  build() {
    this.addSkipCondition(/.*/);
    return this.#configuration;
  }
}
