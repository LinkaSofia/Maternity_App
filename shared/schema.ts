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
  profileImageUrl: varchar("profile_image_url"),
  phone: varchar("phone"),
  birthDate: varchar("birth_date"),
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

// Diary entries
export const diaryEntries = pgTable("diary_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  title: varchar("title"),
  content: text("content").notNull(),
  mood: varchar("mood"),
  tags: text("tags").array(),
  imageUrl: varchar("image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Medical appointments
export const appointments = pgTable("appointments", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  date: timestamp("date").notNull(),
  type: varchar("type").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Weight tracking
export const weightEntries = pgTable("weight_entries", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull().references(() => users.id),
  pregnancyId: integer("pregnancy_id").references(() => pregnancies.id),
  weight: real("weight").notNull(),
  date: date("date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
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
}));

export const pregnanciesRelations = relations(pregnancies, ({ one, many }) => ({
  user: one(users, {
    fields: [pregnancies.userId],
    references: [users.id],
  }),
  diaryEntries: many(diaryEntries),
  appointments: many(appointments),
  weightEntries: many(weightEntries),
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

export const insertDiaryEntrySchema = createInsertSchema(diaryEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertDiaryEntry = z.infer<typeof insertDiaryEntrySchema>;
export type DiaryEntry = typeof diaryEntries.$inferSelect;

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
});
export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export const insertWeightEntrySchema = createInsertSchema(weightEntries).omit({
  id: true,
  createdAt: true,
});
export type InsertWeightEntry = z.infer<typeof insertWeightEntrySchema>;
export type WeightEntry = typeof weightEntries.$inferSelect;

export type BabyDevelopment = typeof babyDevelopment.$inferSelect;
