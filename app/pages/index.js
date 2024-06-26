import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push('/dashboard'); // Replace '/dashboard' with the path to your dashboard page
  }, [router]);

  return null; // Render nothing while redirecting
}