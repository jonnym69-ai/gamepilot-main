import React, { useState, useRef } from 'react';
import { useCustomisation, useCustomisationActions, Theme, BackgroundMode, AnimationLevel, Density, LightingMode, BoxShape, ComponentStyle, FontFamily, FontSize, SoundTheme, AnimationStyle } from './customisationStore';

export const CustomisationPage: React.FC = () => {
  const globalSettings = useCustomisation();
  const { setGlobalSettings } = useCustomisationActions();
  
  // Tab state
  const [activeTab, setActiveTab] = useState('global');
  
  // Local state for form inputs
  const [tempImageUrl, setTempImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'global', label: '🌍 Global Settings', icon: '🌍' },
    { id: 'pages', label: '📄 Page Specific', icon: '📄' },
    { id: 'presets', label: '🎮 Gaming Presets', icon: '🎮' },
    { id: 'themes', label: '🎨 Themes & Backgrounds', icon: '🎨' },
    { id: 'advanced', label: '🔧 Advanced', icon: '🔧' },
  ];

  // Handlers (simplified for brevity)
  const handleFontFamilyChange = (fontFamily: FontFamily) => setGlobalSettings({ fontFamily });
  const handleFontSizeChange = (fontSize: FontSize) => setGlobalSettings({ fontSize });
  const handleFontWeightChange = (value: number) => setGlobalSettings({ fontWeight: value });
  const handleAnimationStyleChange = (style: AnimationStyle) => setGlobalSettings({ animationStyle: style });
  const handleHoverEffectsToggle = (enabled: boolean) => setGlobalSettings({ hoverEffects: enabled });
  const handleLoadingAnimationsToggle = (enabled: boolean) => setGlobalSettings({ loadingAnimations: enabled });
  const handleSoundThemeChange = (theme: SoundTheme) => setGlobalSettings({ soundTheme: theme });
  const handleSoundEnabledToggle = (enabled: boolean) => setGlobalSettings({ soundEnabled: enabled });
  const handleVolumeChange = (value: number) => setGlobalSettings({ volume: value });
  const handleThemeChange = (theme: Theme) => setGlobalSettings({ theme });
  const handleBackgroundModeChange = (mode: BackgroundMode) => setGlobalSettings({ backgroundMode: mode });
  const handleAccentColorChange = (color: string) => setGlobalSettings({ accentColor: color });
  const handleBoxShapeChange = (shape: BoxShape) => setGlobalSettings({ defaultBoxShape: shape });
  const handleComponentStyleChange = (style: ComponentStyle) => setGlobalSettings({ defaultComponentStyle: style });
  const handleBorderRadiusChange = (value: number) => setGlobalSettings({ borderRadius: value });
  const handleBorderWidthChange = (value: number) => setGlobalSettings({ borderWidth: value });
  const handleShadowIntensityChange = (value: number) => setGlobalSettings({ shadowIntensity: value });
  const handleGlassOpacityChange = (value: number) => setGlobalSettings({ glassOpacity: value });
  const handleAnimationLevelChange = (level: AnimationLevel) => setGlobalSettings({ animationLevel: level });
  const handleDensityChange = (density: Density) => setGlobalSettings({ density });
  const handleLightingModeChange = (mode: LightingMode) => setGlobalSettings({ lightingMode: mode });
  const handleRgbSyncToggle = (enabled: boolean) => setGlobalSettings({ rgbSyncEnabled: enabled });

  // File upload handlers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setGlobalSettings({ backgroundImageUrl: dataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackgroundImageSubmit = () => {
    if (tempImageUrl.trim()) {
      setGlobalSettings({ backgroundImageUrl: tempImageUrl.trim() });
      setTempImageUrl('');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gaming-dark via-gray-900 to-gaming-darker">
      <div className="container mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-4 bg-gradient-to-r from-gaming-primary to-gaming-secondary bg-clip-text text-transparent">Customisation</h1>
              <p className="text-gray-400 text-lg">Personalise your GamePilot experience</p>
            </div>
            
            {/* Page Editor Button */}
            <button
              onClick={() => alert('Page editor coming soon! This will allow you to customize the customisation page layout itself.')}
              className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200 font-medium flex items-center gap-2 shadow-lg"
            >
              <span>🎨</span>
              <span>Edit Page</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-gaming-primary text-white shadow-lg shadow-gaming-primary/30'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {/* Global Settings Tab */}
          {activeTab === 'global' && (
            <>
              {/* Typography Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Typography</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Font Family</h3>
                    <div className="space-y-2">
                      {(['inter', 'jetbrains-mono', 'space-mono', 'roboto', 'open-sans', 'poppins'] as FontFamily[]).map((font) => (
                        <button
                          key={font}
                          onClick={() => handleFontFamilyChange(font)}
                          className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                            globalSettings.fontFamily === font
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <span className="text-white capitalize" style={{ fontFamily: font === 'jetbrains-mono' ? 'monospace' : font === 'space-mono' ? 'monospace' : 'sans-serif' }}>
                            {font.replace('-', ' ')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Font Size</h3>
                    <div className="space-y-2">
                      {(['xs', 'sm', 'base', 'lg', 'xl', '2xl'] as FontSize[]).map((size) => (
                        <button
                          key={size}
                          onClick={() => handleFontSizeChange(size)}
                          className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                            globalSettings.fontSize === size
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white capitalize">{size}</span>
                            <span className="text-gray-400 text-xs">
                              {size === 'xs' ? '12px' : size === 'sm' ? '14px' : size === 'base' ? '16px' : size === 'lg' ? '18px' : size === 'xl' ? '20px' : '24px'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Font Weight</h3>
                    <div className="space-y-4">
                      <input
                        type="range"
                        min="100"
                        max="900"
                        step="100"
                        value={globalSettings.fontWeight}
                        onChange={(e) => handleFontWeightChange(Number(e.target.value))}
                        className="w-full"
                      />
                      <div className="text-center text-gray-400 text-sm">{globalSettings.fontWeight}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Animations Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Enhanced Animations</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Animation Style</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(['smooth', 'bounce', 'slide', 'fade', 'glow'] as AnimationStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => handleAnimationStyleChange(style)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                            globalSettings.animationStyle === style
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-4 h-4 ${
                              style === 'smooth' ? 'rounded-full bg-gaming-primary/20' :
                              style === 'bounce' ? 'rounded-full bg-gaming-primary/40 animate-bounce' :
                              style === 'slide' ? 'rounded bg-gaming-primary/20' :
                              style === 'fade' ? 'rounded bg-gaming-primary/10' :
                              'rounded-full bg-gaming-primary/30 shadow-lg shadow-gaming-primary/50'
                            }`}></div>
                            <span className="text-xs text-white capitalize">{style}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Animation Effects</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Hover Effects</p>
                          <p className="text-gray-400 text-sm">Interactive hover animations</p>
                        </div>
                        <button
                          onClick={() => handleHoverEffectsToggle(!globalSettings.hoverEffects)}
                          className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                            globalSettings.hoverEffects ? 'bg-gaming-primary' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            globalSettings.hoverEffects ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Loading Animations</p>
                          <p className="text-gray-400 text-sm">Spinners and loading effects</p>
                        </div>
                        <button
                          onClick={() => handleLoadingAnimationsToggle(!globalSettings.loadingAnimations)}
                          className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                            globalSettings.loadingAnimations ? 'bg-gaming-primary' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            globalSettings.loadingAnimations ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sound Themes Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Sound Themes</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Sound Theme</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(['cyberpunk', 'retro', 'minimal', 'epic', 'nature'] as SoundTheme[]).map((theme) => (
                        <button
                          key={theme}
                          onClick={() => handleSoundThemeChange(theme)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                            globalSettings.soundTheme === theme
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-4 h-4 rounded-full ${
                              theme === 'cyberpunk' ? 'bg-pink-500' :
                              theme === 'retro' ? 'bg-amber-500' :
                              theme === 'minimal' ? 'bg-gray-500' :
                              theme === 'epic' ? 'bg-purple-500' :
                              'bg-green-500'
                            }`}></div>
                            <span className="text-xs text-white capitalize">{theme}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Sound Settings</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">Enable Sounds</p>
                          <p className="text-gray-400 text-sm">UI interaction sounds</p>
                        </div>
                        <button
                          onClick={() => handleSoundEnabledToggle(!globalSettings.soundEnabled)}
                          className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                            globalSettings.soundEnabled ? 'bg-gaming-primary' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            globalSettings.soundEnabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                      
                      <div>
                        <label className="text-white text-sm font-medium mb-2 block">Volume</label>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={globalSettings.volume}
                          onChange={(e) => handleVolumeChange(Number(e.target.value))}
                          className="w-full"
                        />
                        <div className="text-center text-gray-400 text-xs mt-1">{globalSettings.volume}%</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Gaming Presets Tab */}
          {activeTab === 'presets' && (
            <div className="glass-morphism rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                <h2 className="text-xl font-semibold text-white">Gaming Presets</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => {
                    setGlobalSettings({
                      accentColor: '#ec4899',
                      backgroundMode: 'gradient',
                      animationLevel: 'high',
                      lightingMode: 'mood',
                      animationStyle: 'glow',
                      hoverEffects: true,
                      soundTheme: 'cyberpunk'
                    });
                  }}
                  className="p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
                    <span className="text-white font-medium">Cyberpunk</span>
                    <span className="text-gray-400 text-xs">Neon pink & purple</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGlobalSettings({
                      accentColor: '#f59e0b',
                      backgroundMode: 'solid',
                      animationLevel: 'low',
                      lightingMode: 'none',
                      animationStyle: 'bounce',
                      hoverEffects: false,
                      soundTheme: 'retro'
                    });
                  }}
                  className="p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"></div>
                    <span className="text-white font-medium">Retro</span>
                    <span className="text-gray-400 text-xs">Classic amber tones</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGlobalSettings({
                      accentColor: '#6b7280',
                      backgroundMode: 'solid',
                      animationLevel: 'low',
                      lightingMode: 'none',
                      animationStyle: 'smooth',
                      hoverEffects: false,
                      soundTheme: 'minimal'
                    });
                  }}
                  className="p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-500 to-gray-600 rounded-full"></div>
                    <span className="text-white font-medium">Minimal</span>
                    <span className="text-gray-400 text-xs">Clean & simple</span>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setGlobalSettings({
                      accentColor: '#10b981',
                      backgroundMode: 'gradient',
                      animationLevel: 'medium',
                      lightingMode: 'mood',
                      animationStyle: 'fade',
                      hoverEffects: true,
                      soundTheme: 'nature'
                    });
                  }}
                  className="p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full"></div>
                    <span className="text-white font-medium">Nature</span>
                    <span className="text-gray-400 text-xs">Calming greens</span>
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* Page Specific Tab */}
          {activeTab === 'pages' && (
            <div className="glass-morphism rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                <h2 className="text-xl font-semibold text-white">Page-Specific Overrides</h2>
              </div>
              
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">📄</div>
                <p className="text-xl text-white mb-2">Page-Specific Customisation</p>
                <p className="text-gray-400">Override global settings for specific pages</p>
                <p className="text-gray-500 text-sm mt-4">This feature allows you to customize individual pages differently from your global settings.</p>
              </div>
            </div>
          )}

          {/* Themes & Backgrounds Tab */}
          {activeTab === 'themes' && (
            <>
              {/* Theme Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10 mb-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Theme</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {(['dark', 'light', 'system'] as Theme[]).map((theme) => (
                    <button
                      key={theme}
                      onClick={() => handleThemeChange(theme)}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                        globalSettings.theme === theme
                          ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                          theme === 'dark' ? 'bg-gray-900' : 
                          theme === 'light' ? 'bg-gray-100' : 
                          'bg-gradient-to-r from-gray-900 to-gray-100'
                        }`} />
                        <span className="text-white capitalize">{theme}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Background Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10 mb-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Background</h2>
                </div>
                
                {/* Background Mode */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-white mb-4">Background Mode</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {(['solid', 'gradient', 'image'] as BackgroundMode[]).map((mode) => (
                      <button
                        key={mode}
                        onClick={() => handleBackgroundModeChange(mode)}
                        className={`p-4 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                          globalSettings.backgroundMode === mode
                            ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                            : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 rounded-full transition-all duration-300 ${
                            mode === 'solid' ? 'bg-gray-700' : 
                            mode === 'gradient' ? 'bg-gradient-to-r from-blue-500 to-purple-500' : 
                            'bg-gray-600'
                          }`} />
                          <span className="text-white capitalize">{mode}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Background Image */}
                {globalSettings.backgroundMode === 'image' && (
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Background Image</h3>
                    
                    {/* File Upload */}
                    <div className="mb-4">
                      <div className="flex gap-4 mb-4">
                        <input
                          type="file"
                          ref={fileInputRef}
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="px-4 py-2 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-gaming-primary/30"
                        >
                          📁 Choose File
                        </button>
                      </div>
                      
                      <div className="flex gap-4">
                        <input
                          type="text"
                          value={tempImageUrl}
                          onChange={(e) => setTempImageUrl(e.target.value)}
                          placeholder="Or enter image URL..."
                          className="flex-1 px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gaming-primary focus:outline-none focus:ring-2 focus:ring-gaming-primary/20 transition-all duration-300"
                        />
                        <button
                          onClick={handleBackgroundImageSubmit}
                          className="px-6 py-3 bg-gaming-primary text-white rounded-lg hover:bg-gaming-primary/80 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-gaming-primary/30"
                        >
                          Set URL
                        </button>
                      </div>
                    </div>
                    
                    {globalSettings.backgroundImageUrl && (
                      <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-white/5">
                        <p className="text-gray-300 text-sm mb-2">Current background:</p>
                        <div className="flex items-center gap-4">
                          <div 
                            className="w-16 h-16 rounded-lg bg-cover bg-center border border-white/20"
                            style={{ backgroundImage: `url(${globalSettings.backgroundImageUrl})` }}
                          />
                          <div className="flex-1">
                            <p className="text-gaming-primary text-sm truncate">{globalSettings.backgroundImageUrl}</p>
                            <button
                              onClick={() => setGlobalSettings({ backgroundImageUrl: undefined })}
                              className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Accent Color Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-semibold text-white mb-6">Accent Color</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {[
                    '#3b82f6', // gaming-primary blue
                    '#8b5cf6', // purple
                    '#10b981', // emerald
                    '#f59e0b', // amber
                    '#ef4444', // red
                    '#ec4899', // pink
                    '#06b6d4', // cyan
                    '#84cc16', // lime
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleAccentColorChange(color)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        globalSettings.accentColor === color
                          ? 'border-white scale-105'
                          : 'border-gray-600 hover:border-gray-500'
                      }`}
                      style={{ backgroundColor: color }}
                      title={`Select ${color} as accent color`}
                      aria-label={`Select ${color} as accent color`}
                    >
                      {globalSettings.accentColor === color && (
                        <div className="w-6 h-6 bg-white rounded-full mx-auto" />
                      )}
                    </button>
                  ))}
                </div>
                
                {/* Custom Color Picker */}
                <div className="flex gap-4">
                  <input
                    type="color"
                    value={globalSettings.accentColor}
                    onChange={(e) => handleAccentColorChange(e.target.value)}
                    className="w-16 h-10 bg-gray-800/50 border border-gray-600 rounded cursor-pointer"
                    title="Choose custom accent color"
                    aria-label="Choose custom accent color"
                  />
                  <input
                    type="text"
                    value={globalSettings.accentColor}
                    onChange={(e) => handleAccentColorChange(e.target.value)}
                    placeholder="#3b82f6"
                    className="flex-1 px-4 py-2 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-gaming-primary focus:outline-none"
                    aria-label="Enter custom hex color code"
                  />
                </div>
              </div>
            </>
          )}

          {/* Advanced Tab */}
          {activeTab === 'advanced' && (
            <>
              {/* Advanced Shape & Style Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10 mb-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Advanced Shapes & Styles</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Box Shapes */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Default Box Shape</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {(['rounded', 'square', 'hexagon', 'octagon', 'diamond', 'pill', 'circle'] as BoxShape[]).map((shape) => (
                        <button
                          key={shape}
                          onClick={() => handleBoxShapeChange(shape)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                            globalSettings.defaultBoxShape === shape
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 ${
                              shape === 'square' ? '' :
                              shape === 'rounded' ? 'rounded-lg' :
                              shape === 'circle' ? 'rounded-full' :
                              shape === 'hexagon' ? 'rotate-45' :
                              shape === 'diamond' ? 'rotate-45' :
                              shape === 'pill' ? 'rounded-full' : ''
                            } bg-gaming-primary/20`}></div>
                            <span className="text-xs text-white capitalize">{shape}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Component Styles */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Component Style</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(['glass-morphism', 'solid', 'outline', 'neon', 'minimal'] as ComponentStyle[]).map((style) => (
                        <button
                          key={style}
                          onClick={() => handleComponentStyleChange(style)}
                          className={`p-3 rounded-lg border-2 transition-all duration-300 hover:scale-[1.02] ${
                            globalSettings.defaultComponentStyle === style
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <div className={`w-6 h-6 ${
                              style === 'glass-morphism' ? 'bg-white/10 backdrop-blur-sm' :
                              style === 'solid' ? 'bg-gray-700' :
                              style === 'outline' ? 'border-2 border-gaming-primary' :
                              style === 'neon' ? 'bg-transparent border-2 border-gaming-primary shadow-lg shadow-gaming-primary/50' :
                              'bg-transparent border border-gray-600'
                            }`}></div>
                            <span className="text-xs text-white capitalize">{style.replace('-', ' ')}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Fine Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                  {/* Border Radius */}
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Border Radius</label>
                    <input
                      type="range"
                      min="0"
                      max="50"
                      value={globalSettings.borderRadius}
                      onChange={(e) => handleBorderRadiusChange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-gray-400 text-xs mt-1">{globalSettings.borderRadius}px</div>
                  </div>

                  {/* Border Width */}
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Border Width</label>
                    <input
                      type="range"
                      min="0"
                      max="10"
                      value={globalSettings.borderWidth}
                      onChange={(e) => handleBorderWidthChange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-gray-400 text-xs mt-1">{globalSettings.borderWidth}px</div>
                  </div>

                  {/* Shadow Intensity */}
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Shadow Intensity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={globalSettings.shadowIntensity}
                      onChange={(e) => handleShadowIntensityChange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-gray-400 text-xs mt-1">{globalSettings.shadowIntensity}%</div>
                  </div>

                  {/* Glass Opacity */}
                  <div>
                    <label className="text-white text-sm font-medium mb-2 block">Glass Opacity</label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={globalSettings.glassOpacity}
                      onChange={(e) => handleGlassOpacityChange(Number(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-center text-gray-400 text-xs mt-1">{globalSettings.glassOpacity}%</div>
                  </div>
                </div>
              </div>

              {/* Motion & Density Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10 mb-8 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Motion & Density</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Animation Level */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Animation Level</h3>
                    <div className="space-y-2">
                      {(['low', 'medium', 'high'] as AnimationLevel[]).map((level) => (
                        <button
                          key={level}
                          onClick={() => handleAnimationLevelChange(level)}
                          className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                            globalSettings.animationLevel === level
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white capitalize">{level}</span>
                            <span className="text-gray-400 text-xs">
                              {level === 'low' ? 'Minimal animations' : 
                               level === 'medium' ? 'Balanced animations' : 
                               'Full animations'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Density */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Layout Density</h3>
                    <div className="space-y-2">
                      {(['compact', 'comfortable'] as Density[]).map((density) => (
                        <button
                          key={density}
                          onClick={() => handleDensityChange(density)}
                          className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                            globalSettings.density === density
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white capitalize">{density}</span>
                            <span className="text-gray-400 text-xs">
                              {density === 'compact' ? 'Tight spacing' : 'Comfortable spacing'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lighting & RGB Section */}
              <div className="glass-morphism rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                  <h2 className="text-xl font-semibold text-white">Lighting & RGB</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Lighting Mode */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">Lighting Mode</h3>
                    <div className="space-y-2">
                      {(['none', 'ambient', 'mood'] as LightingMode[]).map((mode) => (
                        <button
                          key={mode}
                          onClick={() => handleLightingModeChange(mode)}
                          className={`w-full p-3 rounded-lg border-2 transition-all duration-300 text-left hover:scale-[1.02] ${
                            globalSettings.lightingMode === mode
                              ? 'border-gaming-primary bg-gaming-primary/20 shadow-lg shadow-gaming-primary/30'
                              : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white capitalize">{mode}</span>
                            <span className="text-gray-400 text-xs">
                              {mode === 'none' ? 'No lighting effects' : 
                               mode === 'ambient' ? 'Subtle ambient light' : 
                               mode === 'mood' ? 'Dynamic mood lighting' : 'Unknown mode'}
                            </span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* RGB Sync */}
                  <div>
                    <h3 className="text-lg font-medium text-white mb-4">RGB Sync</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
                        <div>
                          <p className="text-white font-medium">RGB Sync</p>
                          <p className="text-gray-400 text-sm">Sync with RGB devices</p>
                        </div>
                        <button
                          onClick={() => handleRgbSyncToggle(!globalSettings.rgbSyncEnabled)}
                          className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                            globalSettings.rgbSyncEnabled ? 'bg-gaming-primary' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-200 ${
                            globalSettings.rgbSyncEnabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Page Specific Tab */}
          {activeTab === 'pages' && (
            <div className="glass-morphism rounded-xl p-6 border border-white/10 hover:shadow-lg transition-all duration-300">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-1 h-6 bg-gradient-to-b from-gaming-primary to-gaming-secondary rounded-full"></div>
                <h2 className="text-xl font-semibold text-white">Page-Specific Overrides</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { id: 'home', name: 'Home', icon: '🏠', description: 'Dashboard and quick actions' },
                  { id: 'library', name: 'Library', icon: '📚', description: 'Game collection management' },
                  { id: 'identity', name: 'Identity', icon: '👤', description: 'Gaming profile and stats' },
                  { id: 'recommendations', name: 'Recommendations', icon: '🎯', description: 'Personalized game suggestions' },
                  { id: 'integrations', name: 'Integrations', icon: '🔗', description: 'Connected platforms' },
                  { id: 'settings', name: 'Settings', icon: '⚙️', description: 'App configuration' },
                ].map((page) => (
                  <div key={page.id} className="p-4 bg-gray-800/50 rounded-lg border border-gray-600 hover:border-gaming-primary/50 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-2xl">{page.icon}</div>
                      <h3 className="text-white font-medium">{page.name}</h3>
                    </div>
                    <p className="text-gray-400 text-sm mb-4">{page.description}</p>
                    <button
                      onClick={() => alert(`Page-specific customisation for ${page.name} coming soon!`)}
                      className="w-full px-3 py-2 bg-gaming-primary/20 border border-gaming-primary/50 text-gaming-primary rounded-lg hover:bg-gaming-primary/30 transition-colors text-sm"
                    >
                      Customize {page.name}
                    </button>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg border border-purple-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <div className="text-2xl">🎨</div>
                  <h3 className="text-white font-medium">Page-Specific Customisation</h3>
                </div>
                <p className="text-gray-300 mb-4">Override global settings for specific pages to create unique experiences throughout your GamePilot interface.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Different themes per page</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Unique layouts and components</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Page-specific animations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-300">Custom color schemes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
