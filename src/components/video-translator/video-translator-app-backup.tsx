"use client";

import { useState, useEffect, useMemo, useRef } from 'react';

function getYouTubeId(url: string): string {
  try {
    if (!url) return '';
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0];
    }
    const parsed = new URL(url);
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1]?.split('?')[0] || '';
      }
      return parsed.searchParams.get('v') || '';
    }
    return '';
  } catch {
    return '';
  }
}

function getSpeechLang(appLang: string): string {
  const map: Record<string, string> = {
    es: 'es-ES',
    'es-ES': 'es-ES',
    'es-MX': 'es-MX', 
    'es-US': 'es-US',
    'es-AR': 'es-AR',
    en: 'en-US',
    'en-US': 'en-US',
    'en-GB': 'en-GB',
    fr: 'fr-FR',
    'fr-FR': 'fr-FR',
    'fr-CA': 'fr-CA',
    de: 'de-DE',
    'de-DE': 'de-DE',
    it: 'it-IT',
    'it-IT': 'it-IT',
    pt: 'pt-PT',
    'pt-PT': 'pt-PT',
    'pt-BR': 'pt-BR',
    ja: 'ja-JP',
    'ja-JP': 'ja-JP',
    ko: 'ko-KR',
    'ko-KR': 'ko-KR',
    zh: 'zh-CN',
    'zh-Hans': 'zh-CN',
    'zh-Hant': 'zh-TW',
    'zh-CN': 'zh-CN',
    'zh-TW': 'zh-TW',
    ru: 'ru-RU',
    'ru-RU': 'ru-RU',
    ar: 'ar-SA',
    'ar-SA': 'ar-SA',
    hi: 'hi-IN',
    'hi-IN': 'hi-IN'
  };
  return map[appLang] || 'es-ES';
}

interface Subtitle {
  start: number;
  duration: number;
  text: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface VideoTranslatorAppProps {
  initialTranslations?: any[];
  userId?: string;
}

export function VideoTranslatorApp({ initialTranslations = [], userId }: VideoTranslatorAppProps) {
  const [url, setUrl] = useState('');
  const [lang, setLang] = useState('es');
  const [status, setStatus] = useState('');
  const [subtitles, setSubtitles] = useState<Subtitle[]>([]);
  const [originalSubtitles, setOriginalSubtitles] = useState<Subtitle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState('');
  const [dubEnabled, setDubEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceId, setSelectedVoiceId] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState(-1);
  const [hasEverHadSubtitles, setHasEverHadSubtitles] = useState(false);
  const [isContinuousDubActive, setIsContinuousDubActive] = useState(false);

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerReadyRef = useRef(false);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isContinuousDubActiveRef = useRef(false);
  const isSpeakingRef = useRef(false);

  const videoId = useMemo(() => getYouTubeId(url), [url]);

  // Reset state when video changes
  useEffect(() => {
    setHasEverHadSubtitles(false);
    setSubtitles([]);
    setOriginalSubtitles([]);
    setIsContinuousDubActive(false);
    isContinuousDubActiveRef.current = false;
  }, [videoId]);

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingIndex(-1);
    setIsContinuousDubActive(false);
    isContinuousDubActiveRef.current = false;
  };

  const findBestVoice = (targetLang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const langCode = getSpeechLang(targetLang);
    
    // Female voice preferences for Spanish
    const femaleSpanishNames = ['Paulina', 'Mónica', 'Monica', 'Esperanza', 'Marisol'];
    
    // First try to find Paulina specifically
    let bestVoice = voices.find(v => {
      const voiceLang = v.lang?.toLowerCase();
      const voiceName = v.name?.toLowerCase();
      return voiceLang === langCode.toLowerCase() && voiceName.includes('paulina');
    });

    // If no Paulina, try other female Spanish voices
    if (!bestVoice) {
      bestVoice = voices.find(v => {
        const voiceLang = v.lang?.toLowerCase();
        const voiceName = v.name?.toLowerCase();
        return voiceLang === langCode.toLowerCase() && 
               (femaleSpanishNames.some(name => voiceName.includes(name.toLowerCase())) ||
                voiceName.includes('female'));
      });
    }

    // If no female voice found, try any voice for the specific language
    if (!bestVoice) {
      bestVoice = voices.find(v => v.lang?.toLowerCase() === langCode.toLowerCase());
    }

    // Fallback to any voice in the language family
    if (!bestVoice) {
      const langFamily = langCode.split('-')[0];
      bestVoice = voices.find(v => v.lang?.toLowerCase()?.startsWith(langFamily));
    }

    return bestVoice || null;
  };

