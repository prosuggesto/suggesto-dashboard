import React from 'react';
import Background from '../../components/Background';
import CsvUploadAndEdit from '../../components/admin/CsvUploadAndEdit';

const EditProduct = () => {
    const handleSave = (data) => {
        console.log("Editing Product Data:", data);
        // Here you would send 'data' to your backend
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
            <Background />
            <div className="relative z-10 pt-24">
                <CsvUploadAndEdit
                    title="Modifier un Produit"
                    onSave={handleSave}
                    type="product"
                    theme="purple"
                    apiEndpoint="https://n8n.srv862127.hstgr.cloud/webhook/modifier_produits"
                    apiHeaders={{ "modifier": "modifier.001" }}
                />
            </div>
        </div>
    );
};

export default EditProduct;
