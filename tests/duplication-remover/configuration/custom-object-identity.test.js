import { CustomObjectIdentity } from "../../../src/duplication-remover/configuration/custom-object-identity.js";
import { describe, expect, it } from "@jest/globals";

describe("Custom object identity", () => {
  it("should be able to instantiate", () => {
    const instance = new CustomObjectIdentity(["name"]);
    expect(instance).toBeInstanceOf(CustomObjectIdentity);
  });

  describe("Constructor parameters", () => {
    it("should throw an error if the parameter is not an array", () => {
      const call = () => {
        new CustomObjectIdentity(false);
      };

      expect(call).toThrow();
    });

    it("should throw an error if the parameter is an empty array", () => {
      const call = () => {
        new CustomObjectIdentity([]);
      };

      expect(call).toThrow();
    });

    it("should throw an error if the parameter is an array of non-string values", () => {
      const call = () => {
        new CustomObjectIdentity(["name", 3]);
      };

      expect(call).toThrow();
    });
  });

  describe("generateIdentity", () => {
    it("should return a string that contains the identity of the object", () => {
      const object = { name: "John", surname: "Smith", age: 23 };

      const objectIdentity = new CustomObjectIdentity(["name", "surname"]);
      expect(objectIdentity.generateIdentity(object)).toEqual(
        '{"name":"John","surname":"Smith"}'
      );
    });

    it("should generate the same identity even if the properties doesn't have the same order", () => {
      const object = { name: "John", surname: "Smith", age: 25 };
      const objectCompare = { age: 23, surname: "Smith", name: "John" };
      const objectIdentity = new CustomObjectIdentity(["name", "surname"]);

      expect(objectIdentity.generateIdentity(object)).toEqual(
        objectIdentity.generateIdentity(objectCompare)
      );
    });

    it("should return a string value if the parameter is not an object", () => {
      const object = 1;
      const objectIdentity = new CustomObjectIdentity(["name", "surname"]);

      expect(objectIdentity.generateIdentity(object)).toEqual("1");
    });
  });
});
