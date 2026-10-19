import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { name, slug, description, icon_name, sort_order, is_active } = body;

    if (!name || !slug || !description) {
      return NextResponse.json(
        { error: 'Name, slug, and description are required.' },
        { status: 400 }
      );
    }

    const domain = await db.createDomain(
      {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        description: description.trim(),
        icon_name: icon_name || 'Code2',
        sort_order: Number(sort_order) || 99,
        is_active: is_active ?? true,
      },
      admin.id
    );

    return NextResponse.json({ success: true, domain });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or failed to create domain.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Domain ID is required.' }, { status: 400 });
    }

    const domain = await db.updateDomain(id, updates, admin.id);
    if (!domain) {
      return NextResponse.json({ error: 'Domain not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, domain });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or failed to update domain.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}
