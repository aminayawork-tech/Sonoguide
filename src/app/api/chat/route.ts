import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  try {
    const { question, analysisContext, history = [], imageBase64, mediaType } = await req.json();

    if (!question) {
      return NextResponse.json({ error: "question is required" }, { status: 400 });
    }

    const systemPrompt = `You are Sonoguide, an expert AI ultrasound interpreter and clinical educator. You are answering a follow-up question about an ultrasound study that was just analyzed.

Here is the analysis context for this study:
${JSON.stringify(analysisContext, null, 2)}

Answer questions clearly and concisely in plain text (no JSON). Be clinically precise but approachable. If asked about something outside the scope of this image/protocol, say so clearly. Always remind the user that your answers are for educational support only and that a qualified clinician must review all findings before clinical decisions are made.`;

    // Build message history
    const messages: Anthropic.MessageParam[] = [
      ...history.map((m: ChatMessage) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    // Build the current user message — include image if this is the first question
    const isFirstQuestion = history.length === 0;
    const hasImage = imageBase64 && mediaType && isFirstQuestion;

    const userContent: Anthropic.MessageParam["content"] = hasImage
      ? [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType as "image/jpeg" | "image/png" | "image/gif" | "image/webp",
              data: imageBase64,
            },
          },
          { type: "text", text: question },
        ]
      : question;

    messages.push({ role: "user", content: userContent });

    const response = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    });

    const textBlock = response.content.find((b): b is Anthropic.TextBlock => b.type === "text");
    if (!textBlock) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ answer: textBlock.text });
  } catch (err) {
    console.error("Chat error:", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
