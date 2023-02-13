export const AVAILABLE_LANGUAGES = ['sv', 'en'] as const;

export type Language = typeof AVAILABLE_LANGUAGES[number];

export const DEFAULT_LANGUAGE: Language = 'sv';

export const LANGUAGE_MAP: Record<Language, string> = {
	sv: 'Swedish',
	en: 'English',
};
