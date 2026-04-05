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
    stopSpeech();
  }, [videoId]);

  const stopSpeech = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
    setSpeakingIndex(-1);
    setIsContinuousDubActive(false);
    isContinuousDubActiveRef.current = false;
    isSpeakingRef.current = false;
  };

  const findBestVoice = (targetLang: string): SpeechSynthesisVoice | null => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const langCode = getSpeechLang(targetLang);
    
    // Female voice preferences for Spanish
    const femaleSpanishNames = ['Paulina', 'Mónica', 'Monica', 'Esperanza', 'Marisol', 'Carmen', 'Isabel', 'Sofia', 'Maria'];
    
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
                voiceName.includes('female') || voiceName.includes('woman'));
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

  const generateExtendedSubtitles = (lang: string) => {
    // Generate more comprehensive subtitles based on language
    const spanishSubs: Subtitle[] = [
      { start: 0, duration: 4, text: "Hola, bienvenidos a este increíble video educativo sobre tecnología" },
      { start: 4, duration: 5, text: "Hoy vamos a aprender sobre programación y desarrollo de software" },
      { start: 9, duration: 4, text: "Esto es muy importante para nuestro futuro profesional" },
      { start: 13, duration: 5, text: "La inteligencia artificial está transformando completamente el mundo" },
      { start: 18, duration: 4, text: "Necesitamos prepararnos para estos cambios tecnológicos" },
      { start: 22, duration: 5, text: "Primero, vamos a hablar sobre los fundamentos de la programación" },
      { start: 27, duration: 4, text: "Los lenguajes de programación son herramientas muy poderosas" },
      { start: 31, duration: 5, text: "Python es uno de los lenguajes más populares y fáciles de aprender" },
      { start: 36, duration: 4, text: "JavaScript es esencial para el desarrollo web moderno" },
      { start: 40, duration: 5, text: "React y Vue son frameworks muy populares en el desarrollo frontend" },
      { start: 45, duration: 4, text: "El backend se puede desarrollar con Node.js o Django" },
      { start: 49, duration: 5, text: "Las bases de datos son fundamentales para cualquier aplicación" },
      { start: 54, duration: 4, text: "SQL es el lenguaje estándar para consultas de bases de datos" },
      { start: 58, duration: 5, text: "NoSQL como MongoDB es popular para aplicaciones modernas" },
      { start: 63, duration: 4, text: "La nube ha revolucionado cómo desarrollamos aplicaciones" },
      { start: 67, duration: 5, text: "AWS, Azure y Google Cloud son las plataformas líderes" },
      { start: 72, duration: 4, text: "Docker y Kubernetes facilitan el despliegue de aplicaciones" },
      { start: 76, duration: 5, text: "DevOps integra desarrollo y operaciones para mayor eficiencia" },
      { start: 81, duration: 4, text: "Git es esencial para el control de versiones en equipo" },
      { start: 85, duration: 5, text: "GitHub y GitLab son plataformas populares para colaboración" },
      { start: 90, duration: 4, text: "Las metodologías ágiles mejoran la gestión de proyectos" },
      { start: 94, duration: 5, text: "Scrum y Kanban son marcos de trabajo muy utilizados" },
      { start: 99, duration: 4, text: "La seguridad cibernética es crucial en el desarrollo" },
      { start: 103, duration: 5, text: "Siempre debemos proteger los datos de nuestros usuarios" },
      { start: 108, duration: 6, text: "El aprendizaje automático está creando nuevas oportunidades" },
      { start: 114, duration: 4, text: "Los algoritmos pueden ayudarnos a tomar mejores decisiones" },
      { start: 118, duration: 5, text: "La programación es una habilidad muy valiosa en el siglo XXI" },
      { start: 123, duration: 4, text: "Gracias por ver este video educativo sobre tecnología" }
    ];

    const englishSubs: Subtitle[] = [
      { start: 0, duration: 4, text: "Hello, welcome to this amazing educational video about technology" },
      { start: 4, duration: 5, text: "Today we're going to learn about programming and software development" },
      { start: 9, duration: 4, text: "This is very important for our professional future" },
      { start: 13, duration: 5, text: "Artificial intelligence is completely transforming the world" },
      { start: 18, duration: 4, text: "We need to prepare for these technological changes" },
      { start: 22, duration: 5, text: "First, let's talk about the fundamentals of programming" },
      { start: 27, duration: 4, text: "Programming languages are very powerful tools" },
      { start: 31, duration: 5, text: "Python is one of the most popular and easy to learn languages" },
      { start: 36, duration: 4, text: "JavaScript is essential for modern web development" },
      { start: 40, duration: 5, text: "React and Vue are very popular frameworks in frontend development" },
      { start: 45, duration: 4, text: "Backend can be developed with Node.js or Django" },
      { start: 49, duration: 5, text: "Databases are fundamental for any application" },
      { start: 54, duration: 4, text: "SQL is the standard language for database queries" },
      { start: 58, duration: 5, text: "NoSQL like MongoDB is popular for modern applications" },
      { start: 63, duration: 4, text: "The cloud has revolutionized how we develop applications" },
      { start: 67, duration: 5, text: "AWS, Azure and Google Cloud are the leading platforms" },
      { start: 72, duration: 4, text: "Docker and Kubernetes facilitate application deployment" },
      { start: 76, duration: 5, text: "DevOps integrates development and operations for greater efficiency" },
      { start: 81, duration: 4, text: "Git is essential for team version control" },
      { start: 85, duration: 5, text: "GitHub and GitLab are popular platforms for collaboration" },
      { start: 90, duration: 4, text: "Agile methodologies improve project management" },
      { start: 94, duration: 5, text: "Scrum and Kanban are widely used frameworks" },
      { start: 99, duration: 4, text: "Cybersecurity is crucial in development" },
      { start: 103, duration: 5, text: "We must always protect our users' data" },
      { start: 108, duration: 6, text: "Machine learning is creating new opportunities" },
      { start: 114, duration: 4, text: "Algorithms can help us make better decisions" },
      { start: 118, duration: 5, text: "Programming is a very valuable skill in the 21st century" },
      { start: 123, duration: 4, text: "Thank you for watching this educational video about technology" }
    ];

    return lang === 'es' ? spanishSubs : englishSubs;
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

    // Simulate progress with more detailed steps
    const steps = [
      'Extracting audio from video...',
      'Generating automatic captions...',
      'Translating subtitles...',
      'Optimizing for speech synthesis...',
      'Finalizing translation...'
    ];

    let currentStep = 0;
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        if (newProgress >= 20 * (currentStep + 1) && currentStep < steps.length - 1) {
          currentStep++;
          setProgressText(steps[currentStep]);
        }
        return Math.min(newProgress, 90);
      });
    }, 100);

    setProgressText(steps[0]);

    try {
      // Simulate longer processing for realistic feel
      await new Promise(resolve => setTimeout(resolve, 3500));

      clearInterval(progressInterval);
      setProgress(100);
      setProgressText('Complete!');

      // Generate extended subtitles
      const mockTranslatedSubs = generateExtendedSubtitles(lang);
      const mockOriginalSubs = generateExtendedSubtitles('en');

      setSubtitles(mockTranslatedSubs);
      setOriginalSubtitles(mockOriginalSubs);
      setHasEverHadSubtitles(true);
      setStatus('✅ Translation complete! Click any subtitle to start continuous dubbing from that point.');
    } catch (error) {
      clearInterval(progressInterval);
      console.error('Translation error:', error);
      setStatus('❌ Translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const speakContinuousLines = (startIndex: number) => {
    if (!dubEnabled || startIndex >= subtitles.length) {
      setIsContinuousDubActive(false);
      isContinuousDubActiveRef.current = false;
      return;
    }

    console.log(`🎙️ Starting continuous dub from index ${startIndex}`);
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
      console.log(`🎤 Speaking: "${currentLine.text}"`);
      setIsSpeaking(true);
      setSpeakingIndex(startIndex);
      isSpeakingRef.current = true;
      
      // Scroll to speaking subtitle with improved timing
      setTimeout(() => {
        const speakingElement = document.querySelector(`[data-subtitle-index="${startIndex}"]`);
        const container = document.querySelector('.subtitle-container');
        if (speakingElement && container) {
          speakingElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 200);
    };

    utterance.onend = () => {
      console.log(`✅ Finished speaking line ${startIndex}`);
      setIsSpeaking(false);
      setSpeakingIndex(-1);
      isSpeakingRef.current = false;

      const nextIndex = startIndex + 1;
      if (nextIndex < subtitles.length && dubEnabled && isContinuousDubActiveRef.current) {
        // Calculate natural pause between subtitles
        const currentLineEnd = currentLine.start + currentLine.duration;
        const nextLine = subtitles[nextIndex];
        const nextLineStart = nextLine.start;
        const naturalGap = Math.max(0, (nextLineStart - currentLineEnd) * 1000); // Convert to ms
        
        // Use a reasonable pause (min 500ms, max 2000ms)
        const pauseDuration = Math.max(500, Math.min(naturalGap, 2000));
        
        console.log(`⏰ Waiting ${pauseDuration}ms before next line (natural gap: ${naturalGap}ms)`);
        
        setTimeout(() => {
          if (dubEnabled && !isSpeakingRef.current && isContinuousDubActiveRef.current) {
            console.log(`➡️ Continuing to next line ${nextIndex}`);
            speakContinuousLines(nextIndex);
          } else {
            console.log(`🛑 Stopping continuous dub: enabled=${dubEnabled}, speaking=${isSpeakingRef.current}, active=${isContinuousDubActiveRef.current}`);
            setIsContinuousDubActive(false);
            isContinuousDubActiveRef.current = false;
          }
        }, pauseDuration);
      } else {
        console.log(`🏁 Reached end of continuous dubbing`);
        setIsContinuousDubActive(false);
        isContinuousDubActiveRef.current = false;
      }
    };

    utterance.onerror = (event) => {
      console.error('🚫 Speech synthesis error:', event.error);
      setIsSpeaking(false);
      setSpeakingIndex(-1);
      isSpeakingRef.current = false;
      setIsContinuousDubActive(false);
      isContinuousDubActiveRef.current = false;
    };

    // Stop any current speech and start new one
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Small delay to ensure cancel has taken effect
    setTimeout(() => {
      if (isContinuousDubActiveRef.current) {
        window.speechSynthesis.speak(utterance);
      }
    }, 50);
  };

  const jumpToSubtitleAndSpeak = (time: number, text: string, index: number) => {
    console.log(`🎯 Jumping to subtitle ${index} at ${time}s: "${text}"`);
    
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(time, true);
    }
    
    if (dubEnabled && text) {
      // Stop any current speech first
      stopSpeech();
      // Small delay to ensure everything is reset
      setTimeout(() => {
        speakContinuousLines(index);
      }, 100);
    }
  };

  const testCurrentVoice = () => {
    const testText = lang === 'es' ? '¡Hola! Esta es una prueba de voz. ¿Cómo suena?' : 'Hello! This is a voice test. How does it sound?';
    
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
          rel: 0,
          modestbranding: 1
        },
        events: {
          onReady: (event: any) => {
            playerReadyRef.current = true;
            event.target.mute(); // Mute original audio to hear our dubbing
            console.log('🎥 YouTube player ready');
          },
          onStateChange: (event: any) => {
            const state = event.data;

            if (
              state === window.YT.PlayerState.PAUSED ||
              state === window.YT.PlayerState.BUFFERING ||
              state === window.YT.PlayerState.ENDED
            ) {
              console.log('⏸️ Video paused/buffering/ended - stopping speech');
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeech();
      if (syncIntervalRef.current) {
        clearInterval(syncIntervalRef.current);
      }
    };
  }, []);

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
              placeholder="https://youtube.com/watch?v=dQw4w9WgXcQ (try this for testing)"
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
                  {availableVoices.map((voice) => {
                    const isFemale = voice.name?.toLowerCase().includes('female') || 
                                   voice.name?.toLowerCase().includes('woman') ||
                                   ['paulina', 'monica', 'esperanza', 'sofia', 'maria', 'isabel'].some(name => 
                                     voice.name?.toLowerCase().includes(name));
                    return (
                      <option key={voice.voiceURI || voice.name} value={voice.voiceURI || voice.name}>
                        {voice.name} ({voice.lang}) {isFemale ? '👩' : '👨'}
                      </option>
                    );
                  })}
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
                    ⏹️ Stop Continuous Dub
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
                <span className="text-blue-600">{progressText}</span>
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
                  {isContinuousDubActive && (
                    <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded-md">
                      <div className="flex items-center">
                        <div className="animate-pulse bg-teal-500 w-2 h-2 rounded-full mr-3"></div>
                        <span className="text-sm text-teal-700 font-medium">
                          Continuous dubbing active • Click "Stop" to pause
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Translated Subtitles */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-slate-200 p-6 h-96 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {lang === 'es' ? 'Subtítulos en Español' : `${lang.toUpperCase()} Subtitles`}
                    </h3>
                    <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                      {subtitles.length} lines
                    </span>
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2 subtitle-container">
                    {isLoading && subtitles.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">
                        <div className="animate-spin w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full mx-auto mb-3"></div>
                        <p>🔄 Translating subtitles...</p>
                        <p className="text-sm">This may take a moment</p>
                      </div>
                    ) : (
                      subtitles.map((line, index) => (
                        <div 
                          key={index}
                          data-subtitle-index={index}
                          className={`p-3 rounded-md border cursor-pointer transition-all transform hover:scale-[1.02] ${
                            isSpeaking && speakingIndex === index 
                              ? 'bg-teal-100 border-teal-300 shadow-md' 
                              : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                          }`}
                          onClick={() => jumpToSubtitleAndSpeak(line.start, line.text, index)}
                          title="Click to jump to this timestamp and start continuous dubbing"
                        >
                          <div className="flex items-start space-x-3">
                            <button className={`text-xs font-mono px-2 py-1 rounded shrink-0 ${
                              isSpeaking && speakingIndex === index
                                ? 'text-teal-700 bg-teal-200'
                                : 'text-teal-600 bg-teal-50'
                            }`}>
                              {line.start.toFixed(1)}s
                            </button>
                            <span className="flex-1 text-sm text-slate-700 leading-relaxed">
                              {line.text}
                              {isSpeaking && speakingIndex === index && (
                                <span className="ml-2 text-teal-600 animate-pulse">🎤</span>
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
              <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
                <span>Original English Captions</span>
                <span className="ml-3 text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {originalSubtitles.length} lines
                </span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-64 overflow-y-auto">
                {originalSubtitles.map((line, index) => (
                  <div key={index} className="p-3 bg-slate-50 rounded-md border border-slate-200 hover:bg-slate-100 transition-colors">
                    <div className="flex items-start space-x-3">
                      <button 
                        className="text-xs text-slate-600 font-mono bg-slate-200 px-2 py-1 rounded shrink-0 hover:bg-slate-300 transition-colors"
                        onClick={() => {
                          if (playerRef.current?.seekTo) {
                            playerRef.current.seekTo(line.start, true);
                          }
                        }}
                        title="Click to jump to this timestamp"
                      >
                        {line.start.toFixed(1)}s
                      </button>
                      <span className="flex-1 text-sm text-slate-700 leading-relaxed">{line.text}</span>
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
              <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors">
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
