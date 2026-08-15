"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../../ThemeToggle";
import { doc, getDoc, getDocs, addDoc, collection } from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth, db } from "../../firebase/client";

interface CustomFormField {
  id: string;
  label: string;
  type: "text" | "email" | "tel" | "number" | "select" | "textarea";
  placeholder?: string;
  required: boolean;
  options?: string[];
}

interface FormConfig {
  id: string;
  title: string;
  description: string;
  status?: string;
  isPaid?: boolean;
  registrationFee?: string;
  whatsappGroupLink?: string;
  confirmationMessage?: string;
  fields?: CustomFormField[];
  isEventForm?: boolean;
}

function formatFieldToString(val: any, fallback = ""): string {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  return String(val);
}

export default function StandaloneFormPage({
  params,
}: {
  params: Promise<{ formId: string }>;
}) {
  const resolvedParams = use(params);
  const formId = resolvedParams.formId;

  const [formConfig, setFormConfig] = useState<FormConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [regForm, setRegForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    branch: "",
    year: "",
    membershipId: "",
    utrNumber: "",
    customAnswers: {} as Record<string, string>,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState<{ message: string; whatsappLink?: string } | null>(null);
  const [qrLoadError, setQrLoadError] = useState(false);

  // Fetch logged in user to pre-fill profile data
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u);
      if (u && db) {
        try {
          const userDoc = await getDoc(doc(db, "users", u.uid));
          if (userDoc.exists()) {
            const d = userDoc.data();
            setRegForm((prev) => ({
              ...prev,
              fullName: formatFieldToString(d.fullName, u.displayName || ""),
              email: formatFieldToString(d.email, u.email || ""),
              phone: formatFieldToString(d.phone || d.phoneNumber, ""),
              branch: formatFieldToString(d.branch, ""),
              year: formatFieldToString(d.yearSemester || d.year, ""),
              membershipId: formatFieldToString(d.membershipId, ""),
            }));
          } else {
            setRegForm((prev) => ({
              ...prev,
              fullName: u.displayName || "",
              email: u.email || "",
            }));
          }
        } catch (err) {
          console.warn("Error fetching user profile:", err);
        }
      }
    });
    return () => unsub();
  }, []);

  // Fetch Form Configuration from custom_forms or events collection
  useEffect(() => {
    async function loadForm() {
      if (!db || !formId) {
        setLoading(false);
        return;
      }

      const cleanId = decodeURIComponent(formId).trim();

      try {
        // 1. Check custom_forms by direct ID
        const customFormDoc = await getDoc(doc(db, "custom_forms", cleanId));
        if (customFormDoc.exists()) {
          const data = customFormDoc.data();
          setFormConfig({
            id: customFormDoc.id,
            title: formatFieldToString(data.title, "Registration Form"),
            description: formatFieldToString(data.description, ""),
            status: formatFieldToString(data.status, "Active"),
            isPaid: Boolean(data.isPaid),
            registrationFee: formatFieldToString(data.registrationFee, "₹50"),
            whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
            confirmationMessage: formatFieldToString(
              data.confirmationMessage,
              "You are registered successfully! Go on and join the official WhatsApp group for updates."
            ),
            fields: Array.isArray(data.fields) ? data.fields : [],
            isEventForm: false,
          });
          setLoading(false);
          return;
        }

        // 2. Check events by direct ID
        const eventDoc = await getDoc(doc(db, "events", cleanId));
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setFormConfig({
            id: eventDoc.id,
            title: formatFieldToString(data.title, "Event Registration"),
            description: formatFieldToString(data.description, ""),
            status: formatFieldToString(data.status, "Upcoming"),
            isPaid: Boolean(data.isPaid),
            registrationFee: formatFieldToString(data.registrationFee, "₹50"),
            whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
            confirmationMessage: formatFieldToString(
              data.confirmationMessage,
              "You are registered successfully! Go on and join the official WhatsApp group for updates."
            ),
            fields: Array.isArray(data.customFields) ? data.customFields : [],
            isEventForm: true,
          });
          setLoading(false);
          return;
        }

        // 3. Fallback: Search custom_forms & events collections by ID, slug, or title slug
        const customFormsSnap = await getDocs(collection(db, "custom_forms"));
        const matchedCustom = customFormsSnap.docs.find((d) => {
          const data = d.data();
          const idMatch = d.id.toLowerCase() === cleanId.toLowerCase();
          const slugMatch = formatFieldToString(data.slug).toLowerCase() === cleanId.toLowerCase();
          const titleSlug = formatFieldToString(data.title).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/^-+|-+$/g, "");
          return idMatch || slugMatch || (titleSlug.length > 0 && titleSlug === cleanId.toLowerCase());
        });

        if (matchedCustom) {
          const data = matchedCustom.data();
          setFormConfig({
            id: matchedCustom.id,
            title: formatFieldToString(data.title, "Registration Form"),
            description: formatFieldToString(data.description, ""),
            status: formatFieldToString(data.status, "Active"),
            isPaid: Boolean(data.isPaid),
            registrationFee: formatFieldToString(data.registrationFee, "₹50"),
            whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
            confirmationMessage: formatFieldToString(
              data.confirmationMessage,
              "You are registered successfully! Go on and join the official WhatsApp group for updates."
            ),
            fields: Array.isArray(data.fields) ? data.fields : [],
            isEventForm: false,
          });
          setLoading(false);
          return;
        }

        const eventsSnap = await getDocs(collection(db, "events"));
        const matchedEvent = eventsSnap.docs.find((d) => {
          const data = d.data();
          const idMatch = d.id.toLowerCase() === cleanId.toLowerCase();
          const slugMatch = formatFieldToString(data.slug).toLowerCase() === cleanId.toLowerCase();
          const titleSlug = formatFieldToString(data.title).toLowerCase().replace(/[^a-z0-9]/g, "-").replace(/^-+|-+$/g, "");
          return idMatch || slugMatch || (titleSlug.length > 0 && titleSlug === cleanId.toLowerCase());
        });

        if (matchedEvent) {
          const data = matchedEvent.data();
          setFormConfig({
            id: matchedEvent.id,
            title: formatFieldToString(data.title, "Event Registration"),
            description: formatFieldToString(data.description, ""),
            status: formatFieldToString(data.status, "Upcoming"),
            isPaid: Boolean(data.isPaid),
            registrationFee: formatFieldToString(data.registrationFee, "₹50"),
            whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
            confirmationMessage: formatFieldToString(
              data.confirmationMessage,
              "You are registered successfully! Go on and join the official WhatsApp group for updates."
            ),
            fields: Array.isArray(data.customFields) ? data.customFields : [],
            isEventForm: true,
          });
          setLoading(false);
          return;
        }

        setNotFound(true);
      } catch (err) {
        console.error("Error loading form config:", err);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }

    void loadForm();
  }, [formId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !formConfig) return;
    setErrorMessage("");

    if (!regForm.fullName.trim() || !regForm.email.trim() || !regForm.phone.trim()) {
      setErrorMessage("Please fill in your Full Name, Email Address, and Phone Number.");
      return;
    }

    if (formConfig.isPaid) {
      const cleanUtr = regForm.utrNumber.trim();
      if (!cleanUtr || cleanUtr.length < 6) {
        setErrorMessage("Please enter your 12-digit UPI UTR / Transaction Reference Number.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const payload = {
        formId: formConfig.id,
        formTitle: formConfig.title,
        userId: currentUser?.uid || null,
        fullName: regForm.fullName.trim(),
        email: regForm.email.trim().toLowerCase(),
        phone: regForm.phone.trim(),
        branch: regForm.branch.trim(),
        year: regForm.year.trim(),
        membershipId: regForm.membershipId.trim() || null,
        utrNumber: formConfig.isPaid ? regForm.utrNumber.trim() : "N/A",
        paymentStatus: formConfig.isPaid ? "Pending" : "Verified",
        customAnswers: regForm.customAnswers || {},
        submittedAt: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
      };

      if (formConfig.isEventForm) {
        await addDoc(collection(db, "events", formConfig.id, "registrations"), payload);
      } else {
        await addDoc(collection(db, "custom_forms", formConfig.id, "responses"), payload);
      }

      setSuccessInfo({
        message:
          formConfig.confirmationMessage ||
          "You are registered successfully! Go on and join the official WhatsApp group for updates.",
        whatsappLink: formConfig.whatsappGroupLink,
      });
    } catch (err: any) {
      console.error("Error submitting form response:", err);
      setErrorMessage("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-sm">
        Loading form details...
      </div>
    );
  }

  if (notFound || !formConfig) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 py-12 font-sans text-center">
        <div className="max-w-md w-full rounded-3xl border border-zinc-800 bg-zinc-950 p-8 space-y-4">
          <span className="text-4xl block">🔍</span>
          <h1 className="text-xl font-bold text-red-400">Form Not Found</h1>
          <p className="text-xs text-zinc-400">
            The registration form <strong className="text-white">"/forms/{formId}"</strong> does not exist or has been removed.
          </p>
          <Link
            href="/events"
            className="inline-block px-5 py-2.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-white font-semibold text-xs uppercase tracking-wider transition"
          >
            ← View All Events
          </Link>
        </div>
      </div>
    );
  }

  const isClosed = formConfig.status === "Closed";

  return (
    <div className="min-h-screen flex flex-col font-sans dark:bg-black dark:text-zinc-50 bg-zinc-50 text-zinc-900 transition-colors duration-200">
      {/* HEADER */}
      <header className="w-full border-b dark:border-zinc-900 border-zinc-200 dark:bg-black/90 bg-white/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-sm font-bold tracking-widest uppercase font-mono dark:text-white text-zinc-900">
              ROBOCEK <span className="text-zinc-500 font-normal">REGISTRATION</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              href="/events"
              className="text-xs px-3.5 py-1.5 rounded-full border dark:border-zinc-800 border-zinc-300 dark:text-zinc-300 text-zinc-700 transition"
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </header>

      {/* FORM CONTAINER */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-6 py-10">
        <div className="rounded-3xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-950 bg-white p-6 sm:p-10 shadow-2xl space-y-6">
          {/* Form Header */}
          <div className="border-b dark:border-zinc-800 border-zinc-200 pb-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-mono">
                {formConfig.isPaid ? `Paid (${formConfig.registrationFee || "₹50"})` : "Free Registration"}
              </span>
              {isClosed && (
                <span className="px-3 py-1 rounded-full text-[0.65rem] font-semibold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/20 font-mono">
                  Closed
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{formConfig.title}</h1>
            {formConfig.description ? (
              <p className="text-xs sm:text-sm dark:text-zinc-400 text-zinc-600 leading-relaxed">
                {formConfig.description}
              </p>
            ) : null}
          </div>

          {/* SUCCESS SCREEN */}
          {successInfo ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto text-3xl animate-bounce">
                ✓
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-emerald-400">Registration Confirmed!</h2>
                <p className="text-xs sm:text-sm dark:text-zinc-300 text-zinc-700 leading-relaxed max-w-md mx-auto">
                  {successInfo.message}
                </p>
              </div>

              {successInfo.whatsappLink ? (
                <div className="pt-4">
                  <a
                    href={successInfo.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm uppercase tracking-wider transition shadow-xl shadow-emerald-600/30"
                  >
                    💬 Join Official WhatsApp Group
                  </a>
                  <p className="text-[0.65rem] text-zinc-500 mt-2">
                    Click to join for instant updates, announcements, and coordinator Q&A.
                  </p>
                </div>
              ) : null}

              <div className="pt-4">
                <Link
                  href="/events"
                  className="inline-block w-full py-3 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-zinc-900 bg-zinc-100 text-xs font-semibold uppercase tracking-wider hover:bg-zinc-200 dark:hover:bg-zinc-800 transition"
                >
                  ← Return to Events
                </Link>
              </div>
            </div>
          ) : isClosed ? (
            <div className="py-12 text-center text-xs dark:text-zinc-400 text-zinc-600">
              This registration form is currently closed for responses.
            </div>
          ) : (
            /* FORM INPUTS */
            <form onSubmit={handleSubmit} className="space-y-5 text-xs">
              {errorMessage ? (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs">
                  ⚠️ {errorMessage}
                </div>
              ) : null}

              <div>
                <label className="block uppercase font-medium dark:text-zinc-400 text-zinc-600 mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  className="w-full h-11 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-medium dark:text-zinc-400 text-zinc-600 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="student@gcek.ac.in"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full h-11 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block uppercase font-medium dark:text-zinc-400 text-zinc-600 mb-1">Mobile Phone *</label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile no."
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full h-11 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase font-medium dark:text-zinc-400 text-zinc-600 mb-1">Branch / Department</label>
                  <input
                    type="text"
                    placeholder="e.g. ECE / EEE / CSE / ME"
                    value={regForm.branch}
                    onChange={(e) => setRegForm({ ...regForm, branch: e.target.value })}
                    className="w-full h-11 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block uppercase font-medium dark:text-zinc-400 text-zinc-600 mb-1">Year / Semester</label>
                  <input
                    type="text"
                    placeholder="e.g. S4 / 2nd Year"
                    value={regForm.year}
                    onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                    className="w-full h-11 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* DYNAMIC CUSTOM FIELDS */}
              {formConfig.fields && formConfig.fields.length > 0 ? (
                <div className="pt-3 border-t dark:border-zinc-800 border-zinc-200 space-y-4">
                  {formConfig.fields.map((f) => (
                    <div key={f.id}>
                      <label className="block uppercase font-medium dark:text-zinc-400 text-zinc-600 mb-1">
                        {f.label} {f.required ? "*" : "(Optional)"}
                      </label>

                      {f.type === "select" ? (
                        <select
                          required={f.required}
                          value={regForm.customAnswers[f.id] || ""}
                          onChange={(e) =>
                            setRegForm({
                              ...regForm,
                              customAnswers: { ...regForm.customAnswers, [f.id]: e.target.value },
                            })
                          }
                          className="w-full h-11 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          <option value="">Select option...</option>
                          {(f.options || []).map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                      ) : f.type === "textarea" ? (
                        <textarea
                          rows={3}
                          required={f.required}
                          placeholder={f.placeholder || `Enter ${f.label}`}
                          value={regForm.customAnswers[f.id] || ""}
                          onChange={(e) =>
                            setRegForm({
                              ...regForm,
                              customAnswers: { ...regForm.customAnswers, [f.id]: e.target.value },
                            })
                          }
                          className="w-full rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 p-3.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                        />
                      ) : (
                        <input
                          type={f.type || "text"}
                          required={f.required}
                          placeholder={f.placeholder || `Enter ${f.label}`}
                          value={regForm.customAnswers[f.id] || ""}
                          onChange={(e) =>
                            setRegForm({
                              ...regForm,
                              customAnswers: { ...regForm.customAnswers, [f.id]: e.target.value },
                            })
                          }
                          className="w-full h-11 rounded-xl border dark:border-zinc-800 border-zinc-300 dark:bg-black bg-zinc-50 px-4 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* PAYMENT SECTION FOR PAID FORMS */}
              {formConfig.isPaid && (
                <div className="p-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                      💳 UPI Payment Required ({formConfig.registrationFee || "₹50"})
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/40 border border-zinc-800 text-center">
                    {!qrLoadError ? (
                      <Image
                        src="/qr.jpg"
                        alt="ROBOCEK UPI Payment QR"
                        width={180}
                        height={180}
                        className="rounded-lg mb-2 object-contain"
                        onError={() => setQrLoadError(true)}
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-lg bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center p-3 mb-2">
                        <span className="text-3xl mb-1">📲</span>
                        <span className="text-[0.7rem] text-amber-300 font-semibold uppercase">Scan UPI QR</span>
                        <span className="text-[0.6rem] text-zinc-500">Scan & Pay fee</span>
                      </div>
                    )}
                    <p className="text-[0.7rem] text-zinc-400 leading-snug">
                      Scan QR code using GPay / PhonePe / Paytm to pay <strong>{formConfig.registrationFee || "₹50"}</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block uppercase font-semibold text-amber-300 mb-1">
                      12-Digit UPI UTR / Transaction Reference ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 423819028312"
                      value={regForm.utrNumber}
                      onChange={(e) => setRegForm({ ...regForm, utrNumber: e.target.value })}
                      className="w-full h-11 rounded-xl border border-amber-500/40 bg-black px-4 text-xs text-amber-200 font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <p className="text-[0.65rem] text-zinc-500 mt-1">
                      Find the 12-digit UTR or Transaction Ref No on your payment confirmation screen.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold uppercase tracking-wider text-xs transition disabled:opacity-50 shadow-xl shadow-emerald-600/30 cursor-pointer"
                >
                  {isSubmitting ? "Submitting Registration..." : "Submit Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t dark:border-zinc-900 border-zinc-300 dark:bg-black/95 bg-white mt-auto">
        <div className="max-w-4xl mx-auto px-6 py-5 flex items-center justify-between text-[0.7rem] dark:text-zinc-500 text-zinc-600">
          <p>© {new Date().getFullYear()} ROBOCEK · Robotics Club GCE Kannur</p>
          <Link href="/events" className="hover:dark:text-zinc-200 hover:text-zinc-800 transition uppercase tracking-wider">
            All Events
          </Link>
        </div>
      </footer>
    </div>
  );
}
