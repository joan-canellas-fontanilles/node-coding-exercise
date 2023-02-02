import { ObjectIdentity } from "../../../src/duplication-remover/configuration/object-identity.js";
import { describe, expect, it } from "@jest/globals";

describe("Object identity", () => {
  it("should be able to instantiate", () => {
    const instance = new ObjectIdentity();
    expect(instance).toBeInstanceOf(ObjectIdentity);
  });

  it("should return a string that contains the content of the object", () => {
    const object = { name: "John", surname: "Smith", age: 23 };

    const objectIdentity = new ObjectIdentity();
    expect(objectIdentity.generateIdentity(object)).toEqual(
      '{"age":23,"name":"John","surname":"Smith"}'
    );
  });

  it("should generate the same identity even if the properties doesn't have the same order", () => {
    const object = { name: "John", surname: "Smith", age: 23 };
    const objectCompare = { age: 23, surname: "Smith", name: "John" };
    const objectIdentity = new ObjectIdentity();

    expect(objectIdentity.generateIdentity(object)).toEqual(
      objectIdentity.generateIdentity(objectCompare)
    );
  });

  it("should return a string value if the parameter is not an object", () => {
    const object = 1;
    const objectIdentity = new ObjectIdentity();

    expect(objectIdentity.generateIdentity(object)).toEqual("1");
  });
});
