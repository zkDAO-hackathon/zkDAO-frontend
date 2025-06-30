import HeroLanding from "../HeroLanding";
import BoxDAOS from "./BoxDAOS";
import QuequedProposal from "./QuequedDAO";
import { useStore } from "@/app/store";

const ExplorerDAOS = () => {
	const { queuedProposals } = useStore();

	return (
		<>
			<HeroLanding />
			{queuedProposals.length > 0 && <QuequedProposal />}
			<BoxDAOS />
		</>
	);
};

export default ExplorerDAOS;
