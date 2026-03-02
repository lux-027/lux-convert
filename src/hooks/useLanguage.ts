'use client';

import { useState, useEffect } from 'react';

const dictionaries = {
  tr: () => import('../dictionaries/tr.json').then(module => module.default),
  en: () => import('../dictionaries/en.json').then(module => module.default),
};

export type Language = 'tr' | 'en';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('tr');
  const [dictionary, setDictionary] = useState<any>(null);

  useEffect(() => {
    // localStorage'dan dil seçimini al
    const savedLanguage = localStorage.getItem('lux-convert-language') as Language;
    if (savedLanguage && (savedLanguage === 'tr' || savedLanguage === 'en')) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    // Dil değiştiğinde dictionary'yi yükle
    dictionaries[language]().then(dict => {
      setDictionary(dict);
    }).catch(error => {
      console.log('Dictionary yükleme hatası:', error);
      // Hata durumunda boş dictionary ayarla
      setDictionary({});
    });
  }, [language]);

  const changeLanguage = (newLanguage: Language) => {
    console.log('Dil değişti:', newLanguage.toUpperCase());
    setLanguage(newLanguage);
    try {
      localStorage.setItem('lux-convert-language', newLanguage);
    } catch (error) {
      console.log('LocalStorage hatası:', error);
    }
  };

  const t = (key: string) => {
    if (!dictionary) return key;
    
    // Nested key'leri destekle (örn: 'home.title')
    const keys = key.split('.');
    let value = dictionary;
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };

  return {
    language,
    changeLanguage,
    t,
    isLoading: !dictionary,
  };
}
