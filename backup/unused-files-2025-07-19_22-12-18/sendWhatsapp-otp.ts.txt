'use server';

export async function sendWhatsAppMessage(message: string): Promise<boolean> {
  const apiKey = process.env.CALLMEBOT_API_KEY as string;
  const phone = process.env.CALLMEBOT_PHONE as string;
  const encodedMessage = encodeURIComponent(message);

  if (!apiKey || !phone) {
    return false; // Return failure instead of crashing
  }

  try {
    const response = await fetch(
      `https://api.callmebot.com/whatsapp.php?phone=${phone}&text=${encodedMessage}&apikey=${apiKey}`,
    );

    if (!response.ok) {
      return false;
    }

    return true; // Indicate success
  } catch (error) {
    return false; // Prevent app crash by returning false
  }
}
