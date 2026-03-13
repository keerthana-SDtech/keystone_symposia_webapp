import { useState, useRef, useEffect } from "react";
import { GripVertical, Info, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DeleteConfirmModal } from "@/components/shared/DeleteConfirmModal";
import { Toast } from "@/components/ui/toast";
import { ActionsMenu } from "@/components/ui/actions-menu";
import { AddStageDrawer } from "./AddStageDrawer";
import { WORKFLOW_PAGE_CONTENT, type Stage } from "./workflowData";
import { workflowApi } from "./api";
import { statusApi } from "../status-management/api";
import { rolesApi } from "../roles-permissions/api";

const RoleTag = ({ label }: { label: string }) => (
  <span className="px-2.5 py-0.5 text-[11px] font-medium text-gray-600 bg-gray-100 rounded-full border border-gray-200 whitespace-nowrap">{label}</span>
);

const ActionPill = ({ code, isTerminal }: { code: string; isTerminal: boolean }) => {
  const label = code.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());
  return (
    <span className={`px-2 py-0.5 text-[11px] font-medium rounded-full border whitespace-nowrap ${
      isTerminal
        ? "text-red-600 bg-red-50 border-red-200"
        : "text-blue-600 bg-blue-50 border-blue-200"
    }`}>
      {label}
    </span>
  );
};

