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

  const generatePassword = useCallback(() => {
    const charset = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~`|}{[]:;?><,./-=',
    };

    let characters = '';
    if (options.uppercase) characters += charset.uppercase;
    if (options.lowercase) characters += charset.lowercase;
    if (options.numbers) characters += charset.numbers;
    if (options.symbols) characters += charset.symbols;

    if (characters === '') return;

    let generated = '';
    for (let i = 0; i < length; i++) {
      generated += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setPassword(generated);
  }, [length, options]);

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

  const getStrength = (pwd: string): StrengthInfo => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-gray-200', feedback: [] };

    const commonPasswords = [
      'password', '123456', '12345678', 'qwerty', 'iloveyou', 'admin', 'login', 
      'campus', 'student', 'university', 'welcome', 'monkey', 'dragon', 
      'football', 'baseball', 'sunshine', 'princess', 'charlie', 'ginger', 
      'shadow', 'hunter', 'master', 'killer', 'hacker', 'secret', 'access', 
      'system', 'root', 'user', 'test', 'demo', 'sample', 'example', 
      'default', 'change', 'update', 'reset', 'forgot', 'help', 'support'
    ];

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
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full" />
            <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-emerald-600/5 blur-[120px] rounded-full" />
          </>
        )}
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <div className="absolute top-8 right-6">
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

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <header className="text-center space-y-4">
            <LockVisual score={strength.score} />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl uppercase italic">
              Campus <span className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}>Security</span>
            </h1>
            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/60'} text-lg max-w-md mx-auto`}>
              Protect your university credentials with our specialized strength analyzer and generator.
            </p>
          </header>

          {/* Main Card */}
          <div className={`border rounded-3xl p-8 shadow-2xl backdrop-blur-sm transition-all ${
            theme === 'dark' 
              ? 'bg-[#161616] border-white/5' 
              : 'bg-white border-emerald-900/10 shadow-emerald-900/5'
          }`}>
            <div className="space-y-8">
              {/* Password Input Area */}
              <div className="space-y-3">
                <label className={`text-sm font-medium ml-1 ${theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/50'}`}>Campus Account Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your campus password..."
                    className={`w-full border rounded-2xl px-6 py-5 text-xl font-mono focus:outline-none focus:ring-2 transition-all placeholder:text-gray-700 ${
                      theme === 'dark'
                        ? 'bg-black/40 border-white/10 focus:ring-amber-500/50'
                        : 'bg-emerald-50/50 border-emerald-900/10 focus:ring-emerald-800/30 text-emerald-950'
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className={`p-2.5 rounded-xl transition-colors ${
                        theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-emerald-900/5'
                      }`}
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2.5 rounded-xl transition-all ${
                        copied 
                          ? (theme === 'dark' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-800/10 text-emerald-800') 
                          : (theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-emerald-900/5')
                      }`}
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                    <button
                      onClick={() => setShowQr(true)}
                      className={`p-2.5 rounded-xl transition-colors ${
                        theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-emerald-900/5'
                      }`}
                      title="Share via QR Code"
                    >
                      <QrCode size={20} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Strength Indicator */}
              <div className="space-y-4">
                <div className="flex justify-between items-end px-1">
                  <div className="space-y-1">
                    <span className={`text-xs font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'}`}>Campus Security Score</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${
                        theme === 'dark' 
                          ? strength.color.replace('bg-', 'text-') 
                          : strength.color.replace('bg-', 'text-').replace('amber-500', 'emerald-700').replace('yellow-500', 'emerald-600').replace('red-500', 'red-700')
                      }`}>
                        {strength.label}
                      </span>
                      {strength.score >= 3 ? (
                        <ShieldCheck className={`w-5 h-5 ${theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}`} />
                      ) : strength.score >= 1 ? (
                        <Shield className={`w-5 h-5 ${theme === 'dark' ? 'text-yellow-500' : 'text-emerald-600'}`} />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-mono ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'}`}>
                    {password.length} characters
                  </span>
                </div>
                
                <div className={`h-2 w-full rounded-full overflow-hidden flex gap-1 p-0.5 ${theme === 'dark' ? 'bg-white/5' : 'bg-emerald-900/5'}`}>
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
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between px-1 pt-1">
                  <div className={`flex items-center gap-2 text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'}`}>
                    <Clock size={12} className={theme === 'dark' ? 'text-amber-500/70' : 'text-emerald-600'} />
                    <span>Estimated time to crack:</span>
                  </div>
                  <span className={`text-xs font-bold font-mono ${theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}`}>
                    {getTimeToCrack(password)}
                  </span>
                </div>

                <AnimatePresence>
                  {strength.feedback.length > 0 && password.length > 0 && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="flex flex-wrap gap-2 pt-2"
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

              {/* Controls */}
              <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t ${theme === 'dark' ? 'border-white/5' : 'border-emerald-900/10'}`}>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/60'}`}>Length</span>
                      <span className={`text-sm font-mono px-2 py-0.5 rounded ${
                        theme === 'dark' ? 'text-amber-500 bg-amber-500/10' : 'text-emerald-800 bg-emerald-900/5'
                      }`}>{length}</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className={`w-full h-1.5 rounded-lg appearance-none cursor-pointer accent-amber-500 ${
                        theme === 'dark' ? 'bg-white/10' : 'bg-emerald-900/10'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(options).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setOptions(prev => ({ ...prev, [key]: !value }))}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          value 
                            ? (theme === 'dark' ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' : 'bg-emerald-900/10 border-emerald-900/30 text-emerald-800') 
                            : (theme === 'dark' ? 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10' : 'bg-emerald-900/5 border-emerald-900/5 text-emerald-900/40 hover:border-emerald-900/20')
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">{key}</span>
                        {value ? <Check size={14} /> : <div className={`w-3.5 h-3.5 rounded-full border ${theme === 'dark' ? 'border-gray-700' : 'border-emerald-900/20'}`} />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-4">
                  <button
                    onClick={generatePassword}
                    className={`group relative w-full font-bold py-5 rounded-2xl transition-all overflow-hidden flex items-center justify-center ${
                      theme === 'dark'
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                        : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(6,78,59,0.2)] hover:shadow-[0_0_30px_rgba(6,78,59,0.3)]'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-3 px-4">
                      <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500 shrink-0" />
                      <span className="leading-tight">Generate Secure Key</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>

                  <button
                    onClick={generatePassphrase}
                    className={`group relative w-full font-bold py-5 rounded-2xl transition-all overflow-hidden flex items-center justify-center ${
                      theme === 'dark'
                        ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)]'
                        : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-[0_0_20px_rgba(6,78,59,0.2)] hover:shadow-[0_0_30px_rgba(6,78,59,0.3)]'
                    }`}
                  >
                    <div className="relative z-10 flex items-center gap-3 px-4">
                      <BookOpen size={20} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
                      <span className="leading-tight text-left">Generate Memorable Passphrase</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                  
                  <div className={`flex items-center gap-2 text-xs px-2 ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'}`}>
                    <Zap size={14} className={theme === 'dark' ? 'text-yellow-500' : 'text-emerald-600'} />
                    <span>Meets university security policy requirements.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Import Section */}
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <div className="flex-1">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all group ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    : 'bg-emerald-900/5 border-emerald-900/10 hover:bg-emerald-900/10 hover:border-emerald-900/20'
                }`}
              >
                <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
                  theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-800/10 text-emerald-800'
                }`}>
                  <Upload size={18} />
                </div>
                <div className="text-left">
                  <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Import Password</p>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'}`}>Analyze existing key</p>
                </div>
              </button>
            </div>

            <div className="flex-1">
              <button
                onClick={() => {
                  setWordlistText(customWordlist.join('\n'));
                  setShowWordlistModal(true);
                }}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl border transition-all group ${
                  theme === 'dark'
                    ? 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                    : 'bg-emerald-900/5 border-emerald-900/10 hover:bg-emerald-900/10 hover:border-emerald-900/20'
                }`}
              >
                <div className={`p-2 rounded-lg group-hover:scale-110 transition-transform ${
                  theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-800/10 text-emerald-800'
                }`}>
                  <FileText size={18} />
                </div>
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>Custom Wordlist</p>
                    {customWordlist.length > 0 && (
                      <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                    )}
                  </div>
                  <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/40'}`}>
                    {customWordlist.length > 0 ? `${customWordlist.length} words active` : 'Enter custom words'}
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Tips Section */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { 
                icon: <Shield size={18} />, 
                title: "No PII", 
                desc: "Avoid using your Student ID or birthday.",
                detail: "Personally Identifiable Information like your USN, birth date, or phone number are easily guessable by attackers. Use random words instead.",
                fullContent: (
                  <div className="space-y-4">
                    <p>Personally Identifiable Information (PII) includes any data that can be used to distinguish or trace an individual's identity. In a university context, this often includes your <strong>University Student Number (USN)</strong>, birth date, and campus email.</p>
                    <h4 className="font-bold">Why it matters:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Attackers often use publicly available PII to guess passwords or answer security questions.</li>
                      <li>Using your USN as part of your password makes it significantly easier for brute-force tools to crack your account.</li>
                      <li>Randomly generated passphrases provide much higher entropy than PII-based passwords.</li>
                    </ul>
                    <div className={`p-4 rounded-xl italic border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-emerald-900/5 border-emerald-900/10'}`}>
                      "A password like 'JohnDoe1995' can be cracked in seconds. A passphrase like 'campus-Secure-shield-access-159' would take centuries."
                    </div>
                  </div>
                )
              },
              { 
                icon: <Lock size={18} />, 
                title: "2FA", 
                desc: "Always enable Duo or university 2FA.",
                detail: "Two-Factor Authentication adds a second layer of security. Even if your password is stolen, your account remains protected.",
                fullContent: (
                  <div className="space-y-4">
                    <p>2FA is a security process in which users provide two different authentication factors to verify themselves. This adds a critical layer of protection beyond just a password.</p>
                    <h4 className="font-bold">How it works at our University:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Something you know:</strong> Your campus password.</li>
                      <li><strong>Something you have:</strong> A push notification on your mobile device (via Duo Mobile) or a physical security key.</li>
                    </ul>
                    <p>Even if an attacker successfully steals your password through phishing, they cannot access your account without the second factor. <strong>Never approve a 2FA request that you didn't initiate.</strong></p>
                  </div>
                )
              },
              { 
                icon: <Info size={18} />, 
                title: "Phishing", 
                desc: "Never share your password with 'IT Support'.",
                detail: "University IT will never ask for your password via email or phone. Always check the URL before entering credentials.",
                fullContent: (
                  <div className="space-y-4">
                    <p>Phishing is a type of social engineering where an attacker sends a fraudulent message designed to trick a person into revealing sensitive information.</p>
                    <h4 className="font-bold">Red Flags to Watch For:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li><strong>Urgent Language:</strong> "Your account will be deleted in 24 hours if you don't verify now."</li>
                      <li><strong>Suspicious Senders:</strong> Emails from 'IT Support' using a non-university domain (e.g., @gmail.com).</li>
                      <li><strong>Mismatched URLs:</strong> Hover over links to see the actual destination before clicking.</li>
                    </ul>
                    <p>University IT Services will <strong>never</strong> ask for your password via email, phone, or text message. If you are unsure, contact the IT Help Desk directly through official channels.</p>
                  </div>
                )
              }
            ].map((tip, i) => (
              <div 
                key={i} 
                className={`relative p-4 rounded-2xl border space-y-2 cursor-help transition-all group ${
                  theme === 'dark' ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-emerald-900/5 border-emerald-900/5 hover:bg-emerald-900/10'
                }`}
                onMouseEnter={() => setHoveredTip(i)}
                onMouseLeave={() => setHoveredTip(null)}
                onClick={() => {
                  setSelectedGuideSection(i);
                  setShowGuideModal(true);
                }}
              >
                <div className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}>{tip.icon}</div>
                <h3 className={`font-bold text-sm ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>{tip.title}</h3>
                <p className={`text-xs leading-relaxed ${theme === 'dark' ? 'text-gray-500' : 'text-emerald-900/50'}`}>{tip.desc}</p>
                
                <AnimatePresence>
                  {hoveredTip === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className={`absolute bottom-full left-0 right-0 mb-4 z-50 p-4 rounded-2xl border shadow-2xl backdrop-blur-md ${
                        theme === 'dark' 
                          ? 'bg-[#1a1a1a]/95 border-white/10 text-gray-300' 
                          : 'bg-white/95 border-emerald-900/10 text-emerald-900/70'
                      }`}
                    >
                      <p className="text-xs leading-relaxed mb-3">
                        {tip.detail}
                      </p>
                      <div 
                        className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 hover:underline ${
                          theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'
                        }`}
                      >
                        Read Full Guide <BookOpen size={10} />
                      </div>
                      {/* Arrow */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent ${
                        theme === 'dark' ? 'border-t-[#1a1a1a]/95' : 'border-t-white/95'
                      }`} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </section>
        </motion.div>
      </main>

      {/* Wordlist Modal */}
      <AnimatePresence>
        {showWordlistModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWordlistModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-lg border rounded-3xl p-8 shadow-2xl space-y-6 ${
                theme === 'dark' ? 'bg-[#161616] border-white/10' : 'bg-white border-emerald-900/10'
              }`}
            >
              <button
                onClick={() => setShowWordlistModal(false)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
                  theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-emerald-900/5'
                }`}
              >
                <X size={20} />
              </button>

              <div className="space-y-2">
                <h3 className={`text-xl font-bold uppercase tracking-tight italic ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>
                  Custom <span className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}>Wordlist</span>
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/60'}`}>
                  Enter words separated by spaces or new lines. These will be used for passphrase generation.
                  {wordlistText.trim() && (
                    <span className={`block mt-1 font-bold ${theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}`}>
                      {wordlistText.split(/\s+/).filter(w => w.length > 0).length} words detected
                    </span>
                  )}
                </p>
              </div>

              <textarea
                value={wordlistText}
                onChange={(e) => setWordlistText(e.target.value)}
                placeholder="Enter words here (e.g., apple banana cherry dragon...)"
                className={`w-full h-48 border rounded-2xl px-6 py-4 text-lg font-mono focus:outline-none focus:ring-2 transition-all resize-none ${
                  theme === 'dark'
                    ? 'bg-black/40 border-white/10 focus:ring-amber-500/50 text-white'
                    : 'bg-emerald-50/50 border-emerald-900/10 focus:ring-emerald-800/30 text-emerald-950'
                }`}
              />

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setWordlistText('');
                    setCustomWordlist([]);
                    setShowWordlistModal(false);
                  }}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                      : 'bg-emerald-900/5 text-emerald-900/60 hover:bg-emerald-900/10 hover:text-emerald-900'
                  }`}
                >
                  Reset
                </button>
                <button
                  onClick={handleWordlistSave}
                  className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'bg-emerald-800 text-white hover:bg-emerald-700'
                  }`}
                >
                  Save Wordlist
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Guide Modal */}
      <AnimatePresence>
        {showGuideModal && selectedGuideSection !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowGuideModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-2xl border rounded-3xl p-8 shadow-2xl space-y-6 max-h-[80vh] overflow-y-auto ${
                theme === 'dark' ? 'bg-[#161616] border-white/10' : 'bg-white border-emerald-900/10'
              }`}
            >
              <button
                onClick={() => setShowGuideModal(false)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
                  theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-emerald-900/5'
                }`}
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl ${theme === 'dark' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-800/10 text-emerald-800'}`}>
                  {[<Shield size={24} />, <Lock size={24} />, <Info size={24} />][selectedGuideSection]}
                </div>
                <h3 className={`text-2xl font-bold uppercase tracking-tight italic ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>
                  {["PII Protection", "Two-Factor Authentication", "Phishing Awareness"][selectedGuideSection]}
                </h3>
              </div>

              <div className={`text-sm leading-relaxed space-y-4 ${theme === 'dark' ? 'text-gray-300' : 'text-emerald-900/70'}`}>
                {[
                  (
                    <div className="space-y-4">
                      <p>Personally Identifiable Information (PII) includes any data that can be used to distinguish or trace an individual's identity. In a university context, this often includes your <strong>University Student Number (USN)</strong>, birth date, and campus email.</p>
                      <h4 className="font-bold text-base">Why it matters:</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li>Attackers often use publicly available PII to guess passwords or answer security questions.</li>
                        <li>Using your USN as part of your password makes it significantly easier for brute-force tools to crack your account.</li>
                        <li>Randomly generated passphrases provide much higher entropy than PII-based passwords.</li>
                      </ul>
                      <div className={`p-4 rounded-xl italic border ${theme === 'dark' ? 'bg-white/5 border-white/10' : 'bg-emerald-900/5 border-emerald-900/10'}`}>
                        "A password like 'JohnDoe1995' can be cracked in seconds. A passphrase like 'campus-Secure-shield-access-159' would take centuries."
                      </div>
                    </div>
                  ),
                  (
                    <div className="space-y-4">
                      <p>2FA is a security process in which users provide two different authentication factors to verify themselves. This adds a critical layer of protection beyond just a password.</p>
                      <h4 className="font-bold text-base">How it works at our University:</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Something you know:</strong> Your campus password.</li>
                        <li><strong>Something you have:</strong> A push notification on your mobile device (via Duo Mobile) or a physical security key.</li>
                      </ul>
                      <p>Even if an attacker successfully steals your password through phishing, they cannot access your account without the second factor. <strong>Never approve a 2FA request that you didn't initiate.</strong></p>
                    </div>
                  ),
                  (
                    <div className="space-y-4">
                      <p>Phishing is a type of social engineering where an attacker sends a fraudulent message designed to trick a person into revealing sensitive information.</p>
                      <h4 className="font-bold text-base">Red Flags to Watch For:</h4>
                      <ul className="list-disc pl-5 space-y-2">
                        <li><strong>Urgent Language:</strong> "Your account will be deleted in 24 hours if you don't verify now."</li>
                        <li><strong>Suspicious Senders:</strong> Emails from 'IT Support' using a non-university domain (e.g., @gmail.com).</li>
                        <li><strong>Mismatched URLs:</strong> Hover over links to see the actual destination before clicking.</li>
                      </ul>
                      <p>University IT Services will <strong>never</strong> ask for your password via email, phone, or text message. If you are unsure, contact the IT Help Desk directly through official channels.</p>
                    </div>
                  )
                ][selectedGuideSection]}
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={() => setShowGuideModal(false)}
                  className={`w-full py-4 rounded-2xl font-bold transition-all ${
                    theme === 'dark'
                      ? 'bg-amber-500 text-black hover:bg-amber-400'
                      : 'bg-emerald-800 text-white hover:bg-emerald-700'
                  }`}
                >
                  Got it, thanks!
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QR Code Modal */}
      <AnimatePresence>
        {showQr && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowQr(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`relative w-full max-w-sm border rounded-3xl p-8 shadow-2xl text-center space-y-6 ${
                theme === 'dark' ? 'bg-[#161616] border-white/10' : 'bg-white border-emerald-900/10'
              }`}
            >
              <button
                onClick={() => setShowQr(false)}
                className={`absolute top-4 right-4 p-2 rounded-xl transition-colors ${
                  theme === 'dark' ? 'text-gray-500 hover:text-white hover:bg-white/5' : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-emerald-900/5'
                }`}
              >
                <X size={20} />
              </button>
              
              <div className="space-y-2">
                <h3 className={`text-xl font-bold uppercase tracking-tight italic ${theme === 'dark' ? 'text-white' : 'text-emerald-950'}`}>
                  Scan to <span className={theme === 'dark' ? 'text-amber-500' : 'text-emerald-800'}>Copy</span>
                </h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-emerald-900/60'}`}>
                  Scan this QR code with your mobile device to securely transfer the password.
                </p>
              </div>

              <div className={`p-6 rounded-2xl inline-block shadow-2xl ${
                theme === 'dark' ? 'bg-white shadow-white/5' : 'bg-white shadow-emerald-900/10'
              }`}>
                <QRCodeSVG 
                  value={password} 
                  size={200}
                  level="H"
                  includeMargin={false}
                  fgColor={theme === 'dark' ? '#000000' : '#064e3b'}
                />
              </div>

              <div className="pt-2">
                <p className={`text-[10px] font-bold uppercase tracking-widest ${theme === 'dark' ? 'text-gray-600' : 'text-emerald-900/30'}`}>
                  Security Warning: Never share this QR code in public spaces.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className={`py-12 text-center text-sm ${theme === 'dark' ? 'text-gray-600' : 'text-emerald-900/30'}`}>
        <p>Copyright 2026 Campus Security Lab - University IT Services</p>
      </footer>
    </div>
  );
}
