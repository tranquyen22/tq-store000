import { Injectable } from '@nestjs/common';
import { prisma } from '@tq-platform/database';

@Injectable()
export class FinancialReportService {
  /**
    1. Báo cáo P&L (GMV, Phí sàn, Chi phí trợ giá, Lợi nhuận ròng)
   */
  async getProfitAndLossReport(startDate?: string, endDate?: string) {
    try {
      const orders = await prisma.order.findMany({
        where: { status: 'DELIVERED' }
      });

      const totalGMV = orders.reduce((sum, o) => sum + Number(o.total), 0);
      const platformCommission = totalGMV * 0.15; // 15% phí sàn mặc định
      const totalVoucherSubsidy = orders.reduce((sum, o) => sum + Number(o.discount), 0);
      const netProfit = platformCommission - totalVoucherSubsidy;

      return {
        success: true,
        period: { startDate: startDate || '2026-08-01', endDate: endDate || '2026-08-31' },
        metrics: {
          gmv: totalGMV,
          platformCommission,
          totalVoucherSubsidy,
          netProfit: Math.max(0, netProfit),
          totalCompletedOrders: orders.length
        }
      };
    } catch (error) {
      console.error('[ERROR][financial-report.service.ts - getProfitAndLossReport]:', error);
      throw error;
    }
  }

  /**
    2. Khấu trừ tự động Thuế GTGT & Thuế TNCN cho Tài xế / Shop theo kỳ kế toán
    - Tài xế: 1.5% tổng thu nhập (1% GTGT + 0.5% TNCN)
    - Shop: 1.0% tổng doanh thu (0.5% GTGT + 0.5% TNCN)
   */
  async calculateTaxObligations(targetType: 'DRIVER' | 'SHOP', targetId: string, grossIncome: number) {
    try {
      let vatRate = 0.01;
      let pitRate = 0.005;

      if (targetType === 'SHOP') {
        vatRate = 0.005;
        pitRate = 0.005;
      }

      const vatAmount = grossIncome * vatRate;
      const pitAmount = grossIncome * pitRate;
      const totalTax = vatAmount + pitAmount;
      const netIncomeAfterTax = grossIncome - totalTax;

      return {
        success: true,
        targetType,
        targetId,
        grossIncome,
        taxBreakdown: {
          vatAmount,
          pitAmount,
          totalTaxWithheld: totalTax,
        },
        netIncomeAfterTax
      };
    } catch (error) {
      console.error('[ERROR][financial-report.service.ts - calculateTaxObligations]:', error);
      throw error;
    }
  }

  /**
    3. Xuất file CSV Báo cáo P&L & Lịch sử Giao dịch
   */
  async exportFinancialReportCSV(): Promise<string> {
    try {
      const transactions = await prisma.walletTransaction.findMany({
        take: 50,
        orderBy: { createdAt: 'desc' }
      });

      let csvContent = 'Mã Giao Dịch,Ví Trừ,Ví Cộng,Số Tiền (VND),Loại Giao Dịch,Ghi Chú,Ngày Tạo\n';
      transactions.forEach(t => {
        csvContent += `"${t.id}","${t.debitWalletId}","${t.creditWalletId}",${t.amount},"${t.type}","${t.description}","${t.createdAt.toISOString()}"\n`;
      });

      return csvContent;
    } catch (error) {
      console.error('[ERROR][financial-report.service.ts - exportFinancialReportCSV]:', error);
      return 'Mã Giao Dịch,Số Tiền,Ngày Tạo\n';
    }
  }
}
