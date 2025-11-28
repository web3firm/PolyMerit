/**
 * Alert system for PolyMerit
 * Handles browser notifications and alert management
 */

export interface Alert {
    id: string;
    type: 'whale' | 'price' | 'volume';
    title: string;
    message: string;
    market?: string;
    threshold?: number;
    createdAt: number;
    read: boolean;
}

export interface PriceAlert {
    id: string;
    marketId: string;
    marketTitle: string;
    targetPrice: number;
    direction: 'above' | 'below';
    currentPrice: number;
    active: boolean;
    createdAt: number;
}

export interface WhaleAlert {
    id: string;
    minSize: number;
    active: boolean;
    createdAt: number;
}

const ALERTS_KEY = 'polymerit_alerts';
const PRICE_ALERTS_KEY = 'polymerit_price_alerts';
const WHALE_ALERTS_KEY = 'polymerit_whale_alerts';
const NOTIFICATION_PERMISSION_KEY = 'polymerit_notification_permission';

/**
 * Request notification permission from user
 */
export async function requestNotificationPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.log('This browser does not support notifications');
        return false;
    }

    if (Notification.permission === 'granted') {
        localStorage.setItem(NOTIFICATION_PERMISSION_KEY, 'granted');
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        localStorage.setItem(NOTIFICATION_PERMISSION_KEY, permission);
        return permission === 'granted';
    }

    return false;
}

/**
 * Check if notifications are enabled
 */
export function isNotificationsEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    return Notification.permission === 'granted';
}

/**
 * Show a browser notification
 */
export function showNotification(title: string, options?: NotificationOptions): void {
    if (!isNotificationsEnabled()) return;

    const notification = new Notification(title, {
        icon: '/polymerit-icon.png',
        badge: '/polymerit-badge.png',
        ...options,
    });

    notification.onclick = () => {
        window.focus();
        notification.close();
    };

    // Auto close after 5 seconds
    setTimeout(() => notification.close(), 5000);
}

/**
 * Show a whale trade notification
 */
export function showWhaleNotification(
    address: string,
    side: 'BUY' | 'SELL',
    size: number,
    market: string
): void {
    const emoji = side === 'BUY' ? '🟢' : '🔴';
    const action = side === 'BUY' ? 'bought' : 'sold';
    
    showNotification(`🐋 Whale Alert!`, {
        body: `${emoji} ${address.slice(0, 6)}...${address.slice(-4)} ${action} $${size.toLocaleString()} on "${market.slice(0, 40)}..."`,
        tag: `whale-${address}-${Date.now()}`,
    });
}

/**
 * Show a price alert notification
 */
export function showPriceNotification(
    market: string,
    currentPrice: number,
    targetPrice: number,
    direction: 'above' | 'below'
): void {
    const emoji = direction === 'above' ? '📈' : '📉';
    
    showNotification(`${emoji} Price Alert Triggered!`, {
        body: `"${market.slice(0, 40)}..." is now ${direction} ${(targetPrice * 100).toFixed(0)}% at ${(currentPrice * 100).toFixed(0)}%`,
        tag: `price-${market}-${Date.now()}`,
    });
}

// ============================================================================
// LOCAL STORAGE MANAGEMENT
// ============================================================================

/**
 * Get all alerts from localStorage
 */
export function getAlerts(): Alert[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Add a new alert
 */
export function addAlert(alert: Omit<Alert, 'id' | 'createdAt' | 'read'>): Alert {
    const alerts = getAlerts();
    const newAlert: Alert = {
        ...alert,
        id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
        read: false,
    };
    alerts.unshift(newAlert);
    // Keep only last 100 alerts
    const trimmed = alerts.slice(0, 100);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(trimmed));
    return newAlert;
}

/**
 * Mark alert as read
 */
export function markAlertRead(id: string): void {
    const alerts = getAlerts();
    const updated = alerts.map(a => a.id === id ? { ...a, read: true } : a);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
}

/**
 * Mark all alerts as read
 */
export function markAllAlertsRead(): void {
    const alerts = getAlerts();
    const updated = alerts.map(a => ({ ...a, read: true }));
    localStorage.setItem(ALERTS_KEY, JSON.stringify(updated));
}

