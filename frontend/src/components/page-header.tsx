import { Home } from 'lucide-react'

export function PageHeader() {
  return (
    <header className="bg-white shadow-sm border-b border-slate-200">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg">
              <Home className="w-6 h-6 text-blue-600" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">
                Real Estate Properties
              </h1>
              <p className="text-sm text-slate-600 hidden sm:block">
                Find your perfect home
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}