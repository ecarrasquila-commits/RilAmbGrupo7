import { useState, useEffect, useRef } from "react";
import { getUserNotifications, markAllUserNotificationsAsRead, markUserNotificationAsRead } from "../services/userService";
import "../styles/notifications.css";

/* ── CONFIG POR TIPO ── */
const TYPE_CONFIGS = {
  alarm: {
    label: "Alarma",
    labelClass: "nb-tag nb-tag--alarm",
    iconClass: "nb-item-icon nb-item-icon--alarm",
    svg: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
        <line x1="12" y1="9" x2="12" y2="13"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
  caution: {
    label: "Precaución",
    labelClass: "nb-tag nb-tag--caution",
    iconClass: "nb-item-icon nb-item-icon--caution",
    svg: (
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
    ),
  },
  device: {
    label: "Dispositivos vinculados",
    labelClass: "nb-tag nb-tag--device",
    iconClass: "nb-item-icon nb-item-icon--device",
    svg: (
      <svg width="12" height="12" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
        <rect x="1.5" y="1.5" width="37" height="37" rx="9" fill="none"/>
        <circle cx="20" cy="22" r="9" strokeWidth="1.6" fill="none" opacity=".45"/>
        <circle cx="20" cy="22" r="1.8" fill="currentColor"/>
      </svg>
    ),
  },
};

function TypeIcon({ type }) {
  const c = TYPE_CONFIGS[type] || TYPE_CONFIGS.device;
  return <div className={c.iconClass}>{c.svg}</div>;
}

function formatRelativeTime(value) {
  if (!value) return "";

  const createdAt = new Date(value);
  if (Number.isNaN(createdAt.getTime())) return "";

  const diffMinutes = Math.floor((Date.now() - createdAt.getTime()) / 60000);

  if (diffMinutes < 1) return "Hace unos segundos";
  if (diffMinutes < 60) return `Hace ${diffMinutes} min`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `Hace ${diffHours} h`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Ayer";
  return `Hace ${diffDays} días`;
}

function normalizeNotification(item) {
  const severity = (item.severity || "").toLowerCase();
  const type = item.type || (severity === "high" || severity === "critical" ? "alarm" : "caution");

  return {
    id: item.id,
    type,
    title: item.title || "Alerta",
    deviceName: item.device_name || "Dispositivo vinculado",
    deviceCode: item.device_code || null,
    description: item.description || null,
    time: formatRelativeTime(item.created_at),
    unread: item.unread ?? !item.is_read,
  };
}

function NotifItem({ n, onRead, delay }) {
  const cfg = TYPE_CONFIGS[n.type] || TYPE_CONFIGS.device;

  return (
    <div
      className={`nb-item${n.unread ? " unread" : ""}`}
      onClick={() => onRead(n.id)}
      style={{ animationDelay: `${delay}s` }}
    >
      <TypeIcon type={n.type} />

      <div className="nb-item-body">
        <div className="nb-item-tag-row">
          <span className={cfg.labelClass}>{cfg.label}</span>
        </div>
        <div className="nb-item-title">{n.title}</div>
        <div className="nb-item-device">
          {n.deviceName}
        </div>
        {n.description && (
          <div className="nb-item-desc">{n.description}</div>
        )}
        <div className="nb-item-time">{n.time}</div>
      </div>

      {n.unread && <div className="nb-item-unread-dot" />}
    </div>
  );
}

export default function NotificationBell({ initialNotifications = [] }) {
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const btnRef = useRef(null);

  const unreadCount = notifications.filter(n => n.unread).length;
  const unread = notifications.filter(n => n.unread);
  const read   = notifications.filter(n => !n.unread);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => { setOpen(false); setClosing(false); }, 180);
  };

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (!dropdownRef.current?.contains(e.target) && !btnRef.current?.contains(e.target))
        handleClose();
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape" && open) handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]);

  useEffect(() => {
    let active = true;

    const loadNotifications = async () => {
      try {
        const data = await getUserNotifications();
        if (!active) return;
        setNotifications(data.map(normalizeNotification));
      } catch (error) {
        if (!active) return;
        setNotifications([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    loadNotifications();

    return () => {
      active = false;
    };
  }, []);

  const toggleOpen = () => open ? handleClose() : setOpen(true);

  const markAllRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));

    try {
      await markAllUserNotificationsAsRead();
    } catch (error) {
      console.error(error);
    }
  };

  const markRead = async (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, unread: false } : n));

    try {
      await markUserNotificationAsRead(id);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <button
        ref={btnRef}
        onClick={toggleOpen}
        className={`nb-btn${open ? " open" : ""}`}
        aria-label="Notificaciones"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
        </svg>
        {unreadCount > 0 && <span className="nb-dot" />}
      </button>

      {open && (
        <div ref={dropdownRef} className={`nb-dropdown${closing ? " closing" : ""}`}>
          <div className="nb-head">
            <div className="nb-head-left">
              <span className="nb-title">Notificaciones</span>
              {unreadCount > 0 && <span className="nb-badge">{unreadCount}</span>}
            </div>
            {unreadCount > 0 && (
              <button className="nb-mark-all" onClick={markAllRead}>
                Marcar todo leído
              </button>
            )}
          </div>

          <div className="nb-list">
            {loading ? (
              <div className="nb-empty">
                <div className="nb-empty-text">Cargando notificaciones...</div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="nb-empty">
                <svg className="nb-empty-icon" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                <div className="nb-empty-text">Sin notificaciones</div>
              </div>
            ) : (
              <>
                {unread.length > 0 && (
                  <>
                    <div className="nb-section-label">Nuevas</div>
                    {unread.map((n, i) => (
                      <NotifItem key={n.id} n={n} onRead={markRead} delay={i * 0.04} />
                    ))}
                  </>
                )}
                {read.length > 0 && (
                  <>
                    <div className={`nb-section-label${unread.length > 0 ? " has-divider" : ""}`}>Anteriores</div>
                    {read.map((n, i) => (
                      <NotifItem key={n.id} n={n} onRead={markRead} delay={i * 0.03} />
                    ))}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}   