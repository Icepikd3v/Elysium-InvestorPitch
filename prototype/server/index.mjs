import { createServer } from "node:http";
import { randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");

const PORT = Number(process.env.PORT || 8787);
const FRONTEND_ORIGIN = (process.env.FRONTEND_ORIGIN || "http://localhost:5173").replace(/\/$/, "");
const DEMO_EMAIL = "investor@elysiummall.com";
const DEMO_PASS = "Elysium2026!";

const NAME_RE = /^[A-Za-z][A-Za-z '-]*$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.com$/i;
const PASSWORD_RE = /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/;
const PHONE_RE = /^1\+\(\d{3}\)-\(\d{4}\)$/;

const normalizeEmail = (value) => String(value || "").trim().toLowerCase();

const hashPassword = (password) => {
  const salt = randomUUID();
  const hash = scryptSync(String(password || ""), salt, 64).toString("hex");
  return `${salt}:${hash}`;
};

const verifyPassword = (password, stored) => {
  const [salt, expected] = String(stored || "").split(":");
  if (!salt || !expected) return false;
  const actual = scryptSync(String(password || ""), salt, 64).toString("hex");
  const expectedBuffer = Buffer.from(expected, "hex");
  const actualBuffer = Buffer.from(actual, "hex");
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
};

const createVerificationToken = () => `verify_${Date.now()}_${randomUUID().slice(0, 12)}`;

const verificationLinkFor = (token) => {
  return `${FRONTEND_ORIGIN}/landing-page/verify-email?token=${encodeURIComponent(token)}`;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    ...corsHeaders,
  });
  res.end(JSON.stringify(payload));
};

const parseJsonBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    throw new Error("INVALID_JSON");
  }
};

const readUsers = async () => {
  try {
    const raw = await readFile(USERS_FILE, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeUsers = async (users) => {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(USERS_FILE, JSON.stringify(users, null, 2));
};

const sanitizeUser = (user) => ({
  id: user.id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  emailVerified: Boolean(user.emailVerified),
  createdAt: user.createdAt,
});

const validateSignup = ({ firstName, lastName, email, password, phone }) => {
  if (!NAME_RE.test(String(firstName || "").trim())) {
    return "First Name must contain letters only (no integers).";
  }
  if (!NAME_RE.test(String(lastName || "").trim())) {
    return "Last Name must contain letters only (no integers).";
  }
  if (!EMAIL_RE.test(normalizeEmail(email))) {
    return "Email must be a valid .com address (example: name@company.com).";
  }
  if (!PASSWORD_RE.test(String(password || ""))) {
    return "Password must be at least 6 characters and include one capital letter and one special character.";
  }
  if (!PHONE_RE.test(String(phone || "").trim())) {
    return "Phone must match: 1+(XXX)-(XXXX)";
  }
  return "";
};

const server = createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || `localhost:${PORT}`}`);

  if (req.method === "OPTIONS") {
    res.writeHead(204, corsHeaders);
    res.end();
    return;
  }

  if (req.method === "GET" && url.pathname === "/api/health") {
    sendJson(res, 200, { ok: true, service: "elysium-auth", now: new Date().toISOString() });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signup") {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      sendJson(res, 400, { ok: false, message: "Invalid JSON body." });
      return;
    }

    const validationError = validateSignup(body || {});
    if (validationError) {
      sendJson(res, 400, { ok: false, message: validationError });
      return;
    }

    const users = await readUsers();
    const email = normalizeEmail(body.email);
    const exists = users.some((user) => normalizeEmail(user.email) === email);
    if (exists) {
      sendJson(res, 409, { ok: false, message: "An account with this email already exists." });
      return;
    }

    const verificationToken = createVerificationToken();
    const newUser = {
      id: randomUUID(),
      firstName: String(body.firstName).trim(),
      lastName: String(body.lastName).trim(),
      email,
      phone: String(body.phone).trim(),
      passwordHash: hashPassword(body.password),
      emailVerified: false,
      verificationToken,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    await writeUsers(users);

    const verificationLink = verificationLinkFor(verificationToken);
    console.log(`[auth] verification link for ${email}: ${verificationLink}`);

    sendJson(res, 201, {
      ok: true,
      message: "Account created. Verify your email before signing in.",
      email,
      verificationToken,
      verificationLink,
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/signin") {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      sendJson(res, 400, { ok: false, message: "Invalid JSON body." });
      return;
    }

    const email = normalizeEmail(body?.email);
    const password = String(body?.password || "");
    const demoPassword = password.trim();

    if (email === DEMO_EMAIL && demoPassword === DEMO_PASS) {
      sendJson(res, 200, { ok: true, type: "demo" });
      return;
    }

    const users = await readUsers();
    const user = users.find((entry) => normalizeEmail(entry.email) === email);
    if (!user || !verifyPassword(password, user.passwordHash)) {
      sendJson(res, 401, { ok: false, message: "Invalid credentials." });
      return;
    }

    if (!user.emailVerified) {
      const verificationLink = verificationLinkFor(user.verificationToken);
      sendJson(res, 403, {
        ok: false,
        code: "EMAIL_NOT_VERIFIED",
        message: "Please verify your email before signing in.",
        email: user.email,
        verificationToken: user.verificationToken,
        verificationLink,
      });
      return;
    }

    sendJson(res, 200, { ok: true, type: "user", user: sanitizeUser(user) });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/verify-email") {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      sendJson(res, 400, { ok: false, message: "Invalid JSON body." });
      return;
    }

    const token = String(body?.token || "").trim();
    if (!token) {
      sendJson(res, 400, { ok: false, message: "Verification token is required." });
      return;
    }

    const users = await readUsers();
    const userIndex = users.findIndex((entry) => String(entry.verificationToken || "") === token);
    if (userIndex === -1) {
      sendJson(res, 404, { ok: false, message: "Verification link is invalid or expired." });
      return;
    }

    users[userIndex] = {
      ...users[userIndex],
      emailVerified: true,
      verificationToken: "",
    };
    await writeUsers(users);

    sendJson(res, 200, {
      ok: true,
      message: `Email verified for ${users[userIndex].email}.`,
      email: users[userIndex].email,
    });
    return;
  }

  if (req.method === "POST" && url.pathname === "/api/auth/resend-verification") {
    let body;
    try {
      body = await parseJsonBody(req);
    } catch {
      sendJson(res, 400, { ok: false, message: "Invalid JSON body." });
      return;
    }

    const email = normalizeEmail(body?.email);
    if (!email) {
      sendJson(res, 400, { ok: false, message: "Email is required." });
      return;
    }

    const users = await readUsers();
    const userIndex = users.findIndex((entry) => normalizeEmail(entry.email) === email);
    if (userIndex === -1) {
      sendJson(res, 404, { ok: false, message: "No account found for this email." });
      return;
    }

    if (users[userIndex].emailVerified) {
      sendJson(res, 200, { ok: true, message: "Email already verified.", email });
      return;
    }

    const nextToken = createVerificationToken();
    users[userIndex] = {
      ...users[userIndex],
      verificationToken: nextToken,
    };
    await writeUsers(users);

    const verificationLink = verificationLinkFor(nextToken);
    console.log(`[auth] resend verification link for ${email}: ${verificationLink}`);

    sendJson(res, 200, {
      ok: true,
      message: "Verification email re-issued.",
      email,
      verificationToken: nextToken,
      verificationLink,
    });
    return;
  }

  sendJson(res, 404, { ok: false, message: "Not found." });
});

server.listen(PORT, () => {
  console.log(`[auth] Elysium backend running on http://localhost:${PORT}`);
});
