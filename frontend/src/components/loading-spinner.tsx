import { Loader2 } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
}

export function LoadingSpinner({
  size = 24,
  className = '',
  text = 'Loading...'
}: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      <Loader2 size={size} className="animate-spin text-primary" />
      {text && <span className="text-slate-600">{text}</span>}
    </div>
  )
}
