import { Search } from 'lucide-react';
import type { SearchBarProps } from '../types';

export const SearchBar = ({ value, onChange, placeholder = 'Search' }: SearchBarProps) => (
    <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
            type="text"
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-400"
        />
    </div>
);
