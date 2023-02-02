import { ObjectIdentity } from "../../../src/duplication-remover/configuration/object-identity.js";
import { CustomObjectIdentity } from "../../../src/duplication-remover/configuration/custom-object-identity.js";
import { describe, expect, it } from "@jest/globals";
import { ConfigurationBuilder } from "../../../src/duplication-remover/configuration/configuration-builder.js";

describe("Configuration builder", () => {
  it("should be able to instantiate", () => {
    const instance = new ConfigurationBuilder();
    expect(instance).toBeInstanceOf(ConfigurationBuilder);
  });

  it("should allow the instantiation of a object identity", () => {
    const builder = new ConfigurationBuilder().addObjectIdentity(/test/);
    const config = builder.build();
    expect(config.at(0)).toEqual({
      objectPathRegex: /test/,
      identity: new ObjectIdentity(),
    });
  });

  it("should allow the instantiation of a object identity", () => {
    const builder = new ConfigurationBuilder().addCustomObjectIdentity(/test/, [
      "test",
      "test2",
    ]);
    const config = builder.build();
    expect(config.at(0)).toEqual({
      objectPathRegex: /test/,
      identity: new CustomObjectIdentity(["test", "test2"]),
    });
  });

  it("should allow the instantiation skip condition", () => {
    const builder = new ConfigurationBuilder().addSkipCondition(/test/);
    const config = builder.build();
    expect(config.at(0)).toEqual({
      objectPathRegex: /test/,
      identity: null,
    });
  });

  it("should add a skip condition by default for all paths", () => {
    const builder = new ConfigurationBuilder().addSkipCondition(/.*/);
    const config = builder.build();
    expect(config.at(0)).toEqual({
      objectPathRegex: /.*/,
      identity: null,
    });
  });
});
