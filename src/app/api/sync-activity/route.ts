import { NextRequest, NextResponse } from 'next/server';
import { Milestone } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { githubUsername, leetcodeUsername, codeforcesUsername } = await req.json();

    const syncedMilestones: Milestone[] = [];

    // 1. SYNC GITHUB COMMITS & REPO ACTIVITY
    if (githubUsername && githubUsername.trim()) {
      try {
        const ghRes = await fetch(
          `https://api.github.com/users/${encodeURIComponent(githubUsername.trim())}/events/public`,
          {
            headers: {
              'User-Agent': 'Proof-of-Craft-Tracker/1.0',
              Accept: 'application/vnd.github.v3+json',
            },
            cache: 'no-store',
          }
        );

        if (ghRes.ok) {
          const events = await ghRes.json();
          if (Array.isArray(events)) {
            // Find PushEvents and CreateEvents
            const pushEvents = events.filter((e) => e.type === 'PushEvent' || e.type === 'CreateEvent').slice(0, 6);

            for (const ev of pushEvents) {
              const repoName = ev.repo?.name ? ev.repo.name.split('/')[1] || ev.repo.name : 'Repository';
              const date = ev.created_at ? ev.created_at.split('T')[0] : new Date().toISOString().split('T')[0];

              if (ev.type === 'PushEvent') {
                const commits = ev.payload?.commits || [];
                const commitMsg = commits[0]?.message
                  ? commits[0].message.split('\n')[0].slice(0, 60)
                  : `Shipped updates to ${repoName}`;
                const headSha = ev.payload?.head ? ev.payload.head.slice(0, 7) : 'head';

                syncedMilestones.push({
                  id: `gh-${ev.id}`,
                  title: `Git Push: ${repoName} - "${commitMsg}"`,
                  type: 'personal_project',
                  authorship: 'handcrafted',
                  date,
                  techStack: ['Git', 'GitHub', 'Open Source'],
                  description: `Verified commit [${headSha}] pushed to branch ${ev.payload?.ref?.replace('refs/heads/', '') || 'main'}. Verified via GitHub Events API.`,
                  roleDescription: 'Core Contributor',
                  xpAwarded: {
                    craftsmanXp: 35,
                    velocityXp: 15,
                  },
                  link: `https://github.com/${ev.repo?.name}/commit/${ev.payload?.head || ''}`,
                  outcome: 'Commit Verified on GitHub',
                });
              } else if (ev.type === 'CreateEvent' && ev.payload?.ref_type === 'repository') {
                syncedMilestones.push({
                  id: `gh-create-${ev.id}`,
                  title: `Created Repository: ${repoName}`,
                  type: 'personal_project',
                  authorship: 'handcrafted',
                  date,
                  techStack: ['Git', 'Software Architecture'],
                  description: `Initialized new software project on GitHub: ${ev.payload?.description || repoName}.`,
                  roleDescription: 'Creator',
                  xpAwarded: {
                    craftsmanXp: 40,
                    velocityXp: 20,
                  },
                  link: `https://github.com/${ev.repo?.name}`,
                  outcome: 'Repository Live',
                });
              }
            }
          }
        }
      } catch (ghErr) {
        console.warn('GitHub activity sync error:', ghErr);
      }
    }

    // 2. SYNC LEETCODE PROBLEM SOLVING SUBMISSIONS
    if (leetcodeUsername && leetcodeUsername.trim()) {
      try {
        const query = `
          query getRecentSubmissions($username: String!) {
            recentAcSubmissionList(username: $username, limit: 6) {
              id
              title
              titleSlug
              timestamp
            }
          }
        `;

        const lcRes = await fetch('https://leetcode.com/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          },
          body: JSON.stringify({
            query,
            variables: { username: leetcodeUsername.trim() },
          }),
          cache: 'no-store',
        });

        if (lcRes.ok) {
          const json = await lcRes.json();
          const list = json?.data?.recentAcSubmissionList;
          if (Array.isArray(list) && list.length > 0) {
            for (const item of list) {
              const date = item.timestamp
                ? new Date(parseInt(item.timestamp, 10) * 1000).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];

              syncedMilestones.push({
                id: `lc-${item.id || item.titleSlug}`,
                title: `Solved LeetCode: ${item.title}`,
                type: 'college_lab',
                authorship: 'handcrafted',
                date,
                techStack: ['Algorithms', 'Data Structures', 'Problem Solving'],
                description: `Accepted solution on LeetCode for problem "${item.title}". Verified algorithmic proof.`,
                roleDescription: 'Solver',
                xpAwarded: {
                  craftsmanXp: 50,
                  velocityXp: 0,
                },
                link: `https://leetcode.com/problems/${item.titleSlug}/`,
                outcome: 'Accepted on LeetCode',
              });
            }
          }
        }
      } catch (lcErr) {
        console.warn('LeetCode activity sync error:', lcErr);
      }
    }

    // 3. SYNC CODEFORCES RECENT ACCEPTED CONTEST PROBLEMS
    if (codeforcesUsername && codeforcesUsername.trim()) {
      try {
        const cfRes = await fetch(
          `https://codeforces.com/api/user.status?handle=${encodeURIComponent(codeforcesUsername.trim())}&from=1&count=8`,
          { cache: 'no-store' }
        );

        if (cfRes.ok) {
          const json = await cfRes.json();
          if (json.status === 'OK' && Array.isArray(json.result)) {
            const okSubs = json.result.filter((s: any) => s.verdict === 'OK').slice(0, 5);

            for (const sub of okSubs) {
              const date = sub.creationTimeSeconds
                ? new Date(sub.creationTimeSeconds * 1000).toISOString().split('T')[0]
                : new Date().toISOString().split('T')[0];

              const probName = sub.problem?.name || 'Problem';
              const probIndex = sub.problem?.index || '';
              const tags = sub.problem?.tags || ['Competitive Programming'];

              syncedMilestones.push({
                id: `cf-${sub.id}`,
                title: `Passed Codeforces: ${probName} (${probIndex})`,
                type: 'competition',
                authorship: 'handcrafted',
                date,
                techStack: tags.slice(0, 3),
                description: `Accepted solution in Codeforces Contest ${sub.contestId}. Executed in ${sub.timeConsumedMillis}ms.`,
                roleDescription: 'Competitor',
                xpAwarded: {
                  craftsmanXp: 60,
                  velocityXp: 0,
                },
                link: sub.contestId
                  ? `https://codeforces.com/contest/${sub.contestId}/problem/${probIndex}`
                  : undefined,
                outcome: 'Verdict: Accepted (OK)',
              });
            }
          }
        }
      } catch (cfErr) {
        console.warn('Codeforces activity sync error:', cfErr);
      }
    }

    // Sort by date descending
    syncedMilestones.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({
      success: true,
      milestones: syncedMilestones,
      count: syncedMilestones.length,
      syncedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in sync-activity:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal error syncing activity.' },
      { status: 500 }
    );
  }
}
