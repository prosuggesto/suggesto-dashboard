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
            // Throw a detailed error with the status code
            throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
};
