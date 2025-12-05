import React from 'react';
import Background from '../../components/Background';
import CsvUploadAndEdit from '../../components/admin/CsvUploadAndEdit';

const DeleteProduct = () => {
    const handleDelete = (data) => {
        console.log("Deleting Products (CSV):", data);
        // Here you would send the list of products to delete to your backend
    };

    return (
        <div className="min-h-screen bg-[#050816] text-white relative overflow-hidden">
            <Background />
            <div className="relative z-10 pt-24">
                <CsvUploadAndEdit
                    title="Supprimer des Produits"
                    onSave={handleDelete}
                    type="product"
                    theme="red"
                    apiEndpoint="delete_product"
                />
            </div>
        </div>
    );
};

export default DeleteProduct;
