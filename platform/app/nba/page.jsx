import { supabaseSelect } from "../../lib/supabase";
import { updateStoryNextAction, updateStoryNextActionDate, updateStoryStrategy } from "../story/actions";
import { parseAttendees } from "../../lib/people";
import TableCellInput from "../people/TableCellInput";
import SavedToast from "../people/SavedToast";
import Avatar from "../people/Avatar";

export const dynamic = "force-dynamic";

function daysBetween(fromIso, toIso) {
  return Math.round((new Date(toIso) - new Date(fromIso)) / 86400000);
}

// One line per open ledger_tasks row - the same table /brief reads
// "Priorities"/"Open tasks" from and /closing marks Done/Dropped on.
// No link to click through to (unlike the old Notion task board rows) -
// just a plain flag of what's open.
function TaskLine({ t, today }) {
  const overdue = t.due_date && t.due_date < today;
  return (
    <div className={`nba-task${overdue ? " nba-task-urgent" : ""}`}>
      {t.kind} - {t.title}
      {t.due_date ? ` (${overdue ? "in ritardo dal " : "entro il "}${t.due_date})` : ""}
    </div>
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
            <TaskLine key={t.id} t={t} today={today} />
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
    // The same backlog /brief pulls "Priorities"/"Open tasks" from and
    // /closing marks Done/Dropped on - this page is meant to be that
    // backlog's live view, shrinking and growing as those two touch it.
    supabaseSelect("ledger_tasks", "?status=eq.open&select=id,title,kind,story_slug,due_date"),
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
  const dueRank = (t) => (t.due_date ? t.due_date : "9999-99-99");
  for (const list of tasksBySlug.values()) {
    list.sort((a, b) => dueRank(a).localeCompare(dueRank(b)));
  }
  boardOnly.sort((a, b) => dueRank(a).localeCompare(dueRank(b)) || a.title.localeCompare(b.title));

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

  // Stories that carry an open ledger_tasks row but no next_action of
  // their own - the task layer knows something the genesis field doesn't yet.
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
        (a, b) => dueRank(a.tasks[0]).localeCompare(dueRank(b.tasks[0])) || a.title.localeCompare(b.title)
      );
  }

  return (
    <>
      <p style={{ fontSize: 13.5, color: "var(--ink-faint)", margin: "0 0 20px" }}>
        Il backlog - ogni storia con una prossima azione, più ogni task
        aperto in <code>ledger_tasks</code>. Cala quando <a href="/closing">/closing</a>{" "}
        segna qualcosa Done, cresce quando <a href="/brief">/brief</a> o{" "}
        <a href="/closing">/closing</a> aggiungono qualcosa di nuovo - questa
        pagina non fa altro che leggerlo dal vivo. I campi si modificano qui
        e valgono ovunque.
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
          title="Task aperti, senza next-action in genesi"
          count={taskOnlyStories.length}
          note="ledger_tasks li traccia già - la genesi ancora no. Scrivi l'azione qui per allinearle."
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
          title="Task trasversali - non legati a una storia"
          count={boardOnly.length}
          note="Da ledger_tasks, ordinati per scadenza. Segnali Done o Dropped su /closing."
        >
          <div className="nba-tasks">
            {boardOnly.map((t) => (
              <TaskLine key={t.id} t={t} today={today} />
            ))}
          </div>
        </Section>
      )}

      <SavedToast />
    </>
  );
}
