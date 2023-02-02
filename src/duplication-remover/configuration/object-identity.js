export class ObjectIdentity {
  generateIdentity(object) {
    if (typeof object === "object") {
      const objectEntries = this._getEntries(object);
      object = Object.fromEntries(objectEntries);
    }
    return JSON.stringify(object);
  }

  _getEntries(object) {
    return Object.entries(object)
      .filter(([propertyName, propertyValue]) =>
        this._entryFilter(propertyName, propertyValue)
      )
      .sort(([a], [b]) => a.localeCompare(b));
  }

  _entryFilter(propertyName, propertyValue) {
    return !(
      typeof propertyValue === "object" || typeof propertyValue === "function"
    );
  }
}
