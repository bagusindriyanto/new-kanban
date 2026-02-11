import React from 'react';
import { RotateCw, WifiOff, ServerOff } from 'lucide-react';
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Button } from '@/components/ui/button';

const getMessage = (fetchTasksError, fetchPICsError) =>
  fetchTasksError?.response?.data?.message ||
  fetchPICsError?.response?.data?.message ||
  'Gagal terhubung ke server.';

export const ErrorBanner = ({ isOnline, fetchTasksError, fetchPICsError }) => {
  return (
    <Item className="bg-destructive/15" variant="muted">
      <ItemMedia variant="icon">
        {!isOnline ? (
          <WifiOff className="text-destructive" />
        ) : (
          <ServerOff className="text-destructive" />
        )}
      </ItemMedia>
      <ItemContent>
        <ItemTitle className="text-destructive">
          {!isOnline ? 'Kamu Sedang Offline' : 'Terjadi Kesalahan'}
        </ItemTitle>
        <ItemDescription className="text-destructive/90">
          {!isOnline ? 'Mohon periksa koneksi internetmu.' : getMessage(fetchTasksError, fetchPICsError)}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button onClick={() => window.location.reload(false)} size="sm" variant="outline">
          <RotateCw />
          Refresh Halaman
        </Button>
      </ItemActions>
    </Item>
  );
};

export const ErrorFull = ({ isOnline, fetchTasksError, fetchPICsError, action }) => {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          {!isOnline ? (
            <WifiOff className="text-destructive" />
          ) : (
            <ServerOff className="text-destructive" />
          )}
        </EmptyMedia>
        <EmptyTitle className="text-destructive">
          {!isOnline ? 'Kamu Sedang Offline' : 'Terjadi Kesalahan'}
        </EmptyTitle>
        <EmptyDescription className="text-destructive/90">
          {!isOnline ? 'Mohon periksa koneksi internetmu.' : getMessage(fetchTasksError, fetchPICsError)}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {action || (
          <Button onClick={() => window.location.reload(false)} variant="outline">
            <RotateCw />
            Refresh Halaman
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
};

export default ErrorBanner;
