import { supabaseSelect } from "../../lib/supabase";
import { updateStoryNextAction, updateStoryNextActionDate, updateStoryStrategy } from "../story/actions";
import { parseAttendees } from "../../lib/people";
import TableCellInput from "../people/TableCellInput";
import SavedToast from "../people/SavedToast";
import Avatar from "../people/Avatar";

export const dynamic = "force-dynamic";

// "0 - URGENT" -> 0 ... "4 - STRATEGIC" -> 4; no priority sorts last.
function priorityRank(p) {
  const n = parseInt(p, 10);
  return Number.isNaN(n) ? 5 : n;
}

function daysBetween(fromIso, toIso) {
  return Math.round((new Date(toIso) - new Date(fromIso)) / 86400000);
}

function NotionTaskLine({ t }) {
  return (
    <a
      href={t.notion_url}
      target="_blank"
      rel="noreferrer"
      className={`nba-task${priorityRank(t.priority) === 0 ? " nba-task-urgent" : ""}`}
    >
      {t.priority ? `${t.priority.slice(0, 1)} · ` : ""}
      {t.task}
      {t.status && t.status !== "Not started" ? ` (${t.status.toLowerCase()})` : ""}
    </a>
  );
}

function StoryRow({ item, today }) {
  const overdueDays = item.date && item.date < today ? daysBetween(item.date, today) : 0;
  return (
    <div className="nba-row">
      <div className="nba-row-head">
        <a href={`/story/${item.slug}`} className="nba-title">
          {item.title}
        </a>
        {item.kind === "sale" && <span className="nba-chip nba-chip-sale">cliente</span>}
        {overdueDays > 0 && (
          <span className="genesis-next-action-flag">in ritardo da {overdueDays}g</span>
        )}
        {item.date && overdueDays <= 0 && (
          <span className="nba-chip">entro {item.date}</span>
        )}
      </div>
      {item.id ? (
        <>
          <div className="genesis-next-action" style={{ marginTop: 4 }}>
            <TableCellInput
              action={updateStoryNextAction}
              id={item.id}
              name="next_action"
              defaultValue={item.action || ""}
              placeholder="prossima azione..."
            />
            <TableCellInput
              action={updateStoryNextActionDate}
              id={item.id}
              name="next_action_date"
              defaultValue={item.date || ""}
              type="date"
              placeholder="data"
            />
          </div>
          <details className="nba-strategy" open={!!item.strategy}>
            <summary>
              {item.strategy ? "strategia" : "aggiungi la tua strategia"}
            </summary>
            <TableCellInput
              action={updateStoryStrategy}
              id={item.id}
              name="strategy"
              defaultValue={item.strategy || ""}
              placeholder="come vuoi giocarla, parole tue - le bozze partono da qui"
              multiline
              rows={2}
            />
          </details>
        </>
      ) : (
        item.action && <p className="nba-action">{item.action}</p>
      )}
      {item.tasks.length > 0 && (
        <div className="nba-tasks">
          {item.tasks.map((t) => (
            <NotionTaskLine key={t.notion_url} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}

function MeetingRow({ m, peopleByEmail }) {
  const when = new Date(m.start_time);
  const attendees = parseAttendees(m.attendees);
  return (
    <div className="nba-row">
      <div className="nba-row-head">
        <span className="nba-title">{m.title}</span>
        <span className="nba-chip">
          {when.toLocaleDateString("it-IT", { weekday: "short", day: "numeric", month: "short" })}
          {" · "}
          {when.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, margin: "6px 0" }}>
        {attendees.map((a) => {
          const p = a.email ? peopleByEmail.get(a.email) : null;
          return (
            <span key={a.email || a.name} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <Avatar name={p?.name || a.name} photoUrl={p?.photo_url} size={20} />
              {p ? (
                <a href={`/people/${p.id}`}>{p.name}</a>
              ) : (
                a.name
              )}
            </span>
          );
        })}
      </div>
      {m.notes && <p className="nba-action" style={{ margin: "0 0 4px" }}>{m.notes}</p>}
      {attendees
        .map((a) => (a.email ? peopleByEmail.get(a.email) : null))
        .filter((p) => p?.background)
        .map((p) => (
          <p key={p.id} style={{ fontSize: 12.5, color: "var(--ink-dim)", margin: "2px 0" }}>
            <strong>{p.name}</strong> - {p.background}
          </p>
        ))}
      {m.story_slug && (
        <p style={{ margin: "4px 0 0" }}>
          <a href={`/story/${m.story_slug}`}>Vedi la storia collegata &rarr;</a>
        </p>
      )}
    </div>
  );
}

function Section({ title, note, children, count }) {
  return (
    <section className="content" style={{ marginBottom: 20 }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
        <h2 style={{ fontWeight: 700, fontSize: 17, margin: 0 }}>{title}</h2>
        <span style={{ fontSize: 13, color: "var(--ink-faint)" }}>{count}</span>
      </div>
      {note && <p style={{ fontSize: 13, color: "var(--ink-faint)", margin: "0 0 10px" }}>{note}</p>}
      {children}
    </section>
  );
}

export default async function NbaPage() {
  const nowIso = new Date().toISOString();
  const [stories, tasks, meetings, meetingPeople] = await Promise.all([
    supabaseSelect(
      "ledger_stories",
      "?select=id,slug,title,kind,next_action,next_action_date,strategy&or=(next_action.not.is.null,next_action_date.not.is.null)"
    ),
    supabaseSelect("ledger_notion_tasks", "?select=notion_url,task,status,priority,bucket,channel,story_slug"),
    supabaseSelect(
      "ledger_upcoming_meetings",
      `?start_time=gte.${nowIso}&order=start_time.asc&select=event_id,title,start_time,attendees,story_slug,notes`
    ).catch(() => []),
    supabaseSelect("ledger_people", "?archived=eq.false&select=id,name,identity,photo_url,background"),
  ]);
  const peopleByEmail = new Map(
    meetingPeople.filter((p) => p.identity).map((p) => [p.identity.toLowerCase(), p])
  );

  const today = new Date().toISOString().slice(0, 10);
  const weekOut = new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10);

  const tasksBySlug = new Map();
  const boardOnly = [];
  for (const t of tasks) {
    if (t.story_slug) {
      if (!tasksBySlug.has(t.story_slug)) tasksBySlug.set(t.story_slug, []);
      tasksBySlug.get(t.story_slug).push(t);
    } else {
      boardOnly.push(t);
    }
  }
  for (const list of tasksBySlug.values()) {
    list.sort((a, b) => priorityRank(a.priority) - priorityRank(b.priority));
  }
  boardOnly.sort(
    (a, b) => priorityRank(a.priority) - priorityRank(b.priority) || a.task.localeCompare(b.task)
  );

  const actionSlugs = new Set();
  const items = stories.map((s) => {
    actionSlugs.add(s.slug);
    return {
      id: s.id,
      slug: s.slug,
      title: s.title,
      kind: s.kind,
      action: s.next_action,
      date: s.next_action_date,
      strategy: s.strategy,
      tasks: tasksBySlug.get(s.slug) || [],
    };
  });

  const overdue = items
    .filter((i) => i.date && i.date < today)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const dueSoon = items
    .filter((i) => i.date && i.date >= today && i.date <= weekOut)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const later = items
    .filter((i) => i.date && i.date > weekOut)
    .sort((a, b) => (a.date < b.date ? -1 : 1));
  const undated = items.filter((i) => !i.date && i.action);

  // Stories that carry open Notion tasks but no next_action of their own -
  // the task board knows something the genesis field doesn't yet.
  const taskOnlySlugs = [...tasksBySlug.keys()].filter((slug) => !actionSlugs.has(slug));
  let taskOnlyStories = [];
  if (taskOnlySlugs.length > 0) {
    const rows = await supabaseSelect(
      "ledger_stories",
      `?select=id,slug,title,kind,strategy&slug=in.(${taskOnlySlugs.map(encodeURIComponent).join(",")})`
    );
    taskOnlyStories = rows
      .map((s) => ({
        id: s.id,
        slug: s.slug,
        title: s.title,
        kind: s.kind,
        action: null,
        date: null,
        strategy: s.strategy,
        tasks: tasksBySlug.get(s.slug) || [],
      }))
      .sort(
        (a, b) =>
          priorityRank(a.tasks[0]?.priority) - priorityRank(b.tasks[0]?.priority) ||
          a.title.localeCompare(b.title)
      );
  }

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Next best action &mdash; l&apos;unione di genesi e Task Board: ogni storia con una
        prossima azione, i task Notion collegati, e il resto del board. Ordinato per
        urgenza. I campi si modificano qui e valgono ovunque.
      </p>

      {meetings.length > 0 && (
        <Section
          title="Prossimi meeting"
          count={meetings.length}
          note="Dal calendario, con chi ci sarà e cosa sai già su di loro."
        >
          {meetings.map((m) => (
            <MeetingRow key={m.event_id} m={m} peopleByEmail={peopleByEmail} />
          ))}
        </Section>
      )}

      {overdue.length > 0 && (
        <Section title="In ritardo" count={overdue.length} note="La scadenza è passata. Prima i più vecchi.">
          {overdue.map((i) => (
            <StoryRow key={i.slug} item={i} today={today} />
          ))}
        </Section>
      )}

      {dueSoon.length > 0 && (
        <Section title="Oggi e prossimi 7 giorni" count={dueSoon.length}>
          {dueSoon.map((i) => (
            <StoryRow key={i.slug} item={i} today={today} />
          ))}
        </Section>
      )}

      {undated.length > 0 && (
        <Section
          title="Con azione, senza data"
          count={undated.length}
          note="C'è una cosa da fare ma nessuna scadenza - metti una data e entrano nel radar."
        >
          {undated.map((i) => (
            <StoryRow key={i.slug} item={i} today={today} />
          ))}
        </Section>
      )}

      {taskOnlyStories.length > 0 && (
        <Section
          title="Sul Task Board, senza next-action in genesi"
          count={taskOnlyStories.length}
          note="Il board le traccia già - la genesi ancora no. Scrivi l'azione qui per allinearle."
        >
          {taskOnlyStories.map((i) => (
            <StoryRow key={i.slug} item={i} today={today} />
          ))}
        </Section>
      )}

      {later.length > 0 && (
        <Section title="Più avanti" count={later.length}>
          {later.map((i) => (
            <StoryRow key={i.slug} item={i} today={today} />
          ))}
        </Section>
      )}

      {boardOnly.length > 0 && (
        <Section
          title="Task Board - non legati a una storia"
          count={boardOnly.length}
          note="Ordinati per priorità Notion. Il link apre il task."
        >
          <div className="nba-tasks">
            {boardOnly.map((t) => (
              <NotionTaskLine key={t.notion_url} t={t} />
            ))}
          </div>
        </Section>
      )}

      <SavedToast />
    </>
  );
}
