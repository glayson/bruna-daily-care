import { useCallback, useEffect, useRef, useState } from 'react';

export const STORAGE_KEYS = {
  days: 'bdc:days',
  pantry: 'bdc:pantry',
  settings: 'bdc:settings',
};

export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw == null ? fallback : JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('Falha ao salvar no localStorage', err);
  }
}

/** Estado React sincronizado com localStorage (gravação imediata). */
export function usePersistentState(key, initial) {
  const [value, setValue] = useState(() => {
    const fallback = typeof initial === 'function' ? initial() : initial;
    return readJSON(key, fallback);
  });
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      if (localStorage.getItem(key) != null) return;
    }
    writeJSON(key, value);
  }, [key, value]);

  // Mantém várias abas/janelas sincronizadas.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === key && e.newValue != null) {
        try {
          setValue(JSON.parse(e.newValue));
        } catch {
          /* ignora */
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [key]);

  const reset = useCallback(
    (v) => setValue(typeof v === 'function' ? v : () => v),
    [],
  );
  return [value, setValue, reset];
}

export const BACKUP_APP_ID = 'bruna-daily-care';

export function buildBackup({ days, pantry, settings }) {
  return {
    app: BACKUP_APP_ID,
    version: 1,
    exportedAt: new Date().toISOString(),
    days,
    pantry,
    settings,
  };
}

export function validateBackup(data) {
  if (!data || typeof data !== 'object') throw new Error('Arquivo inválido.');
  if (data.app !== BACKUP_APP_ID) throw new Error('Este arquivo não é um backup do Bruna Daily Care.');
  if (typeof data.days !== 'object' || !Array.isArray(data.pantry)) {
    throw new Error('Backup incompleto ou corrompido.');
  }
  return {
    days: data.days ?? {},
    pantry: data.pantry,
    settings: data.settings ?? {},
  };
}

