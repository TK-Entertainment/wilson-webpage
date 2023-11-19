import {
  faNewspaper,
  faUserAstronaut,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

const iconList = new Map<string, IconDefinition | null>();

iconList.set("Young Want星空", null);
iconList.set("天文板", faUserAstronaut);
iconList.set("大氣板", null);
iconList.set("海洋板", null);
iconList.set("地質板", null);
iconList.set("地球物理板", null);
iconList.set("繪圖板", null);
iconList.set("歷程檔案板", null);
iconList.set("日常紀錄板", null);

iconList.set("高中國文板", null);
iconList.set("高中數學板", null);
iconList.set("高中地科板", null);
iconList.set("高中生物板", null);
iconList.set("高中物理板", null);
iconList.set("高中化學板", null);

iconList.set("國中國文板", null);
iconList.set("國中數學板", null);
iconList.set("國中地科板", null);
iconList.set("國中生物板", null);
iconList.set("國中物理板", null);
iconList.set("國中化學板", null);

export function getTagExistance(tag: string | any) {
  return iconList.has(tag);
}

export default function getTopicTagsIcon(topic: string) {
  return iconList.get(topic) ?? faNewspaper;
}
