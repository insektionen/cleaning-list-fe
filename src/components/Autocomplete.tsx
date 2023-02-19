import { Combobox } from '@headlessui/react';
import { Fragment, Key, ReactNode } from 'react';
import Check from '../icons/Check';
import Expand from '../icons/Expand';
import classes from '../util/classes';
import Spin from './Spin';

type AutocompleteProps<T> = {
	value: T;
	setValue: (value: T) => void;
	displayValue: (value: T) => string;
	label?: string;
	onChange: (query: string) => void;
	options: T[];
	optionMap: (option: T) => { key: Key; display: ReactNode };
	compareBy?: (a: T, b: T) => boolean;
	onBlur?: () => void;
	loading?: boolean;
};

export default function Autocomplete<T>({
	value,
	setValue,
	displayValue,
	label,
	onChange,
	options,
	optionMap,
	compareBy,
	onBlur,
	loading,
}: AutocompleteProps<T>) {
	return (
		<Combobox value={value} onChange={setValue} by={compareBy}>
			<div className="autocomplete">
				{label && <Combobox.Label>{label}</Combobox.Label>}
				<div className="autocomplete-input">
					<Combobox.Input
						onChange={(event) => onChange(event.target.value)}
						displayValue={displayValue}
						onBlur={onBlur}
					/>
					<div className="autocomplete-input-special">
						{loading ? (
							<Spin />
						) : (
							<Combobox.Button className="autocomplete-input-action">
								<Expand size="1em" />
							</Combobox.Button>
						)}
					</div>
				</div>
				{!loading && (
					<Combobox.Options>
						{options.length ? (
							options.map((option) => {
								const { key, display } = optionMap(option);
								return (
									<Combobox.Option key={key} value={option} as={Fragment}>
										{({ active, selected }) => (
											<li className={classes('clickable', active && 'active-item')}>
												{selected && <Check className="selected-item" />}
												<div className="item-content">{display}</div>
											</li>
										)}
									</Combobox.Option>
								);
							})
						) : (
							<div className="no-results">Nothing found</div>
						)}
					</Combobox.Options>
				)}
			</div>
		</Combobox>
	);
}
