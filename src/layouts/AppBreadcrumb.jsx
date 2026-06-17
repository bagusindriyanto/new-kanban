// components/AppBreadcrumb.tsx
import { Fragment } from 'react';
import { useMatches, Link } from 'react-router';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@/components/ui/breadcrumb';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const MAX_VISIBLE = 3; // tampil semua jika ≤ 3, elipsis jika > 3

const AppBreadcrumb = () => {
  const matches = useMatches();

  const crumbs = matches
    .filter((m) => m.handle?.breadcrumb)
    .map((m) => {
      const handle = m.handle;
      return {
        path: m.pathname,
        label:
          typeof handle.breadcrumb === 'function'
            ? handle.breadcrumb(m.data)
            : handle.breadcrumb,
      };
    });

  if (!crumbs?.length) return null;

  // Tidak perlu elipsis
  if (crumbs.length <= MAX_VISIBLE) {
    return (
      <Breadcrumb>
        <BreadcrumbList>
          {crumbs.map((crumb, i) => {
            const isLast = i === crumbs.length - 1;
            return (
              <Fragment key={crumb.path}>
                {i > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  {isLast ? (
                    <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link to={crumb.path} />}>
                      {crumb.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
              </Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    );
  }

  // Perlu elipsis — ambil crumb pertama, hidden di tengah, dua terakhir
  const first = crumbs[0];
  const hidden = crumbs.slice(1, crumbs.length - 2);
  const last = crumbs.slice(crumbs.length - 2);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {/* Crumb pertama */}
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to={first.path} />}>
            {first.label}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {/* Elipsis dengan dropdown isi crumb yang tersembunyi */}
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" />}
            >
              <BreadcrumbEllipsis />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuGroup>
                {hidden.map((crumb) => (
                  <DropdownMenuItem
                    key={crumb.path}
                    render={<Link to={crumb.path} />}
                  >
                    {crumb.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>

        <BreadcrumbSeparator />

        {/* Dua crumb terakhir */}
        {last.map((crumb, i) => {
          const isLast = i === last.length - 1;
          return (
            <Fragment key={crumb.path}>
              {i > 0 && <BreadcrumbSeparator />}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink render={<Link to={crumb.path} />}>
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default AppBreadcrumb;
