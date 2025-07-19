import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { 
  insertPregnancySchema, 
  insertDiaryEntrySchema, 
  insertAppointmentSchema, 
  insertWeightEntrySchema
} from "@shared/schema";
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

  app.put('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { firstName, lastName, fullName, phone, birthDate, profileImageData } = req.body;
      
      const updatedUser = await storage.updateUser(userId, {
        firstName,
        lastName,
        fullName,
        phone,
        birthDate,
        profileImageData,
      });
      
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(400).json({ message: "Failed to update user" });
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

  app.get('/api/appointments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const appointments = await storage.getAllAppointments(userId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching all appointments:", error);
      res.status(500).json({ message: "Failed to fetch appointments" });
    }
  });

  app.put('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const appointment = await storage.updateAppointment(id, updates);
      res.json(appointment);
    } catch (error) {
      console.error("Error updating appointment:", error);
      res.status(400).json({ message: "Failed to update appointment" });
    }
  });

  app.delete('/api/appointments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteAppointment(id);
      res.json({ message: "Appointment deleted successfully" });
    } catch (error) {
      console.error("Error deleting appointment:", error);
      res.status(500).json({ message: "Failed to delete appointment" });
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

  // Kick counter routes
  app.post('/api/kick-counter', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessionData = { ...req.body, userId };
      const session = await storage.createKickCounterSession(sessionData);
      res.json(session);
    } catch (error) {
      console.error("Error creating kick counter session:", error);
      res.status(400).json({ message: "Failed to create kick counter session" });
    }
  });

  app.get('/api/kick-counter', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const sessions = await storage.getKickCounterSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching kick counter sessions:", error);
      res.status(500).json({ message: "Failed to fetch kick counter sessions" });
    }
  });

  // Shopping list routes
  app.post('/api/shopping-list', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const itemData = { ...req.body, userId };
      const item = await storage.createShoppingListItem(itemData);
      res.json(item);
    } catch (error) {
      console.error("Error creating shopping list item:", error);
      res.status(400).json({ message: "Failed to create shopping list item" });
    }
  });

  app.get('/api/shopping-list', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const items = await storage.getShoppingListItems(userId);
      res.json(items);
    } catch (error) {
      console.error("Error fetching shopping list items:", error);
      res.status(500).json({ message: "Failed to fetch shopping list items" });
    }
  });

  app.put('/api/shopping-list/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const item = await storage.updateShoppingListItem(id, updates);
      res.json(item);
    } catch (error) {
      console.error("Error updating shopping list item:", error);
      res.status(400).json({ message: "Failed to update shopping list item" });
    }
  });

  app.delete('/api/shopping-list/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteShoppingListItem(id);
      res.json({ message: "Shopping list item deleted successfully" });
    } catch (error) {
      console.error("Error deleting shopping list item:", error);
      res.status(500).json({ message: "Failed to delete shopping list item" });
    }
  });

  // Belly photos routes
  app.post('/api/belly-photos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const photoData = { ...req.body, userId };
      const photo = await storage.createBellyPhoto(photoData);
      res.json(photo);
    } catch (error) {
      console.error("Error creating belly photo:", error);
      res.status(400).json({ message: "Failed to create belly photo" });
    }
  });

  app.get('/api/belly-photos', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const photos = await storage.getBellyPhotos(userId);
      res.json(photos);
    } catch (error) {
      console.error("Error fetching belly photos:", error);
      res.status(500).json({ message: "Failed to fetch belly photos" });
    }
  });

  app.delete('/api/belly-photos/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBellyPhoto(id);
      res.json({ message: "Belly photo deleted successfully" });
    } catch (error) {
      console.error("Error deleting belly photo:", error);
      res.status(500).json({ message: "Failed to delete belly photo" });
    }
  });

  // Exercise videos routes
  app.get('/api/exercise-videos', async (req, res) => {
    try {
      const videos = await storage.getAllExerciseVideos();
      res.json(videos);
    } catch (error) {
      console.error("Error fetching exercise videos:", error);
      res.status(500).json({ message: "Failed to fetch exercise videos" });
    }
  });

  // Recipes routes
  app.get('/api/recipes', async (req, res) => {
    try {
      const recipes = await storage.getAllRecipes();
      res.json(recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Symptoms routes
  app.post('/api/symptoms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const symptomData = { ...req.body, userId };
      const symptom = await storage.createSymptomEntry(symptomData);
      res.json(symptom);
    } catch (error) {
      console.error("Error creating symptom entry:", error);
      res.status(400).json({ message: "Failed to create symptom entry" });
    }
  });

  app.get('/api/symptoms', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const symptoms = await storage.getSymptomEntries(userId);
      res.json(symptoms);
    } catch (error) {
      console.error("Error fetching symptom entries:", error);
      res.status(500).json({ message: "Failed to fetch symptom entries" });
    }
  });

  app.put('/api/symptoms/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const symptom = await storage.updateSymptomEntry(id, updates);
      res.json(symptom);
    } catch (error) {
      console.error("Error updating symptom entry:", error);
      res.status(400).json({ message: "Failed to update symptom entry" });
    }
  });

  app.delete('/api/symptoms/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteSymptomEntry(id);
      res.json({ message: "Symptom entry deleted successfully" });
    } catch (error) {
      console.error("Error deleting symptom entry:", error);
      res.status(500).json({ message: "Failed to delete symptom entry" });
    }
  });

  // Medications routes
  app.post('/api/medications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const medicationData = { ...req.body, userId };
      const medication = await storage.createMedication(medicationData);
      res.json(medication);
    } catch (error) {
      console.error("Error creating medication:", error);
      res.status(400).json({ message: "Failed to create medication" });
    }
  });

  app.get('/api/medications', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const medications = await storage.getMedications(userId);
      res.json(medications);
    } catch (error) {
      console.error("Error fetching medications:", error);
      res.status(500).json({ message: "Failed to fetch medications" });
    }
  });

  app.put('/api/medications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const medication = await storage.updateMedication(id, updates);
      res.json(medication);
    } catch (error) {
      console.error("Error updating medication:", error);
      res.status(400).json({ message: "Failed to update medication" });
    }
  });

  app.delete('/api/medications/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMedication(id);
      res.json({ message: "Medication deleted successfully" });
    } catch (error) {
      console.error("Error deleting medication:", error);
      res.status(500).json({ message: "Failed to delete medication" });
    }
  });

  // Birth plan routes
  app.post('/api/birth-plan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const birthPlanData = { ...req.body, userId };
      const birthPlan = await storage.createBirthPlan(birthPlanData);
      res.json(birthPlan);
    } catch (error) {
      console.error("Error creating birth plan:", error);
      res.status(400).json({ message: "Failed to create birth plan" });
    }
  });

  app.get('/api/birth-plan', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const birthPlan = await storage.getBirthPlan(userId);
      res.json(birthPlan);
    } catch (error) {
      console.error("Error fetching birth plan:", error);
      res.status(500).json({ message: "Failed to fetch birth plan" });
    }
  });

  app.put('/api/birth-plan/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const birthPlan = await storage.updateBirthPlan(id, updates);
      res.json(birthPlan);
    } catch (error) {
      console.error("Error updating birth plan:", error);
      res.status(400).json({ message: "Failed to update birth plan" });
    }
  });

  // Community routes
  app.post('/api/community-posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const postData = { ...req.body, userId };
      const post = await storage.createCommunityPost(postData);
      res.json(post);
    } catch (error) {
      console.error("Error creating community post:", error);
      res.status(400).json({ message: "Failed to create community post" });
    }
  });

  app.get('/api/community-posts', async (req, res) => {
    try {
      const posts = await storage.getCommunityPosts();
      res.json(posts);
    } catch (error) {
      console.error("Error fetching community posts:", error);
      res.status(500).json({ message: "Failed to fetch community posts" });
    }
  });

  app.post('/api/community-replies', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const replyData = { ...req.body, userId };
      const reply = await storage.createCommunityReply(replyData);
      res.json(reply);
    } catch (error) {
      console.error("Error creating community reply:", error);
      res.status(400).json({ message: "Failed to create community reply" });
    }
  });

  app.get('/api/community-replies', async (req, res) => {
    try {
      const replies = await storage.getCommunityReplies();
      res.json(replies);
    } catch (error) {
      console.error("Error fetching community replies:", error);
      res.status(500).json({ message: "Failed to fetch community replies" });
    }
  });

  app.post('/api/community-likes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const likeData = { ...req.body, userId };
      const like = await storage.createCommunityLike(likeData);
      res.json(like);
    } catch (error) {
      console.error("Error creating community like:", error);
      res.status(400).json({ message: "Failed to create community like" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
