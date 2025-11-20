import { sql } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await params;

    // Get the link and increment click count
    const links = await sql`
      UPDATE links
      SET click_count = click_count + 1, last_clicked_at = NOW(), updated_at = NOW()
      WHERE short_code = ${code}
      RETURNING original_url
    `;

    if (links.length === 0) {
      return NextResponse.json(
        { error: 'Link not found' },
        { status: 404 }
      );
    }

    const originalUrl = links[0].original_url;

    // IMPORTANT: Ensure the URL is absolute (starts with http:// or https://)
    let redirectUrl = originalUrl;

    // If URL doesn't start with http:// or https://, add https://
    if (!redirectUrl.startsWith('http://') && !redirectUrl.startsWith('https://')) {
      redirectUrl = `https://${redirectUrl}`;
    }

    // Validate URL format
    try {
      new URL(redirectUrl); // This will throw if URL is invalid
    } catch (urlError) {
      console.error('Invalid URL format:', redirectUrl);
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      );
    }

    // Perform redirect with absolute URL
    return NextResponse.redirect(redirectUrl, 302);
  } catch (error) {
    console.error('Error processing redirect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}