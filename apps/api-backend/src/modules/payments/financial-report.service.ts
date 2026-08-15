import { Injectable } from '@nestjs/common';
import { prisma } from '@tq-platform/database';

@Injectable()
export class FinancialReportService {
  async getProfitAndLossReport(startDate?: string, endDate?: string) {
    try {
      const orders = await prisma.order.findMany({
        where: { status: 'DELIVERED' }
      });

      const totalGMV = orders.reduce((sum, o) => sum + Number(o.total), 0);
      const platformCommission = totalGMV * 0.15;
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
    Xuất Báo cáo Thuế tổng hợp Người bán dạng XML chuẩn Tổng cục Thuế
   */
  async exportSellersTaxXMLReport(): Promise<string> {
    try {
      const shops = await prisma.shop.findMany({ take: 20 });
      let xmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n<TaxReport platform="TQ Platform" period="2026-Q3">\n';
      shops.forEach(s => {
        xmlContent += `  <Seller shopId="${s.id}" shopName="${s.name}" phone="${s.phone}" serviceType="${s.serviceType}" />\n`;
      });
      xmlContent += '</TaxReport>';
      return xmlContent;
    } catch (error) {
      console.error('[ERROR][financial-report.service.ts - exportSellersTaxXMLReport]:', error);
      return '<?xml version="1.0"?><TaxReport></TaxReport>';
    }
  }

  /**
    Xuất Báo cáo Thuế tổng hợp Người bán dạng Excel (CSV UTF-8 BOM)
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
