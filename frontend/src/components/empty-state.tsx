import { Home } from 'lucide-react'

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

export function EmptyState({
  title,
  description,
  icon,
  children
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="mb-4 text-slate-400">
        {icon || <Home size={48} />}
      </div>
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 mb-6 max-w-md">
        {description}
      </p>
      {children}
    </div>
  )
}
