export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { endpoint } = req.query;

    // Secure map of allowed endpoints
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

    if (!endpoint || !ENDPOINTS[endpoint]) {
        return res.status(400).json({ error: 'Endpoint invalide ou manquant' });
    }

    const targetUrl = ENDPOINTS[endpoint];

    // Determine custom headers based on endpoint
    const customHeaders = {
        'Content-Type': 'application/json'
    };

    if (endpoint === 'reporting') customHeaders['reporting'] = 'reporting.01';
    if (endpoint === 'check_password') customHeaders['valid'] = 'correct.01';

    try {
        const response = await fetch(targetUrl, {
            method: 'POST',
            headers: customHeaders,
            body: JSON.stringify(req.body)
        });

        const data = await response.json();
        res.status(response.status).json(data);
    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({
            error: error.message || 'Erreur serveur interne',
            details: error.toString()
        });
    }
}
