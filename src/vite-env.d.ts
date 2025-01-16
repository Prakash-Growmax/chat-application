interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  readonly VITE_API_URL: string;
  readonly VITE_AWS_ACCESS_KEY_ID: string;
  readonly VITE_AWS_SECRET_ACCESS_KEY: string;
  readonly VITE_S3_BUCKET_NAME: string;
  readonly VITE_S3_REGION: string;
  readonly VITE_ANALYSIS_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
