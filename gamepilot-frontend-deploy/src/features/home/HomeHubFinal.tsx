import { useLibraryStore } from "../../stores/useLibraryStore";
import { useGamePilotStore } from "../../stores/useGamePilotStore";
import { useAuthStore } from "../../store/authStore";
import { MOODS, type MoodId } from "@gamepilot/static-data";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { PageErrorBoundary } from "../../components/ErrorBoundary";
import { WhatToPlayNow } from '../../components/WhatToPlayNow';
import { WhatToBuy } from "../../components/home/WhatToBuy";
import { EnhancedWhatToBuy } from "../../components/home/EnhancedWhatToBuy";
import { usePersonaRecommendation } from "../../hooks/usePersonaRecommendation";
import { MoodForecastCardSimple } from "../../components/mood/MoodForecastCardSimple";
import { RecommendedGamesStrip } from "../../components/mood/RecommendedGamesStrip";
import { SurpriseMeSection } from "./components/SurpriseMeSection";
import { ResonanceInsightChip } from "../../components/mood/ResonanceInsightChip";
import { SurpriseMe } from "../../components/mood/SurpriseMe";
import { SimpleMoodSelector } from "../../components/SimpleMoodSelector";
import { useNewMoodRecommendations } from "../../hooks/useNewMoodRecommendations";
import { moodService } from "../../services/moodService";
import { useState, useEffect, useMemo } from "react";
import { createApiUrl } from "../../config/api";
import { LazyImage } from "../../components/LazyImage";
import { getHighQualityGameImage } from "../../utils/gameImageUtils";
import { EnhancedHeroSection } from "../../components/home/EnhancedHeroSection";
import { launcherService } from "../../services/launcherService";
import { launchGame } from "../../utils/launchGame";
import { useToast } from '../../components/ui/ToastProvider';

// NEW: Import contextual engine
import { 
  detectTimeOfDay, 
  getContextualMatches, 
  getTimeSafe,
  generatePersonaContext,
  getPersonaContextualMatches,
  type ContextualFilters,
  type SessionLength,
  type TimeOfDay,
  type PersonaContext
} from '../../utils/contextualEngine';

// NEW: Import analytics
import { 
  trackRecommendationInteraction,
  trackPersonaInsights,
  configureAnalytics
} from '../../utils/analytics';

// Import persona components
import { usePersonaSnapshot } from "../../hooks/persona";
import { usePersonaRealtime } from "../../hooks/usePersonaRealtime";
import { MoodFilterDebug } from "../../components/debug/MoodFilterDebug";

// Import Enhanced Persona Preview (optional component)
import { EnhancedPersonaPreview } from "../../components/persona/EnhancedPersonaPreview";

// Import IdentityCard and Persona Engine
import IdentityCard from "../../components/persona/IdentityCard";
import { buildPersonaSignals, buildPersonaTraits } from "@shared/persona/synthesis";
import { buildMoodState } from "@shared/persona/moodEngine";
import { buildReflection } from "@shared/persona/reflection";
import type { IdentityCore } from "@shared/persona/identityCore";

// Import debug panel for development
import { DebugPanel } from "./components/DebugPanel";

// Import customisation components
import { EditModePanel } from "../../features/customisation/EditModePanel";
import { useCustomisation } from "../../features/customisation/customisationStore";

// Import types from moodService
type MoodForecastResponse = import("../../services/moodService").MoodForecastResponse;
type MoodResonanceResponse = import("../../services/moodService").MoodResonanceResponse;
type MoodRecommendationsResponse = import("../../services/moodService").MoodRecommendationsResponse;

