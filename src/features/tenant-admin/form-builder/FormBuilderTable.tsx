import { useRef, useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterSort } from "@/components/shared/FilterSort";
import { Toggle } from "@/components/shared/Toggle";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ActionsMenu } from "@/components/ui/actions-menu";
import {
  FORM_BUILDER_PAGE_CONTENT,
  FORM_BUILDER_TABS,
  FORM_BUILDER_TABLE_COLUMNS,
  type FormBuilderItem,
  type FormBuilderTab,
} from "./formBuilderData";

interface FormBuilderTableProps {
  items:          FormBuilderItem[];
  totalCount:     number;
  activeTab:      FormBuilderTab;
  search:         string;
  onTabChange:    (tab: FormBuilderTab) => void;
  onSearchChange: (v: string) => void;
  onToggle:       (id: string) => void;
  onEdit:         (id: string) => void;
  onDuplicate:    (id: string) => void;
  onDelete:       (id: string) => void;
  onCreate:       (type: FormBuilderTab) => void;
}

export const FormBuilderTable = ({
  items, totalCount, activeTab, search,
  onTabChange, onSearchChange, onToggle, onEdit, onDuplicate, onDelete, onCreate,
}: FormBuilderTableProps) => {
  const [createOpen, setCreateOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!createOpen) return;
    const handler = (e: MouseEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) setCreateOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [createOpen]);

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight leading-tight">
            {FORM_BUILDER_PAGE_CONTENT.pageTitle}
          </h1>
          <p className="text-[14px] text-gray-500 mt-1">{FORM_BUILDER_PAGE_CONTENT.subtitle}</p>
        </div>

        {/* Create dropdown button */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setCreateOpen(p => !p)}
            className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white px-5 py-2.5 rounded-md font-medium text-[14px] transition-colors"
          >
            {FORM_BUILDER_PAGE_CONTENT.createButton}
            <ChevronDown className="w-4 h-4" />
          </button>
          {createOpen && (
            <div className="absolute right-0 top-full mt-1 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
              {FORM_BUILDER_TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => { setCreateOpen(false); onCreate(tab.key); }}
                  className="w-full px-4 py-2.5 text-[14px] text-left text-gray-700 hover:bg-gray-50"
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tab bar — segmented control */}
      <div className="inline-flex mb-5 rounded-lg border border-gray-200 bg-gray-100 p-[3px]">
        {FORM_BUILDER_TABS.map(tab => {
          const count = tab.key === activeTab ? items.length : totalCount - items.length;
          const isActive = tab.key === activeTab;
          return (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`px-4 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
                isActive
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
          <SearchBar value={search} onChange={onSearchChange} placeholder={FORM_BUILDER_PAGE_CONTENT.searchPlaceholder} />
          <FilterSort onFilter={() => {}} filterActive={false} sortOption={null} onSortSelect={() => {}} />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {FORM_BUILDER_TABLE_COLUMNS.map(col => (
                  <th key={col.key} className={`py-3.5 px-4 text-[13px] font-medium text-gray-500 ${col.width}`}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4"><span className="text-[14px] font-medium text-gray-900">{item.name}</span></td>
                  <td className="py-3.5 px-4 text-[13px] text-gray-500 max-w-[220px]"><span className="block truncate">{item.description}</span></td>
                  <td className="py-3.5 px-4 text-[13px] text-gray-500">{item.module}</td>
                  <td className="py-3.5 px-4">
                    <Toggle checked={item.enabled} onChange={() => onToggle(item.id)} onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                  </td>
                  <td className="py-3.5 px-4">
                    <ActionsMenu actions={[
                      { label: "Edit",      onClick: () => onEdit(item.id)      },
                      { label: "Duplicate", onClick: () => onDuplicate(item.id) },
                      { label: "Delete",    onClick: () => onDelete(item.id),   variant: "danger" },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {items.length === 0 && <EmptyState message={FORM_BUILDER_PAGE_CONTENT.emptyState} />}
      </div>
    </div>
  );
};
