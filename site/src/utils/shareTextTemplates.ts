/**
 * Pre-written LinkedIn share text templates for each card type
 */

import type { ParsedExcelData } from './excel/types';

function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + 'K';
  }
  return num.toString();
}

export function generateShareText(cardType: string, data: ParsedExcelData): string {
  const templates: Record<string, (data: ParsedExcelData) => string> = {
    'total-impressions': (data) => {
      const impressions = formatNumber(data.discovery_data?.total_impressions || 0);
      return `🚀 My 2025 LinkedIn Impact

My posts reached ${impressions} impressions this year! Grateful to connect with so many amazing professionals.

Want to see your own LinkedIn Wrapped? Try it out to discover your 2025 stats.

#LinkedInWrapped #LinkedInStats #ProfessionalGrowth #2025`;
    },

    'top-post': (data) => {
      const topPost = data.top_posts?.[0];
      const engagements = formatNumber(topPost?.engagements || 0);
      return `🏆 My Top LinkedIn Post of 2025

This post resonated with ${engagements} people! Sometimes the content you least expect makes the biggest impact. Grateful for this amazing community.

Want to see your top-performing content? Check out LinkedIn Wrapped to discover your 2025 highlights.

#ContentStrategy #LinkedInTips #Engagement`;
    },

    'members-reached': (data) => {
      const reached = formatNumber(data.discovery_data?.members_reached || 0);
      return `👥 My 2025 LinkedIn Reach

I reached ${reached} unique professionals this year! Each conversation and connection has been valuable to my growth.

Discover who's engaging with your content. Check out LinkedIn Wrapped for your complete 2025 analytics.

#Networking #LinkedIn #ProfessionalGrowth #CommunityBuilding`;
    },

    'audience-industry': (data) => {
      const industry = data.demographics?.industries?.[0]?.name || 'professionals';
      const percentage = Math.round((data.demographics?.industries?.[0]?.percentage || 0) * 100);
      return `💼 My 2025 LinkedIn Audience

${percentage}% of my audience works in ${industry}! Love connecting with fellow ${industry} professionals and staying updated on industry trends.

Discover your audience demographics with LinkedIn Wrapped - see who's engaging with your content.

#Networking #${industry.replace(/\s/g, '')} #LinkedInCommunity`;
    },

    'engagement-rate': (data) => {
      const rate = ((data.discovery_data?.total_engagements || 0) / (data.discovery_data?.total_impressions || 1) * 100).toFixed(1);
      return `❤️ My 2025 Engagement Rate

${rate}% average engagement rate! Quality conversations and authentic content always win on LinkedIn.

What's your engagement rate? Check out LinkedIn Wrapped to see your 2025 analytics and performance metrics.

#LinkedInEngagement #ContentMarketing #LinkedInStrategy`;
    },

    'new-followers': (data) => {
      const followers = formatNumber(data.discovery_data?.new_followers || 0);
      return `🎉 My 2025 Growth

+${followers} new followers this year! So grateful for this incredible community and all the support.

See your LinkedIn growth journey with LinkedIn Wrapped. Discover your 2025 impact and connect with more professionals.

#LinkedInGrowth #Community #Networking #ProfessionalDevelopment`;
    },

    'audience-location': (data) => {
      const location = data.demographics?.locations?.[0]?.name || 'around the world';
      const percentage = Math.round((data.demographics?.locations?.[0]?.percentage || 0) * 100);
      return `📍 My 2025 Audience Location

${percentage}% of my reach is in ${location}! Love the global nature of LinkedIn and connecting across borders.

Where is your audience? Explore your audience geography with LinkedIn Wrapped and see your 2025 reach.

#GlobalNetwork #LinkedIn #Networking #ProfessionalCommunity`;
    },

    'year-summary': (data) => {
      const impressions = formatNumber(data.discovery_data?.total_impressions || 0);
      const reached = formatNumber(data.discovery_data?.members_reached || 0);
      const engagements = formatNumber(data.discovery_data?.total_engagements || 0);
      const followers = formatNumber(data.discovery_data?.new_followers || 0);

      return `🎊 My 2025 LinkedIn Wrapped

What a year on LinkedIn! Here's my 2025 impact:

✨ ${impressions} impressions
👥 ${reached} members reached
❤️ ${engagements} total engagements
🎉 ${followers} new followers

Thank you to everyone who engaged with my content and supported my journey in 2025!

Get your own LinkedIn Wrapped to see your 2025 stats and share your impact.

#LinkedInWrapped #2025Wrapped #YearInReview #LinkedIn`;
    },
  };

  return templates[cardType]?.(data) || 'Check out my LinkedIn Wrapped stats!';
}
