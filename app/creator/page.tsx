'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatorRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/dashboard#creator');
  }, [router]);
  return null;
}


