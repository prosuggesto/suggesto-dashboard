import React from 'react';
import Background from '../../components/Background';
import CsvUploadAndEdit from '../../components/admin/CsvUploadAndEdit';

const EditData = () => {
    const handleSave = (data) => {
        console.log("Editing Info Data:", data);
        // Here you would send 'data' to your backend
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
            <Background />
            <div className="relative z-10 pt-24">
                <CsvUploadAndEdit
                    title="Modifier une Info"
                    onSave={handleSave}
                    type="data"
                    theme="purple"
                    apiEndpoint="edit_data"
                />
            </div>
        </div>
    );
};

export default EditData;
