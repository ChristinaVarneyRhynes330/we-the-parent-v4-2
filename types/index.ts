// FILE: types/index.ts
// Place this file in the ROOT of your project at: types/index.ts

// ============================================
// DOCUMENT TYPES - MUST BE FIRST
// ============================================

export interface Document {
  id: string;
  case_id: string;
  title?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path: string;
  file_url?: string;
  content_type?: string;
  size_bytes?: number;
  document_type: string;
  summary: string;
  status?: string;
  error_message?: string;
  created_at: string;
  updated_at?: string;
}

export interface DocumentChunk {
  id: string;
  document_id: string;
  content: string;
  embedding?: number[];
  chunk_index?: number;
  token_count?: number;
  checksum?: string;
  created_at: string;
}

// CRITICAL: Alias for compatibility
export type UploadedDoc = Document;

// ============================================
// EVIDENCE TYPES
// ============================================

export interface Evidence {
  id: string;
  case_id: string;
  name?: string;
  file_name: string;
  file_type: string;
  file_size: number;
  file_path?: string;
  storage_path?: string;
  description?: string;
  upload_date?: string;
  created_at: string;
}

// ============================================
// CORE TYPES
// ============================================

export interface Case {
  id: string;
  user_id: string;
  name: string;
  case_number: string;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

// ============================================
// EVENT/TIMELINE TYPES
// ============================================

export interface TimelineEvent {
  id: string;
  case_id: string;
  title: string;
  event_date: string;
  date?: string;
  event_type: string;
  description?: string;
  location?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

export type NewTimelineEvent = Omit<TimelineEvent, 'id' | 'created_at' | 'updated_at'>;

// ============================================
// CHILDREN TYPES
// ============================================

export interface Child {
  id: string;
  case_id: string;
  name: string;
  date_of_birth: string;
  placement_type?: string;
  placement_address?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// ============================================
// NARRATIVE TYPES
// ============================================

export interface NarrativeEntry {
  id: string;
  case_id: string;
  content: string;
  created_at: string;
}

export type NewNarrativeEntry = Omit<NarrativeEntry, 'id' | 'created_at'>;

// ============================================
// PREDICATE TYPES
// ============================================

export interface Predicate {
  id: string;
  case_id: string;
  title: string;
  description?: string;
  statement?: string;
  created_by?: string;
  created_at: string;
}

export interface PredicateEvidenceLink {
  id: string;
  predicate_id: string;
  evidence_id: string;
  created_by?: string;
  created_at: string;
}

// ============================================
// CHAT & AI TYPES
// ============================================

export interface ChatMessage {
  id: string;
  thread_id: string;
  role: 'user' | 'assistant' | 'model' | 'system';
  content: string;
  created_at: string;
  source?: string;
}

export interface ChatThread {
  id: string;
  user_id: string;
  created_at: string;
}

// ============================================
// RESEARCH TYPES
// ============================================

export interface ResearchSource {
  id: string;
  document_id: string;
  document_title: string;
  page_number: number;
  content: string;
}

export interface ResearchResult {
  summary: string;
  sources: ResearchSource[];
  citation?: string;
}

// ============================================
// COMPLIANCE & DRAFTING TYPES
// ============================================

export interface ComplianceIssue {
  id: string;
  severity: 'error' | 'warning';
  message: string;
  ruleId: string;
  isCompleted: boolean;
  dueDate: string;
  created_at: string;
}

export interface DraftRequest {
  templateId: string;
  caseId: string;
  userInstructions?: string;
  documentType?: string;
  caseName?: string;
  caseNumber?: string;
  reason?: string;
  outcome?: string;
}

export interface DraftResponse {
  draft: string;
  caseInfo?: {
    caseNumber: string;
    caseName: string;
    circuit: string;
    county: string;
  };
  documentType?: string;
  generatedAt?: string;
}

// ============================================
// TRANSCRIPTION TYPES
// ============================================

export interface TranscriptionJob {
  id: string;
  storage_url: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  transcript?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// ============================================
// FORM TYPES
// ============================================

export interface FormError {
  field: string;
  message: string;
}

export interface FormState<T> {
  data: T;
  errors: FormError[];
  isSubmitting: boolean;
  isValid: boolean;
}

// ============================================
// LEGAL UTILITY TYPES
// ============================================

export interface FoundationScript {
  id: string;
  evidenceType: string;
  flStatute?: string;
  questions: string[];
}