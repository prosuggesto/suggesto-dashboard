import React from 'react';
import Background from '../../components/Background';
import CsvUploadAndEdit from '../../components/admin/CsvUploadAndEdit';

const DeleteData = () => {
    const handleDelete = (data) => {
        console.log("Deleting Info (CSV):", data);
        // Here you would send the list of info to delete to your backend
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
            <Background />
            <div className="relative z-10 pt-24">
                <CsvUploadAndEdit
                    title="Supprimer des Infos"
                    onSave={handleDelete}
                    type="data"
                    theme="red"
                    apiEndpoint="https://n8n.srv862127.hstgr.cloud/webhook/supprimer_infos"
                    apiHeaders={{ "supprime": "supprime.002" }}
                />
            </div>
        </div>
    );
};

export default DeleteData;
