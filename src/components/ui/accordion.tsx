import * as React from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "../../lib/utils"

export interface AccordionItemData {
  id: string
  title: string
  content: React.ReactNode
}

export interface AccordionProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'content'> {
  items: AccordionItemData[]
  defaultOpenItems?: string[]
}

export function Accordion({ items, defaultOpenItems = [], className, ...props }: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(defaultOpenItems)

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(i => i !== id)
        : [...prev, id]
    )
  }

  return (
    <div className={cn("flex flex-col gap-3", className)} {...props}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.id)
        
        return (
          <div 
            key={item.id} 
            className={cn(
              "border rounded-lg overflow-hidden transition-colors",
              isOpen ? "border-slate-300" : "border-slate-200"
            )}
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full flex justify-between items-center px-5 py-4 bg-white hover:bg-slate-50 text-left transition-colors"
            >
              <span className="font-semibold text-slate-800 text-[15px] pr-8">{item.title}</span>
              {isOpen ? (
                <ChevronUp className="w-5 h-5 text-slate-400 shrink-0" />
              ) : (
                <ChevronDown className="w-5 h-5 text-slate-400 shrink-0" />
              )}
            </button>
            {isOpen && (
              <div className="px-5 pb-5 pt-1 bg-white text-slate-600 text-[14px] leading-relaxed">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
