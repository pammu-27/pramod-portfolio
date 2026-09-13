import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase";

type Message = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  is_read: boolean;
  replied: boolean;
  created_at: string;
};

type FilterType =
  | "all"
  | "unread"
  | "read"
  | "replied";

function Messages() {
  const [messages, setMessages] =
    useState<Message[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [selectedMessage, setSelectedMessage] =
    useState<Message | null>(null);

  const [filter, setFilter] =
    useState<FilterType>("all");

  const [updatingId, setUpdatingId] =
    useState<string | null>(null);

  /* =====================================================
     LOAD
  ===================================================== */

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);
    setError("");

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "Messages loading error:",
        error,
      );

      setError(error.message);
      setLoading(false);
      return;
    }

    setMessages(
      (data ?? []) as Message[],
    );

    setLoading(false);
  }

  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  function showSuccess(text: string) {
    setSuccess(text);

    window.setTimeout(() => {
      setSuccess("");
    }, 3000);
  }

  /* =====================================================
     MARK READ / UNREAD
  ===================================================== */

  async function toggleRead(
    id: string,
    currentValue: boolean,
  ) {
    setUpdatingId(id);
    setError("");

    const newValue = !currentValue;

    /* Optimistic update */

    setMessages((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              is_read: newValue,
            }
          : item,
      ),
    );

    setSelectedMessage((current) =>
      current?.id === id
        ? {
            ...current,
            is_read: newValue,
          }
        : current,
    );

    const { error } = await supabase
      .from("messages")
      .update({
        is_read: newValue,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Read status update error:",
        error,
      );

      /* Rollback */

      setMessages((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                is_read: currentValue,
              }
            : item,
        ),
      );

      setSelectedMessage((current) =>
        current?.id === id
          ? {
              ...current,
              is_read: currentValue,
            }
          : current,
      );

      setError(error.message);
    } else {
      showSuccess(
        newValue
          ? "Message marked as read."
          : "Message marked as unread.",
      );
    }

    setUpdatingId(null);
  }

  /* =====================================================
     MARK REPLIED
  ===================================================== */

  async function toggleReplied(
    id: string,
    currentValue: boolean,
  ) {
    setUpdatingId(id);
    setError("");

    const newValue = !currentValue;

    /* Optimistic update */

    setMessages((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              replied: newValue,
            }
          : item,
      ),
    );

    setSelectedMessage((current) =>
      current?.id === id
        ? {
            ...current,
            replied: newValue,
          }
        : current,
    );

    const { error } = await supabase
      .from("messages")
      .update({
        replied: newValue,
      })
      .eq("id", id);

    if (error) {
      console.error(
        "Reply status update error:",
        error,
      );

      /* Rollback */

      setMessages((current) =>
        current.map((item) =>
          item.id === id
            ? {
                ...item,
                replied: currentValue,
              }
            : item,
        ),
      );

      setSelectedMessage((current) =>
        current?.id === id
          ? {
              ...current,
              replied: currentValue,
            }
          : current,
      );

      setError(error.message);
    } else {
      showSuccess(
        newValue
          ? "Message marked as replied."
          : "Reply status removed.",
      );
    }

    setUpdatingId(null);
  }

  /* =====================================================
     DELETE
  ===================================================== */

  async function handleDelete(
    id: string,
  ) {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this message?",
      );

    if (!confirmed) {
      return;
    }

    setError("");

    const previousMessages =
      messages;

    /* Optimistic delete */

    setMessages((current) =>
      current.filter(
        (item) => item.id !== id,
      ),
    );

    if (
      selectedMessage?.id === id
    ) {
      setSelectedMessage(null);
    }

    const { error } =
      await supabase
        .from("messages")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Message delete error:",
        error,
      );

      /* Rollback */

      setMessages(
        previousMessages,
      );

      setError(error.message);
      return;
    }

    showSuccess(
      "Message deleted successfully.",
    );
  }

  /* =====================================================
     OPEN MESSAGE
  ===================================================== */

  async function openMessage(
    message: Message,
  ) {
    setSelectedMessage(message);

    if (!message.is_read) {
      await toggleRead(
        message.id,
        false,
      );
    }
  }

  /* =====================================================
     FILTERED MESSAGES
  ===================================================== */

  const filteredMessages =
    useMemo(() => {
      return messages.filter(
        (message) => {
          if (filter === "unread") {
            return !message.is_read;
          }

          if (filter === "read") {
            return message.is_read;
          }

          if (filter === "replied") {
            return message.replied;
          }

          return true;
        },
      );
    }, [messages, filter]);

  /* =====================================================
     COUNTS
  ===================================================== */

  const totalCount =
    messages.length;

  const unreadCount =
    messages.filter(
      (message) =>
        !message.is_read,
    ).length;

  const readCount =
    messages.filter(
      (message) =>
        message.is_read,
    ).length;

  const repliedCount =
    messages.filter(
      (message) =>
        message.replied,
    ).length;

  /* =====================================================
     DATE FORMAT
  ===================================================== */

  function formatDate(
    dateString: string,
  ) {
    return new Date(
      dateString,
    ).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  }

  /* =====================================================
     STAT CARD
  ===================================================== */

  function StatCard({
    label,
    count,
    active,
    onClick,
    accent,
    icon,
  }: {
    label: string;
    count: number;
    active: boolean;
    onClick: () => void;
    accent: string;
    icon: string;
  }) {
    return (
      <button
        type="button"
        onClick={onClick}
        className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-200 ${
          active
            ? "border-cyan-400/30 bg-cyan-400/[0.07]"
            : "border-white/[0.08] bg-[#080d1a] hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-[#0a1020]"
        }`}
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {label}
            </p>

            <p
              className={`mt-3 text-3xl font-bold ${accent}`}
            >
              {count}
            </p>
          </div>

          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.04] text-base">
            {icon}
          </span>
        </div>

        <div
          className={`absolute bottom-0 left-0 h-[2px] transition-all duration-300 ${
            active
              ? "w-full bg-cyan-400"
              : "w-0 bg-cyan-400 group-hover:w-1/2"
          }`}
        />
      </button>
    );
  }

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="mx-auto w-full max-w-7xl text-white">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8">

        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-cyan-400">
          Communication
        </p>

        <div className="mt-2 flex flex-col justify-between gap-5 lg:flex-row lg:items-end">

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Messages
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage messages received
              through your portfolio.
            </p>
          </div>

          <button
            type="button"
            onClick={loadMessages}
            disabled={loading}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-4 text-sm font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.04] hover:text-white disabled:opacity-50"
          >
            <span
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            >
              ↻
            </span>

            Refresh
          </button>

        </div>
      </div>

      {/* =================================================
          SUCCESS
      ================================================= */}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-5 py-4 text-sm text-emerald-300">

          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400/10">
            ✓
          </span>

          {success}

        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-red-400/20 bg-red-400/[0.07] px-5 py-4 text-sm text-red-300">

          <div className="flex items-center gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-400/10">
              !
            </span>

            <span>{error}</span>
          </div>

          <button
            type="button"
            onClick={() =>
              setError("")
            }
            className="text-lg text-red-300/60 hover:text-red-300"
          >
            ×
          </button>

        </div>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="mb-9 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          label="Total Messages"
          count={totalCount}
          active={filter === "all"}
          onClick={() =>
            setFilter("all")
          }
          accent="text-white"
          icon="✉️"
        />

        <StatCard
          label="Unread"
          count={unreadCount}
          active={filter === "unread"}
          onClick={() =>
            setFilter("unread")
          }
          accent="text-cyan-400"
          icon="●"
        />

        <StatCard
          label="Read"
          count={readCount}
          active={filter === "read"}
          onClick={() =>
            setFilter("read")
          }
          accent="text-white"
          icon="✓"
        />

        <StatCard
          label="Replied"
          count={repliedCount}
          active={filter === "replied"}
          onClick={() =>
            setFilter("replied")
          }
          accent="text-emerald-400"
          icon="↗"
        />

      </div>

      {/* =================================================
          INBOX HEADER
      ================================================= */}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <h2 className="text-xl font-semibold text-white">
            Inbox
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Showing{" "}
            <span className="text-slate-400">
              {filteredMessages.length}
            </span>{" "}
            {filteredMessages.length ===
            1
              ? "message"
              : "messages"}
          </p>
        </div>

        {filter !== "all" && (
          <button
            type="button"
            onClick={() =>
              setFilter("all")
            }
            className="self-start rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/[0.04] hover:text-white sm:self-auto"
          >
            Clear filter
          </button>
        )}

      </div>

      {/* =================================================
          LOADING
      ================================================= */}

      {loading ? (

        <div className="rounded-2xl border border-white/[0.08] bg-[#080d1a] p-14 text-center">

          <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-2 border-slate-700 border-t-cyan-400" />

          <p className="text-sm font-medium text-slate-400">
            Loading messages...
          </p>

        </div>

      ) : filteredMessages.length ===
        0 ? (

        /* =================================================
           EMPTY
        ================================================= */

        <div className="rounded-2xl border border-dashed border-white/10 bg-[#080d1a] px-6 py-16 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.03] text-3xl">
            📭
          </div>

          <h3 className="text-lg font-semibold text-white">
            No messages found
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            {filter === "unread"
              ? "You don't have any unread messages."
              : filter === "read"
                ? "You don't have any read messages."
                : filter ===
                    "replied"
                  ? "You haven't marked any messages as replied."
                  : "Messages from your portfolio contact form will appear here."}
          </p>

          {filter !== "all" && (
            <button
              type="button"
              onClick={() =>
                setFilter("all")
              }
              className="mt-5 rounded-xl bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              View All Messages
            </button>
          )}

        </div>

      ) : (

        /* =================================================
           MESSAGE LIST
        ================================================= */

        <div className="space-y-4">

          {filteredMessages.map(
            (message) => (

              <article
                key={message.id}
                className={`group overflow-hidden rounded-2xl border transition-all duration-200 ${
                  message.is_read
                    ? "border-white/[0.08] bg-[#080d1a] hover:border-white/[0.14] hover:bg-[#0a1020]"
                    : "border-cyan-400/25 bg-cyan-400/[0.035] hover:border-cyan-400/35"
                }`}
              >

                <div className="p-5 sm:p-6">

                  <div className="flex flex-col gap-6 xl:flex-row xl:items-start">

                    {/* =================================
                        MESSAGE CONTENT
                    ================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        openMessage(
                          message,
                        )
                      }
                      className="min-w-0 flex-1 text-left"
                    >

                      {/* SUBJECT */}

                      <div className="flex flex-wrap items-center gap-2.5">

                        {!message.is_read && (
                          <span className="relative flex h-2.5 w-2.5 shrink-0">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
                          </span>
                        )}

                        <h3 className="max-w-full truncate text-lg font-semibold text-white">
                          {message.subject ||
                            "No subject"}
                        </h3>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                            message.is_read
                              ? "border-white/[0.06] bg-white/[0.04] text-slate-500"
                              : "border-cyan-400/15 bg-cyan-400/10 text-cyan-300"
                          }`}
                        >
                          {message.is_read
                            ? "Read"
                            : "Unread"}
                        </span>

                        {message.replied && (
                          <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                            Replied
                          </span>
                        )}

                      </div>

                      {/* SENDER */}

                      <div className="mt-4 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1">

                        <span className="text-sm font-medium text-slate-200">
                          {message.name ||
                            "Unknown sender"}
                        </span>

                        <span className="hidden text-slate-700 sm:inline">
                          •
                        </span>

                        <span className="break-all text-sm text-cyan-400">
                          {message.email}
                        </span>

                      </div>

                      {/* MESSAGE PREVIEW */}

                      <p className="mt-4 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-500">
                        {message.message}
                      </p>

                      {/* DATE */}

                      <div className="mt-5 flex items-center gap-2 text-xs text-slate-600">
                        <span>🕒</span>
                        <span>
                          {formatDate(
                            message.created_at,
                          )}
                        </span>
                      </div>

                    </button>

                    {/* =================================
                        ACTIONS
                    ================================= */}

                    <div className="flex flex-wrap gap-2 xl:w-[330px] xl:justify-end">

                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          message.id
                        }
                        onClick={() =>
                          toggleRead(
                            message.id,
                            message.is_read,
                          )
                        }
                        className="rounded-lg border border-white/10 bg-white/[0.02] px-3.5 py-2.5 text-xs font-medium text-slate-300 transition hover:border-cyan-400/20 hover:bg-cyan-400/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {message.is_read
                          ? "Mark unread"
                          : "Mark read"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          updatingId ===
                          message.id
                        }
                        onClick={() =>
                          toggleReplied(
                            message.id,
                            message.replied,
                          )
                        }
                        className="rounded-lg border border-emerald-400/15 bg-emerald-400/[0.02] px-3.5 py-2.5 text-xs font-medium text-emerald-300 transition hover:bg-emerald-400/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {message.replied
                          ? "Unmark replied"
                          : "Mark replied"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(
                            message.id,
                          )
                        }
                        className="rounded-lg border border-red-400/15 bg-red-400/[0.02] px-3.5 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-400/10"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>

              </article>
            ),
          )}

        </div>
      )}

      {/* =================================================
          MESSAGE MODAL
      ================================================= */}

      {selectedMessage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md"
          onClick={() =>
            setSelectedMessage(null)
          }
        >

          <div
            className="flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-white/[0.1] bg-[#080d1a] shadow-2xl shadow-black/50"
            onClick={(event) =>
              event.stopPropagation()
            }
          >

            {/* =========================================
                MODAL HEADER
            ========================================= */}

            <div className="flex shrink-0 items-start justify-between gap-5 border-b border-white/[0.07] px-6 py-5 sm:px-7">

              <div className="min-w-0">

                <div className="flex flex-wrap items-center gap-2.5">

                  <h2 className="max-w-[600px] truncate text-xl font-bold text-white sm:text-2xl">
                    {selectedMessage.subject ||
                      "No subject"}
                  </h2>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
                      selectedMessage.is_read
                        ? "border-white/[0.06] bg-white/[0.04] text-slate-500"
                        : "border-cyan-400/15 bg-cyan-400/10 text-cyan-300"
                    }`}
                  >
                    {selectedMessage.is_read
                      ? "Read"
                      : "Unread"}
                  </span>

                  {selectedMessage.replied && (
                    <span className="rounded-full border border-emerald-400/15 bg-emerald-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-300">
                      Replied
                    </span>
                  )}

                </div>

                <p className="mt-2 text-xs text-slate-600">
                  {formatDate(
                    selectedMessage.created_at,
                  )}
                </p>

              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedMessage(null)
                }
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/[0.06] text-xl text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                aria-label="Close message"
              >
                ×
              </button>

            </div>

            {/* =========================================
                MODAL CONTENT
            ========================================= */}

            <div className="overflow-y-auto px-6 py-6 sm:px-7">

              {/* SENDER */}

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-5">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400/[0.08] text-sm">
                    👤
                  </div>

                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                      Sender
                    </p>

                    <p className="mt-0.5 text-xs text-slate-600">
                      Contact information
                    </p>
                  </div>

                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Name
                    </p>

                    <p className="mt-2 text-sm font-medium text-white">
                      {selectedMessage.name ||
                        "Unknown sender"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-600">
                      Email
                    </p>

                    <a
                      href={`mailto:${selectedMessage.email}`}
                      className="mt-2 block break-all text-sm font-medium text-cyan-400 transition hover:text-cyan-300"
                    >
                      {selectedMessage.email}
                    </a>
                  </div>

                </div>

              </div>

              {/* MESSAGE */}

              <div className="mt-6">

                <div className="mb-3 flex items-center gap-2">

                  <span className="text-sm">
                    💬
                  </span>

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Message
                  </p>

                </div>

                <div className="whitespace-pre-wrap rounded-xl border border-white/[0.07] bg-[#050a16] p-5 text-sm leading-7 text-slate-300">
                  {selectedMessage.message}
                </div>

              </div>

              {/* ACTIONS */}

              <div className="mt-6 flex flex-col gap-3 border-t border-white/[0.07] pt-6 sm:flex-row sm:flex-wrap">

                <button
                  type="button"
                  disabled={
                    updatingId ===
                    selectedMessage.id
                  }
                  onClick={() =>
                    toggleRead(
                      selectedMessage.id,
                      selectedMessage.is_read,
                    )
                  }
                  className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/[0.05] hover:text-white disabled:opacity-50"
                >
                  {selectedMessage.is_read
                    ? "Mark as Unread"
                    : "Mark as Read"}
                </button>

                <button
                  type="button"
                  disabled={
                    updatingId ===
                    selectedMessage.id
                  }
                  onClick={() =>
                    toggleReplied(
                      selectedMessage.id,
                      selectedMessage.replied,
                    )
                  }
                  className="rounded-xl border border-emerald-400/15 px-5 py-3 text-sm font-medium text-emerald-300 transition hover:bg-emerald-400/10 disabled:opacity-50"
                >
                  {selectedMessage.replied
                    ? "Unmark Replied"
                    : "Mark Replied"}
                </button>

                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(
                    selectedMessage.subject ||
                      "Your message",
                  )}`}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
                >
                  Reply by Email
                  <span>↗</span>
                </a>

                <button
                  type="button"
                  onClick={() =>
                    handleDelete(
                      selectedMessage.id,
                    )
                  }
                  className="rounded-xl border border-red-400/15 px-5 py-3 text-sm font-medium text-red-300 transition hover:bg-red-400/10"
                >
                  Delete
                </button>

              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default Messages;