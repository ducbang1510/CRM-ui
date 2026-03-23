export interface RevenueTrend {
  period: string;
  orderCount: number;
  revenue: number;
}

export interface PipelineSummary {
  status: string;
  orderCount: number;
  totalRevenue: number;
}

export interface TopUser {
  userName: string;
  orderCount: number;
  totalRevenue: number;
}
