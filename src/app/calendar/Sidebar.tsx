import Link from 'next/link'

interface SidebarProps {
  currentRoute: string;
}

const Sidebar = ({ currentRoute }: SidebarProps) => {
  const isActive = (route: string) => {
    if (route === '/calendar' && currentRoute === '/calendar') return true;
    if (route === '/calendar/meeting' && currentRoute === '/calendar/meeting') return true;
    if (route === '/calendar/availability' && currentRoute === '/calendar/availability') return true;
    return false;
  };

  const getActiveClasses = (route: string) => {
    return isActive(route)
      ? 'block rounded-md px-3 py-2 bg-primary-100 text-primary-on-700 font-medium'
      : 'block rounded-md px-3 py-2 hover:bg-neutral-100 text-neutral-700';
  };

  return (
    <aside className="w-64 border-r bg-white">
      <nav className="p-4 space-y-2 text-sm">
        <Link
          href="/calendar"
          className={getActiveClasses('/calendar')}
        >
          Scheduling
        </Link>
        <Link 
          href="/calendar/meeting" 
          className={getActiveClasses('/calendar/meeting')}
        >
          Meetings
        </Link>
        <Link 
          href="/calendar/availability" 
          className={getActiveClasses('/calendar/availability')}
        >
          Availability
        </Link>
      </nav>
    </aside>
  )
}

export default Sidebar