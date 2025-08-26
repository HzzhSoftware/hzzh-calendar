'use client';

import React from "react";

/**
 * A simple modal for connecting calendars. Instead of collecting a name and email,
 * this component presents three provider options (Google, Outlook, and Apple)
 * that fill the available width. When the user clicks a provider, they are
 * redirected to the appropriate OAuth authorization URL.
 *
 * The callback URLs for each provider are defined at the top of the file
 * as constants. Adjust these values to match the OAuth redirect URIs
 * configured in your identity providers.
 */

// OAuth Configuration - these would come from environment variables or config
const OAUTH_CONFIG = {
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID',
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
  },
  outlook: {
    clientId: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID || 'YOUR_OUTLOOK_CLIENT_ID',
    scope: 'https://graph.microsoft.com/Calendars.ReadWrite',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
  },
  apple: {
    clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID || 'YOUR_APPLE_CLIENT_ID',
    scope: 'name email',
    authUrl: 'https://appleid.apple.com/auth/authorize'
  }
};

// Helper function to build OAuth URLs
const buildOAuthUrl = (provider: keyof typeof OAUTH_CONFIG, redirectUri: string) => {
  const config = OAUTH_CONFIG[provider];
  const params = new URLSearchParams({
    client_id: config.clientId,
    response_type: 'code',
    scope: config.scope,
    redirect_uri: redirectUri,
    ...(provider === 'google' && {
      access_type: 'offline',
      prompt: 'consent'
    }),
    ...(provider === 'outlook' && {
      response_mode: 'query'
    })
  });
  
  return `${config.authUrl}?${params.toString()}`;
};

// --- OAuth callback configuration ---
// You can modify these constants to point to the correct OAuth redirect
// endpoints in your application. Ensure they match the values configured
// in the provider's console.
const GOOGLE_CALLBACK = "https://api.kycombinator.com/auth/oauth/google/callback";
const OUTLOOK_CALLBACK = "/api/oauth/outlook/callback";
const APPLE_CALLBACK = "/api/oauth/apple/callback";

interface ConnectCalendarModalProps {
  /**
   * Whether the modal is visible. When false, nothing is rendered.
   */
  isOpen: boolean;
  /**
   * Callback invoked when the user closes the modal via the close icon.
   */
  onClose: () => void;
}

export default function ConnectCalendarModal({
  isOpen,
  onClose,
}: ConnectCalendarModalProps) {
  if (!isOpen) return null;

  /**
   * Construct the full authorization URL for a given provider. This function
   * now uses the parameterized OAuth configuration.
   */
  const getOAuthUrl = (type: "google" | "outlook" | "apple") => {
    const redirectUri = type === "google" ? GOOGLE_CALLBACK : 
                       type === "outlook" ? OUTLOOK_CALLBACK : APPLE_CALLBACK;
    return buildOAuthUrl(type, redirectUri);
  };

  /**
   * Redirect to the provider's OAuth page. In a real application you may
   * want to include a CSRF state parameter here.
   */
  const handleConnect = (type: "google" | "outlook" | "apple") => {
    const url = getOAuthUrl(type);
    // Perform the redirect. Using window.location.assign ensures the user
    // doesn't remain in a single-page app history state.
    window.location.assign(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/10 backdrop-blur-sm">
      <div className="mx-4 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <h2 className="text-xl font-semibold text-gray-900">Connect Calendar</h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
            aria-label="Close modal"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Options */}
        <div className="space-y-4 p-6">
          {(
            [
              { type: "google", label: "Google", iconColor: "text-red-500" },
              { type: "outlook", label: "Outlook", iconColor: "text-blue-500" },
              { type: "apple", label: "Apple", iconColor: "text-gray-800" },
            ] as const
          ).map(({ type, label, iconColor }) => (
            <button
              key={type}
              type="button"
              onClick={() => handleConnect(type)}
              className="flex w-full items-center justify-center gap-3 rounded-lg border-2 border-gray-200 p-4 transition-all duration-200 hover:bg-gray-50 hover:border-primary-500"
            >
              {getIcon(type, iconColor)}
              <span className="text-sm font-medium text-gray-800">
                Connect {label} Calendar
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Render the SVG icon for a given provider. The icons are deliberately simple
 * to avoid pulling in external dependencies. Adjust colours via the
 * `iconColor` parameter which accepts a Tailwind text colour class.
 */
function getIcon(
  type: "google" | "outlook" | "apple",
  iconColor: string,
) {
  switch (type) {
    case "google":
      return (
        <svg
          className={`h-6 w-6 ${iconColor}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
      );
    case "outlook":
      return (
        <svg
          className={`h-6 w-6 ${iconColor}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M7.88 3.39L6.6 1.86 2 5.71l1.29 1.53 4.59-3.85zM22 5.72l-4.6-3.86-1.29 1.53 4.59 3.85L22 5.72zM12 4c-4.97 0-9 4.03-9 9s4.02 9 9 9c4.97 0 9-4.03 9-9s-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
        </svg>
      );
    case "apple":
      return (
        <svg
          className={`h-6 w-6 ${iconColor}`}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </svg>
      );
  }
}
