import { cn } from "../../lib/utils"

export interface SidebarNavProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    href?: string
    title: string
  }[]
  activeItem?: string
  title?: string
  onItemClick?: (key: string) => void
}

export function SidebarNav({ className, items, activeItem, title = "Sections", onItemClick, ...props }: SidebarNavProps) {
  return (
    <div className={cn("w-[300px] shrink-0 bg-[#f4f4f5] rounded-[10px] rounded-r-none border border-slate-200 border-r-0 py-6 min-h-[400px]", className)} {...props}>
      <h3 className="text-[20px] font-semibold text-[#111827] px-6 pb-4">{title}</h3>
      <div className="h-px bg-slate-300 mx-6 mb-4" />
      <nav className="flex flex-col">
        {items.map((item) => {
          const key = item.href ?? item.title
          const isActive = activeItem === key
          const itemClass = cn(
            "block text-left px-6 py-4 font-medium transition-colors border-l-[4px] text-[16px]",
            isActive
              ? "bg-white border-[#58008e] text-[#58008e] shadow-[2px_0_0_0_white]"
              : "border-transparent text-[#374151] hover:bg-slate-200/50 hover:text-slate-800"
          )

          if (!item.href) {
            return (
              <button
                key={key}
                onClick={() => onItemClick?.(key)}
                className={itemClass}
              >
                {item.title}
              </button>
            )
          }

          return (
            <a
              key={key}
              href={item.href}
              onClick={() => onItemClick?.(key)}
              className={itemClass}
            >
              {item.title}
            </a>
          )
        })}
      </nav>
    </div>
  )
}
