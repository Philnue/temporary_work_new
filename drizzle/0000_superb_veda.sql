CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "public"."account_status" AS ENUM('pending', 'active', 'suspended');--> statement-breakpoint
CREATE TYPE "public"."onboarding_stage" AS ENUM('pending', 'documents_review', 'interview', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."facility_type" AS ENUM('kindergarten', 'school', 'daycare', 'other');--> statement-breakpoint
CREATE TYPE "public"."application_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."assignment_status" AS ENUM('pending', 'accepted', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."day_of_week" AS ENUM('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday');--> statement-breakpoint
CREATE TYPE "public"."demand_status" AS ENUM('open', 'assigned', 'cancelled', 'completed');--> statement-breakpoint
CREATE TYPE "public"."leave_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."leave_type" AS ENUM('vacation', 'sick', 'personal', 'other');--> statement-breakpoint
CREATE TYPE "public"."shift_status" AS ENUM('open', 'assigned', 'completed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."timesheet_status" AS ENUM('pending', 'approved', 'disputed', 'paid');--> statement-breakpoint
CREATE TYPE "public"."notification_type" AS ENUM('shift', 'leave', 'document', 'assignment', 'system', 'general');--> statement-breakpoint
CREATE TYPE "public"."rating_type" AS ENUM('educator_rates_facility', 'facility_rates_educator');--> statement-breakpoint
CREATE TABLE "auth"."account" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."refresh_tokens" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"device_info" text,
	"platform" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"last_used_at" timestamp with time zone,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "refresh_tokens_token_hash_unique" UNIQUE("token_hash")
);
--> statement-breakpoint
CREATE TABLE "auth"."session" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" uuid NOT NULL,
	"impersonated_by" uuid,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "auth"."user" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"role" text DEFAULT 'user' NOT NULL,
	"banned" boolean DEFAULT false NOT NULL,
	"ban_reason" text,
	"ban_expires" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "auth"."verification" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profile" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"display_name" text NOT NULL,
	"account_status" "account_status" DEFAULT 'pending' NOT NULL,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"onboarding_stage" "onboarding_stage" DEFAULT 'pending',
	"phone" text,
	"address" text,
	"city" text,
	"postal_code" text,
	"qualifications" jsonb,
	"hourly_rate" integer,
	"avatar_url" text,
	"radius_km" integer,
	"is_available" boolean DEFAULT false NOT NULL,
	"preferences" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "facilities" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid,
	"name" text NOT NULL,
	"type" "facility_type" NOT NULL,
	"address" text NOT NULL,
	"city" text NOT NULL,
	"postal_code" text NOT NULL,
	"phone" text,
	"email" text,
	"contact_person" text,
	"description" text,
	"logo_url" text,
	"requirements" jsonb,
	"notes" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "availability" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"day_of_week" "day_of_week" NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staffing_availability_time_order_chk" CHECK ("availability"."end_time" > "availability"."start_time")
);
--> statement-breakpoint
CREATE TABLE "date_availability" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" date NOT NULL,
	"time_from" time NOT NULL,
	"time_to" time NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staffing_date_availability_time_order_chk" CHECK ("date_availability"."time_to" > "date_availability"."time_from")
);
--> statement-breakpoint
CREATE TABLE "demand_applications" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"demand_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "demands" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"facility_id" uuid NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"hours_per_day" real,
	"start_time" time,
	"end_time" time,
	"qualifications_required" jsonb,
	"additional_requirements" jsonb,
	"status" "demand_status" DEFAULT 'open' NOT NULL,
	"assigned_educator_id" uuid,
	"created_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staffing_demands_date_order_chk" CHECK ("demands"."end_date" >= "demands"."start_date")
);
--> statement-breakpoint
CREATE TABLE "leave_requests" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "leave_type" NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"reason" text,
	"status" "leave_status" DEFAULT 'pending' NOT NULL,
	"reviewed_by" uuid,
	"reviewed_at" timestamp with time zone,
	"review_notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staffing_leave_requests_date_order_chk" CHECK ("leave_requests"."end_date" >= "leave_requests"."start_date")
);
--> statement-breakpoint
CREATE TABLE "shift_applications" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"shift_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"status" "application_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shift_assignments" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"shift_id" uuid NOT NULL,
	"assigned_user_id" uuid NOT NULL,
	"assigned_by" uuid NOT NULL,
	"status" "assignment_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"responded_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "shifts" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"facility_id" uuid NOT NULL,
	"assigned_user_id" uuid,
	"date" date NOT NULL,
	"start_time" time NOT NULL,
	"end_time" time NOT NULL,
	"status" "shift_status" DEFAULT 'open' NOT NULL,
	"required_qualifications" jsonb,
	"notes" text,
	"hourly_rate" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "staffing_shifts_time_order_chk" CHECK ("shifts"."end_time" > "shifts"."start_time")
);
--> statement-breakpoint
CREATE TABLE "timesheets" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"shift_id" uuid NOT NULL,
	"user_id" uuid NOT NULL,
	"assignment_id" uuid,
	"week_start" date,
	"clock_in" timestamp with time zone,
	"clock_out" timestamp with time zone,
	"break_minutes" integer DEFAULT 0,
	"total_minutes" integer,
	"status" timesheet_status DEFAULT 'pending' NOT NULL,
	"unsigned_pdf_key" text,
	"signed_pdf_key" text,
	"notes" text,
	"approved_by" uuid,
	"approved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "device_tokens" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" text NOT NULL,
	"platform" text NOT NULL,
	"device_name" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "notification_type" DEFAULT 'general' NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"data" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid,
	"action" text NOT NULL,
	"entity_type" text NOT NULL,
	"entity_id" uuid,
	"old_value" jsonb,
	"new_value" jsonb,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "documents" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" text NOT NULL,
	"type" text NOT NULL,
	"file_name" text NOT NULL,
	"file_url" text NOT NULL,
	"s3_key" text,
	"s3_bucket" text,
	"file_size" integer,
	"mime_type" text,
	"expires_at" date,
	"is_verified" boolean DEFAULT false NOT NULL,
	"verified_by" uuid,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ratings" (
	"id" uuid PRIMARY KEY DEFAULT uuidv7() NOT NULL,
	"assignment_id" uuid NOT NULL,
	"from_user_id" uuid NOT NULL,
	"to_user_id" uuid NOT NULL,
	"type" "rating_type" NOT NULL,
	"scores" jsonb NOT NULL,
	"comment" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "system_runtime" (
	"id" integer PRIMARY KEY DEFAULT 1 NOT NULL,
	"maintenance_enabled" boolean DEFAULT false NOT NULL,
	"maintenance_message" text,
	"updated_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ops_system_runtime_single_row_chk" CHECK ("system_runtime"."id" = 1)
);
--> statement-breakpoint
ALTER TABLE "auth"."account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_impersonated_by_user_id_fk" FOREIGN KEY ("impersonated_by") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_profile" ADD CONSTRAINT "user_profile_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "facilities" ADD CONSTRAINT "facilities_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability" ADD CONSTRAINT "availability_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "date_availability" ADD CONSTRAINT "date_availability_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demand_applications" ADD CONSTRAINT "demand_applications_demand_id_demands_id_fk" FOREIGN KEY ("demand_id") REFERENCES "public"."demands"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demand_applications" ADD CONSTRAINT "demand_applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demands" ADD CONSTRAINT "demands_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demands" ADD CONSTRAINT "demands_assigned_educator_id_user_id_fk" FOREIGN KEY ("assigned_educator_id") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "demands" ADD CONSTRAINT "demands_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leave_requests" ADD CONSTRAINT "leave_requests_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_applications" ADD CONSTRAINT "shift_applications_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_applications" ADD CONSTRAINT "shift_applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_assigned_user_id_user_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shift_assignments" ADD CONSTRAINT "shift_assignments_assigned_by_user_id_fk" FOREIGN KEY ("assigned_by") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_facility_id_facilities_id_fk" FOREIGN KEY ("facility_id") REFERENCES "public"."facilities"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shifts" ADD CONSTRAINT "shifts_assigned_user_id_user_id_fk" FOREIGN KEY ("assigned_user_id") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_shift_id_shifts_id_fk" FOREIGN KEY ("shift_id") REFERENCES "public"."shifts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "timesheets" ADD CONSTRAINT "timesheets_approved_by_user_id_fk" FOREIGN KEY ("approved_by") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "device_tokens" ADD CONSTRAINT "device_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "documents" ADD CONSTRAINT "documents_verified_by_user_id_fk" FOREIGN KEY ("verified_by") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_assignment_id_shift_assignments_id_fk" FOREIGN KEY ("assignment_id") REFERENCES "public"."shift_assignments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_from_user_id_user_id_fk" FOREIGN KEY ("from_user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ratings" ADD CONSTRAINT "ratings_to_user_id_user_id_fk" FOREIGN KEY ("to_user_id") REFERENCES "auth"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "system_runtime" ADD CONSTRAINT "system_runtime_updated_by_user_id_fk" FOREIGN KEY ("updated_by") REFERENCES "auth"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "auth_account_user_id_idx" ON "auth"."account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_refresh_tokens_user_id_idx" ON "auth"."refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_session_user_id_idx" ON "auth"."session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_verification_identifier_idx" ON "auth"."verification" USING btree ("identifier");--> statement-breakpoint
CREATE INDEX "identity_user_profile_account_status_idx" ON "user_profile" USING btree ("account_status");--> statement-breakpoint
CREATE INDEX "org_facilities_user_id_idx" ON "facilities" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "org_facilities_city_type_idx" ON "facilities" USING btree ("city","type");--> statement-breakpoint
CREATE UNIQUE INDEX "staffing_availability_user_day_unique" ON "availability" USING btree ("user_id","day_of_week","start_time","end_time");--> statement-breakpoint
CREATE UNIQUE INDEX "staffing_date_availability_user_date_time_unique" ON "date_availability" USING btree ("user_id","date","time_from","time_to");--> statement-breakpoint
CREATE UNIQUE INDEX "staffing_demand_applications_demand_user_unique" ON "demand_applications" USING btree ("demand_id","user_id");--> statement-breakpoint
CREATE INDEX "staffing_demand_applications_status_idx" ON "demand_applications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "staffing_demands_facility_status_idx" ON "demands" USING btree ("facility_id","status");--> statement-breakpoint
CREATE INDEX "staffing_leave_requests_user_status_idx" ON "leave_requests" USING btree ("user_id","status");--> statement-breakpoint
CREATE UNIQUE INDEX "staffing_shift_applications_shift_user_unique" ON "shift_applications" USING btree ("shift_id","user_id");--> statement-breakpoint
CREATE INDEX "staffing_shift_applications_status_idx" ON "shift_applications" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "staffing_shift_assignments_shift_user_unique" ON "shift_assignments" USING btree ("shift_id","assigned_user_id");--> statement-breakpoint
CREATE INDEX "staffing_shift_assignments_status_idx" ON "shift_assignments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "staffing_shifts_facility_date_status_idx" ON "shifts" USING btree ("facility_id","date","status");--> statement-breakpoint
CREATE INDEX "staffing_shifts_assigned_user_id_idx" ON "shifts" USING btree ("assigned_user_id");--> statement-breakpoint
CREATE INDEX "timekeeping_timesheets_shift_id_idx" ON "timesheets" USING btree ("shift_id");--> statement-breakpoint
CREATE INDEX "timekeeping_timesheets_user_week_status_idx" ON "timesheets" USING btree ("user_id","week_start","status");--> statement-breakpoint
CREATE UNIQUE INDEX "comms_device_tokens_token_unique" ON "device_tokens" USING btree ("token");--> statement-breakpoint
CREATE INDEX "comms_device_tokens_user_id_idx" ON "device_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "comms_notifications_user_read_idx" ON "notifications" USING btree ("user_id","read");--> statement-breakpoint
CREATE INDEX "comms_notifications_user_created_idx" ON "notifications" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "compliance_audit_logs_user_created_idx" ON "audit_logs" USING btree ("user_id","created_at");--> statement-breakpoint
CREATE INDEX "compliance_audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "compliance_documents_user_verified_idx" ON "documents" USING btree ("user_id","is_verified");--> statement-breakpoint
CREATE INDEX "compliance_documents_expires_at_idx" ON "documents" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "compliance_ratings_assignment_id_idx" ON "ratings" USING btree ("assignment_id");--> statement-breakpoint
CREATE INDEX "compliance_ratings_to_user_id_idx" ON "ratings" USING btree ("to_user_id");