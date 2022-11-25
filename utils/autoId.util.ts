const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const CHARS_LENGTH = CHARS.length;

export const autoId = (length: number = 16) => {
  let id = "";
  for (let i = 0; i < length; i++) {
    id += CHARS.charAt(Math.floor(Math.random() * CHARS_LENGTH));
  }
  return id;
};
