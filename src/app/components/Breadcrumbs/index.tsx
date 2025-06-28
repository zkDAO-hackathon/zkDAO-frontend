import Link from "next/link";

interface BreadcrumbsProps {
	items: {
		label: string;
		href?: string;
	}[];
}

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
	return (
		<div className='breadcrumbs text-sm'>
			<ul>
				{items.map((item, index) => (
					<li key={index}>{item.href ? <Link href={item.href}>{item.label}</Link> : item.label}</li>
				))}
			</ul>
		</div>
	);
};
export default Breadcrumbs;
