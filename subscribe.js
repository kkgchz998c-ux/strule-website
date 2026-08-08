// Cloudflare Pages Function — POST /subscribe
// Captures a resource-library signup, adds the contact to the Brevo
// "Resource downloads" list (with name + plant location), and emails them
// the link to the library. Called by the modal on resources.html.
//
// Requires an environment variable set in the Cloudflare Pages project:
//   BREVO_API_KEY  (Settings -> Environment variables -> encrypted / secret)

const LIST_ID = 3;                     // Brevo list "Resource downloads"
const LIBRARY_URL = "https://struleautomation.com/resources.html?key=strule-library";
const SENDER = { name: "Jonathan Gilmour", email: "jgilmour@struleautomation.com" };
const MAILING_ADDRESS = "Strule Automation · 11 Iwanuma Dr, Napa, CA";

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function libraryEmailHtml(firstName) {
  const hi = firstName ? `Hi ${escapeHtml(firstName)},` : "Hi,";
  return `<!DOCTYPE html><html><body style="margin:0;background:#f6f9fb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1f2937;line-height:1.55;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f9fb;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;background:#ffffff;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#132a3e;padding:18px 26px;color:#ffffff;font-weight:700;letter-spacing:.3px;">STRULE AUTOMATION <span style="color:#9fc3d6;font-weight:500;">— Field notes</span></td></tr>
        <tr><td style="padding:26px 26px 8px;">
          <p style="margin:0 0 14px;font-size:16px;">${hi}</p>
          <p style="margin:0 0 16px;font-size:15px;color:#334155;">Thanks for grabbing the Strule field resources. Here's your link to the whole library &mdash; every diagnostic guide, checklist, tool and training primer, in one place:</p>
          <p style="margin:0 0 20px;"><a href="${LIBRARY_URL}" style="display:inline-block;background:#2f6d8f;color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:12px 22px;border-radius:8px;">Open the field library &rarr;</a></p>
          <p style="margin:0 0 16px;font-size:15px;color:#334155;">Bookmark it and come back any time &mdash; no login needed.</p>
          <p style="margin:0 0 16px;font-size:15px;color:#334155;">These are the same checks I use on the plant floor. If you've got a fault that keeps getting handed back and forth between vendors, that seam is usually where I'd start looking &mdash; just reply to this email or call (707) 690-7054 and we'll talk it through.</p>
          <p style="margin:0 0 4px;font-size:15px;color:#334155;">&mdash; Jonathan Gilmour, Strule Automation</p>
          <p style="margin:0 0 18px;font-size:13px;color:#64748b;">Independent, vendor-neutral controls engineering &middot; Bay Area &amp; Northern California</p>
        </td></tr>
        <tr><td style="border-top:1px solid #e2e8f0;background:#f8fafc;padding:16px 26px;font-size:12px;color:#94a3b8;">
          You're getting this because you asked for the Strule resource library at struleautomation.com.<br>${MAILING_ADDRESS}
        </td></tr>
      </table>
    </td></tr>
  </table>
  </body></html>`;
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const apiKey = env.BREVO_API_KEY;
    if (!apiKey) return json({ ok: false, error: "not configured" }, 500);

    const form = await request.formData();
    const email = (form.get("email") || "").toString().trim().toLowerCase();
    const name = (form.get("name") || "").toString().trim().slice(0, 80);
    const location = (form.get("plant_location") || "").toString().trim().slice(0, 120);
    const consent = (form.get("consent") || "").toString().trim() === "yes";

    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return json({ ok: false, error: "invalid email" }, 400);
    }

    const headers = { "api-key": apiKey, "content-type": "application/json", accept: "application/json" };

    // 1) Upsert the contact. Add to the marketing list only if they left the
    //    field-notes box ticked; either way we keep the record + plant location.
    const contactBody = {
      email,
      attributes: { FIRSTNAME: name, PLANT_LOCATION: location },
      updateEnabled: true,
    };
    if (consent) contactBody.listIds = [LIST_ID];

    await fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify(contactBody),
    }); // duplicate contacts are updated via updateEnabled; non-2xx is non-fatal here

    // 2) Send the library-link email (transactional — they requested it).
    const emailResp = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers,
      body: JSON.stringify({
        sender: SENDER,
        to: [{ email, name: name || undefined }],
        replyTo: { email: SENDER.email, name: SENDER.name },
        subject: "Your Strule field library — here's the link",
        htmlContent: libraryEmailHtml(name),
      }),
    });

    if (!emailResp.ok) {
      const detail = await emailResp.text();
      return json({ ok: false, error: "send failed", detail }, 502);
    }

    return json({ ok: true });
  } catch (e) {
    return json({ ok: false, error: "server error" }, 500);
  }
}
