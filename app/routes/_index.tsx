import type { MetaFunction } from "@remix-run/node";
import { useState } from "react";

export const meta: MetaFunction = () => {
	return [{ title: "New Remix App" }, { name: "description", content: "Welcome to Remix!" }];
};

export default function Index() {
	const [users, setUsers] = useState([
		{ id: 1, name: "John Doe", email: "john@example.com", role: "Admin" },
		{ id: 2, name: "Jane Smith", email: "jane@example.com", role: "User" },
		// Add more mock users as needed
	]);

	const [searchTerm, setSearchTerm] = useState("");
	const [sortColumn, setSortColumn] = useState("name");
	const [sortDirection, setSortDirection] = useState("asc");
	const [filterRole, setFilterRole] = useState("All");

	const handleSort = (column: string) => {
		if (column === sortColumn) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	const filteredUsers = users
		.filter((user) =>
			Object.values(user).some((value) =>
				value.toString().toLowerCase().includes(searchTerm.toLowerCase())
			)
		)
		.filter((user) => filterRole === "All" || user.role === filterRole)
		.sort((a, b) => {
			if (a[sortColumn] < b[sortColumn]) return sortDirection === "asc" ? -1 : 1;
			if (a[sortColumn] > b[sortColumn]) return sortDirection === "asc" ? 1 : -1;
			return 0;
		});

	return (
		<div className="font-sans p-4">
			<h1 className="text-3xl mb-4">User Management</h1>

			{/* Search and Filter */}
			<div className="mb-4 flex items-center space-x-4">
				<input
					type="text"
					placeholder="Search users..."
					className="border p-2 rounded"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
				<select
					className="border p-2 rounded"
					value={filterRole}
					onChange={(e) => setFilterRole(e.target.value)}
				>
					<option value="All">All Roles</option>
					<option value="Admin">Admin</option>
					<option value="User">User</option>
				</select>
			</div>

			{/* Users Table */}
			<table className="w-full border-collapse  shadow-sm rounded overflow-hidden">
				<thead className="bg-slate-50">
					<tr>
						{["Name", "Email", "Role"].map((column) => (
							<th
								key={column}
								className="bg-slate-200 border-b-1 border-slate-100 px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer  transition duration-300"
								onClick={() => handleSort(column.toLowerCase())}
							>
								{column}
								{sortColumn === column.toLowerCase() && (
									<span className="ml-1">{sortDirection === "asc" ? "▲" : "▼"}</span>
								)}
							</th>
						))}
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-slate-200">
					{filteredUsers.map((user) => (
						<tr key={user.id} className="hover:bg-slate-50 transition duration-300">
							<td className="px-4 py-3 whitespace-nowrap">{user.name}</td>
							<td className="px-4 py-3 whitespace-nowrap">{user.email}</td>
							<td className="px-4 py-3 whitespace-nowrap">
								<span
									className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
										user.role === "Admin"
											? "bg-green-100 text-green-800"
											: "bg-blue-100 text-blue-800"
									}`}
								>
									{user.role}
								</span>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}
