export type ContactRequest = {
  id: string;
  name: string;
  email: string;
  company: string | null;
  budget: string | null;
  service: string;
  message: string;
  status: "new" | "read";
  project_id: string | null;
  created_at: string;
};

export type ProjectStatus =
  | "nouvelle_demande"
  | "en_analyse"
  | "acceptee"
  | "refusee"
  | "en_attente_paiement"
  | "planifiee"
  | "en_developpement"
  | "en_test"
  | "terminee";

export type StageStatus = "pending" | "in_progress" | "completed";

export type ValidationDecision = "pending" | "approved" | "changes_requested";

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export type Client = {
  id: string;
  user_id: string | null;
  email: string;
  name: string;
  company: string | null;
  phone: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  client_id: string;
  contact_request_id: string | null;
  title: string;
  description: string | null;
  service: string | null;
  status: ProjectStatus;
  progress_percent: number;
  start_date: string | null;
  delivery_date: string | null;
  live_url: string | null;
  live_password: string | null;
  live_expires_at: string | null;
  budget: string | null;
  source: string | null;
  created_at: string;
  updated_at: string;
  clients?: Client;
};

export type ProjectStage = {
  id: string;
  project_id: string;
  title: string;
  sort_order: number;
  status: StageStatus;
  scheduled_date: string | null;
  completed_at: string | null;
  created_at: string;
  project_validations?: ProjectValidation | null;
};

export type ProjectValidation = {
  id: string;
  project_id: string;
  stage_id: string;
  decision: ValidationDecision;
  client_note: string | null;
  decided_at: string | null;
  created_at: string;
};

export type ProjectDocument = {
  id: string;
  project_id: string;
  title: string;
  category: string;
  file_url: string | null;
  storage_path: string | null;
  uploaded_by: string;
  created_at: string;
};

export type ProjectMessage = {
  id: string;
  project_id: string;
  author_id: string | null;
  author_role: "admin" | "client";
  body: string;
  created_at: string;
};

export type Invoice = {
  id: string;
  project_id: string;
  label: string;
  amount_cents: number;
  currency: string;
  status: InvoiceStatus;
  due_date: string | null;
  paid_at: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  body: string;
  read: boolean;
  created_at: string;
};
