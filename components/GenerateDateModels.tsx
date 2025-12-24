import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import {
  InkeepEmbeddedChat,
  type InkeepEmbeddedChatProps,
} from "@inkeep/cxkit-react";

export default function GenerateDataModels() {
  const [showChild, setShowChild] = useState(false);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  // We do this to avoid a useLayoutEffect warning
  useEffect(() => {
    setShowChild(true);
  }, []);

  const embeddedChatProps: InkeepEmbeddedChatProps = {
    baseSettings: {
      apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
      primaryBrandColor: "#6778DE",
      colorMode: {
        forcedColorMode: isDarkMode ? "dark" : "light",
      },
      theme: {
        styles: [
          {
            key: "custom-theme",
            type: "style",
            value: `
              .ikp-ai-chat-wrapper {
                box-shadow: none;
                margin: 0;
                width: 100%;
                border: 1px solid #eeeeee;
              }
              .ikp-ai-chat-content {
                justify-content: start;
              }
            `,
          },
        ],
      },
    },
    aiChatSettings: {
      aiAssistantAvatar:
        "https://storage.googleapis.com/organization-image-assets/embeddable-botAvatarSrcUrl-1747040031545.png",
      aiAssistantName: "Embeddable Model Generator",
      introMessage:
        "👋 Hi, Paste your SQL query below and I’ll turn it into a Cube.js model ⚡",
      exampleQuestions: [
        "Can you help me convert my SQL into data models?",
        "Can you help me convert my table ddl/schema into data models?"
      ],
    },
  };

  return showChild ? (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "700px",
        paddingTop: 30,
      }}
    >
      <div style={{ width: "100%", height: 600 }}>
        <InkeepEmbeddedChat {...embeddedChatProps} />
      </div>
    </div>
  ) : null;
}
