import { DuplicationRemover } from "../../src/duplication-remover/duplication-remover.js";
import { describe, expect, it } from "@jest/globals";
import { ConfigurationBuilder } from "../../src/duplication-remover/configuration/configuration-builder.js";

describe("Duplication remover", () => {
  const config = new ConfigurationBuilder()
    .addObjectIdentity(/addresses/)
    .addCustomObjectIdentity(/contacts/, ["name", "surname"])
    .build();

  it("should be able to instantiate", () => {
    const instance = new DuplicationRemover(config);
    expect(instance).toBeInstanceOf(DuplicationRemover);
  });

  describe("Constructor parameters", () => {
    it("should throw an error if no parameter is provided", () => {
      const call = () => new DuplicationRemover();
      expect(call).toThrow();
    });

    it("should throw an error if the parameter is not an array", () => {
      const call = () => new DuplicationRemover(false);
      expect(call).toThrow();
    });

    it("should throw an error if the parameter is an empty array", () => {
      const call = () => new DuplicationRemover([]);
      expect(call).toThrow();
    });

    it("should throw an error if the parameter does not have the correct object", () => {
      const call = () => new DuplicationRemover([{ test: true }]);
      expect(call).toThrow();
    });
  });

  it("should remove the duplicated occurrences", () => {
    const object = {
      name: "John",
      smith: "Smith",
      addresses: [
        { city: "City1", street: "Street1" },
        { city: "City1", street: "Street2" },
        { city: "City1", street: "Street1" },
      ],
    };

    const objectExpected = {
      name: "John",
      smith: "Smith",
      addresses: [
        { city: "City1", street: "Street1" },
        { city: "City1", street: "Street2" },
      ],
    };
    const duplicationRemover = new DuplicationRemover(config);
    const sanitizedObject = duplicationRemover.sanitize(object);
    expect(sanitizedObject).toEqual(objectExpected);
  });

  it("should remove the duplicated occurrences when the properties have different order", () => {
    const object = {
      name: "John",
      smith: "Smith",
      addresses: [
        { city: "City1", street: "Street1" },
        { city: "City1", street: "Street2" },
        { street: "Street1", city: "City1" },
      ],
    };

    const objectExpected = {
      name: "John",
      smith: "Smith",
      addresses: [
        { city: "City1", street: "Street1" },
        { city: "City1", street: "Street2" },
      ],
    };
    const duplicationRemover = new DuplicationRemover(config);
    const sanitizedObject = duplicationRemover.sanitize(object);
    expect(sanitizedObject).toEqual(objectExpected);
  });

  it("should remove the duplicated occurrences with extra properties", () => {
    const object = {
      name: "John",
      smith: "Smith",
      contacts: [
        { name: "Name1", surname: "surname1", age: 34 },
        { name: "Name2", surname: "surname2", age: 25 },
        { name: "Name1", surname: "surname1", age: 32 },
      ],
    };

    const objectExpected = {
      name: "John",
      smith: "Smith",
      contacts: [
        { name: "Name1", surname: "surname1", age: 34 },
        { name: "Name2", surname: "surname2", age: 25 },
      ],
    };
    const duplicationRemover = new DuplicationRemover(config);
    const sanitizedObject = duplicationRemover.sanitize(object);
    expect(sanitizedObject).toEqual(objectExpected);
  });

  it("should use the first defined identity", () => {
    const config = new ConfigurationBuilder()
      .addSkipCondition(/contacts.*addresses/)
      .addObjectIdentity(/addresses/)
      .build();

    const object = {
      name: "John",
      smith: "Smith",
      addresses: [
        { city: "City1", street: "Street1" },
        { city: "City1", street: "Street2" },
        { city: "City1", street: "Street1" },
      ],
      contacts: [
        {
          name: "Name1",
          surname: "surname1",
          age: 34,
          addresses: [
            { city: "City1", street: "Street1" },
            { city: "City1", street: "Street1" },
          ],
        },
      ],
    };

    const objectExpected = {
      name: "John",
      smith: "Smith",
      addresses: [
        { city: "City1", street: "Street1" },
        { city: "City1", street: "Street2" },
      ],
      contacts: [
        {
          name: "Name1",
          surname: "surname1",
          age: 34,
          addresses: [
            { city: "City1", street: "Street1" },
            { city: "City1", street: "Street1" },
          ],
        },
      ],
    };
    const duplicationRemover = new DuplicationRemover(config);
    const sanitizedObject = duplicationRemover.sanitize(object);
    expect(sanitizedObject).toEqual(objectExpected);
  });

  it("should not remove duplicated if the configuration is empty", () => {
    const config = new ConfigurationBuilder().build();

    const object = { test: [1, 2, 3, 3, 3] };
    const objectExpected = { test: [1, 2, 3, 3, 3] };

    const duplicationRemover = new DuplicationRemover(config);
    const sanitizedObject = duplicationRemover.sanitize(object);
    expect(sanitizedObject).toEqual(objectExpected);
  });

  it("should replace the default condition if a condition with a generic regex is used", () => {
    const config = new ConfigurationBuilder().addObjectIdentity(/.*/).build();

    const object = { test: [1, 2, 3, 3, 3] };
    const objectExpected = { test: [1, 2, 3] };

    const duplicationRemover = new DuplicationRemover(config);
    const sanitizedObject = duplicationRemover.sanitize(object);

    expect(sanitizedObject).toEqual(objectExpected);
  });
});
