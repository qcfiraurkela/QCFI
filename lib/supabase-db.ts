/**
 * lib/supabase-db.ts
 * Async data-access layer using Supabase (PostgreSQL).
 * Drop-in replacement for lib/db.ts — same function signatures, but all async.
 *
 * Tables (mirrored from SQLite schema):
 *   hero_images      (id, image_path)
 *   events           (id, name, event_date, title, description, main_image_path)
 *   event_images     (id, event_id → events.id, image_path)
 *   quality_concepts (id, title, description)
 *   concept_images   (id, concept_id → quality_concepts.id, image_path)
 *   quizzes          (id, question, option_a, option_b, option_c, option_d, correct_option)
 *   magazines        (id, title, pdf_path, cover_path)
 *
 * NOTE: SERVER-ONLY — never import in Client Components.
 */

import { supabase } from './supabase';

// ── TypeScript Row Types ────────────────────────────────────────────────────

export interface HeroImageRow {
  id: number;
  image_path: string;
}

export interface EventRow {
  id: number;
  name: string;
  event_date: string;
  title: string;
  description: string;
  main_image_path: string;
}

export interface EventImageRow {
  id: number;
  event_id: number;
  image_path: string;
}

export interface QualityConceptRow {
  id: number;
  title: string;
  description: string;
}

export interface ConceptImageRow {
  id: number;
  concept_id: number;
  image_path: string;
}

export interface QuizRow {
  id: number;
  question: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
}

export interface MagazineRow {
  id: number;
  title: string;
  pdf_path: string;
  cover_path: string;
}

// Composite types returned to the UI
export interface EventWithImages {
  event: EventRow;
  images: EventImageRow[];
}

export interface ConceptWithImages {
  concept: QualityConceptRow;
  images: ConceptImageRow[];
}

// ── Helper ──────────────────────────────────────────────────────────────────
function throwOnError<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(`Supabase error: ${error.message}`);
  return data as T;
}

// ── HERO IMAGES ─────────────────────────────────────────────────────────────

export async function getAllHeroImages(): Promise<HeroImageRow[]> {
  const { data, error } = await supabase
    .from('hero_images')
    .select('*')
    .order('id', { ascending: false });
  return throwOnError(data, error) as HeroImageRow[];
}

export async function insertHeroImage(imagePath: string): Promise<number> {
  const { data, error } = await supabase
    .from('hero_images')
    .insert({ image_path: imagePath })
    .select('id')
    .single();
  return throwOnError(data, error).id;
}

export async function deleteHeroImage(id: number): Promise<void> {
  const { error } = await supabase.from('hero_images').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── EVENTS ──────────────────────────────────────────────────────────────────

export async function getAllEvents(): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });
  return throwOnError(data, error) as EventRow[];
}

export async function getRecentEvents(limit = 5): Promise<EventRow[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false })
    .limit(limit);
  return throwOnError(data, error) as EventRow[];
}

export async function getEventImages(eventId: number): Promise<EventImageRow[]> {
  const { data, error } = await supabase
    .from('event_images')
    .select('*')
    .eq('event_id', eventId);
  return throwOnError(data, error) as EventImageRow[];
}

export async function getAllEventsWithImages(): Promise<EventWithImages[]> {
  const events = await getAllEvents();
  const result: EventWithImages[] = await Promise.all(
    events.map(async (event) => ({
      event,
      images: await getEventImages(event.id),
    }))
  );
  return result;
}

export async function insertEvent(
  name: string,
  eventDate: string,
  title: string,
  description: string,
  mainImagePath: string
): Promise<number> {
  const { data, error } = await supabase
    .from('events')
    .insert({ name, event_date: eventDate, title, description, main_image_path: mainImagePath })
    .select('id')
    .single();
  return throwOnError(data, error).id;
}

export async function insertEventImage(eventId: number, imagePath: string): Promise<void> {
  const { error } = await supabase
    .from('event_images')
    .insert({ event_id: eventId, image_path: imagePath });
  if (error) throw new Error(error.message);
}

export async function deleteEvent(id: number): Promise<void> {
  // event_images are deleted by ON DELETE CASCADE in Supabase schema
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── QUALITY CONCEPTS ────────────────────────────────────────────────────────

export async function getAllConcepts(): Promise<QualityConceptRow[]> {
  const { data, error } = await supabase.from('quality_concepts').select('*');
  return throwOnError(data, error) as QualityConceptRow[];
}

export async function getConceptImages(conceptId: number): Promise<ConceptImageRow[]> {
  const { data, error } = await supabase
    .from('concept_images')
    .select('*')
    .eq('concept_id', conceptId);
  return throwOnError(data, error) as ConceptImageRow[];
}

export async function getAllConceptsWithImages(): Promise<ConceptWithImages[]> {
  const concepts = await getAllConcepts();
  const result: ConceptWithImages[] = await Promise.all(
    concepts.map(async (concept) => ({
      concept,
      images: await getConceptImages(concept.id),
    }))
  );
  return result;
}

export async function insertConcept(title: string, description: string): Promise<number> {
  const { data, error } = await supabase
    .from('quality_concepts')
    .insert({ title, description })
    .select('id')
    .single();
  return throwOnError(data, error).id;
}

export async function insertConceptImage(conceptId: number, imagePath: string): Promise<void> {
  const { error } = await supabase
    .from('concept_images')
    .insert({ concept_id: conceptId, image_path: imagePath });
  if (error) throw new Error(error.message);
}

export async function deleteConcept(id: number): Promise<void> {
  // concept_images are deleted by ON DELETE CASCADE in Supabase schema
  const { error } = await supabase.from('quality_concepts').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── QUIZZES ─────────────────────────────────────────────────────────────────

export async function getAllQuizzes(): Promise<QuizRow[]> {
  const { data, error } = await supabase.from('quizzes').select('*');
  return throwOnError(data, error) as QuizRow[];
}

export async function insertQuiz(
  question: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  correctOption: string
): Promise<number> {
  const { data, error } = await supabase
    .from('quizzes')
    .insert({
      question,
      option_a: optionA,
      option_b: optionB,
      option_c: optionC,
      option_d: optionD,
      correct_option: correctOption,
    })
    .select('id')
    .single();
  return throwOnError(data, error).id;
}

export async function deleteQuiz(id: number): Promise<void> {
  const { error } = await supabase.from('quizzes').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

// ── MAGAZINES ───────────────────────────────────────────────────────────────

export async function getAllMagazines(): Promise<MagazineRow[]> {
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .order('id', { ascending: false });
  return throwOnError(data, error) as MagazineRow[];
}

export async function getRecentMagazines(limit = 4): Promise<MagazineRow[]> {
  const { data, error } = await supabase
    .from('magazines')
    .select('*')
    .order('id', { ascending: false })
    .limit(limit);
  return throwOnError(data, error) as MagazineRow[];
}

export async function insertMagazine(
  title: string,
  pdfPath: string,
  coverPath: string
): Promise<number> {
  const { data, error } = await supabase
    .from('magazines')
    .insert({ title, pdf_path: pdfPath, cover_path: coverPath })
    .select('id')
    .single();
  return throwOnError(data, error).id;
}

export async function deleteMagazine(id: number): Promise<void> {
  const { error } = await supabase.from('magazines').delete().eq('id', id);
  if (error) throw new Error(error.message);
}
