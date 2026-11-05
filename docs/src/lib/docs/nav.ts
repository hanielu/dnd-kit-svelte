export interface DocPage {
	title: string;
	href: string;
}

export interface DocSection {
	title: string;
	pages: DocPage[];
}

export const nav: DocSection[] = [
	{
		title: "Getting started",
		pages: [
			{ title: "Introduction", href: "/docs" },
			{ title: "Quickstart", href: "/docs/quickstart" },
		],
	},
	{
		title: "Concepts",
		pages: [
			{ title: "Inputs and outputs", href: "/docs/inputs-and-outputs" },
			{ title: "Hooks without components", href: "/docs/hooks-without-components" },
		],
	},
	{
		title: "Guides",
		pages: [
			{ title: "Sortable lists", href: "/docs/sortable-lists" },
			{ title: "Multiple lists", href: "/docs/multiple-lists" },
			{ title: "Drag handles", href: "/docs/drag-handles" },
			{ title: "Drag overlay", href: "/docs/drag-overlay" },
			{ title: "Feedback", href: "/docs/feedback" },
			{ title: "Modifiers", href: "/docs/modifiers" },
			{ title: "Sensors", href: "/docs/sensors" },
			{ title: "Events", href: "/docs/events" },
		],
	},
	{
		title: "API",
		pages: [
			{ title: "DragDropProvider", href: "/docs/api/drag-drop-provider" },
			{ title: "DragOverlay", href: "/docs/api/drag-overlay" },
			{ title: "useDraggable", href: "/docs/api/use-draggable" },
			{ title: "useDroppable", href: "/docs/api/use-droppable" },
			{ title: "useSortable", href: "/docs/api/use-sortable" },
			{ title: "useDragDropMonitor", href: "/docs/api/use-drag-drop-monitor" },
			{ title: "useDragOperation", href: "/docs/api/use-drag-operation" },
			{ title: "useDragDropManager", href: "/docs/api/use-drag-drop-manager" },
			{ title: "useInstance", href: "/docs/api/use-instance" },
			{ title: "Modifiers", href: "/docs/api/modifiers" },
		],
	},
	{
		title: "Reference",
		pages: [
			{ title: "Differences from React", href: "/docs/differences-from-react" },
			{ title: "Upgrading from 0.1", href: "/docs/upgrading" },
		],
	},
];

export const pages = nav.flatMap((section) => section.pages);

/** The docs page at `pathname`, ignoring a trailing slash. */
export function findPage(pathname: string): DocPage | undefined {
	const path = pathname.replace(/\/$/, "") || "/";
	return pages.find((page) => page.href === path);
}
