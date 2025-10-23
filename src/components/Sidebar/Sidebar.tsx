import {
	BookOpenIcon,
	FileCodeIcon,
	Github,
	HomeIcon,
	Menu,
	SettingsIcon,
	XIcon,
} from 'lucide-react';
import { usePage, useSidebar } from '@/store';

export const Sidebar = () => {
	const { setSidebarOpen, isOpen } = useSidebar();
	const { currentPage, setCurrentPage } = usePage();
	const handleCloseSideBar = () => setSidebarOpen(false);
	const navItems = [
		{ id: 'dashboard', label: 'Dashboard', icon: HomeIcon },
		{ id: 'review', label: 'Code Review', icon: FileCodeIcon },
		{
			id: 'standards',
			label: 'Code Standards',
			icon: BookOpenIcon,
		},
		{ id: 'github', label: 'GitHub', icon: Github },
		{ id: 'settings', label: 'Settings', icon: SettingsIcon },
	];

	return (
		<>
			{isOpen ? (
				<aside className="sidebar">
					<div className="p-4 border-b border-slate-700">
						<div className="flex items-center justify-between mb-4">
							<h1 className="text-xl font-bold">Ollama Code Review</h1>
							<button
								type="button"
								onClick={handleCloseSideBar}
								className="p-1 rounded hover:bg-slate-700"
							>
								<XIcon size={20} />
							</button>
						</div>
						<p className="text-sm text-gray-400">AI-Powered Code Review</p>
					</div>
					<nav className="p-2">
						{navItems.map(({ id, label, icon: Icon }) => (
							<button
								key={id}
								type="button"
								className={`nav-item ${currentPage === id ? 'active' : ''}`}
								onClick={() => setCurrentPage(id)}
							>
								<Icon size={20} />
								<span>{label}</span>
							</button>
						))}
					</nav>
				</aside>
			) : (
				<div className="p-6">
					<button
						type="button"
						onClick={() => setSidebarOpen(true)}
						className="btn btn-secondary mb-4 flex items-center"
					>
						<Menu size={20} />
						<span className="ml-2">Menu</span>
					</button>
				</div>
			)}
		</>
	);
};
