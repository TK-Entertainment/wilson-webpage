import DocsSlugPage, {
  generateMetadata as generateSlugMetadata,
} from "./[...slug]/page";

export default function DocsIndexPage() {
  return DocsSlugPage({ params: Promise.resolve({}) });
}

export function generateMetadata() {
  return generateSlugMetadata({ params: Promise.resolve({}) });
}
