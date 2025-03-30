'use client';

import { useState, useEffect } from "react";
import Link from 'next/link'

export default function Home() {
  const [clinicians, setClinicians] = useState([]);
  const [selectedClincian, setSelectedClinician] = useState("");

  const onChange = (event: any) => {
    setSelectedClinician(event.target.value);
  };

  async function getClincians() {    
    const response = await fetch("http://localhost:8000/clinicians_ids");
    const data = await response.json();    
    setClinicians(() => data['clincican_ids']);
    setSelectedClinician(() => data['clincican_ids'][0]);
  }  

  useEffect(() => {
    getClincians();
  }, []);  

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 p-8 text-center">
      <div style={{ fontSize: '24px', fontWeight: 'bold' }}>Select a clinician:</div>
      <select style={{ border: '1px solid #ccc', width: '100px'  }} onChange={onChange} value={selectedClincian}>
        {clinicians.map((clinician: any) => ( 
          <option key={clinician}>{clinician}</option>
        ))}
      </select>      
      <Link href={{pathname: "/scheduler", query: {clincian_id: selectedClincian}}}>Get Schedule</Link>
    </div>
  );
}
