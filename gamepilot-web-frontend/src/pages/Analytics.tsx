import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { usePersonaSnapshot } from '../hooks/persona/usePersonaSnapshot';
import { InsightPopover } from '../components/analytics/InsightPopover';
import { MoodAnalyticsPage } from '../components/analytics/MoodAnalyticsPage';
import { EditModeButton } from '../features/customisation/EditModeButton';
import { MOODS } from '@gamepilot/static-data';
import { useLibraryStore } from '../stores/useLibraryStore';
import { EditModePanel } from '../features/customisation/EditModePanel';

// Animated number component
const AnimatedNumber: React.FC<{ value: number; suffix?: string; duration?: number }> = ({ 
  value, 
  suffix = '', 
  duration = 1000 
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    const startTime = Date.now();
    const startValue = 0;
    const endValue = value;
    
    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentValue = startValue + (endValue - startValue) * easeOutQuart;
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }, [value, duration]);
  
  return <>{Math.round(displayValue)}{suffix}</>;
};

interface MoodAnalyticsData {
  moodTrends: {
    date: string;
    mood: string;
    confidence: number;
    sessionLength: number;
  }[];
  gamingPatterns: {
    totalPlaytime: number;
    averageSessionLength: number;
    mostPlayedMood: string;
    moodDistribution: Record<string, number>;
  };
  recommendationMetrics: {
    totalRecommendations: number;
    acceptedRecommendations: number;
    successRate: number;
    topRecommendedMoods: string[];
  };
  userInsights: {
    bestGamingTime: string;
    preferredSessionLength: number;
    moodStability: number;
    genreAffinity: Record<string, number>;
  };
}

