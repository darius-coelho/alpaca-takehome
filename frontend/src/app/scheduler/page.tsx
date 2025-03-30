'use client';

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const dayToWord:Record<number, string> = {
  1: "Monday",
  2: "Tuesday",
  3: "Wednesday",
  4: "Thursday",
  5: "Friday",
  6: "Saturday",
  7: "Sunday",
}

function Loading() {
  return <h2>🌀 Loading...</h2>;
}

// Sample data for testing
const scheduleOptionsSample = [
  {
    id: 0,
    name: 'Option 1',
    totalTime: 2,
    driveTime: 1,
    clients: ['Client A', 'Client B'],
    schedule: [
      {
        day_of_the_week: 1,
        daySchedule: [
          {
            type: "appointment",
            patient: "Client A",
            start_time: '9:00 AM',
            end_time: '10:00 AM',
            address: "123 Main St, Anytown, USA"
          },
          {
            type: "drive",
            duration: "25m",            
          },
          {
            type: "appointment",
            patient: "Client B",
            start_time: '01:00 PM',
            end_time: '03:00 PM',
            address: "456 Main St, Anytown, USA"
          }
        ]
      }
    ]
  },
  {
    id: 1,
    name: 'Option 2',
    totalTime: 2,
    driveTime: 1,
    clients: ['Client C', 'Client D'],
    schedule: [
      {
        day_of_the_week: 1,
        daySchedule: [
          {
            type: "appointment",
            patient: "Client C",
            start_time: '9:00 AM',
            end_time: '10:00 AM',
            address: "123 Main St, Anytown, USA"
          },
          {
            type: "drive",
            duration: "35m",            
          },
          {
            type: "appointment",
            patient: "Client D",
            start_time: '01:00 PM',
            end_time: '03:00 PM',
            address: "456 Main St, Anytown, USA"
          }
        ]
      }
    ]
  }
]

export default function Scheduler() {

  const [scheduleOptions, setScheduleOptions] = useState<any>([]);
  const [selectedOption, setSelectedOption] = useState(0);
  const [selectedDetail, setSelectedDetail] = useState(0);
  
  const searchParams = useSearchParams();
  const clincianId = searchParams.get("clincian_id");

  async function getClincianShedule() {    
    const response = await fetch(`http://localhost:8000/clinician_schedule?clincian_id=${clincianId}`);
    const data = await response.json();    
    console.log(data)
    setScheduleOptions(scheduleOptionsSample);
  }

  useEffect(() => {
    getClincianShedule();
  })
  console.log(clincianId)

  const onSelectOption = (id: number) => {
    setSelectedOption(id);
    setSelectedDetail(id);
  }

  const onSelectDetail = (id: number) => {
    setSelectedDetail(id);
  }

  if(scheduleOptions.length === 0) return <div>No Schedules</div>;

  return (
    <div className="flex min-h-screen flex-col" style={{ padding: '20px' }}>
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Compatible Client Schedules:</div>
      <div style={{ fontSize: '14px', marginTop: '5px', color: 'gray' }}>Select a schedule option that works for you. Each option shows available timeslots, drive times, and the clients who share this schedule.</div> 
      <Suspense fallback={<Loading />}>
        <ScheduleOptions options={scheduleOptions} onSelectOption={onSelectOption} selectedOption={selectedOption} onSelectDetail={onSelectDetail}/>
        <ScheduleDetails schedule={scheduleOptions[+selectedDetail]} />
      </Suspense>     
    </div>
  );
}

function ScheduleOptions(props: any) {
  const { options, onSelectOption, selectedOption, onSelectDetail } = props;
  return (
    <div style={{ display: "flex", overflowX: "auto", whiteSpace: "nowrap", gap: "10px", padding: 10, width: "100%" }}>
      {options.map((option: any) => (
        <OptionOverview key={option.id} schedule={option} onSelectOption={onSelectOption} selectedOption={selectedOption} onSelectDetail={onSelectDetail}/>
      ))}
    </div>
  );  
}

