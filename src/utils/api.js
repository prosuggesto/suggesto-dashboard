/**
 * Centralized API helper to call the Vercel proxy.
 * Secures n8n webhook URLs and headers by keeping them on the server side.
 */

export const callN8N = async (endpoint, body) => {
    console.log("API Utils Version: v4 (Proxy Secured)"); // Version marker

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
