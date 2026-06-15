// AUTO-GENERATED TYPE FILE
// Regenerate after any schema change with:
//   supabase gen types typescript --local > types/database.types.ts
//
// This file is manually written to match the schema in /supabase/migrations/.
// Once the local Supabase stack is running, replace this with the generated output.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          phone?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };

      workspaces: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          owner_id: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          owner_id: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["workspaces"]["Insert"], "id">>;
        Relationships: [
          { foreignKeyName: "workspaces_owner_id_fkey"; columns: ["owner_id"]; referencedRelation: "profiles"; referencedColumns: ["id"] }
        ];
      };

      workspace_members: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          role: Database["public"]["Enums"]["workspace_role"];
          invited_by: string | null;
          joined_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          role?: Database["public"]["Enums"]["workspace_role"];
          invited_by?: string | null;
          joined_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["workspace_members"]["Insert"], "id">>;
        Relationships: [];
      };

      app_settings: {
        Row: {
          id: string;
          workspace_id: string;
          gst_default_percentage: number;
          stamp_duty_default_percentage: number;
          registration_default_percentage: number;
          preferred_currency: string;
          locale: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          gst_default_percentage?: number;
          stamp_duty_default_percentage?: number;
          registration_default_percentage?: number;
          preferred_currency?: string;
          locale?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["app_settings"]["Insert"], "id">>;
        Relationships: [];
      };

      activity_log: {
        Row: {
          id: string;
          workspace_id: string;
          user_id: string;
          action: string;
          resource_type: string;
          resource_id: string | null;
          metadata: Json | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          user_id: string;
          action: string;
          resource_type: string;
          resource_id?: string | null;
          metadata?: Json | null;
          created_at?: string;
        };
        Update: never; // activity_log is append-only
        Relationships: [];
      };

      builders: {
        Row: {
          id: string;
          workspace_id: string;
          name: string;
          display_name: string | null;
          builder_group_name: string | null;
          established_year: number | null;
          logo_url: string | null;
          logo_initials: string | null;
          logo_color: string | null;
          website: string | null;
          primary_sales_contact_name: string | null;
          primary_sales_contact_phone: string | null;
          primary_sales_contact_email: string | null;
          secondary_contact_name: string | null;
          secondary_contact_phone: string | null;
          credibility_rating: number | null;
          past_projects_count: number | null;
          past_projects_delivered_on_time: number | null;
          litigation_history: boolean;
          litigation_notes: string | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          name: string;
          display_name?: string | null;
          builder_group_name?: string | null;
          established_year?: number | null;
          logo_url?: string | null;
          logo_initials?: string | null;
          logo_color?: string | null;
          website?: string | null;
          primary_sales_contact_name?: string | null;
          primary_sales_contact_phone?: string | null;
          primary_sales_contact_email?: string | null;
          secondary_contact_name?: string | null;
          secondary_contact_phone?: string | null;
          credibility_rating?: number | null;
          past_projects_count?: number | null;
          past_projects_delivered_on_time?: number | null;
          litigation_history?: boolean;
          litigation_notes?: string | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["builders"]["Insert"], "id">>;
        Relationships: [];
      };

      projects: {
        Row: {
          id: string;
          workspace_id: string;
          builder_id: string | null;
          project_name: string;
          project_display_name: string | null;
          project_short_name: string | null;
          builder_name: string;
          project_status: Database["public"]["Enums"]["project_status"];
          project_purpose: Database["public"]["Enums"]["project_purpose"];
          risk_level: Database["public"]["Enums"]["risk_level"] | null;
          project_type: Database["public"]["Enums"]["project_type"];
          city: string;
          city_zone: Database["public"]["Enums"]["city_zone"] | null;
          micro_market: string | null;
          locality: string | null;
          full_address: string | null;
          pin_code: string | null;
          latitude: number | null;
          longitude: number | null;
          total_towers: number | null;
          total_floors: number | null;
          total_units: number | null;
          available_bhks: Database["public"]["Enums"]["bhk_config"][] | null;
          total_land_area_acres: number | null;
          open_space_percentage: number | null;
          price_range_min_per_sqft: number | null;
          price_range_max_per_sqft: number | null;
          indicative_price_min: number | null;
          indicative_price_max: number | null;
          estimated_possession_date: string | null;
          possession_confidence: Database["public"]["Enums"]["possession_confidence"] | null;
          rera_status: Database["public"]["Enums"]["rera_status"] | null;
          rera_number: string | null;
          rera_website_url: string | null;
          brochure_collected: boolean;
          floor_plans_collected: boolean;
          master_plan_collected: boolean;
          rera_certificate_collected: boolean;
          project_highlights: string[] | null;
          notes: string | null;
          source_of_lead: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          builder_id?: string | null;
          project_name: string;
          project_display_name?: string | null;
          project_short_name?: string | null;
          builder_name: string;
          project_status?: Database["public"]["Enums"]["project_status"];
          project_purpose?: Database["public"]["Enums"]["project_purpose"];
          risk_level?: Database["public"]["Enums"]["risk_level"] | null;
          project_type?: Database["public"]["Enums"]["project_type"];
          city?: string;
          city_zone?: Database["public"]["Enums"]["city_zone"] | null;
          micro_market?: string | null;
          locality?: string | null;
          full_address?: string | null;
          pin_code?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          total_towers?: number | null;
          total_floors?: number | null;
          total_units?: number | null;
          available_bhks?: Database["public"]["Enums"]["bhk_config"][] | null;
          total_land_area_acres?: number | null;
          open_space_percentage?: number | null;
          price_range_min_per_sqft?: number | null;
          price_range_max_per_sqft?: number | null;
          indicative_price_min?: number | null;
          indicative_price_max?: number | null;
          estimated_possession_date?: string | null;
          possession_confidence?: Database["public"]["Enums"]["possession_confidence"] | null;
          rera_status?: Database["public"]["Enums"]["rera_status"] | null;
          rera_number?: string | null;
          rera_website_url?: string | null;
          brochure_collected?: boolean;
          floor_plans_collected?: boolean;
          master_plan_collected?: boolean;
          rera_certificate_collected?: boolean;
          project_highlights?: string[] | null;
          notes?: string | null;
          source_of_lead?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["projects"]["Insert"], "id" | "workspace_id" | "created_by">>;
        Relationships: [
          { foreignKeyName: "projects_builder_id_fkey"; columns: ["builder_id"]; referencedRelation: "builders"; referencedColumns: ["id"] }
        ];
      };

      units: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string;
          unit_number: string | null;
          tower_name: string | null;
          floor_number: number | null;
          bhk_config: Database["public"]["Enums"]["bhk_config"];
          facing: Database["public"]["Enums"]["facing"] | null;
          floor_preference: Database["public"]["Enums"]["floor_preference"] | null;
          base_selling_price: number | null;
          bsp_per_sqft: number | null;
          notes: string | null;
          is_shortlisted: boolean;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id: string;
          unit_number?: string | null;
          tower_name?: string | null;
          floor_number?: number | null;
          bhk_config: Database["public"]["Enums"]["bhk_config"];
          facing?: Database["public"]["Enums"]["facing"] | null;
          floor_preference?: Database["public"]["Enums"]["floor_preference"] | null;
          base_selling_price?: number | null;
          bsp_per_sqft?: number | null;
          notes?: string | null;
          is_shortlisted?: boolean;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["units"]["Insert"], "id" | "workspace_id" | "created_by">>;
        Relationships: [];
      };

      space_details: {
        Row: {
          id: string;
          unit_id: string;
          workspace_id: string;
          super_built_up_area_sqft: number | null;
          built_up_area_sqft: number | null;
          carpet_area_sqft: number | null;
          balcony_area_sqft: number | null;
          exclusive_open_area_sqft: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          workspace_id: string;
          super_built_up_area_sqft?: number | null;
          built_up_area_sqft?: number | null;
          carpet_area_sqft?: number | null;
          balcony_area_sqft?: number | null;
          exclusive_open_area_sqft?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["space_details"]["Insert"], "id">>;
        Relationships: [];
      };

      cost_breakups: {
        Row: {
          id: string;
          unit_id: string;
          workspace_id: string;
          bsp_per_sqft: number | null;
          floor_rise_per_sqft: number | null;
          floor_rise_treatment: Database["public"]["Enums"]["money_treatment"] | null;
          plc_amount: number | null;
          plc_treatment: Database["public"]["Enums"]["money_treatment"] | null;
          plc_notes: string | null;
          club_membership: number | null;
          club_treatment: Database["public"]["Enums"]["money_treatment"] | null;
          infra_development_charge: number | null;
          idc_treatment: Database["public"]["Enums"]["money_treatment"] | null;
          power_backup_charge: number | null;
          power_treatment: Database["public"]["Enums"]["money_treatment"] | null;
          other_charges: number | null;
          other_charges_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          workspace_id: string;
          bsp_per_sqft?: number | null;
          floor_rise_per_sqft?: number | null;
          floor_rise_treatment?: Database["public"]["Enums"]["money_treatment"] | null;
          plc_amount?: number | null;
          plc_treatment?: Database["public"]["Enums"]["money_treatment"] | null;
          plc_notes?: string | null;
          club_membership?: number | null;
          club_treatment?: Database["public"]["Enums"]["money_treatment"] | null;
          infra_development_charge?: number | null;
          idc_treatment?: Database["public"]["Enums"]["money_treatment"] | null;
          power_backup_charge?: number | null;
          power_treatment?: Database["public"]["Enums"]["money_treatment"] | null;
          other_charges?: number | null;
          other_charges_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["cost_breakups"]["Insert"], "id">>;
        Relationships: [];
      };

      statutory_charges: {
        Row: {
          id: string;
          unit_id: string;
          workspace_id: string;
          gst_percentage: number | null;
          gst_amount: number | null;
          gst_override: boolean;
          stamp_duty_percentage: number | null;
          stamp_duty_amount: number | null;
          stamp_duty_override: boolean;
          registration_percentage: number | null;
          registration_amount: number | null;
          registration_override: boolean;
          legal_charges: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          workspace_id: string;
          gst_percentage?: number | null;
          gst_amount?: number | null;
          gst_override?: boolean;
          stamp_duty_percentage?: number | null;
          stamp_duty_amount?: number | null;
          stamp_duty_override?: boolean;
          registration_percentage?: number | null;
          registration_amount?: number | null;
          registration_override?: boolean;
          legal_charges?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["statutory_charges"]["Insert"], "id">>;
        Relationships: [];
      };

      parking_details: {
        Row: {
          id: string;
          unit_id: string;
          workspace_id: string;
          slot_number: string | null;
          parking_type: Database["public"]["Enums"]["parking_type"];
          price: number | null;
          is_included: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          unit_id: string;
          workspace_id: string;
          slot_number?: string | null;
          parking_type?: Database["public"]["Enums"]["parking_type"];
          price?: number | null;
          is_included?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["parking_details"]["Insert"], "id">>;
        Relationships: [];
      };

      amenities: {
        Row: {
          id: string;
          project_id: string;
          workspace_id: string;
          name: string;
          category: string;
          available: boolean;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          workspace_id: string;
          name: string;
          category?: string;
          available?: boolean;
          notes?: string | null;
          created_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["amenities"]["Insert"], "id">>;
        Relationships: [];
      };

      project_images: {
        Row: {
          id: string;
          project_id: string;
          workspace_id: string;
          url: string;
          caption: string | null;
          category: Database["public"]["Enums"]["image_category"];
          unit_type: Database["public"]["Enums"]["bhk_config"] | null;
          tower_name: string | null;
          is_cover: boolean;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          workspace_id: string;
          url: string;
          caption?: string | null;
          category?: Database["public"]["Enums"]["image_category"];
          unit_type?: Database["public"]["Enums"]["bhk_config"] | null;
          tower_name?: string | null;
          is_cover?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["project_images"]["Insert"], "id">>;
        Relationships: [];
      };

      project_videos: {
        Row: {
          id: string;
          project_id: string;
          workspace_id: string;
          title: string;
          raw_url: string;
          embed_url: string | null;
          platform: Database["public"]["Enums"]["video_platform"];
          video_type: Database["public"]["Enums"]["video_type"];
          duration_secs: number | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          workspace_id: string;
          title: string;
          raw_url: string;
          embed_url?: string | null;
          platform?: Database["public"]["Enums"]["video_platform"];
          video_type?: Database["public"]["Enums"]["video_type"];
          duration_secs?: number | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["project_videos"]["Insert"], "id">>;
        Relationships: [];
      };

      site_visits: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string;
          unit_id: string | null;
          visit_date: string;
          visit_time: string | null;
          visited_by: string;
          accompanied_by: string | null;
          overall_rating: number | null;
          summary: string | null;
          concerns: string[] | null;
          positives: string[] | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id: string;
          unit_id?: string | null;
          visit_date: string;
          visit_time?: string | null;
          visited_by: string;
          accompanied_by?: string | null;
          overall_rating?: number | null;
          summary?: string | null;
          concerns?: string[] | null;
          positives?: string[] | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["site_visits"]["Insert"], "id">>;
        Relationships: [];
      };

      checklist_items: {
        Row: {
          id: string;
          site_visit_id: string;
          workspace_id: string;
          category: string;
          item: string;
          checked: boolean;
          notes: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          site_visit_id: string;
          workspace_id: string;
          category?: string;
          item: string;
          checked?: boolean;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["checklist_items"]["Insert"], "id">>;
        Relationships: [];
      };

      follow_ups: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string | null;
          unit_id: string | null;
          title: string;
          description: string | null;
          category: Database["public"]["Enums"]["followup_category"];
          priority: Database["public"]["Enums"]["followup_priority"];
          status: Database["public"]["Enums"]["followup_status"];
          due_date: string | null;
          completed_at: string | null;
          assigned_to: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id?: string | null;
          unit_id?: string | null;
          title: string;
          description?: string | null;
          category?: Database["public"]["Enums"]["followup_category"];
          priority?: Database["public"]["Enums"]["followup_priority"];
          status?: Database["public"]["Enums"]["followup_status"];
          due_date?: string | null;
          completed_at?: string | null;
          assigned_to?: string | null;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["follow_ups"]["Insert"], "id" | "workspace_id" | "created_by">>;
        Relationships: [];
      };

      documents: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string | null;
          unit_id: string | null;
          site_visit_id: string | null;
          name: string;
          document_type: Database["public"]["Enums"]["document_asset_type"];
          storage_path: string;
          bucket_name: string;
          file_size_bytes: number | null;
          mime_type: string | null;
          collection_status: Database["public"]["Enums"]["document_collection_status"];
          verification_status: Database["public"]["Enums"]["document_verification_status"] | null;
          notes: string | null;
          uploaded_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id?: string | null;
          unit_id?: string | null;
          site_visit_id?: string | null;
          name: string;
          document_type?: Database["public"]["Enums"]["document_asset_type"];
          storage_path: string;
          bucket_name: string;
          file_size_bytes?: number | null;
          mime_type?: string | null;
          collection_status?: Database["public"]["Enums"]["document_collection_status"];
          verification_status?: Database["public"]["Enums"]["document_verification_status"] | null;
          notes?: string | null;
          uploaded_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["documents"]["Insert"], "id" | "workspace_id" | "uploaded_by">>;
        Relationships: [];
      };

      payment_milestones: {
        Row: {
          id: string;
          workspace_id: string;
          unit_id: string;
          milestone_name: string;
          percentage: number | null;
          amount: number | null;
          due_date: string | null;
          paid_date: string | null;
          status: Database["public"]["Enums"]["payment_milestone_status"];
          receipt_doc_id: string | null;
          notes: string | null;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          unit_id: string;
          milestone_name: string;
          percentage?: number | null;
          amount?: number | null;
          due_date?: string | null;
          paid_date?: string | null;
          status?: Database["public"]["Enums"]["payment_milestone_status"];
          receipt_doc_id?: string | null;
          notes?: string | null;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["payment_milestones"]["Insert"], "id">>;
        Relationships: [];
      };

      negotiations: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string;
          unit_id: string | null;
          negotiation_date: string;
          contact_name: string | null;
          offered_price: number | null;
          counter_price: number | null;
          concessions_given: string[] | null;
          outcome: string | null;
          notes: string | null;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id: string;
          unit_id?: string | null;
          negotiation_date?: string;
          contact_name?: string | null;
          offered_price?: number | null;
          counter_price?: number | null;
          concessions_given?: string[] | null;
          outcome?: string | null;
          notes?: string | null;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["negotiations"]["Insert"], "id">>;
        Relationships: [];
      };

      decision_status_history: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string;
          from_status: Database["public"]["Enums"]["project_status"] | null;
          to_status: Database["public"]["Enums"]["project_status"];
          reason: string | null;
          changed_by: string;
          changed_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id: string;
          from_status?: Database["public"]["Enums"]["project_status"] | null;
          to_status: Database["public"]["Enums"]["project_status"];
          reason?: string | null;
          changed_by: string;
          changed_at?: string;
        };
        Update: never; // immutable
        Relationships: [];
      };

      score_snapshots: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string;
          unit_id: string | null;
          living_score: number | null;
          investment_score: number | null;
          score_breakdown: Json | null;
          snapshot_reason: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id: string;
          unit_id?: string | null;
          living_score?: number | null;
          investment_score?: number | null;
          score_breakdown?: Json | null;
          snapshot_reason?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: never; // snapshots are immutable
        Relationships: [];
      };

      quote_snapshots: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string;
          unit_id: string | null;
          snapshot_date: string;
          bsp_per_sqft: number | null;
          total_quoted: number | null;
          valid_until: string | null;
          quote_details: Json | null;
          notes: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id: string;
          unit_id?: string | null;
          snapshot_date?: string;
          bsp_per_sqft?: number | null;
          total_quoted?: number | null;
          valid_until?: string | null;
          quote_details?: Json | null;
          notes?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: never; // snapshots are immutable
        Relationships: [];
      };

      import_jobs: {
        Row: {
          id: string;
          workspace_id: string;
          status: Database["public"]["Enums"]["job_status"];
          storage_path: string | null;
          started_at: string | null;
          completed_at: string | null;
          records_parsed: number | null;
          records_inserted: number | null;
          error_message: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          status?: Database["public"]["Enums"]["job_status"];
          storage_path?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          records_parsed?: number | null;
          records_inserted?: number | null;
          error_message?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["import_jobs"]["Insert"], "id">>;
        Relationships: [];
      };

      export_jobs: {
        Row: {
          id: string;
          workspace_id: string;
          status: Database["public"]["Enums"]["job_status"];
          storage_path: string | null;
          started_at: string | null;
          completed_at: string | null;
          error_message: string | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          status?: Database["public"]["Enums"]["job_status"];
          storage_path?: string | null;
          started_at?: string | null;
          completed_at?: string | null;
          error_message?: string | null;
          created_by: string;
          created_at?: string;
        };
        Update: Partial<Omit<Database["public"]["Tables"]["export_jobs"]["Insert"], "id">>;
        Relationships: [];
      };

      backup_records: {
        Row: {
          id: string;
          workspace_id: string;
          project_id: string | null;
          storage_path: string;
          file_size_bytes: number | null;
          created_by: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          workspace_id: string;
          project_id?: string | null;
          storage_path: string;
          file_size_bytes?: number | null;
          created_by: string;
          created_at?: string;
        };
        Update: never;
        Relationships: [];
      };

      audit_log: {
        Row: {
          id: string;
          workspace_id: string | null;
          user_id: string | null;
          operation: string;
          table_name: string;
          record_id: string | null;
          old_values: Json | null;
          new_values: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: never; // managed by service role only
        Update: never;
        Relationships: [];
      };
    };

    Views: Record<string, never>;

    Functions: {
      get_user_workspace_ids: {
        Args: Record<PropertyKey, never>;
        Returns: string[];
      };
      is_workspace_owner: {
        Args: { p_workspace_id: string };
        Returns: boolean;
      };
      is_workspace_writer: {
        Args: { p_workspace_id: string };
        Returns: boolean;
      };
      get_workspace_summary: {
        Args: { p_workspace_id: string };
        Returns: {
          total_projects: number;
          shortlisted_projects: number;
          total_units: number;
          open_follow_ups: number;
          total_documents: number;
          rera_registered: number;
        }[];
      };
      search_projects: {
        Args: { p_workspace_id: string; p_query: string };
        Returns: Database["public"]["Tables"]["projects"]["Row"][];
      };
    };

    Enums: {
      project_status:
        | "New Lead" | "Under Review" | "Site Visited" | "Under Comparison"
        | "Shortlisted" | "Strong Shortlist" | "Offer Stage" | "Negotiation"
        | "Legal Review" | "Final Decision" | "Booked" | "Rejected"
        | "On Hold" | "Watchlist" | "Closed" | "Lost to Another Buyer"
        | "Pending Approval" | "Draft" | "Archived";
      project_purpose: "Living" | "Investment" | "Both";
      bhk_config:
        | "1BHK" | "1.5BHK" | "2BHK" | "2.5BHK" | "3BHK" | "3.5BHK"
        | "4BHK" | "4.5BHK" | "5BHK" | "Studio" | "Duplex" | "Penthouse" | "Villa";
      facing:
        | "North" | "South" | "East" | "West"
        | "North-East" | "North-West" | "South-East" | "South-West";
      rera_status: "Registered" | "Awaited" | "Exempt" | "Applied" | "Rejected" | "Unknown";
      risk_level: "Low" | "Medium" | "High" | "Critical";
      data_confidence_status: "Confirmed" | "Estimated" | "Missing" | "Under Verification";
      money_treatment: "Included" | "Excluded" | "Bundled" | "Not Applicable";
      city_zone:
        | "East Bangalore" | "North Bangalore" | "South Bangalore"
        | "West Bangalore" | "Central Bangalore" | "Other";
      project_type:
        | "Apartment" | "Villa" | "Plot" | "Row House"
        | "Penthouse" | "Commercial" | "Mixed Use";
      floor_preference: "Low" | "Mid" | "High" | "Any";
      possession_confidence: "Confirmed" | "Likely" | "At Risk" | "Delayed" | "Unknown";
      workspace_role: "owner" | "member" | "viewer";
      document_asset_type:
        | "brochure" | "floor-plan-pdf" | "cost-sheet" | "legal-doc"
        | "rera-certificate" | "agreement-draft" | "other";
      document_collection_status: "Collected" | "Pending" | "Not Available";
      document_verification_status: "Verified" | "Unverified" | "Disputed";
      image_category:
        | "hero" | "gallery" | "elevation" | "floor-plan"
        | "master-plan" | "amenity-photo" | "site-photo" | "document-preview";
      video_type:
        | "walkthrough" | "drone" | "site-visit" | "promotional" | "review" | "other";
      video_platform: "youtube" | "vimeo" | "other";
      followup_status: "Open" | "Done" | "Overdue" | "Cancelled" | "Snoozed";
      followup_category:
        | "Data Collection" | "Legal Verification" | "Site Visit"
        | "Payment" | "Document" | "Negotiation" | "Personal" | "Other";
      followup_priority: "Low" | "Medium" | "High" | "Critical";
      parking_type: "Covered" | "Open" | "Mechanical" | "Stilt" | "Basement" | "None";
      payment_milestone_status: "Upcoming" | "Due" | "Paid" | "Overdue" | "Disputed";
      job_status: "pending" | "running" | "completed" | "failed";
    };

    CompositeTypes: Record<string, never>;
  };
};
