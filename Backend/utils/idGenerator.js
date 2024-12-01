function toBase62(num) {
  const chars =
    "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
  let base62 = "";

  // Convert number to Base62
  while (num > 0) {
    const remainder = num % 62;
    base62 = chars[remainder] + base62;
    num = Math.floor(num / 62);
  }

  return base62;
}

function generateId() {
  // Get the current timestamp in milliseconds
  const timestampMs = Date.now(); // 13-digit timestamp

  // Convert timestamp to Base62
  return toBase62(timestampMs);
}

module.exports = { generateId };
