import { z } from "zod";
import { tool } from "@langchain/core/tools";
import { queryFAQs } from "./chromadb_store.js";

export const faqTool = tool(
    async ({ query }) => {
        const faqs = await queryFAQs(query, 3);

        return JSON.stringify({
            success: true,
            count: faqs.length,
            faqs: faqs,
        });
    },
    {
        name: "faq_info",
        description:
            "Retrieves frequently asked questions and answers about store policies, shipping, returns, contact information, and payment. Use this tool when the user asks about non-product topics like return policy, shipping times, contact details, or payment methods.",
        schema: z.object({
            query: z.string().describe("Natural language query about store policies or FAQs"),
        }),
    }
);
