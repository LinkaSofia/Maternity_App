import {
  users,
  pregnancies,
  diaryEntries,
  appointments,
  weightEntries,
  babyDevelopment,
  kickCounters,
  shoppingItems,
  bellyPhotos,
  exercises,
  recipes,
  symptoms,
  medications,
  birthPlans,
  communityPosts,
  communityReplies,
  communityLikes,
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
  updateUser(id: string, userData: Partial<UpsertUser>): Promise<User>;
  
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
  getAllAppointments(userId: string): Promise<Appointment[]>;
  updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment>;
  deleteAppointment(id: number): Promise<void>;
  
  // Weight tracking
  createWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry>;
  getWeightEntries(userId: string): Promise<WeightEntry[]>;
  
  // Baby development
  getBabyDevelopment(week: number): Promise<BabyDevelopment | undefined>;
  getAllBabyDevelopment(): Promise<BabyDevelopment[]>;

  // Kick counter
  createKickCounterSession(session: any): Promise<any>;
  getKickCounterSessions(userId: string): Promise<any[]>;
  
  // Shopping list
  createShoppingListItem(item: any): Promise<any>;
  getShoppingListItems(userId: string): Promise<any[]>;
  updateShoppingListItem(id: number, item: Partial<any>): Promise<any>;
  deleteShoppingListItem(id: number): Promise<void>;
  
  // Belly photos
  createBellyPhoto(photo: any): Promise<any>;
  getBellyPhotos(userId: string): Promise<any[]>;
  deleteBellyPhoto(id: number): Promise<void>;
  
  // Exercise videos
  getAllExerciseVideos(): Promise<any[]>;
  
  // Recipes
  getAllRecipes(): Promise<any[]>;
  
  // Symptoms
  createSymptomEntry(symptom: any): Promise<any>;
  getSymptomEntries(userId: string): Promise<any[]>;
  updateSymptomEntry(id: number, symptom: Partial<any>): Promise<any>;
  deleteSymptomEntry(id: number): Promise<void>;
  
  // Medications
  createMedication(medication: any): Promise<any>;
  getMedications(userId: string): Promise<any[]>;
  updateMedication(id: number, medication: Partial<any>): Promise<any>;
  deleteMedication(id: number): Promise<void>;
  
  // Birth plans
  createBirthPlan(birthPlan: any): Promise<any>;
  getBirthPlan(userId: string): Promise<any | undefined>;
  updateBirthPlan(id: number, birthPlan: Partial<any>): Promise<any>;
  
  // Community
  createCommunityPost(post: any): Promise<any>;
  getCommunityPosts(): Promise<any[]>;
  createCommunityReply(reply: any): Promise<any>;
  getCommunityReplies(): Promise<any[]>;
  createCommunityLike(like: any): Promise<any>;
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

  async updateUser(id: string, userData: Partial<UpsertUser>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...userData, updatedAt: new Date() })
      .where(eq(users.id, id))
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
      .values({
        ...entry,
        date: typeof entry.date === 'string' ? new Date(entry.date) : entry.date,
      })
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
    const updateData: any = { ...entry, updatedAt: new Date() };
    if (entry.date) {
      updateData.date = typeof entry.date === 'string' ? new Date(entry.date) : entry.date;
    }
    const [updated] = await db
      .update(diaryEntries)
      .set(updateData)
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
      .values({
        ...appointment,
        date: typeof appointment.date === 'string' ? new Date(appointment.date) : appointment.date,
      })
      .returning();
    return newAppointment;
  }

  async getUpcomingAppointments(userId: string): Promise<Appointment[]> {
    const now = new Date();
    return await db
      .select()
      .from(appointments)
      .where(and(eq(appointments.userId, userId), eq(appointments.isCompleted, false)))
      .orderBy(appointments.date);
  }

  async getAllAppointments(userId: string): Promise<Appointment[]> {
    return await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))
      .orderBy(desc(appointments.date));
  }

  async updateAppointment(id: number, appointment: Partial<InsertAppointment>): Promise<Appointment> {
    const updateData: any = { ...appointment, updatedAt: new Date() };
    if (appointment.date) {
      updateData.date = typeof appointment.date === 'string' ? new Date(appointment.date) : appointment.date;
    }
    const [updated] = await db
      .update(appointments)
      .set(updateData)
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async deleteAppointment(id: number): Promise<void> {
    await db.delete(appointments).where(eq(appointments.id, id));
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

  // Kick counter operations
  async createKickCounterSession(session: any): Promise<any> {
    const [newSession] = await db
      .insert(kickCounters)
      .values(session)
      .returning();
    return newSession;
  }

  async getKickCounterSessions(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(kickCounters)
      .where(eq(kickCounters.userId, userId))
      .orderBy(desc(kickCounters.date));
  }

  // Shopping list operations
  async createShoppingListItem(item: any): Promise<any> {
    const [newItem] = await db
      .insert(shoppingItems)
      .values(item)
      .returning();
    return newItem;
  }

  async getShoppingListItems(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(shoppingItems)
      .where(eq(shoppingItems.userId, userId))
      .orderBy(desc(shoppingItems.createdAt));
  }

  async updateShoppingListItem(id: number, item: Partial<any>): Promise<any> {
    const [updated] = await db
      .update(shoppingItems)
      .set({ ...item, updatedAt: new Date() })
      .where(eq(shoppingItems.id, id))
      .returning();
    return updated;
  }

  async deleteShoppingListItem(id: number): Promise<void> {
    await db.delete(shoppingItems).where(eq(shoppingItems.id, id));
  }

  // Belly photos operations
  async createBellyPhoto(photo: InsertBellyPhoto): Promise<BellyPhoto> {
    const [newPhoto] = await db
      .insert(bellyPhotos)
      .values({
        ...photo,
        date: typeof photo.date === 'string' ? new Date(photo.date) : photo.date,
      })
      .returning();
    return newPhoto;
  }

  async getBellyPhotos(userId: string): Promise<BellyPhoto[]> {
    return await db
      .select()
      .from(bellyPhotos)
      .where(eq(bellyPhotos.userId, userId))
      .orderBy(desc(bellyPhotos.date));
  }

  async deleteBellyPhoto(id: number): Promise<void> {
    await db.delete(bellyPhotos).where(eq(bellyPhotos.id, id));
  }

  // Exercise videos operations
  async getAllExerciseVideos(): Promise<any[]> {
    return await db
      .select()
      .from(exercises)
      .orderBy(exercises.title);
  }

  // Recipes operations
  async getAllRecipes(): Promise<any[]> {
    return await db
      .select()
      .from(recipes)
      .orderBy(recipes.title);
  }

  // Symptoms operations
  async createSymptomEntry(symptom: any): Promise<any> {
    const [newSymptom] = await db
      .insert(symptoms)
      .values({
        ...symptom,
        date: typeof symptom.date === 'string' ? new Date(symptom.date) : symptom.date,
      })
      .returning();
    return newSymptom;
  }

  async getSymptomEntries(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(symptoms)
      .where(eq(symptoms.userId, userId))
      .orderBy(desc(symptoms.date));
  }

  async updateSymptomEntry(id: number, symptom: Partial<any>): Promise<any> {
    const updateData: any = { ...symptom, updatedAt: new Date() };
    if (symptom.date) {
      updateData.date = typeof symptom.date === 'string' ? new Date(symptom.date) : symptom.date;
    }
    const [updated] = await db
      .update(symptoms)
      .set(updateData)
      .where(eq(symptoms.id, id))
      .returning();
    return updated;
  }

  async deleteSymptomEntry(id: number): Promise<void> {
    await db.delete(symptoms).where(eq(symptoms.id, id));
  }

  // Medications operations
  async createMedication(medication: any): Promise<any> {
    const [newMedication] = await db
      .insert(medications)
      .values(medication)
      .returning();
    return newMedication;
  }

  async getMedications(userId: string): Promise<any[]> {
    return await db
      .select()
      .from(medications)
      .where(eq(medications.userId, userId))
      .orderBy(medications.name);
  }

  async updateMedication(id: number, medication: Partial<any>): Promise<any> {
    const [updated] = await db
      .update(medications)
      .set({ ...medication, updatedAt: new Date() })
      .where(eq(medications.id, id))
      .returning();
    return updated;
  }

  async deleteMedication(id: number): Promise<void> {
    await db.delete(medications).where(eq(medications.id, id));
  }

  // Birth plans operations
  async createBirthPlan(birthPlan: any): Promise<any> {
    const [newBirthPlan] = await db
      .insert(birthPlans)
      .values(birthPlan)
      .returning();
    return newBirthPlan;
  }

  async getBirthPlan(userId: string): Promise<any | undefined> {
    const [birthPlan] = await db
      .select()
      .from(birthPlans)
      .where(eq(birthPlans.userId, userId))
      .orderBy(desc(birthPlans.createdAt));
    return birthPlan;
  }

  async updateBirthPlan(id: number, birthPlan: Partial<any>): Promise<any> {
    const [updated] = await db
      .update(birthPlans)
      .set({ ...birthPlan, updatedAt: new Date() })
      .where(eq(birthPlans.id, id))
      .returning();
    return updated;
  }

  // Community operations
  async createCommunityPost(post: any): Promise<any> {
    const [newPost] = await db
      .insert(communityPosts)
      .values(post)
      .returning();
    return newPost;
  }

  async getCommunityPosts(): Promise<any[]> {
    return await db
      .select()
      .from(communityPosts)
      .orderBy(desc(communityPosts.createdAt));
  }

  async createCommunityReply(reply: any): Promise<any> {
    const [newReply] = await db
      .insert(communityReplies)
      .values(reply)
      .returning();
    return newReply;
  }

  async getCommunityReplies(): Promise<any[]> {
    return await db
      .select()
      .from(communityReplies)
      .orderBy(desc(communityReplies.createdAt));
  }

  async createCommunityLike(like: any): Promise<any> {
    const [newLike] = await db
      .insert(communityLikes)
      .values(like)
      .returning();
    return newLike;
  }
}

export const storage = new DatabaseStorage();
