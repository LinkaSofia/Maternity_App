import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  date,
  boolean,
  real,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)]
);

// User storage table for Replit Auth
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  fullName: varchar("full_name"),
  phone: varchar("phone"),
  birthDate: varchar("birth_date"),
  city: varchar("city"),
  state: varchar("state"),
  bio: text("bio"),
  emergencyContact: varchar("emergency_contact"),
  emergencyPhone: varchar("emergency_phone"),
  bloodType: varchar("blood_type"),
  allergies: text("allergies"),
  medicalConditions: text("medical_conditions"),
  profileImageUrl: varchar("profile_image_url"),
  profileImageData: text("profile_image_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Pregnancy tracking data
export const pregnancies = pgTable("pregnancies", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  lastMenstrualPeriod: date("last_menstrual_period").notNull(),
  dueDate: date("due_date").notNull(),
  currentWeight: real("current_weight"),
  prePregnancyWeight: real("pre_pregnancy_weight"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Diary entries - Diário da gestante
export const diaryEntries = pgTable("diary_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  date: timestamp("date").notNull(), // Data/hora específica escolhida pela usuária
  title: varchar("title"),
  content: text("content").notNull(), // Relato importante
  mood: varchar("mood"), // Humor do dia
  tags: text("tags").array(),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Weight tracking - Controle de peso
export const weightEntries = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  weight: real("weight").notNull(),
  date: date("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Baby kicks counter - Contador de chutes
export const kickCounters = pgTable("kick_counters", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  date: date("date").notNull(),
  kickCount: integer("kick_count").notNull().default(0),
  timeStarted: timestamp("time_started"),
  timeEnded: timestamp("time_ended"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Shopping list - Lista de compras
export const shoppingItems = pgTable("shopping_items", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  name: varchar("name").notNull(),
  category: varchar("category"), // "baby", "mom", "nursery", etc.
  priority: varchar("priority").default("medium"), // "low", "medium", "high"
  isPurchased: boolean("is_purchased").default(false),
  price: real("price"),
  store: varchar("store"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Belly photos timeline - Fotos da barriga
export const bellyPhotos = pgTable("belly_photos", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  weekNumber: integer("week_number").notNull(),
  photoUrl: varchar("photo_url").notNull(),
  date: date("date").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Exercise tracking - Exercícios para gestantes
export const exercises = pgTable("exercises", {
  id: serial("id").primaryKey(),
  name: varchar("name").notNull(),
  description: text("description"),
  videoUrl: varchar("video_url"),
  duration: integer("duration"), // in minutes
  difficulty: varchar("difficulty"), // "easy", "medium", "hard"
  trimester: varchar("trimester"), // "first", "second", "third", "all"
  category: varchar("category"), // "cardio", "strength", "flexibility", "breathing"
  instructions: text("instructions"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const exerciseLog = pgTable("exercise_log", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
  date: date("date").notNull(),
  duration: integer("duration"), // actual duration in minutes
  notes: text("notes"),
  rating: integer("rating"), // 1-5 scale
  createdAt: timestamp("created_at").defaultNow(),
});

// Healthy recipes - Receitas saudáveis
export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  ingredients: text("ingredients").array(),
  instructions: text("instructions").array(),
  prepTime: integer("prep_time"), // in minutes
  cookTime: integer("cook_time"), // in minutes
  servings: integer("servings"),
  category: varchar("category"), // "breakfast", "lunch", "dinner", "snack"
  nutritionBenefits: text("nutrition_benefits"),
  trimesterRecommended: varchar("trimester_recommended"), // "first", "second", "third", "all"
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const favoriteRecipes = pgTable("favorite_recipes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  recipeId: integer("recipe_id").notNull().references(() => recipes.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Symptoms tracking - Registro de sintomas
export const symptoms = pgTable("symptoms", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  date: date("date").notNull(),
  symptomType: varchar("symptom_type").notNull(), // "nausea", "headache", "back_pain", etc.
  severity: integer("severity").notNull(), // 1-10 scale
  duration: integer("duration"), // in hours
  notes: text("notes"),
  remedies: text("remedies"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medications tracking - Controle de medicamentos
export const medications = pgTable("medications", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  name: varchar("name").notNull(),
  type: varchar("type").notNull(), // "vitamin", "supplement", "medication", "prescription"
  dosage: varchar("dosage"),
  frequency: varchar("frequency"), // "daily", "twice_daily", "weekly", etc.
  startDate: date("start_date"),
  endDate: date("end_date"),
  prescribedBy: varchar("prescribed_by"),
  notes: text("notes"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const medicationLog = pgTable("medication_log", {
  id: serial("id").primaryKey(),
  medicationId: integer("medication_id").notNull().references(() => medications.id),
  takenAt: timestamp("taken_at").notNull(),
  notes: text("notes"),
  skipped: boolean("skipped").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Birth plan - Plano de parto
export const birthPlans = pgTable("birth_plans", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  preferredHospital: varchar("preferred_hospital"),
  preferredDoctor: varchar("preferred_doctor"),
  birthType: varchar("birth_type"), // "natural", "cesarean", "water_birth", etc.
  painManagement: varchar("pain_management"), // "epidural", "natural", "nitrous_oxide", etc.
  laborPreferences: text("labor_preferences").array(),
  birthPreferences: text("birth_preferences").array(),
  emergencyContacts: jsonb("emergency_contacts"),
  specialInstructions: text("special_instructions"),
  musicPlaylist: text("music_playlist").array(),
  birthingTools: text("birthing_tools").array(), // "birthing_ball", "tub", etc.
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Community chat - Chat com outras mães
export const communityPosts = pgTable("community_posts", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  title: varchar("title"),
  content: text("content").notNull(),
  category: varchar("category"), // "general", "first_trimester", "second_trimester", "third_trimester", "tips", "questions"
  isAnonymous: boolean("is_anonymous").default(false),
  likesCount: integer("likes_count").default(0),
  repliesCount: integer("replies_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const communityReplies = pgTable("community_replies", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull().references(() => communityPosts.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  isAnonymous: boolean("is_anonymous").default(false),
  likesCount: integer("likes_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const communityLikes = pgTable("community_likes", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  postId: integer("post_id").references(() => communityPosts.id),
  replyId: integer("reply_id").references(() => communityReplies.id),
  createdAt: timestamp("created_at").defaultNow(),
});

// Medical appointments - Consultas médicas
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  date: timestamp("date").notNull(), // Data/hora da consulta
  time: varchar("time").notNull(), // Horário específico (formato HH:mm)
  type: varchar("type").notNull(), // Tipo: pré-natal, ultrassom, exames, etc
  doctor: varchar("doctor"), // Nome do médico
  location: varchar("location"), // Local da consulta
  notes: text("notes"), // Observações
  isCompleted: boolean("is_completed").default(false), // Se já foi realizada
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Baby development data (static reference data)
export const babyDevelopment = pgTable("baby_development", {
  id: serial("id").primaryKey(),
  week: integer("week").notNull().unique(),
  fruitComparison: varchar("fruit_comparison").notNull(),
  fruitImageUrl: varchar("fruit_image_url"),
  babyImageUrl: varchar("baby_image_url"),
  lengthCm: real("length_cm"),
  weightGrams: real("weight_grams"),
  developmentMilestones: text("development_milestones").array(),
  description: text("description"),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  pregnancies: many(pregnancies),
  diaryEntries: many(diaryEntries),
  appointments: many(appointments),
  weightEntries: many(weightEntries),
  kickCounters: many(kickCounters),
  shoppingItems: many(shoppingItems),
  bellyPhotos: many(bellyPhotos),
  exerciseLog: many(exerciseLog),
  favoriteRecipes: many(favoriteRecipes),
  symptoms: many(symptoms),
  medications: many(medications),
  birthPlans: many(birthPlans),
  communityPosts: many(communityPosts),
  communityReplies: many(communityReplies),
  communityLikes: many(communityLikes),
}));

export const pregnanciesRelations = relations(pregnancies, ({ one, many }) => ({
  user: one(users, {
    fields: [pregnancies.userId],
    references: [users.id],
  }),
  diaryEntries: many(diaryEntries),
  appointments: many(appointments),
  weightEntries: many(weightEntries),
  kickCounters: many(kickCounters),
  shoppingItems: many(shoppingItems),
  bellyPhotos: many(bellyPhotos),
  symptoms: many(symptoms),
  medications: many(medications),
  birthPlans: many(birthPlans),
}));

export const diaryEntriesRelations = relations(diaryEntries, ({ one }) => ({
  user: one(users, {
    fields: [diaryEntries.userId],
    references: [users.id],
  }),
  pregnancy: one(pregnancies, {
    fields: [diaryEntries.pregnancyId],
    references: [pregnancies.id],
  }),
}));

export const appointmentsRelations = relations(appointments, ({ one }) => ({
  user: one(users, {
    fields: [appointments.userId],
    references: [users.id],
  }),
  pregnancy: one(pregnancies, {
    fields: [appointments.pregnancyId],
    references: [pregnancies.id],
  }),
}));

export const weightEntriesRelations = relations(weightEntries, ({ one }) => ({
  user: one(users, {
    fields: [weightEntries.userId],
    references: [users.id],
  }),
  pregnancy: one(pregnancies, {
    fields: [weightEntries.pregnancyId],
    references: [pregnancies.id],
  }),
}));

// Schema types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const insertPregnancySchema = createInsertSchema(pregnancies).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  currentWeight: z.number().optional(),
  prePregnancyWeight: z.number().optional(),
});
export type InsertPregnancy = z.infer<typeof insertPregnancySchema>;
export type Pregnancy = typeof pregnancies.$inferSelect;

// Schema types for all new features
export const insertWeightEntrySchema = createInsertSchema(weightEntries).omit({
  id: true,
  createdAt: true,
});
export type InsertWeightEntry = z.infer<typeof insertWeightEntrySchema>;
export type WeightEntry = typeof weightEntries.$inferSelect;

export const insertKickCounterSchema = createInsertSchema(kickCounters).omit({
  id: true,
  createdAt: true,
});
export type InsertKickCounter = z.infer<typeof insertKickCounterSchema>;
export type KickCounter = typeof kickCounters.$inferSelect;

export const insertShoppingItemSchema = createInsertSchema(shoppingItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertShoppingItem = z.infer<typeof insertShoppingItemSchema>;
export type ShoppingItem = typeof shoppingItems.$inferSelect;

export const insertBellyPhotoSchema = createInsertSchema(bellyPhotos).omit({
  id: true,
  createdAt: true,
});
export type InsertBellyPhoto = z.infer<typeof insertBellyPhotoSchema>;
export type BellyPhoto = typeof bellyPhotos.$inferSelect;

export const insertSymptomSchema = createInsertSchema(symptoms).omit({
  id: true,
  createdAt: true,
});
export type InsertSymptom = z.infer<typeof insertSymptomSchema>;
export type Symptom = typeof symptoms.$inferSelect;

export const insertMedicationSchema = createInsertSchema(medications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertMedication = z.infer<typeof insertMedicationSchema>;
export type Medication = typeof medications.$inferSelect;

export const insertBirthPlanSchema = createInsertSchema(birthPlans).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertBirthPlan = z.infer<typeof insertBirthPlanSchema>;
export type BirthPlan = typeof birthPlans.$inferSelect;

export const insertCommunityPostSchema = createInsertSchema(communityPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  likesCount: true,
  repliesCount: true,
});
export type InsertCommunityPost = z.infer<typeof insertCommunityPostSchema>;
export type CommunityPost = typeof communityPosts.$inferSelect;

export type Exercise = typeof exercises.$inferSelect;
export type Recipe = typeof recipes.$inferSelect;

export const insertDiaryEntrySchema = createInsertSchema(diaryEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  date: z.string().or(z.date()), // Permite string ou Date
});
export type InsertDiaryEntry = z.infer<typeof insertDiaryEntrySchema>;
export type DiaryEntry = typeof diaryEntries.$inferSelect;

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  date: z.string().or(z.date()), // Permite string ou Date
});
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type BabyDevelopment = typeof babyDevelopment.$inferSelect;
