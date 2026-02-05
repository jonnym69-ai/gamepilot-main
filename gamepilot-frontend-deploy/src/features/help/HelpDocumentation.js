"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
// Help Documentation System for GamePilot
const react_1 = require("react");
const HelpCard_1 = require("./HelpCard");
// Help Documentation Component
const HelpDocumentation = () => {
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [selectedCategory, setSelectedCategory] = (0, react_1.useState)('all');
    const [expandedTopics, setExpandedTopics] = (0, react_1.useState)(new Set());
    const helpTopics = [
        {
            id: 'getting-started',
            title: 'Getting Started with GamePilot',
            description: 'Learn the basics of GamePilot and set up your profile',
            content: `
# Getting Started with GamePilot

Welcome to GamePilot! This guide will help you get started with your personalized gaming experience.

## What is GamePilot?

GamePilot is your personal gaming companion that helps you:
- Discover new games based on your mood and preferences
- Track your gaming progress and achievements
- Connect with friends and share your experiences
- Get personalized recommendations

## First Steps

### 1. Complete Your Profile
- Add your display name and bio
- Select your favorite genres and platforms
- Set your gaming preferences

### 2. Connect Your Accounts
- Link Steam to import your game library
- Connect Discord for social features
- Add YouTube for gaming content

### 3. Explore Features
- Browse your game library
- Use the mood engine for recommendations
- Track your gaming statistics

## Tips for New Users

- Start with the mood selector to get personalized recommendations
- Import your existing game library from Steam
- Explore different moods to discover new games
- Join the community to share your experiences
      `,
            category: 'basics',
            tags: ['beginner', 'setup', 'profile'],
            relatedTopics: ['profile-setup', 'integrations', 'mood-engine']
        },
        {
            id: 'profile-setup',
            title: 'Setting Up Your Profile',
            description: 'Customize your profile and privacy settings',
            content: `
# Setting Up Your Profile

Your profile is your gaming identity on GamePilot. Here's how to make it yours.

## Profile Information

### Display Name
- Choose a name that represents you
- Can be changed anytime
- Visible to other users based on privacy settings

### Bio
- Share your gaming interests and background
- Tell others about your favorite genres
- Mention your gaming goals or preferences

### Avatar
- Upload a profile picture
- Choose from default avatars
- Can be changed anytime

## Privacy Settings

### Profile Visibility
- **Public**: Anyone can see your profile
- **Friends**: Only friends can see your profile
- **Private**: Only you can see your profile

### Data Sharing
- **Playtime Statistics**: Share your gaming hours
- **Achievements**: Show off your gaming accomplishments
- **Game Library**: Display your game collection

## Gaming Preferences

### Favorite Genres
Select genres you enjoy:
- Action, Adventure, RPG
- Strategy, Simulation, Sports
- Horror, Sci-Fi, Fantasy
- And many more!

### Preferred Platforms
Choose your gaming platforms:
- Steam, Epic Games, GOG
- Xbox, PlayStation, Nintendo Switch
- Mobile gaming

### Playstyle
Define your gaming style:
- Competitive, Casual
- Story-driven, Exploration
- Creative, Social
- Achievement Hunter, Completionist

## Tips

- Be honest about your preferences for better recommendations
- Update your profile as your interests change
- Use privacy settings to control what you share
      `,
            category: 'profile',
            tags: ['profile', 'privacy', 'preferences'],
            relatedTopics: ['getting-started', 'privacy-settings']
        },
        {
            id: 'mood-engine',
            title: 'Using the Mood Engine',
            description: 'Get personalized game recommendations based on your mood',
            content: `
# Using the Mood Engine

The Mood Engine is GamePilot's intelligent recommendation system that suggests games based on how you're feeling.

## What is the Mood Engine?

The Mood Engine analyzes your current mood and gaming preferences to recommend games that match your emotional state and playstyle.

## Available Moods

### 🎯 Competitive
- **Best for**: When you want to challenge yourself
- **Game types**: Competitive multiplayer, strategy games, FPS
- **Examples**: Valorant, Chess, StarCraft

### 🌿 Chill
- **Best for**: Relaxing and unwinding
- **Game types**: Casual games, simulation, creative
- **Examples**: Stardew Valley, Animal Crossing, Minecraft

### 📚 Story
- **Best for**: Immersive narratives
- **Game types**: RPGs, adventure games, visual novels
- **Examples**: The Witcher 3, Life is Strange, Detroit: Become Human

### 🎨 Creative
- **Best for**: Expressing creativity
- **Game types**: Building games, sandbox, art games
- **Examples**: Minecraft Dreams, LittleBigPlanet, Dreams

### 🌍 Social
- **Best for**: Playing with others
- **Game types**: Co-op games, party games, MMOs
- **Examples: Among Us, Fall Guys, World of Warcraft**

### 🏃 Focused
- **Best for**: Deep concentration
- **Game types**: Puzzle games, strategy, single-player
- **Examples**: Portal, Civilization, Factorio**

### ⚡ Energetic
- **Best for**: High-energy gaming
- **Game types**: Action games, rhythm games, sports
- **Examples**: DOOM, Beat Saber, FIFA

### 🔍 Exploratory
- **Best for**: Discovery and adventure
- **Game types**: Open-world, exploration, mystery
- **Examples**: Zelda, No Man's Sky, Outer Wilds

## How to Use

1. **Select Your Mood**: Choose how you're feeling right now
2. **Get Recommendations**: Receive personalized game suggestions
3. **Filter Results**: Narrow down by genre, platform, or features
4. **Save Favorites**: Keep track of games you want to play

## Tips

- Be honest about your current mood for better recommendations
- Try different moods to discover new games
- Combine moods with filters for precise results
- Save games you like to your wishlist

## Advanced Features

### Mood History
- Track your mood patterns over time
- See how your gaming preferences change
- Get insights into your gaming habits

### Mood-Based Stats
- View playtime by mood
- See which moods you game in most
- Discover your gaming patterns

### Social Moods
- See what moods your friends are in
- Join mood-based gaming sessions
- Share your mood with the community
      `,
            category: 'features',
            tags: ['recommendations', 'mood', 'discovery'],
            relatedTopics: ['game-discovery', 'recommendations', 'social-features']
        },
        {
            id: 'integrations',
            title: 'Connecting External Accounts',
            description: 'Link your gaming accounts for a complete experience',
            content: `
# Connecting External Accounts

Enhance your GamePilot experience by connecting your external gaming accounts.

## Supported Integrations

### 🎮 Steam
**What it does:**
- Imports your entire game library
- Tracks playtime and achievements
- Syncs game ownership status
- Provides game metadata and details

**How to connect:**
1. Go to Settings > Integrations
2. Click "Connect Steam"
3. Sign in with your Steam account
4. Authorize GamePilot access
5. Wait for library import

**Benefits:**
- Automatic game library updates
- Playtime tracking
- Achievement synchronization
- Rich game metadata

### 💬 Discord
**What it does:**
- Shows your Discord activity
- Displays gaming status
- Connects with Discord communities
- Enables social features

**How to connect:**
1. Go to Settings > Integrations
2. Click "Connect Discord"
3. Sign in with Discord
4. Authorize required permissions
5. Customize privacy settings

**Benefits:**
- See what friends are playing
- Join gaming communities
- Share your gaming status
- Discord rich presence

### 📺 YouTube
**What it does:**
- Imports gaming content
- Suggests relevant videos
- Tracks creator subscriptions
- Provides gaming news

**How to connect:**
1. Go to Settings > Integrations
2. Click "Connect YouTube"
3. Sign in with Google account
4. Authorize YouTube access
5. Select channels to follow

**Benefits:**
- Gaming content recommendations
- Creator suggestions
- Gaming news and updates
- Video integration

## Privacy & Security

### Data Protection
- All connections use secure OAuth
- Your passwords are never stored
- You control what data is shared
- Disconnect anytime

### Permission Control
- Choose what each integration can access
- Set privacy preferences per platform
- Control who sees your activity
- Manage data sharing settings

### Disconnecting Accounts
- Go to Settings > Integrations
- Click "Disconnect" next to any account
- Confirm the disconnection
- Data will be removed from GamePilot

## Troubleshooting

### Steam Issues
- **Library not importing**: Check Steam privacy settings
- **Missing games**: Ensure games are public in Steam
- **Sync errors**: Try reconnecting your account

### Discord Issues
- **Status not updating**: Check Discord permissions
- **Friends not showing**: Verify friend list visibility
- **Rich presence not working**: Enable Discord rich presence

### YouTube Issues
- **No content loading**: Check YouTube API limits
- **Channel not found**: Verify channel is public
- **Recommendations not working**: Update your preferences

## Best Practices

- Keep your accounts connected for the best experience
- Regularly review your privacy settings
- Disconnect accounts you no longer use
- Report any integration issues to support
      `,
            category: 'integrations',
            tags: ['steam', 'discord', 'youtube', 'connections'],
            relatedTopics: ['privacy-settings', 'profile-setup']
        },
        {
            id: 'game-library',
            title: 'Managing Your Game Library',
            description: 'Organize and manage your game collection',
            content: `
# Managing Your Game Library

Your game library is your personal gaming collection. Learn how to organize, manage, and get the most out of it.

## Adding Games

### Automatic Import
- **Steam**: Automatically imports your Steam library
- **Other platforms**: Manual import or API integration
- **Bulk import**: Add multiple games at once

### Manual Entry
1. Click "Add Game" in your library
2. Enter game details (title, platform, etc.)
3. Add cover art and metadata
4. Save to your library

### Game Metadata
- **Title**: The game's name
- **Platform**: Where you play it
- **Genre**: Game category
- **Release date**: When it was released
- **Developer**: Who made it
- **Cover art**: Game's box art or screenshot

## Organizing Games

### Collections
Create custom collections to organize your games:
- **Currently Playing**: Games you're actively playing
- **Completed**: Games you've finished
- **Backlog**: Games you want to play
- **Favorites**: Your most-loved games
- **Custom**: Create your own categories

### Tags
Add tags to games for better organization:
- **Genre tags**: RPG, FPS, Strategy, etc.
- **Mood tags**: Competitive, Relaxing, Story-driven
- **Status tags**: Playing, Completed, Paused
- **Custom tags**: Create your own tags

### Filtering & Sorting
- **Filter by**: Platform, genre, tags, status
- **Sort by**: Recently played, playtime, alphabetically
- **Search**: Find games by title or tags
- **Advanced filters**: Multiple criteria

## Game Status

### Play Status
- **Unplayed**: Haven't started yet
- **Playing**: Currently playing
- **Completed**: Finished the main story
- **Paused**: Taking a break
- **Dropped**: Won't continue playing

### Playtime Tracking
- **Total hours**: Overall time spent
- **Recent activity**: Last 30 days
- **Session history**: Individual gaming sessions
- **Platform breakdown**: Time per platform

### Achievements
- **Unlocked achievements**: What you've accomplished
- **Achievement progress**: How close to completion
- **Rare achievements**: Hard-to-unlock accomplishments
- **Platform achievements**: Per-platform tracking

## Library Features

### Quick Actions
- **Mark as playing**: Start tracking a game
- **Add to favorites**: Quick access to loved games
- **Set status**: Update your progress
- **Add notes**: Personal thoughts and reminders

### Bulk Operations
- **Bulk edit**: Update multiple games at once
- **Bulk tag**: Add tags to multiple games
- **Bulk status**: Update status for multiple games
- **Bulk delete**: Remove multiple games

### Statistics
- **Library size**: Total number of games
- **Playtime distribution**: Time spent per game
- **Platform breakdown**: Games per platform
- **Genre distribution**: Games by category

## Tips & Tricks

### Organization
- Use collections for different gaming goals
- Tag games with multiple categories
- Keep your status up to date
- Regularly review and clean up your library

### Discovery
- Use filters to find specific games
- Sort by playtime to see favorites
- Check unplayed games for new experiences
- Use mood-based recommendations

### Maintenance
- Regularly update game metadata
- Remove games you no longer own
- Keep tags consistent
- Backup your library data
      `,
            category: 'library',
            tags: ['games', 'organization', 'management'],
            relatedTopics: ['mood-engine', 'integrations']
        },
        {
            id: 'privacy-settings',
            title: 'Privacy and Security Settings',
            description: 'Control your data and privacy preferences',
            content: `
# Privacy and Security Settings

Your privacy is important. Learn how to control your data and secure your account.

## Privacy Controls

### Profile Visibility
Control who can see your profile information:
- **Public**: Anyone can view your profile
- **Friends**: Only approved friends can see your profile
- **Private**: Only you can see your profile

### Data Sharing
Choose what information to share:
- **Playtime Statistics**: Your gaming hours and habits
- **Achievements**: Games you've completed and accomplishments
- **Game Library**: Your game collection and ownership
- **Activity Status**: When you're playing and what games

### Social Features
Manage your social interactions:
- **Friend Requests**: Who can send you requests
- **Profile Views**: Who can see your profile visits
- **Activity Feed**: Share your gaming activity
- **Direct Messages**: Who can contact you

## Security Settings

### Account Security
- **Two-Factor Authentication**: Add an extra layer of security
- **Login Alerts**: Get notified of new sign-ins
- **Session Management**: Control active sessions
- **Password Requirements**: Set strong password policies

### Connected Accounts
- **Permissions**: Review what each integration can access
- **Data Sharing**: Control data shared with third parties
- **Disconnect Options**: Remove connected accounts anytime
- **Privacy Policies**: Review third-party privacy terms

### Data Management
- **Data Export**: Download your personal data
- **Data Deletion**: Remove your account and data
- **Data Retention**: How long we keep your data
- **Data Portability**: Move your data to other services

## Privacy Best Practices

### Profile Information
- Use a display name you're comfortable sharing
- Be mindful of what personal information you include
- Review your privacy settings regularly
- Consider using a separate gaming email

### Social Interactions
- Only accept friend requests from people you know
- Be cautious about sharing personal details
- Use privacy settings to control who can contact you
- Report inappropriate behavior

### Connected Accounts
- Only connect accounts you trust
- Review permissions carefully
- Disconnect accounts you no longer use
- Monitor third-party app access

## Security Tips

### Password Security
- Use a unique, strong password
- Enable two-factor authentication
- Don't reuse passwords from other sites
- Change your password regularly

### Session Management
- Sign out when using shared devices
- Review active sessions regularly
- Sign out unfamiliar sessions
- Use secure networks only

### Phishing Protection
- Never share your password via email
- Verify official communications
- Be wary of suspicious links
- Report phishing attempts

## Your Rights

### Data Access
- View all data we have about you
- Download your personal information
- Request corrections to inaccurate data
- Understand how your data is used

### Data Control
- Delete your account and data
- Opt out of data collection
- Control what's shared publicly
- Manage connected account permissions

### Transparency
- Clear privacy policy explanations
- Regular updates about changes
- Easy-to-understand settings
- Direct support for privacy questions

## Getting Help

### Privacy Questions
- Contact our privacy team
- Review our privacy policy
- Check our FAQ section
- Join our community discussions

### Security Issues
- Report security concerns immediately
- Use our secure reporting system
- Contact our security team
- Follow security best practices

Remember: You have control over your data. Take time to review your settings and make choices that work for you.
      `,
            category: 'privacy',
            tags: ['security', 'privacy', 'data-protection'],
            relatedTopics: ['profile-setup', 'integrations']
        }
    ];
    const categories = [
        { id: 'all', name: 'All Topics', icon: '📚' },
        { id: 'basics', name: 'Basics', icon: '🎯' },
        { id: 'profile', name: 'Profile', icon: '👤' },
        { id: 'features', name: 'Features', icon: '⚡' },
        { id: 'library', name: 'Library', icon: '🎮' },
        { id: 'integrations', name: 'Integrations', icon: '🔗' },
        { id: 'privacy', name: 'Privacy', icon: '🔒' }
    ];
    const filteredTopics = helpTopics.filter(topic => {
        const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            topic.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = selectedCategory === 'all' || topic.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });
    const toggleTopic = (topicId) => {
        setExpandedTopics(prev => {
            const newSet = new Set(prev);
            if (newSet.has(topicId)) {
                newSet.delete(topicId);
            }
            else {
                newSet.add(topicId);
            }
            return newSet;
        });
    };
    const renderMarkdown = (content) => {
        return content.split('\n').map((line, index) => {
            if (line.startsWith('# ')) {
                return (0, jsx_runtime_1.jsx)("h2", { className: "text-2xl font-bold text-white mb-4 mt-6", children: line.slice(2) }, index);
            }
            else if (line.startsWith('## ')) {
                return (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-3 mt-4", children: line.slice(3) }, index);
            }
            else if (line.startsWith('### ')) {
                return (0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-medium text-white mb-2 mt-3", children: line.slice(4) }, index);
            }
            else if (line.startsWith('- **')) {
                const match = line.match(/- \*\*(.*?)\*\*: (.*)/);
                if (match) {
                    return ((0, jsx_runtime_1.jsxs)("li", { className: "ml-4 mb-2", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-semibold text-purple-300", children: [match[1], ":"] }), " ", match[2]] }, index));
                }
            }
            else if (line.startsWith('- ')) {
                return (0, jsx_runtime_1.jsx)("li", { className: "ml-4 mb-2", children: line.slice(2) }, index);
            }
            else if (line.startsWith('**') && line.endsWith('**')) {
                return (0, jsx_runtime_1.jsx)("p", { className: "font-semibold text-purple-300 mb-2", children: line.slice(2, -2) }, index);
            }
            else if (line.trim() === '') {
                return (0, jsx_runtime_1.jsx)("br", {}, index);
            }
            else {
                return (0, jsx_runtime_1.jsx)("p", { className: "mb-2 text-white/80", children: line }, index);
            }
        });
    };
    return ((0, jsx_runtime_1.jsx)("div", { className: "min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6", children: (0, jsx_runtime_1.jsxs)("div", { className: "max-w-6xl mx-auto", children: [(0, jsx_runtime_1.jsxs)("div", { className: "text-center mb-8", children: [(0, jsx_runtime_1.jsx)("h1", { className: "text-4xl font-bold text-white mb-4", children: "Help Center" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70", children: "Find answers to your questions and learn how to get the most out of GamePilot" })] }), (0, jsx_runtime_1.jsx)("div", { className: "mb-8", children: (0, jsx_runtime_1.jsxs)("div", { className: "bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-6", children: [(0, jsx_runtime_1.jsx)("div", { className: "mb-4", children: (0, jsx_runtime_1.jsx)("input", { type: "text", placeholder: "Search for help topics...", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value), className: "w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40" }) }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: categories.map(category => ((0, jsx_runtime_1.jsxs)("button", { onClick: () => setSelectedCategory(category.id), className: `px-4 py-2 rounded-lg border transition-colors ${selectedCategory === category.id
                                        ? 'bg-purple-500/20 border-purple-500 text-purple-300'
                                        : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'}`, children: [(0, jsx_runtime_1.jsx)("span", { className: "mr-2", children: category.icon }), category.name] }, category.id))) })] }) }), (0, jsx_runtime_1.jsx)("div", { className: "space-y-4", children: filteredTopics.map(topic => ((0, jsx_runtime_1.jsxs)(HelpCard_1.HelpCard, { className: "bg-white/10 backdrop-blur-md border-white/20 p-6", children: [(0, jsx_runtime_1.jsxs)("div", { className: "cursor-pointer", onClick: () => toggleTopic(topic.id), children: [(0, jsx_runtime_1.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white", children: topic.title }), (0, jsx_runtime_1.jsx)("span", { className: "text-white/60", children: expandedTopics.has(topic.id) ? '▼' : '▶' })] }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70 mb-3", children: topic.description }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2 mb-3", children: topic.tags.map(tag => ((0, jsx_runtime_1.jsx)("span", { className: "px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm", children: tag }, tag))) })] }), expandedTopics.has(topic.id) && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-4 pt-4 border-t border-white/20", children: [(0, jsx_runtime_1.jsx)("div", { className: "prose prose-invert max-w-none", children: renderMarkdown(topic.content) }), topic.relatedTopics && topic.relatedTopics.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-6 pt-4 border-t border-white/20", children: [(0, jsx_runtime_1.jsx)("h4", { className: "text-lg font-medium text-white mb-3", children: "Related Topics" }), (0, jsx_runtime_1.jsx)("div", { className: "flex flex-wrap gap-2", children: topic.relatedTopics.map(relatedId => {
                                                    const relatedTopic = helpTopics.find(t => t.id === relatedId);
                                                    return relatedTopic ? ((0, jsx_runtime_1.jsx)("button", { onClick: () => toggleTopic(relatedId), className: "px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg hover:bg-blue-500/30 transition-colors", children: relatedTopic.title }, relatedId)) : null;
                                                }) })] }))] }))] }, topic.id))) }), filteredTopics.length === 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "text-center py-12", children: [(0, jsx_runtime_1.jsx)("div", { className: "text-6xl mb-4", children: "\uD83D\uDD0D" }), (0, jsx_runtime_1.jsx)("h3", { className: "text-xl font-semibold text-white mb-2", children: "No topics found" }), (0, jsx_runtime_1.jsx)("p", { className: "text-white/70", children: "Try adjusting your search or filters" })] }))] }) }));
};
exports.default = HelpDocumentation;
