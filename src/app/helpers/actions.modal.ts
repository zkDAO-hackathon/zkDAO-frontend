const openModal = (modalId: string) => {
	const modal = document.getElementById(modalId) as HTMLDialogElement | null;
	if (modal) {
		modal.showModal();
	} else {
		console.error(`Modal with id ${modalId} not found.`);
	}
};

const closeModal = (modalId: string) => {
	const modal = document.getElementById(modalId) as HTMLDialogElement | null;
	if (modal) {
		modal.close();
	} else {
		console.error(`Modal with id ${modalId} not found.`);
	}
};

export { openModal, closeModal };
