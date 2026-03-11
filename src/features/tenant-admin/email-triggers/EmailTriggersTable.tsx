import { SearchBar } from "@/components/shared/SearchBar";
import { FilterSort } from "@/components/shared/FilterSort";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ActionsMenu } from "@/components/ui/actions-menu";
import {
  EMAIL_TRIGGERS_PAGE_CONTENT,
  EMAIL_TRIGGERS_TABLE_COLUMNS,
  type EmailTrigger,
} from "./emailTriggersData";

interface EmailTriggersTableProps {
  triggers:       EmailTrigger[];
  totalCount:     number;
  search:         string;
  onSearchChange: (v: string) => void;
  onToggle:       (id: string) => void;
  onView:         (id: string) => void;
  onEdit:         (id: string) => void;
  onDelete:       (id: string) => void;
  onCreate:       () => void;
}

export const EmailTriggersTable = ({
  triggers, totalCount, search, onSearchChange,
  onToggle, onView, onEdit, onDelete, onCreate,
}: EmailTriggersTableProps) => {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight leading-tight">
            {EMAIL_TRIGGERS_PAGE_CONTENT.pageTitle} ({totalCount})
          </h1>
          <p className="text-[14px] text-gray-500 mt-1">{EMAIL_TRIGGERS_PAGE_CONTENT.subtitle}</p>
        </div>
        <Button onClick={onCreate} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-md font-medium text-[14px]">
          {EMAIL_TRIGGERS_PAGE_CONTENT.createButton}
        </Button>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
          <SearchBar value={search} onChange={onSearchChange} placeholder={EMAIL_TRIGGERS_PAGE_CONTENT.searchPlaceholder} />
          <FilterSort onFilter={() => {}} filterActive={false} sortOption={null} onSortSelect={() => {}} />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {EMAIL_TRIGGERS_TABLE_COLUMNS.map(col => (
                  <th key={col.key} className={`py-3.5 px-4 text-[13px] font-medium text-gray-500 ${col.width}`}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {triggers.map(trigger => (
                <tr key={trigger.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-4"><span className="text-[14px] font-medium text-gray-900">{trigger.name}</span></td>
                  <td className="py-3.5 px-4 text-[13px] text-gray-500 max-w-[200px]"><span className="block truncate">{trigger.description}</span></td>
                  <td className="py-3.5 px-4 text-[13px] text-gray-500 max-w-[160px]"><span className="block truncate">{trigger.emailTemplate}</span></td>
                  <td className="py-3.5 px-4 text-[13px] text-gray-500 max-w-[140px]"><span className="block truncate">{trigger.sendTo.join(", ")}</span></td>
                  <td className="py-3.5 px-4">
                    <Toggle checked={trigger.enabled} onChange={() => onToggle(trigger.id)} onClick={(e: React.MouseEvent) => e.stopPropagation()} />
                  </td>
                  <td className="py-3.5 px-4">
                    <ActionsMenu actions={[
                      { label: "View",   onClick: () => onView(trigger.id) },
                      { label: "Edit",   onClick: () => onEdit(trigger.id) },
                      { label: "Delete", onClick: () => onDelete(trigger.id), variant: "danger" },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {triggers.length === 0 && <EmptyState message={EMAIL_TRIGGERS_PAGE_CONTENT.emptyState} />}
      </div>
    </div>
  );
};
