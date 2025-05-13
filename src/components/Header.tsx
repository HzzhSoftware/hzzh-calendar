'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { User } from '@supabase/auth-helpers-nextjs';

export default function Header() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      console.log('Initial user check:', user, error); // Debug log
      setUser(user);
      if (user?.user_metadata?.avatar_url) {
        setAvatarUrl(user.user_metadata.avatar_url);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session); // Debug log
      setUser(session?.user ?? null);
      if (session?.user?.user_metadata?.avatar_url) {
        setAvatarUrl(session.user.user_metadata.avatar_url);
      } else {
        setAvatarUrl(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const handleSignIn = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    console.log('Sign in attempted:', data, error); // Debug log
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    console.log('Sign out attempted:', error); // Debug log
    setAvatarUrl(null);
  };

  // Debug render
  console.log('Current user state:', user);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="font-bold text-xl">
            Calendar
          </Link>
          
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {avatarUrl && (
                  <Image
                    src={avatarUrl}
                    alt="User avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                )}
                <span className="text-gray-700">{user.email}</span>
                <button
                  onClick={handleSignOut}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In with Google
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
} 