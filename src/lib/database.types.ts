export interface Database {
  public: {
    Tables: {
      // User management
      users: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          user_type: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          user_type: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          user_type?: string
          created_at?: string
          updated_at?: string
        }
      }

      // Consultant profiles
      consultant_profiles: {
        Row: {
          user_id: string
          job_title: string | null
          bio: string | null
          address1: string | null
          address2: string | null
          address3: string | null
          country: string | null
          postal_code: string | null
          phone: string | null
          linkedin_url: string | null
          id_doc_url: string | null
          video_intro_url: string | null
          stripe_account_id: string | null
          hourly_rate_min: string | null
          hourly_rate_max: string | null
          availability: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          user_id: string
          job_title?: string | null
          bio?: string | null
          address1?: string | null
          address2?: string | null
          address3?: string | null
          country?: string | null
          postal_code?: string | null
          phone?: string | null
          linkedin_url?: string | null
          id_doc_url?: string | null
          video_intro_url?: string | null
          stripe_account_id?: string | null
          hourly_rate_min?: string | null
          hourly_rate_max?: string | null
          availability?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          job_title?: string | null
          bio?: string | null
          address1?: string | null
          address2?: string | null
          address3?: string | null
          country?: string | null
          postal_code?: string | null
          phone?: string | null
          linkedin_url?: string | null
          id_doc_url?: string | null
          video_intro_url?: string | null
          stripe_account_id?: string | null
          hourly_rate_min?: string | null
          hourly_rate_max?: string | null
          availability?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }

      // Client profiles
      client_profiles: {
        Row: {
          user_id: string
          company_name: string | null
          website: string | null
          description: string | null
          duns_number: string | null
          organisation_type: string | null
          industry: string | null
          logo_url: string | null
          address1: string | null
          address2: string | null
          address3: string | null
          country: string | null
          postal_code: string | null
          phone: string | null
          linkedin_url: string | null
          stripe_customer_id: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          user_id: string
          company_name?: string | null
          website?: string | null
          description?: string | null
          duns_number?: string | null
          organisation_type?: string | null
          industry?: string | null
          logo_url?: string | null
          address1?: string | null
          address2?: string | null
          address3?: string | null
          country?: string | null
          postal_code?: string | null
          phone?: string | null
          linkedin_url?: string | null
          stripe_customer_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          user_id?: string
          company_name?: string | null
          website?: string | null
          description?: string | null
          duns_number?: string | null
          organisation_type?: string | null
          industry?: string | null
          logo_url?: string | null
          address1?: string | null
          address2?: string | null
          address3?: string | null
          country?: string | null
          postal_code?: string | null
          phone?: string | null
          linkedin_url?: string | null
          stripe_customer_id?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }

      // Projects
      projects: {
        Row: {
          id: string
          creator_id: string | null
          type: string | null
          title: string | null
          description: string | null
          cover_photo_url: string | null
          skills_required: string | null
          num_consultants: string | null
          currency: string | null
          budget_min: string | null
          budget_max: string | null
          desired_amount_min: string | null
          desired_amount_max: string | null
          delivery_time_min: string | null
          delivery_time_max: string | null
          status: string | null
          project_origin: string
          external_url: string | null
          expires_at: string | null
          source_name: string | null
          screening_questions: string | null
          template_id: string | null
          created_at: string | null
          updated_at: string | null
          deleted_at: string | null
          industries: number[] | null
        }
        Insert: {
          id?: string
          creator_id?: string | null
          type?: string | null
          title?: string | null
          description?: string | null
          cover_photo_url?: string | null
          skills_required?: string | null
          num_consultants?: string | null
          currency?: string | null
          budget_min?: string | null
          budget_max?: string | null
          desired_amount_min?: string | null
          desired_amount_max?: string | null
          delivery_time_min?: string | null
          delivery_time_max?: string | null
          status?: string | null
          project_origin?: string
          external_url?: string | null
          expires_at?: string | null
          source_name?: string | null
          screening_questions?: string | null
          template_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
          industries?: number[] | null
        }
        Update: {
          id?: string
          creator_id?: string | null
          type?: string | null
          title?: string | null
          description?: string | null
          cover_photo_url?: string | null
          skills_required?: string | null
          num_consultants?: string | null
          currency?: string | null
          budget_min?: string | null
          budget_max?: string | null
          desired_amount_min?: string | null
          desired_amount_max?: string | null
          delivery_time_min?: string | null
          delivery_time_max?: string | null
          status?: string | null
          project_origin?: string
          external_url?: string | null
          expires_at?: string | null
          source_name?: string | null
          screening_questions?: string | null
          template_id?: string | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
          industries?: number[] | null
        }
      }

      // Bids
      bids: {
        Row: {
          id: string
          project_id: string | null
          consultant_id: string | null
          amount: string | null
          currency: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          project_id?: string | null
          consultant_id?: string | null
          amount?: string | null
          currency?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          project_id?: string | null
          consultant_id?: string | null
          amount?: string | null
          currency?: string | null
          status?: string | null
          created_at?: string | null
        }
      }

      // Contracts
      contracts: {
        Row: {
          id: string
          client_id: string | null
          consultant_id: string | null
          project_id: string | null
          bid_id: string | null
          status: string | null
          start_date: string | null
          end_date: string | null
          terms: string | null
          payment_terms: string | null
          created_at: string | null
          updated_at: string | null
          deleted_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          consultant_id?: string | null
          project_id?: string | null
          bid_id?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          terms?: string | null
          payment_terms?: string | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          consultant_id?: string | null
          project_id?: string | null
          bid_id?: string | null
          status?: string | null
          start_date?: string | null
          end_date?: string | null
          terms?: string | null
          payment_terms?: string | null
          created_at?: string | null
          updated_at?: string | null
          deleted_at?: string | null
        }
      }

      // Skills
      skills: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id?: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
      }

      // User skills
      user_skills: {
        Row: {
          user_id: string
          skill_id: string | null
        }
        Insert: {
          user_id: string
          skill_id?: string | null
        }
        Update: {
          user_id?: string
          skill_id?: string | null
        }
      }

      // Languages
      languages: {
        Row: {
          id: string
          name: string | null
        }
        Insert: {
          id?: string
          name?: string | null
        }
        Update: {
          id?: string
          name?: string | null
        }
      }

      // User languages
      user_languages: {
        Row: {
          user_id: string
          language_id: string | null
          proficiency: string | null
        }
        Insert: {
          user_id: string
          language_id?: string | null
          proficiency?: string | null
        }
        Update: {
          user_id?: string
          language_id?: string | null
          proficiency?: string | null
        }
      }

      // Portfolio
      portfolio: {
        Row: {
          id: string
          user_id: string | null
          project_name: string | null
          project_role: string | null
          description: string | null
          start_date: string | null
          completed_date: string | null
          currently_open: string | null
          problem_video_url: string | null
          problem_files: string | null
          solution_video_url: string | null
          solution_files: string | null
          skills: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          project_name?: string | null
          project_role?: string | null
          description?: string | null
          start_date?: string | null
          completed_date?: string | null
          currently_open?: string | null
          problem_video_url?: string | null
          problem_files?: string | null
          solution_video_url?: string | null
          solution_files?: string | null
          skills?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          project_name?: string | null
          project_role?: string | null
          description?: string | null
          start_date?: string | null
          completed_date?: string | null
          currently_open?: string | null
          problem_video_url?: string | null
          problem_files?: string | null
          solution_video_url?: string | null
          solution_files?: string | null
          skills?: string | null
        }
      }

      // Education
      education: {
        Row: {
          id: string
          user_id: string | null
          institution_name: string | null
          degree_level: string | null
          grade: string | null
          start_date: string | null
          end_date: string | null
          description: string | null
          file_url: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          institution_name?: string | null
          degree_level?: string | null
          grade?: string | null
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          file_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          institution_name?: string | null
          degree_level?: string | null
          grade?: string | null
          start_date?: string | null
          end_date?: string | null
          description?: string | null
          file_url?: string | null
        }
      }

      // Certifications
      certifications: {
        Row: {
          id: string
          user_id: string | null
          name: string | null
          awarding_body: string | null
          issue_date: string | null
          expiry_date: string | null
          credential_id: string | null
          credential_url: string | null
          file_url: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          name?: string | null
          awarding_body?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          file_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          name?: string | null
          awarding_body?: string | null
          issue_date?: string | null
          expiry_date?: string | null
          credential_id?: string | null
          credential_url?: string | null
          file_url?: string | null
        }
      }

      // Teams
      teams: {
        Row: {
          id: string
          name: string | null
          created_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          name?: string | null
          created_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          name?: string | null
          created_by?: string | null
          created_at?: string | null
        }
      }

      // Team members
      team_members: {
        Row: {
          team_id: string
          user_id: string | null
        }
        Insert: {
          team_id: string
          user_id?: string | null
        }
        Update: {
          team_id?: string
          user_id?: string | null
        }
      }

      // Conversations
      conversations: {
        Row: {
          id: string
          type: string | null
          subject: string | null
        }
        Insert: {
          id?: string
          type?: string | null
          subject?: string | null
        }
        Update: {
          id?: string
          type?: string | null
          subject?: string | null
        }
      }

      // Messages
      messages: {
        Row: {
          id: string
          conversation_id: string | null
          sender_id: string | null
          recipient_id: string | null
          content: string | null
          attachments: string | null
          status: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          recipient_id?: string | null
          content?: string | null
          attachments?: string | null
          status?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          recipient_id?: string | null
          content?: string | null
          attachments?: string | null
          status?: string | null
          created_at?: string | null
        }
      }

      // Payments
      payments: {
        Row: {
          id: string
          contract_id: string | null
          amount: string | null
          status: string | null
          stripe_payment_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          contract_id?: string | null
          amount?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string | null
          amount?: string | null
          status?: string | null
          stripe_payment_id?: string | null
          created_at?: string | null
        }
      }

      // Disputes
      disputes: {
        Row: {
          id: string
          contract_id: string | null
          raised_by: string | null
          reason: string | null
          details: string | null
          preferred_outcome: string | null
          status: string | null
          ticket_no: string | null
          supporting_docs: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          contract_id?: string | null
          raised_by?: string | null
          reason?: string | null
          details?: string | null
          preferred_outcome?: string | null
          status?: string | null
          ticket_no?: string | null
          supporting_docs?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          contract_id?: string | null
          raised_by?: string | null
          reason?: string | null
          details?: string | null
          preferred_outcome?: string | null
          status?: string | null
          ticket_no?: string | null
          supporting_docs?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }

      // Dispute responses
      dispute_responses: {
        Row: {
          id: string
          dispute_id: string | null
          responder_id: string | null
          response_details: string | null
          preferred_outcome: string | null
          supporting_docs: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          dispute_id?: string | null
          responder_id?: string | null
          response_details?: string | null
          preferred_outcome?: string | null
          supporting_docs?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          dispute_id?: string | null
          responder_id?: string | null
          response_details?: string | null
          preferred_outcome?: string | null
          supporting_docs?: string | null
          created_at?: string | null
        }
      }

      // Video meetings
      video_meetings: {
        Row: {
          id: string
          title: string | null
          description: string | null
          date: string | null
          start_time: string | null
          end_time: string | null
          created_by: string | null
          participants: string | null
          meeting_url: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          description?: string | null
          date?: string | null
          start_time?: string | null
          end_time?: string | null
          created_by?: string | null
          participants?: string | null
          meeting_url?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          description?: string | null
          date?: string | null
          start_time?: string | null
          end_time?: string | null
          created_by?: string | null
          participants?: string | null
          meeting_url?: string | null
          created_at?: string | null
        }
      }

      // Notifications
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: string | null
          content: string | null
          read: string | null
          action_url: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          type?: string | null
          content?: string | null
          read?: string | null
          action_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: string | null
          content?: string | null
          read?: string | null
          action_url?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }

      // Reference contacts
      reference_contacts: {
        Row: {
          id: string
          user_id: string | null
          first_name: string | null
          last_name: string | null
          email: string | null
          phone: string | null
          company_name: string | null
          description: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company_name?: string | null
          description?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          first_name?: string | null
          last_name?: string | null
          email?: string | null
          phone?: string | null
          company_name?: string | null
          description?: string | null
        }
      }

      // Vetting questions
      vetting_questions: {
        Row: {
          id: string
          question: string | null
        }
        Insert: {
          id?: string
          question?: string | null
        }
        Update: {
          id?: string
          question?: string | null
        }
      }

      // Vetting responses
      vetting_responses: {
        Row: {
          id: string
          user_id: string | null
          question_id: string | null
          answer: string | null
          verified_by: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          question_id?: string | null
          answer?: string | null
          verified_by?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          question_id?: string | null
          answer?: string | null
          verified_by?: string | null
          created_at?: string | null
        }
      }

      // Articles
      articles: {
        Row: {
          id: string
          title: string | null
          type: string | null
          tags: string | null
          role: string | null
          body: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title?: string | null
          type?: string | null
          tags?: string | null
          role?: string | null
          body?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string | null
          type?: string | null
          tags?: string | null
          role?: string | null
          body?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
  }
}