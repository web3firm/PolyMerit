'use client';

import { useState, useEffect } from 'react';
import { Bell, BellRing, Trash2, Settings, Zap, DollarSign, AlertTriangle, Check, X } from 'lucide-react';
import { AuthRequired } from '@/components/AuthRequired';
import {
    requestNotificationPermission,
    isNotificationsEnabled,
    getAlerts,
    getPriceAlerts,
    getWhaleAlertSettings,
    setWhaleAlertSettings,
    removePriceAlert,
    deleteAlert,
    markAllAlertsRead,
    clearAlerts,
    Alert,
    PriceAlert,
    WhaleAlert,
} from '@/lib/alerts';

function AlertsContent() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
    const [whaleSettings, setWhaleSettings] = useState<WhaleAlert | null>(null);
    const [minWhaleSize, setMinWhaleSize] = useState(10000);
    const [whaleAlertsActive, setWhaleAlertsActive] = useState(false);
    const [activeTab, setActiveTab] = useState<'history' | 'price' | 'whale'>('history');

    useEffect(() => {
        setNotificationsEnabled(isNotificationsEnabled());
        setAlerts(getAlerts());
        setPriceAlerts(getPriceAlerts());
        const settings = getWhaleAlertSettings();
        if (settings) {
            setWhaleSettings(settings);
            setMinWhaleSize(settings.minSize);
            setWhaleAlertsActive(settings.active);
        }
    }, []);

    const handleEnableNotifications = async () => {
        const granted = await requestNotificationPermission();
        setNotificationsEnabled(granted);
    };

    const handleSaveWhaleSettings = () => {
        const settings = setWhaleAlertSettings(minWhaleSize, whaleAlertsActive);
        setWhaleSettings(settings);
    };

    const handleDeletePriceAlert = (id: string) => {
        removePriceAlert(id);
        setPriceAlerts(getPriceAlerts());
    };

    const handleDeleteAlert = (id: string) => {
        deleteAlert(id);
        setAlerts(getAlerts());
    };

    const handleMarkAllRead = () => {
        markAllAlertsRead();
        setAlerts(getAlerts());
    };

    const handleClearAll = () => {
        if (confirm('Are you sure you want to clear all alerts?')) {
            clearAlerts();
            setAlerts([]);
        }
    };

    const unreadCount = alerts.filter(a => !a.read).length;

    return (
        <div className="min-h-screen py-8 bg-secondary">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-primary/10 rounded-full mb-3">
                            <BellRing size={16} className="text-accent-primary" />
                            <span className="text-sm font-medium text-accent-primary">Alerts Center</span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
                            Notifications & Alerts
                        </h1>
                        <p className="text-secondary">
                            Set up price alerts and whale notifications
                        </p>
                    </div>

                    {/* Notification Permission Banner */}
                    {!notificationsEnabled && (
                        <div className="card bg-warning/10 border-warning/30 mb-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <AlertTriangle size={24} className="text-warning" />
                                    <div>
                                        <p className="font-semibold text-primary">Enable Browser Notifications</p>
                                        <p className="text-sm text-secondary">Get alerts even when the tab is in background</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleEnableNotifications}
                                    className="btn-primary"
                                >
                                    Enable
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="flex gap-2 mb-6">
                        {[
                            { id: 'history', label: 'Alert History', icon: Bell, count: unreadCount },
                            { id: 'price', label: 'Price Alerts', icon: DollarSign, count: priceAlerts.filter(a => a.active).length },
                            { id: 'whale', label: 'Whale Alerts', icon: Zap, count: whaleAlertsActive ? 1 : 0 },
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    activeTab === tab.id
                                        ? 'bg-accent-primary text-white'
                                        : 'bg-tertiary text-secondary hover:text-primary'
                                }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                        activeTab === tab.id ? 'bg-white/20' : 'bg-accent-primary/20 text-accent-primary'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Alert History Tab */}
                    {activeTab === 'history' && (
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-primary">Recent Alerts</h2>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="btn-outline text-sm"
                                        disabled={unreadCount === 0}
                                    >
                                        <Check size={16} className="mr-1" />
                                        Mark all read
                                    </button>
                                    <button
                                        onClick={handleClearAll}
                                        className="btn-outline text-sm text-danger hover:border-danger"
                                        disabled={alerts.length === 0}
                                    >
                                        <Trash2 size={16} className="mr-1" />
                                        Clear all
                                    </button>
                                </div>
                            </div>

                            {alerts.length === 0 ? (
                                <div className="text-center py-12">
                                    <Bell size={48} className="mx-auto text-secondary/50 mb-4" />
                                    <p className="text-secondary">No alerts yet</p>
                                    <p className="text-sm text-secondary mt-1">
                                        Set up price or whale alerts to get notified
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {alerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className={`p-4 rounded-lg border transition-colors ${
                                                alert.read
                                                    ? 'bg-tertiary border-primary/5'
                                                    : 'bg-accent-primary/5 border-accent-primary/20'
                                            }`}
                                        >
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex items-start gap-3">
                                                    <div className={`p-2 rounded-lg ${
                                                        alert.type === 'whale' ? 'bg-warning/10' :
                                                        alert.type === 'price' ? 'bg-success/10' :
                                                        'bg-accent-primary/10'
                                                    }`}>
                                                        {alert.type === 'whale' ? (
                                                            <span className="text-lg">🐋</span>
                                                        ) : alert.type === 'price' ? (
                                                            <DollarSign size={20} className="text-success" />
                                                        ) : (
                                                            <Bell size={20} className="text-accent-primary" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-primary">{alert.title}</p>
                                                        <p className="text-sm text-secondary">{alert.message}</p>
                                                        <p className="text-xs text-secondary mt-1">
                                                            {new Date(alert.createdAt).toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteAlert(alert.id)}
                                                    className="p-2 text-secondary hover:text-danger transition-colors"
                                                >
                                                    <X size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Price Alerts Tab */}
                    {activeTab === 'price' && (
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-primary">Price Alerts</h2>
                            </div>

                            <div className="p-4 bg-tertiary rounded-lg mb-6">
                                <p className="text-sm text-secondary">
                                    💡 <strong>How to set price alerts:</strong> Visit any market detail page and click &quot;Set Price Alert&quot; to be notified when the price reaches your target.
                                </p>
                            </div>

                            {priceAlerts.length === 0 ? (
                                <div className="text-center py-12">
                                    <DollarSign size={48} className="mx-auto text-secondary/50 mb-4" />
                                    <p className="text-secondary">No price alerts set</p>
                                    <p className="text-sm text-secondary mt-1">
                                        Go to a market page to set one up
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {priceAlerts.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className={`p-4 rounded-lg border ${
                                                alert.active
                                                    ? 'bg-tertiary border-primary/10'
                                                    : 'bg-tertiary/50 border-primary/5 opacity-60'
                                            }`}
                                        >
                                            <div className="flex items-center justify-between gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-semibold text-primary truncate">
                                                        {alert.marketTitle}
                                                    </p>
                                                    <p className="text-sm text-secondary mt-1">
                                                        Alert when price is{' '}
                                                        <span className={alert.direction === 'above' ? 'text-success' : 'text-danger'}>
                                                            {alert.direction} {(alert.targetPrice * 100).toFixed(0)}%
                                                        </span>
                                                    </p>
                                                    <p className="text-xs text-secondary mt-1">
                                                        Current: {(alert.currentPrice * 100).toFixed(0)}% | 
                                                        Status: {alert.active ? '🟢 Active' : '⚫ Triggered'}
                                                    </p>
                                                </div>
                                                <button
                                                    onClick={() => handleDeletePriceAlert(alert.id)}
                                                    className="p-2 text-secondary hover:text-danger transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Whale Alerts Tab */}
                    {activeTab === 'whale' && (
                        <div className="card">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                                    <span className="text-2xl">🐋</span>
                                    Whale Alert Settings
                                </h2>
                            </div>

                            <div className="space-y-6">
                                {/* Enable/Disable Toggle */}
                                <div className="flex items-center justify-between p-4 bg-tertiary rounded-lg">
                                    <div>
                                        <p className="font-semibold text-primary">Whale Trade Notifications</p>
                                        <p className="text-sm text-secondary">
                                            Get notified when large trades are detected
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setWhaleAlertsActive(!whaleAlertsActive)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                            whaleAlertsActive ? 'bg-accent-primary' : 'bg-tertiary border border-primary/20'
                                        }`}
                                    >
                                        <span
                                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                                whaleAlertsActive ? 'translate-x-6' : 'translate-x-1'
                                            }`}
                                        />
                                    </button>
                                </div>

                                {/* Min Trade Size */}
                                <div className="p-4 bg-tertiary rounded-lg">
                                    <label className="block font-semibold text-primary mb-2">
                                        Minimum Trade Size
                                    </label>
                                    <p className="text-sm text-secondary mb-4">
                                        Only notify for trades larger than this amount
                                    </p>
                                    <div className="flex gap-4 items-center">
                                        <input
                                            type="range"
                                            min="1000"
                                            max="100000"
                                            step="1000"
                                            value={minWhaleSize}
                                            onChange={(e) => setMinWhaleSize(parseInt(e.target.value))}
                                            className="flex-1 h-2 bg-primary/10 rounded-lg appearance-none cursor-pointer accent-accent-primary"
                                        />
                                        <span className="text-xl font-bold text-accent-primary min-w-[100px] text-right">
                                            ${minWhaleSize.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-xs text-secondary mt-2">
                                        <span>$1,000</span>
                                        <span>$100,000</span>
                                    </div>
                                </div>

                                {/* Quick Presets */}
                                <div className="flex gap-2 flex-wrap">
                                    {[5000, 10000, 25000, 50000, 100000].map((amount) => (
                                        <button
                                            key={amount}
                                            onClick={() => setMinWhaleSize(amount)}
                                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                                                minWhaleSize === amount
                                                    ? 'bg-accent-primary text-white'
                                                    : 'bg-tertiary text-secondary hover:text-primary'
                                            }`}
                                        >
                                            ${(amount / 1000)}K
                                        </button>
                                    ))}
                                </div>

                                {/* Save Button */}
                                <button
                                    onClick={handleSaveWhaleSettings}
                                    className="btn-primary w-full"
                                >
                                    <Settings size={18} className="mr-2" />
                                    Save Whale Alert Settings
                                </button>

                                {/* Current Status */}
                                {whaleSettings && (
                                    <div className="p-4 bg-accent-primary/10 rounded-lg">
                                        <p className="text-sm text-accent-primary">
                                            <strong>Current Settings:</strong>{' '}
                                            {whaleSettings.active ? (
                                                <>Alerting for trades ≥ ${whaleSettings.minSize.toLocaleString()}</>
                                            ) : (
                                                <>Whale alerts are disabled</>
                                            )}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function AlertsPage() {
    return (
        <AuthRequired>
            <AlertsContent />
        </AuthRequired>
    );
}
