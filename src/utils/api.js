/**
 * Centralized API helper to call n8n webhooks directly.
 * Bypasses Vercel proxy to avoid 500 errors and serverless limitations.
 */

const ENDPOINTS = {
    'reporting': 'https://n8n.srv862127.hstgr.cloud/webhook/reporting',
    'check_password': 'https://n8n.srv862127.hstgr.cloud/webhook/mot_de_passe',
    'add_product': 'https://n8n.srv862127.hstgr.cloud/webhook/ajouter_produits',
    'edit_product': 'https://n8n.srv862127.hstgr.cloud/webhook/modifier_produits',
    'delete_product': 'https://n8n.srv862127.hstgr.cloud/webhook/supprimer_produits',
    'add_data': 'https://n8n.srv862127.hstgr.cloud/webhook/ajouter_infos',
    'edit_data': 'https://n8n.srv862127.hstgr.cloud/webhook/modifier_infos',
    'delete_data': 'https://n8n.srv862127.hstgr.cloud/webhook/supprimer_infos'
};

export const callN8N = async (endpoint, body) => {
    console.log("API Utils Version: v3 (Direct n8n Calls)"); // Version marker

    if (!ENDPOINTS[endpoint]) {
        throw new Error(`Endpoint '${endpoint}' non configuré.`);
    }

    const url = ENDPOINTS[endpoint];
    const headers = {
        'Content-Type': 'application/json'
    };

    // Specific headers required by n8n workflows
    if (endpoint === 'reporting') headers['reporting'] = 'reporting.01';
    if (endpoint === 'check_password') headers['valid'] = 'correct.01';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            let errorMessage = `Erreur HTTP: ${response.status} ${response.statusText}`;
            const errorText = await response.text();

            try {
                const errorData = JSON.parse(errorText);
                if (errorData.error) {
                    errorMessage = `${errorData.error} (${errorData.details || ''})`;
                }
            } catch (e) {
                // Parsing failed, use the raw text if available
                if (errorText) {
                    // Limit length to avoid alerting massive HTML
                    errorMessage += ` - Détail: ${errorText.substring(0, 500)}`;
                }
            }
            throw new Error(errorMessage);
        }

        const successText = await response.text();
        return JSON.parse(successText);
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
};
