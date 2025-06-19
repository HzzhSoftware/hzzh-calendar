'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { User } from '@/types/meeting';

export default function Header() {
  const [user, ] = useState<User | null>(null);
  const [avatarUrl, ] = useState<string | null>(null);

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
                  onClick={() => {}}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {}}
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