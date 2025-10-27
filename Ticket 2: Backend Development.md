# Ticket 2: Backend Development
## Title: BE: Implement API Endpoint (POST /api/candidates) for Candidate Creation

**Description**: Develop the backend service logic to handle the submission of the new candidate form. This includes creating an API endpoint that validates incoming data, processes the CV file upload, and saves the new candidate record to the database.

### Tasks / Acceptance Criteria:

- Create a new API route: POST /api/candidates.
- The endpoint must accept multipart/form-data to handle both form fields and the file upload.
- Implement server-side validation for all mandatory fields (Name, Last Name, Email, Phone, Address, Education, Experience).
- Add specific validation to ensure email has a valid format and is unique in the database.
- Implement file upload logic:
	- Validate the file type (must be PDF or DOCX).
	- Securely store the uploaded file (e.g., in an S3 bucket or local file storage).
- On successful validation and file upload, create and save the new Candidate record in the PostgreSQL database.
- Implement robust error handling:
	- Return 400 Bad Request for validation errors.
	- Return 500 Internal Server Error for database or file storage failures.
- Return a 201 Created response with the new candidate's data (or a success message) upon successful creation.
- Ensure all personal data is handled securely and follows privacy best practices.