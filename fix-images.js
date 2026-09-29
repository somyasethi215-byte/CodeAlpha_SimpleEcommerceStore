const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const db = new sqlite3.Database(
    path.join(__dirname, "database.db")
);

function all(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.all(sql, params, (err, rows) => {
            if (err) reject(err);
            else resolve(rows);
        });
    });
}

function run(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.run(sql, params, function (err) {
            if (err) reject(err);
            else resolve(this);
        });
    });
}


/* =====================================================
   PRODUCT IMAGE TYPE DETECTION
   ===================================================== */

function getImageType(product) {

    const text = (
        `${product.name || ""} ` +
        `${product.category || ""} ` +
        `${product.description || ""}`
    ).toLowerCase();


    /* ===== VERY SPECIFIC PRODUCTS ===== */

    if (
        /drawing kit|art kit|sketch kit|painting kit|artist kit/.test(text)
    ) {
        return "drawing art kit";
    }

    if (
        /emergency kit|first aid kit|medical emergency kit|safety kit/.test(text)
    ) {
        return "emergency first aid kit";
    }

    if (
        /educational game|learning game|kids learning game|education game/.test(text)
    ) {
        return "educational board game";
    }

    if (
        /car vacuum|vehicle vacuum|auto vacuum/.test(text)
    ) {
        return "car vacuum cleaner";
    }

    if (
        /robot vacuum/.test(text)
    ) {
        return "robot vacuum cleaner";
    }

    if (
        /coffee maker|coffee machine|espresso machine/.test(text)
    ) {
        return "coffee maker";
    }

    if (
        /air fryer/.test(text)
    ) {
        return "air fryer";
    }

    if (
        /blender|mixer grinder/.test(text)
    ) {
        return "kitchen blender";
    }

    if (
        /keyboard/.test(text)
    ) {
        return "computer keyboard";
    }

    if (
        /mouse|gaming mouse/.test(text)
    ) {
        return "computer mouse";
    }

    if (
        /monitor|display|computer screen/.test(text)
    ) {
        return "computer monitor";
    }

    if (
        /printer/.test(text)
    ) {
        return "computer printer";
    }

    if (
        /power bank|portable charger/.test(text)
    ) {
        return "power bank";
    }

    if (
        /smartphone|iphone|android phone|mobile phone|cell phone|galaxy/.test(text)
    ) {
        return "smartphone";
    }

    if (
        /laptop|macbook|notebook computer|chromebook/.test(text)
    ) {
        return "laptop computer";
    }

    if (
        /tablet|ipad/.test(text)
    ) {
        return "tablet computer";
    }

    if (
        /headphone|headset/.test(text)
    ) {
        return "headphones";
    }

    if (
        /earbud|earphone|wireless buds/.test(text)
    ) {
        return "wireless earbuds";
    }

    if (
        /speaker|bluetooth speaker/.test(text)
    ) {
        return "bluetooth speaker";
    }

    if (
        /camera|dslr|mirrorless/.test(text)
    ) {
        return "digital camera";
    }

    if (
        /camera lens|lens/.test(text)
    ) {
        return "camera lens";
    }

    if (
        /smartwatch|fitness watch/.test(text)
    ) {
        return "smartwatch";
    }

    if (
        /watch|wristwatch/.test(text)
    ) {
        return "wrist watch";
    }


    /* ===== FASHION ===== */

    if (
        /running shoe|running shoes|sneaker|sneakers|footwear/.test(text)
    ) {
        return "running sneakers";
    }

    if (
        /formal shoe|formal shoes|dress shoes/.test(text)
    ) {
        return "formal shoes";
    }

    if (
        /shirt|tshirt|t-shirt/.test(text)
    ) {
        return "casual shirt";
    }

    if (
        /hoodie/.test(text)
    ) {
        return "hoodie";
    }

    if (
        /jacket/.test(text)
    ) {
        return "jacket";
    }

    if (
        /jeans/.test(text)
    ) {
        return "jeans";
    }

    if (
        /dress/.test(text)
    ) {
        return "fashion dress";
    }

    if (
        /backpack/.test(text)
    ) {
        return "backpack";
    }

    if (
        /handbag|purse/.test(text)
    ) {
        return "handbag";
    }

    if (
        /wallet/.test(text)
    ) {
        return "leather wallet";
    }


    /* ===== BEAUTY ===== */

    if (
        /lipstick/.test(text)
    ) {
        return "lipstick makeup";
    }

    if (
        /perfume|fragrance/.test(text)
    ) {
        return "perfume bottle";
    }

    if (
        /serum/.test(text)
    ) {
        return "skincare serum";
    }

    if (
        /moisturizer|moisturiser|face cream/.test(text)
    ) {
        return "face moisturizer";
    }

    if (
        /cleanser|face wash/.test(text)
    ) {
        return "facial cleanser";
    }

    if (
        /makeup|cosmetic/.test(text)
    ) {
        return "makeup cosmetics";
    }


    /* ===== SPORTS ===== */

    if (
        /football|soccer/.test(text)
    ) {
        return "football soccer ball";
    }

    if (
        /basketball/.test(text)
    ) {
        return "basketball";
    }

    if (
        /cricket/.test(text)
    ) {
        return "cricket equipment";
    }

    if (
        /tennis/.test(text)
    ) {
        return "tennis racket";
    }

    if (
        /badminton/.test(text)
    ) {
        return "badminton racket";
    }

    if (
        /dumbbell/.test(text)
    ) {
        return "dumbbells fitness";
    }

    if (
        /treadmill/.test(text)
    ) {
        return "treadmill fitness";
    }

    if (
        /yoga/.test(text)
    ) {
        return "yoga equipment";
    }

    if (
        /fitness|workout|exercise|gym/.test(text)
    ) {
        return "fitness equipment";
    }


    /* ===== GAMING ===== */

    if (
        /gaming controller|game controller|controller/.test(text)
    ) {
        return "gaming controller";
    }

    if (
        /playstation|ps5|ps4/.test(text)
    ) {
        return "PlayStation gaming console";
    }

    if (
        /xbox/.test(text)
    ) {
        return "Xbox gaming console";
    }

    if (
        /gaming|video game|console/.test(text)
    ) {
        return "gaming setup";
    }


    /* ===== HOME ===== */

    if (
        /sofa|couch/.test(text)
    ) {
        return "modern sofa";
    }

    if (
        /chair/.test(text)
    ) {
        return "modern chair";
    }

    if (
        /desk/.test(text)
    ) {
        return "modern computer desk";
    }

    if (
        /table/.test(text)
    ) {
        return "modern table";
    }

    if (
        /bed/.test(text)
    ) {
        return "modern bed furniture";
    }

    if (
        /lamp|lighting/.test(text)
    ) {
        return "modern table lamp";
    }


    /* ===== BOOKS ===== */

    if (
        /python/.test(text)
    ) {
        return "Python programming book";
    }

    if (
        /java/.test(text)
    ) {
        return "Java programming book";
    }

    if (
        /programming|coding/.test(text)
    ) {
        return "programming book";
    }

    if (
        /algorithm|data structure/.test(text)
    ) {
        return "computer science textbook";
    }

    if (
        /book|novel/.test(text)
    ) {
        return "books";
    }


    /* ===== FOOD / GROCERY ===== */

    if (
        /coffee/.test(text)
    ) {
        return "coffee beans";
    }

    if (
        /tea/.test(text)
    ) {
        return "tea package";
    }

    if (
        /chocolate/.test(text)
    ) {
        return "chocolate bar";
    }

    if (
        /rice|basmati/.test(text)
    ) {
        return "basmati rice package";
    }

    if (
        /snack/.test(text)
    ) {
        return "snacks food";
    }

    if (
        /grocery|food/.test(text)
    ) {
        return "grocery food products";
    }


    /* ===== TOYS ===== */

    if (
        /action figure/.test(text)
    ) {
        return "action figure toy";
    }

    if (
        /board game/.test(text)
    ) {
        return "board game";
    }

    if (
        /puzzle/.test(text)
    ) {
        return "jigsaw puzzle";
    }

    if (
        /toy/.test(text)
    ) {
        return "children toys";
    }


    /* ===== AUTOMOTIVE ===== */

    if (
        /car|automotive|vehicle/.test(text)
    ) {
        return "automotive car";
    }


    /* ===== CATEGORY FALLBACK ===== */

    const category =
        String(product.category || "").toLowerCase();


    if (category.includes("electronics")) {
        return "consumer electronics";
    }

    if (category.includes("fashion")) {
        return "fashion products";
    }

    if (category.includes("beauty")) {
        return "beauty products";
    }

    if (category.includes("sports")) {
        return "sports equipment";
    }

    if (category.includes("gaming")) {
        return "gaming products";
    }

    if (category.includes("book")) {
        return "books";
    }

    if (category.includes("grocery")) {
        return "grocery products";
    }

    if (category.includes("toy")) {
        return "toys";
    }

    if (category.includes("automotive")) {
        return "automotive products";
    }

    if (category.includes("home")) {
        return "home furniture";
    }


    return "modern ecommerce product";
}


