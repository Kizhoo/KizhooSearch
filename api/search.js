// File: /api/search.js
export default async function handler(req, res) {
  const { q, type = "web" } = req.query;

  if (!q) {
    return res.status(400).json({ error: "Missing query" });
  }

  const query = encodeURIComponent(q);
  const searchURL = `https://lite.duckduckgo.com/lite/?q=${query}`;

  try {
    const response = await fetch(searchURL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/90.0 Safari/537.36"
      }
    });

    const html = await response.text();

    const results = [];
    const regex = /<a[^>]*href="(.*?)"[^>]*>(.*?)<\/a>.*?<br\/>(.*?)<br\/>/g;

    let match;
    while ((match = regex.exec(html)) !== null) {
      results.push({
        title: match[2].replace(/<[^>]+>/g, ""),
        url: match[1],
        description: match[3].replace(/<[^>]+>/g, "")
      });
    }

    res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
    res.status(200).json({ results });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Failed to fetch search results." });
  }
}