export const WorkflowView = () => {
  const [stages,        setStages]        = useState<Stage[]>([]);
  const [stageOptions,  setStageOptions]  = useState<{ id: string; name: string }[]>([]);
  const [statusOptions, setStatusOptions] = useState<{ id: string; name: string }[]>([]);
  const [roleOptions,   setRoleOptions]   = useState<string[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editStage,  setEditStage]  = useState<Stage | null>(null);
  const [deleteId,   setDeleteId]   = useState<string | null>(null);
  const [toast,      setToast]      = useState<{ visible: boolean; message: string }>({ visible: false, message: "" });

  const dragIndex = useRef<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const showToast = (message: string) => {
    setToast({ visible: true, message });
    setTimeout(() => setToast({ visible: false, message: "" }), 4000);
  };

  useEffect(() => {
    Promise.all([workflowApi.list(), statusApi.list(), rolesApi.list()])
      .then(([stageList, statusList, roleList]) => {
        setStages(stageList);
        setStageOptions(stageList.map(s => ({ id: s.id, name: s.name })));
        setStatusOptions(statusList.map(s => ({ id: s.id, name: s.name })));
        setRoleOptions(roleList.map(r => r.name));
      })
      .catch(() => showToast("Failed to load stages"))
      .finally(() => setLoading(false));
  }, []);

  const onDragStart = (index: number) => { dragIndex.current = index; };
  const onDragOver  = (e: React.DragEvent, index: number) => { e.preventDefault(); setDragOver(index); };
  const onDrop      = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    const from = dragIndex.current;
    if (from === null || from === dropIndex) { setDragOver(null); return; }
    setStages(prev => { const next = [...prev]; const [moved] = next.splice(from, 1); next.splice(dropIndex, 0, moved); return next; });
    dragIndex.current = null; setDragOver(null);
  };
  const onDragEnd = () => { dragIndex.current = null; setDragOver(null); };

  const handleCreate = async (data: Omit<Stage, "id" | "locked">) => {
    try {
      const created = await workflowApi.create(data);
      setStages(prev => [...prev, created]);
      setStageOptions(prev => [...prev, { id: created.id, name: created.name }]);
      showToast("Stage added successfully");
    }
    catch { showToast("Failed to add stage"); }
  };

  const handleEdit = async (data: Omit<Stage, "id" | "locked">) => {
    if (!editStage) return;
    try { const updated = await workflowApi.update(editStage.id, data); setStages(prev => prev.map(s => s.id === editStage.id ? updated : s)); setEditStage(null); showToast("Stage updated successfully"); }
    catch { showToast("Failed to update stage"); }
  };

  const handleLock = async (id: string) => {
    const stage = stages.find(s => s.id === id); if (!stage) return;
    try { const updated = await workflowApi.update(id, { locked: !stage.locked }); setStages(prev => prev.map(s => s.id === id ? updated : s)); }
    catch { showToast("Failed to update stage lock"); }
  };

  const handleSaveOrder = async () => {
    try { await workflowApi.reorder(stages.map(s => s.id)); showToast("Order saved successfully"); }
    catch { showToast("Failed to save order"); }
  };

  return (
    <div className="w-full">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-[28px] font-semibold text-[#111827] tracking-tight leading-tight">{WORKFLOW_PAGE_CONTENT.pageTitle}</h1>
          <p className="text-[14px] text-gray-500 mt-1">{WORKFLOW_PAGE_CONTENT.subtitle}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSaveOrder} className="px-5 py-2.5 text-[13px] border-gray-300 text-gray-700 hover:bg-gray-50">{WORKFLOW_PAGE_CONTENT.saveOrder}</Button>
          <Button onClick={() => { setEditStage(null); setDrawerOpen(true); }} className="bg-primary hover:bg-primary/90 text-white px-5 py-2.5 text-[13px] font-medium">{WORKFLOW_PAGE_CONTENT.addStage}</Button>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 mb-5 bg-white border-l-4 border-primary rounded-md shadow-sm">
        <Info className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <p className="text-[13px] text-gray-500">{WORKFLOW_PAGE_CONTENT.infoBanner}</p>
      </div>

      <div className="flex flex-col gap-2">
        {stages.map((stage, index) => (
          <div
            key={stage.id}
            draggable
            onDragStart={() => onDragStart(index)}
            onDragOver={e => onDragOver(e, index)}
            onDrop={e => onDrop(e, index)}
            onDragEnd={onDragEnd}
            className={`flex items-center gap-4 bg-white border rounded-lg px-4 py-4 shadow-[0_1px_4px_rgba(0,0,0,0.05)] transition-all ${dragOver === index ? "border-primary bg-primary/5" : "border-gray-200"} ${stage.locked ? "opacity-70" : ""}`}
          >
            <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors flex-shrink-0"><GripVertical className="w-4 h-4" /></div>
            <span className="w-6 text-[13px] font-semibold text-gray-400 flex-shrink-0 text-center">{index + 1}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-[14px] font-semibold text-gray-900">{stage.name}</p>
                {stage.locked && <Lock className="w-3.5 h-3.5 text-gray-400" />}
              </div>
              <p className="text-[12px] text-gray-400 mt-0.5 truncate">{stage.description}</p>
            </div>
            {stage.statusActions && stage.statusActions.length > 0 && (
              <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end max-w-[200px]">
                {stage.statusActions.map(a => (
                  <ActionPill key={a.actionCode} code={a.actionCode} isTerminal={a.toStageId === null} />
                ))}
              </div>
            )}
            <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end max-w-[200px]">
              {stage.roles.map(r => <RoleTag key={r} label={r} />)}
            </div>
            <div className="flex-shrink-0">
              <ActionsMenu actions={[
                { label: "Edit",   onClick: () => { setEditStage(stage); setDrawerOpen(true); } },
                { label: "Delete", onClick: () => setDeleteId(stage.id), variant: "danger" },
                { label: stage.locked ? "Unlock editing" : "Lock editing", onClick: () => handleLock(stage.id) },
              ]} />
            </div>
          </div>
        ))}
      </div>

      {loading && <p className="text-center text-[14px] text-gray-400 mt-12">Loading...</p>}
      {!loading && stages.length === 0 && <p className="text-center text-[14px] text-gray-400 mt-12">{WORKFLOW_PAGE_CONTENT.emptyState}</p>}

      <AddStageDrawer isOpen={drawerOpen} onClose={() => { setDrawerOpen(false); setEditStage(null); }} onSave={editStage ? handleEdit : handleCreate} editData={editStage} stageOptions={stageOptions} statusOptions={statusOptions} roleOptions={roleOptions} />

      <DeleteConfirmModal
        isOpen={deleteId !== null}
        onCancel={() => setDeleteId(null)}
        onConfirm={async () => {
          try { await workflowApi.remove(deleteId!); setStages(prev => prev.filter(s => s.id !== deleteId)); showToast("Stage deleted successfully"); }
          catch { showToast("Failed to delete stage"); }
          setDeleteId(null);
        }}
      />

      <Toast message={toast.message} variant="success" visible={toast.visible} onClose={() => setToast(p => ({ ...p, visible: false }))} />
    </div>
  );
};
