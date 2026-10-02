import { Flex, Meta, Schema } from "@once-ui-system/core";
import AchievementView from "@/components/achievement/AchievementView";
import { achievement, baseURL, person } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: achievement.title,
    description: achievement.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(achievement.title)}`,
    path: achievement.path,
  });
}

export default function AchievementPage() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={achievement.title}
        description={achievement.description}
        path={achievement.path}
        image={`/api/og/generate?title=${encodeURIComponent(achievement.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${achievement.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <AchievementView />
    </Flex>
  );
}