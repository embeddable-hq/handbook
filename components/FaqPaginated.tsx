import React, { useState, useRef, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Pagination from "@mui/material/Pagination";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import faqData from "../pages/faqs.json";

const FAQS_PER_PAGE = 20;

type SortKey = "newest" | "oldest" | "alphabetical";
const DEFAULT_SORT: SortKey = "newest";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "alphabetical", label: "Alphabetical by title" },
];

interface FaqEntry {
  question: string;
  slug: string;
  answer: string;
  created_at: string;
}

const SORTERS: Record<SortKey, (a: FaqEntry, b: FaqEntry) => number> = {
  newest: (a, b) => b.created_at.localeCompare(a.created_at),
  oldest: (a, b) => a.created_at.localeCompare(b.created_at),
  alphabetical: (a, b) =>
    a.question.localeCompare(b.question, "en", { sensitivity: "base" }),
};

// "April 22, 2026" - pinned to UTC so the day doesn't shift by time zone
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

const markdownComponents = {
  a: ({ href = "", children }: React.ComponentProps<"a">) =>
    href.startsWith("/") ? (
      <Link href={href}>{children}</Link>
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
};

const FaqPaginated: React.FC = () => {
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortKey>(DEFAULT_SORT);
  const [query, setQuery] = useState("");
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const scrollToSlug = useRef<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
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

  const sorted = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (faqData.faqs as FaqEntry[])
      .filter((f) => f.question.toLowerCase().includes(q))
      .sort(SORTERS[sort]);
  }, [sort, query]);

  // Open the FAQ named in the URL hash: clear the search, jump to its page and
  // expand it. Runs on load and whenever the hash changes (e.g. in-page links).
  useEffect(() => {
    const openFromHash = () => {
      const slug = decodeURIComponent(window.location.hash.slice(1));
      if (!slug) return;
      const index = (faqData.faqs as FaqEntry[])
        .slice()
        .sort(SORTERS[sort])
        .findIndex((f) => f.slug === slug);
      if (index === -1) return;
      setQuery("");
      setPage(Math.floor(index / FAQS_PER_PAGE) + 1);
      setOpenSlug(slug);
      scrollToSlug.current = slug;
    };
    openFromHash();
    // Native hash changes (plain #links, address bar) and Next <Link> hash-only
    // navigations (which don't fire "hashchange") both need handling
    window.addEventListener("hashchange", openFromHash);
    router.events.on("hashChangeComplete", openFromHash);
    return () => {
      window.removeEventListener("hashchange", openFromHash);
      router.events.off("hashChangeComplete", openFromHash);
    };
  }, [sort, router.events]);

  // Scroll to a deep-linked FAQ once its page has rendered
  useEffect(() => {
    if (!scrollToSlug.current) return;
    document
      .getElementById(scrollToSlug.current)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
    scrollToSlug.current = null;
  }, [openSlug, page]);

  const setHash = (slug: string | null) => {
    const url = window.location.pathname + window.location.search + (slug ? `#${slug}` : "");
    window.history.replaceState(window.history.state, "", url);
  };

  const closeOpenItem = () => {
    setOpenSlug(null);
    setHash(null);
  };

  const toggleItem = (slug: string) => {
    const next = openSlug === slug ? null : slug;
    setOpenSlug(next);
    setHash(next);
  };

  const totalPages = Math.ceil(sorted.length / FAQS_PER_PAGE);
  const startIndex = (page - 1) * FAQS_PER_PAGE;
  const currentItems = sorted.slice(startIndex, startIndex + FAQS_PER_PAGE);

  const scrollToTop = () => {
    if (containerRef.current) {
      const top =
        containerRef.current.getBoundingClientRect().top + window.scrollY - 80; // offset for sticky header
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    closeOpenItem();
    scrollToTop();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
    closeOpenItem();
  };

  const handleSortChange = (e: SelectChangeEvent) => {
    setSort(e.target.value as SortKey);
    setPage(1);
    closeOpenItem();
  };

  const linkColor = "var(--nextra-primary)";
  const codeBackground = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)";
  const codeBorder = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)";
  const metaColor = isDark ? "#aaa" : "#666";
  const borderColor = isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)";

  return (
    <ThemeProvider theme={muiTheme}>
      <div ref={containerRef} style={{ scrollMarginTop: "80px" }}>
        {/* Search and sort */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.75rem 1rem",
            marginBottom: "1rem",
            fontSize: "0.875rem",
            color: metaColor,
          }}
        >
          <TextField
            type="search"
            size="small"
            placeholder="Search titles"
            value={query}
            onChange={handleSearchChange}
            sx={{ flex: "1 1 220px", maxWidth: 360 }}
            slotProps={{
              htmlInput: { "aria-label": "Search FAQ titles" },
              input: { sx: { fontSize: "0.875rem" } },
            }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <label id="faq-sort-label">Sort by</label>
            <Select
              labelId="faq-sort-label"
              size="small"
              value={sort}
              onChange={handleSortChange}
              sx={{ fontSize: "0.875rem", minWidth: 190 }}
            >
              {SORT_OPTIONS.map((o) => (
                <MenuItem
                  key={o.value}
                  value={o.value}
                  sx={{ fontSize: "0.875rem" }}
                >
                  {o.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        {sorted.length === 0 && (
          <p
            style={{ color: metaColor, textAlign: "center", margin: "2rem 0" }}
          >
            No questions match “{query.trim()}”.
          </p>
        )}
        {currentItems.map((entry) => (
          <details
            key={entry.slug}
            id={entry.slug}
            className="faq-item"
            open={openSlug === entry.slug}
          >
            <summary
              className="faq-summary"
              onClick={(e) => {
                // Let React own the open state so only one item is open at a time
                e.preventDefault();
                toggleItem(entry.slug);
              }}
            >
              <div style={{ fontSize: "1.05rem", fontWeight: 600 }}>
                {entry.question}
              </div>
              <div
                style={{
                  color: metaColor,
                  fontSize: "0.75rem",
                  marginTop: "0.25rem",
                }}
              >
                {formatDate(entry.created_at)}
              </div>
            </summary>
            <div className="faq-answer">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={markdownComponents}
              >
                {entry.answer}
              </ReactMarkdown>
            </div>
          </details>
        ))}
        {/* Pagination */}
        {totalPages > 1 && (
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
        )}
      </div>

      <style jsx global>{`
        .faq-item {
          scroll-margin-top: 80px;
          margin-bottom: 0.75rem;
          border: 1px solid ${borderColor};
          border-radius: 8px;
        }
        .faq-summary {
          cursor: pointer;
          padding: 0.75rem 1.5rem;
          list-style: none;
          position: relative;
          padding-right: 3rem;
        }
        .faq-summary::-webkit-details-marker {
          display: none;
        }
        .faq-summary::after {
          content: "▾";
          position: absolute;
          right: 1.25rem;
          top: 1rem;
          color: ${metaColor};
          transition: transform 0.15s;
        }
        .faq-item[open] > .faq-summary::after {
          transform: rotate(180deg);
        }
        .faq-item .faq-answer {
          padding: 0 1.5rem 1.25rem;
        }
        .faq-answer {
          font-size: 0.9rem;
          line-height: 1.6;
          overflow-wrap: anywhere;
        }
        .faq-answer > *:first-child {
          margin-top: 0;
        }
        .faq-answer p,
        .faq-answer ul,
        .faq-answer ol,
        .faq-answer pre,
        .faq-answer table {
          margin: 0.75rem 0;
        }
        .faq-answer ul {
          list-style: disc;
          padding-left: 1.25rem;
        }
        .faq-answer ol {
          list-style: decimal;
          padding-left: 1.25rem;
        }
        .faq-answer h1,
        .faq-answer h2,
        .faq-answer h3,
        .faq-answer h4 {
          font-size: 1rem;
          font-weight: 600;
          margin: 1rem 0 0.5rem;
        }
        .faq-answer a {
          color: ${linkColor};
          text-decoration: underline;
        }
        .faq-answer img {
          max-width: 100%;
          height: auto;
          border-radius: 4px;
        }
        .faq-answer code {
          font-family: monospace;
          font-size: 0.85em;
          padding: 0.1em 0.35em;
          border-radius: 4px;
          background: ${codeBackground};
          border: 1px solid ${codeBorder};
        }
        .faq-answer pre {
          overflow-x: auto;
          padding: 0.75rem 1rem;
          border-radius: 6px;
          background: ${codeBackground};
          border: 1px solid ${codeBorder};
        }
        .faq-answer pre code {
          padding: 0;
          border: none;
          background: none;
          overflow-wrap: normal;
        }
        .faq-answer table {
          display: block;
          overflow-x: auto;
          border-collapse: collapse;
        }
        .faq-answer th,
        .faq-answer td {
          padding: 0.4rem 0.75rem;
          border: 1px solid ${codeBorder};
          text-align: left;
        }
        .faq-answer hr {
          margin: 1rem 0;
          border-color: ${codeBorder};
        }
        .faq-answer blockquote {
          margin: 0.75rem 0;
          padding-left: 1rem;
          border-left: 3px solid ${codeBorder};
          color: ${metaColor};
        }
      `}</style>
    </ThemeProvider>
  );
};

export default FaqPaginated;
