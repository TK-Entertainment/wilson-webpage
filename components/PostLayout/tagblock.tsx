import Link from "next/link";
import getTopicTagsIcon from "@/utils/tagsicon";
import type { TagCount } from "@/utils/tags";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTag } from "@fortawesome/free-solid-svg-icons";

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
      className="flex flex-row p-3 pr-4 w-fit rounded-2xl border bg-card text-card-foreground transition-all hover:bg-accent hover:drop-shadow-2xl hover:scale-105"
    >
      <div className="flex rounded-2xl p-5 border overflow-hidden object-cover">
        <FontAwesomeIcon
          icon={getTopicTagsIcon(tag)}
          className="text-3xl text-card-foreground m-auto"
        />
      </div>
      <div className="flex flex-col ml-4 my-auto">
        <p className="text-3xl font-bold">{tag}</p>
        <p className="text-base font-normal opacity-70">{`${count.count} 個文章`}</p>
      </div>
    </Link>
  );
}
