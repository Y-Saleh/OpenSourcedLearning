import { SidebarTrigger } from '@/components/ui/sidebar';

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:hidden">
      <SidebarTrigger />
      <h1 className="text-lg font-semibold">OpenSourcedPractice</h1>
    </header>
  );
}
