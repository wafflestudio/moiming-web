// export interface UserIdentities {
//   id: number; // PK / BIGINT
//   user_id: number; // FK / BIGINT
//   provider: string; // VARCHAR(50)
//   provider_user_id: string; // VARCHAR(191)
//   created_at: string; // DATETIME(6)
// }

export interface Events {
  id: number | null; // PK / BIGINT
  title: string; // VARCHAR(255)
  description: string | null; // TEXT
  location: string | null; // VARCHAR(255)
  start_at: string | null; // DATETIME(6)
  end_at: string | null; // DATETIME(6)
  capacity: number | null; // INT
  waitlist_enabled: boolean; // BOOLEAN
  registration_deadline: string | null; // DATETIME(6)
  created_by: number; // FK / BIGINT
  created_at: string; // DATETIME(6)
  updated_at: string; // DATETIME(6)
}

// export interface PendingUsers {
//   id: number; // PK / BIGINT
//   email: string; // VARCHAR(255)
//   name: string; // VARCHAR(100)
//   password_hash: string; // VARCHAR(255)
//   verification_code: string; // VARCHAR(255)
//   created_at: string; // TIMESTAMP
//   expires_at: string; // TIMESTAMP
// }

// export interface Users {
//   id: number; // PK / BIGINT
//   email: string; // VARCHAR(255)
//   name: string; // VARCHAR(100)
//   password_hash: string | null; // VARCHAR(255)
//   profile_image: string | null; // VARCHAR(255)
//   created_at: string; // DATETIME(6)
//   updated_at: string; // DATETIME(6)
// }

// export interface RegistrationTokens {
//   id: number | null; // PK / BIGINT
//   registration_id: number | null; // FK / BIGINT
//   token_hash: string; // CHAR(64)
//   purpose: string; // ENUM('CANCEL','CHANGE_VOTE')
//   created_at: string; // DATETIME(6)
// }

// export interface Registrations {
//   id: number | null; // PK / BIGINT
//   user_id: number; // FK / BIGINT
//   event_id: number | null; // FK / BIGINT
//   guest_name: string | null; // VARCHAR(100)
//   guest_email: string | null; // VARCHAR(255)
//   status: string; // ENUM('CONFIRMED','WAITING','CANCELED')
//   created_at: string; // DATETIME(6)
// }
