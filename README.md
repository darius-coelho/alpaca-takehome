# Alpaca Health Software Engineering Take-Home Project

### Project Description

Visit this link for details:
[https://harviio.notion.site/Alpaca-Health-Eng-Take-home-Project-1411bfc50b90803382d4cae01f9bcf18?pvs=4](https://www.notion.so/harviio/ABA-Session-Note-Generator-Take-Home-Project-1411bfc50b90803382d4cae01f9bcf18?pvs=4)

## Setup Instructions

### Backend Setup (Python 3.11+ required)

```bash
# Create and activate virtual environment
python -m venv alpaca_venv
source alpaca_venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Start the server
fastapi dev main.py
```

### Frontend Setup (Node.js 18+ required)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Default Project Structure

- `frontend/`: Next.js application
  - `src/components/`: Reusable React components
  - `src/app/`: Next.js app router pages
- `backend/`: FastAPI application
  - `app/main.py`: API endpoints

## Development

- Frontend runs on port 3000 with hot reload enabled
- Backend runs on port 8000 with auto-reload enabled
- API documentation available at http://localhost:8000/docs

## Submission

1. Create a private GitHub repository
2. Implement your solution
3. Document any assumptions or trade-offs
4. Include instructions for running your solution
5. Send us the repository link

## Time Expectation

- Expected time: 3-4 hours
- Please don't spend more than 6 hours

## Evaluation Criteria

| Category | Details | Weight |
|----------|---------|--------|
| Product sense and scoping | - Final product decisions alignment with requirements<br>- Appropriate deprioritization of non-crucial parts | 10% |
| Technology selection | - Right tools chosen for the job | 10% |
| Technical Level | - Well-organized and intuitive code structure<br>- Modular code (e.g., React components used)<br>- Proper use of React hooks<br>- Good state management<br>- Correct use of useEffect hooks | 40% |
| Craft and Quality | - Usable and intuitive UI/UX<br>- Presence and severity of bugs | 20% |
| Documentation | - Clear communication of logic and technical decisions in README | 10% |
| Testing | - Presence of tests<br>- Quality and robustness of tests | 10% |


## Approach and challenge

The app enables a clinician to see a list of schedule options, inspect the details of each option, and select a desired option.

Challenges and approaches are:
1) There are multiple clinicians, so we must create multiple schedule options for each clinician
2) The schedule computation is time-intensive, so we can pre-compute the schedule options on the backend.
3) After a clinician makes a selection, the backend must update the options for other clinicians. During this period, other clinicians must wait for the update to finish.


## Design decisions

The front-end UX for the clinician would be they first provide their ID. Based on the ID, the frontend will request the backend to check if the ID exists. If  it does, the user will move to the scheduling page as shown in the provided sample image. On this page the user may view the details of various schedule options and select one schedule option. The user can keep an option selected but view details of different options. If another clinician made a selection, then the current clinician should see a "Schedule Stale" message and wait for an updated schedule. 

On the backend, we can precompute the schedules when the data is loaded initially and store them for retrieval. Every time a clinician selects a schedule, we can update or recompute the schedules for other physicians. We would need to maintain a flag that indicated if the schedules are up-to-date. This flag would be checked every time a clinician tries to select a schedule option.

## Assumptions

I assumed that all clinicians and patients in the dataset were in California

## Sources

Google, Stackoverflow, and Next.js api documentation. I tried to use chatgpt to help with the scheduling algorthm but could not find a solution in time. 
