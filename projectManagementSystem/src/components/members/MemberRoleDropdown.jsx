export default function MemberRoleDropdown({ currentRole, onChange }) {
  return (
    <div className="relative">
      <select
        value={currentRole}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-zinc-950/50 border border-white/10 rounded-lg pl-3 pr-8 py-1.5 text-xs font-medium text-zinc-300 focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 cursor-pointer hover:bg-zinc-900 transition-colors"
      >
        <option value="admin">Admin</option>
        <option value="member">Member</option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-zinc-500">
        <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
}
