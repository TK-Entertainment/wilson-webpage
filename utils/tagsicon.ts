import {
  faNewspaper,
  faUserAstronaut,
  faStar,
  faCloudShowersWater,
  faWater,
  faHillRockslide,
  faEarthAmericas,
  faPaintBrush,
  faFileArrowUp,
  faBook,
  faLanguage,
  faCalculator,
  faSatellite,
  faDna,
  faAtom,
  faFlaskVial,
  IconDefinition,
} from "@fortawesome/free-solid-svg-icons";

const iconList = new Map<string, IconDefinition | null>();

iconList.set("Young Want星空", faStar);
iconList.set("天文板", faUserAstronaut);
iconList.set("大氣板", faCloudShowersWater);
iconList.set("海洋板", faWater);
iconList.set("地質板", faHillRockslide);
iconList.set("地球物理板", faEarthAmericas);
iconList.set("繪圖板", faPaintBrush);
iconList.set("歷程檔案板", faFileArrowUp);
iconList.set("日常紀錄板", faBook);

iconList.set("高中國文板", faLanguage);
iconList.set("高中數學板", faCalculator);
iconList.set("高中地科板", faSatellite);
iconList.set("高中生物板", faDna);
iconList.set("高中物理板", faAtom);
iconList.set("高中化學板", faFlaskVial);

iconList.set("國中國文板", faLanguage);
iconList.set("國中數學板", faCalculator);
iconList.set("國中地科板", faSatellite);
iconList.set("國中生物板", faDna);
iconList.set("國中物理板", faAtom);
iconList.set("國中化學板", faFlaskVial);

export function getTagExistance(tag: string | any) {
  return iconList.has(tag);
}

export default function getTopicTagsIcon(topic: string) {
  return iconList.get(topic) ?? faNewspaper;
}
