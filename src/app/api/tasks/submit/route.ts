import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { isValidGitHubUrl } from '@/lib/validation';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
    }

    const body = await req.json();
    const { enrollment_id, task_id, github_url, notes } = body;

    if (!enrollment_id || !task_id || !github_url) {
      return NextResponse.json(
        { error: 'Enrollment ID, Task ID, and GitHub URL are required.' },
        { status: 400 }
      );
    }

    // Validate GitHub URL
    const urlCheck = isValidGitHubUrl(github_url);
    if (!urlCheck.isValid) {
      return NextResponse.json({ error: urlCheck.message }, { status: 400 });
    }

    const submission = await db.submitTask(
      enrollment_id,
      task_id,
      user.id,
      github_url,
      notes
    );

    try {
      const { saveProgressToCookie } = await import('@/lib/progress-cookie');
      const allSubmissions = await db.getTaskSubmissionsByEnrollmentId(enrollment_id);
      await saveProgressToCookie({
        studentId: user.id,
        taskSubmissions: allSubmissions,
      });
    } catch {
      // Fallback
    }

    return NextResponse.json({
      success: true,
      submission,
      message: 'Task repository link saved successfully.',
    });
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Task submission failed.';
    return NextResponse.json({ error: errorMsg }, { status: 400 });
  }
}
