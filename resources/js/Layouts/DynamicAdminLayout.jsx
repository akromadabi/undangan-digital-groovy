/**
 * DynamicAdminLayout — auto-selects AdminLayout or SuperAdminLayout
 * based on the current route prefix (from Inertia shared data).
 */
import { usePage } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import SuperAdminLayout from '@/Layouts/SuperAdminLayout';

export default function DynamicAdminLayout({ children, title }) {
    const { adminRoutePrefix } = usePage().props;
    const Layout = adminRoutePrefix === '/super-admin' ? SuperAdminLayout : AdminLayout;
    return <Layout title={title}>{children}</Layout>;
}
