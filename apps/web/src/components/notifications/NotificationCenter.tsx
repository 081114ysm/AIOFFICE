import type { InAppNotification } from "../../store/office-store";

type Props = { notices: InAppNotification[]; onDismiss: (id: string) => void };
export function NotificationCenter({ notices, onDismiss }: Props) { return <aside className="notification-center" aria-live="polite">{notices.map((notice) => <div className="toast" key={notice.id}><div><strong>{notice.title}</strong><p>{notice.message}</p></div><button aria-label="알림 닫기" onClick={() => onDismiss(notice.id)}>×</button></div>)}</aside>; }

