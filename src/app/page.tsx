import {
  Heading,
  Text,
  Button,
  Avatar,
  RevealFx,
  Column,
  Badge,
  Row,
  Schema,
  Meta,
  Line,
} from "@once-ui-system/core";
import { home, about, person, baseURL, routes } from "@/resources";
import { Projects } from "@/components/work/Projects";
import { Posts } from "@/components/blog/Posts";
import styles from "./page.module.scss";

export async function generateMetadata() {
  return Meta.generate({
    title: home.title,
    description: home.description,
    baseURL: baseURL,
    path: home.path,
    image: home.image,
  });
}

export default function Home() {
  return (
    <Column maxWidth="m" gap="xl" paddingY="12" horizontal="center">
      <Schema
        as="webPage"
        baseURL={baseURL}
        path={home.path}
        title={home.title}
        description={home.description}
        image={`/api/og/generate?title=${encodeURIComponent(home.title)}`}
        author={{
          name: person.name,
          url: `${baseURL}${about.path}`,
          image: `${baseURL}${person.avatar}`,
        }}
      />
      <Row
        fillWidth
        gap="24"
        vertical="center"
        className={styles.heroRow}
        style={{
          width: "100%",
          maxWidth: "1320px",
        }}
      >
        <Column
          flex={1}
          horizontal="center"
          align="center"
          className={styles.mobileHeroMedia}
        >
          {home.featured.display && (
            <RevealFx
              fillWidth
              horizontal="center"
              className={styles.mobileFeaturedBadge}
              style={{ order: 1 }}
            >
              <Badge
                className={styles.heroBadge}
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}

          <RevealFx translateY="12" delay={0.45} horizontal="start" style={{ order: 2 }}>
            <Column
              flex={1}
              horizontal="center"
              align="center"
              className={styles.heroPortraitWrap}
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                width: "100%",
                maxWidth: "460px",
                flex: "0 0 460px",
                justifySelf: "start",
                order: 2,
                flexShrink: 0,
              }}
            >
              <div
                className={styles.heroPortrait}
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "460px",
                  minWidth: 0,
                  height: "560px",
                  overflow: "hidden",
                  borderRadius: "28px",
                  marginLeft: 0,
                  marginRight: "18px",
                  flexShrink: 0,
                }}
              >
                <img
                  src="/images/home.png"
                  alt={person.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "center left",
                    display: "block",
                    WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                    maskImage: "linear-gradient(to bottom, black 80%, transparent 100%)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: "30%",
                    pointerEvents: "none",
                  }}
                />
              </div>
            </Column>
          </RevealFx>
        </Column>
        <Column
          flex={1}
          horizontal="start"
          align="start"
          gap="m"
          className={styles.heroCopy}
          style={{
            minWidth: 0,
            width: "620px",
            maxWidth: "100%",
            flex: "0 0 620px",
            flexShrink: 0,
          }}
        >
          {home.featured.display && (
            <RevealFx fillWidth horizontal="start" paddingTop="16" paddingBottom="32" className={styles.desktopFeaturedBadge}>
              <Badge
                className={styles.heroBadge}
                background="brand-alpha-weak"
                paddingX="12"
                paddingY="4"
                onBackground="neutral-strong"
                textVariant="label-default-s"
                arrow={false}
                href={home.featured.href}
              >
                <Row paddingY="2">{home.featured.title}</Row>
              </Badge>
            </RevealFx>
          )}
          <RevealFx translateY="4" fillWidth horizontal="start" paddingBottom="16">
            <Heading
              wrap="balance"
              variant="display-strong-l"
              className={styles.heroHeading}
            >
              {home.headline}
            </Heading>
          </RevealFx>
          <RevealFx translateY="8" delay={0.2} fillWidth horizontal="start" paddingBottom="32">
            <Text
              wrap="balance"
              onBackground="neutral-weak"
              variant="heading-default-xl"
              className={styles.heroText}
            >
              {home.subline}
            </Text>
          </RevealFx>
          <RevealFx
            paddingTop="12"
            delay={0.4}
            horizontal="start"
            className={styles.heroButtonWrap}
          >
            <Button
              id="about"
              data-border="rounded"
              href={about.path}
              variant="secondary"
              size="m"
              weight="default"
              arrowIcon
              className={styles.heroCta}
            >
              <Row gap="8" vertical="center" paddingRight="4">
                {about.avatar.display && (
                  <Avatar
                    marginRight="8"
                    style={{ marginLeft: "-0.75rem" }}
                    src={person.avatar}
                    size="m"
                  />
                )}
                {about.title}
              </Row>
            </Button>
          </RevealFx>
        </Column>

      </Row>
      <RevealFx translateY="16" delay={0.6}>
        <Projects range={[1, 1]} />
      </RevealFx>
      {routes["/blog"] && (
        <Column fillWidth gap="24" marginBottom="l">
          <Row fillWidth paddingRight="64">
            <Line maxWidth={48} />
          </Row>
          <Row fillWidth gap="24" marginTop="40" s={{ direction: "column" }}>
            <Row flex={1} paddingLeft="l" paddingTop="24">
              <Heading as="h2" variant="display-strong-xs" wrap="balance">
                Latest from the blog
              </Heading>
            </Row>
            <Row flex={3} paddingX="20">
              <Posts range={[1, 2]} columns="2" />
            </Row>
          </Row>
          <Row fillWidth paddingLeft="64" horizontal="end">
            <Line maxWidth={48} />
          </Row>
        </Column>
      )}
      <Projects range={[2]} />
    </Column>
  );
}
