import { faNewspaper, faUserAstronaut, IconDefinition } from "@fortawesome/free-solid-svg-icons";

const iconList = new Map<string, IconDefinition>();
iconList.set("天文版", faUserAstronaut);

export default function getTopicTagsIcon( topic: string ) {
    return (iconList.get(topic) ?? faNewspaper);
}