import React, { useState, useRef, useEffect } from "react";
import { useTheme } from "next-themes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import changelogData from "../pages/component-libraries/remarkable-pro/changelog.json";

const ITEMS_PER_PAGE = 10;

interface ChangelogEntry {
  version: string;
  date: string;
  git: string;
  npm: string;
  notes: string[];
}

function parseInlineCode(text: string): React.ReactNode {
  const parts = text.split(/(`[^`]+`)/g);
  if (parts.length === 1) return text;
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith("`") && part.endsWith("`") ? (
          <code key={i} className="cl-inline-code">
            {part.slice(1, -1)}
          </code>
        ) : (
          part
        )
      )}
    </>
  );
}

const ChangelogPaginated: React.FC = () => {
  const [page, setPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Avoid hydration mismatch by defaulting to light until mounted
  const isDark = mounted && resolvedTheme === "dark";

  const muiTheme = createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
      primary: {
        main: "#6778DE",
      },
    },
    typography: {
      fontFamily:
        '"SF Pro Text", "SF Pro Icons", "Helvetica Neue", "Helvetica", "Arial", sans-serif',
    },
  });

  const totalPages = Math.ceil(changelogData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = changelogData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  ) as ChangelogEntry[];

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    if (containerRef.current) {
      const top =
        containerRef.current.getBoundingClientRect().top +
        window.scrollY -
        80; // offset for sticky header
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const linkColor = "var(--nextra-primary)";
  const codeBackground = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const codeBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const metaColor = isDark ? "#aaa" : "#666";
  const borderColor = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";

  return (
    <ThemeProvider theme={muiTheme}>
      <div ref={containerRef} style={{ scrollMarginTop: "80px" }}>
        {currentItems.map((entry) => (
          <Paper
            key={entry.version}
            elevation={isDark ? 2 : 1}
            sx={{
              p: "1.25rem 1.5rem",
              mb: "0.75rem",
              borderRadius: "8px",
            }}
          >
            {/* Version header */}
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "0.75rem",
                flexWrap: "wrap",
                marginBottom: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "1.05rem",
                  fontWeight: 600,
                  fontFamily: "monospace",
                }}
              >
                {entry.version}
              </span>
              <span style={{ color: metaColor, fontSize: "0.875rem" }}>
                {entry.date}
              </span>
            </div>

            {/* Links */}
            <div
              style={{
                fontSize: "0.8rem",
                marginBottom: "0.75rem",
                paddingBottom: "0.75rem",
                borderBottom: `1px solid ${borderColor}`,
                display: "flex",
                gap: "1rem",
              }}
            >
              <a
                href={entry.git}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: linkColor, textDecoration: "none" }}
              >
                GitHub release ↗
              </a>
              <a
                href={entry.npm}
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: linkColor, textDecoration: "none" }}
              >
                npm ↗
              </a>
            </div>

            {/* Change notes */}
            <ul
              style={{
                margin: 0,
                paddingLeft: "1.25rem",
                fontSize: "0.9rem",
                lineHeight: 1.6,
              }}
            >
              {entry.notes.map((note, i) => (
                <li key={i}>{parseInlineCode(note)}</li>
              ))}
            </ul>
          </Paper>
        ))}

        {/* Pagination */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5rem",
            paddingBottom: "0.5rem",
          }}
        >
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            siblingCount={0}
            boundaryCount={1}
          />
        </div>
      </div>

      <style jsx global>{`
        .cl-inline-code {
          font-family: monospace;
          font-size: 0.85em;
          padding: 0.1em 0.35em;
          border-radius: 4px;
          background: ${codeBackground};
          border: 1px solid ${codeBorder};
        }
      `}</style>
    </ThemeProvider>
  );
};

export default ChangelogPaginated;
