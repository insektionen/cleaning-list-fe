type ClassDefinition = string | null | boolean | undefined;

export default function classes(
	...classList: (ClassDefinition | ClassDefinition[])[]
): string | undefined {
	const list = classList.flatMap((name) => name).filter((val) => val && typeof val === 'string');

	if (!list.length) return undefined;
	return list.join(' ');
}
