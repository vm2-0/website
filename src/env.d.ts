declare namespace NodeJS {
  interface ProcessEnv {
    RPC_URL?: string;
    VIRAL_TOKEN?: string;
    OPENAI_API_KEY?: string;
    ANTROPIC_API_KEY?: string;
    DB_URI?: string;
    IPC_SECRET?: string;
    FEEDBACK_WEBHOOK?: string;
    AWS_ACCESS_KEY?: string;
    AWS_SECRET_KEY?: string;
  }
}
