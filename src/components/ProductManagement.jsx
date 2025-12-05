import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import { callN8N } from '../utils/api';

// Custom Select Component
const CustomSelect = ({ value, onChange, options, focusClass }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedLabel = options.find(opt => opt.value === value)?.label || value;

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onBlur={() => setTimeout(() => setIsOpen(false), 200)}
                className={`w-full bg-blue-900/20 border border-blue-500/30 rounded-xl px-4 py-3 text-white font-medium text-left flex items-center justify-between transition-colors ${focusClass}`}
            >
                <span className={value ? 'text-white' : 'text-gray-400'}>{selectedLabel}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''} text-gray-400`}
                >
                    <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-[#0a0e27] border border-white/10 rounded-xl overflow-hidden z-50 shadow-xl animate-fade-in">
                    {options.map((opt) => (
                        <div
                            key={opt.value}
                            onClick={() => {
                                onChange(opt.value);
                                setIsOpen(false);
                            }}
                            className="px-4 py-3 cursor-pointer text-white transition-colors hover:text-cyan-400 hover:bg-white/5"
                        >
                            {opt.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ProductManagement = () => {
    const navigate = useNavigate();
    const [action, setAction] = useState('add'); // add, edit, delete
    const [type, setType] = useState('product'); // product, data
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Dynamic styles based on action
    const getStyles = () => {
        switch (action) {
            case 'add':
                return {
                    border: '!border-cyan-500/20',
                    gradient: 'from-cyan-500 to-blue-500',
                    iconBg: 'bg-cyan-500/10',
                    iconColor: 'text-cyan-400',
                    button: 'from-cyan-600 to-blue-600 shadow-cyan-500/20',
                    focus: 'focus:border-cyan-500/50'
                };
            case 'edit':
                return {
                    border: '!border-violet-500/20',
                    gradient: 'from-violet-500 to-fuchsia-500',
                    iconBg: 'bg-violet-500/10',
                    iconColor: 'text-violet-400',
                    button: 'from-violet-600 to-fuchsia-600 shadow-violet-500/20',
                    focus: 'focus:border-violet-500/50'
                };
            case 'delete':
                return {
                    border: '!border-red-500/20',
                    gradient: 'from-red-500 to-orange-500',
                    iconBg: 'bg-red-500/10',
                    iconColor: 'text-red-400',
                    button: 'from-red-600 to-orange-600 shadow-red-500/20',
                    focus: 'focus:border-red-500/50'
                };
            default:
                return {};
        }
    };

    const styles = getStyles();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // Using Vercel Proxy
            const data = await callN8N('check_password', { password });

            // const response = await fetch("https://n8n.srv862127.hstgr.cloud/webhook/mot_de_passe", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         "valid": "correct.01"
            //     },
            //     body: JSON.stringify({ password })
            // });

            // const data = await response.json();

            // Handle n8n returning an array or object
            const responseData = Array.isArray(data) ? data[0] : data;
            const responseText = responseData?.text || responseData?.texte;

            // Check if response indicates invalid password
            // Note: With proxy, we don't have direct access to 'response.ok' here easily unless we wrap it
            // but callN8N throws if not ok.
            if (responseText !== 'invalid') {
                const route = `/admin/${action}-${type}`;
                navigate(route);
            } else {
                setError('Mot de passe invalide');
            }
        } catch (err) {
            console.error("Validation error:", err);
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section className="animate-fade-in max-w-2xl mx-auto" style={{ animationDelay: '0.4s' }}>
            <Card className={`relative overflow-hidden !backdrop-blur-md transition-colors duration-500 ${styles.border}`}>
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r transition-colors duration-500 ${styles.gradient}`} />

                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <span className={`p-2 rounded-lg transition-colors duration-500 ${styles.iconBg} ${styles.iconColor}`}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <line x1="12" y1="8" x2="12" y2="16" />
                            <line x1="8" y1="12" x2="16" y2="12" />
                        </svg>
                    </span>
                    Administration
                </h3>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Action Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Action</label>
                            <CustomSelect
                                value={action}
                                onChange={setAction}
                                focusClass={styles.focus}
                                options={[
                                    { value: 'add', label: 'Ajouter' },
                                    { value: 'edit', label: 'Modifier' },
                                    { value: 'delete', label: 'Supprimer' }
                                ]}
                            />
                        </div>

                        {/* Type Selection */}
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                            <CustomSelect
                                value={type}
                                onChange={setType}
                                focusClass={styles.focus}
                                options={[
                                    { value: 'product', label: 'Produit' },
                                    { value: 'data', label: 'Data Support' }
                                ]}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none transition-colors ${styles.focus}`}
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center animate-shake">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 bg-gradient-to-r rounded-xl text-white font-semibold hover:opacity-90 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${styles.button}`}
                    >
                        {isLoading ? 'Validation...' : 'Valider'}
                    </button>
                </form>
            </Card>
        </section>
    );
};

export default ProductManagement;
