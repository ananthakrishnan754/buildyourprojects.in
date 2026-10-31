"use client";

import { useState } from "react";
import { mailtoLink, whatsappLink } from "@/data/site";

const branches = ["EEE", "ECE", "CSE / IT", "Mechanical", "Civil", "Other"];
const projectTypes = [
  "Final-year project",
  "Mini project",
  "Micro project",
  "Custom idea",
  "Simulation only",
];

export function ProjectEnquiryForm() {
  const [status, setStatus] = useState<"" | "opened">("");
  const [draft, setDraft] = useState("");

  const buildMessage = (data: FormData) => {
    const name = String(data.get("name") ?? "").trim();
    const branch = String(data.get("branch") ?? "").trim();
    const projectType = String(data.get("projectType") ?? "").trim();
    const deadline = String(data.get("deadline") ?? "").trim();
    const details = String(data.get("details") ?? "").trim();

    return [
      "Hi! I have a custom project enquiry.",
      name ? `Name: ${name}` : "",
      branch ? `Branch: ${branch}` : "",
      projectType ? `Project type: ${projectType}` : "",
      deadline ? `Deadline: ${deadline}` : "",
      details ? `Details: ${details}` : "",
      `Page: ${window.location.href}`,
    ]
      .filter(Boolean)
      .join("\n");
  };

  return (
    <form
      className="card p-5 md:p-6"
      onSubmit={(event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        const message = buildMessage(data);
        const url = whatsappLink(message);
        setDraft(message);
        window.open(url, "_blank", "noopener,noreferrer");
        setStatus("opened");
      }}
    >
      <h3 className="type-h3">Send a project enquiry</h3>
      <p className="mt-2 type-body-sm text-muted" id="enquiry-note">
        This form does not save data on the site. It opens WhatsApp with your
        message so the conversation starts in one place. You can also email the
        same details.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="type-label text-muted">
            Name
          </label>
          <input
            id="name"
            name="name"
            className="field mt-2"
            autoComplete="name"
            required
          />
        </div>
        <div>
          <label htmlFor="branch" className="type-label text-muted">
            Branch
          </label>
          <select
            id="branch"
            name="branch"
            className="field mt-2"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select branch
            </option>
            {branches.map((branch) => (
              <option key={branch} value={branch}>
                {branch}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="projectType" className="type-label text-muted">
            Project type
          </label>
          <select
            id="projectType"
            name="projectType"
            className="field mt-2"
            required
            defaultValue=""
          >
            <option value="" disabled>
              Select type
            </option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="deadline" className="type-label text-muted">
            Deadline
          </label>
          <input
            id="deadline"
            name="deadline"
            className="field mt-2"
            placeholder="e.g. 3 weeks"
            required
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="details" className="type-label text-muted">
          What do you need built?
        </label>
        <textarea
          id="details"
          name="details"
          className="field mt-2 min-h-28 resize-y"
          placeholder="Project idea, reference links, hardware or simulation requirements, college format…"
          required
        />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button type="submit" className="btn btn-primary">
          Send on WhatsApp
        </button>
        <a
          href={mailtoLink(
            "Custom project enquiry",
            draft || "Hi! I have a custom project enquiry.",
          )}
          className="btn btn-secondary"
        >
          Email instead
        </a>
      </div>

      <p
        className="mt-4 type-body-sm text-muted"
        role="status"
        aria-live="polite"
      >
        {status === "opened"
          ? "WhatsApp should have opened in a new tab with your enquiry. If it did not, use the email option."
          : "Replies happen during the day on WhatsApp."}
      </p>
    </form>
  );
}
