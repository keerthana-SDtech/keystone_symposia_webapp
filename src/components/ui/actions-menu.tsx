import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { MoreVertical } from "lucide-react";

export interface MenuAction {
  label:    string;
  onClick:  () => void;
  variant?: "default" | "danger";
}

interface ActionsMenuProps {
  actions:    MenuAction[];
  usePortal?: boolean;
}

export const ActionsMenu = ({ actions, usePortal = false }: ActionsMenuProps) => {
  const [open, setOpen]     = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const btnRef              = useRef<HTMLButtonElement>(null);
  const menuRef             = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      const inMenu = menuRef.current?.contains(e.target as Node);
      const inBtn  = btnRef.current?.contains(e.target as Node);
      if (!inMenu && !inBtn) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (usePortal && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setCoords({ top: rect.bottom + 4, left: rect.right - 144 });
    }
    setOpen(prev => !prev);
  };

  const menuContent = (
    <div
      ref={menuRef}
      style={usePortal ? { position: "fixed", top: coords.top, left: coords.left } : undefined}
      className={`${usePortal ? "fixed w-36" : "absolute right-0 top-full mt-1 w-32"} bg-white border border-gray-200 rounded-lg shadow-lg z-[9999] overflow-hidden`}
    >
      {actions.map(action => (
        <button
          key={action.label}
          onClick={e => { e.stopPropagation(); action.onClick(); setOpen(false); }}
          className={`w-full px-4 py-2.5 text-sm text-left hover:bg-gray-50 ${action.variant === "danger" ? "text-red-600 hover:bg-red-50" : "text-gray-700"}`}
        >
          {action.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className={usePortal ? "inline-block" : "relative inline-block"}>
      <button
        ref={btnRef}
        onClick={handleOpen}
        className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
      >
        <MoreVertical className="h-4 w-4" />
      </button>
      {open && (usePortal ? createPortal(menuContent, document.body) : menuContent)}
    </div>
  );
};
