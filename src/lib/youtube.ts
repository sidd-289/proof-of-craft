export interface ParsedYouTube {
  videoId: string;
  thumbnailUrl: string;
  cleanUrl: string;
}

export function parseYouTubeUrl(url: string): ParsedYouTube | null {
  if (!url) return null;

  // Patterns for youtube.com/watch?v=, youtu.be/, youtube.com/shorts/, youtube.com/embed/
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.trim().match(regExp);

  if (match && match[2].length === 11) {
    const videoId = match[2];
    return {
      videoId,
      thumbnailUrl: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,
      cleanUrl: `https://www.youtube.com/watch?v=${videoId}`,
    };
  }

  return null;
}

export async function fetchYouTubeOEmbed(url: string): Promise<{ title?: string; author_name?: string } | null> {
  try {
    const res = await fetch(`https://noembed.com/embed?url=${encodeURIComponent(url)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      title: data.title,
      author_name: data.author_name,
    };
  } catch {
    return null;
  }
}

