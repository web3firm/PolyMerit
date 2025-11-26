'use client';

import { useState, useEffect } from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, Zap, Activity, Target } from 'lucide-react';
import { Market, Trade } from '@/lib/polymarket';
import { MarketInsight, analyzeMarketSentiment } from '@/lib/ai-insights';

interface AIInsightsProps {
  market: Market;
  trades?: Trade[];
  compact?: boolean;
}

export default function AIInsights({ market, trades, compact = false }: AIInsightsProps) {
  const [insight, setInsight] = useState<MarketInsight | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    try {
      const analysis = analyzeMarketSentiment(market, trades);
      setInsight(analysis);
    } catch (error) {
      console.error('AI analysis failed:', error);
    } finally {
      setLoading(false);
    }
  }, [market, trades]);

  if (loading) {
    return (
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain size={24} className="text-accent animate-pulse" />
          <h3 className="text-lg font-bold text-primary">AI Analysis</h3>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-secondary rounded w-3/4 animate-pulse"></div>
          <div className="h-4 bg-secondary rounded w-1/2 animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (!insight) return null;

  const sentimentColor = {
    bullish: 'text-green-600',
    bearish: 'text-red-600',
    neutral: 'text-secondary'
  };

  const sentimentBg = {
    bullish: 'bg-green-50',
    bearish: 'bg-red-50',
    neutral: 'bg-secondary'
  };

  const SentimentIcon = insight.sentiment === 'bullish' ? TrendingUp : 
                       insight.sentiment === 'bearish' ? TrendingDown : 
                       Activity;

  if (compact) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <Brain size={16} className="text-accent" />
        <span className={`text-sm font-semibold ${sentimentColor[insight.sentiment]}`}>
          {insight.sentiment.toUpperCase()}
        </span>
        <span className="text-xs text-secondary">
          {(insight.confidence * 100).toFixed(0)}% confidence
        </span>
        {insight.signals.length > 0 && (
          <span className="text-xs bg-accent/10 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded-full">
            {insight.signals.length} signals
          </span>
        )}
      </div>
    );
  }

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
            <Brain size={24} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">AI Market Analysis</h3>
            <p className="text-sm text-secondary">Advanced sentiment & predictions</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-lg ${sentimentBg[insight.sentiment]}`}>
          <div className="flex items-center gap-2">
            <SentimentIcon size={20} className={sentimentColor[insight.sentiment]} />
            <span className={`text-sm font-bold uppercase ${sentimentColor[insight.sentiment]}`}>
              {insight.sentiment}
            </span>
          </div>
          <div className="text-xs text-secondary text-center mt-1">
            {(insight.confidence * 100).toFixed(0)}% confident
          </div>
        </div>
      </div>

      {/* Prediction */}
      <div className="mb-6 p-4 bg-accent/10 rounded-lg border border-accent">
        <div className="flex items-start gap-3">
          <Target size={20} className="text-accent flex-shrink-0 mt-0.5" />
          <div>
            <div className="text-sm font-semibold text-accent mb-1">
              AI Prediction
            </div>
            <p className="text-sm text-primary">
              {insight.prediction}
            </p>
          </div>
        </div>
      </div>

      {/* Signals */}
      {insight.signals.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <Zap size={16} className="text-yellow-500" />
            Market Signals
          </h4>
          <div className="space-y-2">
            {insight.signals.map((signal, idx) => {
              const impactColor = signal.impact === 'bullish' ? 'text-green-600' :
                                 signal.impact === 'bearish' ? 'text-red-600' :
                                 'text-secondary';
              
              const strengthBadge = signal.strength === 'strong' ? 'bg-red-50 text-red-700 dark:text-red-400' :
                                   signal.strength === 'moderate' ? 'bg-yellow-50 text-yellow-700 dark:text-yellow-400' :
                                   'bg-secondary text-gray-700 dark:text-gray-400';

              return (
                <div key={idx} className="flex items-start gap-3 p-3 bg-primary rounded-lg border-card">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${strengthBadge}`}>
                        {signal.strength}
                      </span>
                      <span className={`text-xs font-semibold uppercase ${impactColor}`}>
                        {signal.impact}
                      </span>
                    </div>
                    <p className="text-sm text-primary">
                      {signal.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {/* Volume Analysis */}
        <div className="p-4 bg-primary rounded-lg border-card">
          <div className="text-xs text-secondary mb-2">Volume Trend</div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`text-lg font-bold ${
              insight.volumeAnalysis.trend === 'increasing' ? 'text-green-600' :
              insight.volumeAnalysis.trend === 'decreasing' ? 'text-red-600' :
              'text-secondary'
            }`}>
              {insight.volumeAnalysis.trend === 'increasing' ? '↗' : 
               insight.volumeAnalysis.trend === 'decreasing' ? '↘' : '→'}
              {Math.abs(insight.volumeAnalysis.percentChange24h).toFixed(0)}%
            </div>
          </div>
          <div className="text-xs text-secondary">
            {insight.volumeAnalysis.interpretation}
          </div>
        </div>

        {/* Price Momentum */}
        <div className="p-4 bg-primary rounded-lg border-card">
          <div className="text-xs text-secondary mb-2">Price Momentum</div>
          <div className="flex items-center gap-2 mb-1">
            <div className={`text-lg font-bold ${
              insight.priceMovement.direction === 'up' ? 'text-green-600' :
              insight.priceMovement.direction === 'down' ? 'text-red-600' :
              'text-secondary'
            }`}>
              {insight.priceMovement.direction === 'up' ? '↑' : 
               insight.priceMovement.direction === 'down' ? '↓' : '↔'}
              {Math.abs(insight.priceMovement.momentum).toFixed(0)}
            </div>
          </div>
          <div className="text-xs text-secondary capitalize">
            {insight.priceMovement.volatility} volatility
          </div>
        </div>
      </div>

      {/* Anomalies */}
      {insight.anomalies.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-primary mb-3 flex items-center gap-2">
            <AlertTriangle size={16} className="text-orange-500" />
            Anomalies Detected
          </h4>
          <div className="space-y-2">
            {insight.anomalies.map((anomaly, idx) => {
              const severityColor = anomaly.severity === 'high' ? 'border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20' :
                                   anomaly.severity === 'medium' ? 'border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20' :
                                   'border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800';

              return (
                <div key={idx} className={`p-3 rounded-lg border ${severityColor}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-primary uppercase">
                      {anomaly.type.replace('_', ' ')}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                      anomaly.severity === 'high' ? 'bg-red-200 dark:bg-red-900/50 text-red-800 dark:text-red-300' :
                      anomaly.severity === 'medium' ? 'bg-yellow-200 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-300' :
                      'bg-secondary text-gray-800 dark:text-gray-300'
                    }`}>
                      {anomaly.severity}
                    </span>
                  </div>
                  <p className="text-sm text-primary">
                    {anomaly.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