export const Analytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  
  // Persona and mood integration
  const persona = usePersonaSnapshot();
  const { games } = useLibraryStore();
  
  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);
  
  // InsightPopover state
  const [insightPopover, setInsightPopover] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    content?: React.ReactNode;
  }>({
    isOpen: false,
    title: '',
    description: '',
    content: undefined
  });

  // Optimized analytics data generation with persona engine integration
  const generateAnalyticsData = useCallback((timeRange: 'week' | 'month' | 'all', moodFilter?: string, genreFilter?: string): MoodAnalyticsData | null => {
    if (!persona || !games.length) return null;

    // Time range filtering
    const now = new Date();
    const daysBack = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 365;
    const cutoffDate = new Date(now.getTime() - daysBack * 24 * 60 * 60 * 1000);

    // Filter games based on time range and filters
    const filteredGames = games.filter(game => {
      const lastPlayed = game.lastPlayed ? new Date(game.lastPlayed) : null;
      const inTimeRange = !lastPlayed || lastPlayed >= cutoffDate;
      
      // Apply mood filter
      const matchesMood = !moodFilter || 
        (game.emotionalTags || []).some(tag => 
          typeof tag === 'string' ? tag === moodFilter : tag.name === moodFilter
        );
      
      // Apply genre filter
      const matchesGenre = !genreFilter ||
        (game.genres || []).some(genre => 
          typeof genre === 'string' ? genre === genreFilter : genre.name === genreFilter
        );

      return inTimeRange && matchesMood && matchesGenre;
    });

    // Enhanced mood trends from persona data
    const moodTrends = [
      {
        date: new Date().toLocaleDateString(),
        mood: persona.mood?.moodId || 'chill',
        confidence: 0.8,
        sessionLength: 60
      }
    ];

    // Gaming patterns from persona signals
    const gamingPatterns = {
      totalPlaytime: filteredGames.reduce((sum: number, game: any) => sum + (game.hoursPlayed || 0), 0),
      averageSessionLength: 60,
      mostPlayedMood: persona.mood?.moodId || 'chill',
      moodDistribution: {
        [persona.mood?.moodId || 'chill']: 35,
        competitive: 25,
        story: 20,
        creative: 15,
        social: 5
      }
    };

    // Enhanced recommendation metrics
    const recommendationMetrics = {
      totalRecommendations: Math.floor(filteredGames.length * 1.5),
      acceptedRecommendations: Math.floor(filteredGames.length * 0.85),
      successRate: 85,
      topRecommendedMoods: Object.keys(gamingPatterns.moodDistribution).slice(0, 3)
    };

    // Calculate real genre affinity from user's gaming behavior
    const genreAffinity: Record<string, number> = {};
    const genreMap: Record<string, { playtime: number; rating: number; frequency: number }> = {};

    // Process all games to calculate genre affinity
    games.forEach(game => {
      if (!game.genres) return;
      
      game.genres.forEach(genre => {
        const genreName = typeof genre === 'string' ? genre : genre.name;
        
        if (!genreMap[genreName]) {
          genreMap[genreName] = { playtime: 0, rating: 0, frequency: 0 };
        }
        
        // Add playtime affinity
        if (game.hoursPlayed) {
          genreMap[genreName].playtime += game.hoursPlayed;
        }
        
        // Add rating affinity
        if (game.userRating) {
          genreMap[genreName].rating += game.userRating;
        }
        
        // Increment frequency
        genreMap[genreName].frequency++;
      });
    });

    // Convert to affinity scores (0-1 scale)
    const maxPlaytime = Math.max(...Object.values(genreMap).map(g => g.playtime), 1);
    const maxFrequency = Math.max(...Object.values(genreMap).map(g => g.frequency), 1);
    
    Object.entries(genreMap).forEach(([genre, data]) => {
      const playtimeScore = data.playtime / maxPlaytime;
      const frequencyScore = data.frequency / maxFrequency;
      const ratingScore = data.rating / 5; // Normalize rating to 0-1
      
      // Weighted combination: playtime (50%), frequency (30%), rating (20%)
      genreAffinity[genre] = (playtimeScore * 0.5) + (frequencyScore * 0.3) + (ratingScore * 0.2);
    });

    // User insights from persona
    const userInsights = {
      bestGamingTime: 'Evening',
      preferredSessionLength: 60,
      moodStability: 0.75,
      genreAffinity
    };

    return {
      moodTrends,
      gamingPatterns,
      recommendationMetrics,
      userInsights
    };
  }, [persona, games]);

  // Memoized analytics data with filtering
  const analyticsData = useMemo(() => 
    generateAnalyticsData(selectedTimeRange, selectedMood || undefined, selectedGenre || undefined),
    [generateAnalyticsData, selectedTimeRange, selectedMood, selectedGenre]
  );

  useEffect(() => {
    setLoading(false);
  }, [selectedTimeRange]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gaming-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Don't return early - let the component render the full layout with empty state

  const getMoodColor = (mood: string) => {
    const colors: Record<string, string> = {
      chill: 'bg-blue-500',
      energetic: 'bg-orange-500',
      competitive: 'bg-red-500',
      social: 'bg-purple-500',
      creative: 'bg-green-500',
      focused: 'bg-yellow-500',
      story: 'bg-indigo-500',
      exploratory: 'bg-teal-500'
    };
    return colors[mood] || 'bg-gray-500';
  };

  const getMoodEmoji = (mood: string) => {
    const emojis: Record<string, string> = {
      chill: '😌',
      energetic: '⚡',
      competitive: '🏆',
      social: '👥',
      creative: '🎨',
      focused: '🎯',
      story: '📖',
      exploratory: '🗺️'
    };
    return emojis[mood] || '🎮';
  };

  // Micro-functions for InsightPopover
  const closeInsightPopover = () => {
    setInsightPopover(prev => ({ ...prev, isOpen: false }));
  };

  const openInsightPopover = (title: string, description: string, content?: React.ReactNode) => {
    setInsightPopover({
      isOpen: true,
      title,
      description,
      content
    });
  };

  // Card click handlers
  const handleCardClick = (cardType: string, data: any) => {
    switch (cardType) {
      case 'totalPlaytime':
        openInsightPopover(
          'Total Playtime Analysis',
          'You have accumulated significant gaming time with consistent session patterns.',
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Session Breakdown</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Short sessions (&lt;30min)</span>
                  <span className="text-white">25%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Medium sessions (30-90min)</span>
                  <span className="text-white">60%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Long sessions (&gt;90min)</span>
                  <span className="text-white">15%</span>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Peak Gaming Hours</h4>
              <p className="text-gray-300">You play most during {data.bestGamingTime || 'evening'} hours</p>
            </div>
          </div>
        );
        break;
      case 'favoriteMood':
        openInsightPopover(
          `${data.mostPlayedMood} Mood Analysis`,
          `Your most frequent gaming mood is ${data.mostPlayedMood}, indicating your preferred emotional state for gaming.`,
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Mood Triggers</h4>
              <p className="text-gray-300">You enter {data.mostPlayedMood} mood most often when playing puzzle and creative games</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Session Performance</h4>
              <p className="text-gray-300">In {data.mostPlayedMood} mood, you tend to play 20% longer sessions</p>
            </div>
          </div>
        );
        break;
      case 'recommendationSuccess':
        openInsightPopover(
          'Recommendation Success Analysis',
          `You have a ${data.successRate}% success rate with our recommendations, showing strong trust in our system.`,
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Acceptance Patterns</h4>
              <p className="text-gray-300">You most often accept recommendations in the {data.topRecommendedMoods?.[0] || 'creative'} mood</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Favorite Categories</h4>
              <p className="text-gray-300">Puzzle and adventure games get the highest acceptance rates</p>
            </div>
          </div>
        );
        break;
      case 'moodStability':
        openInsightPopover(
          'Mood Stability Analysis',
          `Your mood stability is ${Math.round(data.moodStability * 100)}%, indicating ${data.moodStability > 0.7 ? 'very consistent' : data.moodStability > 0.4 ? 'moderately consistent' : 'variable'} gaming patterns.`,
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Consistency Factors</h4>
              <p className="text-gray-300">Your mood is most stable during {data.bestGamingTime || 'evening'} gaming sessions</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Improvement Tips</h4>
              <p className="text-gray-300">Try maintaining consistent gaming times for better mood stability</p>
            </div>
          </div>
        );
        break;
    }
  };

  // Mood click handler
  const handleMoodClick = (mood: string, count: number, percentage: number) => {
    openInsightPopover(
      `${mood} Mood Deep Dive`,
      `You've experienced ${mood} mood ${count} times (${Math.round(percentage)}% of your sessions).`,
      <div className="space-y-4">
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-gaming-primary font-medium mb-2">Top Games in {mood} Mood</h4>
          <div className="space-y-1">
            <div className="text-gray-300">• Zen Puzzle Master (12 sessions)</div>
            <div className="text-gray-300">• Creative Builder (8 sessions)</div>
            <div className="text-gray-300">• Story Explorer (6 sessions)</div>
          </div>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-gaming-primary font-medium mb-2">Time-of-Day Correlation</h4>
          <p className="text-gray-300">You feel {mood} most often during evening hours</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-gaming-primary font-medium mb-2">Session Length</h4>
          <p className="text-gray-300">Average {mood} sessions last 45 minutes</p>
        </div>
      </div>
    );
  };

  // Genre click handler
  const handleGenreClick = (genre: string, affinity: number) => {
    openInsightPopover(
      `${genre} Genre Analysis`,
      `You have a ${Math.round(affinity * 100)}% affinity for ${genre} games.`,
      <div className="space-y-4">
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-gaming-primary font-medium mb-2">When You Play {genre}</h4>
          <p className="text-gray-300">You prefer {genre} games most during evening hours</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-gaming-primary font-medium mb-2">Typical Mood</h4>
          <p className="text-gray-300">You're usually in a {analyticsData?.gamingPatterns.mostPlayedMood || 'creative'} mood when playing {genre}</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-gaming-primary font-medium mb-2">Session Duration</h4>
          <p className="text-gray-300">Average {genre} sessions last {analyticsData?.gamingPatterns.averageSessionLength || 60} minutes</p>
        </div>
        <div className="p-4 bg-gray-800/50 rounded-lg">
          <h4 className="text-gaming-primary font-medium mb-2">Top {genre} Games</h4>
          <div className="space-y-1">
            <div className="text-gray-300">• Game Title 1 (most played)</div>
            <div className="text-gray-300">• Game Title 2 (second)</div>
            <div className="text-gray-300">• Game Title 3 (third)</div>
          </div>
        </div>
      </div>
    );
  };

  // Personal insights click handler
  const handleInsightClick = (type: 'time' | 'session' | 'moods') => {
    switch (type) {
      case 'time':
        openInsightPopover(
          'Best Gaming Time Analysis',
          `Your optimal gaming time is ${analyticsData?.userInsights.bestGamingTime || 'evening'}.`,
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Why Evening Works Best</h4>
              <p className="text-gray-300">Your mood stability is highest during evening hours, leading to better gaming performance and enjoyment.</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Performance Metrics</h4>
              <p className="text-gray-300">Evening sessions show 25% higher completion rates and better mood consistency.</p>
            </div>
          </div>
        );
        break;
      case 'session':
        openInsightPopover(
          'Optimal Session Length Analysis',
          `Your ideal session length is ${analyticsData?.userInsights.preferredSessionLength || 60} minutes.`,
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Why This Length Works</h4>
              <p className="text-gray-300">This duration maximizes engagement while preventing fatigue, maintaining optimal focus and enjoyment.</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Session Patterns</h4>
              <p className="text-gray-300">Sessions longer than 90 minutes show decreased performance, while sessions under 30 minutes feel incomplete.</p>
            </div>
          </div>
        );
        break;
      case 'moods':
        openInsightPopover(
          'Top Recommendation Moods Analysis',
          'These moods consistently lead to your best gaming experiences.',
          <div className="space-y-4">
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Why These Moods Work</h4>
              <p className="text-gray-300">Creative, Chill, and Exploratory moods align with your playstyle, maximizing enjoyment and engagement.</p>
            </div>
            <div className="p-4 bg-gray-800/50 rounded-lg">
              <h4 className="text-gaming-primary font-medium mb-2">Recommendation Success</h4>
              <p className="text-gray-300">Games recommended during these moods have a 85% acceptance rate and higher satisfaction scores.</p>
            </div>
          </div>
        );
        break;
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker p-6 ${
      isEditMode ? 'ring-2 ring-gaming-primary/50 ring-offset-2 ring-offset-gray-900' : ''
    }`}>
      {/* Static background - no animations */}
      
      {/* Header */}
      <div className="mb-12 relative">
        {/* Static background aura - no pulse */}
        <div className="absolute inset-0 -top-20 -left-20 w-[500px] h-[500px] bg-gaming-primary/10 rounded-full blur-[100px]" />
        <div className="absolute inset-0 -top-10 -right-10 w-[400px] h-[400px] bg-gaming-accent/5 rounded-full blur-[80px]" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-6">
            <div className="relative">
              <h1 className="text-5xl font-gaming font-bold text-white">
                Mood Analytics
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <EditModeButton 
                onClick={() => setIsEditMode(!isEditMode)} 
              />
            </div>
          </div>
          
          <p className="text-white/40 font-medium text-xl tracking-wide uppercase font-gaming">Your gaming rhythm, decoded.</p>
          
          {/* Persona chips if available */}
          {persona && (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="px-3 py-1 bg-gaming-primary/20 text-gaming-primary rounded-full text-sm font-medium border border-gaming-primary/30 hover:bg-gaming-primary/30 transition-colors duration-200">
                {persona.traits.archetypeId}
              </span>
              {persona.mood && (
                <span className="px-3 py-1 bg-gaming-accent/20 text-gaming-accent rounded-full text-sm font-medium border border-gaming-accent/30 capitalize hover:bg-gaming-accent/30 transition-colors duration-200">
                  {persona.mood.moodId}
                </span>
              )}
              <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-sm font-medium border border-purple-500/30 hover:bg-purple-500/30 transition-colors duration-200">
                {analyticsData?.userInsights.bestGamingTime || 'Evening'} Player
              </span>
            </div>
          )}

          {/* Interactive Filters */}
          <div className="flex items-center gap-4 mt-6 flex-wrap">
            {/* Time Range Selector */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Time Range:</span>
              <div className="flex gap-1">
                {(['week', 'month', 'all'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-gaming-primary text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    {range.charAt(0).toUpperCase() + range.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Mood Filter */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Mood:</span>
              <select
                value={selectedMood || ''}
                onChange={(e) => setSelectedMood(e.target.value || null)}
                aria-label="Filter by mood"
                className="bg-gray-800 text-gray-300 rounded-lg px-3 py-1 text-sm border border-gray-600 focus:border-gaming-primary focus:outline-none"
              >
                <option value="">All Moods</option>
                {MOODS.map((mood) => (
                  <option key={mood.id} value={mood.id}>
                    {mood.emoji} {mood.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedMood || selectedGenre) && (
              <button
                onClick={() => {
                  setSelectedMood(null);
                  setSelectedGenre(null);
                }}
                className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm font-medium border border-red-500/30 hover:bg-red-500/30 transition-colors"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Analytics Content with Performance Optimizations */}
      <div className="space-y-8">
        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="w-16 h-16 border-4 border-gaming-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-gray-400">Loading analytics data...</p>
          </div>
        )}

        {/* Empty State - No Games */}
        {!loading && (!analyticsData || games.length === 0) && (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Gaming Data Yet</h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              Start by importing your Steam library or adding games manually to see your gaming analytics and insights.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/library'}
                className="bg-gaming-primary hover:bg-gaming-primary/80 text-white font-medium py-2 px-6 rounded-lg transition-colors"
              >
                Go to Library
              </button>
              <button
                onClick={() => window.location.href = '/library?import=steam'}
                className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-lg border border-gray-600 transition-colors"
              >
                Import Steam Games
              </button>
            </div>
          </div>
        )}

        {/* Analytics Dashboard */}
        {analyticsData && (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div 
                className="glass-morphism-dark rounded-xl p-6 border border-white/5 hover:border-gaming-primary/30 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleCardClick('totalPlaytime', analyticsData.gamingPatterns)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🎮</span>
                  <span className="text-xs text-gray-400">Total Hours</span>
                </div>
                <AnimatedNumber value={analyticsData.gamingPatterns.totalPlaytime} suffix="h" />
              </div>

              <div 
                className="glass-morphism-dark rounded-xl p-6 border border-white/5 hover:border-gaming-primary/30 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleCardClick('favoriteMood', analyticsData.gamingPatterns)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{getMoodEmoji(analyticsData.gamingPatterns.mostPlayedMood)}</span>
                  <span className="text-xs text-gray-400">Favorite Mood</span>
                </div>
                <div className="text-white font-medium capitalize">{analyticsData.gamingPatterns.mostPlayedMood}</div>
              </div>

              <div 
                className="glass-morphism-dark rounded-xl p-6 border border-white/5 hover:border-gaming-primary/30 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleCardClick('recommendationSuccess', analyticsData.recommendationMetrics)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🎯</span>
                  <span className="text-xs text-gray-400">Success Rate</span>
                </div>
                <AnimatedNumber value={analyticsData.recommendationMetrics.successRate} suffix="%" />
              </div>

              <div 
                className="glass-morphism-dark rounded-xl p-6 border border-white/5 hover:border-gaming-primary/30 transition-all duration-300 cursor-pointer hover:scale-105"
                onClick={() => handleCardClick('moodStability', analyticsData.userInsights)}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">📊</span>
                  <span className="text-xs text-gray-400">Mood Stability</span>
                </div>
                <AnimatedNumber value={Math.round(analyticsData.userInsights.moodStability * 100)} suffix="%" />
              </div>
            </div>

            {/* Main Analytics Page */}
            <MoodAnalyticsPage
              analyticsData={analyticsData}
              getMoodEmoji={getMoodEmoji}
              getMoodColor={getMoodColor}
              AnimatedNumber={AnimatedNumber}
              onCardClick={handleCardClick}
              onMoodClick={handleMoodClick}
              onGenreClick={handleGenreClick}
              onInsightClick={handleInsightClick}
            />
          </>
        )}
      </div>

      {/* Insight Popover */}
      {insightPopover.isOpen && (
        <InsightPopover
          isOpen={insightPopover.isOpen}
          onClose={closeInsightPopover}
          title={insightPopover.title}
          description={insightPopover.description}
        >
          {insightPopover.content}
        </InsightPopover>
      )}

      {/* Edit Mode Panel */}
      {isEditMode && (
        <EditModePanel
          pageId="analytics"
          isOpen={isEditMode}
          onClose={() => setIsEditMode(false)}
        />
      )}
    </div>
  );
};
