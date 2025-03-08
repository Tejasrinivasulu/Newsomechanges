import React from 'react';
import { X, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { Alert, AlertSeverity } from './AlertSystem/types';

const severityStyles = {
  critical: 'bg-red-50 border-red-200 text-red-700',
  high: 'bg-orange-50 border-orange-200 text-orange-700',
  medium: 'bg-yellow-50 border-yellow-200 text-yellow-700',
  low: 'bg-blue-50 border-blue-200 text-blue-700'
};

const severityIcons = {
  critical: AlertOctagon,
  high: AlertTriangle,
  medium: Info,
  low: Info
};

interface NotificationCardProps {
  alert: Alert;
  onDismiss: (id: string) => void;
}

function NotificationCard({ alert, onDismiss }: NotificationCardProps) {
  const SeverityIcon = severityIcons[alert.severity];
  const formattedTime = alert.timestamp.toLocaleTimeString();

  return (
    <div className={`p-4 rounded-lg border ${severityStyles[alert.severity]} mb-4`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <SeverityIcon className="w-5 h-5 mt-1" />
          <div>
            <h3 className="font-semibold">{alert.title}</h3>
            <p className="text-sm mt-1">{alert.message}</p>
            <div className="text-sm mt-2 opacity-75">{formattedTime}</div>
          </div>
        </div>
        <button
          onClick={() => onDismiss(alert.id)}
          className="p-1.5 hover:bg-black/5 rounded-lg transition-colors"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

interface NotificationsPanelProps {
  onClose: () => void;
  alerts: Alert[];
  onDismiss: (id: string) => void;
}

export default function NotificationsPanel({ onClose, alerts, onDismiss }: NotificationsPanelProps) {
  return (
    <div className="w-96 bg-card rounded-lg shadow-xl border p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="space-y-4">
        {alerts.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No notifications</p>
        ) : (
          alerts.map(alert => (
            <NotificationCard
              key={alert.id}
              alert={alert}
              onDismiss={onDismiss}
            />
          ))
        )}
      </div>
    </div>
  );
}