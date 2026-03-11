import { SearchBar } from "@/components/shared/SearchBar";
import { FilterSort } from "@/components/shared/FilterSort";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ActionsMenu } from "@/components/ui/actions-menu";
import { ROLES_PAGE_CONTENT, ROLES_TABLE_COLUMNS, type Role } from "./rolesData";

interface RolesTableProps {
  roles:          Role[];
  totalCount:     number;
  search:         string;
  onSearchChange: (v: string) => void;
  onToggle:       (id: string) => void;
  onEdit:         (id: string) => void;
  onDelete:       (id: string) => void;
  onCreate:       () => void;
}

export const RolesTable = ({ roles, totalCount, search, onSearchChange, onToggle, onEdit, onDelete, onCreate }: RolesTableProps) => {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight leading-tight">{ROLES_PAGE_CONTENT.pageTitle}</h1>
          <p className="text-[14px] text-gray-500 mt-1">{ROLES_PAGE_CONTENT.subtitle}</p>
        </div>
        <Button onClick={onCreate} className="bg-primary hover:bg-primary/90 text-white px-6 py-2.5 rounded-md font-medium text-[14px]">{ROLES_PAGE_CONTENT.createButton}</Button>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)] overflow-hidden">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
          <SearchBar value={search} onChange={onSearchChange} placeholder={ROLES_PAGE_CONTENT.searchPlaceholder} />
          <FilterSort onFilter={() => {}} filterActive={false} sortOption={null} onSortSelect={() => {}} />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {ROLES_TABLE_COLUMNS.map(col => (
                  <th key={col.key} className={`py-3.5 px-6 text-[13px] font-medium text-gray-500 ${col.width}`}>{col.label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {roles.map(role => (
                <tr key={role.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[14px] font-medium text-gray-900">{role.name}</td>
                  <td className="py-4 px-6 text-[14px] text-gray-500">{role.description}</td>
                  <td className="py-4 px-6 text-[14px] text-gray-500">{role.permissionIds.length}</td>
                  <td className="py-4 px-6"><Toggle checked={role.enabled} onChange={() => onToggle(role.id)} onClick={e => e.stopPropagation()} /></td>
                  <td className="py-4 px-6">
                    <ActionsMenu actions={[
                      { label: "Edit",   onClick: () => onEdit(role.id) },
                      { label: "Delete", onClick: () => onDelete(role.id), variant: "danger" },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {roles.length === 0 && <EmptyState message={ROLES_PAGE_CONTENT.emptyState} />}
      </div>

      <p className="text-[13px] text-gray-400 mt-3">{totalCount} total roles</p>
    </div>
  );
};
