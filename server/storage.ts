import {
  users,
  pregnancies,
  diaryEntries,
  appointments,
  weightEntries,
  babyDevelopment,
  type User,
  type UpsertUser,
  type Pregnancy,
  type InsertPregnancy,
  type DiaryEntry,
  type InsertDiaryEntry,
  type Appointment,
  type InsertAppointment,
  type WeightEntry,
  type InsertWeightEntry,
  type BabyDevelopment,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Pregnancy operations
  createPregnancy(pregnancy: InsertPregnancy): Promise<Pregnancy>;
  getActivePregnancy(userId: string): Promise<Pregnancy | undefined>;
  updatePregnancy(id: number, pregnancy: Partial<InsertPregnancy>): Promise<Pregnancy>;
  
  // Diary operations
  createDiaryEntry(entry: InsertDiaryEntry): Promise<DiaryEntry>;
  getDiaryEntries(userId: string, limit?: number): Promise<DiaryEntry[]>;
  searchDiaryEntries(userId: string, query: string): Promise<DiaryEntry[]>;
  updateDiaryEntry(id: number, entry: Partial<InsertDiaryEntry>): Promise<DiaryEntry>;
  deleteDiaryEntry(id: number): Promise<void>;
  
  // Appointment operations
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  getUpcomingAppointments(userId: string): Promise<Appointment[]>;
  
  // Weight tracking
  createWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry>;
  getWeightEntries(userId: string): Promise<WeightEntry[]>;
  
  // Baby development
  getBabyDevelopment(week: number): Promise<BabyDevelopment | undefined>;
  getAllBabyDevelopment(): Promise<BabyDevelopment[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Pregnancy operations
  async createPregnancy(pregnancy: InsertPregnancy): Promise<Pregnancy> {
    const [newPregnancy] = await db
      .insert(pregnancies)
      .values(pregnancy)
      .returning();
    return newPregnancy;
  }

  async getActivePregnancy(userId: string): Promise<Pregnancy | undefined> {
    const [pregnancy] = await db
      .select()
      .from(pregnancies)
      .where(and(eq(pregnancies.userId, userId), eq(pregnancies.isActive, true)))
      .orderBy(desc(pregnancies.createdAt));
    return pregnancy;
  }

  async updatePregnancy(id: number, pregnancy: Partial<InsertPregnancy>): Promise<Pregnancy> {
    const [updated] = await db
      .update(pregnancies)
      .set({ ...pregnancy, updatedAt: new Date() })
      .where(eq(pregnancies.id, id))
      .returning();
    return updated;
  }

  // Diary operations
  async createDiaryEntry(entry: InsertDiaryEntry): Promise<DiaryEntry> {
    const [newEntry] = await db
      .insert(diaryEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getDiaryEntries(userId: string, limit = 50): Promise<DiaryEntry[]> {
    return await db
      .select()
      .from(diaryEntries)
      .where(eq(diaryEntries.userId, userId))
      .orderBy(desc(diaryEntries.createdAt))
      .limit(limit);
  }

  async searchDiaryEntries(userId: string, query: string): Promise<DiaryEntry[]> {
    return await db
      .select()
      .from(diaryEntries)
      .where(
        and(
          eq(diaryEntries.userId, userId),
          or(
            ilike(diaryEntries.title, `%${query}%`),
            ilike(diaryEntries.content, `%${query}%`)
          )
        )
      )
      .orderBy(desc(diaryEntries.createdAt));
  }

  async updateDiaryEntry(id: number, entry: Partial<InsertDiaryEntry>): Promise<DiaryEntry> {
    const [updated] = await db
      .update(diaryEntries)
      .set({ ...entry, updatedAt: new Date() })
      .where(eq(diaryEntries.id, id))
      .returning();
    return updated;
  }

  async deleteDiaryEntry(id: number): Promise<void> {
    await db.delete(diaryEntries).where(eq(diaryEntries.id, id));
  }

  // Appointment operations
  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [newAppointment] = await db
      .insert(appointments)
      .values(appointment)
      .returning();
    return newAppointment;
  }

  async getUpcomingAppointments(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.userId, userId), eq(appointments.date, new Date())))
      .orderBy(appointments.date);
  }

  // Weight tracking
  async createWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry> {
    const [newEntry] = await db
      .insert(weightEntries)
      .values(entry)
      .returning();
    return newEntry;
  }

  async getWeightEntries(userId: string): Promise<WeightEntry[]> {
    return await db
      .select()
      .from(weightEntries)
      .where(eq(weightEntries.userId, userId))
      .orderBy(desc(weightEntries.date));
  }

  // Baby development
  async getBabyDevelopment(week: number): Promise<BabyDevelopment | undefined> {
    const [development] = await db
      .select()
      .from(babyDevelopment)
      .where(eq(babyDevelopment.week, week));
    return development;
  }

  async getAllBabyDevelopment(): Promise<BabyDevelopment[]> {
    return await db
      .select()
      .from(babyDevelopment)
      .orderBy(babyDevelopment.week);
  }
}

export const storage = new DatabaseStorage();
