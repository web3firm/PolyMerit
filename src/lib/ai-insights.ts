import { Market, Trade } from './polymarket';

export interface MarketInsight {
  sentiment: 'bullish' | 'bearish' | 'neutral';
  sentimentScore: number; // -1 to 1
  confidence: number; // 0 to 1
  prediction: string;
  signals: Signal[];
  volumeAnalysis: VolumeAnalysis;
  priceMovement: PriceMovement;
  anomalies: Anomaly[];
}

export interface Signal {
  type: 'whale_accumulation' | 'volume_spike' | 'price_momentum' | 'smart_money' | 'divergence';
  strength: 'strong' | 'moderate' | 'weak';
  description: string;
  impact: 'bullish' | 'bearish' | 'neutral';
}

export interface VolumeAnalysis {
  trend: 'increasing' | 'decreasing' | 'stable';
  percentChange24h: number;
  volumeRating: number; // 1-10
  interpretation: string;
}

export interface PriceMovement {
  direction: 'up' | 'down' | 'sideways';
  momentum: number; // -100 to 100
  volatility: 'high' | 'medium' | 'low';
  supportLevel?: number;
  resistanceLevel?: number;
}

export interface Anomaly {
  type: 'unusual_volume' | 'price_gap' | 'whale_activity' | 'sudden_shift';
  severity: 'high' | 'medium' | 'low';
  description: string;
  timestamp: number;
}

/**
 * Analyze market sentiment based on price, volume, and trade data
 */
export function analyzeMarketSentiment(
  market: Market,
  recentTrades?: Trade[]
): MarketInsight {
  const volume = parseFloat(market.volume || '0');
  const volume24h = parseFloat(market.volume24hr || '0');
  
  // Parse outcome prices
  let yesPrice = 0.5;
  try {
    const prices = typeof market.outcomePrices === 'string' 
      ? JSON.parse(market.outcomePrices) 
      : market.outcomePrices;
    if (Array.isArray(prices) && prices.length > 0) {
      yesPrice = parseFloat(prices[0]) || 0.5;
    }
  } catch {}

  // Calculate sentiment score based on price position
  const sentimentScore = (yesPrice - 0.5) * 2; // -1 to 1
  
  // Determine sentiment
  let sentiment: 'bullish' | 'bearish' | 'neutral' = 'neutral';
  if (yesPrice > 0.65) sentiment = 'bullish';
  else if (yesPrice < 0.35) sentiment = 'bearish';

  // Analyze volume trend
  const volumeChange = volume24h > 0 ? ((volume - volume24h) / volume24h) * 100 : 0;
  const volumeAnalysis: VolumeAnalysis = {
    trend: volumeChange > 10 ? 'increasing' : volumeChange < -10 ? 'decreasing' : 'stable',
    percentChange24h: volumeChange,
    volumeRating: Math.min(10, Math.max(1, Math.floor(volume / 100000))),
    interpretation: getVolumeInterpretation(volume, volumeChange)
  };

  // Analyze price movement
  const priceMovement: PriceMovement = {
    direction: yesPrice > 0.55 ? 'up' : yesPrice < 0.45 ? 'down' : 'sideways',
    momentum: (yesPrice - 0.5) * 200, // -100 to 100
    volatility: volume > 500000 ? 'high' : volume > 100000 ? 'medium' : 'low',
    supportLevel: Math.max(0, yesPrice - 0.15),
    resistanceLevel: Math.min(1, yesPrice + 0.15)
  };

  // Detect signals
  const signals: Signal[] = [];
  
  // Volume spike signal
  if (volumeChange > 50) {
    signals.push({
      type: 'volume_spike',
      strength: volumeChange > 100 ? 'strong' : 'moderate',
      description: `${volumeChange.toFixed(0)}% volume increase in 24h`,
      impact: sentiment === 'bullish' ? 'bullish' : sentiment === 'bearish' ? 'bearish' : 'neutral'
    });
  }

  // Price momentum signal
  if (Math.abs(yesPrice - 0.5) > 0.2) {
    signals.push({
      type: 'price_momentum',
      strength: Math.abs(yesPrice - 0.5) > 0.3 ? 'strong' : 'moderate',
      description: `Strong ${yesPrice > 0.5 ? 'bullish' : 'bearish'} momentum`,
      impact: yesPrice > 0.5 ? 'bullish' : 'bearish'
    });
  }

  // Whale accumulation (from trades)
  if (recentTrades && recentTrades.length > 0) {
    const largeTrades = recentTrades.filter(t => parseFloat(t.size || '0') > 10000);
    if (largeTrades.length > 3) {
      const buyCount = largeTrades.filter(t => t.side === 'BUY').length;
      const sellCount = largeTrades.filter(t => t.side === 'SELL').length;
      
      if (buyCount > sellCount * 1.5) {
        signals.push({
          type: 'whale_accumulation',
          strength: 'strong',
          description: `${buyCount} large buy orders detected`,
          impact: 'bullish'
        });
      } else if (sellCount > buyCount * 1.5) {
        signals.push({
          type: 'whale_accumulation',
          strength: 'strong',
          description: `${sellCount} large sell orders detected`,
          impact: 'bearish'
        });
      }
    }
  }

  // Smart money signal (high volume + extreme price)
  if (volume > 500000 && (yesPrice > 0.75 || yesPrice < 0.25)) {
    signals.push({
      type: 'smart_money',
      strength: 'moderate',
      description: 'High conviction positioning by large traders',
      impact: yesPrice > 0.75 ? 'bullish' : 'bearish'
    });
  }

  // Detect anomalies
  const anomalies: Anomaly[] = [];
  
  // Unusual volume
  if (volumeChange > 200) {
    anomalies.push({
      type: 'unusual_volume',
      severity: 'high',
      description: `Extreme ${volumeChange.toFixed(0)}% volume surge`,
      timestamp: Date.now()
    });
  }

  // Sudden shift (extreme prices)
  if (yesPrice > 0.85 || yesPrice < 0.15) {
    anomalies.push({
      type: 'sudden_shift',
      severity: yesPrice > 0.9 || yesPrice < 0.1 ? 'high' : 'medium',
      description: `Market shows extreme ${yesPrice > 0.85 ? 'bullish' : 'bearish'} positioning`,
      timestamp: Date.now()
    });
  }

  // Generate prediction
  const prediction = generatePrediction(sentiment, signals, volumeAnalysis, priceMovement);

  // Calculate confidence
  const confidence = calculateConfidence(volume, signals.length, Math.abs(sentimentScore));

  return {
    sentiment,
    sentimentScore,
    confidence,
    prediction,
    signals,
    volumeAnalysis,
    priceMovement,
    anomalies
  };
}

