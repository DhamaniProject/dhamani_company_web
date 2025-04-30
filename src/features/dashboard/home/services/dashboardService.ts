import api from "../../../../services/api";

interface OverviewResponse {
  status: string;
  data: {
    totalWarranties: number;
    eligibleReturns: number;
    eligibleExchanges: number;
    averageRating: number;
    recentTransactions: {
      product: {
        id: string;
        name: string;
        image: string | null;
        category: string;
      };
      customer: {
        name: string;
        phone: string;
      };
      date: string;
      type: string[];
      status: string;
    }[];
  };
  meta: {
    timestamp: string;
    version: string;
  };
}

interface TransactionChartResponse {
  status: string;
  data: {
    date: string;
    transactionCount: number;
  }[];
  meta: {
    timestamp: string;
    version: string;
  };
}

export const getDashboardOverview = async (): Promise<OverviewResponse> => {
  try {
    const response = await api.get<OverviewResponse>(
      "/api/v1/companies/overview"
    );
    return response.data;
  } catch (error: any) {
    console.error("dashboardService.getDashboardOverview error:", error);
    throw error;
  }
};

export const getTransactionChartData =
  async (): Promise<TransactionChartResponse> => {
    try {
      const response = await api.get<TransactionChartResponse>(
        "/api/v1/companies/transactions-chart"
      );
      return response.data;
    } catch (error: any) {
      console.error("dashboardService.getTransactionChartData error:", error);
      throw error;
    }
  };
