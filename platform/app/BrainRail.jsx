"use client";

import { usePathname } from "next/navigation";

// The left rail shell - replaces the old header.top + .topnav.
// Reference: design_handoff_second_brain/BrainRail.dc.html.
// Client component only so it can read the current path for the active
// state; the counts themselves are fetched server-side in layout.jsx and
// passed in as props.

const ICONS = {
  today: (
    <>
      <rect x="3" y="4" width="18" height="18" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </>
  ),
  brief: (
    <>
      <path d="M12 2v8M4.93 10.93l1.41 1.41M2 18h2M20 18h2M19.07 10.93l-1.41 1.41M22 22H2M8 6l4-4 4 4M16 18a4 4 0 0 0-8 0" />
    </>
  ),
  closing: (
    <>
      <polyline points="9 11 12 14 22 4" />
      <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    </>
  ),
  stories: (
    <>
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </>
  ),
  people: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  companies: (
    <>
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
      <path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
      <path d="M10 6h4M10 10h4M10 14h4M10 18h4" />
    </>
  ),
  genesis: (
    <>
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <path d="M12 7v5l4 2" />
    </>
  ),
  network: (
    <>
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <path d="m8.59 13.51 6.83 3.98M15.41 6.51l-6.82 3.98" />
    </>
  ),
  review: (
    <>
      <polyline points="22 12 16 12 14 15 10 15 8 12 2 12" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </>
  ),
  links: (
    <>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </>
  ),
  leads: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <line x1="19" x2="19" y1="8" y2="14" />
      <line x1="22" x2="16" y1="11" y2="11" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z" />
    </>
  ),
};

function Icon({ name }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      {ICONS[name]}
    </svg>
  );
}

function RailItem({ href, icon, label, count, active }) {
  return (
    <a href={href} className={`rail-item${active ? " active" : ""}`}>
      <Icon name={icon} />
      <span className="rail-item-label">{label}</span>
      {count != null && <span className="rail-count">{count}</span>}
    </a>
  );
}

// Matches the current pathname to one rail item so exactly one lights up -
// a prefix match, longest-prefix-wins so /people/review doesn't also
// light up /people.
function isActive(pathname, href) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function BrainRail({ counts }) {
  const pathname = usePathname();

  const groups = [
    {
      items: [
        { href: "/", icon: "today", label: "Today" },
        { href: "/brief", icon: "brief", label: "Brief" },
        { href: "/closing", icon: "closing", label: "Closing" },
      ],
    },
    {
      label: "Brain",
      items: [
        { href: "/stories", icon: "stories", label: "Stories", count: counts.stories },
        { href: "/people", icon: "people", label: "People", count: counts.people },
        { href: "/clienti", icon: "companies", label: "Companies", count: counts.companies },
        { href: "/genesis", icon: "genesis", label: "Genesis" },
        { href: "/network", icon: "network", label: "Network" },
      ],
    },
    {
      label: "Queues",
      items: [
        { href: "/people/review", icon: "review", label: "Review people", count: counts.reviewPeople || null },
        { href: "/links/review", icon: "links", label: "Link proposals", count: counts.reviewLinks || null },
        { href: "/leads", icon: "leads", label: "Leads" },
      ],
    },
  ];

  // /people/review is a more specific prefix than /people - check it first
  // so People itself doesn't also light up on the review sub-route.
  const activeHref = [...groups.flatMap((g) => g.items), { href: "/settings" }]
    .map((it) => it.href)
    .sort((a, b) => b.length - a.length)
    .find((href) => isActive(pathname, href));

  return (
    <aside className="rail">
      <div className="rail-brand">
        <img src="/logo-dark.svg" alt="" />
        <div>
          <div className="rail-brand-name">Second brain</div>
          <div className="rail-brand-eyebrow">AI Central · mission control</div>
        </div>
      </div>

      <a href="/search" className="rail-search" title="Search - the ⌘K command palette isn't built yet, this opens /search directly">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#6B6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.3-4.3" />
        </svg>
        <span>Search or jump to</span>
        <span className="rail-kbd">⌘K</span>
      </a>

      <button type="button" className="rail-capture" disabled title="Quick capture is not built yet">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" />
        </svg>
        <span>Capture</span>
        <span className="rail-kbd">C</span>
      </button>

      <nav className="rail-nav">
        {groups.map((g, i) => (
          <div key={i}>
            {g.label && <p className="rail-group-label">{g.label}</p>}
            {g.items.map((it) => (
              <RailItem key={it.href} {...it} active={it.href === activeHref} />
            ))}
          </div>
        ))}
      </nav>

      <div className="rail-footer">
        <RailItem href="/settings" icon="settings" label="Settings" active={activeHref === "/settings"} />
        <div className="rail-identity">
          <span className="rail-identity-mark">AF</span>
          <div>
            <div className="rail-identity-name">Alex Fiore</div>
            <div className="rail-identity-email">alex@thecentral.ai</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
