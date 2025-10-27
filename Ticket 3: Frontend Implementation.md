# Ticket 3: Frontend Implementation
## Title: FE: Build Candidate Registration Form UI and Dashboard Integration

**Description**: Develop the user interface components required for a recruiter to add a new candidate. This includes adding an access point from the dashboard, building the complete registration form, handling client-side validation, and integrating with the new backend API.

### Tasks / Acceptance Criteria:

- Add a clearly visible "Add New Candidate" button or link on the main recruiter dashboard.
- Clicking the button must display the new candidate registration form (e.g., as a modal or a new page).
- Implement the form with all required input fields:
	- First Name, Last Name, Email, Phone, Address, Education (textarea or structured input), Work Experience (textarea or structured input).
- Implement a file upload component restricted to PDF and DOCX formats for the CV.
- Implement client-side validation:
	- Check for empty mandatory fields before submission.
	- Validate the email address format.
- On form submission, send the data (using multipart/form-data) to the POST /api/candidates backend endpoint.
- Handle success: Display a clear confirmation message (e.g., "Candidate added successfully") upon receiving a 2xx response.
- Handle errors: Display an informative error message (e.g., "Failed to add candidate: [error]") if the API returns an error.
- The form and its components must be responsive and accessible across different devices and browsers.
- (Optional/Follow-up): Implement autocomplete suggestions for "Education" and "Experience" fields (this may require a separate BE ticket for data retrieval).