/**
 * GitHub repository inspector for INTERN-UP
 * Auto-checks that:
 * 1. The repository exists
 * 2. The repository is public
 * 3. Has recent commits
 */

export interface GitHubCheckResult {
  isValid: boolean;
  isPublic: boolean;
  repoName?: string;
  owner?: string;
  stars?: number;
  lastPushedAt?: string;
  hasRecentCommits?: boolean;
  defaultBranch?: string;
  message: string;
  warning?: string;
}

export function parseGitHubOwnerAndRepo(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url.trim());
    if (!['github.com', 'www.github.com'].includes(parsed.hostname.toLowerCase())) {
      return null;
    }

    const segments = parsed.pathname.replace(/^\/|\/$/g, '').split('/');
    if (segments.length < 2 || !segments[0] || !segments[1]) {
      return null;
    }

    return {
      owner: segments[0],
      repo: segments[1].replace(/\.git$/i, ''),
    };
  } catch {
    return null;
  }
}

export async function verifyGitHubRepository(url: string): Promise<GitHubCheckResult> {
  const parsed = parseGitHubOwnerAndRepo(url);
  if (!parsed) {
    return {
      isValid: false,
      isPublic: false,
      message: 'Invalid GitHub repository URL format. Expected: https://github.com/username/repo-name',
    };
  }

  const { owner, repo } = parsed;

  try {
    // 1. Check repository metadata via GitHub public API
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s timeout

    const repoRes = await fetch(`https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}`, {
      headers: {
        'User-Agent': 'INTERN-UP-Sprint-Validator/1.0',
        Accept: 'application/vnd.github.v3+json',
      },
      signal: controller.signal,
      cache: 'no-store',
    });

    clearTimeout(timeout);

    if (repoRes.status === 404) {
      return {
        isValid: false,
        isPublic: false,
        message: `Repository "${owner}/${repo}" was not found or is set to Private. Please make sure the repository is public.`,
      };
    }

    if (repoRes.status === 403) {
      // GitHub API rate limit reached (60/hr for unauthenticated IP)
      return {
        isValid: true,
        isPublic: true,
        repoName: repo,
        owner,
        message: 'Repository URL is valid. (GitHub API rate limit reached; queued for manual mentor review).',
        warning: 'Rate limit fallback applied.',
      };
    }

    if (!repoRes.ok) {
      return {
        isValid: false,
        isPublic: false,
        message: `GitHub check returned status ${repoRes.status}. Please ensure the repository is public.`,
      };
    }

    const repoData = await repoRes.json();
    const isPrivate = !!repoData.private;
    if (isPrivate) {
      return {
        isValid: false,
        isPublic: false,
        message: 'Repository is private. INTERN-UP requires a public repository so mentors can review your code.',
      };
    }

    // Check pushed date
    const pushedDate = repoData.pushed_at ? new Date(repoData.pushed_at) : null;
    const now = new Date();
    // Recent if within last 60 days
    const hasRecentCommits = pushedDate
      ? (now.getTime() - pushedDate.getTime()) / (1000 * 60 * 60 * 24) < 60
      : false;

    return {
      isValid: true,
      isPublic: true,
      repoName: repoData.name,
      owner: repoData.owner?.login || owner,
      stars: repoData.stargazers_count,
      lastPushedAt: repoData.pushed_at,
      hasRecentCommits,
      defaultBranch: repoData.default_branch || 'main',
      message: `Verified public repository "${repoData.name}" (${hasRecentCommits ? 'Active recent commits' : 'Pushed: ' + (repoData.pushed_at ? new Date(repoData.pushed_at).toLocaleDateString() : 'N/A')}).`,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : 'Network error during GitHub check.';
    // Graceful fallback to format validation
    return {
      isValid: true,
      isPublic: true,
      repoName: repo,
      owner,
      message: 'Valid GitHub repository format. Automated network check timed out, queued for manual review.',
      warning: errorMsg,
    };
  }
}
