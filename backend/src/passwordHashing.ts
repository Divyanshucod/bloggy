export const verifyPassword = async (
  password: string,
  storedHash: string,
  storedSalt: string
): Promise<boolean> => {
  const enc = new TextEncoder();
  const salt = Uint8Array.from(atob(storedSalt), (c) => c.charCodeAt(0));

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hash = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));

  return hash === storedHash;
};

const generateSalt = (length = 16): Uint8Array => {
  return crypto.getRandomValues(new Uint8Array(length));
};

export const hashPassword = async (
  password: string
): Promise<{ hash: string; salt: string }> => {
  const enc = new TextEncoder();
  const salt = generateSalt(); // 16 bytes

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100_000,
      hash: "SHA-256",
    },
    keyMaterial,
    256
  );

  const hash = btoa(String.fromCharCode(...new Uint8Array(derivedBits)));
  const encodedSalt = btoa(String.fromCharCode(...salt));

  return { hash, salt: encodedSalt };
};
