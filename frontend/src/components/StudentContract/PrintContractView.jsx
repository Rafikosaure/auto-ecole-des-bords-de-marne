import React from 'react'
import PrintContractViewerWindow from './PrintContractViewerWindow'
import PrintContractButton from '../StudentContract/PrintContractButton'
import './PrintContractStyles.css'




export default function PrintContractView({ setNumberOfComponent, student }) {
    return (
        <section className="contract-view-section mt-4 mb-3 container-md d-flex flex-column justify-content-between border border-lightgrey border-1 rounded">
            <div style={{ marginLeft: 'auto', marginRight: 'auto', marginTop: '10px', marginBottom: '10px' }}>
                <PrintContractButton setNumberOfComponent={setNumberOfComponent} student={student} /></div>
            <div className="contract-view-main d-flex flex-column">
                <div className="d-flex justify-content-center align-items-center" style={{ width: "auto", height: "20px", fontSize: "12px",                 backgroundColor: "lightgreen" }}>Modifiez le document si nécessaire
                </div>
                <div className="viewer container-md d-flex justify-content-center align-items-center bg-secondary bg-opacity-25 mb-3">                    
                    <PrintContractViewerWindow setNumberOfComponent={setNumberOfComponent} student={student} />
                </div>
            </div>
        </section>    
    )
}
