import React, { useRef, useState } from 'react';
import type { PersonaContext } from '../utils/contextualEngine';
import type { ContextualMatch } from '../utils/contextualEngine';

interface IdentityShareCardProps {
  personaContext?: PersonaContext;
  identityNarrative?: string;
  identityDefiningGames?: ContextualMatch[];
  className?: string;
}

// Mood icons mapping
const moodIcons: Record<string, string> = {
  'chill': '😌',
  'creative': '🎨',
  'competitive': '⚔️',
  'focused': '🎯',
  'intense': '🔥',
  'cozy': '🏠',
  'exploration': '🗺️',
  'puzzle': '🧩',
  'social': '👥',
  'immersive': '🌟',
  'relaxed': '🧘',
  'energetic': '⚡',
  'strategic': '♟️',
  'adventurous': '🚀',
  'mysterious': '🌙',
  'playful': '🎮'
};

// Session length icons
const sessionIcons: Record<string, string> = {
  'short': '⏱️',
  'medium': '⏰',
  'long': '⏳'
};

// Time of day icons
const timeIcons: Record<string, string> = {
  'morning': '🌅',
  'afternoon': '☀️',
  'evening': '🌆',
  'late-night': '🌙'
};

// Play pattern icons
const patternIcons: Record<string, string> = {
  'completionist': '🏆',
  'explorer': '🗺️',
  'strategist': '♟️',
  'social': '👥',
  'casual': '😊',
  'competitive': '⚔️',
  'collector': '💎',
  'speedrunner': '⚡'
};

export const IdentityShareCard: React.FC<IdentityShareCardProps> = ({
  personaContext,
  identityNarrative,
  identityDefiningGames,
  className = ''
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // Extract key data
  const dominantMoods = personaContext?.dominantMoods?.slice(0, 4) || [];
  const preferredSession = personaContext?.preferredSessionLength || 'medium';
  const preferredTimes = personaContext?.preferredTimesOfDay?.slice(0, 2) || [];
  const playPatterns = personaContext?.recentPlayPatterns?.slice(0, 3) || [];
  const topGames = identityDefiningGames?.slice(0, 4) || [];

  // Shorten narrative for card
  const shortNarrative = identityNarrative 
    ? identityNarrative.split('.').filter(Boolean).slice(0, 2).join('. ') + '.'
    : 'Your unique gaming identity awaits discovery.';

  return (
    <div 
      ref={cardRef}
      className={`identity-share-card ${className}`}
      style={{
        width: '400px',
        height: '600px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '32px',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
      }}
    >
      {/* Background pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        pointerEvents: 'none'
      }} />

      {/* Header */}
      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: 'bold', 
          margin: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          My Gaming Identity
        </h1>
        <div style={{ 
          fontSize: '14px', 
          opacity: 0.9,
          marginTop: '8px'
        }}>
          Generated with GamePilot
        </div>
      </div>

      {/* Dominant Moods */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '12px',
          opacity: 0.95
        }}>
          Gaming Moods
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {dominantMoods.map(mood => (
            <div key={mood} style={{
              background: 'rgba(255,255,255,0.2)',
              padding: '6px 12px',
              borderRadius: '20px',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)'
            }}>
              <span>{moodIcons[mood.toLowerCase()] || '🎮'}</span>
              <span>{mood}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gaming Preferences */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '12px',
          opacity: 0.95
        }}>
          Gaming Preferences
        </h3>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>
              {sessionIcons[preferredSession] || '⏰'}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Session Length
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {preferredSession}
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', marginBottom: '4px' }}>
              {preferredTimes.map(time => timeIcons[time.toLowerCase()] || '🌅').join(' ')}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.8 }}>
              Peak Times
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600' }}>
              {preferredTimes.join(', ')}
            </div>
          </div>
        </div>
      </div>

      {/* Play Patterns */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '12px',
          opacity: 0.95
        }}>
          Play Style
        </h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {playPatterns.map(pattern => (
            <div key={pattern} style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '8px 12px',
              borderRadius: '12px',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              backdropFilter: 'blur(10px)'
            }}>
              <span>{patternIcons[pattern.toLowerCase()] || '🎮'}</span>
              <span>{pattern}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Gaming Narrative */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '12px',
          opacity: 0.95
        }}>
          My Gaming Story
        </h3>
        <p style={{ 
          fontSize: '14px', 
          lineHeight: '1.5',
          opacity: 0.9,
          fontStyle: 'italic',
          background: 'rgba(255,255,255,0.1)',
          padding: '12px',
          borderRadius: '12px',
          backdropFilter: 'blur(10px)'
        }}>
          "{shortNarrative}"
        </p>
      </div>

      {/* Top Games */}
      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ 
          fontSize: '16px', 
          fontWeight: '600', 
          marginBottom: '12px',
          opacity: 0.95
        }}>
          Games That Define Me
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {topGames.map((match, index) => (
            <div key={match.game.id} style={{
              background: 'rgba(255,255,255,0.1)',
              padding: '8px 12px',
              borderRadius: '8px',
              fontSize: '13px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backdropFilter: 'blur(10px)'
            }}>
              <span>{index + 1}. {match.game.title}</span>
              <span style={{ 
                fontSize: '11px', 
                opacity: 0.8,
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                {match.score.toFixed(1)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ 
        position: 'absolute',
        bottom: '16px',
        right: '16px',
        fontSize: '10px',
        opacity: 0.7,
        textAlign: 'right'
      }}>
        <div>Generated on {new Date().toLocaleDateString()}</div>
        <div>gamepilot.app</div>
      </div>
    </div>
  );
};
