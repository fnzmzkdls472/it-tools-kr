import messages from '@intlify/unplugin-vue-i18n/messages';
import { get } from '@vueuse/core';
import type { Plugin } from 'vue';
import { createI18n } from 'vue-i18n';

const i18n = createI18n({
  legacy: false,
  locale: 'ko',
  fallbackLocale: 'en',
  messages,
});

export const i18nPlugin: Plugin = {
  install: (app) => {
    app.use(i18n);
  },
};

export const translate = function (localeKey: string) {
  const locale = get(i18n.global.locale);
  // 현재 언어(ko)에 키가 없으면 영어(en)로 폴백 — 번역 안 된 원본 도구명이 키 문자열로 깨지지 않도록
  const hasKey = i18n.global.te(localeKey, locale) || i18n.global.te(localeKey, 'en');
  return hasKey ? i18n.global.t(localeKey) : localeKey;
};
