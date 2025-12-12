import { useEffect } from "react";
import { useTheme } from "next-themes";

export default function GenerateDataModels() {
  const { setTheme, resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    const config = {
      baseSettings: {
        apiKey: process.env.NEXT_PUBLIC_INKEEP_API_KEY!,
        primaryBrandColor: "#6778DE",
        colorMode: {
          forcedColorMode: isDarkMode ? "dark" : "light",
        },
        aiAssistantAvatar:
          "https://storage.googleapis.com/organization-image-assets/embeddable-botAvatarSrcUrl-1747040031545.png",
      },
      aiChatSettings: {
        aiAssistantName: "Embeddable Model Generator",
        introMessage:
          "👋 Hi, Paste your SQL query below and I’ll turn it into a Cube.js model ⚡?",
        exampleQuestions: [
          "Can you help me convert my SQL into data models?",
          "Can you help me convert my table ddl/schema into data models?",
        ],
      },
    };
    // @ts-expect-error -- Inkeep script adds this to window
    if (window && window.Inkeep) {
      // @ts-expect-error -- Inkeep script adds this to window
      window.Inkeep?.EmbeddedChat("#ikp-embedded-chat-target", config);
    }
  }, [isDarkMode]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "calc(100vh - 16px)",
      }}
    >
      <div style={{ maxHeight: "600px", height: "100%", width: "100%" }}>
        <div id="ikp-embedded-chat-target" style={{ width: "100%" }}></div>
      </div>
    </div>
  );
}
