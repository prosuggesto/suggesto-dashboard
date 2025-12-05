/**
 * Centralized API helper to call the Vercel proxy.
 * Switch between direct n8n calls (local) and proxy calls (production) if needed,
 * or always use proxy if running 'vercel dev'.
 * 
 * For this implementation, we default to the relative /api/proxy path 
 * which works on Vercel deployment.
 */

export const callN8N = async (endpoint, body) => {
    // In local development (Vite), /api won't exist unless using 'vercel dev'.
    // If you want to test locally, you might need to hardcode the full Vercel URL after first deploy
    // or keep using direct URLs for localhost.

    // Check if we are checking password or reporting to handle specific return types if needed
    // But mostly we just pass JSON back and forth.

    try {
        const response = await fetch(`/api/proxy?endpoint=${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error("API Call Error:", error);
        throw error;
    }
};
