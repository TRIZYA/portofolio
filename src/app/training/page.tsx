import { Flex, Meta, Schema } from "@once-ui-system/core";
import AchievementView from "@/components/achievement/AchievementView";
import { baseURL, person, training } from "@/resources";

export async function generateMetadata() {
  return Meta.generate({
    title: training.title,
    description: training.description,
    baseURL: baseURL,
    image: `/api/og/generate?title=${encodeURIComponent(training.title)}`,
    path: training.path,
  });
}

export default function TrainingPage() {
  return (
    <Flex maxWidth="l">
      <Schema
        as="webPage"
        baseURL={baseURL}
        title={training.title}
        description={training.description}
        path={training.path}
        image={`/api/og/generate?title=${encodeURIComponent(training.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${training.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <AchievementView type="training" />
    </Flex>
  );
}
