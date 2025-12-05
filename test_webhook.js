
async function testWebhook() {
    const url = "https://n8n.srv862127.hstgr.cloud/webhook/reporting";
    const headers = {
        "Content-Type": "application/json",
        "reporting": "reporting.01"
    };
    const body = JSON.stringify({ password: "test" });

    try {
        console.log(`Sending POST to ${url}...`);
        const response = await fetch(url, {
            method: 'POST',
            headers: headers,
            body: body
        });

        console.log(`Status Code: ${response.status}`);
        const text = await response.text();
        console.log(`Response Text: ${text}`);

        try {
            const json = JSON.parse(text);
            console.log("JSON Response:", JSON.stringify(json, null, 2));
        } catch (e) {
            console.log("Could not parse JSON:", e.message);
        }
    } catch (e) {
        console.error("Request failed:", e);
    }
}

testWebhook();
