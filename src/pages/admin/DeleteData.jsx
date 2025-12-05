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
                    apiEndpoint="delete_data"
                />
            </div>
        </div>
    );
};

export default DeleteData;
