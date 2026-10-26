"use client";

import { Media, MasonryGrid, Text } from "@once-ui-system/core";
import { achievement, training } from "@/resources";

type AchievementViewProps = {
  type?: "achievement" | "training" | "all";
};

const toDriveViewUrl = (src: string) => {
  const match = src.match(/(?:\/d\/|id=)([A-Za-z0-9_-]{10,})/i);
  const fileId = match?.[1];

  return fileId ? `https://drive.google.com/file/d/${fileId}/view?usp=sharing` : null;
};

const renderGallery = (title: string, items: typeof achievement.training) => {
  if (!items || items.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <Text as="h2" size="l" weight="strong" style={{ margin: 0 }}>
        {title}
      </Text>
      <MasonryGrid columns={2} s={{ columns: 1 }}>
        {items.map((image, index) => {
          const src = image.src.toLowerCase();
          const isGoogleDrivePdf = src.includes("drive.google.com/file/d/") && (src.includes("/preview") || src.includes("/view"));
          const isGoogleDriveImage =
            src.includes("drive.google.com/thumbnail") ||
            src.includes("drive.google.com/uc") ||
            src.includes("drive.usercontent.google.com") ||
            src.includes("googleusercontent.com");
          const viewUrl = toDriveViewUrl(image.src);

          return (
            <div
              key={`${title}-${index}`}
              style={{ display: "flex", flexDirection: "column", gap: "12px", overflow: "hidden" }}
            >
              <div style={{ position: "relative", width: "100%" }}>
                {isGoogleDrivePdf ? (
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      minHeight: "420px",
                      height: image.orientation === "horizontal" ? "460px" : "560px",
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
                        background: "#fff",
                      }}
                      title={image.alt}
                      allow="fullscreen"
                      allowFullScreen
                      loading="lazy"
                    />
                  </div>
                ) : isGoogleDriveImage ? (
                  <img
                    src={image.src}
                    alt={image.alt}
                    referrerPolicy="no-referrer"
                    style={{
                      display: "block",
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                      objectFit: "cover",
                      background: "#0f1115",
                    }}
                  />
                ) : (
                  <Media
                    enlarge
                    priority={index < 10}
                    sizes="(max-width: 560px) 100vw, 50vw"
                    radius="m"
                    aspectRatio={
                      image.orientation === "square"
                        ? "3 / 4"
                        : image.orientation === "horizontal"
                          ? "16 / 9"
                          : "3 / 4"
                    }
                    src={image.src}
                    alt={image.alt}
                    style={{ overflow: "hidden" }}
                  />
                )}

                {viewUrl && (
                  <a
                    href={viewUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{
                      position: "absolute",
                      right: 12,
                      bottom: 12,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "8px 12px",
                      borderRadius: "999px",
                      background: "rgba(15, 17, 21, 0.78)",
                      border: "1px solid rgba(255, 255, 255, 0.18)",
                      color: "#ffffff",
                      textDecoration: "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      letterSpacing: "0.02em",
                      boxShadow: "0 10px 24px rgba(0, 0, 0, 0.25)",
                      backdropFilter: "blur(6px)",
                    }}
                  >
                    View
                  </a>
                )}
              </div>

              {image.caption && (
                <Text size="s" onBackground="neutral-medium" style={{ textAlign: "center", padding: "0 16px" }}>
                  {image.caption}
                </Text>
              )}
            </div>
          );
        })}
      </MasonryGrid>
    </div>
  );
};

export default function AchievementView({ type = "all" }: AchievementViewProps) {
  const trainingItems = training.training ?? [];
  const achievementSections = achievement.sections ?? {
    sertifikat: achievement.achievements ?? [],
    suratKeputusan: [],
    ujiKompetensi: [],
  };

  if (type === "training") {
    return <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>{renderGallery("Pelatihan", trainingItems)}</div>;
  }

  if (type === "achievement") {
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
        {renderGallery("Sertifikat", achievementSections.sertifikat ?? [])}
        {renderGallery("Surat Keputusan", achievementSections.suratKeputusan ?? [])}
        {renderGallery("Uji Kompetensi", achievementSections.ujiKompetensi ?? [])}
      </div>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {renderGallery("Pelatihan", trainingItems)}
      {renderGallery("Sertifikat", achievementSections.sertifikat ?? [])}
      {renderGallery("Surat Keputusan", achievementSections.suratKeputusan ?? [])}
      {renderGallery("Uji Kompetensi", achievementSections.ujiKompetensi ?? [])}
    </div>
  );
}