export function HomeHubFinal() {
  const { user, persona, refreshPersona } = useAuthStore();
  const navigate = useNavigate();
  const { games, actions } = useLibraryStore();
  const { integrations } = useGamePilotStore();
  const toast = useToast();
  
  // Get customisation settings for animation control
  const customisation = useCustomisation('home');
  const animationLevel = customisation?.animationLevel || 'medium';
  const backgroundMode = customisation?.backgroundMode || 'gradient';
  const accentColor = customisation?.accentColor || '#3b82f6';
  const density = customisation?.density || 'comfortable';
  const lightingMode = customisation?.lightingMode || 'none';

  // Animation configuration based on level
  const getAnimationConfig = () => {
    // Background animations are always disabled for accessibility and comfort
    return {
      enabled: false, // Always disabled - too hard on eyes
      duration: 0,
      repeat: 0,
      ease: "easeInOut" as const
    };
  };

  const animationConfig = getAnimationConfig();

  // Enhanced Mood System State
  const [showMoodSelector, setShowMoodSelector] = useState(false);
  const {
    primaryMood,
    secondaryMood,
    intensity,
    recommendations: moodRecommendations,
    isLoading: moodRecommendationsLoading,
    error: moodRecommendationsError,
    selectMood,
    clearMood,
    setIntensity,
    hasRecommendations: hasMoodRecommendations
  } = useNewMoodRecommendations({
    games: games || [],
    onRecommendationsChange: (recs) => {
      console.log('🎯 Enhanced mood recommendations updated:', recs.length);
    }
  });

  // Computed values
  const moodRecommendationCount = moodRecommendations.length;

  const handleMoodSelect = (primaryMood: MoodId, secondaryMood?: MoodId) => {
    selectMood(primaryMood, secondaryMood);
    setShowMoodSelector(false);
  };

  // Listen for mood changes from navigation
  useEffect(() => {
    const handleMoodChange = (event: CustomEvent) => {
      const { primaryMood, secondaryMood } = event.detail;
      handleMoodSelect(primaryMood, secondaryMood);
    };

    window.addEventListener('moodChanged', handleMoodChange as EventListener);
    return () => window.removeEventListener('moodChanged', handleMoodChange as EventListener);
  }, []);

  // Performance optimized loading state
  const [isLoading, setIsLoading] = useState(true);
  
  // Set loading to false after component mounts
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Surprise Me state
  const [showSurpriseSection, setShowSurpriseSection] = useState(false);
  
  // NEW: What To Play state
  const [showWhatToPlay, setShowWhatToPlay] = useState(false);
  
  // Get real-time persona updates
  const realtimePersona = usePersonaRealtime();
  
  // Get persona snapshot for fallback/computed data
  const personaSnapshot = usePersonaSnapshot();
  
  // Get persona-driven recommendation
  const personaRecommendation = usePersonaRecommendation();
  
  // Use real-time persona as primary source, fallback to auth store, then snapshot
  const currentPersona = realtimePersona.persona || persona || personaSnapshot;

  // NEW: Game handlers
  const handlePlayGame = (game: any) => {
    console.log(`Playing game: ${game.title}`);
    // TODO: Implement actual game launching logic
  };

  const handleStatusChange = (gameId: string, newStatus: string) => {
    actions.updateGameStatus(gameId, newStatus as any);
  };

  const handleEditGame = (game: any) => {
    navigate(`/library/game/${game.id}`);
  };

  const handleDeleteGame = (gameId: string) => {
    actions.deleteGame(gameId);
  };

  const handleQuickLaunch = (game: any) => {
    handlePlayGame(game);
  };

  // NEW: Generate persona context for enhanced recommendations
  const personaContext: PersonaContext | null = useMemo(() => {
    if (!currentPersona || !currentPersona.signals) return null;
    
    try {
      return generatePersonaContext(currentPersona.signals);
    } catch (error) {
      console.warn('Failed to generate persona context:', error);
      return null;
    }
  }, [currentPersona]);

  // NEW: Generate persona-enhanced recommendations
  const personaEnhancedRecommendations = useMemo(() => {
    if (!personaContext || !games || games.length === 0) return [];
    
    try {
      const userFilters: ContextualFilters = {
        selectedMoods: [], // No mood filter for persona recommendations
        selectedSessionLength: null, // Use persona preference
        timeOfDay: detectTimeOfDay() // Current time
      };
      
      const recommendations = getPersonaContextualMatches(
        games,
        personaContext,
        userFilters,
        { 
          personaWeight: 0.4, // Moderate persona influence
          limit: 10 
        }
      );
      
      console.log('🎯 Persona-enhanced recommendations:', {
        personaContext: {
          dominantMoods: personaContext.dominantMoods,
          preferredSessionLength: personaContext.preferredSessionLength,
          preferredTimesOfDay: personaContext.preferredTimesOfDay
        },
        recommendationCount: recommendations.length,
        topGames: recommendations.slice(0, 3).map(rec => 
          'game' in rec ? rec.game.title : rec.title
        )
      });
      
      // NEW: Track persona insights when recommendations are generated
      trackPersonaInsights(personaContext, recommendations.length);
      
      return recommendations;
    } catch (error) {
      console.warn('Failed to generate persona-enhanced recommendations:', error);
      return [];
    }
  }, [personaContext, games]);

  // Mock persona pipeline for demonstration
  const mockRaw: IdentityCore["raw"] = {
    steam: {
      games: (games || []) as any[], // Cast to shared Game type
      playtime: {},
      genres: {},
      achievements: {},
      sessions: []
    }
  };

  // Create real persona data using the Persona Engine
  const signals = buildPersonaSignals(mockRaw);
  const traits = buildPersonaTraits(signals);
  const mood = buildMoodState({
    sessionPattern: 0,
    genreShift: 0,
    playtimeSpike: 0,
    returnFrequency: 0,
    abandonmentRate: 0
  });
  const reflection = buildReflection(traits, mood);

  // Edit mode state
  const [isEditMode, setIsEditMode] = useState(false);

  // Mood Intelligence Dashboard state
  const [moodData, setMoodData] = useState<{
    forecast: MoodForecastResponse | null;
    recommendations: MoodRecommendationsResponse['recommendations'];
    resonance: MoodResonanceResponse | null;
    loading: boolean;
  }>({
    forecast: null,
    recommendations: [],
    resonance: null,
    loading: true
  });

  // Fetch mood data for the dashboard - reactive to persona changes
  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const userId = 'current-user';
        const [forecast, resonance, recommendations] = await Promise.all([
          moodService.getMoodForecast(userId),
          moodService.getMoodResonance(userId),
          moodService.getMoodRecommendations(userId)
        ]);

        setMoodData({
          forecast,
          resonance,
          recommendations: recommendations.recommendations.slice(0, 5),
          loading: false
        });
      } catch (error) {
        console.error('Failed to fetch mood data:', error);
        setMoodData(prev => ({ ...prev, loading: false }));
      }
    };

    fetchMoodData();
  }, [currentPersona]); // Re-fetch when persona changes

  // Refresh persona data when auth store persona changes
  useEffect(() => {
    if (persona && !personaSnapshot) {
      // Auth store has persona but snapshot doesn't, refresh to sync
      refreshPersona();
    }
  }, [persona, personaSnapshot, refreshPersona]);

  // Mock recently played data using games from library
  const recentlyPlayed = (games || [])?.slice(0, 5).map(game => ({
    appId: game?.id || '',
    name: game?.title || 'Unknown Game',
    headerImage: game?.coverImage || createApiUrl('/placeholder/cover/default.jpg'),
    playtimeRecent: Math.floor(Math.random() * 120), // Mock playtime
  }));

  // Helper functions that are still used
  const getRecentActivityItems = () => {
    return [
      { icon: '🎮', title: 'Played Hades', time: '2 hours ago' },
      { icon: '⭐', title: 'Unlocked achievement in Portal 2', time: '5 hours ago' },
      { icon: '📚', title: 'Added The Witcher 3 to library', time: '1 day ago' },
      { icon: '🏆', title: 'Completed Celeste', time: '2 days ago' },
      { icon: '🎯', title: 'New high score in Apex Legends', time: '3 days ago' }
    ];
  };

  const getContinuePlayingGames = () => {
    return games?.filter(game => 
      game.playStatus === 'playing' || 
      (game.hoursPlayed && game.hoursPlayed > 0 && game.hoursPlayed < 50)
    ).sort((a, b) => getTimeSafe(b.lastPlayed) - getTimeSafe(a.lastPlayed)) || [];
  };

  const LoadingSkeleton = ({ className = "" }: { className?: string }) => (
    <div className={`bg-gray-800/50 rounded-lg ${className}`} />
  );

  // Helper function to extract mood string from persona
  const getCurrentMoodString = () => {
    const mood = currentPersona?.mood;
    if (typeof mood === 'string') {
      return mood;
    }
    return mood?.moodId || 'neutral';
  };

  // Handle refresh for persona recommendation
  const handleRefreshRecommendation = () => {
    // Generate new recommendation with variety
    const moods = ['competitive', 'creative', 'relaxed', 'focused', 'social', 'adventurous'];
    const currentMood = getCurrentMoodString();
    
    // Create variation by temporarily modifying persona signals for refresh
    const alternativeMood = moods[Math.floor(Math.random() * moods.length)];
    const randomMultiplier = Math.random() * 0.3 + 0.7; // 0.7-1.0 for variation
    
    // Refresh mood data with new variations
    setMoodData(prev => ({
      ...prev,
      recommendations: prev.recommendations.map((rec, index) => ({
        ...rec,
        gameId: rec.gameId + '_refreshed_' + Date.now() + '_' + index,
        reasoning: `Updated recommendation based on ${Math.random() > 0.5 ? alternativeMood : currentMood} mood and your gaming patterns`,
        moodAlignment: Math.random() * 0.3 + 0.7 * randomMultiplier, // Add variation
        genreMatch: Math.random() * 0.4 + 0.6 * randomMultiplier // Add variation
      }))
    }));
    
    // Add a refresh timestamp to force persona recommendation recalculation
    const refreshKey = `refresh_${Date.now()}`;
    localStorage.setItem('persona_refresh_key', refreshKey);
    
    // Trigger persona refresh to get new recommendation
    refreshPersona();
    
    // Force re-render of WhatToBuy component by updating a state
    setTimeout(() => {
      // This will trigger the usePersonaRecommendation hook to recalculate
      window.dispatchEvent(new CustomEvent('persona-refreshed', { detail: { timestamp: Date.now() } }));
    }, 100);
  };

  // Handle launching games from Surprise Me
  const handleLaunchGame = async (gameId: string) => {
    console.log('🎮 Launching game:', gameId);
    
    try {
      // Find the game in the library
      const game = games?.find(g => g.id === gameId);
      if (!game) {
        console.error('Game not found:', gameId);
        alert('Game not found in library');
        return;
      }

      console.log(`🚀 Launching ${game.title}...`);
      
      // Try to extract Steam App ID from various sources
      let steamAppId: number | null = null;
      
      // Check if game has appId property
      if (game.appId && typeof game.appId === 'number') {
        steamAppId = game.appId;
      }
      // Check if game has steamUrl with app ID
      else if ((game as any).steamUrl) {
        const match = (game as any).steamUrl.match(/\/app\/(\d+)/);
        if (match) {
          steamAppId = parseInt(match[1]);
        }
      }
      // Check if game ID looks like a Steam app ID
      else if (/^\d+$/.test(gameId)) {
        steamAppId = parseInt(gameId);
      }

      if (steamAppId) {
        console.log(`🎮 Launching Steam game with App ID: ${steamAppId}`);
        launchGame(steamAppId);
        console.log('✅ Steam launch command sent');
      } else {
        // Fallback for non-Steam games
        console.log('📋 Non-Steam game detected, showing game info');
        alert(`Would launch: ${game.title}\n\nThis game doesn't have a Steam App ID configured.\n\nGame ID: ${gameId}\nSteam URL: ${(game as any).steamUrl || 'Not configured'}`);
      }
    } catch (error) {
      console.error('❌ Error launching game:', error);
      alert('Failed to launch game. Please check console for details.');
    }
  };

  return (
    <PageErrorBoundary>
      <div className={`min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker relative overflow-hidden transition-all duration-1000 ease-in-out ${
        density === 'compact' ? 'py-4' : 'py-8'
      }`}>
        {/* Static Background - All animations disabled */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          {/* Background is now completely static */}
        </div>
        
        {/* Main Content */}
        <div className={`relative z-10 ${
          density === 'compact' ? 'px-4' : 'px-8'
        }`}>
        
        {/* ENHANCED HERO SECTION */}
        <EnhancedHeroSection 
          user={user}
          games={games}
          currentPersona={currentPersona}
        />

        {/* GAMING IDENTITY */}
        <section className={`mb-6 ${
          density === 'compact' ? 'mb-4' : 'mb-6'
        }`}>
          <IdentityCard persona={reflection} />
          {/* Enhanced Persona Preview - Optional, only shows if enhanced insights available */}
          <EnhancedPersonaPreview enhancedInsights={undefined} />
        </section>

        {/* ENHANCED QUICK ACTIONS & RECENT ACTIVITY */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Enhanced Quick Actions Panel */}
          <div className="glass-morphism rounded-xl p-6 border border-white/10 relative overflow-hidden">
            <h3 className="text-lg font-gaming font-semibold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
              <div className="w-2 h-2 bg-gaming-primary rounded-full" />
              Quick Actions
            </h3>
            
            <div className="space-y-4">
              <button 
                onClick={() => window.location.href = '/library'}
                className="w-full px-6 py-3 bg-gradient-to-r from-gaming-primary/90 to-gaming-primary/80 text-white rounded-xl hover:from-gaming-primary hover:to-gaming-primary/90 transition-all duration-300 relative overflow-hidden group/btn flex items-center justify-between"
              >
                <span className="relative z-10 font-gaming text-xs uppercase tracking-widest flex items-center gap-2">
                  <span>🎮</span>
                  Add Games
                </span>
                <span className="text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity">
                  →
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              </button>
              <button 
                onClick={() => window.location.href = '/analytics'}
                className="w-full px-6 py-3 bg-gradient-to-r from-gaming-secondary/90 to-gaming-secondary/80 text-white rounded-xl hover:from-gaming-secondary hover:to-gaming-secondary/90 transition-all duration-300 relative overflow-hidden group/btn flex items-center justify-between"
              >
                <span className="relative z-10 font-gaming text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
                  View Stats
                </span>
                <span className="text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity">
                  →
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              </button>
              <button 
                onClick={() => setIsEditMode(true)}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600/90 to-purple-500/80 text-white rounded-xl hover:from-purple-600 hover:to-purple-500/90 transition-all duration-300 relative overflow-hidden group/btn flex items-center justify-between"
              >
                <span className="relative z-10 font-gaming text-xs uppercase tracking-widest flex items-center gap-2">
                  <span>✏️</span>
                  Customise Page
                </span>
                <span className="text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity">
                  →
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              </button>
              <button 
                onClick={() => window.location.href = '/settings'}
                className="w-full px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 hover:border-white/20 transition-all duration-300 relative overflow-hidden group/btn flex items-center justify-between"
              >
                <span className="relative z-10 font-gaming text-xs uppercase tracking-widest flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-current rounded" />
                  Settings
                </span>
                <span className="text-lg opacity-40 group-hover/btn:opacity-100 transition-opacity">
                  →
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
              </button>
            </div>
          </div>

          {/* Surprise Me Panel */}
          <div className="glass-morphism rounded-xl p-6 border border-green-500/30 relative overflow-hidden">
            <h3 className="text-lg font-gaming font-semibold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Surprise Me
            </h3>
            
            {showSurpriseSection ? (
              <div className="space-y-4">
                <SurpriseMeSection
                  games={games || []}
                  onLaunchGame={handleLaunchGame}
                />
                <button
                  onClick={() => setShowSurpriseSection(false)}
                  className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors text-sm font-gaming"
                >
                  ← Back
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="text-6xl animate-bounce">🎲</div>
                <div>
                  <h4 className="text-white font-gaming font-semibold mb-2">
                    Feeling adventurous?
                  </h4>
                  <p className="text-white/60 text-sm mb-4">
                    Discover something new based on your gaming patterns and current mood
                  </p>
                </div>
                <button
                  onClick={() => setShowSurpriseSection(true)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500/90 to-emerald-500/80 text-white rounded-xl font-gaming font-semibold hover:from-green-500 hover:to-emerald-500/90 transition-all duration-300 relative overflow-hidden group/btn"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>🎲</span>
                    Surprise Me Now
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                </button>
              </div>
            )}
          </div>

          {/* Enhanced Recent Activity Panel */}
          <div className="glass-morphism rounded-xl p-6 border border-white/10 relative overflow-hidden group">
            <h3 className="text-lg font-gaming font-semibold text-white mb-6 uppercase tracking-wider flex items-center gap-3">
              <div className="w-2 h-2 bg-gaming-secondary rounded-full" />
              Recent Activity
            </h3>
            <div className="space-y-3">
              {getRecentActivityItems().slice(0, 3).map((activity: any, index: number) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/5 transition-all duration-200 cursor-pointer group/item"
                >
                  <div className="text-2xl">
                    {activity.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{activity.title}</p>
                    <p className="text-white/40 text-xs">{activity.time}</p>
                  </div>
                  <div className="w-2 h-2 bg-gaming-secondary rounded-full opacity-0 group-hover/item:opacity-100" />
                </div>
              ))}
              
              {/* Show More Button */}
              <button
                onClick={() => window.location.href = '/analytics'}
                className="w-full mt-4 p-2 text-gaming-secondary hover:text-gaming-secondary/80 text-xs font-gaming uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                View All Activity
                <span>→</span>
              </button>
            </div>
          </div>
        </section>

        {/* NEW: PERSONA-ENHANCED RECOMMENDATIONS */}
        {personaContext && personaEnhancedRecommendations.length > 0 && (
          <section className="mb-8">
            <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
                    <span>🎯</span>
                    Games Chosen For You
                  </h2>
                  <p className="text-gray-300">
                    Based on your gaming habits, moods, and play patterns
                  </p>
                </div>
              </div>
              
              {/* NEW: Track when persona recommendations are shown */}
              {(() => {
                try {
                  trackRecommendationInteraction('persona', 'shown', {
                    count: personaEnhancedRecommendations.length,
                    dominantMoods: personaContext.dominantMoods,
                    preferredSessionLength: personaContext.preferredSessionLength,
                    preferredTimesOfDay: personaContext.preferredTimesOfDay
                  });
                } catch (error) {
                  // Fail silently
                }
                return null;
              })()}
              
              {/* Persona Summary */}
              <div className="mb-6 p-4 bg-black/20 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Dominant moods:</span>
                    <span className="text-white ml-2 font-medium">
                      {personaContext.dominantMoods.slice(0, 3).join(", ")}
                      {personaContext.dominantMoods.length > 3 && "..."}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Preferred session:</span>
                    <span className="text-white ml-2 font-medium capitalize">
                      {personaContext.preferredSessionLength}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Preferred times:</span>
                    <span className="text-white ml-2 font-medium">
                      {personaContext.preferredTimesOfDay.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              
              {/* Persona-Enhanced Games Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {personaEnhancedRecommendations.map((rec, index) => {
                  const game = 'game' in rec ? rec.game : rec;
                  return (
                    <div
                      key={game.id || index}
                      onClick={() => {
                        // NEW: Track persona recommendation click
                        trackRecommendationInteraction('persona', 'clicked', {
                          gameId: game.id,
                          dominantMoods: personaContext.dominantMoods,
                          personaWeight: 0.4
                        });
                        handleLaunchGame(game.id);
                      }}
                      className="group cursor-pointer transition-all duration-300 hover:scale-105"
                    >
                      <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-gray-800 to-gray-900">
                        {game.coverImage ? (
                          <img
                            src={game.coverImage}
                            alt={game.title}
                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                              <span className="text-xl">🎮</span>
                            </div>
                          </div>
                        )}
                        
                        {/* Overlay with persona info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-3">
                            <h4 className="text-white font-medium text-sm truncate mb-1">{game.title}</h4>
                            <div className="flex items-center gap-2 text-xs text-gray-300">
                              <span>🎯 Personalized</span>
                              {game.hoursPlayed && (
                                <span>📊 {game.hoursPlayed}h</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <h3 className="text-white text-sm font-medium mt-2 truncate group-hover:text-purple-400 transition-colors">
                        {game.title}
                      </h3>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ENHANCED MOOD SYSTEM */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 
              className="text-2xl font-gaming font-bold text-white uppercase tracking-tight flex items-center gap-4"
            >
              🎭 Enhanced Mood System
              <span className="h-[2px] flex-1 bg-gradient-to-r from-blue-500/40 to-transparent" />
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Mood Selector */}
            <div className="glass-morphism rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-gaming font-semibold text-white mb-4 uppercase tracking-wider">
                Select Your Mood
              </h3>
              <SimpleMoodSelector
                onMoodChange={handleMoodSelect}
                variant="compact"
              />
            </div>
            
            {/* What Should I Buy - Birthday Feature! */}
            <div className="mt-6">
              <EnhancedWhatToBuy 
                userMood={primaryMood}
                personaTraits={persona?.traits}
              />
            </div>
            
            {/* Mood Recommendations */}
            <div className="glass-morphism rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-gaming font-semibold text-white mb-4 uppercase tracking-wider">
                Mood Matches
              </h3>
              {hasMoodRecommendations ? (
                <div className="space-y-3">
                  {moodRecommendations.slice(0, 3).map((game) => (
                    <div 
                      key={game.id} 
                      className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/library/game/${game.id}`)}
                    >
                      <div className="w-10 h-10 bg-gaming-primary/20 rounded-lg flex items-center justify-center group-hover:bg-gaming-primary/30 transition-colors">
                        🎮
                      </div>
                      <div className="flex-1">
                        <p className="text-white text-sm font-medium group-hover:text-gaming-accent transition-colors">
                          {game.title}
                        </p>
                        <p className="text-white/40 text-xs">
                          {typeof game.genres?.[0] === 'string' 
                            ? game.genres[0] 
                            : game.genres?.[0]?.name || 'Unknown'
                          }
                        </p>
                      </div>
                      <div className="text-white/20 group-hover:text-white/40 transition-colors">
                        →
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/60 text-sm">Select a mood to see recommendations</p>
              )}
            </div>
            
            {/* Mood Stats */}
            <div className="glass-morphism rounded-xl p-6 border border-white/10">
              <h3 className="text-lg font-gaming font-semibold text-white mb-4 uppercase tracking-wider">
                Mood Analytics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Current Mood</span>
                  <span className="text-gaming-accent font-gaming text-sm">
                    {getCurrentMoodString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm">Recommendations</span>
                  <span className="text-gaming-secondary font-gaming text-sm">
                    {moodRecommendationCount}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTINUE PLAYING */}
        <section className="mb-8">
          <h2 
            className="text-2xl font-gaming font-bold text-white mb-8 uppercase tracking-tight flex items-center gap-4"
          >
            Continue Playing
            <span className="h-[2px] flex-1 bg-gradient-to-r from-gaming-primary/40 to-transparent" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {games
              .filter(game => game.playStatus === 'playing')
              .slice(0, 3)
              .map((game) => (
                <div
                  key={game.id}
                  onClick={() => handlePlayGame(game)}
                  className="glass-morphism rounded-lg p-4 border border-white/10 hover:scale-105 transition-transform cursor-pointer"
                >
                  <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                    {game.coverImage ? (
                      <img
                        src={game.coverImage}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                        <span className="text-2xl">🎮</span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-white font-semibold">{game.title}</h3>
                  <p className="text-white/60 text-sm">{game.hoursPlayed}h played</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-gaming-accent text-sm font-gaming">
                      {game.playStatus === 'playing' ? 'Playing' : 'Continue'}
                    </span>
                    <span className="text-white/40 text-xs">
                      {game.lastPlayed ? new Date(game.lastPlayed).toLocaleDateString() : 'Never'}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* NEW: I'm Not Sure What To Play */}
        <section className="mb-8">
          <div className="text-center">
            <button
              onClick={() => setShowWhatToPlay(true)}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 hover:from-purple-700 hover:via-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105"
            >
              <span className="text-2xl">🎯</span>
              <div className="text-left">
                <div className="text-xl font-bold">I'm Not Sure What To Play</div>
                <div className="text-sm opacity-90">Let GamePilot pick based on your mood, time, and play style</div>
              </div>
            </button>
          </div>
        </section>

        {/* NEW: What To Play Modal */}
        {showWhatToPlay && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="w-full max-w-4xl">
              <WhatToPlayNow onClose={() => setShowWhatToPlay(false)} />
            </div>
          </div>
        )}

        {/* DEBUG: Mood Filter Debug Component */}
        <MoodFilterDebug />

        {/* EDIT MODE PANEL */}
        {isEditMode && (
          <EditModePanel
            pageId="home"
            isOpen={isEditMode}
            onClose={() => setIsEditMode(false)}
          />
        )}
      </div>
    </div>
    </PageErrorBoundary>
  );
};

export default HomeHubFinal;

