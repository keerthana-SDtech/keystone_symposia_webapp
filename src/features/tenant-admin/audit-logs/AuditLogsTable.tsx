import { SearchBar } from "@/components/shared/SearchBar";
import { FilterSort } from "@/components/shared/FilterSort";
import { AUDIT_LOGS_PAGE_CONTENT, AUDIT_LOGS_TABLE_COLUMNS, type AuditLog } from "./auditLogsData";
import { EmptyState } from "@/components/feedback/EmptyState";

interface AuditLogsTableProps {
  logs: AuditLog[];
  totalCount: number;
  search: string;
  onSearchChange: (v: string) => void;
  onView: (id: string) => void;
}

export const AuditLogsTable = ({
  logs, totalCount, search, onSearchChange, onView,
}: AuditLogsTableProps) => {
  return (
    <div className="w-full">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight leading-tight">
          {AUDIT_LOGS_PAGE_CONTENT.pageTitle} ({totalCount})
        </h1>
        <p className="text-[14px] text-gray-500 mt-1">{AUDIT_LOGS_PAGE_CONTENT.subtitle}</p>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">

        {/* Toolbar */}
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
          <SearchBar
            value={search}
            onChange={onSearchChange}
            placeholder={AUDIT_LOGS_PAGE_CONTENT.searchPlaceholder}
          />
          <FilterSort
            onFilter={() => {}}
            filterActive={false}
            sortOption={null}
            onSortSelect={() => {}}
          />
        </div>

        {/* Table */}
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {AUDIT_LOGS_TABLE_COLUMNS.map(col => (
                  <th key={col.key} className={`py-3.5 px-5 text-[13px] font-medium text-gray-500 ${col.width}`}>
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {logs.map(log => (
                <tr
                  key={log.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer"
                  onClick={() => onView(log.id)}
                >
                  <td className="py-3.5 px-5 text-[13.5px] font-medium text-gray-800">{log.user}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-500">{log.timestamp}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-500">{log.role}</td>
                  <td className="py-3.5 px-5 text-[13px] text-gray-500">{log.actionType}</td>
                  <td className="py-3.5 px-5">
                    <button
                      onClick={e => { e.stopPropagation(); onView(log.id); }}
                      className="text-[13px] font-medium text-primary hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {logs.length === 0 && <EmptyState message={AUDIT_LOGS_PAGE_CONTENT.emptyState} />}
      </div>
    </div>
  );
};
