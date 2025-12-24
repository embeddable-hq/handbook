import dynamic from "next/dynamic";
import type { InkeepChatButtonProps } from "@inkeep/cxkit-react";

// load the button only in the browser to avoid the CJS/ESM clash
const InkeepChatButton = dynamic(
  () => import("@inkeep/cxkit-react").then((m) => m.InkeepChatButton),
  { ssr: false }
);

const cfg: InkeepChatButtonProps = {
  baseSettings: {
    apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
    primaryBrandColor: "#6778DE", // Primary theme color
    theme: {
      primaryColors: {
        // Text
        textBold: "#40457e", // Darker tone for emphasis
        textSubtle: "#7f8bdc", // Softer text for subtler content

        // Backgrounds and element fills
        lighter: "#e7e9fb", // Very light background shade
        light: "#b4baf0", // Lighter hover/fill variant
        lightSubtle: "#8f9be8", // Soft background fill
        medium: "#6778DE", // Base color for main elements
        mediumSubtle: "#5c6dc6", // Slightly muted version of base

        // Active states and strong accents
        strong: "#4e5db8", // Stronger/active state
        stronger: "#3b4696", // Boldest use of color (e.g., CTAs)

        // On-primary text
        textColorOnPrimary: "white", // Ensures contrast on dark blue buttons
      },
    },
  },
  aiChatSettings: {
    aiAssistantName: "Embeddabot",
    getHelpOptions: [
      {
        icon: { builtIn: "IoChatbubblesOutline" },
        name: "Contact us",
        action: {
          type: "open_link",
          url: `mailto:support@embeddable.com`,
        },
      },
      {
        icon: { builtIn: "FaSlack" },
        name: "Slack Community",
        action: {
          type: "open_link" as const,
          url: "https://join.slack.com/t/embeddablecommunity/shared_invite/zt-20b4f6s10-gULqO6riqutJcbUi_FJmZA",
        },
      },
      {
        icon: { builtIn: "LuCalendar" },
        name: "Data modeling Office Hours",
        action: {
          type: "open_link",
          url: `https://calendly.com/d/cwvv-j2y-pr3/embeddable-office-hours-data`,
        },
      },
      {
        icon: { builtIn: "LuCalendar" },
        name: "Frontend / component Office Hours",
        action: {
          type: "open_link",
          url: "https://calendly.com/d/cs3x-dyg-c27/embeddable-office-hours-fe",
        },
      },
      {
        icon: { builtIn: "IoHelpBuoyOutline" },
        name: "Submit a ticket",
        action: {
          type: "open_link",
          url: "https://trevorio.atlassian.net/servicedesk/customer/portal/1/group/1/create/1",
        },
      },
    ],
  },
  label: "Ask AI",
  avatar: "/img/embeddable_icon_svg.svg",
};

export const InkeepChat = () => <InkeepChatButton {...cfg} />;
