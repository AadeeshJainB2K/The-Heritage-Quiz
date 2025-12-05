import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const image: string | undefined = body?.image;

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 });
    }

    const apiKey = process.env.VISION_API_KEY || "";
    if (!apiKey) {
      return NextResponse.json(
        { error: "Gemini API key not configured" },
        { status: 500 }
      );
    }

    // Remove data URL prefix if present
    const base64 = image.replace(/^data:image\/[a-zA-Z]+;base64,/, "");

    // Use Gemini API (generative AI) for monument identification
    // This is free tier friendly (60 req/min)
    const geminiRequest = {
      contents: [
        {
          parts: [
            {
              text: "Analyze this image and identify if it contains any monuments, historical sites, or landmarks. Provide: 1) Monument name, 2) Location/State in India, 3) Confidence (0-100%), 4) Brief description (1-2 sentences). If no monument is found, say 'No monument detected'. Format as JSON.",
            },
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64,
              },
            },
          ],
        },
      ],
    };

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(geminiRequest),
      }
    );

    const data = await res.json();

    if (data?.error) {
      return NextResponse.json(
        { error: data.error.message, raw: data },
        { status: 400 }
      );
    }

    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Try to extract JSON from response
    let parsed: any = { raw: responseText };
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      try {
        parsed = JSON.parse(jsonMatch[0]);
      } catch {
        parsed = { text: responseText };
      }
    }

    return NextResponse.json({ monument: parsed, raw: data });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
