// ---------- /images ----------

export interface ImageUploadRequest {
  image: File;
}

export interface ImageUploadResponse {
  key: string;
  url: string;
}
