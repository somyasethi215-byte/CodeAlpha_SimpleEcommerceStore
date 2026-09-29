const fs = require("fs");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const ROOT = __dirname;
const DB_PATH = path.join(ROOT, "database.db");
const IMAGE_DIR = path.join(ROOT, "public", "images", "products");

if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

const db = new sqlite3.Database(DB_PATH);

function escapeXml(value) {
    return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function classify(product) {
    const text = `${product.name || ""} ${product.category || ""} ${product.description || ""}`.toLowerCase();

    if (/drawing|sketch|paint|art|color|pencil|canvas|marker/.test(text)) return "drawing";
    if (/emergency|first aid|medical|safety/.test(text)) return "emergency";
    if (/board game|chess|ludo|monopoly/.test(text)) return "boardgame";
    if (/educational|learning|kids game|science kit/.test(text)) return "education";
    if (/puzzle|jigsaw|cube/.test(text)) return "puzzle";

    if (/laptop|notebook computer|macbook/.test(text)) return "laptop";
    if (/tablet|ipad/.test(text)) return "tablet";
    if (/smartphone|phone|mobile/.test(text)) return "phone";
    if (/headphone|headset/.test(text)) return "headphones";
    if (/earbud|airpod|tws/.test(text)) return "earbuds";
    if (/speaker|soundbar/.test(text)) return "speaker";
    if (/camera|dslr|mirrorless/.test(text)) return "camera";
    if (/smartwatch|watch/.test(text)) return "watch";
    if (/keyboard/.test(text)) return "keyboard";
    if (/mouse/.test(text)) return "mouse";
    if (/monitor|display|screen/.test(text)) return "monitor";
    if (/printer/.test(text)) return "printer";
    if (/gaming|gamepad|controller|console/.test(text)) return "gaming";

    if (/shoe|sneaker|footwear|running shoe/.test(text)) return "shoes";
    if (/shirt|t-shirt|tshirt|jeans|jacket|hoodie|clothing|dress/.test(text)) return "fashion";
    if (/bag|backpack|handbag|wallet/.test(text)) return "bag";
    if (/beauty|makeup|cosmetic|skincare|perfume/.test(text)) return "beauty";

    if (/football|soccer/.test(text)) return "football";
    if (/basketball/.test(text)) return "basketball";
    if (/cricket|bat|wicket/.test(text)) return "cricket";
    if (/tennis|badminton|racket/.test(text)) return "racket";
    if (/gym|fitness|dumbbell|yoga|exercise/.test(text)) return "fitness";

    if (/vacuum|cleaner|car vacuum/.test(text)) return "vacuum";
    if (/car|automotive|motor|vehicle/.test(text)) return "automotive";

    if (/coffee maker|coffee machine/.test(text)) return "coffee";
    if (/blender|mixer/.test(text)) return "blender";
    if (/lamp|light|lighting/.test(text)) return "lamp";

    if (/sofa|couch/.test(text)) return "sofa";
    if (/chair|office chair/.test(text)) return "chair";
    if (/desk|workstation/.test(text)) return "desk";
    if (/table/.test(text)) return "table";
    if (/bed|mattress/.test(text)) return "bed";

    if (/book|novel|textbook/.test(text)) return "book";
    if (/toy|teddy|doll|kids/.test(text)) return "toy";
    if (/grocery|food|snack|rice|oil|spice/.test(text)) return "grocery";

    return "product";
}

/*
    These SVGs are designed as polished product renders:
    - no emoji
    - no random external image
    - no broken URL
    - deterministic
    - works offline
    - each product keeps its own ID
*/

const templates = {

    drawing: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f5f7fa"/>
                    <stop offset="1" stop-color="#dfe5ec"/>
                </linearGradient>
                <linearGradient id="box" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#ffffff"/>
                    <stop offset="1" stop-color="#c9d0d8"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="18"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="585" rx="300" ry="45" fill="#9ca3af" opacity=".35" filter="url(#shadow)"/>

            <g transform="translate(170 120)">
                <rect x="0" y="40" width="560" height="360" rx="28" fill="#1f2937"/>
                <rect x="25" y="65" width="510" height="310" rx="18" fill="url(#box)"/>

                <rect x="65" y="105" width="200" height="105" rx="12" fill="#f59e0b"/>
                <rect x="285" y="105" width="190" height="105" rx="12" fill="#ef4444"/>

                <rect x="65" y="235" width="120" height="85" rx="10" fill="#2563eb"/>
                <rect x="205" y="235" width="120" height="85" rx="10" fill="#10b981"/>
                <rect x="345" y="235" width="130" height="85" rx="10" fill="#8b5cf6"/>

                <circle cx="125" cy="157" r="30" fill="#fff"/>
                <circle cx="350" cy="157" r="30" fill="#fff"/>

                <path d="M470 20 L590 100 L560 130 L440 50 Z" fill="#f3c29b"/>
                <path d="M555 92 L625 20 L650 45 L580 118 Z" fill="#374151"/>
            </g>

            <text x="450" y="635"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    emergency: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#e2e8f0"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="20"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="570" rx="270" ry="45"
                     fill="#94a3b8" opacity=".35" filter="url(#shadow)"/>

            <g transform="translate(205 125)">
                <rect x="0" y="90" width="490" height="300" rx="35"
                      fill="#dc2626"/>
                <rect x="25" y="115" width="440" height="250" rx="25"
                      fill="#fef2f2"/>

                <rect x="175" y="45" width="140" height="55" rx="15"
                      fill="#b91c1c"/>

                <rect x="185" y="175" width="120" height="80" rx="12"
                      fill="#dc2626"/>

                <rect x="215" y="145" width="60" height="140"
                      rx="8" fill="white"/>
                <rect x="175" y="185" width="140" height="60"
                      rx="8" fill="white"/>

                <circle cx="100" cy="190" r="25" fill="#fee2e2"/>
                <circle cx="390" cy="190" r="25" fill="#fee2e2"/>

                <rect x="90" y="285" width="310" height="25"
                      rx="12" fill="#fecaca"/>
            </g>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    laptop: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#dbe4ee"/>
                </linearGradient>
                <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#172554"/>
                    <stop offset="1" stop-color="#0f172a"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="22"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="575" rx="320" ry="45"
                     fill="#64748b" opacity=".3" filter="url(#shadow)"/>

            <g transform="translate(150 120)">
                <rect x="70" y="0" width="560" height="350"
                      rx="24" fill="#111827"/>
                <rect x="90" y="22" width="520" height="305"
                      rx="12" fill="url(#screen)"/>

                <circle cx="350" cy="175" r="70"
                        fill="#2563eb" opacity=".25"/>
                <circle cx="350" cy="175" r="38"
                        fill="#60a5fa" opacity=".7"/>

                <path d="M0 350 H700 L620 430 H80 Z"
                      fill="#9ca3af"/>
                <path d="M90 365 H610 L580 395 H120 Z"
                      fill="#374151"/>

                <rect x="300" y="372" width="100" height="12"
                      rx="6" fill="#d1d5db"/>
            </g>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    phone: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#dbeafe"/>
                </linearGradient>
                <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#1e3a8a"/>
                    <stop offset="1" stop-color="#7c3aed"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="22"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="590" rx="180" ry="35"
                     fill="#64748b" opacity=".3" filter="url(#shadow)"/>

            <g transform="translate(300 55)">
                <rect x="0" y="0" width="300" height="540"
                      rx="45" fill="#111827"/>
                <rect x="14" y="15" width="272" height="510"
                      rx="34" fill="url(#screen)"/>

                <rect x="105" y="28" width="90" height="22"
                      rx="11" fill="#020617"/>

                <circle cx="150" cy="270" r="85"
                        fill="#60a5fa" opacity=".2"/>
                <circle cx="150" cy="270" r="45"
                        fill="#bfdbfe" opacity=".5"/>

                <circle cx="62" cy="95" r="26"
                        fill="#1f2937"/>
                <circle cx="62" cy="95" r="14"
                        fill="#64748b"/>

                <rect x="125" y="505" width="50" height="5"
                      rx="3" fill="#cbd5e1"/>
            </g>

            <text x="450" y="650"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    headphones: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#e5e7eb"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="22"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="560" rx="230" ry="40"
                     fill="#6b7280" opacity=".3" filter="url(#shadow)"/>

            <path d="M250 360 V270
                     C250 100 650 100 650 270
                     V360"
                  fill="none"
                  stroke="#111827"
                  stroke-width="70"
                  stroke-linecap="round"/>

            <rect x="205" y="300" width="125" height="200"
                  rx="45" fill="#1f2937"/>
            <rect x="570" y="300" width="125" height="200"
                  rx="45" fill="#1f2937"/>

            <circle cx="267" cy="400" r="52" fill="#374151"/>
            <circle cx="632" cy="400" r="52" fill="#374151"/>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    earbuds: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#ffffff"/>
                    <stop offset="1" stop-color="#e2e8f0"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="22"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="560" rx="190" ry="35"
                     fill="#64748b" opacity=".3" filter="url(#shadow)"/>

            <rect x="300" y="230" width="300" height="260"
                  rx="80" fill="#f8fafc"
                  stroke="#cbd5e1" stroke-width="8"/>

            <ellipse cx="380" cy="300" rx="48" ry="70"
                     fill="#111827"/>
            <ellipse cx="520" cy="300" rx="48" ry="70"
                     fill="#111827"/>

            <path d="M360 350 V440 Q360 475 390 475
                     Q420 475 420 440 V370"
                  fill="none"
                  stroke="#111827"
                  stroke-width="35"
                  stroke-linecap="round"/>

            <path d="M540 350 V440 Q540 475 510 475
                     Q480 475 480 440 V370"
                  fill="none"
                  stroke="#111827"
                  stroke-width="35"
                  stroke-linecap="round"/>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    camera: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#cbd5e1"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="20"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="560" rx="280" ry="45"
                     fill="#475569" opacity=".3" filter="url(#shadow)"/>

            <g transform="translate(150 180)">
                <rect x="0" y="70" width="600" height="300"
                      rx="35" fill="#1f2937"/>

                <path d="M150 70 L200 15 H370 L420 70 Z"
                      fill="#111827"/>

                <circle cx="300" cy="220" r="115"
                        fill="#374151"/>
                <circle cx="300" cy="220" r="90"
                        fill="#111827"/>
                <circle cx="300" cy="220" r="62"
                        fill="#334155"/>
                <circle cx="280" cy="195" r="18"
                        fill="#94a3b8"
                        opacity=".65"/>

                <circle cx="510" cy="125" r="16"
                        fill="#ef4444"/>

                <rect x="65" y="130" width="65" height="30"
                      rx="10" fill="#475569"/>
            </g>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    watch: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#d1d5db"/>
                </linearGradient>
                <linearGradient id="screen" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#0f172a"/>
                    <stop offset="1" stop-color="#334155"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="20"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="570" rx="180" ry="35"
                     fill="#475569" opacity=".3" filter="url(#shadow)"/>

            <rect x="350" y="55" width="200" height="170"
                  rx="55" fill="#111827"/>
            <rect x="350" y="475" width="200" height="170"
                  rx="55" fill="#111827"/>

            <rect x="285" y="150" width="330" height="390"
                  rx="75" fill="#1f2937"/>

            <rect x="315" y="180" width="270" height="330"
                  rx="55" fill="url(#screen)"/>

            <circle cx="450" cy="345" r="85"
                    fill="#2563eb" opacity=".3"/>

            <text x="450" y="365"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="55"
                  font-weight="700"
                  fill="white">
                10:28
            </text>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    shoes: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#e2e8f0"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="22"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="545" rx="320" ry="45"
                     fill="#64748b" opacity=".3" filter="url(#shadow)"/>

            <g transform="translate(120 220)">
                <path d="M20 170
                         C120 150 190 50 260 20
                         L430 140
                         C500 190 650 210 700 240
                         L700 300
                         H50
                         C15 300 0 275 20 170Z"
                      fill="#2563eb"/>

                <path d="M35 260 H700 V310 H35
                         C5 310 0 275 35 260Z"
                      fill="#f8fafc"/>

                <path d="M280 65 L360 130
                         M245 90 L330 155
                         M215 120 L300 180"
                      stroke="white"
                      stroke-width="18"
                      stroke-linecap="round"/>
            </g>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    football: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <radialGradient id="ball">
                    <stop offset="0" stop-color="#ffffff"/>
                    <stop offset="1" stop-color="#cbd5e1"/>
                </radialGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="25"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="#e2e8f0"/>
            <ellipse cx="450" cy="560" rx="190" ry="40"
                     fill="#334155" opacity=".3" filter="url(#shadow)"/>

            <circle cx="450" cy="330" r="190"
                    fill="url(#ball)"
                    stroke="#64748b"
                    stroke-width="10"/>

            <polygon points="450,220 500,255 480,315 420,315 400,255"
                     fill="#111827"/>

            <path d="M450 220 L450 150
                     M500 255 L570 225
                     M480 315 L540 375
                     M420 315 L360 375
                     M400 255 L330 225"
                  stroke="#111827"
                  stroke-width="15"/>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    speaker: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#cbd5e1"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="22"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>
            <ellipse cx="450" cy="570" rx="210" ry="35"
                     fill="#475569" opacity=".3" filter="url(#shadow)"/>

            <rect x="280" y="80" width="340" height="470"
                  rx="55" fill="#111827"/>

            <circle cx="450" cy="230" r="95"
                    fill="#374151"
                    stroke="#64748b"
                    stroke-width="12"/>

            <circle cx="450" cy="230" r="62"
                    fill="#111827"/>

            <circle cx="450" cy="405" r="70"
                    fill="#374151"
                    stroke="#64748b"
                    stroke-width="12"/>

            <circle cx="450" cy="405" r="42"
                    fill="#111827"/>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `,

    product: (p) => `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 700">
            <defs>
                <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#f8fafc"/>
                    <stop offset="1" stop-color="#e2e8f0"/>
                </linearGradient>
                <linearGradient id="box" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#ffffff"/>
                    <stop offset="1" stop-color="#cbd5e1"/>
                </linearGradient>
                <filter id="shadow">
                    <feGaussianBlur stdDeviation="20"/>
                </filter>
            </defs>

            <rect width="900" height="700" fill="url(#bg)"/>

            <ellipse cx="450" cy="555" rx="250" ry="40"
                     fill="#64748b"
                     opacity=".3"
                     filter="url(#shadow)"/>

            <g transform="translate(210 145)">
                <rect x="0" y="40"
                      width="480"
                      height="350"
                      rx="35"
                      fill="url(#box)"
                      stroke="#94a3b8"
                      stroke-width="8"/>

                <rect x="35" y="75"
                      width="410"
                      height="100"
                      rx="20"
                      fill="#e5e7eb"/>

                <rect x="70" y="215"
                      width="150"
                      height="110"
                      rx="18"
                      fill="#3b82f6"/>

                <rect x="250" y="215"
                      width="150"
                      height="110"
                      rx="18"
                      fill="#6366f1"/>

                <circle cx="145" cy="270" r="35"
                        fill="#bfdbfe"/>

                <circle cx="325" cy="270" r="35"
                        fill="#c7d2fe"/>
            </g>

            <text x="450" y="625"
                  text-anchor="middle"
                  font-family="Arial"
                  font-size="27"
                  font-weight="700"
                  fill="#374151">
                ${escapeXml(p.name)}
            </text>
        </svg>
    `
};

function generateImage(product) {
    const type = classify(product);

    const supported = [
        "drawing",
        "emergency",
        "laptop",
        "phone",
        "headphones",
        "earbuds",
        "camera",
        "watch",
        "shoes",
        "football",
        "speaker"
    ];

    const template = supported.includes(type)
        ? templates[type]
        : templates.product;

    return template(product);
}

db.all(
    "SELECT id, name, category, description FROM products ORDER BY id",
    [],
    (err, products) => {

        if (err) {
            console.error("Database error:", err.message);
            db.close();
            process.exit(1);
        }

        console.log("");
        console.log("======================================");
        console.log("     SHOP EASE IMAGE GENERATOR");
        console.log("======================================");
        console.log(`Products found: ${products.length}`);
        console.log("");

        let completed = 0;

        const updateNext = (index) => {

            if (index >= products.length) {

                console.log("");
                console.log("======================================");
                console.log(" IMAGE UPDATE COMPLETED");
                console.log("======================================");
                console.log(`Updated images: ${completed}`);
                console.log(`Image folder: ${IMAGE_DIR}`);
                console.log("");

                db.close();
                return;
            }

            const product = products[index];

            try {
                const svg = generateImage(product);

                const fileName = `product-${product.id}.svg`;
                const filePath = path.join(IMAGE_DIR, fileName);

                fs.writeFileSync(filePath, svg, "utf8");

                const imagePath = `/images/products/${fileName}`;

                db.run(
                    "UPDATE products SET image = ? WHERE id = ?",
                    [imagePath, product.id],
                    (updateErr) => {

                        if (updateErr) {
                            console.error(
                                `Failed product ${product.id}:`,
                                updateErr.message
                            );
                        } else {
                            completed++;
                        }

                        if (completed % 50 === 0) {
                            console.log(
                                `Progress: ${completed}/${products.length}`
                            );
                        }

                        updateNext(index + 1);
                    }
                );

            } catch (error) {

                console.error(
                    `Image error for product ${product.id}:`,
                    error.message
                );

                updateNext(index + 1);
            }
        };

        updateNext(0);
    }
);