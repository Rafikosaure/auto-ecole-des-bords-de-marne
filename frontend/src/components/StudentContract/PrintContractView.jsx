import React from 'react'
import PrintContractViewerWindow from './PrintContractViewerWindow'
import './PrintContractStyles.css'




export default function PrintContractView() {
    return (
        <section className="contract-view-section mb-3 container-md d-flex flex-column justify-content-between border border-lightgrey border-1 rounded">
            <div className="contract-view-main d-flex flex-column">
                <div className="d-flex justify-content-center align-items-center" style={{ width: "auto", height: "20px", fontSize: "12px",                 backgroundColor: "lightgreen" }}>Modifiez le document si nécessaire
                </div>
                <div className="viewer container-md d-flex justify-content-center align-items-center bg-secondary bg-opacity-25 mb-3">                    
                    <PrintContractViewerWindow />
                </div>
            </div>
        </section>    
    )
}
