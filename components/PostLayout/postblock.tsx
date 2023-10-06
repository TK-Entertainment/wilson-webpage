import Link from 'next/link'
import Image from "next/image";
import type { Blog } from "contentlayer/generated";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faClock, faUser } from "@fortawesome/free-regular-svg-icons"

export default function PostBlock({ page }: { page: Blog }) {
    return (
        <Link
            href={`/blog/${page.slug}`}
            className="flex flex-row p-3 rounded-2xl border bg-card text-card-foreground transition-all hover:bg-accent hover:drop-shadow-2xl hover:scale-105"
        >
            <div className="flex rounded-2xl border overflow-hidden w-64 h-auto">
                {page.image != null ? (
                    <Image 
                        alt="img"
                        src={page.image}
                        fill
                    />
                ) : (
                    <Image
                        alt="none"
                        src="/img/taiwan.png"
                        className="h-full object-cover overflow-hidden bg-contain bg-center"
                        width={400}
                        height={300}
                    />
                )
                }   
            </div>
            <div className="flex flex-col ml-4">
                <div>
                {page.tags?.map((tag, index) => (
                    <span key={`${index}`} className="text-sm mr-1 rounded-2xl border px-2">#&nbsp;{tag}</span>
                ))
                }
                </div>
                <div>
                <p className="text-3xl font-bold mt-2">{page.title}</p>
                <article className="text-xl font-base mt-1">{page.description}</article>
                </div>
                <div className="mt-auto flex flex-row">
                    <div className="flex flex-row my-auto">
                        <FontAwesomeIcon icon={faClock} className="text-base w-4 mr-2"/>
                        <p className="text-sm">{new Date(page.date).toLocaleString("zh-TW")}</p>
                    </div>
                    <div className="border-l-2 rounded-2xl ml-2"></div>
                    <div className="flex flex-row my-auto ml-2">
                        <FontAwesomeIcon icon={faUser} className="text-base w-4 mr-2"/>
                        <p className="text-sm">{page.authors}</p>
                    </div>
                </div>
            </div>
        </Link>
    )
}