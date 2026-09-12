import React, { useState } from 'react';
import { AlertTriangle, Check, Copy } from 'lucide-react';
import { useI18n } from './i18n';

export function CodeWindow({ title, code, onCopied }) {
  const [done, setDone] = useState(false);
  const { t } = useI18n();
  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setDone(true);
      onCopied?.();
      setTimeout(() => setDone(false), 1600);
    } catch {
      onCopied?.(t('component.copyFail'), true);
    }
  }
  return <div className="code-window">
    <div className="code-head">
      <span className="dots" aria-hidden="true"><i /><i /><i /></span>
      <span style={{ flex: 1, textAlign: 'center' }}>{title}</span>
      <button type="button" className={`copy-btn ${done ? 'is-done' : ''}`} onClick={copy} aria-label={t('component.copy')}>
        {done ? <><Check size={12} /> {t('component.copied')}</> : <><Copy size={12} /> {t('component.copy')}</>}
      </button>
    </div>
    <pre>{code}</pre>
  </div>;
}

export function LoadingBlock({ label }) {
  const { t } = useI18n();
  return <div className="loading-block"><div className="spinner" aria-hidden="true" />{label ?? t('component.loading')}</div>;
}

export function ErrorBlock({ message }) {
  return <p className="error-block" role="alert"><AlertTriangle size={18} style={{ flex: '0 0 auto' }} />{message}</p>;
}
