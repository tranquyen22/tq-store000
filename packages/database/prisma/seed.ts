import { PrismaClient } from '@prisma/client';
import { UserRole, ShopServiceType, DriverServiceType, WalletType } from '@tq-platform/types';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting TQ Platform Database Seeding...');

  // 1. System Configurations
  await prisma.systemConfiguration.upsert({
    where: { key: 'PLATFORM_COMMISSION_RATE' },
    update: { value: '15' },
    create: { key: 'PLATFORM_COMMISSION_RATE', value: '15', description: 'Phí sàn mặc định 15%' }
  });

  await prisma.systemConfiguration.upsert({
    where: { key: 'XU_CASHBACK_RATE' },
    update: { value: '5' },
    create: { key: 'XU_CASHBACK_RATE', value: '5', description: 'Tỷ lệ hoàn TQ Xu 5%' }
  });

  await prisma.systemConfiguration.upsert({
    where: { key: 'MAINTENANCE_MODE' },
    update: { value: 'false' },
    create: { key: 'MAINTENANCE_MODE', value: 'false', description: 'Trạng thái bảo trì Disabled' }
  });

  // 2. Super Admin User
  const admin = await prisma.user.upsert({
    where: { phone: '0901000001' },
    update: {},
    create: {
      phone: '0901000001',
      email: 'admin@tqstore.vn',
      fullName: 'Super Admin Trần Văn Quyền',
      role: UserRole.SUPER_ADMIN,
      isPhoneVerified: true
    }
  });

  // 3. CSKH Staff User
  const staff = await prisma.user.upsert({
    where: { phone: '0901000002' },
    update: {},
    create: {
      phone: '0901000002',
      email: 'cskh@tqstore.vn',
      fullName: 'Nhân viên CSKH Đỗ Thị Mai',
      role: UserRole.EMPLOYEE,
      isPhoneVerified: true
    }
  });

  await prisma.staffPermission.createMany({
    data: [
      { userId: staff.id, permissionKey: 'RESOLVE_DISPUTE' },
      { userId: staff.id, permissionKey: 'APPROVE_KYC' },
      { userId: staff.id, permissionKey: 'APPROVE_SHOP' },
    ],
    skipDuplicates: true
  });

  // 4. Shop Owners & Shops
  const shopOwner = await prisma.user.upsert({
    where: { phone: '0901000003' },
    update: {},
    create: {
      phone: '0901000003',
      email: 'shop_fb@tqstore.vn',
      fullName: 'Chủ Shop F&B Lê Văn B',
      role: UserRole.SHOP_OWNER,
      isPhoneVerified: true
    }
  });

  const rentalShop = await prisma.shop.create({
    data: {
      ownerId: shopOwner.id,
      name: 'TQ Luxury Rental & Bridal',
      serviceType: ShopServiceType.RENTAL,
      address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
      isOpen: true
    }
  });

  // 5. Products & Rental Items
  const category = await prisma.category.create({
    data: { name: 'Cho Thuê Trang Phục Trực Tuyến', icon: 'shirt' }
  });

  await prisma.product.create({
    data: {
      shopId: rentalShop.id,
      categoryId: category.id,
      name: 'Áo Dài Cưới Hoàng Gia Luxury',
      price: 450000,
      depositPrice: 1000000, // Cọc 1.000.000 VND
      isRental: true,
      stock: 10
    }
  });

  await prisma.product.create({
    data: {
      shopId: rentalShop.id,
      categoryId: category.id,
      name: 'Váy Cưới Satin Đính Kim Tuyến',
      price: 650000,
      depositPrice: 1000000, // Cọc 1.000.000 VND
      isRental: true,
      stock: 5
    }
  });

  // 6. Drivers & Dual Wallets
  const driverUser = await prisma.user.upsert({
    where: { phone: '0901000004' },
    update: {},
    create: {
      phone: '0901000004',
      email: 'driver_taxi@tqstore.vn',
      fullName: 'Tài xế Nguyễn Văn Hùng',
      role: UserRole.DRIVER,
      isPhoneVerified: true
    }
  });

  await prisma.driver.create({
    data: {
      userId: driverUser.id,
      serviceType: DriverServiceType.TAXI_4S,
      vehiclePlate: '51H-888.99',
      isOnline: true,
      isApproved: true
    }
  });

  const driverDepositWallet = await prisma.wallet.create({
    data: { userId: driverUser.id, walletType: WalletType.DRIVER_DEPOSIT_WALLET, balance: 2000000 }
  });

  // 7. Customer User & Wallets
  const customer = await prisma.user.upsert({
    where: { phone: '0901000005' },
    update: {},
    create: {
      phone: '0901000005',
      email: 'customer@tqstore.vn',
      fullName: 'Khách Hàng Trần Văn C',
      role: UserRole.CUSTOMER,
      isPhoneVerified: true
    }
  });

  await prisma.wallet.create({
    data: { userId: customer.id, walletType: WalletType.CUSTOMER_WALLET, balance: 1000000 }
  });

  await prisma.xuLog.create({
    data: { userId: customer.id, amount: 5000, balance: 5000, description: 'Khởi tạo TQ Xu khuyến mãi' }
  });

  console.log('✅ TQ Platform Database Seeded Successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
