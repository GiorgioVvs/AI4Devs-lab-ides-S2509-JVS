# Ticket 1: Database Setup
## Title: DB: Define Candidate Entity Model and Run PostgreSQL Migration

**Description**: Set up the database foundation for the new candidate feature. This involves defining the data model (entity) for a Candidate and running the initial migration in PostgreSQL. This table will store all personal information and a reference to the candidate's CV.

### Tasks / Acceptance Criteria:

- Define the Candidate entity/model in the ORM (Object-Relational Mapping).
- The model must include the following fields based on the story:
	- first_name (string, required)
	- last_name (string, required)
	- email (string, required, unique)
	- phone (string, required)
	- address (string, required)
	- education (JSONB or text, required, to store structured data)
	- work_experience (JSONB or text, required, to store structured data)
	- cv_file_path (string, nullable, to store the path to the uploaded file in blob storage/S3)
- Generate the database migration file based on the new model.
- Execute the migration against the development (PostgreSQL) database to create the candidates table.