from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Farm Seeva AI Engine"
    API_V1_STR: str = "/api/v1"
    BACKEND_CORS_ORIGINS: list[str] = ["*"]
    CLAUDE_API_KEY: str = ""
    
    class Config:
        env_file = ".env"

settings = Settings()
