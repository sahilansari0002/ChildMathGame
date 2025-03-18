// Generate a unique ID
export function generateUniqueId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Format time from seconds to MM:SS
export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Calculate level from XP
export function calculateLevel(xp: number): number {
  return 1 + Math.floor(xp / 100);
}

// Calculate XP needed for next level
export function xpForNextLevel(level: number): number {
  return level * 100;
}

// Calculate progress percentage to next level
export function levelProgress(xp: number): number {
  const currentLevel = calculateLevel(xp);
  const xpForCurrentLevel = (currentLevel - 1) * 100;
  const xpForNext = currentLevel * 100;
  const xpInCurrentLevel = xp - xpForCurrentLevel;
  const xpNeededForNextLevel = xpForNext - xpForCurrentLevel;
  
  return Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100);
}

// Shuffle an array
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Speech synthesis for voice assistance
export function speak(text: string, language: string = 'en-IN'): void {
  if (!('speechSynthesis' in window)) {
    console.error('Speech synthesis not supported');
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language;
  utterance.rate = 0.9; // Slightly slower for children
  utterance.pitch = 1.1; // Slightly higher pitch for children
  
  window.speechSynthesis.speak(utterance);
}

// Speech recognition for voice commands
export function startSpeechRecognition(
  onResult: (text: string) => void,
  onError: (error: any) => void,
  language: string = 'en-IN'
): { stop: () => void } {
  if (!('webkitSpeechRecognition' in window)) {
    onError('Speech recognition not supported');
    return { stop: () => {} };
  }
  
  // @ts-ignore - webkitSpeechRecognition is not in the TypeScript types
  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = language;
  
  recognition.onresult = (event: any) => {
    const text = event.results[0][0].transcript;
    onResult(text);
  };
  
  recognition.onerror = onError;
  
  recognition.start();
  
  return {
    stop: () => recognition.stop(),
  };
}

// Translate text based on language
export function translateText(text: string, language: string): string {
  // In a real app, this would use a translation API or a dictionary
  // For this demo, we'll use a simple mapping for a few common phrases
  
  const translations: Record<string, Record<string, string>> = {
    'hindi': {
      'Correct!': 'सही!',
      'Wrong!': 'गलत!',
      'Try again': 'फिर से प्रयास करें',
      'Next': 'अगला',
      'Submit': 'जमा करें',
      'Start': 'शुरू करें',
      'Finish': 'समाप्त',
      'Score': 'अंक',
      'Time': 'समय',
      'Level': 'स्तर',
      'Easy': 'आसान',
      'Medium': 'मध्यम',
      'Hard': 'कठिन',
      'Math': 'गणित',
      'Quiz': 'प्रश्नोत्तरी',
      'Guess': 'अनुमान',
    },
    'marathi': {
      'Correct!': 'बरोबर!',
      'Wrong!': 'चूक!',
      'Try again': 'पुन्हा प्रयत्न करा',
      'Next': 'पुढे',
      'Submit': 'सबमिट करा',
      'Start': 'सुरू करा',
      'Finish': 'समाप्त',
      'Score': 'गुण',
      'Time': 'वेळ',
      'Level': 'स्तर',
      'Easy': 'सोपे',
      'Medium': 'मध्यम',
      'Hard': 'कठीण',
      'Math': 'गणित',
      'Quiz': 'प्रश्नोत्तरी',
      'Guess': 'अंदाज',
    },
    'tamil': {
      'Correct!': 'சரி!',
      'Wrong!': 'தவறு!',
      'Try again': 'மீண்டும் முயற்சிக்கவும்',
      'Next': 'அடுத்து',
      'Submit': 'சமர்ப்பிக்கவும்',
      'Start': 'தொடங்கு',
      'Finish': 'முடிக்க',
      'Score': 'மதிப்பெண்',
      'Time': 'நேரம்',
      'Level': 'நிலை',
      'Easy': 'எளிது',
      'Medium': 'நடுத்தரம்',
      'Hard': 'கடினம்',
      'Math': 'கணிதம்',
      'Quiz': 'வினாடி வினா',
      'Guess': 'ஊகிக்க',
    },
    'bengali': {
      'Correct!': 'সঠিক!',
      'Wrong!': 'ভুল!',
      'Try again': 'আবার চেষ্টা করুন',
      'Next': 'পরবর্তী',
      'Submit': 'জমা দিন',
      'Start': 'শুরু করুন',
      'Finish': 'শেষ করুন',
      'Score': 'স্কোর',
      'Time': 'সময়',
      'Level': 'স্তর',
      'Easy': 'সহজ',
      'Medium': 'মাঝারি',
      'Hard': 'কঠিন',
      'Math': 'গণিত',
      'Quiz': 'কুইজ',
      'Guess': 'অনুমান',
    },
  };
  
  if (language === 'english') return text;
  
  const languageTranslations = translations[language];
  if (!languageTranslations) return text;
  
  return languageTranslations[text] || text;
}

// Get language code for speech synthesis and recognition
export function getLanguageCode(language: string): string {
  const languageCodes: Record<string, string> = {
    'english': 'en-IN',
    'hindi': 'hi-IN',
    'marathi': 'mr-IN',
    'tamil': 'ta-IN',
    'bengali': 'bn-IN',
  };
  
  return languageCodes[language] || 'en-IN';
}

// Play sound effect
export function playSound(soundName: 'correct' | 'wrong' | 'levelUp' | 'click' | 'complete'): void {
  // In a real app, we would use Howler.js or the Web Audio API
  // For this demo, we'll use simple Audio elements
  
  const sounds: Record<string, string> = {
    correct: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3',
    wrong: 'https://assets.mixkit.co/active_storage/sfx/2955/2955-preview.mp3',
    levelUp: 'https://assets.mixkit.co/active_storage/sfx/1997/1997-preview.mp3',
    click: 'https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3',
    complete: 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3',
  };
  
  const audio = new Audio(sounds[soundName]);
  audio.volume = 0.5;
  audio.play().catch(error => console.error('Error playing sound:', error));
}