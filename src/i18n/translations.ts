export const translations = {
  zh: {
    // 通用
    title: "山海经答题",
    player: "选手",
    loading: "加载中...",
    restart: "重新开始",
    
    // 首页
    enterNickname: "请输入昵称",
    nicknamePlaceholder: "你的昵称",
    selectTime: "选择答题时间",
    seconds: "秒",
    minutes: "分钟",
    startQuiz: "开始答题",
    pleaseEnterNickname: "请输入昵称",
    
    // 答题页
    ready: "准备好了吗？",
    startDescription: "点击按钮开始答题并播放音频",
    startAnswering: "开始答题",
    whoIs: "谁是",
    replayAudio: "🔁 重播音频",
    timeLeft: "⏳",
    score: "✅ 得分：",
    
    // 结果页
    quizEnd: "🎉 答题结束",
    yourScore: "你的得分"
  },
  en: {
    // Common
    title: "Brainrot Quiz",
    player: "Player",
    loading: "Loading...",
    restart: "Restart",
    
    // Home page
    enterNickname: "Enter your nickname",
    nicknamePlaceholder: "Your nickname",
    selectTime: "Select quiz duration",
    seconds: "seconds",
    minutes: "minutes",
    startQuiz: "Start Quiz",
    pleaseEnterNickname: "Please enter your nickname",
    
    // Quiz page
    ready: "Ready?",
    startDescription: "Click the button to start and play audio",
    startAnswering: "Start Quiz",
    whoIs: "Who is",
    replayAudio: "🔁 Replay Audio",
    timeLeft: "⏳",
    score: "✅ Score:",
    
    // Result page
    quizEnd: "🎉 Quiz Complete",
    yourScore: "Your Score"
  }
};

export type Language = keyof typeof translations; 