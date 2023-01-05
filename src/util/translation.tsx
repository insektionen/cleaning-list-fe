import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

type Translation = { [key: string]: string | Translation };

// const LS_TOKEN_KEY = 'in-cleaning:lang';
const DEFAULT_LANGUAGE = 'sv';

const TranslationContext = createContext<{
	t: (...keys: string[]) => string;
	loading: boolean;
	// language: string;
	// setLanguage: (language: string) => void;
}>({ t: () => '', loading: true /*, language: 'sv', setLanguage: () => {}*/ });

export const useTranslate = () => useContext(TranslationContext);

export function TranslationProvider({ children }: { children: ReactNode }) {
	const [loading, setLoading] = useState(true);
	const [language, setLanguage] = useState<string>(DEFAULT_LANGUAGE);
	const [translation, setTranslation] = useState<Translation>();

	// useEffect(() => {
	// 	const language = localStorage.getItem(LS_TOKEN_KEY);
	// 	if (language) return setLanguage(language);

	// 	localStorage.setItem(LS_TOKEN_KEY, DEFAULT_LANGUAGE);
	// 	setLanguage(DEFAULT_LANGUAGE);
	// }, []);

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
			toast.error(`Could not find translations for language '${language}'`);
			setLoading(false);
		}
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

	return (
		<TranslationContext.Provider value={{ t, loading }}>{children}</TranslationContext.Provider>
	);
}
