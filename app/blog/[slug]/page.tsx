import { allBlogs } from 'contentlayer/generated'
import { MDXContent } from 'next-docs-ui/mdx'
import { Content } from '@/components/content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faUser } from "@fortawesome/free-regular-svg-icons"

export default function BlogSlug({
    params
    } : {
        params: { slug?: string}
    }) {
    const page = allBlogs.find(blog => blog.slug == params.slug)

    if (page == undefined) {
        return (<></>)
    }

    return (
        <>
            <MDXContent>
                <div className="px-8 md:px-12 md:mt-8 mt-4">
                    <div className="md:py-8 py-4">
                        {page.tags?.map((tag, index) => (
                            <span key={`${index}`} className="text-sm mr-1 rounded-2xl border px-2">#&nbsp;{tag}</span>
                        ))
                        }
                        <h1>{page.title}</h1>
                        <h2>{page.description}</h2>
                        <h4 className="my-auto flex flex-row">
                            <FontAwesomeIcon icon={faUser} className="my-auto mr-2"/>{page.authors}
                            <div className="border-r-2 ml-2"></div>
                            <FontAwesomeIcon icon={faClock} className="my-auto ml-2 mr-2"/>{new Date(page.date).toLocaleString("zh-TW")}
                        </h4>
                    </div>
                    <Content code={page.body.code} />
                </div>
            </MDXContent>
        </>
    )    
}

export async function generateStaticParams(): Promise<{ slug: string }[]> {
    return allBlogs.map(blog => ({
      slug: blog.slug
    }))
  }