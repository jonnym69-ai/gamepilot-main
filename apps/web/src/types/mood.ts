export type Mood = 'Chill' | 'Competitive' | 'Story' | 'Creative' | 'Social' | 'Dark' | 'Fast-Paced'

export interface GameMoodTag {
  gameId: string
  moods: Mood[]
}
