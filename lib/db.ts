/**
 * lib/db.ts
 * SQLite database singleton using better-sqlite3.
 * Mirrors EXACTLY the schema from qcfi_database.db.
 *
 * Tables:
 *   hero_images     (id, image_path)
 *   events          (id, name, event_date, title, description, main_image_path)
 *   event_images    (id, event_id → events.id, image_path)
 *   quality_concepts (id, title, description)
 *   concept_images  (id, concept_id → quality_concepts.id, image_path)
 *   quizzes         (id, question, option_a, option_b, option_c, option_d, correct_option)
 *   magazines       (id, title, pdf_path, cover_path)
 *
 * NOTE: This module is SERVER-ONLY.  Never import it in a Client Component.
 */

import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// ── Database file path ──────────────────────────────────────────────────────
// We keep it beside the original qcfi_database.db so data can be shared/seeded.
// Falls back to project root when run outside the workspace.
const DB_PATH =
  process.env.DB_PATH ||
  path.join(process.cwd(), 'qcfi_database.db');

// ── Singleton ───────────────────────────────────────────────────────────────
let _db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (_db) return _db;

  _db = new Database(DB_PATH, {
    // verbose: process.env.NODE_ENV === 'development' ? console.log : undefined,
  });

  // WAL mode for better concurrency with Next.js concurrent requests
  _db.pragma('journal_mode = WAL');
  _db.pragma('foreign_keys = ON');

  initSchema(_db);
  return _db;
}

// ── Schema Initialisation ───────────────────────────────────────────────────
function initSchema(db: Database.Database): void {
  db.exec(`
    -- Hero Images
    CREATE TABLE IF NOT EXISTS hero_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      image_path TEXT    NOT NULL
    );

    -- Events
    CREATE TABLE IF NOT EXISTS events (
      id               INTEGER PRIMARY KEY AUTOINCREMENT,
      name             TEXT    NOT NULL,
      event_date       TEXT    NOT NULL,
      title            TEXT    NOT NULL,
      description      TEXT    NOT NULL,
      main_image_path  TEXT    NOT NULL
    );

    -- Event Additional Images
    CREATE TABLE IF NOT EXISTS event_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      event_id   INTEGER NOT NULL REFERENCES events(id),
      image_path TEXT    NOT NULL
    );

    -- Quality Concepts
    CREATE TABLE IF NOT EXISTS quality_concepts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT    NOT NULL,
      description TEXT    NOT NULL
    );

    -- Quality Concept Images
    CREATE TABLE IF NOT EXISTS concept_images (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      concept_id INTEGER NOT NULL REFERENCES quality_concepts(id),
      image_path TEXT    NOT NULL
    );

    -- Quizzes
    CREATE TABLE IF NOT EXISTS quizzes (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      question       TEXT NOT NULL,
      option_a       TEXT NOT NULL,
      option_b       TEXT NOT NULL,
      option_c       TEXT NOT NULL,
      option_d       TEXT NOT NULL,
      correct_option TEXT NOT NULL
    );

    -- Magazines
    CREATE TABLE IF NOT EXISTS magazines (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      title      TEXT NOT NULL,
      pdf_path   TEXT NOT NULL,
      cover_path TEXT NOT NULL
    );
  `);
}

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

// ── Composite types returned to the UI ─────────────────────────────────────

export interface EventWithImages {
  event: EventRow;
  images: EventImageRow[];
}

export interface ConceptWithImages {
  concept: QualityConceptRow;
  images: ConceptImageRow[];
}

// ── Query helpers ───────────────────────────────────────────────────────────

// HERO
export function getAllHeroImages(): HeroImageRow[] {
  return getDb()
    .prepare('SELECT * FROM hero_images ORDER BY id DESC')
    .all() as HeroImageRow[];
}

export function insertHeroImage(imagePath: string): number {
  const result = getDb()
    .prepare('INSERT INTO hero_images (image_path) VALUES (?)')
    .run(imagePath);
  return result.lastInsertRowid as number;
}

export function deleteHeroImage(id: number): void {
  getDb().prepare('DELETE FROM hero_images WHERE id = ?').run(id);
}

// EVENTS
export function getAllEvents(): EventRow[] {
  return getDb()
    .prepare('SELECT * FROM events ORDER BY event_date DESC')
    .all() as EventRow[];
}

export function getRecentEvents(limit = 5): EventRow[] {
  return getDb()
    .prepare('SELECT * FROM events ORDER BY event_date DESC LIMIT ?')
    .all(limit) as EventRow[];
}