/**
 * Delete an alert
 */
export function deleteAlert(id: string): void {
    const alerts = getAlerts();
    const filtered = alerts.filter(a => a.id !== id);
    localStorage.setItem(ALERTS_KEY, JSON.stringify(filtered));
}

/**
 * Clear all alerts
 */
export function clearAlerts(): void {
    localStorage.setItem(ALERTS_KEY, JSON.stringify([]));
}

// ============================================================================
// PRICE ALERTS
// ============================================================================

/**
 * Get price alerts
 */
export function getPriceAlerts(): PriceAlert[] {
    if (typeof window === 'undefined') return [];
    const stored = localStorage.getItem(PRICE_ALERTS_KEY);
    return stored ? JSON.parse(stored) : [];
}

/**
 * Add a price alert
 */
export function addPriceAlert(alert: Omit<PriceAlert, 'id' | 'createdAt'>): PriceAlert {
    const alerts = getPriceAlerts();
    const newAlert: PriceAlert = {
        ...alert,
        id: `price-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: Date.now(),
    };
    alerts.push(newAlert);
    localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));
    return newAlert;
}

/**
 * Remove a price alert
 */
export function removePriceAlert(id: string): void {
    const alerts = getPriceAlerts();
    const filtered = alerts.filter(a => a.id !== id);
    localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(filtered));
}

/**
 * Check price alerts against current prices
 */
export function checkPriceAlerts(
    marketPrices: Map<string, number>
): PriceAlert[] {
    const alerts = getPriceAlerts();
    const triggered: PriceAlert[] = [];

    alerts.forEach(alert => {
        if (!alert.active) return;
        
        const currentPrice = marketPrices.get(alert.marketId);
        if (currentPrice === undefined) return;

        const shouldTrigger = 
            (alert.direction === 'above' && currentPrice >= alert.targetPrice) ||
            (alert.direction === 'below' && currentPrice <= alert.targetPrice);

        if (shouldTrigger) {
            triggered.push({ ...alert, currentPrice });
            // Deactivate after triggering
            alert.active = false;
            
            // Show notification
            showPriceNotification(
                alert.marketTitle,
                currentPrice,
                alert.targetPrice,
                alert.direction
            );
            
            // Add to alert history
            addAlert({
                type: 'price',
                title: `Price Alert: ${alert.marketTitle.slice(0, 30)}...`,
                message: `Price is now ${alert.direction} ${(alert.targetPrice * 100).toFixed(0)}%`,
                market: alert.marketId,
            });
        }
    });

    // Update alerts in storage
    localStorage.setItem(PRICE_ALERTS_KEY, JSON.stringify(alerts));

    return triggered;
}

// ============================================================================
// WHALE ALERTS
// ============================================================================

/**
 * Get whale alert settings
 */
export function getWhaleAlertSettings(): WhaleAlert | null {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(WHALE_ALERTS_KEY);
    return stored ? JSON.parse(stored) : null;
}

/**
 * Set whale alert settings
 */
export function setWhaleAlertSettings(minSize: number, active: boolean): WhaleAlert {
    const settings: WhaleAlert = {
        id: 'whale-settings',
        minSize,
        active,
        createdAt: Date.now(),
    };
    localStorage.setItem(WHALE_ALERTS_KEY, JSON.stringify(settings));
    return settings;
}

/**
 * Check if a trade should trigger a whale alert
 */
export function shouldTriggerWhaleAlert(
    tradeSize: number,
    tradeAddress: string,
    side: 'BUY' | 'SELL',
    market: string
): boolean {
    const settings = getWhaleAlertSettings();
    if (!settings || !settings.active) return false;
    
    if (tradeSize >= settings.minSize) {
        // Show notification
        showWhaleNotification(tradeAddress, side, tradeSize, market);
        
        // Add to alert history
        addAlert({
            type: 'whale',
            title: `🐋 Whale ${side} Detected`,
            message: `$${tradeSize.toLocaleString()} ${side.toLowerCase()} on "${market.slice(0, 30)}..."`,
            market,
        });
        
        return true;
    }
    
    return false;
}
