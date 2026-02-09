// Your Render backend domain
const BACKEND_URL = "https://harvey-profile.onrender.com";

// Convert relative /uploads/... to backend url URL
export default function fixFileURL(imgPath) {
  if (!imgPath) return null;
  if (imgPath.startsWith("http")) return imgPath;
  return BACKEND_URL + imgPath;
};