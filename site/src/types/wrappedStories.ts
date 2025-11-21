/**
 * Types for Wrapped Stories components
 */

export type CardType =
  | 'total-impressions'
  | 'members-reached'
  | 'engagement-rate'
  | 'top-post'
  | 'audience-industry'
  | 'audience-location'
  | 'new-followers'
  | 'year-summary';

export interface CardData {
  value?: number | string;
  label?: string;
  icon: string;
  context?: string;
  [key: string]: any; // Allow card-specific properties
}

export interface ShareableCard {
  id: string;
  type: CardType;
  title: string;
  data: CardData;
  shareText: string;
  backgroundColor: string;
  gradient: string;
}

export interface WrappedStoriesState {
  currentCardIndex: number;
  totalCards: number;
  isAutoPlaying: boolean;
  cards: ShareableCard[];
}