export function getEventImages(eventId: number): EventImageRow[] {
  return getDb()
    .prepare('SELECT * FROM event_images WHERE event_id = ?')
    .all(eventId) as EventImageRow[];
}

export function getAllEventsWithImages(): EventWithImages[] {
  const events = getAllEvents();
  return events.map((event) => ({
    event,
    images: getEventImages(event.id),
  }));
}

export function insertEvent(
  name: string,
  eventDate: string,
  title: string,
  description: string,
  mainImagePath: string
): number {
  const result = getDb()
    .prepare(
      'INSERT INTO events (name, event_date, title, description, main_image_path) VALUES (?, ?, ?, ?, ?)'
    )
    .run(name, eventDate, title, description, mainImagePath);
  return result.lastInsertRowid as number;
}

export function insertEventImage(eventId: number, imagePath: string): void {
  getDb()
    .prepare('INSERT INTO event_images (event_id, image_path) VALUES (?, ?)')
    .run(eventId, imagePath);
}

export function deleteEvent(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM event_images WHERE event_id = ?').run(id);
  db.prepare('DELETE FROM events WHERE id = ?').run(id);
}

// QUALITY CONCEPTS
export function getAllConcepts(): QualityConceptRow[] {
  return getDb()
    .prepare('SELECT * FROM quality_concepts')
    .all() as QualityConceptRow[];
}

export function getConceptImages(conceptId: number): ConceptImageRow[] {
  return getDb()
    .prepare('SELECT * FROM concept_images WHERE concept_id = ?')
    .all(conceptId) as ConceptImageRow[];
}

export function getAllConceptsWithImages(): ConceptWithImages[] {
  const concepts = getAllConcepts();
  return concepts.map((concept) => ({
    concept,
    images: getConceptImages(concept.id),
  }));
}

export function insertConcept(title: string, description: string): number {
  const result = getDb()
    .prepare('INSERT INTO quality_concepts (title, description) VALUES (?, ?)')
    .run(title, description);
  return result.lastInsertRowid as number;
}

export function insertConceptImage(conceptId: number, imagePath: string): void {
  getDb()
    .prepare('INSERT INTO concept_images (concept_id, image_path) VALUES (?, ?)')
    .run(conceptId, imagePath);
}

export function deleteConcept(id: number): void {
  const db = getDb();
  db.prepare('DELETE FROM concept_images WHERE concept_id = ?').run(id);
  db.prepare('DELETE FROM quality_concepts WHERE id = ?').run(id);
}

// QUIZZES
export function getAllQuizzes(): QuizRow[] {
  return getDb().prepare('SELECT * FROM quizzes').all() as QuizRow[];
}

export function insertQuiz(
  question: string,
  optionA: string,
  optionB: string,
  optionC: string,
  optionD: string,
  correctOption: string
): number {
  const result = getDb()
    .prepare(
      'INSERT INTO quizzes (question, option_a, option_b, option_c, option_d, correct_option) VALUES (?, ?, ?, ?, ?, ?)'
    )
    .run(question, optionA, optionB, optionC, optionD, correctOption);
  return result.lastInsertRowid as number;
}

export function deleteQuiz(id: number): void {
  getDb().prepare('DELETE FROM quizzes WHERE id = ?').run(id);
}

// MAGAZINES
export function getAllMagazines(): MagazineRow[] {
  return getDb()
    .prepare('SELECT * FROM magazines ORDER BY id DESC')
    .all() as MagazineRow[];
}

export function getRecentMagazines(limit = 4): MagazineRow[] {
  return getDb()
    .prepare('SELECT * FROM magazines ORDER BY id DESC LIMIT ?')
    .all(limit) as MagazineRow[];
}

export function insertMagazine(
  title: string,
  pdfPath: string,
  coverPath: string
): number {
  const result = getDb()
    .prepare('INSERT INTO magazines (title, pdf_path, cover_path) VALUES (?, ?, ?)')
    .run(title, pdfPath, coverPath);
  return result.lastInsertRowid as number;
}

export function deleteMagazine(id: number): void {
  getDb().prepare('DELETE FROM magazines WHERE id = ?').run(id);
}

// ── Upload directory helper ─────────────────────────────────────────────────
// Returns the absolute path to a specific upload sub-folder and creates it.
export function getUploadDir(subfolder: string): string {
  const dir = path.join(process.cwd(), 'public', 'uploads', subfolder);
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}
