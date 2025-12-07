/**
 * Centralized API helper to call the Vercel proxy.
 * Switch between direct n8n calls (local) and proxy calls (production) if needed,
 * or always use proxy if running 'vercel dev'.
 * 
 * For this implementation, we default to the relative /api/proxy path 
 * which works on Vercel deployment.
 */

export const callN8N = async (endpoint, body) => {
    // Always use the Vercel proxy, even locally.
    // This allows testing the proxy mechanism itself.
    // Note: Local Vite dev server needs a proxy config or 'vercel dev' to handle /api/proxy.

    try {
        const response = await fetch(`/api/proxy?endpoint=${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
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
