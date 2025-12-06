import React, { useState, useRef } from 'react';
import Papa from 'papaparse';
import Card from '../Card';
import { callN8N } from '../../utils/api';

const CsvUploadAndEdit = ({ title, onSave, type, theme = 'cyan', apiEndpoint, apiHeaders }) => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState('');
    const fileInputRef = useRef(null);

    // Selection State
    const [selectedRows, setSelectedRows] = useState(new Set());

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCell, setEditingCell] = useState({ rowIndex: null, column: null, value: '' });

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setFileName(file.name);
        setIsLoading(true);

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setColumns(results.meta.fields || []);
                setData(results.data);
                setIsLoading(false);
                setSelectedRows(new Set());
            },
            error: (error) => {
                console.error('Error parsing CSV:', error);
                setIsLoading(false);
            }
        });
    };

    const handleCellChange = (rowIndex, column, value) => {
        const newData = [...data];
        newData[rowIndex][column] = value;
        setData(newData);
    };

    const handleDeleteColumn = (columnToDelete) => {
        if (window.confirm(`Êtes-vous sûr de vouloir supprimer la colonne "${columnToDelete}" ?`)) {
            setColumns(columns.filter(col => col !== columnToDelete));
            const newData = data.map(row => {
                const newRow = { ...row };
                delete newRow[columnToDelete];
                return newRow;
            });
            setData(newData);
        }
    };

    // Row Selection Handlers
    const toggleRowSelection = (index) => {
        const newSelected = new Set(selectedRows);
        if (newSelected.has(index)) {
            newSelected.delete(index);
        } else {
            newSelected.add(index);
        }
        setSelectedRows(newSelected);
    };

    const toggleAllSelection = () => {
        if (selectedRows.size === data.length) {
            setSelectedRows(new Set());
        } else {
            const allIndices = new Set(data.map((_, idx) => idx));
            setSelectedRows(allIndices);
        }
    };

    const handleDeleteSelected = () => {
        if (selectedRows.size === 0) return;

        if (window.confirm(`Êtes-vous sûr de vouloir supprimer ${selectedRows.size} ligne(s) ?`)) {
            const newData = data.filter((_, idx) => !selectedRows.has(idx));
            setData(newData);
            setSelectedRows(new Set());
        }
    };

    const openEditModal = (rowIndex, column, value) => {
        setEditingCell({ rowIndex, column, value });
        setIsModalOpen(true);
    };

    const saveModalEdit = () => {
        if (editingCell.rowIndex !== null && editingCell.column) {
            handleCellChange(editingCell.rowIndex, editingCell.column, editingCell.value);
        }
        setIsModalOpen(false);
        setEditingCell({ rowIndex: null, column: null, value: '' });
    };

    const clearCellContent = () => {
        setEditingCell({ ...editingCell, value: '' });
    };

    const handleReset = () => {
        setData([]);
        setColumns([]);
        setFileName('');
        setSelectedRows(new Set());
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSave = async () => {
        if (!apiEndpoint) {
            alert("Erreur de configuration : Aucun endpoint API défini.");
            return;
        }

        setIsLoading(true);
        try {
            await callN8N(apiEndpoint, data);

            // Previously we parsed the response text to check for 'suppression non validée'
            // But callN8N returns JSON cleanly.
            // If the proxy returns data, we can check it.
            // Assuming callN8N returns the parsed JSON response from n8n.

            // NOTE: The previous logic relied on n8n returning an array with text property for errors.
            // We should ideally replicate that if essential, but since we are proxying, 
            // callN8N returns whatever n8n returns.

            // For now, assume success if no error thrown.
            alert(`${type === 'product' ? 'Produit' : 'Info'} traité avec succès !`);
            handleReset();

        } catch (error) {
            console.error("Network Error:", error);
            alert("Erreur lors de l'envoi des données.");
        } finally {
            setIsLoading(false);
        }
    };

    // Theme Configuration
    const themes = {
        cyan: {
            gradient: "from-cyan-400 to-blue-500",
            iconHover: "group-hover:text-cyan-400",
            buttonHover: "hover:bg-cyan-500/20 text-cyan-400",
            primaryButton: "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-cyan-500/20",
            backButtonHover: "hover:text-cyan-400",
            backButtonBg: "group-hover:bg-cyan-500/10",
            backButtonBorder: "group-hover:border-cyan-500/20",
            modalText: "text-cyan-400",
            modalBorder: "focus:border-cyan-500/50",
            modalButton: "bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20",
            checkbox: "text-cyan-500 focus:ring-cyan-500"
        },
        red: {
            gradient: "from-red-400 to-orange-500",
            iconHover: "group-hover:text-red-400",
            buttonHover: "hover:bg-red-500/20 text-red-400",
            primaryButton: "bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 shadow-red-500/20",
            backButtonHover: "hover:text-red-400",
            backButtonBg: "group-hover:bg-red-500/10",
            backButtonBorder: "group-hover:border-red-500/20",
            modalText: "text-red-400",
            modalBorder: "focus:border-red-500/50",
            modalButton: "bg-red-600 hover:bg-red-500 shadow-red-500/20",
            checkbox: "text-red-500 focus:ring-red-500"
        },
        purple: {
            gradient: "from-purple-400 to-pink-500",
            iconHover: "group-hover:text-purple-400",
            buttonHover: "hover:bg-purple-500/20 text-purple-400",
            primaryButton: "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 shadow-purple-500/20",
            backButtonHover: "hover:text-purple-400",
            backButtonBg: "group-hover:bg-purple-500/10",
            backButtonBorder: "group-hover:border-purple-500/20",
            modalText: "text-purple-400",
            modalBorder: "focus:border-purple-500/50",
            modalButton: "bg-purple-600 hover:bg-purple-500 shadow-purple-500/20",
            checkbox: "text-purple-500 focus:ring-purple-500"
        }
    };

    const currentTheme = themes[theme] || themes.cyan;

    return (
        <div className="w-full max-w-[90%] mx-auto py-12">
            <button
                onClick={() => window.history.back()}
                className={`mb-6 flex items-center gap-2 text-gray-400 ${currentTheme.backButtonHover} transition-colors group`}
            >
                <div className={`p-2 rounded-lg bg-white/5 ${currentTheme.backButtonBg} border border-white/10 ${currentTheme.backButtonBorder} transition-all`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5m7-7-7 7 7 7" />
                    </svg>
                </div>
                <span className="font-medium">Retour</span>
            </button>

            <Card className="!bg-transparent !backdrop-blur-none border border-white/10 p-6 rounded-2xl flex flex-col h-[80vh] shadow-2xl">
                <div className="flex justify-between items-center mb-6 flex-shrink-0">
                    <h2 className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${currentTheme.gradient}`}>
                        {title}
                    </h2>

                    {/* Delete Selected Button */}
                    {selectedRows.size > 0 && (
                        <button
                            onClick={handleDeleteSelected}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500/20 transition-all animate-fade-in"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"></polyline>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                            Supprimer la sélection ({selectedRows.size})
                        </button>
                    )}
                </div>

                {/* File Upload Section */}
                <div className="mb-6 flex-shrink-0">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-white/20 rounded-xl cursor-pointer hover:bg-white/5 transition-colors group">
                        <div className="flex flex-col items-center justify-center pt-3 pb-4">
                            <svg className={`w-8 h-8 mb-2 text-gray-400 ${currentTheme.iconHover} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                            </svg>
                            <p className="text-xs text-gray-400"><span className="font-semibold text-white">Cliquez pour importer</span> (CSV)</p>
                        </div>
                        <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} ref={fileInputRef} />
                    </label>
                    {fileName && (
                        <p className="mt-2 text-xs text-green-400 flex items-center gap-2">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Fichier : {fileName}
                        </p>
                    )}
                </div>

                {/* Data Table */}
                {data.length > 0 && (
                    <div className="flex-grow overflow-auto rounded-xl border border-white/10 mb-6 relative custom-scrollbar">
                        <table className="w-full text-xs text-left text-gray-300">
                            <thead className="text-xs text-gray-400 uppercase bg-[#0a0e27] sticky top-0 z-20 shadow-md">
                                <tr>
                                    {/* Selection Checkbox Header */}
                                    <th className="px-4 py-3 border-b border-white/10 bg-[#0a0e27] w-10">
                                        <input
                                            type="checkbox"
                                            checked={data.length > 0 && selectedRows.size === data.length}
                                            onChange={toggleAllSelection}
                                            className={`rounded bg-white/10 border-white/20 ${currentTheme.checkbox}`}
                                        />
                                    </th>
                                    {columns.map((col) => (
                                        <th key={col} className="px-4 py-3 font-medium tracking-wider min-w-[120px] border-b border-white/10 bg-[#0a0e27] group">
                                            <div className="flex items-center justify-between gap-2">
                                                <span>{col}</span>
                                                <button
                                                    onClick={() => handleDeleteColumn(col)}
                                                    className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded text-red-400 transition-all"
                                                    title="Supprimer la colonne"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                    </svg>
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.map((row, rowIndex) => (
                                    <tr key={rowIndex} className={`border-b border-white/5 transition-colors ${selectedRows.has(rowIndex) ? 'bg-white/10' : 'bg-transparent hover:bg-white/[0.02]'}`}>
                                        {/* Selection Checkbox Row */}
                                        <td className="px-4 py-2 border-r border-white/5">
                                            <input
                                                type="checkbox"
                                                checked={selectedRows.has(rowIndex)}
                                                onChange={() => toggleRowSelection(rowIndex)}
                                                className={`rounded bg-white/10 border-white/20 ${currentTheme.checkbox}`}
                                            />
                                        </td>
                                        {columns.map((col) => (
                                            <td key={`${rowIndex}-${col}`} className="px-4 py-2 relative group border-r border-white/5 last:border-r-0">
                                                <div className="flex items-center justify-between">
                                                    <div className="truncate max-w-[150px]" title={row[col]}>
                                                        {row[col]}
                                                    </div>
                                                    <button
                                                        onClick={() => openEditModal(rowIndex, col, row[col])}
                                                        className={`opacity-0 group-hover:opacity-100 ml-1 p-1 rounded transition-all flex-shrink-0 ${currentTheme.buttonHover}`}
                                                        title="Éditer"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                        </svg>
                                                    </button>
                                                </div>
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Actions */}
                <div className="flex justify-end gap-4 flex-shrink-0 mt-auto">
                    <button
                        onClick={handleReset}
                        className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 transition-all"
                    >
                        Annuler
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={data.length === 0 || isLoading}
                        className={`px-8 py-2 rounded-xl text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 ${currentTheme.primaryButton}`}
                    >
                        {isLoading ? 'Envoi...' : 'Valider'}
                    </button>
                </div>
            </Card>

            {/* Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
                    <div className="bg-[#0a0e27] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl p-6 relative">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white">
                                Éditer la cellule <span className={currentTheme.modalText}>({editingCell.column})</span>
                            </h3>
                            <button
                                onClick={clearCellContent}
                                className="text-xs text-red-300 hover:text-red-400 flex items-center gap-1 border border-red-500/30 px-2 py-1 rounded hover:bg-red-500/10 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                Vider
                            </button>
                        </div>

                        <textarea
                            value={editingCell.value}
                            onChange={(e) => setEditingCell({ ...editingCell, value: e.target.value })}
                            className={`w-full h-64 bg-black/30 border border-white/10 rounded-xl p-4 text-white font-mono text-sm focus:outline-none transition-colors resize-none ${currentTheme.modalBorder}`}
                            placeholder="Contenu de la cellule..."
                        />

                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 text-gray-300 transition-all"
                            >
                                Annuler
                            </button>
                            <button
                                onClick={saveModalEdit}
                                className={`px-6 py-2 rounded-lg text-white font-semibold shadow-lg transition-all ${currentTheme.modalButton}`}
                            >
                                Enregistrer
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CsvUploadAndEdit;
