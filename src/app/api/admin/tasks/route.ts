import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { domain_id, title, instructions, learning_objective, expected_deliverable, suggested_tools, display_order } = body;

    if (!domain_id || !title || !instructions) {
      return NextResponse.json(
        { error: 'Domain ID, Title, and Instructions are required.' },
        { status: 400 }
      );
    }

    const task = await db.createTask(
      {
        domain_id,
        title: title.trim(),
        instructions: instructions.trim(),
        learning_objective: learning_objective?.trim() || '',
        expected_deliverable: expected_deliverable?.trim() || '',
        suggested_tools: suggested_tools?.trim() || '',
        reference_links: [],
        display_order: Number(display_order) || 1,
        is_active: true,
      },
      admin.id
    );

    return NextResponse.json({ success: true, task });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or failed to create task.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const admin = await requireAdmin();
    const body = await req.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Task ID is required.' }, { status: 400 });
    }

    const task = await db.updateTask(id, updates, admin.id);
    if (!task) {
      return NextResponse.json({ error: 'Task not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, task });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Unauthorized or failed to update task.';
    return NextResponse.json({ error: errorMsg }, { status: 403 });
  }
}