/* =====================================================
   CREATE DETERMINISTIC IMAGE URL
   ===================================================== */

function createImageUrl(product, type) {

    /*
       lock = product ID

       This means the same product keeps the same image.
       Different products receive different locked images.
    */

    const lock =
        Number(product.id) || 1;

    const encoded =
        encodeURIComponent(type);

    return `https://loremflickr.com/900/900/${encoded}?lock=${lock}`;
}


/* =====================================================
   REPAIR ALL PRODUCTS
   ===================================================== */

async function repairImages() {

    try {

        console.log("");
        console.log("======================================");
        console.log("       SHOPEASE IMAGE REPAIR");
        console.log("======================================");
        console.log("");


        const products =
            await all(`
                SELECT
                    id,
                    name,
                    category,
                    description
                FROM products
                ORDER BY id ASC
            `);


        console.log(
            `Found ${products.length} products.`
        );

        console.log("");
        console.log("Repairing images...");
        console.log("");


        let repaired = 0;


        for (const product of products) {

            const type =
                getImageType(product);


            const image =
                createImageUrl(
                    product,
                    type
                );


            await run(
                `
                UPDATE products
                SET image = ?
                WHERE id = ?
                `,
                [
                    image,
                    product.id
                ]
            );


            repaired++;


            console.log(
                `[${repaired}/${products.length}] ` +
                `${product.name} -> ${type}`
            );

        }


        console.log("");
        console.log("======================================");
        console.log("       IMAGE REPAIR COMPLETE");
        console.log("======================================");
        console.log("");
        console.log(
            `Products repaired: ${repaired}`
        );
        console.log("");
        console.log(
            "Every product now has a permanent image URL."
        );
        console.log("");
        console.log(
            "You can now start the website with:"
        );
        console.log("");
        console.log("npm start");
        console.log("");


    } catch (error) {

        console.error("");
        console.error(
            "IMAGE REPAIR FAILED:"
        );
        console.error(error);
        console.error("");

    } finally {

        db.close();

    }
}


repairImages();