  const handleTranslate = async () => {
    if (!videoId) {
      setStatus('❌ Please enter a valid YouTube URL');
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setStatus('🔄 Processing...');
    setSubtitles([]);
    setOriginalSubtitles([]);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev < 90) return prev + 10;
        return prev;
      });
    }, 200);

    try {
      // Mock API call - replace with actual backend endpoint when ready
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock data for demonstration
      const mockTranslatedSubs: Subtitle[] = [
        { start: 0, duration: 3, text: "Hola, bienvenidos a este increíble video educativo" },
        { start: 3, duration: 4, text: "Hoy vamos a aprender sobre tecnología y programación" },
        { start: 7, duration: 3, text: "Esto es muy importante para nuestro futuro profesional" },
        { start: 10, duration: 4, text: "La inteligencia artificial está transformando el mundo" },
        { start: 14, duration: 3, text: "Necesitamos prepararnos para estos cambios" },
      ];

      const mockOriginalSubs: Subtitle[] = [
        { start: 0, duration: 3, text: "Hello, welcome to this amazing educational video" },
        { start: 3, duration: 4, text: "Today we're going to learn about technology and programming" },
        { start: 7, duration: 3, text: "This is very important for our professional future" },
        { start: 10, duration: 4, text: "Artificial intelligence is transforming the world" },
        { start: 14, duration: 3, text: "We need to prepare for these changes" },
      ];

      clearInterval(progressInterval);
      setProgress(100);
      setSubtitles(mockTranslatedSubs);
      setOriginalSubtitles(mockOriginalSubs);
      setHasEverHadSubtitles(true);
      setStatus('✅ Translation complete!');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Translation error:', error);
      setStatus('❌ Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakContinuousLines = (startIndex: number) => {
    if (!dubEnabled || startIndex >= subtitles.length) return;

    setIsContinuousDubActive(true);
    isContinuousDubActiveRef.current = true;

    const currentLine = subtitles[startIndex];
    if (!currentLine?.text) return;

    const utterance = new SpeechSynthesisUtterance(currentLine.text);
    utterance.lang = getSpeechLang(lang);
    utterance.rate = 1.0;
    utterance.pitch = 0.9;
    utterance.volume = 1.0;

    const selectedVoice = selectedVoiceId 
      ? window.speechSynthesis.getVoices().find(v => 
          (v.voiceURI === selectedVoiceId) || (v.name === selectedVoiceId)
        )
      : findBestVoice(lang);
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setSpeakingIndex(startIndex);
      isSpeakingRef.current = true;
      
      // Scroll to speaking subtitle
      setTimeout(() => {
        const speakingElement = document.querySelector(`[data-subtitle-index="${startIndex}"]`);
        if (speakingElement) {
          speakingElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 300);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(-1);
      isSpeakingRef.current = false;

      const nextIndex = startIndex + 1;
      if (nextIndex < subtitles.length && dubEnabled && isContinuousDubActiveRef.current) {
        setTimeout(() => {
          if (dubEnabled && !isSpeakingRef.current && isContinuousDubActiveRef.current) {
            speakContinuousLines(nextIndex);
          }
        }, 800);
      } else {
        setIsContinuousDubActive(false);
        isContinuousDubActiveRef.current = false;
      }
    };

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    setTimeout(() => {
      window.speechSynthesis.speak(utterance);
    }, 50);
  };

  const jumpToSubtitleAndSpeak = (time: number, text: string, index: number) => {
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(time, true);
    }
    
    if (dubEnabled && text) {
      speakContinuousLines(index);
    }
  };

  const testCurrentVoice = () => {
    const testText = lang === 'es' ? '¡Hola! Esta es una prueba de voz.' : 'Hello! This is a voice test.';
    
    if ('speechSynthesis' in window) {
      stopSpeech();
      
      const utterance = new SpeechSynthesisUtterance(testText);
      utterance.lang = getSpeechLang(lang);
      utterance.rate = 1.0;
      utterance.pitch = 0.9;
      utterance.volume = 1.0;

      const selectedVoice = selectedVoiceId 
        ? window.speechSynthesis.getVoices().find(v => 
            (v.voiceURI === selectedVoiceId) || (v.name === selectedVoiceId)
          )
        : findBestVoice(lang);
      
      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }

      window.speechSynthesis.speak(utterance);
    }
  };

  // Load available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const targetLangCode = getSpeechLang(lang);
      const langFamily = targetLangCode.split('-')[0];
      
      const filteredVoices = voices.filter(voice => 
        voice.lang?.toLowerCase().startsWith(langFamily)
      );
      
      setAvailableVoices(filteredVoices);
    };

    if ('speechSynthesis' in window) {
      loadVoices();
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);
      
      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
      };
    }
  }, [lang]);

  // YouTube Player Setup
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (window.YT && window.YT.Player) {
        createPlayer();
        return;
      }

      const existingScript = document.getElementById('youtube-iframe-api');
      if (!existingScript) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api';
        tag.src = 'https://www.youtube.com/iframe_api';
        document.body.appendChild(tag);
      }

      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (typeof previous === 'function') previous();
        createPlayer();
      };
    };

    const createPlayer = () => {
      if (!videoId || !playerContainerRef.current || !(window.YT && window.YT.Player)) return;

      if (playerRef.current?.destroy) {
        playerRef.current.destroy();
      }

      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        width: '100%',
        height: '420',
        playerVars: {
          autoplay: 0,
          playsinline: 1,
          rel: 0
        },
        events: {
          onReady: (event: any) => {
            playerReadyRef.current = true;
            event.target.mute();
          },
          onStateChange: (event: any) => {
            const state = event.data;

            if (
              state === window.YT.PlayerState.PAUSED ||
              state === window.YT.PlayerState.BUFFERING ||
              state === window.YT.PlayerState.ENDED
            ) {
              stopSpeech();
            }
          }
        }
      });
    };

    if (videoId) {
      loadYouTubeAPI();
    }

    return () => {
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, [videoId]);

  return (
    <div className="space-y-8">
      {/* Input Form */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              YouTube URL:
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Target Language:
            </label>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="es">🇪🇸 Spanish (Español)</option>
              <option value="en">🇺🇸 English</option>
              <option value="fr">🇫🇷 French (Français)</option>
              <option value="de">🇩🇪 German (Deutsch)</option>
              <option value="it">🇮🇹 Italian (Italiano)</option>
              <option value="pt">🇵🇹 Portuguese (Português)</option>
              <option value="ja">🇯🇵 Japanese (日本語)</option>
              <option value="ko">🇰🇷 Korean (한국어)</option>
              <option value="zh-Hans">🇨🇳 Chinese (简体中文)</option>
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="dubEnabled"
              checked={dubEnabled}
              onChange={(e) => {
                setDubEnabled(e.target.checked);
                if (!e.target.checked) stopSpeech();
              }}
              className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
            />
            <label htmlFor="dubEnabled" className="ml-2 block text-sm text-slate-700">
              Enable spoken dub preview
            </label>
          </div>

          {dubEnabled && availableVoices.length > 0 && (
            <div className="space-y-3 p-4 bg-slate-50 rounded-md">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Choose Voice:
                </label>
                <select 
                  value={selectedVoiceId} 
                  onChange={(e) => setSelectedVoiceId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="">Auto-select best voice</option>
                  {availableVoices.map((voice) => (
                    <option key={voice.voiceURI || voice.name} value={voice.voiceURI || voice.name}>
                      {voice.name} ({voice.lang})
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={testCurrentVoice} 
                  className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm leading-4 font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  🎤 Test Voice
                </button>
                
                {isContinuousDubActive && (
                  <button 
                    onClick={stopSpeech} 
                    className="inline-flex items-center px-3 py-2 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    ⏹️ Stop Dub
                  </button>
                )}
              </div>
            </div>
          )}

          <button 
            onClick={handleTranslate} 
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? '⏳ Translating...' : 'Get and translate subtitles'}
          </button>

          {isLoading && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-teal-600 h-2 rounded-full transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                {progressText && <span>{progressText}</span>}
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          )}

          {status && (
            <p className={`text-sm ${status.startsWith('✅') ? 'text-green-600' : status.startsWith('❌') ? 'text-red-600' : 'text-blue-600'}`}>
              {status}
            </p>
          )}
        </div>
      </div>

      {/* Video and Subtitles */}
      {videoId && (
        <div className="space-y-6">
          {hasEverHadSubtitles || isLoading ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Video Player */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-lg border border-slate-200 p-6">
                  <div ref={playerContainerRef} className="w-full" />
                </div>
              </div>
              
              {/* Translated Subtitles */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-slate-200 p-6 h-96 flex flex-col">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {lang === 'es' ? 'Spanish' : 'Translated'} Subtitles
                  </h3>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {isLoading && subtitles.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">
                        <p>🔄 Translating subtitles...</p>
                        <p className="text-sm">Video will remain visible during translation</p>
                      </div>
                    ) : (
                      subtitles.map((line, index) => (
                        <div 
                          key={index}
                          data-subtitle-index={index}
                          className={`p-3 rounded-md border cursor-pointer transition-all ${
                            isSpeaking && speakingIndex === index 
                              ? 'bg-teal-100 border-teal-300' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                          }`}
                          onClick={() => jumpToSubtitleAndSpeak(line.start, line.text, index)}
                        >
                          <div className="flex items-start space-x-3">
                            <button className="text-xs text-teal-600 font-mono bg-teal-50 px-2 py-1 rounded">
                              {line.start.toFixed(1)}s
                            </button>
                            <span className="flex-1 text-sm text-slate-700">
                              {line.text}
                              {isSpeaking && speakingIndex === index && (
                                <span className="ml-2 text-teal-600">🎤</span>
                              )}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <div ref={playerContainerRef} className="w-full" />
            </div>
          )}

          {/* Original Subtitles */}
          {originalSubtitles.length > 0 && (
            <div className="bg-white rounded-lg border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Original Captions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {originalSubtitles.map((line, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200">
                    <div className="flex items-start space-x-3">
                      <button 
                        className="text-xs text-slate-600 font-mono bg-slate-200 px-2 py-1 rounded"
                        onClick={() => {
                          if (playerRef.current?.seekTo) {
                            playerRef.current.seekTo(line.start, true);
                          }
                        }}
                      >
                        {line.start.toFixed(1)}s
                      </button>
                      <span className="flex-1 text-sm text-slate-700">{line.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Translation History */}
      {initialTranslations.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Recent Translations</h3>
          <div className="space-y-3">
            {initialTranslations.slice(0, 5).map((translation: any, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-900">
                    {translation.youtubeTitle || 'Untitled Video'}
                  </p>
                  <p className="text-xs text-slate-500">
                    {translation.sourceLang} → {translation.targetLang}
                  </p>
                </div>
                <span className="text-xs text-slate-500">
                  {new Date(translation.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
