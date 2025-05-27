import type { QuestionItem, GameState } from '../types/quiz';

export class GameManager {
  private questionBank: QuestionItem[] = [];
  private gameState: GameState;
  private timer?: NodeJS.Timeout;

  constructor() {
    this.gameState = {
      score: 0,
      timeLeft: 60,
      nickname: '',
      duration: 60,
      timeTrack: '',
      isPlaying: false,
      totalQuestions: 0,
      correctAnswers: 0
    };
  }

  // 预加载资源
  async preloadAssets(): Promise<void> {
    if (window._questionBank) {
      this.questionBank = window._questionBank;
      return;
    }

    try {
      const response = await fetch('/question_bank.json');
      this.questionBank = await response.json();
      window._questionBank = this.questionBank;

      // 预加载图片（并行加载，增加超时处理）
      if (!window._preloadedImages) {
        window._preloadedImages = [];
        const imagePromises = this.questionBank.map((item) => {
          return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => {
              console.warn(`Failed to load image: ${item.image}`);
              resolve(img); // 即使失败也继续，不阻塞整体加载
            };
            img.src = item.image;
            
            // 3秒超时
            setTimeout(() => {
              if (!img.complete) {
                console.warn(`Image load timeout: ${item.image}`);
                resolve(img);
              }
            }, 3000);
          });
        });
        window._preloadedImages = await Promise.all(imagePromises);
      }

      // 预加载音频（快速加载策略）
      if (!window._preloadedAudios) {
        window._preloadedAudios = [];
        const audioPromises = this.questionBank.map((item) => {
          return new Promise<HTMLAudioElement>((resolve) => {
            const audio = new Audio();
            audio.preload = 'metadata'; // 只预加载元数据，更快
            audio.onloadedmetadata = () => resolve(audio);
            audio.onerror = () => {
              console.warn(`Failed to load audio: ${item.audio}`);
              resolve(audio); // 即使失败也继续
            };
            audio.src = item.audio;
            
            // 2秒超时
            setTimeout(() => {
              resolve(audio);
            }, 2000);
          });
        });
        window._preloadedAudios = await Promise.all(audioPromises);
      }
    } catch (error) {
      console.error('Failed to preload assets:', error);
      throw error;
    }
  }

  // 随机选择题目
  getRandomSample<T>(arr: T[], count: number): T[] {
    const copy = [...arr];
    const result: T[] = [];
    while (result.length < count && copy.length) {
      const i = Math.floor(Math.random() * copy.length);
      result.push(copy.splice(i, 1)[0]);
    }
    return result;
  }

  // 生成新题目
  generateQuestion(): { choices: QuestionItem[], answerIndex: number, answer: QuestionItem } {
    const choices = this.getRandomSample(this.questionBank, 4);
    const answerIndex = Math.floor(Math.random() * 4);
    const answer = choices[answerIndex];
    
    this.gameState.currentQuestion = answer;
    return { choices, answerIndex, answer };
  }

  // 保存游戏状态到 localStorage
  saveGameState(): void {
    localStorage.setItem('score', this.gameState.score.toString());
    localStorage.setItem('timeLeft', this.gameState.timeLeft.toString());
    localStorage.setItem('nickname', this.gameState.nickname);
    localStorage.setItem('duration', this.gameState.duration.toString());
    localStorage.setItem('timeTrack', this.gameState.timeTrack);
    localStorage.setItem('totalQuestions', this.gameState.totalQuestions.toString());
    localStorage.setItem('correctAnswers', this.gameState.correctAnswers.toString());
  }

  // 从 localStorage 加载游戏状态
  loadGameState(): void {
    this.gameState.score = parseInt(localStorage.getItem('score') || '0');
    this.gameState.duration = parseInt(localStorage.getItem('duration') || '60');
    this.gameState.timeLeft = parseInt(localStorage.getItem('timeLeft') || this.gameState.duration.toString());
    this.gameState.nickname = localStorage.getItem('nickname') || '';
    this.gameState.timeTrack = localStorage.getItem('timeTrack') || '';
    this.gameState.totalQuestions = parseInt(localStorage.getItem('totalQuestions') || '0');
    this.gameState.correctAnswers = parseInt(localStorage.getItem('correctAnswers') || '0');
    
    // 如果没有保存的时间剩余，使用完整时长
    if (!localStorage.getItem('timeLeft')) {
      this.gameState.timeLeft = this.gameState.duration;
    }
  }

  // 开始计时器
  startTimer(onTick: (timeLeft: number) => void, onEnd: () => void): void {
    if (this.timer) {
      clearInterval(this.timer);
    }

    this.timer = setInterval(() => {
      this.gameState.timeLeft--;
      onTick(this.gameState.timeLeft);
      this.saveGameState();

      if (this.gameState.timeLeft <= 0) {
        this.stopTimer();
        onEnd();
      }
    }, 1000);
  }

  // 停止计时器
  stopTimer(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }

  // 更新分数
  updateScore(correct: boolean): void {
    this.gameState.totalQuestions++;
    if (correct) {
      this.gameState.score++;
      this.gameState.correctAnswers++;
    } else {
      this.gameState.score--;
    }
    this.saveGameState();
  }

  // 获取当前游戏状态
  getGameState(): GameState {
    return { ...this.gameState };
  }

  // 重置游戏
  resetGame(): void {
    this.stopTimer();
    this.gameState = {
      score: 0,
      timeLeft: this.gameState.duration,
      nickname: this.gameState.nickname,
      duration: this.gameState.duration,
      timeTrack: this.gameState.timeTrack,
      isPlaying: false,
      totalQuestions: 0,
      correctAnswers: 0
    };
    this.saveGameState();
  }
} 