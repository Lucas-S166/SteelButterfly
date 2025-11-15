from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/line")
def get_line_data():
    return {
        "x": [1, 2, 3, 4, 5],
        "y": [10, 8, 12, 15, 14]
    }
