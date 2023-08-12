import {getDatabase} from "@/lib/notion";
import Link from "next/link";

export default async function Home() {
    const posts = await getDatabase();

    return (
        <div>
            <ol>
                {posts.map((post) => {
                    if ('last_edited_time' in post && "properties" in post && "Name" in post.properties && "title" in post.properties.Name) {
                        const date = new Date(post.last_edited_time).toLocaleString();
                        const titleText = post.properties.Name.title.map(textItem => textItem.plain_text).join('');
                        return (
                            <li key={post.id}>
                                <h3>
                                    <Link href={`/${post.id}`}>
                                        <p>{titleText}</p>
                                    </Link>
                                </h3>
                                <p>{date}</p>
                                <Link href={`/${post.id}`}>Read post →</Link>
                            </li>
                        );
                    }
                    return "データが不足しています。";
                })}
            </ol>
        </div>
    );
}
