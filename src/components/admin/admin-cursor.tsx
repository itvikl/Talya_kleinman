'use client';

import { usePathname } from 'next/navigation';
import { CustomCursor } from '@/components/ui/custom-cursor';

/**
 * Renders the custom cursor on all admin pages except the login page.
 * On /admin/login the native cursor is restored via the login page's own styles.
 */
export function AdminCursor() {
  const pathname = usePathname();
  if (pathname === '/admin/login') return null;
  return <CustomCursor />;
}
