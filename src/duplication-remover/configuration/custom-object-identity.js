import { ObjectIdentity } from "./object-identity.js";

export class CustomObjectIdentity extends ObjectIdentity {
  constructor(propertyNames) {
    super();
    if (
      !Array.isArray(propertyNames) ||
      propertyNames.length === 0 ||
      propertyNames.some((value) => typeof value !== "string")
    ) {
      throw new Error("PropertyNames parameter must be an array of strings");
    }
    this.propertyNames = propertyNames;
  }

  _entryFilter(propertyName, propertyValue) {
    return (
      super._entryFilter(propertyName, propertyValue) &&
      this.propertyNames.includes(propertyName)
    );
  }
}
