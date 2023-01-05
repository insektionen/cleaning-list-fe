import moment from 'moment';
import { dashlessDateRegex, dateRegex } from './regex';

export default function validateDate(date: string): string | null {
	if (date.match(dashlessDateRegex)) {
		date = `${date.substring(0, 4)}-${date.substring(4, 6)}-${date.substring(6)}`;
	} else if (!date.match(dateRegex)) {
		return null;
	}

	if (!moment(date).isValid()) return null;

	return date;
}
