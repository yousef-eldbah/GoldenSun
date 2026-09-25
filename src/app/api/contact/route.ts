import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Valid email is required"),
  mobile: z.string().optional().default(""),
  company: z.string().optional().default(""),
  subject: z.string().min(2, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.json();
    const parseResult = contactSchema.safeParse(rawBody);

    if (!parseResult.success) {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: parseResult.error.format() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    if (!isSupabaseConfigured || !supabase) {
      // If DB not configured, still acknowledge but log the issue
      console.warn("[contact] Supabase not configured. Contact inquiry was not saved.", data);
      return NextResponse.json({ success: true, message: "Your message has been received." });
    }

    const { error } = await supabase.from("contact_inquiries").insert({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
      company: data.company,
      subject: data.subject,
      message: data.message,
      status: "new",
    });

    if (error) {
      console.error("[contact] Supabase insert error:", error);
      return NextResponse.json(
        { success: false, error: "Failed to save your message. Please try WhatsApp or email directly." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Your message has been received. Our team will contact you within 24 hours." });
  } catch (err: unknown) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ success: false, error: "Unexpected server error." }, { status: 500 });
  }
}
