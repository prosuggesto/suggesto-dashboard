import https from 'https';
import { URL } from 'url';

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

    const targetUrlRaw = ENDPOINTS[endpoint];
    const targetUrl = new URL(targetUrlRaw);

    // Determine custom headers based on endpoint
    const customHeaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(JSON.stringify(req.body))
    };

    if (endpoint === 'reporting') customHeaders['reporting'] = 'reporting.01';
    if (endpoint === 'check_password') customHeaders['valid'] = 'correct.01';

    const requestOptions = {
        hostname: targetUrl.hostname,
        path: targetUrl.pathname + targetUrl.search,
        method: 'POST',
        headers: customHeaders
    };

    try {
        const responseData = await new Promise((resolve, reject) => {
            const externalReq = https.request(requestOptions, (externalRes) => {
                let chunks = [];

                externalRes.on('data', (chunk) => {
                    chunks.push(chunk);
                });

                externalRes.on('end', () => {
                    const body = Buffer.concat(chunks).toString();
                    resolve({
                        statusCode: externalRes.statusCode,
                        body: body
                    });
                });
            });

            externalReq.on('error', (e) => {
                reject(e);
            });

            externalReq.write(JSON.stringify(req.body));
            externalReq.end();
        });

        // Try to parse JSON, fallback to text
        let data;
        try {
            data = JSON.parse(responseData.body);
        } catch (e) {
            // If response is not JSON, wrap it in a structure or return as is depending on status
            if (responseData.statusCode >= 400) {
                // Return the raw text as error details
                return res.status(responseData.statusCode).json({
                    error: 'Erreur du service distant (format invalide)',
                    details: responseData.body.substring(0, 500)
                });
            }
            // For sucess but non-json... rare for n8n but possible
            // Just return valid JSON wrapper
            data = { result: responseData.body };
        }

        res.status(responseData.statusCode).json(data);

    } catch (error) {
        console.error('Proxy Error:', error);
        res.status(500).json({
            error: error.message || 'Erreur serveur interne',
            details: error.toString()
        });
    }
}
