import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AuditLog } from "./auditLogsData";

interface AuditLogDetailPanelProps {
  log: AuditLog | null;
  onClose: () => void;
}

const Field = ({
  label,
  value,
  valueColor = "gray",
}: {
  label: string;
  value: string;
  valueColor?: "primary" | "gray";
}) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-[13.5px] font-semibold text-gray-900">{label}</span>
    <span
      className={
        valueColor === "primary"
          ? "text-[13.5px] text-primary"
          : "text-[13.5px] text-gray-500"
      }
    >
      {value}
    </span>
  </div>
);

export const AuditLogDetailPanel = ({ log, onClose }: AuditLogDetailPanelProps) => {
  if (!log) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 z-50 w-[340px] bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <h2 className="text-[17px] font-semibold text-gray-900">Audit Log</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 pb-4 flex flex-col gap-5">

          <Field label="User"            value={log.user}           valueColor="primary" />
          <Field label="Role"            value={log.role}           valueColor="gray"    />
          <Field label="Action"          value={log.action}         valueColor="primary" />
          <Field label="Object Affected" value={log.objectAffected} valueColor="gray"    />
          <Field label="Detail"          value={log.detail}         valueColor="gray"    />

          {/* State Changes */}
          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-bold text-gray-900">State Changes</span>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13.5px] font-semibold text-gray-900">Before</span>
              <span className="inline-flex">
                <span className="text-[12.5px] text-gray-600 bg-gray-100 rounded-md px-3 py-1.5 font-mono">
                  {log.stateBefore}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[13.5px] font-semibold text-gray-900">After</span>
              <span className="inline-flex">
                <span className="text-[12.5px] text-gray-600 bg-gray-100 rounded-md px-3 py-1.5 font-mono">
                  {log.stateAfter}
                </span>
              </span>
            </div>
          </div>

          {/* Technical Details */}
          <div className="flex flex-col gap-3">
            <span className="text-[14px] font-bold text-gray-900">Technical Details</span>
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[13px] font-semibold text-gray-900">IP Address</p>
                <p className="text-[13px] text-primary mt-0.5">{log.ipAddress}</p>
              </div>
              <div className="px-4 py-3 border-b border-gray-100">
                <p className="text-[13px] font-semibold text-gray-900">Browser / OS</p>
                <p className="text-[13px] text-primary mt-0.5">{log.browserOs}</p>
              </div>
              <div className="px-4 py-3">
                <p className="text-[13px] font-semibold text-gray-900">Session ID</p>
                <p className="text-[13px] text-primary mt-0.5">{log.sessionId}</p>
              </div>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4">
          <Button
            onClick={onClose}
            className="px-6 py-2 text-[13.5px] bg-primary hover:bg-primary/90 text-white rounded-md"
          >
            Done
          </Button>
        </div>

      </div>
    </>
  );
};
