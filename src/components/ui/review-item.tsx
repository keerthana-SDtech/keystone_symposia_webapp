import * as React from "react"
import { useState } from "react"
import { User } from "lucide-react"
import { Avatar, AvatarFallback } from "./avatar"
import { cn } from "../../lib/utils"

export interface ReviewItemProps extends React.HTMLAttributes<HTMLDivElement> {
  reviewerName: string
  relevance: string
  scientificQuality: string
  comments: string
}

export function ReviewItem({ 
  reviewerName, 
  relevance, 
  scientificQuality, 
  comments,
  className,
  ...props 
}: ReviewItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // A simple heuristic for when text is long enough to truncate
  const shouldTruncate = comments.length > 150;
  const displayComments = (!isExpanded && shouldTruncate) 
    ? comments.slice(0, 150) + "..." 
    : comments;

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      {/* Header: Avatar & Name */}
      <div className="flex items-center gap-4 mb-8">
        <Avatar className="w-12 h-12 rounded-xl bg-[#F8FAFC] border border-slate-100 flex items-center justify-center shrink-0">
          <AvatarFallback className="bg-transparent">
            <User className="w-6 h-6 text-slate-400" />
          </AvatarFallback>
        </Avatar>
        <span className="text-xl font-bold text-slate-800">{reviewerName}</span>
      </div>

      {/* Content Fields */}
      <div className="flex flex-col gap-6">
        {/* Relevance */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-400">Relevance of the topic</span>
          <p className="text-[15px] text-slate-800 leading-relaxed">{relevance}</p>
        </div>

        {/* Scientific Quality */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-400">Scientific Quality</span>
          <p className="text-[15px] text-slate-800 leading-relaxed">{scientificQuality}</p>
        </div>

        {/* Comments */}
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-slate-400">Comments</span>
          <p className="text-[15px] text-slate-800 leading-relaxed whitespace-pre-line">{displayComments}</p>
          
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#58008e] text-[15px] font-semibold text-left hover:underline mt-1 w-fit"
            >
              {isExpanded ? "Read less" : "Read more"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
