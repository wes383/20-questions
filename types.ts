export enum GameState {
  STARTING = 'STARTING',
  PLAYING = 'PLAYING',
  WON = 'WON',
  LOST = 'LOST',
}

export interface GeminiResponse {
  type: 'guess_correct' | 'guess_incorrect' | 'question_answer';
  response: string;
}
