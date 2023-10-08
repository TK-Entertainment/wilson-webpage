import { allBlogs } from "contentlayer/generated";

export type TagCount = {
  count: number;
};

export function getTagsMap() {
  const tagsMap = new Map<string, TagCount>();

  for (const blog of allBlogs) {
    for (const tag of blog.tags ?? []) {
      if (tagsMap.has(tag)) {
        tagsMap.get(tag)!.count++;
      } else {
        tagsMap.set(tag, { count: 1 });
      }
    }
  }

  return tagsMap;
}

export function getTopicTagsMap() {
  const tagsMap = getTagsMap();
  const topicTagsMap = new Map<string, TagCount>();

  for (const tag of tagsMap ?? []) {
    if (tag[0].slice(-1) === "版") {
      topicTagsMap.set(tag[0], tag[1]);
    }
  }

  return topicTagsMap;
}

export function getTagsMapWithoutTopics() {
  const tagsMap = getTagsMap();
  const topicTagsMap = getTopicTagsMap();

  for (const topics of topicTagsMap ?? []) {
    if (tagsMap.has(topics[0])) {
      tagsMap.delete(topics[0]);
    }
  }

  return tagsMap;
}
