import { Links, Meta, Outlet, Scripts, ScrollRestoration, Link } from "@remix-run/react";
import { useState, useEffect, useRef } from "react";
import "./tailwind.css";

export function Layout({ children }: { children: React.ReactNode }) {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
	const [userMenuOpen, setUserMenuOpen] = useState(false);
	const [workspacesOpen, setWorkspacesOpen] = useState(false);
	const [darkMode, setDarkMode] = useState(false);
	const sidebarRef = useRef<HTMLDivElement>(null);
	const userMenuRef = useRef<HTMLDivElement>(null);
	const workspaceMenuRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
				setSidebarOpen(false);
			}
			if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
				setUserMenuOpen(false);
			}
			if (workspaceMenuRef.current && !workspaceMenuRef.current.contains(event.target as Node)) {
				setWorkspacesOpen(false);
			}
		}

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	useEffect(() => {
		// Check for user's preference
		if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
			setDarkMode(true);
		}
	}, []);

	useEffect(() => {
		if (darkMode) {
			document.documentElement.classList.add("dark");
		} else {
			document.documentElement.classList.remove("dark");
		}
	}, [darkMode]);

	return (
		<html lang="en" className="h-full bg-slate-100 dark:bg-slate-900">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body className="h-full dark:text-white">
				<div className="flex h-full">
					{/* Backdrop */}
					{sidebarOpen && (
						<div
							className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
							onClick={() => setSidebarOpen(false)}
							onKeyDown={(e) => e.key === "Escape" && setSidebarOpen(false)}
							role="button"
							tabIndex={0}
							aria-label="Close sidebar"
						></div>
					)}

					{/* Sidebar */}
					<aside
						ref={sidebarRef}
						className={`bg-slate-900 dark:bg-slate-900 text-white fixed h-full z-20 transition-all duration-300 ease-in-out ${
							sidebarOpen ? "translate-x-0" : "-translate-x-full"
						} ${sidebarCollapsed ? "w-24" : "w-64"} lg:translate-x-0`}
					>
						<div className="p-5 flex flex-col h-full">
							<div className="flex items-center justify-between mb-5">
								<h2 className={`text-xl font-semibold ${sidebarCollapsed ? "hidden" : "block"}`}>
									{sidebarCollapsed ? (
										<span className="text-xs">J</span>
									) : (
										<span className="text-xl">Jupiter</span>
									)}
								</h2>
								<button
									onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
									className="p-1 rounded-full hover:bg-slate-800 transition-colors duration-200"
								>
									{sidebarCollapsed ? (
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M13 5l7 7-7 7M5 5l7 7-7 7"
											/>
										</svg>
									) : (
										<svg
											className="w-4 h-4"
											fill="none"
											stroke="currentColor"
											viewBox="0 0 24 24"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
											/>
										</svg>
									)}
								</button>
							</div>

							{/* Workspace Switcher */}
							<div className="mb-4" ref={workspaceMenuRef}>
								<button
									className={`flex items-center justify-between w-full text-sm text-left px-4 py-2 rounded bg-slate-800 hover:bg-slate-700 transition-colors duration-200 ${
										sidebarCollapsed ? "justify-center" : ""
									} border border-slate-700 focus:outline-none`}
									onClick={() => setWorkspacesOpen(!workspacesOpen)}
								>
									{!sidebarCollapsed && <span>Current Workspace</span>}
									<svg
										className={`w-4 h-4 transition-transform duration-200 ${
											workspacesOpen ? "rotate-180" : ""
										}`}
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
							</div>

							{/* Workspace Menu */}
							{workspacesOpen && (
								<div
									className={`bg-slate-800 rounded-md border border-slate-700 overflow-hidden transition-all duration-200 ease-in-out ${
										sidebarCollapsed ? "absolute left-full top-0 mt-16 ml-2 w-48" : "mb-4"
									}`}
								>
									<div className="p-2 space-y-1">
										<Link
											to="/workspace/1"
											className="block py-1 px-4 text-sm hover:bg-slate-700 rounded"
										>
											Workspace 1
										</Link>
										<Link
											to="/workspace/2"
											className="block py-1 px-4 text-sm hover:bg-slate-700 rounded"
										>
											Workspace 2
										</Link>
										<Link
											to="/workspace/3"
											className="block py-1 px-4 text-sm hover:bg-slate-700 rounded"
										>
											Workspace 3
										</Link>
										<div className="border-t border-slate-700 my-2"></div>
										<Link
											to="/add-workspace"
											className="block py-1 px-4 text-sm hover:bg-slate-700 rounded text-blue-400"
										>
											+ Add Workspace
										</Link>
									</div>
								</div>
							)}

							<nav className="flex-grow">
								<ul className="space-y-2">
									<li>
										<Link
											to="/dashboard"
											className={`flex items-center py-2 px-4 rounded group transition-colors duration-200 text-sm
												${sidebarCollapsed ? "justify-center bg-slate-700 hover:bg-slate-800" : "hover:bg-slate-800"}`}
										>
											<svg
												className={`w-4 h-4 ${sidebarCollapsed ? "text-white" : "text-slate-300"}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
												/>
											</svg>
											<span className={`ml-2 ${sidebarCollapsed ? "hidden" : "block"}`}>
												Dashboard
											</span>
											{sidebarCollapsed && (
												<span className="absolute left-full ml-2 p-1.5 bg-gray-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
													Dashboard
												</span>
											)}
										</Link>
									</li>
									<li>
										<Link
											to="/users"
											className={`flex items-center py-2 px-4 rounded group transition-colors duration-200 text-sm
												${sidebarCollapsed ? "justify-center bg-slate-800 hover:bg-slate-700" : "hover:bg-slate-800"}`}
										>
											<svg
												className={`w-4 h-4 ${sidebarCollapsed ? "text-white" : "text-slate-300"}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
												/>
											</svg>
											<span className={`ml-2 ${sidebarCollapsed ? "hidden" : "block"}`}>Users</span>
											{sidebarCollapsed && (
												<span className="absolute left-full ml-2 p-1.5 bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
													Users
												</span>
											)}
										</Link>
									</li>
									<li>
										<Link
											to="/settings"
											className={`flex items-center py-2 px-4 rounded group transition-colors duration-200 text-sm
												${sidebarCollapsed ? "justify-center bg-slate-800 hover:bg-slate-700" : "hover:bg-slate-800"}`}
										>
											<svg
												className={`w-4 h-4 ${sidebarCollapsed ? "text-white" : "text-slate-300"}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
												/>
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													strokeWidth={2}
													d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
												/>
											</svg>
											<span className={`ml-2 ${sidebarCollapsed ? "hidden" : "block"}`}>
												Settings
											</span>
											{sidebarCollapsed && (
												<span className="absolute left-full ml-2 p-1.5 bg-slate-800 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs">
													Settings
												</span>
											)}
										</Link>
									</li>
								</ul>
							</nav>
						</div>
					</aside>

					{/* Main content */}
					<div
						className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
							sidebarCollapsed ? "lg:ml-16" : "lg:ml-64"
						}`}
					>
						{/* Header */}
						<header className="bg-white dark:bg-slate-900 shadow-sm p-4 flex justify-between items-center">
							<button
								className="lg:hidden text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
								onClick={() => setSidebarOpen(!sidebarOpen)}
							>
								<svg
									className="w-6 h-6"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M4 6h16M4 12h16M4 18h16"
									/>
								</svg>
							</button>
							<div className="flex-1 px-4">
								<input
									type="search"
									placeholder="Search..."
									className="w-full max-w-md px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-500"
								/>
							</div>

							{/* Dark Mode Toggle */}
							<button
								onClick={() => setDarkMode(!darkMode)}
								className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 mr-4"
							>
								{darkMode ? (
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
										/>
									</svg>
								) : (
									<svg
										className="w-5 h-5"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
										/>
									</svg>
								)}
							</button>

							{/* User Dropdown */}
							<div className="relative" ref={userMenuRef}>
								<button
									className="flex items-center space-x-2"
									onClick={() => setUserMenuOpen(!userMenuOpen)}
								>
									<img
										src="https://via.placeholder.com/40"
										alt="User avatar"
										className="w-8 h-8 rounded-full"
									/>
									<span className="hidden md:inline">John Doe</span>
									<svg
										className="w-4 h-4"
										fill="none"
										stroke="currentColor"
										viewBox="0 0 24 24"
										xmlns="http://www.w3.org/2000/svg"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 9l-7 7-7-7"
										/>
									</svg>
								</button>
								<div
									className={`absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-sm py-1 z-10 border border-slate-200 dark:border-gray-700 transition-all duration-200 ease-in-out ${
										userMenuOpen
											? "opacity-100 translate-y-0"
											: "opacity-0 translate-y-[-10px] pointer-events-none"
									}`}
								>
									<div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
										<p className="text-sm font-medium text-slate-900 dark:text-slate-100">
											John Doe
										</p>
										<p className="text-sm text-slate-500 dark:text-slate-500">john@example.com</p>
									</div>
									<Link
										to="/profile"
										className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
									>
										Profile
									</Link>
									<Link
										to="/settings"
										className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
									>
										Settings
									</Link>
									<div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>
									<Link
										to="/logout"
										className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
									>
										Logout
									</Link>
								</div>
							</div>
						</header>

						{/* Main content area */}
						<main className="flex-1 p-6 overflow-y-auto dark:bg-slate-900">{children}</main>
						<ScrollRestoration />
						<Scripts />
					</div>
				</div>
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
