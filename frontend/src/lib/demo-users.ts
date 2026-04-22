export type DemoUser = {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt: string;
};

// Demo-only in-memory user store.
// Note: This resets on server restart and is not shared across serverless instances.
const users: DemoUser[] = [];

export function findUserByEmail(email: string) {
  return users.find((u) => u.email === email);
}

export function createUser(input: { email: string; password: string; name: string }) {
  const user: DemoUser = {
    id: crypto.randomUUID(),
    email: input.email,
    password: input.password,
    name: input.name,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  return user;
}
