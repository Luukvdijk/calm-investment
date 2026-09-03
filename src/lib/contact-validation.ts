export type ContactErrorCode =
  | "nameRequired"
  | "emailRequired"
  | "emailInvalid"
  | "messageRequired"
  | "tooLong";

export const MAX_NAME_LENGTH = 200;
export const MAX_EMAIL_LENGTH = 320;
export const MAX_MESSAGE_LENGTH = 5000;

export interface ContactInput {
  name?: unknown;
  email?: unknown;
  message?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateContact(input: ContactInput): ContactErrorCode | null {
  const name = typeof input.name === "string" ? input.name.trim() : "";
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const message = typeof input.message === "string" ? input.message.trim() : "";

  if (!name) return "nameRequired";
  if (!email) return "emailRequired";
  if (!EMAIL_RE.test(email)) return "emailInvalid";
  if (!message) return "messageRequired";
  if (
    name.length > MAX_NAME_LENGTH ||
    email.length > MAX_EMAIL_LENGTH ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return "tooLong";
  }
  return null;
}
