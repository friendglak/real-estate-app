import { Home } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary rounded-lg">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-primary font-bold text-xl">HOMECO</h1>
              <p className="text-sm text-gray-600">Find your perfect home</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
