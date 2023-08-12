import {Client} from "@notionhq/client";

const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

export const getDatabase = async () => {
    const response = await notion.databases.query({
        database_id: process.env.NOTION_DATABASE_ID || "",
    });
    return response.results;
};

export const getPage = async (pageId: string) => {
    return await notion.pages.retrieve({page_id: pageId});
};

export const getBlocks = async (blockId: string) => {
    blockId = blockId.replaceAll("-", "");

    const {results} = await notion.blocks.children.list({
        block_id: blockId,
        page_size: 100,
    });

    const childBlocks: any = results.map(async (block) => {
        if (block.id) {
            const children = await getBlocks(block.id);
            return {...block, children};
        }
        return block;
    });

    return await Promise.all(childBlocks).then((blocks) => {
        return blocks.reduce((acc, curr) => {
            if (curr.type === "bulleted_list_item") {
                if (acc[acc.length - 1]?.type === "bulleted_list") {
                    acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
                } else {
                    acc.push({
                        id: getRandomInt(10 ** 99, 10 ** 100).toString(),
                        type: "bulleted_list",
                        bulleted_list: {children: [curr]},
                    });
                }
            } else if (curr.type === "numbered_list_item") {
                if (acc[acc.length - 1]?.type === "numbered_list") {
                    acc[acc.length - 1][acc[acc.length - 1].type].children?.push(curr);
                } else {
                    acc.push({
                        id: getRandomInt(10 ** 99, 10 ** 100).toString(),
                        type: "numbered_list",
                        numbered_list: {children: [curr]},
                    });
                }
            } else {
                acc.push(curr);
            }
            return acc;
        }, []);
    });
};

function getRandomInt(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}