function getVolumeInterpretation(volume: number, change: number): string {
  if (volume < 10000) return 'Low liquidity - higher risk';
  if (volume < 100000) return 'Moderate activity';
  if (volume < 500000) return 'Strong interest from traders';
  if (volume < 1000000) return 'High activity - institutional interest';
  return 'Exceptional volume - major event';
}

function generatePrediction(
  sentiment: 'bullish' | 'bearish' | 'neutral',
  signals: Signal[],
  volumeAnalysis: VolumeAnalysis,
  priceMovement: PriceMovement
): string {
  const strongSignals = signals.filter(s => s.strength === 'strong').length;
  
  if (sentiment === 'bullish') {
    if (strongSignals >= 2) {
      return 'Strong bullish momentum with multiple confirming signals. High probability of YES outcome.';
    }
    if (volumeAnalysis.trend === 'increasing') {
      return 'Bullish trend with growing market interest. YES outcome favored.';
    }
    return 'Moderate bullish sentiment. YES outcome slightly favored.';
  }
  
  if (sentiment === 'bearish') {
    if (strongSignals >= 2) {
      return 'Strong bearish pressure with multiple confirming signals. High probability of NO outcome.';
    }
    if (volumeAnalysis.trend === 'increasing') {
      return 'Bearish trend with growing market interest. NO outcome favored.';
    }
    return 'Moderate bearish sentiment. NO outcome slightly favored.';
  }
  
  return 'Market is balanced with no clear directional bias. Monitor for breakout.';
}

function calculateConfidence(volume: number, signalCount: number, sentimentStrength: number): number {
  // Base confidence on volume (higher volume = more confident)
  let confidence = Math.min(0.5, volume / 2000000);
  
  // Add confidence for signals
  confidence += signalCount * 0.1;
  
  // Add confidence for strong sentiment
  confidence += sentimentStrength * 0.3;
  
  return Math.min(0.95, Math.max(0.1, confidence));
}

/**
 * Compare two markets and identify arbitrage opportunities
 */
export function findArbitrageOpportunities(markets: Market[]): any[] {
  // This would analyze related markets for price discrepancies
  // Placeholder for future implementation
  return [];
}

/**
 * Analyze trader performance and identify smart money
 */
export function analyzeTraderPerformance(trades: Trade[]): any {
  const traderStats = new Map<string, {
    totalTrades: number;
    buyTrades: number;
    sellTrades: number;
    totalVolume: number;
    avgTradeSize: number;
    recentActivity: number;
  }>();

  trades.forEach(trade => {
    const addr = trade.maker_address;
    const stats = traderStats.get(addr) || {
      totalTrades: 0,
      buyTrades: 0,
      sellTrades: 0,
      totalVolume: 0,
      avgTradeSize: 0,
      recentActivity: 0
    };

    stats.totalTrades++;
    if (trade.side === 'BUY') stats.buyTrades++;
    else stats.sellTrades++;
    
    const tradeValue = parseFloat(trade.size || '0') * parseFloat(trade.price || '0');
    stats.totalVolume += tradeValue;
    
    // Recent activity (last hour)
    const hourAgo = Date.now() - 3600000;
    if (trade.timestamp * 1000 > hourAgo) {
      stats.recentActivity++;
    }

    traderStats.set(addr, stats);
  });

  // Calculate averages and return top traders
  const topTraders = Array.from(traderStats.entries())
    .map(([address, stats]) => ({
      address,
      ...stats,
      avgTradeSize: stats.totalVolume / stats.totalTrades
    }))
    .filter(t => t.totalTrades >= 5) // Min 5 trades
    .sort((a, b) => b.totalVolume - a.totalVolume)
    .slice(0, 10);

  return topTraders;
}
