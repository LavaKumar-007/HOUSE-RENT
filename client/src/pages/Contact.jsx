import { useState } from "react";
import PageMeta from "../components/PageMeta";

const faqs = [
  { q: "How do I list a property?", a: "Register as an owner, verify your email, then use List Property from the dashboard." },
  { q: "How do bookings work?", a: "Tenants request a booking. Owners approve or reject from their dashboard." },
  { q: "Is email verification required?", a: "Yes. Check your inbox or the server console in dev mode for the verification link." },
];

function Contact() {
  const [open, setOpen] = useState(0);

  return (
    <div className="page-section">
      <PageMeta title="Contact & Help" />
      <div className="container-xl" style={{ maxWidth: 800 }}>
        <p className="section-label">Support</p>
        <h1 className="display-title" style={{ fontSize: "3rem", marginBottom: 32 }}>Contact & Help</h1>
        <div className="glass-card" style={{ padding: 32, marginBottom: 32 }}>
          <p style={{ lineHeight: 1.8, color: "var(--text-muted)" }}>
            Need help with HouseHunt? Email us at <strong>support@househunt.com</strong> or browse the FAQ below.
          </p>
        </div>
        {faqs.map((faq, i) => (
          <div key={i} className="glass-card" style={{ padding: 20, marginBottom: 12, cursor: "pointer" }} onClick={() => setOpen(open === i ? -1 : i)}>
            <h3 style={{ marginBottom: open === i ? 12 : 0 }}>{faq.q}</h3>
            {open === i && <p style={{ color: "var(--text-muted)", lineHeight: 1.7 }}>{faq.a}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Contact;
