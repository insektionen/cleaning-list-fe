import moment from 'moment';
import { dateRegex } from './regex';

export default function validateDate(date: string): string | null {
	if (!date.match(dateRegex)) return null;
	if (!moment(date).isValid()) return null;

	return date;
}
