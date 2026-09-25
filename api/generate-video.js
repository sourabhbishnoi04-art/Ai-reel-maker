export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { prompt } = req.body || {};

      if (!prompt) {
        return res.status(400).json({ error: "Prompt is required" });
      }

      const response = await fetch(
        "https://api.magichour.ai/v1/text-to-video",
        {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.MAGIC_HOUR_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name: "AI Reel Maker Video",
            end_seconds: 12,
            aspect_ratio:"9:16",
            resolution: "480p",
            style: {
              prompt: prompt
            }
          })
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return res.status(response.status).json(data);
      }

      return res.status(200).json({
        success: true,
        projectId: data.id
      });
    }

    if (req.method === "GET") {
      const projectId = req.query.id;

      if (!projectId) {
        return res.status(400).json({ error: "Project ID is required" });
      }

      const response = await fetch(
        `https://api.magichour.ai/v1/video-projects/${projectId}`,
        {
          headers: {
            "Authorization": `Bearer ${process.env.MAGIC_HOUR_API_KEY}`
          }
        }
      );

      const data = await response.json();

      return res.status(response.status).json(data);
    }

    return res.status(405).json({ error: "Method not allowed" });

  } catch (error) {
    return res.status(500).json({
      error: error.message
    });
  }
}
