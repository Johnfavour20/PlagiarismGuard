# 🛡️ PlagiarismGuard: Mock Blockchain Plagiarism Detector

PlagiarismGuard is a sophisticated, fully client-side simulation of a blockchain-powered plagiarism detection system designed for academic institutions. It provides a secure, transparent, and seemingly decentralized way to verify the originality of academic documents, all without needing a backend server or a real blockchain connection.

This application runs entirely in your browser, utilizing `localStorage` to create a persistent mock database for users, submissions, and plagiarism reports.

## ✨ Key Features

- **Role-Based Access Control**: Separate, feature-rich dashboards for Students, Lecturers, and Administrators.
- **Secure Document Upload**: A user-friendly interface for uploading documents (`.txt`, `.pdf`, `.docx`).
- **Complete Client-Side Processing**: All logic, including file reading, text extraction, hashing, and plagiarism analysis, is handled efficiently within the browser.
- **Realistic Plagiarism Detection**: The system compares uploaded documents against a simulated database of all previous submissions stored locally.
- **Detailed Plagiarism Reports**: Generates comprehensive reports showing:
  - An overall similarity score.
  - A list of matched source documents.
  - A full-text view with plagiarized paragraphs highlighted.
- **Simulated Blockchain Verification**:
  - Each document is processed into a collection of paragraph hashes.
  - A **Merkle Tree** is constructed from these hashes.
  - The resulting **Merkle Root** is stored as an immutable, verifiable record, simulating a blockchain transaction hash.
- **Dynamic Admin Dashboard**: Provides a high-level overview of system statistics, including total users, number of submissions, and flagged documents.
- **Zero Dependencies**: No backend, no database, no build process required. Just open `index.html` and the app is live.
- **Modern & Responsive UI**: Built with React, TypeScript, and Tailwind CSS for a seamless experience on any device.

---

## 🚀 How It Works: The Mock Architecture

The entire application is brought to life using the browser's built-in capabilities. Here’s a breakdown of the core simulation logic:

#### 1. Mock Database (`localStorage`)
- **Users**: On first launch, the app seeds `localStorage` with three default users (Admin, Lecturer, Student). New user registrations are added to this local store.
- **Submissions**: When a document is uploaded, its full text, metadata, generated hashes, and plagiarism report are stored as a single JSON object in a `submissions` array in `localStorage`.

#### 2. The Plagiarism Check Workflow
1.  **File Reading & Text Extraction**: The app uses the `FileReader` API to read files. For `.docx` and `.pdf`, it uses client-side libraries (`mammoth.js`, `pdf.js`) to extract plain text content.
2.  **Paragraph Segmentation**: The text is split into individual paragraphs. Paragraphs below a certain length are ignored to reduce noise.
3.  **Hashing**: Each paragraph is converted into a unique **SHA-256 hash** using `Crypto-JS`.
4.  **Comparison**: The app iterates through every paragraph hash of the new document and compares it against all paragraph hashes of *every previously submitted document* stored in `localStorage`.
5.  **Report Generation**: A similarity score is calculated (`(matched_paragraphs / total_paragraphs) * 100`). A list of source documents that contain matching hashes is compiled.
6.  **Status Assignment**: If the similarity score exceeds a threshold (e.g., 25%), the submission is marked as `flagged`; otherwise, it's `verified`.

#### 3. The Blockchain Simulation
Instead of connecting to a real blockchain, we simulate its core principle of verifiable integrity using a **Merkle Tree**.

1.  The list of paragraph hashes serves as the "leaf nodes" of the tree.
2.  The application recursively hashes pairs of nodes together until a single hash remains—the **Merkle Root**.
3.  This Merkle Root is stored with the submission record. It acts as a unique, tamper-proof fingerprint for the document's content at the time of submission. Any change to a single character in the document would result in a completely different Merkle Root.

---

## 🛠️ Technology Stack

- **Frontend**: React, TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Form Management**: Formik & Yup
- **Hashing**: Crypto-JS
- **Notifications**: React Toastify
- **Document Parsing**: Mammoth.js (for .docx), PDF.js (for .pdf)

---

## 🚦 Getting Started & How to Run

This application is designed to run instantly without any setup.

1.  Ensure all the project files are in the same directory.
2.  Open the `index.html` file directly in a modern web browser (like Chrome, Firefox, or Edge).
3.  The application will be fully functional.

### 🔑 Demo Credentials

Use the following pre-seeded accounts to explore the different user roles. You can also register new accounts.

| Role     | Email                      | Password    |
| :------- | :------------------------- | :---------- |
| **Admin**  | `admin@uniport.edu.ng`     | `admin123`  |
| **Lecturer**| `lecturer@uniport.edu.ng`  | `lecturer123` |
| **Student** | `student@uniport.edu.ng`   | `student123`|

**To test the plagiarism checker:**
1. Log in as a student (e.g., `student@uniport.edu.ng`).
2. Upload a document. It will be marked as "Verified" with a 0% similarity score.
3. Log out and log in as another user (or register a new one).
4. Upload the *exact same document*. The system will now flag it with a 100% similarity score and link to the first submission as the source.
5. Try uploading a document that is partially similar to see the highlighting in action.