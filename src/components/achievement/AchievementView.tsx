"use client";

import { Media, MasonryGrid, Text } from "@once-ui-system/core";
import { achievement } from "@/resources";

export default function AchievementView() {
  return (
    <MasonryGrid columns={2} s={{ columns: 1 }}>
      {achievement.images.map((image, index) => {
        const isGoogleDrivePreview = image.src.includes("drive.google.com");

        return (
          <div key={index} style={{ display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden" }}>
            {isGoogleDrivePreview ? (
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "0",
                  paddingBottom: image.orientation === "square" ? "133.33%" : image.orientation === "horizontal" ? "56.25%" : "133.33%",
                  overflow: "hidden",
                  borderRadius: "8px",
                  background: "#0f1115",
                }}
              >
                <iframe
                  src={image.src}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    border: "none",
                    borderRadius: "8px",
                    overflow: "hidden",
                    background: "#fff",
                    transform: "scale(1)",
                    zoom: 1,
                  }}
                  title={image.alt}
                  allow="fullscreen"
                  allowFullScreen
                  scrolling="no"
                />
              </div>
            ) : (
              <Media
                enlarge
                priority={index < 10}
                sizes="(max-width: 560px) 100vw, 50vw"
                radius="m"
                aspectRatio={image.orientation === "square" ? "3 / 4" : image.orientation === "horizontal" ? "16 / 9" : "3 / 4"}
                src={image.src}
                alt={image.alt}
                style={{ overflow: "hidden" }}
              />
            )}
            {image.caption && (
              <Text size="s" onBackground="neutral-medium" style={{ textAlign: "center", padding: "0 16px" }}>
                {image.caption}
              </Text>
            )}
          </div>
        );
      })}
    </MasonryGrid>
  );
}