/**
 * Launches a game through Steam using the steam:// protocol
 * @param appId - The Steam application ID to launch
 */
export function launchGame(appId: number): void {
  if (!appId || typeof appId !== 'number' || appId <= 0) {
    console.warn('Invalid appId provided for game launch:', appId)
    return
  }

  try {
    window.location.href = `steam://run/${appId}`
  } catch (error) {
    console.warn('Steam launch failed — is Steam installed?', error)
  }
}
