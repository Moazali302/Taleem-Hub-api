import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, In, Repository } from 'typeorm';
import { School } from '../../database/entities/school.entity';
import { User } from '../../database/entities/user.entity';
import { AuditLog } from '../../database/entities/audit-log.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { Expense } from '../../database/entities/expense.entity';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { PackageMonthlyPricePkr } from '../../common/constants/package-pricing.constants';
import { SchoolRoleEnum } from '../../common/constants/auth.constants';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepo: Repository<School>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async getAllSchools() {
    // Owner (name/email/phone) lives on User, not School — same join
    // pattern as SchoolsService.findAll(). Package/status come from
    // Subscription via a second lookup, joined here in JS.
    const schools = await this.schoolRepo.find({
      order: { created_at: 'DESC' },
    });
    const schoolIds = schools.map((s) => s.id);

    const [admins, subscriptions] = await Promise.all([
      this.userRepo.find({
        where: { school: { id: In(schoolIds) }, role: SchoolRoleEnum.ADMIN },
        relations: ['school'],
      }),
      this.subscriptionRepo.find({ where: { school_id: In(schoolIds) } }),
    ]);

    const adminBySchoolId = new Map(
      admins.filter((a) => a.school).map((a) => [a.school!.id, a]),
    );
    const subscriptionBySchoolId = new Map(
      subscriptions.map((s) => [s.school_id, s]),
    );

    return schools.map((school) => ({
      id: school.id,
      school_id: school.school_id,
      school_name: school.school_name,
      school_address: school.school_address,
      status: school.status,
      created_at: school.created_at,
      updated_at: school.updated_at,
      owner_name: adminBySchoolId.get(school.id)?.name ?? '',
      owner_email: adminBySchoolId.get(school.id)?.email ?? '',
      owner_phone: adminBySchoolId.get(school.id)?.phone ?? '',
      package: subscriptionBySchoolId.get(school.id)?.plan ?? null,
      subscription_status: subscriptionBySchoolId.get(school.id)?.status ?? null,
    }));
  }

  async getSchool(id: string) {
    const school = await this.schoolRepo.findOne({ where: { id: +id } });
    if (!school) {
      throw new NotFoundException('School not found');
    }
    const subscription = await this.subscriptionRepo.findOne({
      where: { school_id: school.id },
    });
    return { ...school, subscription: subscription ?? null };
  }

  blockSchool(id: string) {
    return { message: 'Block school', id };
  }

  unblockSchool(id: string) {
    return { message: 'Unblock school', id };
  }

  // Assigns or changes a school's package (Basic / Advanced / Premium).
  // Creates the Subscription row if the school doesn't have one yet.
  async updatePackage(id: string, dto: UpdatePackageDto) {
    const school = await this.schoolRepo.findOne({ where: { id: +id } });
    if (!school) {
      throw new NotFoundException('School not found');
    }

    let subscription = await this.subscriptionRepo.findOne({
      where: { school_id: school.id },
    });

    if (!subscription) {
      subscription = this.subscriptionRepo.create({
        school_id: school.id,
        plan: dto.plan,
        start_date: new Date(),
        status: 'active',
      });
    } else {
      subscription.plan = dto.plan;
    }

    return this.subscriptionRepo.save(subscription);
  }

  async getAuditLogs() {
    return this.auditLogRepo.find({
      order: { timestamp: 'DESC' },
      take: 100,
    });
  }

  // Revenue is derived from each school's active subscription plan price.
  // Expenses are manually entered by the Super Admin (no automated source
  // exists yet). Profit = revenue - expenses.
  async getFinanceSummary(from?: string, to?: string) {
    const activeSubscriptions = await this.subscriptionRepo.find({
      where: { status: 'active' },
    });
    const revenue = activeSubscriptions.reduce(
      (sum, sub) => sum + (PackageMonthlyPricePkr[sub.plan] ?? 0),
      0,
    );

    const expenseWhere =
      from && to ? { expense_date: Between(new Date(from), new Date(to)) } : {};
    const expenses = await this.expenseRepo.find({ where: expenseWhere });
    const totalExpenses = expenses.reduce(
      (sum, expense) => sum + Number(expense.amount),
      0,
    );

    return {
      revenue,
      expenses: totalExpenses,
      profit: revenue - totalExpenses,
      activeSubscriptions: activeSubscriptions.length,
    };
  }

  async addExpense(dto: CreateExpenseDto, createdBy?: number) {
    const expense = this.expenseRepo.create({
      category: dto.category,
      amount: dto.amount,
      note: dto.note ?? null,
      expense_date: new Date(dto.expenseDate),
      school_id: dto.schoolId ?? null,
      created_by: createdBy ?? null,
    });
    return this.expenseRepo.save(expense);
  }

  listExpenses(from?: string, to?: string) {
    const where =
      from && to ? { expense_date: Between(new Date(from), new Date(to)) } : {};
    return this.expenseRepo.find({ where, order: { expense_date: 'DESC' } });
  }
}