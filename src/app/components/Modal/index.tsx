interface ModalProps {
	id: string;
	className?: string;
	children: React.ReactNode;
}
const Modal = (props: ModalProps) => {
	return (
		<dialog id={props.id} className='modal'>
			<div className={`modal-box` + (props.className ? ` ${props.className}` : "")}>
				<form method='dialog'>
					<button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
				</form>
				{props.children}
			</div>
		</dialog>
	);
};
export default Modal;
