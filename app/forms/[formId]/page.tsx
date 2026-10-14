"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ThemeToggle from "../../ThemeToggle";
import UiIcon from "../../components/UiIcon";
import CyberBackground from "../../components/CyberBackground";
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
  isFreeForMembers?: boolean;
  memberFee?: string;
  nonMemberFee?: string;
  whatsappGroupLink?: string;
  confirmationMessage?: string;
  fields?: CustomFormField[];
  isEventForm?: boolean;
  paymentQr?: string;
  openAt?: string;
  closeAt?: string;
  maxResponses?: number | string | null;
}

function formatFieldToString(val: unknown, fallback = ""): string {
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
  const [responseCount, setResponseCount] = useState<number | null>(null);

  // Fetch logged in user to pre-fill profile data (with email fallback for batch-imported users)
  useEffect(() => {
    if (!auth) return;
    const unsub = onAuthStateChanged(auth, async (u) => {
      setCurrentUser(u);
      if (u && db) {
        try {
          let userData: any = null;
          const userDoc = await getDoc(doc(db, "users", u.uid));
          if (userDoc.exists()) {
            userData = userDoc.data();
          } else if (u.email) {
            const allUsersSnap = await getDocs(collection(db, "users"));
            const matchedUser = allUsersSnap.docs.find(
              (d) => formatFieldToString(d.data().email).toLowerCase() === u.email?.toLowerCase()
            );
            if (matchedUser) {
              userData = matchedUser.data();
            }
          }

          if (userData) {
            setRegForm((prev) => ({
              ...prev,
              fullName: formatFieldToString(userData.fullName, u.displayName || ""),
              email: formatFieldToString(userData.email, u.email || ""),
              phone: formatFieldToString(userData.phone || userData.phoneNumber, ""),
              branch: formatFieldToString(userData.branch, ""),
              year: formatFieldToString(userData.yearSemester || userData.year, ""),
              membershipId: formatFieldToString(userData.membershipId, ""),
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
            isFreeForMembers: Boolean(data.isFreeForMembers),
            memberFee: formatFieldToString(data.memberFee, "Free"),
            nonMemberFee: formatFieldToString(data.nonMemberFee || data.registrationFee, "₹50"),
            whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
            confirmationMessage: formatFieldToString(
              data.confirmationMessage,
              "You are registered successfully! Go on and join the official WhatsApp group for updates."
            ),
            fields: Array.isArray(data.fields) ? data.fields : [],
            isEventForm: false,
            paymentQr: formatFieldToString(data.paymentQr, "/qr.jpg"),
            openAt: formatFieldToString(data.openAt, ""),
            closeAt: formatFieldToString(data.closeAt, ""),
            maxResponses: data.maxResponses ?? null,
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
            isFreeForMembers: Boolean(data.isFreeForMembers),
            memberFee: formatFieldToString(data.memberFee, "Free"),
            nonMemberFee: formatFieldToString(data.nonMemberFee || data.registrationFee, "₹50"),
            whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
            confirmationMessage: formatFieldToString(
              data.confirmationMessage,
              "You are registered successfully! Go on and join the official WhatsApp group for updates."
            ),
            fields: Array.isArray(data.customFields) ? data.customFields : [],
            isEventForm: true,
            paymentQr: formatFieldToString(data.paymentQr, "/qr.jpg"),
            openAt: formatFieldToString(data.openAt, ""),
            closeAt: formatFieldToString(data.closeAt, ""),
            maxResponses: data.maxResponses ?? null,
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
            isFreeForMembers: Boolean(data.isFreeForMembers),
            memberFee: formatFieldToString(data.memberFee, "Free"),
            nonMemberFee: formatFieldToString(data.nonMemberFee || data.registrationFee, "₹50"),
            whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
            confirmationMessage: formatFieldToString(
              data.confirmationMessage,
              "You are registered successfully! Go on and join the official WhatsApp group for updates."
            ),
            fields: Array.isArray(data.fields) ? data.fields : [],
            isEventForm: false,
            paymentQr: formatFieldToString(data.paymentQr, "/qr.jpg"),
            openAt: formatFieldToString(data.openAt, ""),
            closeAt: formatFieldToString(data.closeAt, ""),
            maxResponses: data.maxResponses ?? null,
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
            isFreeForMembers: Boolean(data.isFreeForMembers),
            memberFee: formatFieldToString(data.memberFee, "Free"),
            nonMemberFee: formatFieldToString(data.nonMemberFee || data.registrationFee, "₹50"),
            whatsappGroupLink: formatFieldToString(data.whatsappGroupLink, ""),
            confirmationMessage: formatFieldToString(
              data.confirmationMessage,
              "You are registered successfully! Go on and join the official WhatsApp group for updates."
            ),
            fields: Array.isArray(data.customFields) ? data.customFields : [],
            isEventForm: true,
            paymentQr: formatFieldToString(data.paymentQr, "/qr.jpg"),
            openAt: formatFieldToString(data.openAt, ""),
            closeAt: formatFieldToString(data.closeAt, ""),
            maxResponses: data.maxResponses ?? null,
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

  // Count existing responses/registrations for the limit check
  useEffect(() => {
    if (!db || !formConfig) return;
    const subCollection = formConfig.isEventForm
      ? collection(db, "events", formConfig.id, "registrations")
      : collection(db, "custom_forms", formConfig.id, "responses");
    getDocs(subCollection)
      .then((snap) => setResponseCount(snap.size))
      .catch(() => setResponseCount(null));
  }, [formConfig]);

  const cleanObjectForFirestore = (obj: any): any => {
    if (obj === null || obj === undefined) return null;
    if (Array.isArray(obj)) {
      return obj.map(cleanObjectForFirestore);
    }
    if (typeof obj === "object" && !(obj instanceof Date)) {
      const cleaned: Record<string, any> = {};
      for (const [key, value] of Object.entries(obj)) {
        if (value !== undefined) {
          cleaned[key] = cleanObjectForFirestore(value);
        }
      }
      return cleaned;
    }
    return obj;
  };

  // Calculate fee dynamically
  const cleanMemId = regForm.membershipId.trim();
  const hasMembershipId = Boolean(cleanMemId);
  const rawMemberFee = formConfig?.memberFee || (formConfig?.isFreeForMembers ? "Free" : "Free");
  const rawNonMemberFee = formConfig?.nonMemberFee || formConfig?.registrationFee || "₹50";
  const activeFee = hasMembershipId
    ? (formConfig?.isFreeForMembers ? "Free" : rawMemberFee)
    : (formConfig?.isPaid ? rawNonMemberFee : "Free");

  const isFeeFree = activeFee.toLowerCase() === "free" || activeFee === "₹0" || activeFee === "0";
  const isPaymentRequired = Boolean(formConfig?.isPaid) && !isFeeFree;

  const isClosed =
    formConfig?.status === "Closed" ||
    (formConfig?.isEventForm && formConfig?.status === "Registration Completed");

  const openTimeMs = formConfig?.openAt ? new Date(formConfig.openAt).getTime() : null;
  const closeTimeMs = formConfig?.closeAt ? new Date(formConfig.closeAt).getTime() : null;
  const nowMs = Date.now();
  const isBeforeOpen = openTimeMs !== null && !Number.isNaN(openTimeMs) && nowMs < openTimeMs;
  const isAfterClose = closeTimeMs !== null && !Number.isNaN(closeTimeMs) && nowMs > closeTimeMs;
  const maxResponsesNum = formConfig?.maxResponses ? Number(formConfig.maxResponses) : null;
  const isLimitReached =
    maxResponsesNum !== null && responseCount !== null && responseCount >= maxResponsesNum;
  const isUnavailable = isBeforeOpen || isAfterClose || isLimitReached;

  const unavailableReason = isLimitReached
    ? "limit"
    : isBeforeOpen
      ? "not_open"
      : isAfterClose
        ? "ended"
        : "closed";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !formConfig) return;
    if (isUnavailable) {
      setErrorMessage(
        unavailableReason === "limit"
          ? "Registration limit reached."
          : unavailableReason === "not_open"
            ? "Registrations haven't opened yet."
            : "Registrations are closed."
      );
      return;
    }
    setErrorMessage("");

    if (!regForm.fullName.trim() || !regForm.email.trim() || !regForm.phone.trim()) {
      setErrorMessage("Please fill in your Full Name, Email Address, and Phone Number.");
      return;
    }

    if (isPaymentRequired) {
      const cleanUtr = regForm.utrNumber.trim();
      if (!cleanUtr || cleanUtr.length < 6) {
        setErrorMessage("Please enter your 12-digit UPI UTR / Transaction Reference Number.");
        return;
      }
    }

    setIsSubmitting(true);

    try {
      const rawPayload = {
        formId: formConfig.id,
        formTitle: formConfig.title,
        userId: currentUser?.uid || null,
        fullName: regForm.fullName.trim(),
        email: regForm.email.trim().toLowerCase(),
        phone: regForm.phone.trim(),
        branch: regForm.branch.trim(),
        year: regForm.year.trim(),
        membershipId: cleanMemId || "N/A",
        isMemberDiscountApplied: hasMembershipId,
        feePaid: activeFee,
        utrNumber: isPaymentRequired ? regForm.utrNumber.trim() : `N/A (${activeFee})`,
        paymentStatus: isPaymentRequired ? "Pending" : "Verified",
        customAnswers: regForm.customAnswers || {},
        submittedAt: new Date().toISOString(),
        registeredAt: new Date().toISOString(),
      };

      const payload = cleanObjectForFirestore(rawPayload);

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
    } catch (err: unknown) {
      console.error("Error submitting form response:", err);
      setErrorMessage("Failed to submit form. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] text-cyan-400 flex flex-col items-center justify-center font-mono text-xs gap-3">
        <span className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
        <span>Loading secure registration payload...</span>
      </div>
    );
  }

  if (notFound || !formConfig) {
    return (
      <div className="min-h-screen bg-[#030712] text-white flex flex-col items-center justify-center px-6 py-12 font-sans text-center relative overflow-hidden">
        <CyberBackground />
        <div className="max-w-md w-full rounded-3xl border border-red-500/40 bg-zinc-950/90 p-8 space-y-4 shadow-[0_0_50px_rgba(239,68,68,0.15)] relative z-10">
          <span className="text-4xl block">🔍</span>
          <h1 className="text-xl font-orbitron font-bold text-red-400">Form Not Found</h1>
          <p className="text-xs text-zinc-400 font-mono">
            The registration form <strong className="text-white">&ldquo;/forms/{formId}&rdquo;</strong> does not exist or has concluded.
          </p>
          <Link
            href="/events"
            className="inline-block px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-orbitron font-bold text-xs uppercase tracking-wider transition"
          >
            ← View All Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#030712] text-zinc-100 relative overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
      <CyberBackground />
      <ThemeToggle />

      {/* FUTURISTIC HUD NAVIGATION HEADER */}
      <header className="w-full border-b border-cyan-500/20 bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <Image
                src="/logo_white.png"
                alt="ROBOCEK"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-orbitron font-bold text-sm tracking-[0.2em] bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
                  ROBOCEK
                </span>
                <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded border border-cyan-500/40 text-cyan-400 bg-cyan-950/40">
                  REGISTRATION
                </span>
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/events"
              className="text-xs font-mono px-3.5 py-1.5 rounded-full border border-zinc-800 hover:border-cyan-500/40 text-zinc-400 hover:text-cyan-300 bg-zinc-950/60 transition"
            >
              ← Back to Events
            </Link>
          </div>
        </div>
      </header>

      {/* FORM CONTAINER */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-10 relative z-10">
        <div className="rounded-3xl border border-cyan-500/30 bg-zinc-950/85 backdrop-blur-xl p-6 sm:p-10 shadow-[0_0_50px_rgba(0,240,255,0.1)] space-y-6">
          {/* Form Header */}
          <div className="border-b border-zinc-800 pb-6 space-y-3">
            <div className="flex items-center gap-2 flex-wrap">
              {formConfig.isPaid ? (
                <div className="flex items-center gap-2 flex-wrap font-mono text-[0.65rem]">
                  <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-cyan-500/10 text-cyan-300 border border-cyan-500/40 shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                    <UiIcon name="bolt" className="inline h-3 w-3 align-text-bottom mr-1" />
                    ROBOCEK Members: {formConfig.isFreeForMembers ? "FREE" : (formConfig.memberFee || "FREE")}
                  </span>
                  <span className="px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-purple-500/10 text-purple-300 border border-purple-500/40">
                    Non-Members: {formConfig.nonMemberFee || formConfig.registrationFee || "₹50"}
                  </span>
                </div>
              ) : (
                <span className="px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-mono shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                  <UiIcon name="check" className="inline h-3 w-3 align-text-bottom mr-1" /> Free Registration for All Students
                </span>
              )}
              {isClosed && (
                <span className="px-3 py-1 rounded-full text-[0.65rem] font-bold uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/30 font-mono">
                  Closed
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-orbitron font-extrabold tracking-tight bg-gradient-to-r from-white via-cyan-100 to-cyan-400 bg-clip-text text-transparent">
              {formConfig.title}
            </h1>
            {formConfig.description ? (
              <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed font-sans">
                {formConfig.description}
              </p>
            ) : null}
          </div>

          {/* SUCCESS SCREEN */}
          {successInfo ? (
            <div className="space-y-6 text-center py-6">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center mx-auto text-3xl shadow-[0_0_30px_rgba(0,240,255,0.3)] animate-pulse">
                <UiIcon name="check" className="h-8 w-8" />
              </div>

              <div className="space-y-2">
                <h2 className="text-2xl font-orbitron font-bold text-white">
                  Registration Confirmed!
                </h2>
                <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed max-w-md mx-auto font-sans">
                  {successInfo.message}
                </p>
              </div>

              {successInfo.whatsappLink ? (
                <div className="pt-4">
                  <a
                    href={successInfo.whatsappLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2.5 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-orbitron font-bold text-xs sm:text-sm uppercase tracking-wider transition shadow-[0_0_25px_rgba(16,185,129,0.4)]"
                  >
                    <UiIcon name="message" className="h-4 w-4" />
                    Join Official WhatsApp Group
                  </a>
                  <p className="text-[0.65rem] font-mono text-zinc-500 mt-2">
                    Click to join for instant announcements, schedules &amp; coordinator Q&amp;A.
                  </p>
                </div>
              ) : null}

              <div className="pt-4">
                <Link
                  href="/events"
                  className="inline-block w-full py-3.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-xs font-mono font-semibold uppercase tracking-wider text-zinc-300 hover:text-cyan-300 hover:border-cyan-500/40 transition"
                >
                  ← Return to Events
                </Link>
              </div>
            </div>
          ) : isClosed ? (
            <div className="py-12 text-center space-y-3 font-mono">
              <span className="text-red-400 flex justify-center"><UiIcon name="lock" className="h-10 w-10" /></span>
              <p className="text-sm font-semibold text-white">
                {formConfig.isEventForm && formConfig.status === "Registration Completed"
                  ? "Registrations for this event are now closed."
                  : "This registration form is currently closed."}
              </p>
              <p className="text-xs text-zinc-500 font-sans">
                {formConfig.isEventForm && formConfig.status === "Registration Completed"
                  ? "The registration window has ended. Please check back for future events."
                  : "The form is not accepting responses at this time."}
              </p>
            </div>
          ) : isUnavailable ? (
            <div className="py-12 text-center space-y-3 font-mono">
              <span className="text-amber-400 flex justify-center"><UiIcon name={unavailableReason === "limit" ? "ban" : unavailableReason === "not_open" ? "clock" : "lock"} className="h-10 w-10" /></span>
              <p className="text-sm font-semibold text-white">
                {unavailableReason === "limit"
                  ? "Registration limit reached."
                  : unavailableReason === "not_open"
                    ? "Registrations haven't opened yet."
                    : "Registrations have ended."}
              </p>
              <p className="text-xs text-zinc-500 font-sans">
                {unavailableReason === "limit"
                  ? "The maximum number of responses has been reached. Thank you for your interest!"
                  : unavailableReason === "not_open"
                    ? `Registrations will open on ${new Date(formConfig.openAt as string).toLocaleString()}.`
                    : `Registrations closed on ${new Date(formConfig.closeAt as string).toLocaleString()}.`}
              </p>
            </div>
          ) : (
            /* FORM INPUTS */
            <form onSubmit={handleSubmit} className="space-y-5 text-xs font-mono">
              {errorMessage ? (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/40 text-red-400 text-xs">
                  <UiIcon name="alert" className="mr-1.5 inline h-4 w-4 align-text-bottom" />
                  {errorMessage}
                </div>
              ) : null}

              <div>
                <label className="block uppercase text-zinc-400 mb-1.5">
                  Full Name <span className="text-cyan-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Enter your full name"
                  value={regForm.fullName}
                  onChange={(e) => setRegForm({ ...regForm, fullName: e.target.value })}
                  className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 px-4 text-xs text-zinc-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-zinc-400 mb-1.5">
                    Email Address <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@gcek.ac.in"
                    value={regForm.email}
                    onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 px-4 text-xs text-zinc-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block uppercase text-zinc-400 mb-1.5">
                    Mobile Phone <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="10-digit mobile number"
                    value={regForm.phone}
                    onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 px-4 text-xs text-zinc-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block uppercase text-zinc-400 mb-1.5">
                    Branch / Department
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ECE / EEE / CSE / ME"
                    value={regForm.branch}
                    onChange={(e) => setRegForm({ ...regForm, branch: e.target.value })}
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 px-4 text-xs text-zinc-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>

                <div>
                  <label className="block uppercase text-zinc-400 mb-1.5">
                    Year / Batch
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 2k26 / S4"
                    value={regForm.year}
                    onChange={(e) => setRegForm({ ...regForm, year: e.target.value })}
                    className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 px-4 text-xs text-zinc-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                  />
                </div>
              </div>

              {/* ROBOCEK MEMBERSHIP ID FIELD */}
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="block uppercase font-bold text-cyan-300 text-xs">
                    ROBOCEK Membership ID
                  </label>
                  {hasMembershipId && (
                    <span className="text-[0.65rem] font-bold text-cyan-300 bg-cyan-500/20 px-2.5 py-0.5 rounded-full border border-cyan-500/40 flex items-center gap-1 shadow-[0_0_10px_rgba(0,240,255,0.3)]">
                      <UiIcon name="check" className="inline h-3 w-3 align-text-bottom" /> Member Rate Active
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="e.g. RBC-2026-0042 (Auto-filled if logged in)"
                  value={regForm.membershipId}
                  onChange={(e) => setRegForm({ ...regForm, membershipId: e.target.value.toUpperCase() })}
                  className="w-full h-11 rounded-xl border border-cyan-500/40 bg-black/80 px-4 text-xs text-cyan-200 uppercase tracking-wider focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                />
                <p className="text-[0.65rem] text-zinc-400 font-sans">
                  {hasMembershipId
                    ? `ROBOCEK Member Rate (${activeFee}) applied for ID: ${cleanMemId}. Verified at registration check-in.`
                    : `Enter your ROBOCEK Membership ID to claim Member Rate (${formConfig.isFreeForMembers ? "FREE" : rawMemberFee}). Non-Member Rate: ${rawNonMemberFee}`}
                </p>
              </div>

              {/* DYNAMIC PRICING RATE BANNER */}
              {formConfig.isPaid && (
                <div className={`p-4 rounded-2xl border text-xs flex items-center justify-between transition ${
                  hasMembershipId
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-300"
                    : "border-purple-500/40 bg-purple-500/10 text-purple-300"
                }`}>
                  <div>
                    <span className="font-orbitron font-bold text-sm block text-white">
                      {hasMembershipId
                        ? `ROBOCEK Member Rate: ${activeFee}`
                        : `Non-Member Rate: ${activeFee}`}
                    </span>
                    <span className="text-[0.65rem] opacity-80 block mt-0.5 font-sans">
                      {hasMembershipId
                        ? `Member discount applied for ID: ${cleanMemId}`
                        : `Have a ROBOCEK Membership ID? Enter it above to claim Member Price!`}
                    </span>
                  </div>
                  <span className="text-base font-orbitron font-bold px-3.5 py-1.5 rounded-xl bg-black/80 border border-current shadow-lg">
                    {activeFee}
                  </span>
                </div>
              )}

              {/* DYNAMIC CUSTOM FIELDS */}
              {formConfig.fields && formConfig.fields.length > 0 ? (
                <div className="pt-3 border-t border-zinc-800 space-y-4">
                  {formConfig.fields.map((f) => (
                    <div key={f.id}>
                      <label className="block uppercase text-zinc-400 mb-1.5">
                        {f.label} {f.required ? <span className="text-cyan-400">*</span> : "(Optional)"}
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
                          className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 px-4 text-xs text-zinc-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                        >
                          <option value="">Select option...</option>
                          {(f.options || []).map((opt) => (
                            <option key={opt} value={opt} className="bg-zinc-900 text-white">
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
                          className="w-full rounded-xl border border-zinc-800 bg-black/80 p-3.5 text-xs text-zinc-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition resize-none"
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
                          className="w-full h-11 rounded-xl border border-zinc-800 bg-black/80 px-4 text-xs text-zinc-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition"
                        />
                      )}
                    </div>
                  ))}
                </div>
              ) : null}

              {/* PAYMENT SECTION FOR PAID FORMS */}
              {isPaymentRequired && (
                <div className="p-5 rounded-2xl border border-purple-500/30 bg-purple-950/20 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-orbitron font-bold text-purple-300 uppercase tracking-wider">
                      UPI Payment Gateway ({activeFee})
                    </span>
                  </div>

                  <div className="flex flex-col items-center justify-center p-4 rounded-xl bg-black/80 border border-zinc-800 text-center">
                    {!qrLoadError ? (
                      <Image
                        src={formConfig.paymentQr || "/qr.jpg"}
                        alt="ROBOCEK UPI Payment QR"
                        width={180}
                        height={180}
                        className="rounded-xl mb-2 object-contain border border-purple-500/30"
                        onError={() => setQrLoadError(true)}
                      />
                    ) : (
                      <div className="w-40 h-40 rounded-xl bg-zinc-900 border border-zinc-800 flex flex-col items-center justify-center text-center p-3 mb-2">
                        <span className="text-3xl mb-1">📲</span>
                        <span className="text-[0.7rem] text-purple-300 font-semibold uppercase">Scan UPI QR</span>
                        <span className="text-[0.6rem] text-zinc-500">Scan &amp; Pay fee</span>
                      </div>
                    )}
                    <p className="text-[0.7rem] text-zinc-400 font-sans leading-snug">
                      Scan QR code using GPay / PhonePe / Paytm to pay <strong>{activeFee}</strong>.
                    </p>
                  </div>

                  <div>
                    <label className="block uppercase font-bold text-purple-300 mb-1">
                      12-Digit UPI UTR / Transaction Reference ID <span className="text-purple-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 423819028312"
                      value={regForm.utrNumber}
                      onChange={(e) => setRegForm({ ...regForm, utrNumber: e.target.value })}
                      className="w-full h-11 rounded-xl border border-purple-500/40 bg-black/80 px-4 text-xs text-purple-200 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition"
                    />
                    <p className="text-[0.65rem] text-zinc-500 mt-1 font-sans">
                      Find the 12-digit UTR or Transaction Ref No on your payment confirmation screen.
                    </p>
                  </div>
                </div>
              )}

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-black font-orbitron font-bold uppercase tracking-wider text-xs transition disabled:opacity-50 shadow-[0_0_25px_rgba(0,240,255,0.4)] cursor-pointer"
                >
                  {isSubmitting ? "Submitting Registration..." : "Submit Registration"}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-cyan-500/20 bg-[#030712]/90 backdrop-blur-xl mt-auto relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-8 py-5 flex items-center justify-between text-xs font-mono text-zinc-500">
          <p>© {new Date().getFullYear()} ROBOCEK · Robotics Club GCE Kannur</p>
          <Link href="/events" className="hover:text-cyan-400 transition uppercase tracking-wider">
            All Events ↗
          </Link>
        </div>
      </footer>
    </div>
  );
}
