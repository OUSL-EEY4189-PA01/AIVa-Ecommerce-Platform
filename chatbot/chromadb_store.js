import { ChromaClient } from "chromadb";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs/promises";
import "dotenv/config";

const client = new ChromaClient();
const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: process.env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
});

export async function initializeStore() {
    // --- Products ---
    const productData = await fs.readFile("product.json", "utf-8");
    const products = JSON.parse(productData);

    const productCollection = await client.getOrCreateCollection({ name: "products" });

    for (const product of products) {
        const text = `${product.name} by ${product.brand}. 
            Category: ${product.category}. Price: ${product.price} LKR. 
            ${product.description} 
            Ingredients: ${product.keyIngredients.join(", ")}. 
            Benefits: ${product.keyBenefits.join(", ")}. 
            Usage: ${product.howToUse}`;

        const embedding = await embeddings.embedQuery(text);

        const flatMetadata = {
            _id: product._id,
            name: product.name,
            brand: product.brand,
            category: product.category,
            price: product.price,
            description: product.description,
            keyIngredients: product.keyIngredients.join(", "),
            keyBenefits: product.keyBenefits.join(", "),
            howToUse: product.howToUse,
        };

        await productCollection.upsert({
            ids: [product._id],
            embeddings: [embedding],
            documents: [text],
            metadatas: [flatMetadata],
        });
    }

    console.log(`Stored ${products.length} products in ChromaDB`);

    // --- FAQs ---
    const faqData = await fs.readFile("faq.json", "utf-8");
    const faqs = JSON.parse(faqData);

    const faqCollection = await client.getOrCreateCollection({ name: "faqs" });

    for (let i = 0; i < faqs.length; i++) {
        const faq = faqs[i];
        const text = `${faq.category}: ${faq.question} ${faq.answer}`;

        const embedding = await embeddings.embedQuery(text);

        await faqCollection.upsert({
            ids: [`faq-${i}`],
            embeddings: [embedding],
            documents: [text],
            metadatas: [{
                category: faq.category,
                question: faq.question,
                answer: faq.answer,
            }],
        });
    }

    console.log(`Stored ${faqs.length} FAQs in ChromaDB`);
}


export async function queryProducts(query, nResults = 5) {
    const collection = await client.getCollection({ name: "products" });
    const queryEmbedding = await embeddings.embedQuery(query);

    const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: nResults,
    });

    return results.metadatas[0];
}

export async function queryFAQs(query, nResults = 3) {
    const collection = await client.getCollection({ name: "faqs" });
    const queryEmbedding = await embeddings.embedQuery(query);

    const results = await collection.query({
        queryEmbeddings: [queryEmbedding],
        nResults: nResults,
    });

    return results.metadatas[0];
}
