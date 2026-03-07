import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { queryProducts } from "./chromadb_store.js";

export const productInfoTool = tool(
    async ({ query }) => {
        const products = await queryProducts(query, 5);

        return JSON.stringify({
            success: true,
            count: products.length,
            products: products,
        });
    },
    {
        name: "product_info",
        description:
            "Retrieves skincare products from the catalog that are most relevant to the query. Returns product details including name, brand, category, price, ingredients, benefits, and usage. The AI should reason over the returned products to answer the user's specific question.",
        schema: z.object({
            query: z.string().describe("Natural language query about products"),
        }),
    }
);