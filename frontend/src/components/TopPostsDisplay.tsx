import React, { useState, useEffect } from 'react';
import type { LinkedInTopPost } from '@types';
import '../styles/TopPostsDisplay.css';

interface TopPostsDisplayProps {
  posts: LinkedInTopPost[];
}

interface PostEmbed {
  html?: string;
  error?: boolean;
}

export const TopPostsDisplay: React.FC<TopPostsDisplayProps> = ({ posts }) => {
  const [embeds, setEmbeds] = useState<Record<string, PostEmbed>>({});
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const formatEngagements = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.round(num).toString();
  };

  const formatDate = (dateStr: string): string => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  useEffect(() => {
    const fetchEmbeds = async () => {
      for (const post of posts) {
        try {
          setLoadingStates(prev => ({ ...prev, [post.url]: true }));

          const response = await fetch(
            `https://www.linkedin.com/oembed?url=${encodeURIComponent(post.url)}&format=json`
          );

          if (response.ok) {
            const data = await response.json();
            setEmbeds(prev => ({
              ...prev,
              [post.url]: { html: data.html }
            }));
          } else {
            throw new Error('Failed to fetch embed');
          }
        } catch (error) {
          console.error(`Failed to fetch embed for ${post.url}:`, error);
          setEmbeds(prev => ({
            ...prev,
            [post.url]: { error: true }
          }));
        } finally {
          setLoadingStates(prev => ({ ...prev, [post.url]: false }));
        }
      }
    };

    if (posts.length > 0) {
      fetchEmbeds();
    }
  }, [posts]);

  if (!posts || posts.length === 0) {
    return null;
  }

  // Calculate summary statistics
  const totalEngagements = posts.reduce((sum, post) => sum + post.engagements, 0);
  const totalImpressions = posts.reduce((sum, post) => sum + (post.impressions || 0), 0);
  const topPostEngagements = posts[0]?.engagements || 0;

  return (
    <div className="top-posts-section">
      <div className="section-header">
        <div>
          <h2 className="section-title">🏆 Top posts</h2>
          <p className="section-subtitle">Your most engaging LinkedIn content with previews</p>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="summary-stats">
        <div className="summary-stat-card">
          <div className="summary-stat-number">{formatEngagements(totalEngagements)}</div>
          <div className="summary-stat-label">Total Engagements</div>
        </div>
        <div className="summary-stat-card">
          <div className="summary-stat-number">{formatEngagements(totalImpressions)}</div>
          <div className="summary-stat-label">Total Impressions</div>
        </div>
        <div className="summary-stat-card">
          <div className="summary-stat-number">{formatEngagements(topPostEngagements)}</div>
          <div className="summary-stat-label">Top Post Engagements</div>
        </div>
      </div>

      <div className="posts-container">
        {posts.map((post) => {
          const embed = embeds[post.url];
          const isLoading = loadingStates[post.url];

          return (
            <div key={post.url} className="post-card">
              <div className="post-header">
                <div className="post-rank-badge">#{post.rank}</div>
                <div className="post-date">{formatDate(post.publish_date)}</div>
              </div>

              <div className="post-content">
                {isLoading ? (
                  <div className="post-skeleton">
                    <div className="skeleton-line skeleton-line-1"></div>
                    <div className="skeleton-line skeleton-line-2"></div>
                    <div className="skeleton-line skeleton-line-3"></div>
                  </div>
                ) : embed?.html ? (
                  <div
                    className="post-embed-wrapper"
                    dangerouslySetInnerHTML={{ __html: embed.html }}
                  />
                ) : (
                  <div className="post-fallback">
                    <div className="fallback-icon">📄</div>
                    <p className="fallback-text">LinkedIn preview unavailable</p>
                    <a
                      href={post.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="fallback-link"
                    >
                      View post on LinkedIn ↗
                    </a>
                  </div>
                )}
              </div>

              <div className="post-stats">
                <div className="stat-box">
                  <div className="stat-icon">❤️</div>
                  <div className="stat-info">
                    <div className="stat-value">{formatEngagements(post.engagements)}</div>
                    <div className="stat-label">Engagements</div>
                  </div>
                </div>
                {post.impressions && post.impressions > 0 && (
                  <div className="stat-box">
                    <div className="stat-icon">✨</div>
                    <div className="stat-info">
                      <div className="stat-value">{formatEngagements(post.impressions)}</div>
                      <div className="stat-label">Impressions</div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
