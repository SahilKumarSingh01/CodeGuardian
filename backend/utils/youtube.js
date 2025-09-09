// utils/youtube.js
export const extractYouTubeEmbed = (input) => {
  if (!input) return "";

  // If user pasted an iframe
  const iframeMatch = input.match(/src=["']([^"']+)["']/);
  if (iframeMatch && iframeMatch[1]) return iframeMatch[1];

  // If it's a watch URL: convert to embed
  const watchMatch = input.match(
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/
  );
  if (watchMatch && watchMatch[1]) {
    return `https://www.youtube.com/embed/${watchMatch[1]}`;
  }

  // If it's a youtu.be short link: convert to embed
  const shortMatch = input.match(
    /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/
  );
  if (shortMatch && shortMatch[1]) {
    return `https://www.youtube.com/embed/${shortMatch[1]}`;
  }

  // If it's already an embed link
  if (input.includes("youtube.com/embed/")) return input;

  // Invalid / not a YouTube link
  return "";
};
