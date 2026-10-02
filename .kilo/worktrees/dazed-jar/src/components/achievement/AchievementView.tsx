"use client";

import { Media, MasonryGrid, Text } from "@once-ui-system/core";
import { achievement } from "@/resources";

export default function AchievementView() {
  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {achievement.images.map((image, index) => (
        <div key={index} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {image.external ? (
            <div style={{ position: "relative", width: "100%", height: "0", paddingBottom: image.orientation === "square" ? "100%" : image.orientation === "horizontal" ? "56.25%" : "133.33%" }}>
              <iframe
                src={image.src}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", borderRadius: "8px" }}
                title={image.alt}
                allow="fullscreen"
                allowFullScreen
              />
            </div>
          ) : (
            <Media
              enlarge
              priority={index < 10}
              sizes="(max-width: 560px) 100vw, 50vw"
              radius="m"
              aspectRatio={image.orientation === "square" ? "1 / 1" : image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
              src={image.src}
              alt={image.alt}
            />
          )}
          {image.caption && (
            <Text size="s" onBackground="neutral-medium" style={{ textAlign: "center", padding: "0 16px" }}>
              {image.caption}
            </Text>
          )}
        </div>
      ))}
    </MasonryGrid>
  );
}