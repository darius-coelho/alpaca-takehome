

export default async function ClinicinaSelector() {

  async function getClin() {  
    const response = await fetch("http://localhost:8000/clinicians_ids");
    const data = await response.json();
    return data['clincian_ids'];    
  }

  const clinicians = await getClin();

  return (
    <div>
      <select>
        {clinicians.map((clinician: any) => (  
          <option key={clinician}>{clinician}</option>
        ))}
      </select>      
    </div>
  );
}




