import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertPregnancySchema, insertDiaryEntrySchema, insertAppointmentSchema, insertWeightEntrySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Pregnancy routes
  app.post('/api/pregnancies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pregnancyData = insertPregnancySchema.parse({ ...req.body, userId });
      const pregnancy = await storage.createPregnancy(pregnancyData);
      res.json(pregnancy);
    } catch (error) {
      console.error("Error creating pregnancy:", error);
      res.status(400).json({ message: "Failed to create pregnancy" });
    }
  });

  app.get('/api/pregnancies/active', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const pregnancy = await storage.getActivePregnancy(userId);
      res.json(pregnancy);
    } catch (error) {
      console.error("Error fetching active pregnancy:", error);
      res.status(500).json({ message: "Failed to fetch pregnancy" });
    }
  });

  app.put('/api/pregnancies/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const pregnancy = await storage.updatePregnancy(id, updates);
      res.json(pregnancy);
    } catch (error) {
      console.error("Error updating pregnancy:", error);
      res.status(400).json({ message: "Failed to update pregnancy" });
    }
  });

  // Diary routes
  app.post('/api/diary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entryData = insertDiaryEntrySchema.parse({ ...req.body, userId });
      const entry = await storage.createDiaryEntry(entryData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating diary entry:", error);
      res.status(400).json({ message: "Failed to create diary entry" });
    }
  });

  app.get('/api/diary', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
      const entries = await storage.getDiaryEntries(userId, limit);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching diary entries:", error);
      res.status(500).json({ message: "Failed to fetch diary entries" });
    }
  });

  app.get('/api/diary/search', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Query parameter is required" });
      }
      const entries = await storage.searchDiaryEntries(userId, query);
      res.json(entries);
    } catch (error) {
      console.error("Error searching diary entries:", error);
      res.status(500).json({ message: "Failed to search diary entries" });
    }
  });

  app.put('/api/diary/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const entry = await storage.updateDiaryEntry(id, updates);
      res.json(entry);
    } catch (error) {
      console.error("Error updating diary entry:", error);
      res.status(400).json({ message: "Failed to update diary entry" });
    }
  });

  app.delete('/api/diary/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteDiaryEntry(id);
      res.json({ message: "Diary entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting diary entry:", error);
      res.status(500).json({ message: "Failed to delete diary entry" });
    }
  });

  // Appointment routes
  app.post('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointmentData = insertAppointmentSchema.parse({ ...req.body, userId });
      const appointment = await storage.createAppointment(appointmentData);
      res.json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  app.get('/api/appointments/upcoming', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointments = await storage.getUpcomingAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  // Weight tracking routes
  app.post('/api/weight', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const weightData = insertWeightEntrySchema.parse({ ...req.body, userId });
      const entry = await storage.createWeightEntry(weightData);
      res.json(entry);
    } catch (error) {
      console.error("Error creating weight entry:", error);
      res.status(400).json({ message: "Failed to create weight entry" });
    }
  });

  app.get('/api/weight', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const entries = await storage.getWeightEntries(userId);
      res.json(entries);
    } catch (error) {
      console.error("Error fetching weight entries:", error);
      res.status(500).json({ message: "Failed to fetch weight entries" });
    }
  });

  // Baby development routes
  app.get('/api/baby-development/:week', async (req, res) => {
    try {
      const week = parseInt(req.params.week);
      const development = await storage.getBabyDevelopment(week);
      res.json(development);
    } catch (error) {
      console.error("Error fetching baby development:", error);
      res.status(500).json({ message: "Failed to fetch baby development" });
    }
  });

  app.get('/api/baby-development', async (req, res) => {
    try {
      const development = await storage.getAllBabyDevelopment();
      res.json(development);
    } catch (error) {
      console.error("Error fetching baby development:", error);
      res.status(500).json({ message: "Failed to fetch baby development" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
