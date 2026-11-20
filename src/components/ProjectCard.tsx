"use client";

import { AvatarGroup, Column, Flex, Heading, Icon, SmartLink, Text } from "@once-ui-system/core";
import Image from "next/image";
import { useRef, useState } from "react";
import styles from "./ProjectCard.module.scss";

interface ProjectCardProps {
  href: string;
  priority?: boolean;
  images: string[];
  title: string;
  content: string;
  description: string;
  avatars: { src: string }[];
  link: string;
}

interface ProjectImageCarouselProps {
  images: string[];
  title: string;
  priority: boolean;
}

function ProjectImageCarousel({ images, title, priority }: ProjectImageCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const [failedImage, setFailedImage] = useState<string | null>(null);
  const touchStartX = useRef<number | null>(null);
  const activeImage = images[activeIndex];

  if (!activeImage) {
    return null;
  }

  const showPrevious = () => setActiveIndex((index) => Math.max(index - 1, 0));
  const showNext = () => setActiveIndex((index) => Math.min(index + 1, images.length - 1));

  return (
    <>
      <div
        className={styles.carousel}
        onTouchStart={(event) => {
          touchStartX.current = event.touches[0]?.clientX ?? null;
        }}
        onTouchEnd={(event) => {
          if (touchStartX.current === null) return;

          const distance =
            touchStartX.current - (event.changedTouches[0]?.clientX ?? touchStartX.current);
          if (Math.abs(distance) > 50) {
            if (distance > 0) showNext();
            else showPrevious();
          }

          touchStartX.current = null;
        }}
      >
        {loadedImage !== activeImage && failedImage !== activeImage && (
          <output className={styles.loading}>Memuat gambar…</output>
        )}
        {failedImage === activeImage && (
          <output className={styles.loading}>Gambar gagal dimuat</output>
        )}
        <Image
          key={activeImage}
          src={activeImage}
          alt={`${title} — gambar ${activeIndex + 1}`}
          fill
          sizes="(max-width: 960px) 100vw, 960px"
          priority={priority && activeIndex === 0}
          className={styles.image}
          style={{ opacity: loadedImage === activeImage ? 1 : 0 }}
          onLoad={() => setLoadedImage(activeImage)}
          onError={() => setFailedImage(activeImage)}
        />
        {images.length > 1 && activeIndex > 0 && (
          <button
            type="button"
            className={`${styles.control} ${styles.previous}`}
            onClick={showPrevious}
            aria-label="Gambar sebelumnya"
          >
            <Icon name="chevronLeft" />
          </button>
        )}
        {images.length > 1 && activeIndex < images.length - 1 && (
          <button
            type="button"
            className={`${styles.control} ${styles.next}`}
            onClick={showNext}
            aria-label="Gambar berikutnya"
          >
            <Icon name="chevronRight" />
          </button>
        )}
      </div>
      {images.length > 1 && (
        <nav className={styles.indicators} aria-label="Pilih gambar proyek">
          {images.map((image, index) => (
            <button
              key={image}
              type="button"
              className={`${styles.indicator} ${index === activeIndex ? styles.active : ""}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`Tampilkan gambar ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
            />
          ))}
        </nav>
      )}
    </>
  );
}

export const ProjectCard: React.FC<ProjectCardProps> = ({
  href,
  priority = false,
  images = [],
  title,
  content,
  description,
  avatars,
  link,
}) => {
  return (
    <Column fillWidth gap="m">
      <ProjectImageCarousel images={images} title={title} priority={priority} />
      <Flex
        s={{ direction: "column" }}
        fillWidth
        paddingX="s"
        paddingTop="12"
        paddingBottom="24"
        gap="l"
      >
        {title && (
          <Flex flex={5}>
            <Heading as="h2" wrap="balance" variant="heading-strong-xl">
              {title}
            </Heading>
          </Flex>
        )}
        {(avatars?.length > 0 || description?.trim() || content?.trim()) && (
          <Column flex={7} gap="16">
            {avatars?.length > 0 && <AvatarGroup avatars={avatars} size="m" reverse />}
            {description?.trim() && (
              <Text wrap="balance" variant="body-default-s" onBackground="neutral-weak">
                {description}
              </Text>
            )}
            <Flex gap="24" wrap>
              {content?.trim() && (
                <SmartLink
                  suffixIcon="arrowRight"
                  style={{ margin: "0", width: "fit-content" }}
                  href={href}
                >
                  <Text variant="body-default-s">Read case study</Text>
                </SmartLink>
              )}
              {link && (
                <SmartLink
                  suffixIcon="arrowUpRightFromSquare"
                  style={{ margin: "0", width: "fit-content" }}
                  href={link}
                >
                  <Text variant="body-default-s">View project</Text>
                </SmartLink>
              )}
            </Flex>
          </Column>
        )}
      </Flex>
    </Column>
  );
};
