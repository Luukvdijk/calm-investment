import { describe, expect, it } from "vitest";
import { validateContact } from "../src/lib/contact-validation";

const valid = {
  name: "Jan Jansen",
  email: "jan@voorbeeld.nl",
  message: "Ik wil graag in gesprek.",
};

describe("validateContact", () => {
  it("accepts a valid submission", () => {
    expect(validateContact(valid)).toBeNull();
  });

  it("requires a name", () => {
    expect(validateContact({ ...valid, name: "" })).toBe("nameRequired");
    expect(validateContact({ ...valid, name: "   " })).toBe("nameRequired");
    expect(validateContact({ ...valid, name: undefined })).toBe("nameRequired");
  });

  it("requires an email", () => {
    expect(validateContact({ ...valid, email: "" })).toBe("emailRequired");
  });

  it("rejects invalid email formats", () => {
    for (const bad of ["jan", "jan@", "jan@voorbeeld", "jan voorbeeld@nl.nl", "@nl.nl"]) {
      expect(validateContact({ ...valid, email: bad })).toBe("emailInvalid");
    }
  });

  it("requires a message", () => {
    expect(validateContact({ ...valid, message: "" })).toBe("messageRequired");
  });

  it("rejects oversized input", () => {
    expect(validateContact({ ...valid, name: "a".repeat(201) })).toBe("tooLong");
    expect(
      validateContact({ ...valid, email: `${"a".repeat(320)}@x.nl` })
    ).toBe("tooLong");
    expect(validateContact({ ...valid, message: "a".repeat(5001) })).toBe("tooLong");
    expect(validateContact({ ...valid, message: "a".repeat(5000) })).toBeNull();
  });

  it("rejects non-string values", () => {
    expect(validateContact({ ...valid, name: 42 })).toBe("nameRequired");
    expect(validateContact({ ...valid, email: {} })).toBe("emailRequired");
    expect(validateContact({ ...valid, message: null })).toBe("messageRequired");
  });
});
