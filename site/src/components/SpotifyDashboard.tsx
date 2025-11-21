import React from 'react';
import '../styles/SpotifyDashboard.css';

interface DiscoveryData {
  start_date: string;
  end_date: string;
  total_impressions: number;
  members_reached: number;
  total_engagements?: number;
  average_impressions_per_day?: number;
  new_followers?: number;
}

interface SpotifyDashboardProps {
  discovery?: DiscoveryData;
}

export const SpotifyDashboard: React.FC<SpotifyDashboardProps> = ({
  discovery,
}) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const parseISODate = (dateString: string): Date => {
    // Parse ISO date string (YYYY-MM-DD) safely to avoid timezone issues
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  return (
    <>
      {/* Your <year> Wrapped - Unified Metrics Section */}
      <div className="wrapped-section">
        <h2 className="section-title">
        Your {discovery?.end_date ? parseISODate(discovery.end_date).toLocaleDateString('en-US', {year: 'numeric' }) : '2024'} Wrapped
      </h2>
        <p className="section-subtitle">
          {discovery?.start_date && discovery?.end_date ? (
            <>
              {parseISODate(discovery.start_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} – {parseISODate(discovery.end_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </>
          ) : null}
        </p>
        <br></br>
        {/* Line 1: Impressions and Members Reached (2 cards at 50% each) */}
        <div className="warpped-metrics-grid line-1">
          {/* Total Impressions Card */}
          <div className="metric-card">
            <div className="card-background gradient-1"></div>
            <div className="card-content">
              <h3 className="card-label">Total Impressions</h3>
              <div className="card-value-container">
                <div className="card-value">
                  {formatNumber(discovery?.total_impressions || 0)}
                </div>
              </div>
              <div className="card-accent"></div>
            </div>
          </div>

          {/* Members Reached Card */}
          <div className="metric-card">
            <div className="card-background gradient-2"></div>
            <div className="card-content">
              <h3 className="card-label">Members Reached</h3>
              <div className="card-value-container">
                <div className="card-value">
                  {formatNumber(discovery?.members_reached || 0)}
                </div>
              </div>
              <div className="card-accent"></div>
            </div>
          </div>
        </div>

        {/* Line 2: Total Engagements, Total Impressions (duplicate), and Average Impressions Per Day */}
        <div className="warpped-metrics-grid line-2">
          {/* Total Engagements Card */}
          <div className="metric-card">
            <div className="card-background gradient-3"></div>
            <div className="card-content">
              <h3 className="card-label">Total Engagements</h3>
              <div className="card-value-container">
                <div className="card-value secondary-value">
                  {formatNumber(discovery?.total_engagements || 0)}
                </div>
              </div>
              <div className="card-accent"></div>
            </div>
          </div>

          {/* Average Impressions Per Day Card */}
          <div className="metric-card">
            <div className="card-background gradient-1"></div>
            <div className="card-content">
              <h3 className="card-label">median daily impressions</h3>
              <div className="card-value-container">
                <div className="card-value secondary-value">
                  {formatNumber(discovery?.average_impressions_per_day || 0)}
                </div>
              </div>
              <div className="card-accent"></div>
            </div>
          </div>

          {/* New Followers Card */}
          <div className="metric-card">
            <div className="card-background gradient-2"></div>
            <div className="card-content">
              <h3 className="card-label">New followers</h3>
              <div className="card-value-container">
                <div className="card-value secondary-value">
                  {formatNumber(discovery?.new_followers || 0)}
                </div>
              </div>
              <div className="card-accent"></div>
            </div>
          </div>
        </div>

      </div>
    </>
  );
};
