/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
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
  X
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
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [length, setLength] = useState(16);
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
    const wordlist = [
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

    const words = [];
    // Pick 4 random words
    for (let i = 0; i < 4; i++) {
      let word = wordlist[Math.floor(Math.random() * wordlist.length)];
      if (i === 0) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      words.push(word);
    }
    
    // Add a random number at the end
    const num = Math.floor(Math.random() * 999);
    
    // Join with hyphens and add number
    const passphrase = words.join('-') + '-' + num;
    setPassword(passphrase);
  }, []);

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
    return (
      <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-6 transition-all duration-500">
        <AnimatePresence mode="wait">
          <motion.div
            key={score}
            initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            exit={{ scale: 0.8, opacity: 0, rotate: 10 }}
            className="relative"
          >
            {score === 0 && password.length > 0 ? (
              <div className="relative">
                <Lock className="w-10 h-10 text-red-500 opacity-40" />
                <motion.div 
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]">
                    <path d="M7 7l10 10M17 7L7 17" />
                  </svg>
                </motion.div>
              </div>
            ) : score === 4 ? (
              <div className="relative">
                <Lock className="w-10 h-10 text-blue-400 drop-shadow-[0_0_12px_rgba(96,165,250,0.5)]" />
                {/* Chains */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -inset-2 pointer-events-none"
                >
                  <div className="absolute top-0 left-0 -rotate-45">
                    <LinkIcon className="w-5 h-5 text-blue-300/80" />
                  </div>
                  <div className="absolute bottom-0 right-0 -rotate-45">
                    <LinkIcon className="w-5 h-5 text-blue-300/80" />
                  </div>
                  <div className="absolute top-0 right-0 rotate-45">
                    <LinkIcon className="w-5 h-5 text-blue-300/80" />
                  </div>
                  <div className="absolute bottom-0 left-0 rotate-45">
                    <LinkIcon className="w-5 h-5 text-blue-300/80" />
                  </div>
                </motion.div>
                {/* Reinforcement Ring */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute -inset-3 border-2 border-dashed border-blue-400/30 rounded-full"
                />
              </div>
            ) : score === 3 ? (
              <div className="relative">
                <Lock className="w-10 h-10 text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.4)]" />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute -inset-1 border border-emerald-400/40 rounded-xl"
                />
              </div>
            ) : (
              <Lock className={`w-10 h-10 ${score === 0 ? 'text-gray-600' : score === 1 ? 'text-orange-500' : 'text-yellow-500'}`} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
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
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-amber-500/30">
      {/* Background Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-amber-500/10 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-amber-600/10 blur-[120px] rounded-full" />
      </div>

      <main className="relative z-10 max-w-2xl mx-auto px-6 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12"
        >
          {/* Header */}
          <header className="text-center space-y-4">
            <LockVisual score={strength.score} />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl uppercase italic">
              Campus <span className="text-amber-500">Security</span>
            </h1>
            <p className="text-gray-400 text-lg max-w-md mx-auto">
              Protect your university credentials with our specialized strength analyzer and generator.
            </p>
          </header>

          {/* Main Card */}
          <div className="bg-[#161616] border border-white/5 rounded-3xl p-8 shadow-2xl backdrop-blur-sm">
            <div className="space-y-8">
              {/* Password Input Area */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-400 ml-1">Campus Account Password</label>
                <div className="relative group">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your campus password..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-5 text-xl font-mono focus:outline-none focus:ring-2 focus:ring-amber-500/50 transition-all placeholder:text-gray-700"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                    <button
                      onClick={copyToClipboard}
                      className={`p-2.5 rounded-xl transition-all ${copied ? 'bg-amber-500/20 text-amber-500' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}
                      title="Copy to clipboard"
                    >
                      {copied ? <Check size={20} /> : <Copy size={20} />}
                    </button>
                    <button
                      onClick={() => setShowQr(true)}
                      className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
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
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-500">Campus Security Score</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${strength.color.replace('bg-', 'text-')}`}>
                        {strength.label}
                      </span>
                      {strength.score >= 3 ? (
                        <ShieldCheck className="w-5 h-5 text-amber-500" />
                      ) : strength.score >= 1 ? (
                        <Shield className="w-5 h-5 text-yellow-500" />
                      ) : (
                        <ShieldAlert className="w-5 h-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <span className="text-xs text-gray-500 font-mono">
                    {password.length} characters
                  </span>
                </div>
                
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden flex gap-1 p-0.5">
                  {[0, 1, 2, 3].map((i) => (
                    <div 
                      key={i}
                      className={`h-full flex-1 rounded-full transition-all duration-500 ${
                        i <= strength.score - 1 ? strength.color : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between px-1 pt-1">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock size={12} className="text-amber-500/70" />
                    <span>Estimated time to crack:</span>
                  </div>
                  <span className="text-xs font-bold text-amber-500 font-mono">
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
                        <span key={i} className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 bg-red-500/10 text-red-400 rounded-md border border-red-500/20">
                          {f}
                        </span>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-sm font-medium text-gray-400">Length</span>
                      <span className="text-sm font-mono text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">{length}</span>
                    </div>
                    <input
                      type="range"
                      min="8"
                      max="64"
                      value={length}
                      onChange={(e) => setLength(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(options).map(([key, value]) => (
                      <button
                        key={key}
                        onClick={() => setOptions(prev => ({ ...prev, [key]: !value }))}
                        className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${
                          value 
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' 
                            : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/10'
                        }`}
                      >
                        <span className="text-xs font-bold uppercase tracking-wider">{key}</span>
                        {value ? <Check size={14} /> : <div className="w-3.5 h-3.5 rounded-full border border-gray-700" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-end gap-4">
                  <button
                    onClick={generatePassword}
                    className="group relative w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-5 rounded-2xl transition-all overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center"
                  >
                    <div className="relative z-10 flex items-center gap-3 px-4">
                      <RefreshCw size={20} className="group-hover:rotate-180 transition-transform duration-500 shrink-0" />
                      <span className="leading-tight">Generate Secure Key</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>

                  <button
                    onClick={generatePassphrase}
                    className="group relative w-full bg-amber-500 hover:bg-amber-400 text-black font-bold py-5 rounded-2xl transition-all overflow-hidden shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] flex items-center justify-center"
                  >
                    <div className="relative z-10 flex items-center gap-3 px-4">
                      <BookOpen size={20} className="group-hover:scale-110 transition-transform duration-300 shrink-0" />
                      <span className="leading-tight text-left">Generate Memorable Passphrase</span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </button>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 px-2">
                    <Zap size={14} className="text-yellow-500" />
                    <span>Meets university security policy requirements.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips Section */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: <Shield size={18} />, title: "No PII", desc: "Avoid using your Student ID or birthday." },
              { icon: <Lock size={18} />, title: "2FA", desc: "Always enable Duo or university 2FA." },
              { icon: <Info size={18} />, title: "Phishing", desc: "Never share your password with 'IT Support'." }
            ].map((tip, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 space-y-2">
                <div className="text-amber-500">{tip.icon}</div>
                <h3 className="font-bold text-sm">{tip.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </section>
        </motion.div>
      </main>

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
              className="relative w-full max-w-sm bg-[#161616] border border-white/10 rounded-3xl p-8 shadow-2xl text-center space-y-6"
            >
              <button
                onClick={() => setShowQr(false)}
                className="absolute top-4 right-4 p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
              >
                <X size={20} />
              </button>
              
              <div className="space-y-2">
                <h3 className="text-xl font-bold uppercase tracking-tight italic">
                  Scan to <span className="text-amber-500">Copy</span>
                </h3>
                <p className="text-sm text-gray-400">
                  Scan this QR code with your mobile device to securely transfer the password.
                </p>
              </div>

              <div className="bg-white p-6 rounded-2xl inline-block shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <QRCodeSVG 
                  value={password} 
                  size={200}
                  level="H"
                  includeMargin={false}
                  imageSettings={{
                    src: "https://ais-dev-xthfhpg3fsfmbknmwoyhtu-754809295729.asia-southeast1.run.app/favicon.ico",
                    x: undefined,
                    y: undefined,
                    height: 24,
                    width: 24,
                    excavate: true,
                  }}
                />
              </div>

              <div className="pt-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-gray-600">
                  Security Warning: Never share this QR code in public spaces.
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 text-center text-gray-600 text-sm">
        <p>Copyright 2026 Campus Security Lab - University IT Services</p>
      </footer>
    </div>
  );
}
