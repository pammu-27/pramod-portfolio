import { useState } from "react";
import type { FormEvent } from "react";
import { supabase } from "../../lib/supabase";

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setSubmitting(true);
    setSuccess("");
    setError("");

    const { error: insertError } = await supabase.from("messages").insert({
      name: formData.name.trim(),
      email: formData.email.trim(),
      subject: formData.subject.trim(),
      message: formData.message.trim(),
    });

    if (insertError) {
      console.error("Message submission error:", insertError);
      setError("Sorry, your message could not be sent. Please try again.");
      setSubmitting(false);
      return;
    }

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });

    setSuccess("Your message has been sent successfully. Thank you!");
    setSubmitting(false);
  }

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-white/5 bg-[#08090b] px-5 py-20 text-white transition-colors duration-300 sm:px-8 sm:py-24 lg:px-10"
    >
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-40 top-10 h-96 w-96 rounded-full bg-cyan-400/[0.04] blur-3xl" />
        <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-cyan-400/[0.035] blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.022]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-10 border-b border-white/10 pb-8 sm:mb-12 sm:pb-9">
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-cyan-400" />
            <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-cyan-400">
              Get In Touch
            </p>
          </div>

          <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <h2 className="text-4xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                Contact Me<span className="text-cyan-400">.</span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Have a project, opportunity or question? Send me a message and
                I'll get back to you.
              </p>
            </div>

            <div className="flex items-center gap-3 md:pb-1">
              <span className="h-2 w-2 rounded-full bg-cyan-400 shadow-[0_0_14px_rgba(34,211,238,0.8)]" />
              <div>
                <p className="text-[9px] uppercase tracking-[0.22em] text-slate-500">
                  Open To
                </p>
                <p className="mt-1 text-sm font-medium text-white">
                  Projects · Opportunities
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[0.72fr_1.28fr]">
          {/* Contact information */}
          <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8">
            <div className="absolute right-0 top-0 h-28 w-28 rounded-full bg-cyan-400/[0.05] blur-2xl" />

            <div className="relative">
              <p className="text-[9px] font-semibold uppercase tracking-[0.25em] text-cyan-400">
                Let's connect
              </p>

              <h3 className="mt-3 text-2xl font-semibold tracking-[-0.03em] text-white">
                Let's work together.
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                I'm always interested in hearing about new projects, creative
                ideas and opportunities.
              </p>

              <div className="mt-8 space-y-3">
                {/* Email */}
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4 transition-colors hover:border-cyan-400/20">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Email
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    Contact me through the form
                  </p>
                </div>

                {/* Availability */}
                <div className="rounded-2xl border border-white/10 bg-black/10 p-4 transition-colors hover:border-cyan-400/20">
                  <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Response
                  </p>
                  <p className="mt-2 text-sm text-slate-300">
                    I'll get back to you as soon as possible.
                  </p>
                </div>
              </div>

              <div className="mt-8 border-t border-white/10 pt-6">
                <a
                  href="#home"
                  className="group inline-flex items-center gap-3 text-sm text-slate-400 transition hover:text-white"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.03] text-slate-300 transition group-hover:border-cyan-400/30 group-hover:text-cyan-400">
                    ↑
                  </span>
                  Back to top
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.025] p-6 sm:p-8"
          >
            <div className="absolute right-0 top-0 h-40 w-40 rounded-full bg-cyan-400/[0.025] blur-3xl" />

            <div className="relative">
              <div className="mb-7 flex items-end justify-between gap-4 border-b border-white/10 pb-5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-slate-500">
                    Message
                  </p>
                  <p className="mt-1 text-sm text-slate-400">
                    Tell me what you're working on.
                  </p>
                </div>
                <span className="hidden text-[9px] uppercase tracking-[0.18em] text-slate-600 sm:block">
                  Secure submission
                </span>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="mb-2 block text-xs font-medium text-slate-300"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    maxLength={100}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.035] focus:ring-2 focus:ring-cyan-400/10"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-email"
                    className="mb-2 block text-xs font-medium text-slate-300"
                  >
                    Email
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    maxLength={150}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.035] focus:ring-2 focus:ring-cyan-400/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="contact-subject"
                    className="mb-2 block text-xs font-medium text-slate-300"
                  >
                    Subject
                  </label>
                  <input
                    id="contact-subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    maxLength={200}
                    placeholder="What would you like to discuss?"
                    className="w-full rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.035] focus:ring-2 focus:ring-cyan-400/10"
                  />
                </div>

                <div className="sm:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="contact-message"
                      className="block text-xs font-medium text-slate-300"
                    >
                      Message
                    </label>
                    <span className="text-[9px] text-slate-600">Max 5000 characters</span>
                  </div>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={5000}
                    rows={7}
                    placeholder="Write your message..."
                    className="w-full resize-y rounded-xl border border-white/10 bg-black/10 px-4 py-3 text-sm leading-7 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:bg-white/[0.035] focus:ring-2 focus:ring-cyan-400/10"
                  />
                </div>
              </div>

              {success && (
                <div
                  role="status"
                  className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-4 py-3 text-sm text-emerald-300"
                >
                  {success}
                </div>
              )}

              {error && (
                <div
                  role="alert"
                  className="mt-5 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-[10px] leading-5 text-slate-600">
                  Your message will be securely submitted through the contact form.
                </p>

                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 shadow-[0_0_24px_rgba(34,211,238,0.12)] transition hover:bg-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.18)] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Sending..." : "Send Message"}
                  {!submitting && <span aria-hidden="true">↗</span>}
                </button>
              </div>
            </div>
          </form>
        </div>

        <div className="mt-10 flex items-center justify-between border-t border-white/10 pt-5">
          <span className="text-[9px] font-medium uppercase tracking-[0.24em] text-slate-600">
            Connect · Collaborate · Create
          </span>
          <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-slate-600">
            AVAILABLE
          </span>
        </div>
      </div>
    </section>
  );
}

export default Contact;
