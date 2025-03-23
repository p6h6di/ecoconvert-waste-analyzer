"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const message = {
    to: to.toLowerCase().trim(),
    from: process.env.EMAIL_FROM as string,
    subject: subject.trim(),
    html: subject.trim(),
  };

  try {
    const { data, error } = await resend.emails.send(message);
    if (error) {
      throw new Error(`Failed to send email: ${error.message}`);
    }
    return {
      success: true,
      message: data,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: `Failed to send email. Please try again later.`,
    };
  }
}
