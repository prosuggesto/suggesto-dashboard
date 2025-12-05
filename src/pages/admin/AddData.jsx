import React from 'react';
import Background from '../../components/Background';
import CsvUploadAndEdit from '../../components/admin/CsvUploadAndEdit';

const AddData = () => {
    const handleSave = (data) => {
        console.log("Adding Info Data:", data);
        // Here you would send 'data' to your backend
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
            <Background />
            <div className="relative z-10 pt-24">
                <CsvUploadAndEdit
                    title="Ajouter une Info"
                    onSave={handleSave}
                    type="data"
                    apiEndpoint="https://n8n.srv862127.hstgr.cloud/webhook/ajouter_infos"
                    apiHeaders={{ "ajouter.info": "ajouter.info002" }}
                />
            </div>
        </div>
    );
};

export default AddData;
