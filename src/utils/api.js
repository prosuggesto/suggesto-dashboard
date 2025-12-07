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
            try {
                const errorData = await response.json();
                if (errorData.error) {
                    errorMessage = `${errorData.error} (${errorData.details || ''})`;
                }
            } catch (e) {
                // If it's not JSON, it might be an HTML error page (e.g. 504 Gateway Timeout)
                try {
                    const errorText = await response.text();
                    errorMessage += ` - Détail: ${errorText}`;
                } catch (textError) {
                    // Ignore text reading error
                }
            }
            throw new Error(errorMessage);
        }

        return await response.json();
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
};
