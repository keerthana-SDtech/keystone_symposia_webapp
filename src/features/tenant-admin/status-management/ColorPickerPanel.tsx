import { HexColorPicker } from "react-colorful";
import { LAST_USED_COLORS } from "./statusData";

interface ColorPickerPanelProps {
  color:    string;
  opacity:  number;
  onChange: (color: string, opacity: number) => void;
}

export const ColorPickerPanel = ({ color, opacity, onChange }: ColorPickerPanelProps) => {
  const hex = color.startsWith("#") ? color : `#${color}`;

  return (
    <div className="flex flex-col gap-4 pt-1">
      <HexColorPicker
        color={hex}
        onChange={c => onChange(c, opacity)}
        style={{ width: "100%", height: 200 }}
      />

      <div className="flex items-center gap-2">
        <div className="flex items-center flex-1 border border-gray-200 rounded-md overflow-hidden">
          <span className="px-2 text-[13px] text-gray-400 select-none">#</span>
          <input
            type="text"
            value={hex.replace("#", "").toUpperCase()}
            onChange={e => {
              const cleaned = e.target.value.replace(/[^0-9a-fA-F]/g, "").slice(0, 6);
              if (cleaned.length === 6) onChange(`#${cleaned}`, opacity);
            }}
            className="flex-1 py-1.5 pr-2 text-[13px] text-gray-800 focus:outline-none uppercase"
            maxLength={6}
          />
        </div>
        <div className="flex items-center border border-gray-200 rounded-md overflow-hidden w-20">
          <input
            type="number"
            value={opacity}
            min={0}
            max={100}
            onChange={e => onChange(color, Math.max(0, Math.min(100, Number(e.target.value))))}
            className="flex-1 py-1.5 px-2 text-[13px] text-gray-800 focus:outline-none w-full"
          />
          <span className="pr-2 text-[13px] text-gray-400 select-none">%</span>
        </div>
      </div>

      <div>
        <p className="text-[12px] text-gray-500 mb-2">Last Used</p>
        <div className="flex gap-2 flex-wrap">
          {[hex, ...LAST_USED_COLORS].slice(0, 9).map((c, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onChange(c, opacity)}
              className="w-6 h-6 rounded-sm border border-gray-200 flex-shrink-0 hover:scale-110 transition-transform"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
