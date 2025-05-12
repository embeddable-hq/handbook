import dynamic from 'next/dynamic';
import type { InkeepChatButtonProps } from '@inkeep/cxkit-react';

// load the button only in the browser to avoid the CJS/ESM clash
const InkeepChatButton = dynamic(
  () => import('@inkeep/cxkit-react').then(m => m.InkeepChatButton),
  { ssr: false }
);

const cfg: InkeepChatButtonProps = {
  baseSettings: {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
	primaryBrandColor: "#6778DE", // Primary theme color
	theme: {
		primaryColors: {
		// Text
		textBold: "#40457e",         // Darker tone for emphasis
		textSubtle: "#7f8bdc",       // Softer text for subtler content

		// Backgrounds and element fills
		lighter: "#e7e9fb",          // Very light background shade
		light: "#b4baf0",            // Lighter hover/fill variant
		lightSubtle: "#8f9be8",      // Soft background fill
		medium: "#6778DE",           // Base color for main elements
		mediumSubtle: "#5c6dc6",     // Slightly muted version of base

		// Active states and strong accents
		strong: "#4e5db8",           // Stronger/active state
		stronger: "#3b4696",         // Boldest use of color (e.g., CTAs)

		// On-primary text
		textColorOnPrimary: "white", // Ensures contrast on dark blue buttons
		}
	}
  },
  aiChatSettings: { aiAssistantName: 'Embeddabot' },
  label: 'Ask AI',
  avatar: '/img/embeddable_icon.png'
};

export const InkeepChat = () => <InkeepChatButton {...cfg} />;