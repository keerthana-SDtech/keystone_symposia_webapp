import { SearchBar } from "@/components/shared/SearchBar";
import { EMAIL_TEMPLATES_PAGE_CONTENT, type EmailTemplate } from "./emailTemplatesData";

interface EmailTemplatesListProps {
  templates:      EmailTemplate[];
  selectedId:     string | null;
  search:         string;
  onSearchChange: (v: string) => void;
  onSelect:       (id: string) => void;
  onCreate:       () => void;
}

export const EmailTemplatesList = ({
  templates, selectedId, search, onSearchChange, onSelect, onCreate,
}: EmailTemplatesListProps) => {
  const filtered = search.trim()
    ? templates.filter(t =>
        t.eventKey.toLowerCase().includes(search.toLowerCase()) ||
        t.subject.toLowerCase().includes(search.toLowerCase())
      )
    : templates;

  return (
    <div className="w-[260px] shrink-0 border-r border-gray-200 bg-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <span className="text-[14px] font-medium text-gray-700">
          Templates ({templates.length})
        </span>
        <button
          onClick={onCreate}
          className="w-7 h-7 flex items-center justify-center rounded-md bg-primary text-white text-[18px] leading-none hover:bg-primary/90 transition-colors"
        >
          +
        </button>
      </div>

      <div className="px-3 py-2 border-b border-gray-100">
        <SearchBar value={search} onChange={onSearchChange} placeholder="Search" />
      </div>

      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-[13px] text-gray-400 text-center mt-8 px-4">
            {EMAIL_TEMPLATES_PAGE_CONTENT.emptyList}
          </p>
        ) : (
          <ul>
            {filtered.map(t => (
              <li key={t.id}>
                <button
                  onClick={() => onSelect(t.id)}
                  className={`w-full text-left px-4 py-3 flex items-center gap-2 text-[13px] transition-colors border-b border-gray-50
                    ${selectedId === t.id
                      ? "bg-slate-50 border-l-2 border-l-primary text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-gray-50"
                    }`}
                >
                  <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                  <span className="truncate">{t.eventKey || t.subject || t.id.slice(0, 8)}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};
