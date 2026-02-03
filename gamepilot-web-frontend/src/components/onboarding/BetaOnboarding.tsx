import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from '../Toast'

interface BetaOnboardingProps {
  onComplete: () => void
  skipOnboarding: boolean
}

export const BetaOnboarding: React.FC<BetaOnboardingProps> = ({ onComplete, skipOnboarding }) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<string[]>([])
  const navigate = useNavigate()

  const onboardingSteps = [
    {
      id: 'welcome',
      title: 'Welcome to GamePilot Beta! 🎮',
      description: 'Thank you for joining our beta program! You\'re among the first to experience the future of game discovery.',
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🚀</div>
          <p className="text-gray-300">
            GamePilot uses AI to understand your gaming mood and recommend the perfect games from your library.
          </p>
          <div className="bg-blue-900/30 border border-blue-500/30 rounded-lg p-4">
            <h4 className="text-blue-400 font-semibold mb-2">Beta Features:</h4>
            <ul className="text-left text-sm space-y-1">
              <li>✨ Steam library integration</li>
              <li>🎭 Mood-based recommendations</li>
              <li>📊 Gaming analytics dashboard</li>
              <li>🔗 Multi-platform support</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'steam-integration',
      title: 'Connect Your Steam Library 🎮',
      description: 'Import your Steam games to get personalized recommendations based on your gaming mood.',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-4">🎮</div>
            <p className="text-gray-300 mb-4">
              Connect your Steam account to import your game library and unlock personalized recommendations.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Why connect Steam?</h4>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>• Import your entire game library automatically</li>
              <li>• Get mood-based game recommendations</li>
              <li>• Track your gaming habits and patterns</li>
              <li>• Discover hidden gems in your collection</li>
            </ul>
          </div>
          <button
            onClick={() => {
              navigate('/library')
              toast.info('Click "Import Steam" in your library to connect!')
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Connect Steam Library
          </button>
        </div>
      )
    },
    {
      id: 'mood-recommendations',
      title: 'Discover Games by Mood 🎭',
      description: 'Tell us how you feel and we\'ll recommend the perfect games for your current mood.',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-4">🎭</div>
            <p className="text-gray-300 mb-4">
              Our AI analyzes your gaming preferences and current mood to suggest the perfect games.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { mood: 'Chill', emoji: '😌', color: 'bg-green-600' },
              { mood: 'Competitive', emoji: '🔥', color: 'bg-red-600' },
              { mood: 'Story', emoji: '📚', color: 'bg-purple-600' },
              { mood: 'Creative', emoji: '🎨', color: 'bg-yellow-600' }
            ].map(({ mood, emoji, color }) => (
              <div key={mood} className={`${color} rounded-lg p-3 text-center`}>
                <div className="text-2xl mb-1">{emoji}</div>
                <div className="text-sm font-semibold">{mood}</div>
              </div>
            ))}
          </div>
          <button
            onClick={() => navigate('/recommendations')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            Try Mood Recommendations
          </button>
        </div>
      )
    },
    {
      id: 'feedback',
      title: 'Help Us Improve! 📝',
      description: 'Your feedback is crucial for shaping the future of GamePilot.',
      content: (
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-5xl mb-4">💬</div>
            <p className="text-gray-300 mb-4">
              As a beta tester, your feedback helps us build the best game discovery platform.
            </p>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <h4 className="text-white font-semibold mb-2">Ways to provide feedback:</h4>
            <ul className="text-sm space-y-2 text-gray-300">
              <li>• Use the in-app feedback button</li>
              <li>• Report bugs and issues</li>
              <li>• Suggest new features</li>
              <li>• Share your experience on social media</li>
            </ul>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                toast.info('Feedback button will be available in the app!')
              }}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Give Feedback
            </button>
            <button
              onClick={() => window.open('https://github.com/gamepilot/gamepilot/issues', '_blank')}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Report Bug
            </button>
          </div>
        </div>
      )
    },
    {
      id: 'complete',
      title: 'You\'re All Set! 🎉',
      description: 'Welcome to the GamePilot beta. Let\'s discover some amazing games!',
      content: (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">Beta Setup Complete!</h3>
          <p className="text-gray-300 mb-6">
            You're now ready to explore GamePilot. Here are some quick actions to get you started:
          </p>
          <div className="grid grid-cols-1 gap-3">
            <button
              onClick={() => navigate('/library')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              📚 View My Library
            </button>
            <button
              onClick={() => navigate('/recommendations')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              🎭 Get Recommendations
            </button>
            <button
              onClick={() => navigate('/analytics')}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              📊 View Analytics
            </button>
          </div>
          <div className="mt-6 p-4 bg-yellow-900/30 border border-yellow-500/30 rounded-lg">
            <p className="text-yellow-400 text-sm">
              <strong>Beta Tip:</strong> Check back regularly for new features and improvements!
            </p>
          </div>
        </div>
      )
    }
  ]

  useEffect(() => {
    if (skipOnboarding) {
      onComplete()
      return
    }
  }, [skipOnboarding, onComplete])

  const handleNext = () => {
    const currentStepId = onboardingSteps[currentStep].id
    if (!completedSteps.includes(currentStepId)) {
      setCompletedSteps([...completedSteps, currentStepId])
    }

    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
      toast.success('Welcome to GamePilot Beta! 🎮')
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    onComplete()
    toast.info('Onboarding skipped. You can always access it later!')
  }

  if (skipOnboarding) {
    return null
  }

  const currentStepData = onboardingSteps[currentStep]
  const progress = ((currentStep + 1) / onboardingSteps.length) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-400">
              Step {currentStep + 1} of {onboardingSteps.length}
            </span>
            <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Onboarding Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-8 border border-gray-700">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              {currentStepData.title}
            </h2>
            <p className="text-gray-300">
              {currentStepData.description}
            </p>
          </div>

          <div className="mb-8">
            {currentStepData.content}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {currentStep > 0 && (
              <button
                onClick={handlePrevious}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-semibold rounded-lg transition-colors"
              >
                Previous
              </button>
            )}
            
            <button
              onClick={handleSkip}
              className="px-6 py-3 text-gray-400 hover:text-white font-semibold transition-colors"
            >
              Skip Onboarding
            </button>

            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
            </button>
          </div>
        </div>

        {/* Beta Badge */}
        <div className="mt-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-900/30 border border-yellow-500/30 rounded-full">
            <span className="text-yellow-400 text-sm font-semibold">BETA</span>
            <span className="text-yellow-400 text-sm">v1.0</span>
          </div>
        </div>
      </div>
    </div>
  )
}
