import React from 'react';
import Background from '../../components/Background';
import CsvUploadAndEdit from '../../components/admin/CsvUploadAndEdit';

const AddProduct = () => {
    const handleSave = (data) => {
        console.log("Adding Product Data:", data);
        // Here you would send 'data' to your backend
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
            <Background />
            <div className="relative z-10 pt-24">
                <CsvUploadAndEdit
                    title="Ajouter un Produit"
                    onSave={handleSave}
                    type="product"
                    apiEndpoint="https://n8n.srv862127.hstgr.cloud/webhook/ajouter_produits"
                    apiHeaders={{ "ajouter.produit": "ajouter.produit001" }}
                />
            </div>
        </div>
    );
};

export default AddProduct;
