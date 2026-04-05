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
  const [currentVideoTime, setCurrentVideoTime] = useState(0);

  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);
  const playerReadyRef = useRef(false);
  const syncIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isContinuousDubActiveRef = useRef(false);
  const isSpeakingRef = useRef(false);

  const videoId = useMemo(() => getYouTubeId(url), [url]);

  // Find current subtitle based on video time
  const getCurrentSubtitleIndex = (time: number): number => {
    for (let i = 0; i < subtitles.length; i++) {
      const subtitle = subtitles[i];
      const endTime = subtitle.start + subtitle.duration;
      if (time >= subtitle.start && time <= endTime) {
        return i;
      }
    }
    return -1;
  };

  // Navigate to next/previous subtitle
  const goToNextSubtitle = () => {
    const currentIndex = getCurrentSubtitleIndex(currentVideoTime);
    const nextIndex = currentIndex + 1;
    if (nextIndex < subtitles.length) {
      jumpToSubtitleAndSpeak(subtitles[nextIndex].start, subtitles[nextIndex].text, nextIndex);
    }
  };

  const goToPreviousSubtitle = () => {
    const currentIndex = getCurrentSubtitleIndex(currentVideoTime);
    const prevIndex = Math.max(0, currentIndex - 1);
    jumpToSubtitleAndSpeak(subtitles[prevIndex].start, subtitles[prevIndex].text, prevIndex);
  };

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
    setProgressText('Initializing...');
    setStatus('🔄 Processing...');
    setSubtitles([]);
    setOriginalSubtitles([]);

    const progressSteps = [
      { progress: 10, text: 'Fetching video metadata...' },
      { progress: 25, text: 'Extracting subtitles...' },
      { progress: 45, text: 'Processing language detection...' },
      { progress: 65, text: 'Translating content...' },
      { progress: 85, text: 'Optimizing for speech synthesis...' },
      { progress: 95, text: 'Finalizing translation...' }
    ];

    try {
      // Simulate realistic progress with detailed steps
      for (const step of progressSteps) {
        await new Promise(resolve => setTimeout(resolve, 400));
        setProgress(step.progress);
        setProgressText(step.text);
      }

      // Enhanced mock data with comprehensive subtitles for entire video experience
      const mockTranslatedSubs: Subtitle[] = [
        { start: 0, duration: 3.5, text: "Hola y bienvenidos a este video educativo sobre tecnología" },
        { start: 3.5, duration: 4, text: "Hoy exploraremos el fascinante mundo de la programación" },
        { start: 7.5, duration: 3.5, text: "Y cómo la inteligencia artificial está cambiando nuestras vidas" },
        { start: 11, duration: 4, text: "Comenzaremos con los conceptos fundamentales de la programación" },
        { start: 15, duration: 3.8, text: "Los lenguajes de programación son herramientas poderosas" },
        { start: 18.8, duration: 4.2, text: "Que nos permiten crear aplicaciones y sistemas increíbles" },
        { start: 23, duration: 3.6, text: "Python, JavaScript y Java son algunos de los más populares" },
        { start: 26.6, duration: 4.4, text: "Cada uno tiene sus propias características y ventajas únicas" },
        { start: 31, duration: 3.9, text: "La inteligencia artificial representa el futuro de la tecnología" },
        { start: 34.9, duration: 4.1, text: "Machine learning y deep learning están revolucionando industrias" },
        { start: 39, duration: 3.7, text: "Desde la medicina hasta el transporte autónomo" },
        { start: 42.7, duration: 4.3, text: "Los algoritmos pueden ahora reconocer patrones complejos" },
        { start: 47, duration: 3.8, text: "Y tomar decisiones inteligentes basadas en datos masivos" },
        { start: 50.8, duration: 4, text: "El desarrollo web ha evolucionado tremendamente en los últimos años" },
        { start: 54.8, duration: 3.9, text: "Frameworks como React, Angular y Vue han simplificado el proceso" },
        { start: 58.7, duration: 4.2, text: "Permitiendo crear interfaces de usuario más dinámicas y atractivas" },
        { start: 62.9, duration: 3.6, text: "La programación móvil también ha ganado gran importancia" },
        { start: 66.5, duration: 4.1, text: "Con Flutter y React Native podemos desarrollar apps multiplataforma" },
        { start: 70.6, duration: 3.8, text: "Reduciendo significativamente el tiempo de desarrollo" },
        { start: 74.4, duration: 4.3, text: "La ciberseguridad es otro campo crucial en la tecnología moderna" },
        { start: 78.7, duration: 3.9, text: "Proteger datos y sistemas requiere conocimientos especializados" },
        { start: 82.6, duration: 4.1, text: "El hacking ético ayuda a identificar vulnerabilidades" },
        { start: 86.7, duration: 3.7, text: "Y fortalecer las defensas de las organizaciones" },
        { start: 90.4, duration: 4.2, text: "Cloud computing ha transformado la infraestructura tecnológica" },
        { start: 94.6, duration: 3.8, text: "Amazon Web Services, Google Cloud y Azure lideran el mercado" },
        { start: 98.4, duration: 4, text: "Ofreciendo servicios escalables y rentables para empresas" },
        { start: 102.4, duration: 3.9, text: "DevOps integra desarrollo y operaciones de manera eficiente" },
        { start: 106.3, duration: 4.1, text: "Automatizando procesos y mejorando la calidad del software" },
        { start: 110.4, duration: 3.6, text: "Git y GitHub son herramientas esenciales para todo programador" },
        { start: 114, duration: 4.3, text: "Permitiendo colaboración y control de versiones efectivo" },
        { start: 118.3, duration: 3.8, text: "Las bases de datos son el corazón de la mayoría de aplicaciones" },
        { start: 122.1, duration: 4, text: "SQL y NoSQL ofrecen diferentes enfoques para gestionar información" },
        { start: 126.1, duration: 3.7, text: "La experiencia del usuario es fundamental en cualquier producto" },
        { start: 129.8, duration: 4.2, text: "UI/UX design determina el éxito o fracaso de una aplicación" },
        { start: 134, duration: 3.9, text: "Testing y quality assurance garantizan software confiable" },
        { start: 137.9, duration: 4.1, text: "Metodologías ágiles como Scrum mejoran la gestión de proyectos" },
        { start: 142, duration: 3.6, text: "La innovación constante caracteriza la industria tecnológica" },
        { start: 145.6, duration: 4.4, text: "Mantenerse actualizado es crucial para el éxito profesional" },
        { start: 150, duration: 3.8, text: "Blockchain y criptomonedas representan nuevas oportunidades" },
        { start: 153.8, duration: 4, text: "Internet of Things conecta dispositivos de formas innovadoras" },
        { start: 157.8, duration: 3.9, text: "5G promete velocidades y conectividad sin precedentes" },
        { start: 161.7, duration: 4.2, text: "Realidad virtual y aumentada crean experiencias inmersivas" },
        { start: 165.9, duration: 3.7, text: "La educación en tecnología debe ser accesible para todos" },
        { start: 169.6, duration: 4.1, text: "Bootcamps y cursos online democratizan el aprendizaje" },
        { start: 173.7, duration: 3.8, text: "La diversidad en tech enriquece la innovación y creatividad" },
        { start: 177.5, duration: 4.3, text: "Mujeres y minorías aportan perspectivas valiosas al desarrollo" },
        { start: 181.8, duration: 3.6, text: "El futuro de la tecnología es brillante y lleno de posibilidades" },
        { start: 185.4, duration: 4, text: "Gracias por acompañarnos en este viaje educativo" },
        { start: 189.4, duration: 3.5, text: "¡Continuemos explorando y aprendiendo juntos!" }
      ];

      const mockOriginalSubs: Subtitle[] = [
        { start: 0, duration: 3.5, text: "Hello and welcome to this educational video about technology" },
        { start: 3.5, duration: 4, text: "Today we'll explore the fascinating world of programming" },
        { start: 7.5, duration: 3.5, text: "And how artificial intelligence is changing our lives" },
        { start: 11, duration: 4, text: "We'll start with the fundamental concepts of programming" },
        { start: 15, duration: 3.8, text: "Programming languages are powerful tools" },
        { start: 18.8, duration: 4.2, text: "That allow us to create incredible applications and systems" },
        { start: 23, duration: 3.6, text: "Python, JavaScript and Java are some of the most popular" },
        { start: 26.6, duration: 4.4, text: "Each has its own unique characteristics and advantages" },
        { start: 31, duration: 3.9, text: "Artificial intelligence represents the future of technology" },
        { start: 34.9, duration: 4.1, text: "Machine learning and deep learning are revolutionizing industries" },
        { start: 39, duration: 3.7, text: "From medicine to autonomous transportation" },
        { start: 42.7, duration: 4.3, text: "Algorithms can now recognize complex patterns" },
        { start: 47, duration: 3.8, text: "And make intelligent decisions based on massive data" },
        { start: 50.8, duration: 4, text: "Web development has evolved tremendously in recent years" },
        { start: 54.8, duration: 3.9, text: "Frameworks like React, Angular and Vue have simplified the process" },
        { start: 58.7, duration: 4.2, text: "Allowing for more dynamic and attractive user interfaces" },
        { start: 62.9, duration: 3.6, text: "Mobile programming has also gained great importance" },
        { start: 66.5, duration: 4.1, text: "With Flutter and React Native we can develop cross-platform apps" },
        { start: 70.6, duration: 3.8, text: "Significantly reducing development time" },
        { start: 74.4, duration: 4.3, text: "Cybersecurity is another crucial field in modern technology" },
        { start: 78.7, duration: 3.9, text: "Protecting data and systems requires specialized knowledge" },
        { start: 82.6, duration: 4.1, text: "Ethical hacking helps identify vulnerabilities" },
        { start: 86.7, duration: 3.7, text: "And strengthen organizational defenses" },
        { start: 90.4, duration: 4.2, text: "Cloud computing has transformed technological infrastructure" },
        { start: 94.6, duration: 3.8, text: "Amazon Web Services, Google Cloud and Azure lead the market" },
        { start: 98.4, duration: 4, text: "Offering scalable and cost-effective services for businesses" },
        { start: 102.4, duration: 3.9, text: "DevOps integrates development and operations efficiently" },
        { start: 106.3, duration: 4.1, text: "Automating processes and improving software quality" },
        { start: 110.4, duration: 3.6, text: "Git and GitHub are essential tools for every programmer" },
        { start: 114, duration: 4.3, text: "Enabling effective collaboration and version control" },
        { start: 118.3, duration: 3.8, text: "Databases are the heart of most applications" },
        { start: 122.1, duration: 4, text: "SQL and NoSQL offer different approaches to managing information" },
        { start: 126.1, duration: 3.7, text: "User experience is fundamental in any product" },
        { start: 129.8, duration: 4.2, text: "UI/UX design determines the success or failure of an application" },
        { start: 134, duration: 3.9, text: "Testing and quality assurance ensure reliable software" },
        { start: 137.9, duration: 4.1, text: "Agile methodologies like Scrum improve project management" },
        { start: 142, duration: 3.6, text: "Constant innovation characterizes the technology industry" },
        { start: 145.6, duration: 4.4, text: "Staying updated is crucial for professional success" },
        { start: 150, duration: 3.8, text: "Blockchain and cryptocurrencies represent new opportunities" },
        { start: 153.8, duration: 4, text: "Internet of Things connects devices in innovative ways" },
        { start: 157.8, duration: 3.9, text: "5G promises unprecedented speeds and connectivity" },
        { start: 161.7, duration: 4.2, text: "Virtual and augmented reality create immersive experiences" },
        { start: 165.9, duration: 3.7, text: "Technology education should be accessible to everyone" },
        { start: 169.6, duration: 4.1, text: "Bootcamps and online courses democratize learning" },
        { start: 173.7, duration: 3.8, text: "Diversity in tech enriches innovation and creativity" },
        { start: 177.5, duration: 4.3, text: "Women and minorities bring valuable perspectives to development" },
        { start: 181.8, duration: 3.6, text: "The future of technology is bright and full of possibilities" },
        { start: 185.4, duration: 4, text: "Thank you for joining us on this educational journey" },
        { start: 189.4, duration: 3.5, text: "Let's continue exploring and learning together!" }
      ];

      setProgress(100);
      setProgressText('Complete!');
      setSubtitles(mockTranslatedSubs);
      setOriginalSubtitles(mockOriginalSubs);
      setHasEverHadSubtitles(true);
      setStatus('✅ Translation complete! Click any subtitle to jump to that moment and hear the translation.');
    } catch (error) {
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
    utterance.rate = 0.95; // Slightly slower for better comprehension
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
      
      // Scroll to speaking subtitle with smoother animation
      setTimeout(() => {
        const speakingElement = document.querySelector(`[data-subtitle-index="${startIndex}"]`);
        if (speakingElement) {
          speakingElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center',
            inline: 'nearest'
          });
        }
      }, 200);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingIndex(-1);
      isSpeakingRef.current = false;

      const nextIndex = startIndex + 1;
      if (nextIndex < subtitles.length && dubEnabled && isContinuousDubActiveRef.current) {
        // Natural pause between subtitles - varies by text length
        const currentTextLength = currentLine.text.length;
        const pauseDuration = Math.max(400, Math.min(1200, currentTextLength * 8));
        
        setTimeout(() => {
          if (dubEnabled && !isSpeakingRef.current && isContinuousDubActiveRef.current) {
            speakContinuousLines(nextIndex);
          }
        }, pauseDuration);
      } else {
        // Reached end of subtitles
        setIsContinuousDubActive(false);
        isContinuousDubActiveRef.current = false;
        setStatus('🎉 Continuous dubbing completed! Click any subtitle to start from that point.');
      }
    };

    utterance.onerror = () => {
      console.log('Speech synthesis error, continuing to next subtitle...');
      setIsSpeaking(false);
      setSpeakingIndex(-1);
      isSpeakingRef.current = false;
      
      const nextIndex = startIndex + 1;
      if (nextIndex < subtitles.length && isContinuousDubActiveRef.current) {
        setTimeout(() => speakContinuousLines(nextIndex), 500);
      }
    };

    // Cancel any existing speech and start new one
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    // Small delay to ensure speech synthesis is ready
    setTimeout(() => {
      if (isContinuousDubActiveRef.current) {
        window.speechSynthesis.speak(utterance);
      }
    }, 100);
  };

  const jumpToSubtitleAndSpeak = (time: number, text: string, index: number) => {
    // Stop any current speech
    stopSpeech();
    
    // Seek to the video timestamp
    if (playerRef.current?.seekTo) {
      playerRef.current.seekTo(time, true);
      
      // Start video playback after seeking
      setTimeout(() => {
        if (playerRef.current?.playVideo) {
          playerRef.current.playVideo();
        }
      }, 100);
    }
    
    // Start continuous dubbing from this subtitle with a small delay to sync with video
    if (dubEnabled && text) {
      setTimeout(() => {
        speakContinuousLines(index);
      }, 200); // Small delay to ensure video starts playing first
    }
    
    // Update status to show what's happening
    setStatus(`🎬 Playing from ${time.toFixed(1)}s with synchronized dubbing...`);
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
            
            // Start time tracking
            if (syncIntervalRef.current) {
              clearInterval(syncIntervalRef.current);
            }
            syncIntervalRef.current = setInterval(() => {
              if (playerRef.current?.getCurrentTime) {
                const currentTime = playerRef.current.getCurrentTime();
                setCurrentVideoTime(currentTime);
              }
            }, 1000);
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
              <option value="pt-BR">🇧🇷 Brazilian Portuguese</option>
              <option value="ja">🇯🇵 Japanese (日本語)</option>
              <option value="ko">🇰🇷 Korean (한국어)</option>
              <option value="zh-Hans">🇨🇳 Chinese Simplified (简体中文)</option>
              <option value="zh-Hant">🇹🇼 Chinese Traditional (繁體中文)</option>
              <option value="ru">🇷🇺 Russian (Русский)</option>
              <option value="ar">🇸🇦 Arabic (العربية)</option>
              <option value="hi">🇮🇳 Hindi (हिन्दी)</option>
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
                <div className="bg-white rounded-lg border border-slate-200 p-6 space-y-4">
                  <div ref={playerContainerRef} className="w-full" />
                  
                  {/* Video Controls */}
                  {dubEnabled && subtitles.length > 0 && (
                    <div className="flex items-center justify-center space-x-2 p-3 bg-slate-50 rounded-md">
                      <button
                        onClick={goToPreviousSubtitle}
                        className="inline-flex items-center px-2 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        title="Previous subtitle"
                      >
                        ⏮️
                      </button>
                      
                      <button
                        onClick={() => {
                          if (playerRef.current?.playVideo) {
                            playerRef.current.playVideo();
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        title="Play video"
                      >
                        ▶️ Play
                      </button>
                      
                      <button
                        onClick={() => {
                          if (playerRef.current?.pauseVideo) {
                            playerRef.current.pauseVideo();
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        title="Pause video"
                      >
                        ⏸️ Pause
                      </button>
                      
                      <button
                        onClick={goToNextSubtitle}
                        className="inline-flex items-center px-2 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-md text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                        title="Next subtitle"
                      >
                        ⏭️
                      </button>
                      
                      <div className="text-sm text-slate-600 px-3 flex items-center space-x-4">
                        <span>🔇 Original audio muted for dubbing</span>
                        <span className="font-mono">⏱️ {currentVideoTime.toFixed(1)}s</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Translated Subtitles */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-slate-200 p-6 h-96 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-slate-900">
                      {lang === 'es' ? 'Spanish' : 'Translated'} Subtitles
                    </h3>
                    {dubEnabled && subtitles.length > 0 && !isLoading && (
                      <button
                        onClick={() => speakContinuousLines(0)}
                        disabled={isContinuousDubActive || isSpeaking}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isContinuousDubActive ? '▶️ Playing...' : '▶️ Start Continuous Dubbing'}
                      </button>
                    )}
                  </div>
                  <div className="flex-1 overflow-y-auto space-y-2">
                    {isLoading && subtitles.length === 0 ? (
                      <div className="text-center text-slate-500 py-8">
                        <p>🔄 Translating subtitles...</p>
                        <p className="text-sm">Video will remain visible during translation</p>
                      </div>
                    ) : (
                      <>
                        {subtitles.length > 0 && dubEnabled && (
                          <div className="text-xs text-slate-600 mb-3 p-2 bg-blue-50 rounded-md border border-blue-200">
                            💡 <strong>Tip:</strong> Click any subtitle to jump to that moment and start synchronized video+audio playback
                          </div>
                        )}
                        {subtitles.map((line, index) => {
                          const currentSubIndex = getCurrentSubtitleIndex(currentVideoTime);
                          const isCurrent = index === currentSubIndex;
                          const isSpeakingThis = isSpeaking && speakingIndex === index;
                          
                          return (
                            <div 
                              key={index}
                              data-subtitle-index={index}
                              className={`p-3 rounded-md border cursor-pointer transition-all transform hover:scale-[1.02] ${
                                isSpeakingThis 
                                  ? 'bg-teal-100 border-teal-300 shadow-md' 
                                  : isCurrent
                                  ? 'bg-blue-50 border-blue-300 shadow-sm'
                                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
                              }`}
                              onClick={() => jumpToSubtitleAndSpeak(line.start, line.text, index)}
                              title={`Click to play video from ${line.start.toFixed(1)}s with synchronized dubbing`}
                            >
                              <div className="flex items-start space-x-3">
                                <button className={`text-xs font-mono px-2 py-1 rounded flex items-center space-x-1 ${
                                  isSpeakingThis 
                                    ? 'text-teal-700 bg-teal-200'
                                    : isCurrent
                                    ? 'text-blue-700 bg-blue-200'
                                    : 'text-teal-600 bg-teal-50 hover:bg-teal-100'
                                }`}>
                                  <span>{isSpeakingThis ? '🎤' : isCurrent ? '📍' : '🎬'}</span>
                                  <span>{line.start.toFixed(1)}s</span>
                                </button>
                                <span className="flex-1 text-sm text-slate-700">
                                  {line.text}
                                  {isSpeakingThis && (
                                    <span className="ml-2 text-teal-600 animate-pulse">🎤 Speaking...</span>
                                  )}
                                  {isCurrent && !isSpeakingThis && (
                                    <span className="ml-2 text-blue-600">📍 Current</span>
                                  )}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </>
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
