'use client';

import React from "react";

/**
 * A modal for connecting calendars through our internal API. This component
 * presents three provider options (Google, Outlook, and Apple) that fill the
 * available width. When the user clicks a provider, they are redirected to
 * our internal OAuth endpoint, which then handles the OAuth flow with the
 * provider and sets up webhooks for real-time calendar updates.
 *
 * The OAuth flow works as follows:
 * 1. User clicks a provider button
 * 2. Redirected to our internal OAuth endpoint (e.g., /calendar/oauth/google)
 * 3. Our backend redirects to the provider's OAuth page
 * 4. After authorization, provider redirects to our callback endpoint
 * 5. Our backend processes the OAuth response and stores tokens
 * 6. User is redirected back with success parameters
 * 7. Frontend automatically sets up webhook for real-time updates
 */

// Internal API Configuration
const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.kycombinator.com',
  calendarApi: process.env.NEXT_PUBLIC_CALENDAR_API_URL || 'https://api.kycombinator.com/calendar',
};

// OAuth endpoints for different providers
const OAUTH_ENDPOINTS = {
  google: {
    auth: `${API_CONFIG.calendarApi}/oauth/google`,
    webhookSetup: `${API_CONFIG.calendarApi}/webhook/google/calendar/setup`,
  },
  outlook: {
    auth: `${API_CONFIG.calendarApi}/oauth/outlook`, // When you implement Outlook
    webhookSetup: `${API_CONFIG.calendarApi}/webhook/outlook/calendar/setup`,
  },
  apple: {
    auth: `${API_CONFIG.calendarApi}/oauth/apple`, // When you implement Apple
    webhookSetup: `${API_CONFIG.calendarApi}/webhook/apple/calendar/setup`,
  }
};

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
  // Check for OAuth success parameters when component mounts
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const oauthSuccess = urlParams.get('oauth_success');
    const provider = urlParams.get('provider');
    const email = urlParams.get('email');
    const userId = urlParams.get('user_id');

    if (oauthSuccess === 'true' && provider && email && userId) {
      console.log(`OAuth successful for ${provider}:`, { email, userId });
      
      // Automatically set up webhook for the connected calendar
      if (provider === 'google') {
        setupCalendarWebhook(userId, provider);
      }
      
      // Clean up URL parameters
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('oauth_success');
      newUrl.searchParams.delete('provider');
      newUrl.searchParams.delete('email');
      newUrl.searchParams.delete('user_id');
      window.history.replaceState({}, '', newUrl.toString());
      
      // Close the modal and show success message
      onClose();
      // You might want to show a toast notification here
      alert(`Successfully connected ${provider} calendar for ${email}!`);
    }
  }, [onClose]);

  if (!isOpen) return null;

  /**
   * Get the OAuth URL for a given provider from our internal API.
   * This will redirect to our backend, which then redirects to the provider.
   */
  const getOAuthUrl = (type: "google" | "outlook" | "apple") => {
    const endpoint = OAUTH_ENDPOINTS[type].auth;
    // Include the current page as the redirect target after OAuth completion
    const redirectUri = encodeURIComponent(window.location.href);
    return `${endpoint}?redirect=${redirectUri}`;
  };

  /**
   * Handle calendar connection. This function:
   * 1. Redirects to our internal OAuth endpoint
   * 2. Our backend handles the OAuth flow with the provider
   * 3. User gets redirected back with success/error parameters
   */
  const handleConnect = (type: "google" | "outlook" | "apple") => {
    const url = getOAuthUrl(type);
    console.log(`Redirecting to ${type} OAuth via internal API:`, url);
    
    // Perform the redirect to our internal OAuth endpoint
    window.location.assign(url);
  };

  /**
   * Set up webhook for the connected calendar to receive real-time updates
   */
  const setupCalendarWebhook = async (userId: string, provider: string) => {
    try {
      const webhookUrl = `${API_CONFIG.calendarApi}/webhook/${provider}/calendar`;
      
      const response = await fetch(OAUTH_ENDPOINTS[provider as keyof typeof OAUTH_ENDPOINTS].webhookSetup, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          webhookUrl,
          calendarId: 'primary' // Default to primary calendar
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Webhook set up successfully:', result);
      } else {
        console.error('Failed to set up webhook:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error setting up webhook:', error);
    }
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
