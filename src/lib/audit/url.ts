import { isIP } from "node:net";

const blockedHostnames = new Set(["localhost", "metadata.google.internal", "instance-data"]);

function isPrivateIpv4(hostname: string) {
  const parts = hostname.split(".").map(Number);
  if (parts.length !== 4 || parts.some((part) => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10 || parts[0] === 127 || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) || (parts[0] === 192 && parts[1] === 168) || (parts[0] === 169 && parts[1] === 254);
}

export function validateAuditUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("Only HTTP and HTTPS websites are supported.");
  if (url.username || url.password) throw new Error("Website credentials are not allowed.");
  if (url.port && url.port !== "80" && url.port !== "443") throw new Error("Custom ports are not supported.");
  if (blockedHostnames.has(url.hostname.toLowerCase()) || (isIP(url.hostname) === 4 && isPrivateIpv4(url.hostname))) throw new Error("Private and metadata network addresses are not allowed.");
  return url.toString();
}
