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

    // Perform redirect
    return NextResponse.redirect(links[0].original_url, {
      status: 302,
    });
  } catch (error) {
    console.error('Error processing redirect:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
