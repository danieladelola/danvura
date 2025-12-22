import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  BarChart3, 
  LogOut, 
  PlusCircle,
  Settings,
  Image,
  ChevronDown,
  ChevronRight,
  Mail,
  FolderOpen,
  CheckSquare
} from 'lucide-react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { cn } from '@/lib/utils';
import { useState } from 'react';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAdminAuth();
  const [expandedSections, setExpandedSections] = useState<string[]>(['blog', 'newsletter']);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
    {
      icon: FileText,
      label: 'Blog',
      path: '/admin/blog',
      submenu: [
        { icon: FileText, label: 'All Posts', path: '/admin/posts' },
        { icon: PlusCircle, label: 'Create Post', path: '/admin/posts/new' },
      ]
    },
    {
      icon: Image,
      label: 'Portfolio',
      path: '/admin/portfolio',
      submenu: [
        { icon: Image, label: 'All Portfolio', path: '/admin/portfolio' },
        { icon: PlusCircle, label: 'Add Portfolio', path: '/admin/portfolio/new' },
      ]
    },
    {
      icon: FolderOpen,
      label: 'Media Library',
      path: '/admin/media',
    },
    {
      icon: CheckSquare,
      label: 'Tasks & Reminders',
      path: '/admin/tasks',
    },
    {
      icon: Mail,
      label: 'Newsletter',
      path: '/admin/newsletter',
      submenu: [
        { icon: Mail, label: 'All Subscribers', path: '/admin/subscribers' },
      ]
    },
    { icon: BarChart3, label: 'Analytics', path: '/admin/analytics' },
  ];

  const toggleSection = (sectionLabel: string) => {
    setExpandedSections(prev =>
      prev.includes(sectionLabel)
        ? prev.filter(s => s !== sectionLabel)
        : [...prev, sectionLabel]
    );
  };

  const isActive = (path: string) => {
    if (path === '/admin') return location.pathname === '/admin';
    return location.pathname.startsWith(path);
  };

  const isSectionActive = (item: any) => {
    if (item.submenu) {
      return item.submenu.some((subItem: any) => isActive(subItem.path));
    }
    return isActive(item.path);
  };

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-border flex flex-col">
      <div className="p-6 border-b border-border">
        <Link to="/admin" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">D</span>
          </div>
          <div>
            <h1 className="font-heading font-bold text-foreground">Admin</h1>
            <p className="text-xs text-muted-foreground">Dashboard</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.label.toLowerCase())}
                    className={cn(
                      'w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all',
                      isSectionActive(item)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} />
                      {item.label}
                    </div>
                    {expandedSections.includes(item.label.toLowerCase()) ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                  {expandedSections.includes(item.label.toLowerCase()) && (
                    <ul className="ml-6 mt-1 space-y-1">
                      {item.submenu.map((subItem: any) => (
                        <li key={subItem.path}>
                          <Link
                            to={subItem.path}
                            className={cn(
                              'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-all',
                              isActive(subItem.path)
                                ? 'bg-primary/20 text-primary border-l-2 border-primary'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                          >
                            <subItem.icon size={16} />
                            {subItem.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <item.icon size={18} />
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all"
        >
          <Settings size={18} />
          View Site
        </Link>
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
