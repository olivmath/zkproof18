'use client';

import { Toaster } from 'sonner';

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={true}
      visibleToasts={10}
      closeButton
      theme="light"
      duration={5000}
      richColors={true}
    />
  );
}
