import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { School } from '../../database/entities/school.entity';
import { AuditLog } from '../../database/entities/audit-log.entity';
import { Subscription } from '../../database/entities/subscription.entity';
import { Expense } from '../../database/entities/expense.entity';
import { UpdatePackageDto } from './dto/update-package.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { PackageMonthlyPricePkr } from '../../common/constants/package-pricing.constants';

@Injectable()
export class SuperAdminService {
  constructor(
    @InjectRepository(School)
    private readonly schoolRepo: Repository<School>,
    @InjectRepository(AuditLog)
    private readonly auditLogRepo: Repository<AuditLog>,
    @InjectRepository(Subscription)
    private readonly subscriptionRepo: Repository<Subscription>,
    @InjectRepository(Expense)
    private readonly expenseRepo: Repository<Expense>,
  ) {}

  async getAllSchools() {
    // Single query with a join instead of 2 separate round trips
    // (School list + Subscription list, joined in JS) — halves the
    // number of DB round trips this endpoint needs.
    const rows = await this.schoolRepo
      .createQueryBuilder('school')
      .leftJoin(Subscription, 'subscription', 'subscription.school_id = school.id')
      .addSelect(['subscription.plan', 'subscription.status'])
      .orderBy('school.created_at', 'DESC')
      .getRawAndEntities();

    return rows.entities.map((school, i) => ({
      id: school.id,
      schoolId: school.school_id,
      schoolName: school.school_name,
      ownerName: school.owner_name,
      email: school.email,
      status: school.status,
      createdAt: school.created_at,
      package: rows.raw[i]?.subscription_plan ?? null,
      subscriptionStatus: rows.raw[i]?.subscription_status ?? null,
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