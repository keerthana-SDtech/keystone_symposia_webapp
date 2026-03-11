import { SearchBar } from "@/components/shared/SearchBar";
import { FilterSort } from "@/components/shared/FilterSort";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/shared/Toggle";
import { EmptyState } from "@/components/feedback/EmptyState";
import { ActionsMenu } from "@/components/ui/actions-menu";
import { USERS_PAGE_CONTENT, USERS_TABLE_COLUMNS, type TenantUser } from "./usersData";

interface UsersTableProps {
  users:          TenantUser[];
  totalCount:     number;
  search:         string;
  onSearchChange: (v: string) => void;
  onToggle:       (id: string) => void;
  onEdit:         (id: string) => void;
  onSendInvite:   (id: string) => void;
  onDelete:       (id: string) => void;
  onBulkUpload:   () => void;
  onCreate:       () => void;
}

export const UsersTable = ({ users, totalCount, search, onSearchChange, onToggle, onEdit, onSendInvite, onDelete, onBulkUpload, onCreate }: UsersTableProps) => {
  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight leading-tight">{USERS_PAGE_CONTENT.pageTitle} ({totalCount})</h1>
          <p className="text-[14px] text-gray-500 mt-1">{USERS_PAGE_CONTENT.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onBulkUpload} className="border-gray-300 text-gray-700 hover:bg-gray-50 px-5 text-[14px] font-medium">{USERS_PAGE_CONTENT.bulkUploadButton}</Button>
          <Button onClick={onCreate} className="bg-primary hover:bg-primary/90 text-white px-6 text-[14px] font-medium">{USERS_PAGE_CONTENT.createButton}</Button>
        </div>
      </div>

      <div className="bg-white rounded-[10px] border border-gray-200 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div className="px-5 py-4 flex items-center justify-between border-b border-gray-200">
          <SearchBar value={search} onChange={onSearchChange} placeholder={USERS_PAGE_CONTENT.searchPlaceholder} />
          <FilterSort onFilter={() => {}} filterActive={false} sortOption={null} onSortSelect={() => {}} />
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                {USERS_TABLE_COLUMNS.map(col => <th key={col.key} className={`py-3.5 px-6 text-[13px] font-medium text-gray-500 ${col.width}`}>{col.label}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 text-[14px] font-semibold text-gray-900">{user.name}</td>
                  <td className="py-4 px-6 text-[14px] text-gray-500">{user.role}</td>
                  <td className="py-4 px-6 text-[14px] text-gray-500">{user.createdDate}</td>
                  <td className="py-4 px-6"><Toggle checked={user.enabled} onChange={() => onToggle(user.id)} onClick={e => e.stopPropagation()} /></td>
                  <td className="py-4 px-6">
                    <ActionsMenu usePortal actions={[
                      { label: "Edit",        onClick: () => onEdit(user.id) },
                      { label: "Send Invite", onClick: () => onSendInvite(user.id) },
                      { label: "Delete",      onClick: () => onDelete(user.id) },
                    ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && <EmptyState message={USERS_PAGE_CONTENT.emptyState} />}
      </div>
    </div>
  );
};
