/**
 * Maps parsed Excel data to shareable card objects
 */

import type { ShareableCard } from '../types/wrappedStories';
import type { ParsedExcelData } from './excel/types';
import { generateShareText } from './shareTextTemplates';

/**
 * Format large numbers for display (e.g., 1500000 -> 1.5M)
 */
function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
  }
  return num.toString();
}

/**
 * Generate all shareable cards from parsed Excel data
 * Cards are ordered by virality potential
 */
export function generateShareableCards(data: ParsedExcelData): ShareableCard[] {
  const cards: ShareableCard[] = [];

  // Card 1: Total Impressions
  if (data.discovery_data?.total_impressions) {
    cards.push({
      id: 'total-impressions',
      type: 'total-impressions',
      title: 'Impressive Influencer',
      data: {
        value: formatNumber(data.discovery_data.total_impressions),
        label: 'Total Impressions in 2025',
        icon: '✨',
        context: 'Your posts were seen this many times',
      },
      shareText: generateShareText('total-impressions', data),
      backgroundColor: '#0F0F0F',
      gradient: 'linear-gradient(135deg, #0A66C2 0%, #00B4D8 100%)',
    });
  }

  // Card 2: Top Post
  if (data.top_posts && data.top_posts.length > 0) {
    const topPost = data.top_posts[0];
    cards.push({
      id: 'top-post',
      type: 'top-post',
      title: 'Pinnacle Post Producer',
      data: {
        value: formatNumber(topPost.engagements),
        label: 'Engagements on Your Top Post',
        icon: '🏆',
        context: 'Your highest-performing content',
        url: topPost.url,
        date: topPost.publish_date,
      },
      shareText: generateShareText('top-post', data),
      backgroundColor: '#0F0F0F',
      gradient: 'linear-gradient(135deg, #FFB703 0%, #FB5607 100%)',
    });
  }

  // Card 3: Members Reached
  if (data.discovery_data?.members_reached) {
    cards.push({
      id: 'members-reached',
      type: 'members-reached',
      title: 'Magnificent Member Magnetizer',
      data: {
        value: formatNumber(data.discovery_data.members_reached),
        label: 'Unique Professionals Reached',
        icon: '👥',
        context: 'Your network is powerful',
      },
      shareText: generateShareText('members-reached', data),
      backgroundColor: '#0F0F0F',
      gradient: 'linear-gradient(135deg, #00D9FF 0%, #0A8FFF 100%)',
    });
  }

  // Card 4: Top Industry
  if (data.demographics?.industries && data.demographics.industries.length > 0) {
    const topIndustry = data.demographics.industries[0];
    const percentage = Math.round((topIndustry.percentage || 0) * 100);
    cards.push({
      id: 'top-industry',
      type: 'audience-industry',
      title: 'Incredible Industry Insider',
      data: {
        value: topIndustry.name,
        label: `${percentage}% of Your Audience`,
        icon: '💼',
        context: 'Your primary professional segment',
        percentage: topIndustry.percentage,
      },
      shareText: generateShareText('audience-industry', data),
      backgroundColor: '#0F0F0F',
      gradient: 'linear-gradient(135deg, #9945FF 0%, #7209B7 100%)',
    });
  }

  // Card 5: Engagement Rate
  if (data.discovery_data?.total_engagements && data.discovery_data?.total_impressions) {
    const engagementRate = (
      (data.discovery_data.total_engagements / data.discovery_data.total_impressions) * 100
    ).toFixed(2);
    cards.push({
      id: 'engagement-rate',
      type: 'engagement-rate',
      title: 'Excellent Engagement Expert',
      data: {
        value: `${engagementRate}%`,
        label: 'Average Engagement Rate',
        icon: '❤️',
        context: 'Your audience loves your content',
      },
      shareText: generateShareText('engagement-rate', data),
      backgroundColor: '#0F0F0F',
      gradient: 'linear-gradient(135deg, #06A77D 0%, #2A9D8F 100%)',
    });
  }

  // Card 6: New Followers
  if (data.discovery_data?.new_followers) {
    cards.push({
      id: 'new-followers',
      type: 'new-followers',
      title: 'Popular Professional Personality',
      data: {
        value: `+${formatNumber(data.discovery_data.new_followers)}`,
        label: 'New Followers in 2025',
        icon: '🎉',
        context: 'Your community is growing!',
      },
      shareText: generateShareText('new-followers', data),
      backgroundColor: '#0F0F0F',
      gradient: 'linear-gradient(135deg, #E63946 0%, #F77F88 100%)',
    });
  }

  // Card 7: Top Location
  if (data.demographics?.locations && data.demographics.locations.length > 0) {
    const topLocation = data.demographics.locations[0];
    const percentage = Math.round((topLocation.percentage || 0) * 100);
    cards.push({
      id: 'top-location',
      type: 'audience-location',
      title: 'Landmark Location Legend',
      data: {
        value: topLocation.name,
        label: `${percentage}% of Your Audience`,
        icon: '📍',
        context: 'Your primary geographic reach',
        percentage: topLocation.percentage,
      },
      shareText: generateShareText('audience-location', data),
      backgroundColor: '#0F0F0F',
      gradient: 'linear-gradient(135deg, #0A66C2 0%, #40E0D0 100%)',
    });
  }

  // Card 8: Year Summary (Always include as final card)
  cards.push({
    id: 'year-summary',
    type: 'year-summary',
    title: 'Legendary LinkedIn Leader',
    data: {
      impressions: formatNumber(data.discovery_data?.total_impressions || 0),
      membersReached: formatNumber(data.discovery_data?.members_reached || 0),
      engagements: formatNumber(data.discovery_data?.total_engagements || 0),
      newFollowers: formatNumber(data.discovery_data?.new_followers || 0),
      topPosts: data.top_posts?.length || 0,
      icon: '🎊',
      context: 'Your complete 2025 LinkedIn impact',
    },
    shareText: generateShareText('year-summary', data),
    backgroundColor: '#0F0F0F',
    gradient: 'linear-gradient(135deg, #FF006E 0%, #9945FF 50%, #0A66C2 100%)',
  });

  return cards;
}

/**
 * Get a list of card titles for reference
 */
export function getCardTitles(): Record<string, string> {
  return {
    'total-impressions': 'Impressive Influencer',
    'top-post': 'Pinnacle Post Producer',
    'members-reached': 'Magnificent Member Magnetizer',
    'audience-industry': 'Incredible Industry Insider',
    'engagement-rate': 'Excellent Engagement Expert',
    'new-followers': 'Popular Professional Personality',
    'audience-location': 'Landmark Location Legend',
    'year-summary': 'Legendary LinkedIn Leader',
  };
}
