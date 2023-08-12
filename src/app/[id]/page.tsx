import {getBlocks, getPage} from "@/lib/notion";
import {Fragment} from "react";
import Link from "next/link";

const Text = ({text}) => {
    if (!text) {
        return null;
    }
    return text.map((value) => {
        const {
            annotations: {bold, code, color, italic, strikethrough, underline},
            text,
        } = value;
        return (
            <span
                style={color !== "default" ? {color} : {}}
                key={text.content}
            >
        {text.link ? <a href={text.link.url}>{text.content}</a> : text.content}
      </span>
        );
    });
};

const renderNestedList = (block) => {
    const {type} = block;
    const value = block[type];
    if (!value) return null;

    const isNumberedList = value.children[0].type === "numbered_list_item";

    if (isNumberedList) {
        return <ol>{value.children.map((block) => renderBlock(block))}</ol>;
    }
    return <ul>{value.children.map((block) => renderBlock(block))}</ul>;
};

const renderBlock = (block) => {
    const {type, id} = block;
    const value = block[type];

    switch (type) {
        case "paragraph":
            return (
                <p>
                    <Text text={value.rich_text}/>
                </p>
            );
        case "heading_1":
            return (
                <h1>
                    <Text text={value.rich_text}/>
                </h1>
            );
        case "heading_2":
            return (
                <h2>
                    <Text text={value.rich_text}/>
                </h2>
            );
        case "heading_3":
            return (
                <h3>
                    <Text text={value.rich_text}/>
                </h3>
            );
        case "bulleted_list": {
            return <ul>{value.children.map((child) => renderBlock(child))}</ul>;
        }
        case "numbered_list": {
            return <ol>{value.children.map((child) => renderBlock(child))}</ol>;
        }
        case "bulleted_list_item":
        case "numbered_list_item":
            return (
                <li key={block.id}>
                    <Text text={value.rich_text}/>
                    {!!value.children && renderNestedList(block)}
                </li>
            );
        case "to_do":
            return (
                <div>
                    <label htmlFor={id}>
                        <input type="checkbox" id={id} defaultChecked={value.checked}/>{" "}
                        <Text text={value.rich_text}/>
                    </label>
                </div>
            );
        case "toggle":
            return (
                <details>
                    <summary>
                        <Text text={value.rich_text}/>
                    </summary>
                    {block.children?.map((child) => (
                        <Fragment key={child.id}>{renderBlock(child)}</Fragment>
                    ))}
                </details>
            );
        case "child_page":
            return (
                <div>
                    <strong>{value.title}</strong>
                    {block.children.map((child) => renderBlock(child))}
                </div>
            );
        case "image":
            const src =
                value.type === "external" ? value.external.url : value.file.url;
            const caption = value.caption ? value.caption[0]?.plain_text : "";
            return (
                <figure>
                    <img src={src} alt={caption}/>
                    {caption && <figcaption>{caption}</figcaption>}
                </figure>
            );
        case "divider":
            return <hr key={id}/>;
        case "quote":
            return <blockquote key={id}>{value.rich_text[0].plain_text}</blockquote>;
        case "code":
            return (
                <pre>
          <code key={id}>
            {value.rich_text[0].plain_text}
          </code>
        </pre>
            );
        case "file":
            const src_file =
                value.type === "external" ? value.external.url : value.file.url;
            const splitSourceArray = src_file.split("/");
            const lastElementInArray = splitSourceArray[splitSourceArray.length - 1];
            const caption_file = value.caption ? value.caption[0]?.plain_text : "";
            return (
                <figure>
                    <div>
                        📎{" "}
                        <Link href={src_file} passHref>
                            {lastElementInArray.split("?")[0]}
                        </Link>
                    </div>
                    {caption_file && <figcaption>{caption_file}</figcaption>}
                </figure>
            );
        case "bookmark":
            const href = value.url;
            return (
                <a href={href} target="_brank">
                    {href}
                </a>
            );
        case "table": {
            return (
                <table>
                    <tbody>
                    {block.children?.map((child, i) => {
                        const RowElement =
                            value.has_column_header && i == 0 ? "th" : "td";
                        return (
                            <tr key={child.id}>
                                {child.table_row?.cells?.map((cell, i) => {
                                    return (
                                        <RowElement key={`${cell.plain_text}-${i}`}>
                                            <Text text={cell}/>
                                        </RowElement>
                                    );
                                })}
                            </tr>
                        );
                    })}
                    </tbody>
                </table>
            );
        }
        case "column_list": {
            return (
                <div>
                    {block.children.map((block) => renderBlock(block))}
                </div>
            );
        }
        case "column": {
            return <div>{block.children.map((child) => renderBlock(child))}</div>;
        }
        default:
            return `❌ Unsupported block (${
                type === "unsupported" ? "unsupported by Notion API" : type
            })`;
    }
};


export default async function Post({params}: { params: { id: string } }) {
    const page = await getPage(params.id);
    const blocks = await getBlocks(params.id);
    if (!page || !blocks) {
        return <div/>;
    }
    return (
        <div>
            <article>
                <h1>
                    <Text text={page.properties.Name.title}/>
                </h1>
                <section>
                    {blocks.map((block) => (
                        <Fragment key={block.id}>{renderBlock(block)}</Fragment>
                    ))}
                    <Link href="/">
                        ← Go home
                    </Link>
                </section>
            </article>
        </div>
    );
}
