"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Target,
  Zap,
  ShoppingCart,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Lightbulb,
  ArrowRight
} from "lucide-react";
import { 
  MarketOverview,
  CategoryPerformance, 
  RetailerInsights,
  MarketAnomalies
} from "@/lib/types/analytics";

interface AnalyticsInsightsProps {
  marketOverview: MarketOverview | null;
  categoryPerformance: CategoryPerformance[];
  retailerInsights: RetailerInsights[];
  anomalies: MarketAnomalies | null;
  loading: boolean;
}

export function AnalyticsInsights({ 
  marketOverview, 
  categoryPerformance, 
  retailerInsights, 
  anomalies,
  loading 
}: AnalyticsInsightsProps) {
  
  if (loading) {
    return (
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-48" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!marketOverview || !anomalies) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load market insights</p>
        </CardContent>
      </Card>
    );
  }

  // Calculate insights
  const bestPerformingCategory = categoryPerformance.reduce((best, current) => 
    Math.abs(current.avgPriceChange) > Math.abs(best.avgPriceChange) ? current : best
  );

  const mostCompetitiveRetailer = retailerInsights.reduce((best, current) => 
    current.competitiveRating > best.competitiveRating ? current : best
  );

  const marketTrend = marketOverview.averagePriceChange < 0 ? "bearish" : "bullish";
  const volatilityLevel = marketOverview.marketVolatility > 0.3 ? "high" : marketOverview.marketVolatility > 0.15 ? "medium" : "low";

  const insights = [
    {
      title: "AI Market Prediction",
      type: "prediction",
      icon: Brain,
      content: `Based on current trends, the market is showing ${marketTrend} behavior with ${volatilityLevel} volatility. 
                Prices are ${marketOverview.averagePriceChange < 0 ? 'declining' : 'rising'} at an average rate of 
                ${Math.abs(marketOverview.averagePriceChange).toFixed(1)}% across all categories.`,
      confidence: 92,
      action: "Monitor price patterns for optimal buying opportunities",
      color: "blue"
    },
    {
      title: "Category Opportunity",
      type: "opportunity",
      icon: Target,
      content: `${bestPerformingCategory.categoryName} shows the highest price movement activity with 
                ${Math.abs(bestPerformingCategory.avgPriceChange).toFixed(1)}% average change. 
                This category has ${bestPerformingCategory.priceDrops} price drops vs 
                ${bestPerformingCategory.priceIncreases} increases.`,
      confidence: 88,
      action: `Explore ${bestPerformingCategory.categoryName} for potential deals`,
      color: "green"
    },
    {
      title: "Retailer Intelligence",
      type: "retailer",
      icon: ShoppingCart,
      content: `${mostCompetitiveRetailer.retailerName} leads in competitive pricing with a 
                ${mostCompetitiveRetailer.competitiveRating}/10 rating and 
                ${mostCompetitiveRetailer.marketShare.toFixed(1)}% market share. 
                Their average price change is ${mostCompetitiveRetailer.avgPriceChange.toFixed(1)}%.`,
      confidence: 85,
      action: `Check ${mostCompetitiveRetailer.retailerName} for competitive prices`,
      color: "purple"
    },
    {
      title: "Anomaly Alert",
      type: "alert",
      icon: AlertTriangle,
      content: `${anomalies.totalAnomalies} market anomalies detected with 
                ${anomalies.significantDrops} significant price drops and 
                ${anomalies.significantIncreases} notable increases. 
                ${anomalies.topAnomalyCategory} category shows highest anomaly concentration.`,
      confidence: 95,
      action: "Review anomalies for unusual market opportunities",
      color: "orange"
    }
  ];

  const recommendations = [
    {
      title: "Best Time to Buy",
      description: `Current market conditions suggest ${marketTrend === 'bearish' ? 'favorable' : 'mixed'} buying opportunities`,
      icon: Calendar,
      priority: "high"
    },
    {
      title: "Price Drop Alerts",
      description: `Set alerts for ${bestPerformingCategory.categoryName} - highest activity category`,
      icon: TrendingDown,
      priority: "medium"
    },
    {
      title: "Market Monitoring",
      description: `Track ${mostCompetitiveRetailer.retailerName} for competitive pricing trends`,
      icon: Activity,
      priority: "medium"
    },
    {
      title: "Volatility Watch",
      description: `${volatilityLevel.charAt(0).toUpperCase() + volatilityLevel.slice(1)} volatility detected - ${volatilityLevel === 'high' ? 'expect frequent changes' : 'stable conditions'}`,
      icon: BarChart3,
      priority: volatilityLevel === 'high' ? "high" : "low"
    }
  ];

  const marketHealth = {
    score: Math.round(((marketOverview.totalPriceDrops / (marketOverview.totalPriceDrops + marketOverview.totalPriceIncreases)) * 100)),
    status: marketOverview.averagePriceChange < -2 ? "Excellent" : marketOverview.averagePriceChange < 0 ? "Good" : "Fair",
    description: marketOverview.averagePriceChange < -2 ? "Strong buyer's market" : marketOverview.averagePriceChange < 0 ? "Favorable conditions" : "Mixed conditions"
  };

  return (
    <div className="space-y-6">
      {/* Market Health Score */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <Zap className="h-5 w-5" />
            Market Health Score
            <Badge variant="secondary" className="ml-2">{marketHealth.status}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
              {marketHealth.score}/100
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-blue-700 dark:text-blue-300">
                {marketHealth.description}
              </div>
              <div className="text-xs text-blue-600 dark:text-blue-400">
                Based on price drop ratio
              </div>
            </div>
          </div>
          <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
            <div 
              className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${marketHealth.score}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* AI-Powered Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const IconComponent = insight.icon;
          const colorClasses = {
            blue: "border-blue-200 bg-blue-50/50 dark:bg-blue-900/20 dark:border-blue-800",
            green: "border-green-200 bg-green-50/50 dark:bg-green-900/20 dark:border-green-800",
            purple: "border-purple-200 bg-purple-50/50 dark:bg-purple-900/20 dark:border-purple-800",
            orange: "border-orange-200 bg-orange-50/50 dark:bg-orange-900/20 dark:border-orange-800"
          };

          return (
            <Card key={index} className={colorClasses[insight.color as keyof typeof colorClasses]}>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <IconComponent className="h-5 w-5" />
                    {insight.title}
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insight.confidence}% confidence
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm mb-4 leading-relaxed">
                  {insight.content}
                </p>
                <div className="flex items-center justify-between">
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <ArrowRight className="h-3 w-3" />
                    {insight.action}
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    AI Analysis
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Smart Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-yellow-600" />
            Smart Recommendations
            <Badge variant="secondary" className="ml-2">Personalized</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => {
              const IconComponent = rec.icon;
              const priorityColors = {
                high: "text-red-600 bg-red-100 dark:bg-red-900/20",
                medium: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20",
                low: "text-green-600 bg-green-100 dark:bg-green-900/20"
              };

              return (
                <div key={index} className="flex items-start space-x-3 p-4 rounded-lg border bg-white/50 dark:bg-gray-800/50">
                  <div className={`p-2 rounded-lg ${priorityColors[rec.priority as keyof typeof priorityColors]}`}>
                    <IconComponent className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{rec.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{rec.description}</p>
                    <Badge 
                      variant={rec.priority === 'high' ? 'destructive' : rec.priority === 'medium' ? 'default' : 'secondary'}
                      className="text-xs mt-2"
                    >
                      {rec.priority} priority
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5" />
            Key Market Metrics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {Math.round((marketOverview.totalPriceDrops / marketOverview.totalProducts) * 100000)}%
              </div>
              <div className="text-xs text-muted-foreground">Products with Price Drops</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {categoryPerformance.length}
              </div>
              <div className="text-xs text-muted-foreground">Active Categories</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {retailerInsights.length}
              </div>
              <div className="text-xs text-muted-foreground">Competing Retailers</div>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {anomalies.totalAnomalies}
              </div>
              <div className="text-xs text-muted-foreground">Market Anomalies</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
