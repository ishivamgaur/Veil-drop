import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../ui/Card';
import { Switch } from '../ui/Switch';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { generateEphemeralPin } from '../../utils/helpers';

/**
 * Privacy & Encryption Controls Panel
 * Swiss minimalist architectural panel for managing AES-GCM ciphers and session salts without icon clutter.
 */
export default function VeilPrivacyPanel({ addToast }) {
  const [isPrivacyActive, setIsPrivacyActive] = useState(true);
  const [pin, setPin] = useState('0 0 0 - 0 0 0');
  const [copied, setCopied] = useState(false);

  const refreshPin = () => {
    setPin(generateEphemeralPin());
    if (addToast) addToast('Generated fresh verification token.');
  };

  const copyPin = () => {
    navigator.clipboard.writeText(pin);
    setCopied(true);
    if (addToast) addToast('Ephemeral token copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    setPin(generateEphemeralPin());
  }, []);

  const handleToggle = (val) => {
    setIsPrivacyActive(val);
    if (addToast) {
      if (val) addToast('Veil Privacy enabled (AES-GCM cipher active).');
      else addToast('Veil Privacy disabled (Standard Direct Drop).');
    }
  };

  return (
    <Card className="border-[#22242b] bg-[#101114] shadow-none">
      <CardHeader className="flex-row items-center justify-between pb-4 mb-4 border-b border-[#22242b]">
        <div>
          <CardTitle className="text-base font-bold text-[#f2f3f7]">Veil Cryptography</CardTitle>
          <span className="text-[10px] font-mono uppercase text-[#71747e] tracking-widest block mt-0.5">Client-Side Cipher</span>
        </div>
        
        <Switch
          checked={isPrivacyActive}
          onCheckedChange={handleToggle}
          title="Toggle end-to-end encryption"
        />
      </CardHeader>

      <CardContent className="space-y-5">
        <CardDescription className="text-xs text-[#888b94] leading-relaxed">
          {isPrivacyActive ? (
            <span>Payloads undergo localized <strong className="text-[#f2f3f7] font-mono">AES-256-GCM</strong> encapsulation before leaving your machine.</span>
          ) : (
            <span className="text-[#fbbf24]">Unencrypted mode active. Raw file chunks stream without encryption wrappers.</span>
          )}
        </CardDescription>

        {/* Cryptographic Token Box */}
        <div
          className={`p-4 rounded-xl border transition-all duration-200 ${
            isPrivacyActive
              ? 'bg-[#070708] border-[#22242b] opacity-100'
              : 'bg-[#070708]/50 border-[#1a1c22] opacity-40 pointer-events-none'
          }`}
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-[#71747e] mb-3 uppercase tracking-wider">
            <span>Session Token</span>
            <Badge variant={isPrivacyActive ? "luxury" : "neutral"} className="px-2 py-0 text-[9px]">
              {isPrivacyActive ? "Active" : "Off"}
            </Badge>
          </div>

          <div className="flex items-center justify-between gap-3 bg-[#121419] px-3.5 py-2.5 rounded-lg border border-[#22242b]">
            <div className="text-base font-mono font-bold tracking-widest text-[#f2f3f7] select-all flex-1">
              {pin}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={copyPin}
                className="h-8 px-3 text-xs font-mono text-[#cccccc] hover:bg-[#1f2229]"
              >
                {copied ? "Copied" : "Copy"}
              </Button>
              
              <Button
                variant="secondary"
                size="sm"
                onClick={refreshPin}
                className="h-8 px-3 text-xs font-mono text-[#9499a3] bg-[#16181d] hover:text-white"
              >
                Reset
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
