import { useState, useEffect, useRef } from "react";
import { ChevronDown, Check, Search } from "lucide-react";

interface MultiSelectProps {
  options:     string[];
  selected:    string[];
  placeholder: string;
  onChange:    (v: string[]) => void;
  disabled?:   boolean;
  searchable?: boolean;
}

export const MultiSelect = ({ options, selected, placeholder, onChange, disabled, searchable }: MultiSelectProps) => {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const ref               = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle   = (opt: string) => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
  const filtered = searchable ? options.filter(o => o.toLowerCase().includes(query.toLowerCase())) : options;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => { if (!disabled) { setOpen(p => !p); setQuery(""); } }}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-gray-200 rounded-md text-[13px] bg-white hover:border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span className={`truncate pr-2 ${selected.length === 0 ? "text-gray-400" : "text-gray-800"}`}>
          {selected.length === 0 ? placeholder : selected.join(", ")}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 overflow-hidden">
          {searchable && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-100">
              <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search"
                className="flex-1 text-[13px] text-gray-700 focus:outline-none placeholder:text-gray-400"
              />
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filtered.map(opt => (
              <label key={opt} className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-gray-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selected.includes(opt)}
                  onChange={() => toggle(opt)}
                  className="w-3.5 h-3.5 accent-primary rounded sr-only"
                />
                <span className="text-[13px] text-gray-700 flex-1">{opt}</span>
                {selected.includes(opt) && <Check className="w-3.5 h-3.5 text-primary flex-shrink-0" />}
              </label>
            ))}
            {searchable && filtered.length === 0 && (
              <p className="px-3 py-3 text-[13px] text-gray-400">No results</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
