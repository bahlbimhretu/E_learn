import crypto from "crypto";

export default function generateResetToken() {
  const resetToken = crypto.randomBytes(20).toString("hex");

  const hashed = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  return { resetToken, hashed };
}
