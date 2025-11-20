import { sql } from '@/lib/db';
import { generateShortCode, isValidUrl, isValidShortCode } from '@/lib/utils';
import { NextRequest, NextResponse } from 'next/server';

//  Create a new shortened link
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { originalUrl, customCode } = body;

    // Validate original URL
    if (!originalUrl || !isValidUrl(originalUrl)) {
      return NextResponse.json(
        { error: 'Invalid or missing URL' },
        { status: 400 }
      );
    }

    let shortCode = customCode;

    // If custom code provided, validate it
    if (customCode) {
      if (!isValidShortCode(customCode)) {
        return NextResponse.json(
          { error: 'Short code must be 6-8 alphanumeric characters' },
          { status: 400 }
        );
      }
      const existing = await sql`SELECT id FROM links WHERE short_code = ${customCode}`;
      if (existing.length > 0) {
        return NextResponse.json(
          { error: 'Short code already exists' },
          { status: 409 }
        );
      }
    } else {
      // Generate a random code if not provided
      let attempts = 0;
      while (attempts < 10) {
        shortCode = generateShortCode();
        const existing = await sql`SELECT id FROM links WHERE short_code = ${shortCode}`;
        if (existing.length === 0) break;
        attempts++;
      }
      if (attempts === 10) {
        return NextResponse.json(
          { error: 'Failed to generate unique short code' },
          { status: 500 }
        );
      }
    }

    const result = await sql`
      INSERT INTO links (short_code, original_url, click_count, created_at, updated_at)
      VALUES (${shortCode}, ${originalUrl}, 0, NOW(), NOW())
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error) {
    console.error('Error creating link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET /api/links - List all links
export async function GET() {
  try {
    const links = await sql`
      SELECT * FROM links ORDER BY created_at DESC
    `;
    return NextResponse.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
