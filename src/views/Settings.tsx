import { useMemo, useState } from 'react';
import Page from '../components/Page';
import Select from '../components/Select';
import Spin from '../components/Spin';
import { useUser } from '../user/user.context';
import { AVAILABLE_LANGUAGES, Language, LANGUAGE_MAP } from '../util/language';
import { useTranslate } from '../util/translation';

export default function Settings() {
	const { invalidateToken } = useUser();
	const {
		loading: loadingLanguage,
		language: currentLanguage,
		setLanguage: setCurrentLanguage,
	} = useTranslate();
	const loading = loadingLanguage;

	const [language, setLanguage] = useState<Language>();

	const canSave = useMemo(() => {
		if (loading) return false;
		if (language && language !== currentLanguage) return true;

		return false;
	}, [loading, language, currentLanguage]);

	function saveCanges() {
		if (!canSave) return;

		if (language && language !== currentLanguage) setCurrentLanguage(language);
	}

	return (
		<Page header="Settings" headerColor="#f5ad14">
			<button onClick={invalidateToken}>Sign Out</button>
			<div className="divider" />

			<Select
				value={language ?? currentLanguage}
				options={AVAILABLE_LANGUAGES.map((key) => ({ key, display: LANGUAGE_MAP[key] }))}
				onChange={setLanguage}
			/>
			<button style={{ marginTop: '0.5rem' }} disabled={!canSave} onClick={saveCanges}>
				{loading ? <Spin /> : 'Save changes'}
			</button>
		</Page>
	);
}
