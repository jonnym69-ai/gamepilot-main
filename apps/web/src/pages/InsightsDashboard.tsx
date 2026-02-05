import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RecommendationTuningPanel } from '../components/RecommendationTuningPanel';
import { apiFetch } from '../config/api';

// Types for analytics data
interface AnalyticsEvent {
  name: string;
  payload: Record<string, any>;
  timestamp: string;
  url: string;
}

interface AnalyticsStats {
  contextualShown: number;
  personaShown: number;
  contextualClicked: number;
  personaClicked: number;
  sessionLengthUsage: Record<string, number>;
  moodUsage: Record<string, number>;
  timeOfDayUsage: Record<string, number>;
  personaEffectiveness: Record<string, { impressions: number; clicks: number }>;
}

// Simple chart components
const BarChart: React.FC<{ data: Record<string, number>; title: string; color?: string }> = ({ 
  data, title, color = '#3b82f6' 
}) => {
  const maxValue = Math.max(...Object.values(data));
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex items-center gap-2">
            <span className="text-gray-300 text-sm w-24 truncate">{key}</span>
            <div className="flex-1 bg-gray-700 rounded-full h-4 relative overflow-hidden">
              <div 
                className="h-full transition-all duration-300"
                style={{ 
                  width: `${(value / maxValue) * 100}%`,
                  backgroundColor: color 
                }}
              />
            </div>
            <span className="text-gray-300 text-sm w-8 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const PieChart: React.FC<{ data: Record<string, number>; title: string }> = ({ data, title }) => {
  const total = Object.values(data).reduce((sum, val) => sum + val, 0);
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value], index) => {
          const percentage = total > 0 ? (value / total) * 100 : 0;
          return (
            <div key={key} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-gray-300 text-sm flex-1">{key}</span>
              <span className="text-gray-300 text-sm">{percentage.toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const LineChart: React.FC<{ data: Record<string, number>; title: string }> = ({ data, title }) => {
  const maxValue = Math.max(...Object.values(data));
  const timeSlots = ['morning', 'afternoon', 'evening', 'late-night'];
  
  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
      <h3 className="text-white font-semibold mb-3">{title}</h3>
      <div className="flex items-end justify-between h-32 gap-2">
        {timeSlots.map(slot => {
          const value = data[slot] || 0;
          const height = maxValue > 0 ? (value / maxValue) * 100 : 0;
          return (
            <div key={slot} className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-700 rounded-t relative">
                <div 
                  className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t transition-all duration-300"
                  style={{ height: `${height}%` }}
                />
              </div>
              <span className="text-gray-400 text-xs mt-1">{slot}</span>
              <span className="text-gray-300 text-xs">{value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export const InsightsDashboard: React.FC = () => {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [stats, setStats] = useState<AnalyticsStats>({
    contextualShown: 0,
    personaShown: 0,
    contextualClicked: 0,
    personaClicked: 0,
    sessionLengthUsage: {},
    moodUsage: {},
    timeOfDayUsage: {},
    personaEffectiveness: {}
  });

  // Load analytics data from backend
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const response = await apiFetch('api/analytics/events?limit=100');
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setEvents(result.data);
            
            // Recompute stats from real events
            const newStats: AnalyticsStats = {
              contextualShown: 0,
              personaShown: 0,
              contextualClicked: 0,
              personaClicked: 0,
              sessionLengthUsage: {},
              moodUsage: {},
              timeOfDayUsage: {},
              personaEffectiveness: {}
            };

            result.data.forEach((event: any) => {
              if (event.name === 'recommendation_shown') {
                if (event.payload.type === 'contextual') newStats.contextualShown++;
                else if (event.payload.type === 'persona') newStats.personaShown++;
              } else if (event.name === 'recommendation_clicked') {
                if (event.payload.type === 'contextual') newStats.contextualClicked++;
                else if (event.payload.type === 'persona') newStats.personaClicked++;
                
                if (event.payload.gameId) {
                  const gameId = event.payload.gameId;
                  if (!newStats.personaEffectiveness[gameId]) {
                    newStats.personaEffectiveness[gameId] = { impressions: 0, clicks: 0 };
                  }
                  newStats.personaEffectiveness[gameId].clicks++;
                }
              } else if (event.name === 'mood_selected') {
                const mood = event.payload.moodId || event.payload.mood;
                if (mood) {
                  newStats.moodUsage[mood] = (newStats.moodUsage[mood] || 0) + 1;
                }
              }
            });

            setStats(newStats);
          }
        }
      } catch (error) {
        console.warn('Failed to load analytics data from backend:', error);
      }
    };

    loadAnalytics();
    const interval = setInterval(loadAnalytics, 10000);
    return () => clearInterval(interval);
  }, []);

  // Calculate derived metrics
  const contextualCTR = stats.contextualShown > 0 
    ? (stats.contextualClicked / stats.contextualShown * 100).toFixed(1)
    : '0.0';
    
  const personaCTR = stats.personaShown > 0 
    ? (stats.personaClicked / stats.personaShown * 100).toFixed(1)
    : '0.0';

  // Clear analytics data
  const clearAnalytics = () => {
    localStorage.removeItem('analytics_events');
    localStorage.removeItem('analytics_stats');
    setEvents([]);
    setStats({
      contextualShown: 0,
      personaShown: 0,
      contextualClicked: 0,
      personaClicked: 0,
      sessionLengthUsage: {},
      moodUsage: {},
      timeOfDayUsage: {},
      personaEffectiveness: {}
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">📊 Insights Dashboard</h1>
              <p className="text-gray-300">
                Real-time analytics for contextual and persona recommendation systems
              </p>
            </div>
            <div className="flex gap-4">
              <Link 
                to="/"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                ← Back to Home
              </Link>
              <button 
                onClick={clearAnalytics}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Clear Data
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-gray-300 text-sm mb-2">Contextual Shown</h3>
            <p className="text-3xl font-bold text-white">{stats.contextualShown}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-gray-300 text-sm mb-2">Contextual CTR</h3>
            <p className="text-3xl font-bold text-green-400">{contextualCTR}%</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-gray-300 text-sm mb-2">Persona Shown</h3>
            <p className="text-3xl font-bold text-white">{stats.personaShown}</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
            <h3 className="text-gray-300 text-sm mb-2">Persona CTR</h3>
            <p className="text-3xl font-bold text-purple-400">{personaCTR}%</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BarChart 
            data={stats.moodUsage} 
            title="Most Selected Moods" 
            color="#8b5cf6"
          />
          <PieChart 
            data={stats.sessionLengthUsage} 
            title="Session Length Distribution" 
          />
          <LineChart 
            data={stats.timeOfDayUsage} 
            title="Time-of-Day Engagement" 
          />
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
            <h3 className="text-white font-semibold mb-3">Persona Effectiveness</h3>
            <div className="space-y-2">
              {Object.entries(stats.personaEffectiveness).map(([gameId, data]) => (
                <div key={gameId} className="flex items-center justify-between">
                  <span className="text-gray-300 text-sm truncate flex-1">{gameId}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-xs">{data.impressions} imp</span>
                    <span className="text-gray-400 text-xs">{data.clicks} clicks</span>
                    <span className="text-green-400 text-sm font-medium">
                      {data.impressions > 0 ? (data.clicks / data.impressions * 100).toFixed(1) : 0}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* NEW: Recommendation Tuning Panel */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-8">
            <RecommendationTuningPanel />
          </div>
        )}

        {/* Live Event Stream */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-4">Live Event Stream (Last 20)</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {events.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No events recorded yet</p>
            ) : (
              events.slice(-20).reverse().map((event, index) => (
                <div key={index} className="bg-black/20 rounded p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-blue-400 font-medium">{event.name}</span>
                    <span className="text-gray-400 text-xs">
                      {new Date(event.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <pre className="text-gray-300 text-xs overflow-x-auto">
                    {JSON.stringify(event.payload, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
