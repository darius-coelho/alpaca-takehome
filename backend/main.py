from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from clientData import clients
from clinicianData import clinicians

from scheduler import generate_schedules 


print("Number of clients:", len(clients))


app = FastAPI(docs_url="/api/py/docs")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def health_check():
    return {"status": "healthy"+str(len(clients))}


@app.get("/clinicians_ids")
async def get_clinicians():
    clincican_ids = [clinician["id"] for clinician in clinicians]
    return {"clincican_ids": clincican_ids}

@app.get("/clinician_schedule")
async def get_clinician_shedule(clincian_id: str):
    clinician = [clinician for clinician in clinicians if clinician["id"] == clincian_id][0]    
    schedule = generate_schedules(clients, clinician)
    return {"clincican_schedule": schedule}



