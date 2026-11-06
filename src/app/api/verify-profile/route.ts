import { NextRequest, NextResponse } from 'next/server';
import { PlatformType, PlatformMetrics } from '@/types/profile';

export async function POST(req: NextRequest) {
  try {
    const { platform, username, apiKey } = await req.json();

    if (!platform || !username || !username.trim()) {
      return NextResponse.json(
        { success: false, error: 'Platform and username/handle are required.' },
        { status: 400 }
      );
    }

    const cleanUsername = username.trim();

    // 1. GITHUB VERIFICATION
    if (platform === 'github') {
      const headers: Record<string, string> = {
        'User-Agent': 'Tracker-Agent-Verification-Client/1.0',
        Accept: 'application/vnd.github.v3+json',
      };

      if (apiKey && apiKey.trim()) {
        const cleanKey = apiKey.trim();
        headers['Authorization'] = cleanKey.startsWith('Bearer ') || cleanKey.startsWith('token ')
          ? cleanKey
          : `Bearer ${cleanKey}`;
      }

      const res = await fetch(`https://api.github.com/users/${encodeURIComponent(cleanUsername)}`, {
        headers,
        cache: 'no-store',
      });

      if (res.status === 404) {
        return NextResponse.json({
          success: false,
          error: `GitHub user "${cleanUsername}" does not exist. Check spelling.`,
        });
      }

      if (res.status === 401 || res.status === 403) {
        const errJson = await res.json().catch(() => ({}));
        if (errJson.message && errJson.message.toLowerCase().includes('bad credentials')) {
          return NextResponse.json({
            success: false,
            error: 'Invalid GitHub Personal Access Token provided.',
          });
        }
      }

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          error: `GitHub API error (${res.status}). Please try again shortly.`,
        });
      }

      const data = await res.json();
      const metrics: PlatformMetrics = {
        primaryLabel: 'Public Repos',
        primaryValue: data.public_repos ?? 0,
        secondaryLabel: 'Followers',
        secondaryValue: data.followers ?? 0,
        tertiaryLabel: 'Public Gists',
        tertiaryValue: data.public_gists ?? 0,
        rankTitle: data.public_repos >= 40 ? 'Open Source Architect' : data.public_repos >= 15 ? 'Active Contributor' : 'Code Craftsman',
        avatarUrl: data.avatar_url,
        profileUrl: data.html_url,
        details: {
          name: data.name || data.login,
          bio: data.bio || 'Active Developer',
          memberSince: data.created_at ? data.created_at.slice(0, 4) : 'Unknown',
        },
      };

      return NextResponse.json({
        success: true,
        platform: 'github',
        username: data.login,
        metrics,
        verifiedAt: new Date().toISOString(),
      });
    }

    // 2. LEETCODE VERIFICATION
    if (platform === 'leetcode') {
      const query = `
        query getUserProfile($username: String!) {
          matchedUser(username: $username) {
            username
            profile {
              ranking
              reputation
              userAvatar
              realName
            }
            submitStats: submitStatsGlobal {
              acSubmissionNum {
                difficulty
                count
              }
            }
          }
        }
      `;

      const res = await fetch('https://leetcode.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
        body: JSON.stringify({ query, variables: { username: cleanUsername } }),
        cache: 'no-store',
      });

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          error: `LeetCode GraphQL service returned ${res.status}.`,
        });
      }

      const json = await res.json();
      const user = json?.data?.matchedUser;

      if (!user) {
        return NextResponse.json({
          success: false,
          error: `LeetCode profile "${cleanUsername}" was not found.`,
        });
      }

      const submissions = user.submitStats?.acSubmissionNum || [];
      const allCount = submissions.find((s: any) => s.difficulty === 'All')?.count || 0;
      const easyCount = submissions.find((s: any) => s.difficulty === 'Easy')?.count || 0;
      const mediumCount = submissions.find((s: any) => s.difficulty === 'Medium')?.count || 0;
      const hardCount = submissions.find((s: any) => s.difficulty === 'Hard')?.count || 0;
      const ranking = user.profile?.ranking;

      const metrics: PlatformMetrics = {
        primaryLabel: 'Problems Solved',
        primaryValue: allCount,
        secondaryLabel: 'Global Rank',
        secondaryValue: ranking ? `#${ranking.toLocaleString()}` : 'Unranked',
        tertiaryLabel: 'Medium / Hard',
        tertiaryValue: `${mediumCount}M / ${hardCount}H`,
        rankTitle: allCount >= 500 ? 'Guardian / Knight' : allCount >= 200 ? 'Algorithm Veteran' : 'Algorithm Apprentice',
        avatarUrl: user.profile?.userAvatar,
        profileUrl: `https://leetcode.com/u/${encodeURIComponent(cleanUsername)}/`,
        details: {
          easy: easyCount,
          medium: mediumCount,
          hard: hardCount,
          reputation: user.profile?.reputation || 0,
        },
      };

      return NextResponse.json({
        success: true,
        platform: 'leetcode',
        username: user.username,
        metrics,
        verifiedAt: new Date().toISOString(),
      });
    }

    // 3. CODEFORCES VERIFICATION
    if (platform === 'codeforces') {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cleanUsername)}`, {
        cache: 'no-store',
      });

      const json = await res.json().catch(() => null);

      if (!json || json.status !== 'OK' || !json.result || !json.result.length) {
        return NextResponse.json({
          success: false,
          error: `Codeforces handle "${cleanUsername}" was not found on the platform.`,
        });
      }

      const cf = json.result[0];
      const metrics: PlatformMetrics = {
        primaryLabel: 'Contest Rating',
        primaryValue: cf.rating ?? 'Unrated',
        secondaryLabel: 'Max Rating',
        secondaryValue: cf.maxRating ?? 'N/A',
        tertiaryLabel: 'Contribution',
        tertiaryValue: cf.contribution ?? 0,
        rankTitle: cf.rank ? cf.rank.toUpperCase() : 'NEWBIE',
        avatarUrl: cf.titlePhoto || cf.avatar,
        profileUrl: `https://codeforces.com/profile/${encodeURIComponent(cf.handle)}`,
        details: {
          rank: cf.rank || 'unranked',
          maxRank: cf.maxRank || 'unranked',
          organization: cf.organization || 'Independent',
        },
      };

      return NextResponse.json({
        success: true,
        platform: 'codeforces',
        username: cf.handle,
        metrics,
        verifiedAt: new Date().toISOString(),
      });
    }

    // 4. CODECHEF VERIFICATION
    if (platform === 'codechef') {
      const res = await fetch(`https://www.codechef.com/users/${encodeURIComponent(cleanUsername)}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        },
        cache: 'no-store',
      });

      if (!res.ok) {
        return NextResponse.json({
          success: false,
          error: `CodeChef handle "${cleanUsername}" could not be reached.`,
        });
      }

      const html = await res.text();
      const ratingMatch = html.match(/class="rating-number"[^>]*>\s*([0-9]+)\s*<\/div>/i) || html.match(/"rating":\s*"([0-9]+)"/);
      const starCount = (html.match(/&#9733;|\u2605/g) || []).length;
      const starsVal = starCount > 0 ? `${starCount}-Star` : 'Active Competitor';
      const globalRankMatch = html.match(/global rank\s*([0-9]+)/i);
      const nameMatch = html.match(/class="user-details-container[^"]*">\s*<h1>([^<]+)<\/h1>/i) || html.match(/<title>([^|-]+)/i);

      if (!ratingMatch) {
        return NextResponse.json({
          success: false,
          error: `CodeChef handle "${cleanUsername}" was not found or has no active rating.`,
        });
      }

      const ratingVal = parseInt(ratingMatch[1], 10);

      const metrics: PlatformMetrics = {
        primaryLabel: 'Contest Rating',
        primaryValue: ratingVal,
        secondaryLabel: 'Division',
        secondaryValue: starsVal,
        tertiaryLabel: 'Global Rank',
        tertiaryValue: globalRankMatch ? `#${parseInt(globalRankMatch[1], 10).toLocaleString()}` : 'Top Tier',
        rankTitle: `${starsVal} Competitive Coder`,
        profileUrl: `https://www.codechef.com/users/${encodeURIComponent(cleanUsername)}`,
        details: {
          name: nameMatch ? nameMatch[1].trim() : cleanUsername,
          stars: starsVal,
        },
      };

      return NextResponse.json({
        success: true,
        platform: 'codechef',
        username: cleanUsername,
        metrics,
        verifiedAt: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { success: false, error: `Unsupported platform: ${platform}` },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Error verifying platform profile:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error while verifying profile.' },
      { status: 500 }
    );
  }
}
