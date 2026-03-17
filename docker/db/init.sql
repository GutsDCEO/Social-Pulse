-- init.sql
-- Initializes the necessary schema or extensions for SocialPulse.
-- Note: Spring Boot (Hibernate) will automatically create the tables via ddl-auto=update.

-- We can use this file for creating necessary extensions like uuid-ossp if needed.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- If we ever need to create schemas or specific DB roles, they go here.
-- CREATE SCHEMA IF NOT EXISTS "socialpulse_schema";
