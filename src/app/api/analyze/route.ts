import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getProtocolById } from "@/lib/protocols";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mediaType, protocolId } = await req.json();

    if (!protocolId) {
      return NextResponse.json({ error: "protocolId is required" }, { status: 400 });
    }

    const protocol = getProtocolById(protocolId);
    if (!protocol) {
      return NextResponse.json({ error: "Protocol not found" }, { status: 404 });
    }

    const hasImage = imageBase64 && mediaType;

    const systemPrompt = `You are Sonoguide, an expert AI ultrasound interpreter. You analyze point-of-care ultrasound (POCUS) images and provide structured clinical findings. You always respond with valid JSON only — no markdown, no explanation outside the JSON.

IMPORTANT: You are not FDA-cleared for primary diagnosis. Your output is for educational and clinical decision support only.`;

    const analysisPrompt = `Analyze this ${protocol.name} ultrasound image. Protocol context:
- Category: ${protocol.category}
- Indication: ${protocol.indication}
- Expected views: ${protocol.views.join(", ")}
- Key findings to assess: ${protocol.keyFindings.join(", ")}
- AI measurements to attempt: ${protocol.aiMeasurements.join(", ")}
- Anomalies to detect: ${protocol.anomaliesDetected.join(", ")}
- Common pitfalls: ${protocol.commonPitfalls.join(", ")}

${hasImage ? "Analyze the provided ultrasound image carefully." : "No image was provided — generate a realistic normal-variant example analysis for this protocol for demonstration purposes."}

Respond ONLY with a JSON object in this exact shape:
{
  "protocolId": "${protocolId}",
  "protocolName": "${protocol.name}",
  "timestamp": "<ISO 8601 string>",
  "imageQuality": "<poor|fair|good|excellent>",
  "imageQualityNote": "<1-2 sentence note on image quality, depth, gain, or acoustic windows>",
  "confidence": <integer 50-99>,
  "alertLevel": "<none|low|moderate|high|critical>",
  "alertMessage": "<if alertLevel is not none: concise urgent clinical message, else omit>",
  "findings": [
    { "label": "<structure name>", "value": "<finding description>", "severity": "<normal|info|warning|critical>" }
  ],
  "measurements": [
    { "name": "<measurement name>", "value": "<value with unit>", "reference": "<normal range>", "status": "<normal|borderline|abnormal>" }
  ],
  "summary": "<2-4 sentence clinical summary of key findings>",
  "recommendations": ["<actionable recommendation>"],
  "nextViews": ["<next view to obtain>"],
  "labels": [
    { "id": "<short-id>", "name": "<structure label>", "x": <0-100>, "y": <0-100>, "color": "<hex color>" }
  ]
}

Rules:
- findings: 3-6 items covering all major structures visible
- measurements: include ALL relevant measurements for this protocol (1-6 items)
- recommendations: 2-4 practical next steps
- nextViews: 2-3 views to obtain next
- labels: 3-6 anatomical labels with x/y as percentage positions (x=0 left, x=100 right, y=0 top, y=100 bottom)
- Use hex colors for labels: normal structures #6ee7b7, abnormal #ef4444, info #60a5fa
- confidence should reflect actual image quality and certainty
- alertLevel: none=no abnormality, low=minor/incidental, moderate=clinically relevant, high=urgent, critical=immediate action needed`;

    const messageContent: Anthropic.MessageParam["content"] = hasImage
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          { type: "text", text: analysisPrompt },
        ]
      : analysisPrompt;

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 4096,
      thinking: { type: "adaptive" },
      system: systemPrompt,
      messages: [{ role: "user", content: messageContent }],
    });

    // Extract the text block (thinking blocks are separate)
    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    if (!textBlock) {
      return NextResponse.json({ error: "No text response from AI" }, { status: 500 });
    }

    // Parse JSON — strip any accidental markdown fences
    const raw = textBlock.text.replace(/^```json\s*/i, "").replace(/```\s*$/i, "").trim();
    const analysis = JSON.parse(raw);

    // Ensure timestamp is always fresh
    analysis.timestamp = analysis.timestamp ?? new Date().toISOString();

    return NextResponse.json(analysis);
  } catch (err) {
    console.error("Analyze error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
