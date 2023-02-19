import { MutableRefObject, ReactNode } from 'react';
import { Dialog } from '@headlessui/react';

type ModalProps = {
	open?: boolean;
	onClose?: () => void;
	onOpen?: () => void;
	title?: string;
	actions?: ReactNode[];
	initialFocus?: MutableRefObject<HTMLButtonElement | null>;
	children: ReactNode;
};

export default function Modal({
	open,
	onClose,
	title,
	actions,
	initialFocus,
	children,
}: ModalProps) {
	return (
		<Dialog
			open={open}
			onClose={onClose ?? (() => {})}
			className="modal"
			initialFocus={initialFocus}
		>
			<section>
				<div>
					<Dialog.Panel className="modal-body">
						<div className="modal-content">
							{title && <Dialog.Title>{title}</Dialog.Title>}

							{children}
						</div>

						{!!actions?.length && <div className="modal-actions">{actions}</div>}
					</Dialog.Panel>
				</div>
			</section>
		</Dialog>
	);
}
