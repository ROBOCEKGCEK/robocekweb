type IconName =
  | "alert"
  | "ban"
  | "bolt"
  | "check"
  | "clock"
  | "close"
  | "download"
  | "info"
  | "lock"
  | "message"
  | "plus"
  | "monitor"
  | "terminal"
  | "user";

type UiIconProps = {
  name: IconName;
  className?: string;
};

const paths: Record<IconName, React.ReactNode> = {
  alert: <path d="M12 3 2.8 20h18.4L12 3Zm0 6v5m0 3h.01" />,
  ban: <path d="M4.9 4.9 19.1 19.1M7.1 4.8a8 8 0 1 1-2.3 2.3M4.8 16.9a8 8 0 0 1 0-9.8M16.9 19.2a8 8 0 0 1-9.8 0" />,
  bolt: <path d="m13 2-8 11h6l-1 9 8-11h-6l1-9Z" />,
  check: <path d="m5 12 4.5 4.5L19 7" />,
  clock: <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm0-14v5l3 2" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  download: <path d="M12 3v12m0 0 4-4m-4 4-4-4M5 21h14" />,
  info: <path d="M12 17v-5m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />,
  lock: <path d="M6 10h12v10H6V10Zm3 0V7a3 3 0 0 1 6 0v3m-3 4v2" />,
  message: <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.4-.7L4 20l1.7-3.8A7.2 7.2 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />,
  plus: <path d="M12 5v14M5 12h14" />,
  monitor: <path d="M4 5h16v11H4V5Zm5 15h6m-3-4v4" />,
  terminal: <path d="m5 7 4 4-4 4m6 0h8" />,
  user: <path d="M20 21a8 8 0 0 0-16 0m12-13a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z" />,
};

export default function UiIcon({ name, className = "h-4 w-4" }: UiIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
