export interface QuestionItem {
  name: string;
  image: string;
  audio: string;
}

export interface GameState {
  score: number;
  timeLeft: number;
  nickname: string;
  duration: number;
  timeTrack: string;
  currentQuestion?: QuestionItem;
  isPlaying: boolean;
  totalQuestions: number;
  correctAnswers: number;
}

// 扩展 Window 接口以支持缓存
declare global {
  interface Window {
    _preloadedImages?: HTMLImageElement[];
    _preloadedAudios?: HTMLAudioElement[];
    _questionBank?: QuestionItem[];
  }
} 