import Link from "next/link";
import getTopicTagsIcon from "@/utils/tagsicon";
import type { TagCount } from "@/utils/tags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function TagBlock({
  tag,
  count,
}: {
  tag: string;
  count: TagCount;
}) {
  return (
    <Link
      href={`/blog/tags/${tag}`}
      className="inline-flex items-center gap-2 text-lg text-muted-foreground transition-colors hover:text-foreground"
    >
      <FontAwesomeIcon icon={getTopicTagsIcon(tag)} className="text-sm" />
      <span>{tag}</span>
      <span className="text-sm opacity-60">{count.count}</span>
    </Link>
  );
}
