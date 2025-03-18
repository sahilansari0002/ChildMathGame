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