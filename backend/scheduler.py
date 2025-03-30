from itertools import permutations
from datetime import datetime, timedelta

from driveTimes import CITY_DRIVE_TIMES, get_drive_time, get_travel_window

# Function to convert time string to datetime object
def time_to_datetime(time_str):
    return datetime.strptime(time_str, "%H:%M")

# Function to convert datetime object back to time string
def datetime_to_time(dt):
    return dt.strftime("%I:%M %p")

# Calculate if there's enough time to travel between two cities and see the next patient
def can_schedule_appointment(current_time, travel_time, session_duration, max_end_time):
    # Add the travel time to the current appointment time
    arrival_time = current_time + timedelta(minutes=travel_time)
    # Check if there's enough time to schedule the next session
    end_time = arrival_time + timedelta(hours=session_duration)
    return end_time <= max_end_time, arrival_time

# Create the possible schedules based on availability and travel times
def generate_schedules(clients, provider):
    
    schedule_options = {}

    max_clients_per_day = provider["max_clients_per_day"]
    session_duration_hours = provider["session_duration_hours"]

    client_availabilities = []    
    client_info = {}
    

    for client in clients:
        client_info[client["id"]] = {
            'address': client["address"],
            'name': client["name"]
        }
        for availability in client["availabilities"]:
            client_availabilities.append((client["id"], availability["day_of_the_week"], availability["start_time"], availability["end_time"]))

    
    # List all cities and their drive times    
    for availability in provider["availabilities"]:

        day_of_week = availability["day_of_the_week"]
        clinician_start_time = time_to_datetime(availability["start_time"])
        clinician_end_time = time_to_datetime(availability["end_time"])        
        origin_address = provider["address"]
                                  
        #Filter clients by day of the week
        clients_on_day = [client for client in client_availabilities if client[1] == day_of_week]       
        #Sort clients by start time
        clients_on_day.sort(key=lambda x: time_to_datetime(x[2])) 

        day_schedule_options = []
        # Generate all possible schedules for the day
        break
        for client_set in permutations(clients_on_day, len(clients_on_day)):

            day_schedule = []
            clients = []
            session_end_time = clinician_start_time
            day_schedule_duration = 0
            total_drive_time = 0

            for client in client_set:
                # Check if there's enough time to schedule the next session
                drive_time = get_drive_time(origin_address, client_info[client[0]]["address"])
                arrival_time = session_end_time + timedelta(minutes=drive_time)
                new_session_end_time = arrival_time + timedelta(hours=session_duration_hours)

                client_start_time = time_to_datetime(client[2])
                client_end_time = time_to_datetime(client[3])

                # Check if client can be scheduled                            
                if client_start_time >= arrival_time and client_end_time <= new_session_end_time and new_session_end_time <= clinician_end_time and client[0] not in clients: 
                    day_schedule.append({
                        "type": "drive",
                        "duration": drive_time
                    })
                    day_schedule.append({   
                        "type": "appointment",
                        "patient": client_info[client[0]]["name"],
                        "start_time": datetime_to_time(arrival_time),
                        "end_time": datetime_to_time(session_end_time),
                        "address": client_info[client[0]]["address"]
                    })
                    clients.append(client[0])
                    day_schedule_duration += session_duration_hours
                    total_drive_time += drive_time
                    session_end_time = new_session_end_time

            day_schedule_options.append({
                "day_schedule_duration": day_schedule_duration,
                "total_drive_time": total_drive_time,
                "daySchedule": day_schedule
            })


        #sort day_schedule_options by day_schedule_duration
        day_schedule_options = sorted(day_schedule_options, key=lambda x: x["day_schedule_duration"], reverse=True)
        # Add the day schedule options to the schedule options
        option_id = 0
        for day_schedule_option in day_schedule_options:
            if option_id not in schedule_options:
                schedule_options[option_id] = {
                    "schedule": [{
                        "day_of_the_week": day_of_week,
                        "daySchedule": day_schedule_option["daySchedule"]
                    }]        
                }
            else:
                schedule_options[option_id]["schedule"].append({
                    "day_of_the_week": day_of_week,
                    "daySchedule": day_schedule_option["daySchedule"]
                })
            option_id += 1

    return schedule_options
            

     



            
            
            


        



