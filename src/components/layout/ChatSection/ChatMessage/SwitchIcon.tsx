interface CheckProps {
  checked: boolean;
  setChecked: (value: boolean) => void;
}

export default function SwitchIcon({ checked, setChecked }: CheckProps) {
  const handleChange = () => {
    setChecked(!checked);
  };

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          className="sr-only"
        />
        <div className="block h-8 w-14 rounded-full bg-gray-300"></div>
        <div
          className={`dot absolute left-1 top-1 flex h-6 w-7 items-center justify-center rounded-full bg-black transition ${
            checked ? "translate-x-5" : ""
          }`}
        >
          {checked ? (
            <span className="active">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-chart-column-big"><path d="M3 3v16a2 2 0 0 0 2 2h16"/><rect x="15" y="5" width="4" height="12" rx="1"/><rect x="7" y="8" width="4" height="9" rx="1"/></svg>
            </span>
          ) : (
            <span className="inactive">
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="lucide lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>
            </span>
          )}
        </div>
      </div>
    </label>
  );
}
