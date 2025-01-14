export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          created_at: string
          name: string
          age: number
          title: string
          description: string
          location: string
          is_vip: boolean
          is_verified: boolean
          rating: number
          gallery: {
            main: string[]
            private: string[]
          }
          stats: {
            height: string
            measurements: string
            dress_size: string
            eye_color: string
            hair_color: string
            ethnicity: string
          }
          services: {
            standard: string[]
            extra: string[]
          }
          rates: {
            incall: {
              hourly: number
              twohour: number
              additional: number
            }
            outcall: {
              hourly: number
              twohour: number
              additional: number
            }
          }
          availability: {
            days: string[]
            hours: {
              start: string
              end: string
            }
          }
          contact: {
            phone: string
            email: string
            whatsapp?: string
          }
          status: 'active' | 'inactive' | 'removed'
          terms_accepted: boolean
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Row']>
      }
      posts: {
        Row: {
          id: string
          created_at: string
          profile_id: string
          title: string
          content: string
          location: string
          status: 'active' | 'inactive' | 'removed'
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['posts']['Row']>
      }
    }
  }
} 