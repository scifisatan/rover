
import { FC } from "react";

interface GalleryImage {
  id: number;
  image_url: string;
  caption?: string;
  display_order: number;
}

interface GallerySectionProps {
  images: GalleryImage[];
}

export const GallerySection: FC<GallerySectionProps> = ({ images }) => {
  if (!images || images.length === 0) return null;

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-semibold mb-12 text-center">Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images
            .sort((a, b) => a.display_order - b.display_order)
            .map((image) => (
              <div
                key={image.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={image.image_url}
                  alt={image.caption || "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {image.caption && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <p className="text-white text-sm">{image.caption}</p>
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
    </section>
  );
};
