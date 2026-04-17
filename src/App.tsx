/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef, ChangeEvent } from 'react';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Shield, 
  Copy, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Check, 
  Lock,
  Zap,
  Info,
  Link as LinkIcon,
  ShieldX,
  Clock,
  BookOpen,
  QrCode,
  X,
  FileText,
  Upload,
  Sun,
  Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { QRCodeSVG } from 'qrcode.react';

type StrengthLevel = 0 | 1 | 2 | 3 | 4;

interface StrengthInfo {
  score: StrengthLevel;
  label: string;
  color: string;
  feedback: string[];
}

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [showWordlistModal, setShowWordlistModal] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [selectedGuideSection, setSelectedGuideSection] = useState<number | null>(null);
  const [wordlistText, setWordlistText] = useState('');
  const [hoveredTip, setHoveredTip] = useState<number | null>(null);
  const [length, setLength] = useState(16);
  const [customWordlist, setCustomWordlist] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
  });
  const [showAdvancedTools, setShowAdvancedTools] = useState(false);
  const [generatedOptions, setGeneratedOptions] = useState<string[]>([]);
  const [generationMode, setGenerationMode] = useState<'Maximum' | 'Balanced' | 'Easy'>('Balanced');
  const [isGeneratorPanelOpen, setIsGeneratorPanelOpen] = useState(false);

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    const newOptions: string[] = [];

    const defaultWordlist = ['campus', 'secure', 'shield', 'access', 'system', 'portal', 'server', 'network', 'digital', 'safety', 'cipher', 'locked', 'matrix', 'vector', 'binary', 'signal', 'global', 'future', 'modern', 'expert', 'master', 'active', 'direct', 'source', 'bridge', 'tunnel', 'cloud', 'stream', 'buffer', 'packet', 'socket', 'kernel', 'script', 'syntax', 'object', 'module', 'string', 'number', 'boolean', 'array', 'method', 'return', 'export', 'import', 'render', 'effect', 'state', 'props', 'shadow', 'hunter', 'dragon', 'falcon', 'phoenix', 'nebula', 'galaxy', 'cosmos', 'planet', 'orbit', 'rocket', 'launch', 'engine', 'torque', 'motion', 'energy', 'static', 'dynamic', 'stable', 'strong', 'robust', 'secure', 'stable', 'steady', 'vibrant', 'bright', 'clear', 'sharp', 'smart', 'clever', 'quick', 'swift', 'silent', 'calm', 'peace', 'quiet', 'brave', 'bold', 'noble', 'grand', 'royal'];
    const getWord = () => {
      if (customWordlist.length > 0 && Math.random() > 0.3) {
        return customWordlist[Math.floor(Math.random() * customWordlist.length)];
      }
      return defaultWordlist[Math.floor(Math.random() * defaultWordlist.length)];
    };

    for (let j = 0; j < 3; j++) {
      if (generationMode === 'Maximum') {
        const chars = charset.uppercase + charset.lowercase + charset.numbers + charset.symbols;
        let generated = '';
        const len = Math.floor(Math.random() * 5) + 16; // 16 to 20
        for (let i = 0; i < len; i++) {
          generated += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        newOptions.push(generated);
      } else if (generationMode === 'Easy') {
        const w1 = getWord();
        let w2 = getWord();
        while (w1 === w2) w2 = getWord();
        const num = Math.floor(Math.random() * 99) + 1; // 1-99
        newOptions.push(`${w1}-${w2}${num}`);
      } else {
        // Balanced
        const w = getWord();
        const wordCap = w.charAt(0).toUpperCase() + w.slice(1);
        let chars = '';
        if (options.uppercase) chars += charset.uppercase;
        if (options.lowercase) chars += charset.lowercase;
        if (options.numbers) chars += charset.numbers;
        if (options.symbols) chars += charset.symbols;
        if (!chars) chars = charset.lowercase + charset.numbers;

        let randomPart = '';
        const targetLen = Math.max(12, length);
        const rem = Math.max(4, targetLen - w.length);
        for(let i=0; i<rem; i++) {
          randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        newOptions.push(`${wordCap}${randomPart}`);
      }
    }
    
    setGeneratedOptions(newOptions);
    setIsGeneratorPanelOpen(true);
  }, [length, options, generationMode, customWordlist]);

  useEffect(() => {
    if (isGeneratorPanelOpen) {
      generatePassword();
    }
  }, [generationMode]);

  const generatePassphrase = useCallback(() => {
    const defaultWordlist = [
      'campus', 'secure', 'shield', 'access', 'system', 'portal', 'server', 'network',
      'digital', 'safety', 'cipher', 'locked', 'matrix', 'vector', 'binary', 'signal',
      'global', 'future', 'modern', 'expert', 'master', 'active', 'direct', 'source',
      'bridge', 'tunnel', 'cloud', 'stream', 'buffer', 'packet', 'socket', 'kernel',
      'script', 'syntax', 'object', 'module', 'string', 'number', 'boolean', 'array',
      'method', 'return', 'export', 'import', 'render', 'effect', 'state', 'props',
      'shadow', 'hunter', 'dragon', 'falcon', 'phoenix', 'nebula', 'galaxy', 'cosmos',
      'planet', 'orbit', 'rocket', 'launch', 'engine', 'torque', 'motion', 'energy',
      'static', 'dynamic', 'stable', 'strong', 'robust', 'secure', 'stable', 'steady',
      'vibrant', 'bright', 'clear', 'sharp', 'smart', 'clever', 'quick', 'swift',
      'silent', 'calm', 'peace', 'quiet', 'brave', 'bold', 'noble', 'grand', 'royal'
    ];

    const words: string[] = [];
    
    if (customWordlist.length > 0) {
      // Pick 2 from custom (or as many as possible) and 2 from default
      const customCount = Math.min(2, customWordlist.length);
      for (let i = 0; i < customCount; i++) {
        words.push(customWordlist[Math.floor(Math.random() * customWordlist.length)]);
      }
      for (let i = 0; i < (4 - customCount); i++) {
        words.push(defaultWordlist[Math.floor(Math.random() * defaultWordlist.length)]);
      }
      // Shuffle the words
      for (let i = words.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [words[i], words[j]] = [words[j], words[i]];
      }
    } else {
      for (let i = 0; i < 4; i++) {
        words.push(defaultWordlist[Math.floor(Math.random() * defaultWordlist.length)]);
      }
    }

    const targetIndex = Math.floor(Math.random() * 4);
    const processedWords = words.map((word, i) => {
      if (i === targetIndex) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word.toLowerCase();
    });
    
    // Add a random number at the end
    const num = Math.floor(Math.random() * 1000);
    
    // Join with hyphens and add number
    const passphrase = processedWords.join('-') + '-' + num;
    setPassword(passphrase);
  }, [customWordlist]);

  const improvePassword = useCallback(() => {
    if (!password) return;
    
    let improved = password;
    
    // Leetspeak Dictionary
    const leetMap: Record<string, string> = {
      'a': '@', 'A': '@',
      'o': '0', 'O': '0',
      's': '$', 'S': '$',
      'i': '1', 'I': '1',
      'e': '3', 'E': '3',
    };

    let replacements = 0;
    improved = improved.split('').map(char => {
      if (leetMap[char] && replacements < 2 && Math.random() > 0.4) {
        replacements++;
        return leetMap[char];
      }
      return char;
    }).join('');

    // Ensure Capitalization
    if (improved.length > 0) {
      improved = improved.charAt(0).toUpperCase() + improved.slice(1);
    }

    // Add Special Character if missing
    if (!/[^A-Za-z0-9]/.test(improved)) {
      const symbols = ['!', '@', '#', '$', '%', '*', '?'];
      improved += symbols[Math.floor(Math.random() * symbols.length)];
    }

    // Add Number if missing
    if (!/[0-9]/.test(improved)) {
      improved += Math.floor(Math.random() * 100);
    }

    // Meaningful Suffix
    const suffixes = ['Secure', 'Safe', 'Strong', 'Key', 'Lock'];
    if (improved.length < 12) {
       improved += '_' + suffixes[Math.floor(Math.random() * suffixes.length)];
    }

    setPassword(improved);
  }, [password]);

  const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      if (content) {
        // Take the first line and trim it
        const firstLine = content.split('\n')[0].trim();
        if (firstLine) {
          setPassword(firstLine);
        }
      }
    };
    reader.readAsText(file);
    // Reset input so the same file can be uploaded again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWordlistSave = () => {
    const words = wordlistText.trim().split(/\s+/).filter(w => w.length > 0);
    if (words.length > 0) {
      setCustomWordlist(words);
      setShowWordlistModal(false);
    } else {
      alert("Please enter at least one word.");
    }
  };

  const commonPasswords = [
    'password', '123456', '12345678', 'qwerty', 'iloveyou', 'admin', 'login', 
    'campus', 'student', 'university', 'welcome', 'monkey', 'dragon', 
    'football', 'baseball', 'sunshine', 'princess', 'charlie', 'ginger', 
    'shadow', 'hunter', 'master', 'killer', 'hacker', 'secret', 'access', 
    'system', 'root', 'user', 'test', 'demo', 'sample', 'example', 
    'default', 'change', 'update', 'reset', 'forgot', 'help', 'support'
  ];

  const getStrength = (pwd: string): StrengthInfo => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-gray-200', feedback: [] };

    let score: StrengthLevel = 0;
    const feedback: string[] = [];

    // Check for USN patterns (e.g., 1DS22CS001, DS001)
    const usnPattern = /(1DS\d{2}[A-Z]{2,3}\d{3}|DS\d{3})/i;
    if (usnPattern.test(pwd)) {
      return {
        score: 0,
        label: 'Very Weak',
        color: 'bg-red-500',
        feedback: ["Don't use your USN"]
      };
    }

    // Check for Hex/SHA256 patterns (common hashes)
    const isHex = /^[0-9a-f]+$/i.test(pwd);
    const isHexPrefixed = /^0x[0-9a-f]+$/i.test(pwd);
    const commonHashLengths = [32, 40, 56, 64, 96, 128];
    if ((isHex || isHexPrefixed) && commonHashLengths.includes(isHexPrefixed ? pwd.length - 2 : pwd.length)) {
      return {
        score: 0,
        label: 'Very Weak',
        color: 'bg-red-500',
        feedback: ["Don't use hashed passwords (MD5/SHA/SHA256/SHA512)"]
      };
    }
    
    if ((isHex || isHexPrefixed) && (isHexPrefixed ? pwd.length - 2 : pwd.length) > 16) {
      feedback.push('Avoid long hexadecimal strings');
      score = Math.max(0, score - 1) as StrengthLevel;
    }

    // Check for common weak passwords
    if (commonPasswords.includes(pwd.toLowerCase())) {
      return {
        score: 0,
        label: 'Very Weak',
        color: 'bg-red-500',
        feedback: ['Commonly used password']
      };
    }

    // Check for repeating characters (e.g., "aaaaa")
    if (/(.)\1{4,}/.test(pwd)) {
      feedback.push('Avoid repeating characters');
      score = Math.max(0, score - 1) as StrengthLevel;
    }

    // Check for repeating patterns (e.g., "ababab", "121212", "ioioio")
    if (/(.{2,})\1{2,}/.test(pwd.toLowerCase())) {
      feedback.push('Avoid repeating patterns');
      score = Math.max(0, score - 1) as StrengthLevel;
    }

    // Check for sequential characters (e.g., "abcde", "12345")
    const isSequential = (s: string) => {
      for (let i = 0; i < s.length - 2; i++) {
        const code1 = s.charCodeAt(i);
        const code2 = s.charCodeAt(i + 1);
        const code3 = s.charCodeAt(i + 2);
        if (code2 === code1 + 1 && code3 === code2 + 1) return true;
      }
      return false;
    };

    if (isSequential(pwd.toLowerCase())) {
      feedback.push('Avoid sequential characters');
      score = Math.max(0, score - 1) as StrengthLevel;
    }

    if (pwd.length >= 8) score++;
    else feedback.push('Too short (min 8 chars)');

    if (pwd.length >= 12) score++;
    
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
    else feedback.push('Mix uppercase and lowercase');

    if (/[0-9]/.test(pwd)) score++;
    else feedback.push('Include numbers');

    if (/[^A-Za-z0-9]/.test(pwd)) score++;
    else feedback.push('Include symbols');

    // Cap score at 4
    const finalScore = Math.min(Math.max(Math.floor(score * 0.8), 0), 4) as StrengthLevel;

    const levels: Record<StrengthLevel, { label: string; color: string }> = {
      0: { label: 'Very Weak', color: 'bg-red-500' },
      1: { label: 'Weak', color: 'bg-orange-500' },
      2: { label: 'Fair', color: 'bg-yellow-500' },
      3: { label: 'Strong', color: 'bg-emerald-500' },
      4: { label: 'Very Strong', color: 'bg-blue-500' },
    };

    return {
      score: finalScore,
      ...levels[finalScore],
      feedback
    };
  };

  const strength = getStrength(password);

  const getSimulatedAttacks = (pwd: string) => {
    if (!pwd) return null;

    const lowerPwd = pwd.toLowerCase();
    
    // Dictionary check
    const isCommon = commonPasswords.includes(lowerPwd) || 
      lowerPwd.includes('123') || 
      lowerPwd.includes('qwerty') || 
      lowerPwd.includes('password') ||
      /(.)\1{4,}/.test(pwd);

    // Readable sequences (5+ letters continuous)
    const hasReadable = /[a-zA-Z]{5,}/.test(pwd);

    const getThemeColor = (darkColor: string, lightColor: string) => theme === 'dark' ? darkColor : lightColor;

    let dictTime = '';
    let dictColor = '';
    if (isCommon) {
      dictTime = '🔴 Vulnerable';
      dictColor = getThemeColor('text-red-500', 'text-red-700');
    } else if (hasReadable) {
      dictTime = '🟠 Partially Vulnerable';
      dictColor = getThemeColor('text-orange-500', 'text-orange-700');
    } else {
      dictTime = '🟢 Resistant';
      dictColor = getThemeColor('text-emerald-500', 'text-emerald-700');
    }

    const dictionary = { time: dictTime, color: dictColor };

    // Hybrid attack
    let hybridTime = '';
    let hybridColor = '';
    if (pwd.length < 8) { 
      hybridTime = '🔴 Vulnerable'; 
      hybridColor = getThemeColor('text-red-500', 'text-red-700'); 
    } else if (pwd.length <= 11) { 
      hybridTime = '🟠 Moderate'; 
      hybridColor = getThemeColor('text-orange-500', 'text-orange-700'); 
    } else { 
      hybridTime = '🟢 Strong'; 
      hybridColor = getThemeColor('text-emerald-500', 'text-emerald-700'); 
    }

    // Brute force
    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) charsetSize += 33;
    if (charsetSize === 0) charsetSize = 1;

    const combinations = BigInt(charsetSize) ** BigInt(pwd.length);
    const guessesPerSecond = BigInt(1_000_000_000); // 1 billion/sec
    const seconds = combinations / guessesPerSecond;

    let bruteTime = '';
    let bruteColor = '';
    let bruteIcon = (seconds < 3600n) ? '🔴' : (seconds < 31536000n) ? '🟠' : '🟢';

    if (seconds < 1n) { bruteTime = 'Instant'; bruteColor = getThemeColor('text-red-500', 'text-red-700'); }
    else if (seconds < 60n) { bruteTime = `${seconds} seconds`; bruteColor = getThemeColor('text-red-500', 'text-red-700'); }
    else if (seconds < 3600n) { bruteTime = `${seconds / 60n} minutes`; bruteColor = getThemeColor('text-orange-500', 'text-orange-700'); }
    else if (seconds < 86400n) { bruteTime = `${seconds / 3600n} hours`; bruteColor = getThemeColor('text-orange-500', 'text-orange-700'); }
    else if (seconds < 31536000n) { bruteTime = `${seconds / 86400n} days`; bruteColor = getThemeColor('text-emerald-500', 'text-emerald-700'); }
    else if (seconds < 3153600000n) { bruteTime = `${seconds / 31536000n} years`; bruteColor = getThemeColor('text-emerald-500', 'text-emerald-700'); }
    else { bruteTime = 'Centuries'; bruteColor = getThemeColor('text-emerald-500', 'text-emerald-700'); }

    bruteTime = `${bruteIcon} ${bruteTime}`;

    return { dictionary, hybrid: { time: hybridTime, color: hybridColor }, brute: { time: bruteTime, color: bruteColor } };
  };

  const getTimeToCrack = (pwd: string) => {
    if (!pwd) return '0 seconds';
    
    let charsetSize = 0;
    if (/[a-z]/.test(pwd)) charsetSize += 26;
    if (/[A-Z]/.test(pwd)) charsetSize += 26;
    if (/[0-9]/.test(pwd)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(pwd)) charsetSize += 33;

    // Use BigInt for large numbers to avoid precision issues
    const combinations = BigInt(charsetSize) ** BigInt(pwd.length);
    const guessesPerSecond = BigInt(10_000_000_000); // 10 billion guesses per second
    const seconds = combinations / guessesPerSecond;

    if (seconds < 1n) return 'Instantly';
    if (seconds < 60n) return `${seconds} seconds`;
    if (seconds < 3600n) return `${seconds / 60n} minutes`;
    if (seconds < 86400n) return `${seconds / 3600n} hours`;
    if (seconds < 31536000n) return `${seconds / 86400n} days`;
    if (seconds < 3153600000n) return `${seconds / 31536000n} years`;
    return 'Centuries';
  };

  const LockVisual = ({ score }: { score: StrengthLevel }) => {
    const isWeak = score <= 1 && password.length > 0;
    const isStrong = score >= 3;

    return (
      <motion.div 
        animate={isWeak ? {
          x: [0, -2, 2, -2, 2, 0],
          transition: { duration: 0.4, repeat: Infinity, repeatDelay: 2 }
        } : isStrong ? {
          scale: [1, 1.05, 1],
          transition: { duration: 2, repeat: Infinity }
        } : {}}
        className={`relative inline-flex items-center justify-center w-20 h-20 rounded-3xl mb-6 transition-all duration-500 border ${
          theme === 'dark' 
            ? 'bg-amber-500/10 border-amber-500/20' 
            : 'bg-emerald-900/5 border-emerald-900/10'
        }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={score}
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            {score === 0 && password.length > 0 ? (
              <div className="relative">
                <Lock className={`w-10 h-10 opacity-40 ${theme === 'dark' ? 'text-red-500' : 'text-red-700'}`} />
                <motion.div 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={`${theme === 'dark' ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-red-700'}`}>
                    <path d="M7 7l10 10M17 7L7 17" />
                  </svg>
                </motion.div>
              </div>
            ) : score === 4 ? (
              <div className="relative">
                <Lock className={`w-10 h-10 ${theme === 'dark' ? 'text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]' : 'text-emerald-800'}`} />
                {/* Chains */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -inset-2 pointer-events-none"
                >
                  <div className="absolute top-0 left-0 -rotate-45">
                    <LinkIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-300/80' : 'text-emerald-700/80'}`} />
                  </div>
                  <div className="absolute bottom-0 right-0 -rotate-45">
                    <LinkIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-300/80' : 'text-emerald-700/80'}`} />
                  </div>
                  <div className="absolute top-0 right-0 rotate-45">
                    <LinkIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-300/80' : 'text-emerald-700/80'}`} />
                  </div>
                  <div className="absolute bottom-0 left-0 rotate-45">
                    <LinkIcon className={`w-5 h-5 ${theme === 'dark' ? 'text-blue-300/80' : 'text-emerald-700/80'}`} />
                  </div>
                </motion.div>
                {/* Reinforcement Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className={`absolute -inset-3 border-2 border-dashed rounded-full ${theme === 'dark' ? 'border-blue-400/30' : 'border-emerald-800/30'}`}
                />
              </div>
            ) : score === 3 ? (
              <div className="relative">
                <Lock className={`w-10 h-10 ${theme === 'dark' ? 'text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]' : 'text-emerald-600'}`} />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`absolute -inset-1 border rounded-xl ${theme === 'dark' ? 'border-emerald-400/40' : 'border-emerald-600/40'}`}
                />
              </div>
            ) : (
              <Lock className={`w-10 h-10 ${
                score === 0 
                  ? (theme === 'dark' ? 'text-gray-600' : 'text-emerald-900/20') 
                  : score === 1 
                    ? (theme === 'dark' ? 'text-orange-500' : 'text-orange-700') 
                    : (theme === 'dark' ? 'text-yellow-500' : 'text-emerald-600')
              }`} />
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
    );
  };

  const copyToClipboard = async () => {
    if (!password) return;
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy!', err);
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 font-sans selection:bg-amber-500/30 ${
      theme === 'dark' ? 'bg-[#0a0a0a] text-white' : 'bg-[#fdfbf7] text-emerald-950'
    }`}>
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {theme === 'dark' ? (
          <>
            <motion.div animate={{ y: [-20, 20, -20], x: [-10, 10, -10], scale: [1, 1.1, 1] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
            <motion.div animate={{ y: [20, -20, 20], x: [10, -10, 10], scale: [1, 1.2, 1] }} transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full" />
          </>
        ) : (
          <>
            <motion.div animate={{ y: [-15, 15, -15], x: [-5, 5, -5], scale: [1, 1.05, 1] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
            <motion.div animate={{ y: [15, -15, 15], x: [5, -5, 5], scale: [1, 1.1, 1] }} transition={{ duration: 17, repeat: Infinity, ease: 'easeInOut' }} className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-600/10 blur-[120px] rounded-full" />
          </>
        )}
      </div>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 lg:py-16">
        <div className="flex justify-between items-start mb-8 lg:mb-12">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <ShieldCheck className={theme === 'dark' ? 'text-amber-500 h-8 w-8' : 'text-emerald-800 h-8 w-8'} />
              <h1 className="text-3xl font-extrabold tracking-tight uppercase italic drop-shadow-sm">
                Campus<span className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}>Guard</span>
              </h1>
              <span className={`px-2 py-1 text-[10px] font-bold rounded-md border ${
                theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-emerald-800/10 border-emerald-800/20 text-emerald-800'
              }`}>
                🔒 100% Offline Secure
              </span>
            </div>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/60'} text-sm`}>
              Privacy-first password intelligence system
            </p>
          </div>
          
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={`p-3 rounded-2xl border transition-all ${
              theme === 'dark' 
                ? 'bg-white/5 border-white/10 text-amber-500 hover:bg-white/10' 
                : 'bg-emerald-900/5 border-emerald-900/10 text-emerald-800 hover:bg-emerald-900/10'
            }`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Column: Analyzer (7 cols) */}
          <div className={`col-span-1 lg:col-span-7 flex flex-col border rounded-[2rem] p-6 lg:p-10 shadow-2xl backdrop-blur-2xl transition-all relative overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#161616]/60 border-white/10 shadow-black/50 ring-1 ring-inset ring-white/[0.05]' 
              : 'bg-white/80 border-white/60 shadow-emerald-900/5 ring-1 ring-inset ring-white'
          }`}>
            <div className="flex-1 flex flex-col relative z-10">
               {/* Lock Visual and Label */}
               <div className="flex justify-between items-start mb-6">
                 <LockVisual score={strength.score} />
                 <div className="text-right">
                   <div className="flex items-center justify-end gap-2 mb-1">
                     <span className={`text-2xl font-bold ${
                        theme === 'dark' 
                          ? strength.color.replace('bg-', 'text-') 
                          : strength.color.replace('bg-', 'text-').replace('amber-500', 'emerald-700').replace('yellow-500', 'emerald-600').replace('red-500', 'red-700')
                      }`}>
                        {strength.label}
                      </span>
                      {strength.score >= 3 ? (
                        <ShieldCheck className={`w-6 h-6 ${theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}`} />
                      ) : strength.score >= 1 ? (
                        <Shield className={`w-6 h-6 ${theme === 'dark' ? 'text-yellow-500' : 'text-emerald-600'}`} />
                      ) : (
                        <ShieldAlert className="w-6 h-6 text-red-500" />
                      )}
                   </div>
                   <div className={`flex items-center justify-end gap-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'}`}>
                    <Clock size={12} className={theme === 'dark' ? 'text-amber-500/70' : 'text-emerald-600'} />
                    <span>Time to crack: <span className={`font-bold font-mono ${theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}`}>{getTimeToCrack(password)}</span></span>
                  </div>
                 </div>
               </div>

               {/* Strength Bar */}
               <div className={`h-3 w-full rounded-full overflow-hidden flex gap-1 p-0.5 mb-6 ${theme === 'dark' ? 'bg-white/5' : 'bg-emerald-900/5'}`}>
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div 
                      key={i}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }}
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${
                        i <= strength.score - 1 
                          ? (theme === 'dark' ? strength.color : strength.color.replace('amber-500', 'emerald-800').replace('yellow-500', 'emerald-600').replace('red-500', 'red-700'))
                          : (theme === 'dark' ? 'bg-white/5' : 'bg-emerald-900/5')
                      } ${strength.score === 4 && i <= 3 ? 'shadow-[0_0_10px_rgba(52,211,153,0.5)]' : ''}`}
                    />
                  ))}
               </div>

               {/* Password Input Area */}
               <div className="flex flex-col gap-2 mb-6">
                  <label className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/50'}`}>Target Credential</label>
                  <div className="relative group flex items-center">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter or generate campus password..."
                      className={`w-full border rounded-xl pl-5 pr-28 py-3 text-lg font-mono focus:outline-none focus:ring-2 transition-all duration-300 placeholder:text-gray-500/70 shadow-inner ${
                        theme === 'dark'
                          ? 'bg-black/40 border-white/10 hover:border-white/20 focus:ring-amber-500/30 focus:border-amber-500/50 text-white'
                          : 'bg-emerald-50/50 border-emerald-900/10 hover:border-emerald-900/20 focus:ring-emerald-800/20 focus:border-emerald-800/40 text-emerald-950'
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                      <button onClick={() => setShowPassword(!showPassword)} className={`p-1.5 rounded-md transition-all duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-emerald-900/50 hover:text-emerald-900 hover:bg-emerald-900/10'}`} title={showPassword ? "Hide password" : "Show password"}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                      <button onClick={copyToClipboard} className={`p-1.5 rounded-md transition-all duration-300 ${copied ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-800/10 text-emerald-800') : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10' : 'text-emerald-900/50 hover:text-emerald-900 hover:bg-emerald-900/10')}`} title="Copy password">
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                      <button onClick={() => setShowQr(true)} disabled={!password} className={`p-1.5 rounded-md transition-all duration-300 ${theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/10 disabled:opacity-30' : 'text-emerald-900/50 hover:text-emerald-900 hover:bg-emerald-900/10 disabled:opacity-40'}`} title="Generate QR">
                        <QrCode size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Subtle Improve Button */}
                  <AnimatePresence>
                    {password.length > 0 && strength.score < 3 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex justify-end overflow-hidden"
                      >
                        <button
                          onClick={improvePassword}
                          title="Automatically strengthen your password"
                          className={`flex items-center gap-1.5 px-3 py-1 text-[11px] sm:text-xs font-bold rounded-md transition-all duration-200 ${
                            theme === 'dark'
                              ? 'bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400'
                              : 'bg-emerald-900/10 text-emerald-800 hover:bg-emerald-900/20 hover:text-emerald-900'
                          }`}
                        >
                          <span>🔧</span> Improve
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               {/* Feedback */}
                <div className="mt-auto">
                  <AnimatePresence>
                    {strength.feedback.length > 0 && password.length > 0 && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                      >
                        {strength.feedback.map((f, i) => (
                          <span key={i} className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${
                            theme === 'dark' 
                              ? 'bg-red-500/10 text-red-400 border-red-500/20' 
                              : 'bg-red-50 border-red-200 text-red-700'
                          }`}>
                            {f}
                          </span>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Attack Simulation */}
                <AnimatePresence>
                  {password.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className={`mt-4 p-3 rounded-lg border ${
                        theme === 'dark' 
                          ? 'bg-white/5 border-white/10' 
                          : 'bg-emerald-900/5 border-emerald-900/10'
                      }`}
                    >
                      <h3 className={`text-sm font-bold flex items-center gap-2 mb-3 ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>
                        <span>⚡</span> Attack Simulation
                      </h3>
                      <div className="space-y-2 text-sm z-20">
                        {(() => {
                          const attacks = getSimulatedAttacks(password);
                          if (!attacks) return null;
                          return (
                            <>
                              <div className="flex justify-between items-center">
                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/70'}>Dictionary Attack</span>
                                <span className={`font-bold ${attacks.dictionary.color}`}>{attacks.dictionary.time}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/70'}>Hybrid Attack</span>
                                <span className={`font-bold ${attacks.hybrid.color}`}>{attacks.hybrid.time}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className={theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/70'}>Brute Force</span>
                                <span className={`font-bold ${attacks.brute.color}`}>{attacks.brute.time}</span>
                              </div>
                            </>
                          );
                        })()}
                      </div>
                      <p className={`mt-3 text-[10px] uppercase tracking-widest font-bold ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'}`}>
                        Based on est. 1 billion guesses/sec speed
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>



            </div>
          </div>

          {/* Right Column: Generator (5 cols) */}
          <div className={`col-span-1 lg:col-span-5 flex flex-col border rounded-[2rem] p-6 lg:p-10 shadow-2xl backdrop-blur-2xl transition-all relative overflow-hidden ${
            theme === 'dark' 
              ? 'bg-[#161616]/60 border-white/10 shadow-black/50 ring-1 ring-inset ring-white/[0.05]' 
              : 'bg-white/80 border-white/60 shadow-emerald-900/5 ring-1 ring-inset ring-white'
          }`}>
            <h2 className={`text-lg font-bold uppercase tracking-tight italic mb-8 flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>
              <Zap size={20} className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-600'} />
              Generator Engine
            </h2>
            
            <div className="space-y-6 flex-1 flex flex-col relative z-10">
              <div className="space-y-4">
                <div className="flex justify-between items-center px-1">
                  <span className={`text-sm font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/60'}`}>Length</span>
                  <span className={`text-sm font-mono px-3 py-1 rounded-md ${
                    theme === 'dark' ? 'text-amber-500 bg-amber-500/10 font-bold border border-amber-500/20' : 'text-emerald-800 bg-emerald-900/5 font-bold border border-emerald-900/10'
                  }`}>{length}</span>
                </div>
                <input type="range" min="8" max="64" value={length} onChange={(e) => setLength(parseInt(e.target.value))} className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-500 ${theme === 'dark' ? 'bg-white/10' : 'bg-emerald-900/10'}`} />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-4">
                {Object.entries(options).map(([key, value]) => (
                  <button key={key} onClick={() => setOptions(prev => ({ ...prev, [key]: !value }))} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${value ? (theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-900/10 border-emerald-900/30 text-emerald-800') : (theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10' : 'bg-emerald-900/5 border-emerald-900/5 text-emerald-900/40 hover:border-emerald-900/20')}`}>
                    <span className="text-xs font-bold uppercase tracking-wider">{key}</span>
                    {value ? <Check size={14} /> : <div className={`w-3.5 h-3.5 rounded-full border ${theme === 'dark' ? 'border-gray-700' : 'border-emerald-900/20'}`} />}
                  </button>
                ))}
              </div>

              <div className="mt-auto space-y-4 pt-4">
                <button onClick={generatePassword} className={`group relative w-full font-bold py-5 rounded-2xl transition-all overflow-hidden flex items-center justify-center ${theme === 'dark' ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(6,78,59,0.2)]'}`}>
                  <div className="relative z-10 flex items-center gap-2">
                    <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500 shrink-0" />
                    <span>Generate Secure Password</span>
                  </div>
                </button>

                <div className="pt-2 text-center space-y-2 relative">
                  {/* Status Preview */}
                  <div className={`text-[10px] uppercase tracking-widest font-bold px-2 truncate ${
                    theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'
                  }`}>
                    {customWordlist.length > 0 
                      ? `Using: ${customWordlist.slice(0, 3).join(', ')}${customWordlist.length > 3 ? ', ...' : ''}` 
                      : 'No custom words added (using default list)'}
                  </div>

                  <button onClick={generatePassphrase} className={`group relative w-full font-bold py-5 rounded-2xl transition-all border flex items-center justify-center ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-emerald-900/5 border-emerald-900/10 hover:bg-emerald-900/10 text-emerald-950'}`}>
                    <div className="relative z-10 flex items-center gap-2">
                      <BookOpen size={20} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
                      <span>Smart Passphrase</span>
                    </div>
                  </button>

                  {/* Helper Text */}
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/60'}`}>
                    Generate passphrase using your custom words
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible Advanced Section */}
        <div className="mt-8">
          <button 
            onClick={() => setShowAdvancedTools(!showAdvancedTools)}
            className={`flex items-center justify-between w-full lg:w-auto lg:min-w-[300px] mx-auto px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest border transition-all shadow-sm ${
              theme === 'dark' ? 'bg-[#161616]/80 border-white/10 text-amber-500 hover:text-amber-400 hover:border-white/30 hover:bg-white/5' : 'bg-white border-emerald-900/10 text-emerald-800 hover:text-emerald-900 hover:border-emerald-900/30 shadow-emerald-900/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <Shield size={16} />
              <span>Advanced Security Tools</span>
            </div>
            <motion.div animate={{ rotate: showAdvancedTools ? 180 : 0 }} transition={{ duration: 0.3 }}>
              <Zap size={14} />
            </motion.div>
          </button>

          <AnimatePresence>
            {showAdvancedTools && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className={`border rounded-[2rem] p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ${
                  theme === 'dark' ? 'bg-[#161616]/60 border-white/10' : 'bg-white/80 border-white/60 shadow-emerald-900/5 ring-1 ring-inset ring-white'
                }`}>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Import */}
                    <div className="space-y-4">
                      <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/60'}`}>Import Tool</h3>
                      <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".txt" className="hidden" />
                      <button onClick={() => fileInputRef.current?.click()} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all group ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-emerald-900/5 border-emerald-900/10 hover:bg-emerald-900/10'}`}>
                        <div className="flex items-center gap-3">
                          <Upload size={18} className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'} />
                          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Analyze File</p>
                        </div>
                      </button>
                    </div>

                    {/* Dictionary */}
                    <div className="space-y-4">
                      <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/60'}`}>Dictionary</h3>
                      <button onClick={() => { setWordlistText(customWordlist.join('\n')); setShowWordlistModal(true); }} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all group ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-emerald-900/5 border-emerald-900/10 hover:bg-emerald-900/10'}`}>
                        <div className="flex items-center gap-3">
                          <FileText size={18} className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'} />
                          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Custom Words</p>
                        </div>
                        <span className="text-xs font-bold font-mono bg-amber-500/20 text-amber-500 px-2 py-1 rounded-md">{customWordlist.length}</span>
                      </button>
                    </div>

                    {/* QR Code */}
                    <div className="space-y-4">
                      <h3 className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/60'}`}>Export</h3>
                      <button onClick={() => setShowQr(true)} disabled={!password} className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border transition-all group ${theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 disabled:opacity-30' : 'bg-emerald-900/5 border-emerald-900/10 hover:bg-emerald-900/10 disabled:opacity-40'}`}>
                        <div className="flex items-center gap-3">
                          <QrCode size={18} className={theme === 'dark' ? 'text-blue-500' : 'text-blue-800'} />
                          <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>QR Transfer</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Move Tips Here */}
                  <div className={`mt-8 pt-8 border-t ${theme === 'dark' ? 'border-white/10' : 'border-emerald-900/10'}`}>
                    <h3 className={`text-xs font-bold uppercase tracking-widest mb-4 ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/60'}`}>Security Guide</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {[ 
                        { icon: <Shield size={16} />, title: "No PII", desc: "Never use your Student ID or birthday.", detail: "Personally Identifiable Information like your USN, birth date, or phone number are easily guessable by attackers. Use random words instead." },
                        { icon: <Lock size={16} />, title: "2FA", desc: "Always enable Duo or university 2FA.", detail: "Two-Factor Authentication adds a second layer of security. Even if your password is stolen, your account remains protected." },
                        { icon: <Info size={16} />, title: "Phishing", desc: "Never share your password with 'IT Support'.", detail: "University IT will never ask for your password via email or phone. Always check the URL before entering credentials." }
                      ].map((tip, i) => (
                        <div key={i} className={`p-4 rounded-2xl border space-y-2 ${theme === 'dark' ? 'bg-white/5 border-white/5' : 'bg-white/50 border-emerald-900/10'}`}>
                           <div className={`flex items-center gap-2 mb-2 ${theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}`}>{tip.icon} <span className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>{tip.title}</span></div>
                           <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/70'}`}>{tip.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Modals Below (Unchanged structural wrap, just kept here) */}
      {/* Wordlist Modal */}
      <AnimatePresence>
        {showWordlistModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowWordlistModal(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 20 }} className={`relative w-full max-w-lg border rounded-[2rem] p-8 shadow-2xl space-y-6 ${theme === 'dark' ? 'bg-[#161616] border-white/10' : 'bg-white border-emerald-900/10'}`}>
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold uppercase italic ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Custom Wordlist</h2>
                <button onClick={() => setShowWordlistModal(false)} className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-emerald-900/5 text-emerald-900/60'}`}><X size={20} /></button>
              </div>
              <textarea value={wordlistText} onChange={(e) => setWordlistText(e.target.value)} placeholder="campus&#10;security&#10;library" className={`w-full h-48 rounded-2xl border p-4 text-sm font-mono focus:outline-none focus:ring-2 ${theme === 'dark' ? 'bg-black/50 border-white/10 focus:ring-amber-500/50 text-white' : 'bg-emerald-50/50 border-emerald-900/10 focus:ring-emerald-800/30 text-emerald-950'}`} />
              <button onClick={handleWordlistSave} className={`w-full font-bold py-4 rounded-xl transition-all ${theme === 'dark' ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-emerald-800 hover:bg-emerald-700 text-white'}`}>Save Wordlist</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Modal */}
      <AnimatePresence>
        {showQr && password && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowQr(false)} className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className={`relative max-w-sm border rounded-[2rem] p-8 shadow-2xl space-y-6 text-center ${theme === 'dark' ? 'bg-[#161616] border-white/10' : 'bg-white border-emerald-900/10'}`}>
              <button onClick={() => setShowQr(false)} className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-emerald-900/5 text-emerald-900/60'}`}><X size={20} /></button>
              <h3 className={`text-xl font-bold uppercase italic ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Scan to Copy</h3>
              <div className="bg-white p-4 rounded-3xl inline-block"><QRCodeSVG value={password} size={200} level="H" includeMargin={false} /></div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-red-500">Warning: Never share in public spaces.</p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generator Side Panel */}
      <AnimatePresence>
        {isGeneratorPanelOpen && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setIsGeneratorPanelOpen(false)} 
              className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} 
              animate={{ x: 0 }} 
              exit={{ x: '100%' }} 
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`relative w-full max-w-[400px] h-full flex flex-col shadow-2xl overflow-y-auto border-l p-6 lg:p-8 space-y-6 ${theme === 'dark' ? 'bg-[#161616] border-white/10' : 'bg-white border-emerald-900/10'}`}
            >
              <div className="flex justify-between items-center">
                <h2 className={`text-xl font-bold uppercase italic ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Select Security</h2>
                <button onClick={() => setIsGeneratorPanelOpen(false)} className={`p-2 rounded-xl transition-colors ${theme === 'dark' ? 'hover:bg-white/5 text-gray-400' : 'hover:bg-emerald-900/5 text-emerald-900/60'}`}><X size={20} /></button>
              </div>

              {/* Mode Selector */}
              <div className={`flex items-center p-1 rounded-xl border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-emerald-900/5 border-emerald-900/10'}`}>
                {(['Maximum', 'Balanced', 'Easy'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setGenerationMode(mode)}
                    className={`flex-1 flex flex-col items-center justify-center py-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${
                      generationMode === mode
                        ? (theme === 'dark' ? 'bg-amber-500 text-black shadow-md' : 'bg-emerald-800 text-white shadow-[0_0_10px_rgba(6,78,59,0.3)]')
                        : (theme === 'dark' ? 'text-gray-400 hover:text-white hover:bg-white/5' : 'text-emerald-900/60 hover:text-emerald-900 hover:bg-emerald-900/5')
                    }`}
                  >
                    <span className="text-xl mb-1">{mode === 'Maximum' ? '🔒' : mode === 'Balanced' ? '🧠' : '🙂'}</span>
                    <span>{mode}</span>
                  </button>
                ))}
              </div>

              {/* Regenerate Button */}
              <button onClick={generatePassword} className={`w-full font-bold py-4 rounded-xl transition-all ${theme === 'dark' ? 'bg-white/5 hover:bg-white/10 text-white border border-white/10' : 'bg-emerald-900/5 hover:bg-emerald-900/10 text-emerald-950 border border-emerald-900/10'}`}>
                <div className="flex items-center justify-center gap-2">
                  <RefreshCw size={16} /> Regenerate Options
                </div>
              </button>

              {/* Options */}
              <div className="flex flex-col gap-3 flex-1">
                {generatedOptions.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => { setPassword(opt); setIsGeneratorPanelOpen(false); }}
                    className={`p-4 rounded-xl border text-sm font-mono transition-all text-left truncate flex flex-col gap-2 ${
                      theme === 'dark' ? 'bg-white/5 border-white/10 hover:bg-white/10 text-white' : 'bg-emerald-50 border-emerald-900/10 hover:bg-emerald-100 text-emerald-900'
                    }`}
                  >
                    <div className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-700'}>Option {idx + 1}</div>
                    <div className="text-lg tracking-wider opacity-90">{opt}</div>
                  </button>
                ))}
              </div>

              {/* Explainer */}
              <div className={`p-4 rounded-xl border text-[10px] uppercase font-bold tracking-wider space-y-2 mb-safe ${
                theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-400' : 'bg-emerald-900/5 border-emerald-900/10 text-emerald-900/60'
              }`}>
                 <div className="mb-3 opacity-70">Why this is strong:</div>
                 <div className="flex items-center gap-2"><Check size={12} className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-700'} /> High entropy rating</div>
                 <div className="flex items-center gap-2"><Check size={12} className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-700'} /> Diverse character set included</div>
                 <div className="flex items-center gap-2"><Check size={12} className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-700'} /> No predictable algorithms</div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
