import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { AVAILABLE_LANGUAGES, DEFAULT_LANGUAGE, Language, LANGUAGE_MAP } from './language';

type Translation = { [key: string]: string | Translation };

const LS_TOKEN_KEY = 'in-cleaning:lang';

const TranslationContext = createContext<{
	t: (...keys: string[]) => string;
	loading: boolean;
	language: Language;
	setLanguage: (language: Language) => void;
}>({
	t: () => '',
	loading: true,
	language: 'sv',
	setLanguage: () => {},
});

export const useTranslate = () => useContext(TranslationContext);

export function TranslationProvider({ children }: { children: ReactNode }) {
	const [loading, setLoading] = useState(true);
	const [language, setLanguageInternal] = useState<Language>(DEFAULT_LANGUAGE);
	const [translation, setTranslation] = useState<Translation>();

	useEffect(() => {
		const language = localStorage.getItem(LS_TOKEN_KEY) as Language;
		if (language && AVAILABLE_LANGUAGES.includes(language)) return setLanguageInternal(language);

		localStorage.setItem(LS_TOKEN_KEY, DEFAULT_LANGUAGE);
		setLanguageInternal(DEFAULT_LANGUAGE);
	}, []);

	useEffect(() => {
		if (language) getTranslation();
	}, [language]);

	useEffect(() => {
		if (translation) setLoading(false);
	}, [translation]);

	async function getTranslation() {
		setLoading(true);

		try {
			const translation = await import(`../assets/translations/${language}.json`);
			setTranslation(translation.default);
		} catch (e) {
			try {
				const translation = await import(`../assets/translations/${DEFAULT_LANGUAGE}.json`);
				// TODO: Remove `if` condition after english translations have been added
				if (language !== 'en')
					toast.error(
						`Could not find translations for ${LANGUAGE_MAP[language]} so is using ${LANGUAGE_MAP[DEFAULT_LANGUAGE]} as fallback`
					);
				setTranslation(translation.default);
			} catch (e) {
				toast.error(
					`Failed to load defaulted language '${LANGUAGE_MAP[DEFAULT_LANGUAGE]}'. Make sure you're connected to the internet and reloading the window. Report this as a bug if the problem persists.`
				);
			}
		}
		setLoading(false);
	}

	function t(...keys: string[]) {
		const key = keys.join('.');
		if (!translation) return key;

		const parts = key.split('.');
		let res: string;
		let translationPart: string | Translation = translation;
		for (let i = 0; i < parts.length; i++) {
			const part = parts[i];
			if (typeof translationPart === 'string' || !translationPart[part]) return key;

			translationPart = translationPart[part];
		}

		if (typeof translationPart !== 'string') return key;
		return translationPart;
	}

	function setLanguage(language: Language) {
		localStorage.setItem(LS_TOKEN_KEY, language);
		setLanguageInternal(language);
		toast.success(`Set the language to ${LANGUAGE_MAP[language]}`);
	}

	return (
		<TranslationContext.Provider
			value={{
				t,
				loading,
				language,
				setLanguage: setLanguage,
			}}
		>
			{children}
		</TranslationContext.Provider>
	);
}
