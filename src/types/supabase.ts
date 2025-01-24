export type Database = {
  public: {
    Tables: {
      usuarios_saas: {
        Row: {
          clerk_id: string
          email: string
          rol: string
          inmobiliaria_id: string | null
          ultima_actualizacion: string
        }
        Insert: {
          clerk_id: string
          email: string
          rol?: string
          inmobiliaria_id?: string | null
          ultima_actualizacion?: string
        }
        Update: {
          clerk_id?: string
          email?: string
          rol?: string
          inmobiliaria_id?: string | null
          ultima_actualizacion?: string
        }
      }
    }
  }
}