function OptionOverview(props: any) {
  const { schedule, onSelectOption, selectedOption, onSelectDetail } = props;
  const border = selectedOption === schedule.id ? "3px solid #000" : "1px solid #ccc";
  const buttonStyle = selectedOption === schedule.id
                      ? "px-4 py-2 border border-gray-500 bg-black text-white rounded-lg shadow-sm hover:bg-gray-100 active:bg-gray-200 transition"
                      : "px-4 py-2 border border-gray-500 bg-white text-gray-800 rounded-lg shadow-sm hover:bg-gray-100 active:bg-gray-200 transition";
  return (
    <div style={{ border: border, borderRadius: '5px', padding: '10px', marginBottom: '10px',display: "flex", flexDirection: "column"}}>    
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{schedule.name}</div>
      <div style={{ fontSize: '14px', marginTop: '5px' }}>Total Time: {schedule.totalTime} hours</div>
      <div style={{ fontSize: '14px', marginTop: '5px' }}>Drive Time: {schedule.driveTime} hours</div>
      <div style={{ fontSize: '14px', marginTop: '5px' }}>Clients:</div>

      <div>Preview:</div>
      <button
        className="px-4 py-2 border border-gray-500 bg-white text-gray-800 rounded-lg shadow-sm hover:bg-gray-100 active:bg-gray-200 transition"
        style={{ fontSize: '14px', marginTop: '5px' }}
        onClick={() => onSelectDetail(schedule.id)}>
          View Detailed Schedule
      </button>
      <button
        className={buttonStyle}
        style={{ fontSize: '14px', marginTop: '5px' }}
        onClick={() => onSelectOption(schedule.id)}>
          {selectedOption === schedule.id ? "Selected" : "Select Schedule"}
      </button>
    </div>
  );
}

function ScheduleDetails(props: any) {
  const schedule = props.schedule;
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', margin: '10px',display: "flex", flexDirection: "column"}}> 
      <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{`Schedule ${schedule.name} Details`}</div>
      <div style={{ fontSize: '14px', marginTop: '5px', color: 'gray' }}>{`${schedule.totalTime} hours total | ${schedule.driveTime} drive time`}</div>
    <div style={{ display: "flex", overflowX: "auto", whiteSpace: "nowrap", gap: "10px", padding: 10, width: "100%" }}>      
      {schedule.schedule.map((daySchedule: any) => (
        <DaySchedule key={daySchedule.day_of_the_week} daySchedule={daySchedule} />
      ))}
    </div>
    </div>
  );
  
}

function Appointment(props: any) {
  const appointment = props.appointment;
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '10px',display: "flex", flexDirection: "column"}}>    
      <div style={{ fontSize: '14px', marginTop: '5px' }}>{appointment.start_time} - {appointment.end_time}</div>
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{appointment.patient}</div>
      <div style={{ fontSize: '14px', marginTop: '5px' }}>{appointment.address}</div>      
    </div>
  );
}

function Drive(props: any) {
  const drive = props.drive;
  return (
    <div style={{ borderLeft: '5px solid #ccc', padding: '10px', marginBottom: '10px',display: "flex", flexDirection: "column"}}>    
      <div style={{ fontSize: '14px', marginTop: '5px' }}>{drive.duration} drive time</div>
    </div>
  );
}

function DaySchedule(props: any) {
  const daySchedule = props.daySchedule;  
  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '5px', padding: '10px', marginBottom: '10px',display: "flex", flexDirection: "column"}}>    
      <div style={{ fontSize: '18px', fontWeight: 'bold' }}>{dayToWord[Number(daySchedule.day_of_the_week)]}</div>
      {daySchedule.daySchedule.map((scheduleItem: any) => (
        <div key={scheduleItem.type + scheduleItem.start_time}>
          {scheduleItem.type === "appointment" && <Appointment appointment={scheduleItem} />}
          {scheduleItem.type === "drive" && <Drive drive={scheduleItem} />}
        </div>
      ))}
    </div>
  );

}