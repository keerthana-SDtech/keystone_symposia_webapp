import { z } from "zod";

// Step 1: Concept Overview
export const conceptOverviewSchema = z.object({
  conferenceTitle: z.string().min(3, "Conference title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  institute: z.string().min(1, "Please select an institute"),
  scientificCategory: z.string().min(1, "Please select a scientific category"),
});

// Step 2: Organizer Details
export const organizerDetailsSchema = z.object({
  organizerName: z.string().min(2, "Organizer name must be at least 2 characters"),
  organizerEmail: z.string().email("Please enter a valid email address"),
  organizerInstitute: z.string().min(1, "Please select an institute"),
  coOrganizerName: z.string().optional(),
  coOrganizerEmail: z.string().optional(),
});

// Step 3: Conference Rationale
export const conferenceRationaleSchema = z.object({
  relevanceOfTopic: z.string().min(1, "Please select a relevance rating"),
  scientificQuality: z.string().min(20, "Please provide at least 20 characters"),
  topicDistinctness: z.string().min(20, "Please provide at least 20 characters"),
  organizerExpertise: z.string().min(1, "Please select an expertise rating"),
  generalComments: z.string().optional(),
});

// Combined full schema for type inference
export const submitReviewSchema = conceptOverviewSchema
  .merge(organizerDetailsSchema)
  .merge(conferenceRationaleSchema);

export type ConceptOverviewValues = z.infer<typeof conceptOverviewSchema>;
export type OrganizerDetailsValues = z.infer<typeof organizerDetailsSchema>;
export type ConferenceRationaleValues = z.infer<typeof conferenceRationaleSchema>;
export type SubmitReviewValues = z.infer<typeof submitReviewSchema>;
