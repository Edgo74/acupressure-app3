import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Real acupressure points data using local images
const acupressurePoints = [
    {
        name: "23VC-",
        description: "Situé sur la main, entre le pouce et l'index. Point puissant pour soulager les maux de tête, les douleurs dentaires, le stress et renforcer l'immunité. Ne pas utiliser pendant la grossesse.",
        image: `https://tkygcyjioiflblhngxny.supabase.co/storage/v1/object/public/point-images/23VC-.png`,
    },
    {
        name: "2F-",
        description: "Situé sur l'avant-bras, à 3 doigts du pli du poignet, entre les tendons. Excellent pour les nausées, l'anxiété, les problèmes cardiaques et les troubles du sommeil.",
        image: `https://tkygcyjioiflblhngxny.supabase.co/storage/v1/object/public/point-images/2F-.png`,
    },
    {
        name: "4Rt-",
        description: "Situé à la base du crâne, de chaque côté, dans les creux sous l'os occipital. Soulage les maux de tête, la raideur du cou, le rhume et améliore la circulation cérébrale.",
        image: `https://tkygcyjioiflblhngxny.supabase.co/storage/v1/object/public/point-images/4Rt-.png`,
    },
    {
        name: "60V-",
        description: "Situé entre les sourcils, au centre du front. Ce point aide à calmer l'esprit, réduire le stress et soulager les maux de tête frontaux. Efficace pour l'anxiété, l'insomnie et la congestion nasale.",
        image: `https://tkygcyjioiflblhngxny.supabase.co/storage/v1/object/public/point-images/60V-.png`,
    },
    {
        name: "7Rn+",
        description: "Situé sur le poignet, côté auriculaire, dans le creux à côté du tendon. Point principal pour calmer l'esprit, traiter l'anxiété, l'insomnie et les palpitations cardiaques.",
        image: `https://tkygcyjioiflblhngxny.supabase.co/storage/v1/object/public/point-images/7Rn+.png`,
    },
];

async function seedDatabase() {
    console.log("Starting to seed database with acupressure points...");

    // First, clear existing inappropriate test data
    const { error: deleteError } = await supabase
        .from('points')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all existing records

    if (deleteError) {
        console.error('Error clearing database:', deleteError);
    } else {
        console.log('✅ Cleared existing test data');
    }

    for (const point of acupressurePoints) {
        try {
            // Create embedding for the point description
            const embedding = await openai.embeddings.create({
                model: "text-embedding-3-small",
                input: `${point.name} ${point.description}`
            });

            const vector = embedding.data[0].embedding;

            // Insert into Supabase
            const { data, error } = await supabase.from("points").insert({
                name: point.name,
                description: point.description,
                image: point.image,
                embedding: vector
            });

            if (error) {
                console.error(`❌ Error inserting ${point.name}:`, error);
            } else {
                console.log(`✅ ${point.name} indexed successfully`);
            }
        } catch (error) {
            console.error(`❌ Error processing ${point.name}:`, error);
        }
    }

    console.log("✅ Database seeding completed!");
}

seedDatabase();