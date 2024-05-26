import crypto from "crypto";

const secure_key1 = crypto.randomBytes(32).toString("hex");
const secure_key2 = crypto.randomBytes(32).toString("hex");

console.table({ secure_key1, secure_key2 });
