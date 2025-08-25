import Link from "next/link";
import Image from "next/image";
import Avatar from "@/components/auth/Avatar";

export default function Header() {
  return (
    <header className="border-b border-neutral-300 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-8">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Image
              src={`${process.env.NEXT_PUBLIC_CDN_URL}/assets/logo.svg`}
              alt="KYX"
              width={32}
              height={32}
              className="mx-auto w-auto h-[32px]"
              priority
            />
            <div className="flex items-center space-x-1">
              <span className="font-semibold text-neutral-900">Calendar</span>
              <svg className="w-4 h-4 text-neutral-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            <Link href="/calendar" className="text-primary-500 border-b-2 border-primary-500 pb-2 px-1 text-sm font-medium">
              Calendar
            </Link>
          </nav>
        </div>

        {/* Right side icons */}
        <div className="flex items-center space-x-4">
          <Avatar />
        </div>
      </div>
    </header>
  );
} 