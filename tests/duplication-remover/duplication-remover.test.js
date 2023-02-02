import { DuplicationRemover } from "../../src/duplication-remover/duplication-remover.js";
import { describe, expect, it } from "@jest/globals";

describe("Duplication remover", () => {
  it("should be able to instantiate", () => {
    const instance = new DuplicationRemover();
    expect(instance).toBeInstanceOf(DuplicationRemover);
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
    const duplicationRemover = new DuplicationRemover();
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
    const duplicationRemover = new DuplicationRemover();
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
    const duplicationRemover = new DuplicationRemover();
    const sanitizedObject = duplicationRemover.sanitize(object);
    expect(sanitizedObject).toEqual(objectExpected);
  });
});
