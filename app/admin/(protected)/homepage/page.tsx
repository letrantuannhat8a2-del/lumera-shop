  "use client";

  import { useEffect, useRef, useState } from "react";
  import FeaturedEditor from "./FeaturedEditor";
  import BrandStatementEditor from "./BrandStatementEditor";
  import FooterEditor from "./FooterEditor";
  import ServiceStripEditor from "./ServiceStripEditor";
  type Product = {
  id: string;
  name: string;
  price: number;
  currency?: string;
  image_1?: string | null;
  is_active?: boolean;
  created_at?: string;
};

  type HeroSlide = {
    image: string;
    label: string;
    title: string;
    italicTitle: string;
    description: string;
    buttonText: string;
    buttonLink: string;
    positionX?: number;
    positionY?: number;
    zoom?: number;
  };

  type Category = {
    image: string;
    name: string;
    description?: string;
    link: string;
    positionX?: number;
    positionY?: number;
    zoom?: number;
  };

  type Editorial = {
    enabled?: boolean;
    image?: string;
    label?: string;
    title?: string;
    italicTitle?: string;
    description?: string;
    buttonText?: string;
    buttonLink?: string;
    positionX?: number;
    positionY?: number;
    zoom?: number;
  };
  type Featured = {
    enabled?: boolean;
    label?: string;
    title?: string;
    description?: string;
    product_ids?: string[];
    buttonText?: string;
    buttonLink?: string;
  };
  type Exclusive = {
    enabled?: boolean;
    label?: string;
    title?: string;
    description?: string;
    product_ids?: string[];
  };

  type About = {
    enabled?: boolean;
    label?: string;
    title?: string;
    italicTitle?: string;
    description?: string;
    image?: string;
    buttonText?: string;
    buttonLink?: string;
    positionX?: number;
    positionY?: number;
    zoom?: number;
  };

  type HomepageData = {
    announcement: {
      enabled?: boolean;
      text?: string;
    };

    hero: {
      slides?: HeroSlide[];
    };

    categories: {
      items?: Category[];
    };

    editorial: Editorial[];
    featured: Featured;
    exclusive: Exclusive;
about: About;
    brand_statement: {
  enabled?: boolean;
  label?: string;
  title?: string;
  description?: string;
};
footer: {
  enabled?: boolean;
  description?: string;
  shopLinks?: {
    label: string;
    href: string;
  }[];
  clientCareLinks?: {
    label: string;
    href: string;
  }[];
  aboutLinks?: {
    label: string;
    href: string;
  }[];
  copyright?: string;
};
service_strip: {
  enabled?: boolean;
  items?: {
    title: string;
    subtitle: string;
  }[];
};
  };

  const emptySlide: HeroSlide = {
    image: "/image/image_1.png",
    label: "NEW COLLECTION",
    title: "ELEGANCE",
    italicTitle: "IN EVERY STEP",
    description:
      "Timeless designs for life's most beautiful moments.",
    buttonText: "DISCOVER THE COLLECTION",
    buttonLink: "/shop",
    positionX: 50,
    positionY: 50,
    zoom: 1,
  };

  const emptyCategory: Category = {
    image: "/image/image_1.png",
    name: "WEDDING SHOES",
    description:
      "Elegant shoes for your most beautiful moments.",
    link: "/shop",
    positionX: 50,
    positionY: 50,
    zoom: 1,
  };

  const emptyEditorial: Editorial = {
    enabled: true,
    image: "/image/image_4.png",
    label: "THE VIREL EDIT",
    title: "A little more",
    italicTitle: "extraordinary.",
    description:
      "Every pair is thoughtfully designed to elevate your style and become part of your most beautiful memories.",
    buttonText: "DISCOVER THE EDIT",
    buttonLink: "/collections",
    positionX: 50,
    positionY: 50,
    zoom: 1,
  };
  const emptyFeatured: Featured = {
  enabled: true,
  label: "FEATURED",
  title: "Our favorites",
  description: "",
  product_ids: [],
  buttonText: "SHOP NOW",
  buttonLink: "/shop",
};
const emptyBrandStatement = {
  enabled: true,
  label: "VIREL",
  title:
    "Made for the moments\nyou'll remember forever.",
  description:
    "Refined silhouettes. Romantic details. Beautifully considered from every angle.",
};
const emptyFooter = {
  enabled: true,

  description:
    "Elegant footwear designed for weddings, celebrations and unforgettable occasions.",

  shopLinks: [
    {
      label: "New Arrivals",
      href: "/shop?sort=new",
    },
    {
      label: "Wedding Shoes",
      href: "/shop?category=wedding-shoes",
    },
    {
      label: "Heels",
      href: "/shop?category=heels",
    },
    {
      label: "Flats",
      href: "/shop?category=flats",
    },
    {
      label: "Sale",
      href: "/sale",
    },
  ],

  clientCareLinks: [
    {
      label: "Contact Us",
      href: "/contact",
    },
    {
      label: "Shipping & Returns",
      href: "/shipping-returns",
    },
    {
      label: "Size Guide",
      href: "/size-guide",
    },
    {
      label: "FAQs",
      href: "/faq",
    },
    {
      label: "My Account",
      href: "/account",
    },
  ],

  aboutLinks: [
    {
      label: "About Us",
      href: "/about",
    },
    {
      label: "Instagram",
      href: "#",
    },
    {
      label: "Pinterest",
      href: "#",
    },
    {
      label: "TikTok",
      href: "#",
    },
  ],

  copyright:
    "© 2026 VIREL BRIDAL SHOES. ALL RIGHTS RESERVED.",
};

const emptyExclusive: Exclusive = {
  enabled: true,
  label: "THE VIREL EDIT",
  title: "Exclusive Collection",
  description:
    "A curated selection of VIREL bridal shoes, chosen for the moments that deserve something extraordinary.",
  product_ids: [],
};

const emptyAbout: About = {
  enabled: true,
  label: "THE VIREL STORY",
  title: "Made for",
  italicTitle: "the moment.",
  description:
    "VIREL was created with a simple idea: the shoes you wear on your most meaningful days should feel just as beautiful as the memories you create in them.",
  image: "/image/image_4.png",
  buttonText: "DISCOVER VIREL",
  buttonLink: "/about",
  positionX: 50,
  positionY: 50,
  zoom: 1,
};

const emptyServiceStrip = {
  enabled: true,

  items: [
    {
      title: "COMPLIMENTARY GIFT WRAP",
      subtitle: "On all orders",
    },
    {
      title: "WORLDWIDE SHIPPING",
      subtitle: "Fast & reliable delivery",
    },
    {
      title: "SECURE PAYMENTS",
      subtitle: "Safe & trusted checkout",
    },
    {
      title: "DESIGNED TO LAST",
      subtitle: "Premium quality materials",
    },
  ],
};

  export default function HomepageAdminPage() {
    const [homepage, setHomepage] =
      useState<HomepageData | null>(null);

    const [loading, setLoading] =
      useState(true);

    const [saving, setSaving] =
      useState(false);

    const [uploading, setUploading] =
      useState<number | null>(null);

    const [message, setMessage] =
      useState("");
      const [products, setProducts] = useState<Product[]>([]);

    // =====================================================
    // LOAD HOMEPAGE
    // =====================================================

    useEffect(() => {
      async function loadHomepage() {
        try {
          const productsResponse =
  await fetch(
    "/api/admin/products",
    {
      cache: "no-store",
    }
  );

const productsResult =
  await productsResponse.json();

if (!productsResponse.ok) {
  throw new Error(
    productsResult.error ||
      "Unable to load products."
  );
}

setProducts(
  productsResult.products ?? []
);
          const response = await fetch(
            "/api/admin/homepage",
            {
              cache: "no-store",
            }
          );

          const result =
            await response.json();

          if (!response.ok) {
            throw new Error(
              result.error ||
                "Unable to load homepage."
            );
          }

          const data = result.data;

          /*
          * Editorial phải là ARRAY.
          *
          * Nếu database đang là object cũ,
          * tự chuyển object -> array.
          */
          const editorialData: Editorial[] =
            Array.isArray(data.editorial)
              ? data.editorial
              : data.editorial
                ? [data.editorial]
                : [{ ...emptyEditorial }];

          setHomepage({
            announcement:
              data.announcement ?? {
                enabled: true,
                text:
                  "COMPLIMENTARY SHIPPING ON ALL ORDERS OVER $150",
              },

            hero: {
              slides:
                Array.isArray(
                  data.hero?.slides
                ) &&
                data.hero.slides.length > 0
                  ? data.hero.slides
                  : [{ ...emptySlide }],
            },

            categories: {
              items:
                Array.isArray(
                  data.categories?.items
                ) &&
                data.categories.items.length > 0
                  ? data.categories.items
                  : [{ ...emptyCategory }],
            },

            editorial: editorialData,
             featured:
            data.featured ?? {
              ...emptyFeatured,
            },
            brand_statement:
  data.brand_statement ?? {
    ...emptyBrandStatement,
  },
  exclusive:
    data.exclusive ?? {
      ...emptyExclusive,
    },
  about:
    data.about ?? {
      ...emptyAbout,
    },
  footer:
  data.footer ?? {
    ...emptyFooter,
  },
  service_strip:
  data.service_strip ?? {
    ...emptyServiceStrip,
  },
          });
        } catch (error) {
          console.error(
            "Homepage editor load error:",
            error
          );

          setMessage(
            error instanceof Error
              ? error.message
              : "Unable to load homepage."
          );
        } finally {
          setLoading(false);
        }
      }

      loadHomepage();
    }, []);

    // =====================================================
    // UPDATE HERO
    // =====================================================

    function updateHero(
      index: number,
      field: keyof HeroSlide,
      value: string | number
    ) {
      if (!homepage) return;

      const slides = [
        ...(homepage.hero.slides ?? []),
      ];

      slides[index] = {
        ...slides[index],
        [field]: value,
      };

      setHomepage({
        ...homepage,
        hero: {
          ...homepage.hero,
          slides,
        },
      });
    }

    // =====================================================
    // UPDATE CATEGORY
    // =====================================================

    function updateCategory(
      index: number,
      field: keyof Category,
      value: string | number
    ) {
      if (!homepage) return;

      const items = [
        ...(homepage.categories.items ?? []),
      ];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      setHomepage({
        ...homepage,
        categories: {
          ...homepage.categories,
          items,
        },
      });
    }

    // =====================================================
    // UPDATE EDITORIAL
    // =====================================================

    function updateEditorial(
      index: number,
      field: keyof Editorial,
      value: string | number | boolean
    ) {
      if (!homepage) return;

      const items = [
        ...homepage.editorial,
      ];

      items[index] = {
        ...items[index],
        [field]: value,
      };

      setHomepage({
        ...homepage,
        editorial: items,
      });
    }

    // =====================================================
    // UPLOAD HERO IMAGE
    // =====================================================

    async function uploadHeroImage(
      index: number,
      file: File
    ) {
      if (!homepage) return;

      setUploading(index);
      setMessage("");

      try {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await fetch(
            "/api/admin/homepage/upload",
            {
              method: "POST",
              body: formData,
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to upload image."
          );
        }

        if (!result.url) {
          throw new Error(
            "Upload succeeded but no image URL was returned."
          );
        }

        updateHero(
          index,
          "image",
          result.url
        );

        setMessage(
          "Hero image uploaded successfully."
        );
      } catch (error) {
        console.error(
          "Hero image upload error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to upload image."
        );
      } finally {
        setUploading(null);
      }
    }

    // =====================================================
    // UPLOAD CATEGORY IMAGE
    // =====================================================

    async function uploadCategoryImage(
      index: number,
      file: File
    ) {
      if (!homepage) return;

      setUploading(index + 1000);
      setMessage("");

      try {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await fetch(
            "/api/admin/homepage/upload",
            {
              method: "POST",
              body: formData,
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to upload image."
          );
        }

        if (!result.url) {
          throw new Error(
            "Upload succeeded but no image URL was returned."
          );
        }

        updateCategory(
          index,
          "image",
          result.url
        );

        setMessage(
          "Category image uploaded successfully."
        );
      } catch (error) {
        console.error(
          "Category image upload error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to upload image."
        );
      } finally {
        setUploading(null);
      }
    }

    // =====================================================
    // UPLOAD EDITORIAL IMAGE
    // =====================================================

    async function uploadEditorialImage(
      index: number,
      file: File
    ) {
      if (!homepage) return;

      setUploading(index + 2000);
      setMessage("");

      try {
        const formData =
          new FormData();

        formData.append(
          "file",
          file
        );

        const response =
          await fetch(
            "/api/admin/homepage/upload",
            {
              method: "POST",
              body: formData,
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to upload image."
          );
        }

        if (!result.url) {
          throw new Error(
            "Upload succeeded but no image URL was returned."
          );
        }

        setHomepage((prev) => {
          if (!prev) return prev;

          const items = [
            ...prev.editorial,
          ];

          items[index] = {
            ...items[index],
            image: result.url,
          };

          return {
            ...prev,
            editorial: items,
          };
        });

        setMessage(
          "Editorial image uploaded successfully."
        );
      } catch (error) {
        console.error(
          "Editorial image upload error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to upload image."
        );
      } finally {
        setUploading(null);
      }
    }

    // =====================================================
    // DELETE CATEGORY
    // =====================================================

    function deleteCategory(
      index: number
    ) {
      if (!homepage) return;

      const items = (
        homepage.categories.items ?? []
      ).filter(
        (_, itemIndex) =>
          itemIndex !== index
      );

      setHomepage({
        ...homepage,
        categories: {
          ...homepage.categories,
          items,
        },
      });
    }

    // =====================================================
    // ADD CATEGORY
    // =====================================================

    function addCategory() {
      if (!homepage) return;

      setHomepage({
        ...homepage,
        categories: {
          ...homepage.categories,
          items: [
            ...(homepage.categories.items ?? []),
            {
              ...emptyCategory,
            },
          ],
        },
      });
    }

    // =====================================================
    // DELETE EDITORIAL
    // =====================================================

    function deleteEditorial(
      index: number
    ) {
      if (!homepage) return;

      const items =
        homepage.editorial.filter(
          (_, itemIndex) =>
            itemIndex !== index
        );

      setHomepage({
        ...homepage,
        editorial: items,
      });
    }

    // =====================================================
    // ADD EDITORIAL
    // =====================================================

    function addEditorial() {
      if (!homepage) return;

      setHomepage({
        ...homepage,
        editorial: [
          ...homepage.editorial,
          {
            ...emptyEditorial,
          },
        ],
      });
    }

    // =====================================================
    // UPDATE EXCLUSIVE
    // =====================================================

    function toggleExclusiveProduct(productId: string) {
      if (!homepage) return;

      const currentIds = homepage.exclusive.product_ids ?? [];
      const exists = currentIds.includes(productId);

      setHomepage({
        ...homepage,
        exclusive: {
          ...homepage.exclusive,
          product_ids: exists
            ? currentIds.filter((id) => id !== productId)
            : [...currentIds, productId],
        },
      });
    }

    function updateAbout(
      field: keyof About,
      value: string | number | boolean
    ) {
      if (!homepage) return;

      setHomepage({
        ...homepage,
        about: {
          ...homepage.about,
          [field]: value,
        },
      });
    }

    async function uploadAboutImage(file: File) {
      if (!homepage) return;

      setUploading(3000);
      setMessage("");

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
          "/api/admin/homepage/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to upload image."
          );
        }

        if (!result.url) {
          throw new Error(
            "Upload succeeded but no image URL was returned."
          );
        }

        updateAbout("image", result.url);
        setMessage("About image uploaded successfully.");
      } catch (error) {
        console.error("About image upload error:", error);
        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to upload image."
        );
      } finally {
        setUploading(null);
      }
    }

    // =====================================================
    // SAVE HOMEPAGE
    // =====================================================

    async function saveHomepage() {
      if (!homepage) return;

      setSaving(true);
      setMessage("");

      try {
        const response =
          await fetch(
            "/api/admin/homepage",
            {
              method: "PUT",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify(
                homepage
              ),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.error ||
              "Unable to save homepage."
          );
        }

        const editorialData: Editorial[] =
          Array.isArray(
            result.data.editorial
          )
            ? result.data.editorial
            : result.data.editorial
              ? [result.data.editorial]
              : [];

        setHomepage({
          announcement:
            result.data.announcement ?? {
              enabled: true,
              text: "",
            },

          hero: {
            slides:
              Array.isArray(
                result.data.hero?.slides
              )
                ? result.data.hero.slides
                : [{ ...emptySlide }],
          },

          categories: {
            items:
              Array.isArray(
                result.data.categories?.items
              )
                ? result.data.categories.items
                : [],
          },

          editorial:
            editorialData,
             featured:
          result.data.featured ?? {
            ...emptyFeatured,
          },
          brand_statement:
  result.data.brand_statement ?? {
    ...emptyBrandStatement,
  },
  exclusive:
    result.data.exclusive ?? {
      ...emptyExclusive,
    },
  about:
    result.data.about ?? {
      ...emptyAbout,
    },
  footer:
  result.data.footer ?? {
    ...emptyFooter,
  },
  service_strip:
  result.data.service_strip ?? {
    ...emptyServiceStrip,
  },
        });

        setMessage(
          "Homepage saved successfully."
        );
      } catch (error) {
        console.error(
          "Homepage save error:",
          error
        );

        setMessage(
          error instanceof Error
            ? error.message
            : "Unable to save homepage."
        );
      } finally {
        setSaving(false);
      }
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
      return (
        <main className="min-h-screen bg-[#f8f4f1] px-6 py-12 text-[#201b1b]">
          <div className="mx-auto max-w-6xl">

            <div className="animate-pulse">

              <div className="h-8 w-56 rounded bg-[#e7ded9]" />

              <div className="mt-10 h-96 rounded-2xl bg-[#e7ded9]" />

            </div>

          </div>
        </main>
      );
    }

    // =====================================================
    // ERROR
    // =====================================================

   if (!homepage) {
  return (
    <main className="min-h-screen bg-[#f8f4f1] px-6 py-12">

      <div className="mx-auto max-w-6xl">

        <p>
          {message ||
            "Unable to load homepage."}
        </p>

      </div>

    </main>
  );
}

    const slides =
      homepage.hero.slides ?? [];

    const categories =
      homepage.categories.items ?? [];

    // =====================================================
    // PAGE
    // =====================================================

    return (
      <main className="min-h-screen bg-[#f8f4f1] text-[#201b1b]">

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="sticky top-0 z-50 border-b border-[#201b1b]/10 bg-[#fcfaf7]/95 backdrop-blur-md">

          <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-6 py-5">

            <div>

              <p className="text-[8px] tracking-[0.35em] text-[#a77d7f]">
                VIREL ADMIN
              </p>

              <h1 className="mt-1 font-serif text-3xl">
                Homepage
              </h1>

            </div>

            <button
              type="button"
              onClick={saveHomepage}
              disabled={saving}
              className="bg-[#211c1c] px-6 py-3 text-[8px] tracking-[0.2em] text-white transition hover:bg-[#4b3c3c] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "SAVING..."
                : "SAVE CHANGES"}
            </button>

          </div>

        </div>

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <div className="mx-auto max-w-6xl px-6 py-10">

          {/* MESSAGE */}

          {message && (
            <div className="mb-6 border border-[#201b1b]/10 bg-white px-5 py-4 text-[9px] tracking-[0.08em]">
              {message}
            </div>
          )}

          {/* =====================================================
              ANNOUNCEMENT
          ===================================================== */}

          <section className="overflow-hidden rounded-2xl border border-[#201b1b]/10 bg-white">

            <div className="border-b border-[#201b1b]/10 px-6 py-5">

              <p className="text-[8px] tracking-[0.3em] text-[#a77d7f]">
                GLOBAL
              </p>

              <h2 className="mt-1 font-serif text-2xl">
                Announcement bar
              </h2>

            </div>

            <div className="space-y-5 px-6 py-6">

              <label className="flex items-center gap-3 text-[9px] tracking-[0.08em]">

                <input
                  type="checkbox"
                  checked={
                    homepage.announcement?.enabled ??
                    true
                  }
                  onChange={(event) =>
                    setHomepage({
                      ...homepage,
                      announcement: {
                        ...homepage.announcement,
                        enabled:
                          event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />

                SHOW ANNOUNCEMENT

              </label>

              <div>

                <label className="mb-2 block text-[8px] tracking-[0.15em] text-[#766969]">
                  TEXT
                </label>

                <input
                  type="text"
                  value={
                    homepage.announcement?.text ??
                    ""
                  }
                  onChange={(event) =>
                    setHomepage({
                      ...homepage,
                      announcement: {
                        ...homepage.announcement,
                        text:
                          event.target.value,
                      },
                    })
                  }
                  className="w-full border border-[#201b1b]/15 bg-[#fcfaf7] px-4 py-3 text-sm outline-none transition focus:border-[#a77d7f]"
                />

              </div>

            </div>

          </section>

          {/* =====================================================
              HERO
          ===================================================== */}

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#201b1b]/10 bg-white">

            <div className="border-b border-[#201b1b]/10 px-6 py-5">

              <p className="text-[8px] tracking-[0.3em] text-[#a77d7f]">
                HOMEPAGE
              </p>

              <h2 className="mt-1 font-serif text-2xl">
                Hero slider
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-[#766969]">
                Manage the images and text displayed
                in your homepage hero section.
              </p>

            </div>

            <div className="space-y-10 p-6">

              {slides.map(
                (slide, index) => (

                  <div
                    key={`${slide.image}-${index}`}
                    className="border border-[#201b1b]/10 bg-[#fcfaf7]"
                  >

                    <div className="flex items-center justify-between border-b border-[#201b1b]/10 px-5 py-4">

                      <div>

                        <p className="text-[7px] tracking-[0.3em] text-[#a77d7f]">
                          SLIDE {index + 1}
                        </p>

                        <p className="mt-1 text-[10px] tracking-[0.08em]">
                          Hero slide
                        </p>

                      </div>

                    </div>

                    <div className="grid gap-7 p-5 lg:grid-cols-[420px_1fr]">

                      {/* IMAGE */}

                      <div>

                        <div className="relative aspect-[16/7] overflow-hidden bg-[#eadbd6]">

                          <img
                            src={slide.image}
                            alt={`Hero slide ${index + 1}`}
                            className="h-full w-full object-cover transition-transform duration-300"
                            style={{
                              objectPosition: `${
                                slide.positionX ?? 50
                              }% ${
                                slide.positionY ?? 50
                              }%`,
                              transform: `scale(${
                                slide.zoom ?? 1
                              })`,
                            }}
                          />

                          {uploading === index && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[9px] tracking-[0.2em] text-white">
                              UPLOADING...
                            </div>
                          )}

                        </div>

                        <label className="mt-4 flex cursor-pointer items-center justify-center border border-[#201b1b] bg-white px-5 py-3 text-[8px] tracking-[0.2em] transition hover:bg-[#211c1c] hover:text-white">

                          {uploading === index
                            ? "UPLOADING..."
                            : "CHANGE IMAGE"}

                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            disabled={
                              uploading !== null
                            }
                            onChange={(event) => {
                              const file =
                                event.target.files?.[0];

                              if (file) {
                                uploadHeroImage(
                                  index,
                                  file
                                );
                              }

                              event.target.value =
                                "";
                            }}
                          />

                        </label>

                        <p className="mt-2 text-[8px] leading-5 text-[#897979]">
                          JPG, PNG, WEBP or AVIF.
                          Maximum 10MB.
                        </p>

                        <ImageControls
                          image={slide.image}
                          aspectRatio="16/7"
                          positionX={
                            slide.positionX
                          }
                          positionY={
                            slide.positionY
                          }
                          zoom={slide.zoom}
                          onPositionXChange={(
                            value
                          ) =>
                            updateHero(
                              index,
                              "positionX",
                              value
                            )
                          }
                          onPositionYChange={(
                            value
                          ) =>
                            updateHero(
                              index,
                              "positionY",
                              value
                            )
                          }
                          onZoomChange={(value) =>
                            updateHero(
                              index,
                              "zoom",
                              value
                            )
                          }
                        />

                      </div>

                      {/* FIELDS */}

                      <div className="space-y-5">

                        <EditorInput
                          label="LABEL"
                          value={
                            slide.label
                          }
                          onChange={(value) =>
                            updateHero(
                              index,
                              "label",
                              value
                            )
                          }
                        />
                        {/* =====================================================
    FOOTER
===================================================== */}



                        <EditorInput
                          label="TITLE"
                          value={
                            slide.title
                          }
                          onChange={(value) =>
                            updateHero(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        <EditorInput
                          label="ITALIC TITLE"
                          value={
                            slide.italicTitle
                          }
                          onChange={(value) =>
                            updateHero(
                              index,
                              "italicTitle",
                              value
                            )
                          }
                        />

                        <EditorTextarea
                          label="DESCRIPTION"
                          value={
                            slide.description
                          }
                          onChange={(value) =>
                            updateHero(
                              index,
                              "description",
                              value
                            )
                          }
                        />

                        <div className="grid gap-5 sm:grid-cols-2">

                          <EditorInput
                            label="BUTTON TEXT"
                            value={
                              slide.buttonText
                            }
                            onChange={(value) =>
                              updateHero(
                                index,
                                "buttonText",
                                value
                              )
                            }
                          />

                          <EditorInput
                            label="BUTTON LINK"
                            value={
                              slide.buttonLink
                            }
                            onChange={(value) =>
                              updateHero(
                                index,
                                "buttonLink",
                                value
                              )
                            }
                          />

                        </div>

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>

          </section>

          {/* =====================================================
              CATEGORIES
          ===================================================== */}

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#201b1b]/10 bg-white">

            <div className="border-b border-[#201b1b]/10 px-6 py-5">

              <p className="text-[8px] tracking-[0.3em] text-[#a77d7f]">
                HOMEPAGE
              </p>

              <h2 className="mt-1 font-serif text-2xl">
                Categories
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-[#766969]">
                Manage the category cards displayed
                on your homepage.
              </p>

            </div>

            <div className="space-y-8 p-6">

              {categories.map(
                (category, index) => (

                  <div
                    key={`${category.image}-${index}`}
                    className="border border-[#201b1b]/10 bg-[#fcfaf7]"
                  >

                    <div className="flex items-center justify-between border-b border-[#201b1b]/10 px-5 py-4">

                      <div>

                        <p className="text-[7px] tracking-[0.3em] text-[#a77d7f]">
                          CATEGORY {index + 1}
                        </p>

                        <p className="mt-1 text-[10px] tracking-[0.08em]">
                          Homepage category
                        </p>

                      </div>

                      {categories.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            deleteCategory(
                              index
                            )
                          }
                          className="text-[8px] tracking-[0.15em] text-[#a77d7f] transition hover:text-[#211c1c]"
                        >
                          DELETE
                        </button>
                      )}

                    </div>

                    <div className="grid gap-7 p-5 lg:grid-cols-[420px_1fr]">

                      <div>

                        <div className="relative aspect-[4/3] overflow-hidden bg-[#eadbd6]">

                          <img
                            src={category.image}
                            alt={category.name}
                            className="h-full w-full object-cover transition-transform duration-300"
                            style={{
                              objectPosition: `${
                                category.positionX ?? 50
                              }% ${
                                category.positionY ?? 50
                              }%`,
                              transform: `scale(${
                                category.zoom ?? 1
                              })`,
                            }}
                          />

                          {uploading ===
                            index + 1000 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[9px] tracking-[0.2em] text-white">
                              UPLOADING...
                            </div>
                          )}

                        </div>

                        <label className="mt-4 flex cursor-pointer items-center justify-center border border-[#201b1b] bg-white px-5 py-3 text-[8px] tracking-[0.2em] transition hover:bg-[#211c1c] hover:text-white">

                          {uploading ===
                          index + 1000
                            ? "UPLOADING..."
                            : "CHANGE IMAGE"}

                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            disabled={
                              uploading !== null
                            }
                            onChange={(event) => {
                              const file =
                                event.target.files?.[0];

                              if (file) {
                                uploadCategoryImage(
                                  index,
                                  file
                                );
                              }

                              event.target.value =
                                "";
                            }}
                          />

                        </label>

                        <p className="mt-2 text-[8px] leading-5 text-[#897979]">
                          JPG, PNG, WEBP or AVIF.
                          Maximum 10MB.
                        </p>

                        <ImageControls
                          image={category.image}
                          aspectRatio="4/3"
                          positionX={
                            category.positionX
                          }
                          positionY={
                            category.positionY
                          }
                          zoom={
                            category.zoom
                          }
                          onPositionXChange={(
                            value
                          ) =>
                            updateCategory(
                              index,
                              "positionX",
                              value
                            )
                          }
                          onPositionYChange={(
                            value
                          ) =>
                            updateCategory(
                              index,
                              "positionY",
                              value
                            )
                          }
                          onZoomChange={(value) =>
                            updateCategory(
                              index,
                              "zoom",
                              value
                            )
                          }
                        />

                      </div>

                      <div className="space-y-5">

                        <EditorInput
                          label="NAME"
                          value={
                            category.name
                          }
                          onChange={(value) =>
                            updateCategory(
                              index,
                              "name",
                              value
                            )
                          }
                        />

                        <EditorTextarea
                          label="DESCRIPTION"
                          value={
                            category.description ??
                            ""
                          }
                          onChange={(value) =>
                            updateCategory(
                              index,
                              "description",
                              value
                            )
                          }
                        />

                        <EditorInput
                          label="LINK"
                          value={
                            category.link
                          }
                          onChange={(value) =>
                            updateCategory(
                              index,
                              "link",
                              value
                            )
                          }
                        />

                      </div>

                    </div>

                  </div>
                )
              )}

              <button
                type="button"
                onClick={addCategory}
                className="w-full border border-dashed border-[#201b1b]/25 bg-[#fcfaf7] px-5 py-5 text-[8px] tracking-[0.2em] transition hover:border-[#201b1b] hover:bg-white"
              >
                + ADD CATEGORY
              </button>

            </div>

          </section>

          {/* =====================================================
              EDITORIAL
          ===================================================== */}

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#201b1b]/10 bg-white">

            <div className="border-b border-[#201b1b]/10 px-6 py-5">

              <p className="text-[8px] tracking-[0.3em] text-[#a77d7f]">
                HOMEPAGE
              </p>

              <h2 className="mt-1 font-serif text-2xl">
                Editorial
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-6 text-[#766969]">
                Manage the editorial sections displayed
                on your homepage.
              </p>

            </div>

            <div className="space-y-8 p-6">

              {homepage.editorial.map(
                (editorial, index) => (

                  <div
                    key={`${editorial.image ?? "editorial"}-${index}`}
                    className="border border-[#201b1b]/10 bg-[#fcfaf7]"
                  >

                    {/* EDITORIAL HEADER */}

                    <div className="flex items-center justify-between border-b border-[#201b1b]/10 px-5 py-4">

                      <div>

                        <p className="text-[7px] tracking-[0.3em] text-[#a77d7f]">
                          EDITORIAL {index + 1}
                        </p>

                        <p className="mt-1 text-[10px] tracking-[0.08em]">
                          Homepage editorial
                        </p>

                      </div>

                      {homepage.editorial.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            deleteEditorial(
                              index
                            )
                          }
                          className="text-[8px] tracking-[0.15em] text-[#a77d7f] transition hover:text-[#211c1c]"
                        >
                          DELETE
                        </button>
                      )}

                    </div>

                    <div className="grid gap-7 p-5 lg:grid-cols-[420px_1fr]">

                      {/* IMAGE */}

                      <div>

                        <div className="relative aspect-[4/3] overflow-hidden bg-[#eadbd6]">

                          <img
                            src={
                              editorial.image ??
                              "/image/image_4.png"
                            }
                            alt={
                              editorial.title ??
                              "Editorial"
                            }
                            className="h-full w-full object-cover transition-transform duration-300"
                            style={{
                              objectPosition: `${
                                editorial.positionX ??
                                50
                              }% ${
                                editorial.positionY ??
                                50
                              }%`,
                              transform: `scale(${
                                editorial.zoom ??
                                1
                              })`,
                            }}
                          />

                          {uploading ===
                            index + 2000 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[9px] tracking-[0.2em] text-white">
                              UPLOADING...
                            </div>
                          )}

                        </div>

                        <label className="mt-4 flex cursor-pointer items-center justify-center border border-[#201b1b] bg-white px-5 py-3 text-[8px] tracking-[0.2em] transition hover:bg-[#211c1c] hover:text-white">

                          {uploading ===
                          index + 2000
                            ? "UPLOADING..."
                            : "CHANGE IMAGE"}

                          <input
                            type="file"
                            accept="image/jpeg,image/png,image/webp,image/avif"
                            className="hidden"
                            disabled={
                              uploading !== null
                            }
                            onChange={(event) => {
                              const file =
                                event.target.files?.[0];

                              if (file) {
                                uploadEditorialImage(
                                  index,
                                  file
                                );
                              }

                              event.target.value =
                                "";
                            }}
                          />

                        </label>

                        <p className="mt-2 text-[8px] leading-5 text-[#897979]">
                          JPG, PNG, WEBP or AVIF.
                          Maximum 10MB.
                        </p>

                        <ImageControls
                          image={
                            editorial.image ??
                            "/image/image_4.png"
                          }
                          aspectRatio="4/3"
                          positionX={
                            editorial.positionX
                          }
                          positionY={
                            editorial.positionY
                          }
                          zoom={
                            editorial.zoom
                          }
                          onPositionXChange={(
                            value
                          ) =>
                            updateEditorial(
                              index,
                              "positionX",
                              value
                            )
                          }
                          onPositionYChange={(
                            value
                          ) =>
                            updateEditorial(
                              index,
                              "positionY",
                              value
                            )
                          }
                          onZoomChange={(value) =>
                            updateEditorial(
                              index,
                              "zoom",
                              value
                            )
                          }
                        />

                      </div>

                      {/* TEXT */}

                      <div className="space-y-5">

                        <label className="flex items-center gap-3 text-[9px] tracking-[0.08em]">

                          <input
                            type="checkbox"
                            checked={
                              editorial.enabled ??
                              true
                            }
                            onChange={(event) =>
                              updateEditorial(
                                index,
                                "enabled",
                                event.target.checked
                              )
                            }
                            className="h-4 w-4"
                          />

                          SHOW EDITORIAL

                        </label>

                        <EditorInput
                          label="LABEL"
                          value={
                            editorial.label ??
                            ""
                          }
                          onChange={(value) =>
                            updateEditorial(
                              index,
                              "label",
                              value
                            )
                          }
                        />

                        <EditorInput
                          label="TITLE"
                          value={
                            editorial.title ??
                            ""
                          }
                          onChange={(value) =>
                            updateEditorial(
                              index,
                              "title",
                              value
                            )
                          }
                        />

                        <EditorInput
                          label="ITALIC TITLE"
                          value={
                            editorial.italicTitle ??
                            ""
                          }
                          onChange={(value) =>
                            updateEditorial(
                              index,
                              "italicTitle",
                              value
                            )
                          }
                        />

                        <EditorTextarea
                          label="DESCRIPTION"
                          value={
                            editorial.description ??
                            ""
                          }
                          onChange={(value) =>
                            updateEditorial(
                              index,
                              "description",
                              value
                            )
                          }
                        />

                        <div className="grid gap-5 sm:grid-cols-2">

                          <EditorInput
                            label="BUTTON TEXT"
                            value={
                              editorial.buttonText ??
                              ""
                            }
                            onChange={(value) =>
                              updateEditorial(
                                index,
                                "buttonText",
                                value
                              )
                            }
                          />

                          <EditorInput
                            label="BUTTON LINK"
                            value={
                              editorial.buttonLink ??
                              ""
                            }
                            onChange={(value) =>
                              updateEditorial(
                                index,
                                "buttonLink",
                                value
                              )
                            }
                          />

                        </div>

                      </div>

                    </div>

                  </div>
                )
              )}

              {/* ADD EDITORIAL */}

              <button
                type="button"
                onClick={addEditorial}
                className="w-full border border-dashed border-[#201b1b]/25 bg-[#fcfaf7] px-5 py-5 text-[8px] tracking-[0.2em] transition hover:border-[#201b1b] hover:bg-white"
              >
                + ADD EDITORIAL
              </button>

            </div>

          </section>
          {/* =====================================================
              EXCLUSIVE COLLECTION
          ===================================================== */}

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#201b1b]/10 bg-white">

            <div className="border-b border-[#201b1b]/10 px-6 py-5">
              <p className="text-[8px] tracking-[0.3em] text-[#a77d7f]">
                COLLECTION
              </p>
              <h2 className="mt-1 font-serif text-2xl">
                Exclusive Collection
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-6 text-[#766969]">
                Choose which products appear on the Exclusive Collection page.
              </p>
            </div>

            <div className="space-y-6 p-6">
              <label className="flex items-center gap-3 text-[9px] tracking-[0.08em]">
                <input
                  type="checkbox"
                  checked={homepage.exclusive.enabled ?? true}
                  onChange={(event) =>
                    setHomepage({
                      ...homepage,
                      exclusive: {
                        ...homepage.exclusive,
                        enabled: event.target.checked,
                      },
                    })
                  }
                  className="h-4 w-4"
                />
                SHOW EXCLUSIVE COLLECTION
              </label>

              <div className="grid gap-5 sm:grid-cols-2">
                <EditorInput
                  label="LABEL"
                  value={homepage.exclusive.label ?? ""}
                  onChange={(value) =>
                    setHomepage({
                      ...homepage,
                      exclusive: { ...homepage.exclusive, label: value },
                    })
                  }
                />
                <EditorInput
                  label="TITLE"
                  value={homepage.exclusive.title ?? ""}
                  onChange={(value) =>
                    setHomepage({
                      ...homepage,
                      exclusive: { ...homepage.exclusive, title: value },
                    })
                  }
                />
              </div>

              <EditorTextarea
                label="DESCRIPTION"
                value={homepage.exclusive.description ?? ""}
                onChange={(value) =>
                  setHomepage({
                    ...homepage,
                    exclusive: { ...homepage.exclusive, description: value },
                  })
                }
              />

              <div>
                <p className="mb-3 text-[8px] tracking-[0.15em] text-[#766969]">
                  SELECT PRODUCTS
                </p>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {products.map((product) => {
                    const selected =
                      homepage.exclusive.product_ids?.includes(product.id) ?? false;

                    return (
                      <label
                        key={product.id}
                        className={`flex cursor-pointer items-center gap-4 border p-3 transition ${
                          selected
                            ? "border-[#a77d7f] bg-[#faf5f2]"
                            : "border-[#201b1b]/10 bg-white hover:border-[#201b1b]/30"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleExclusiveProduct(product.id)}
                          className="h-4 w-4 shrink-0"
                        />

                        {product.image_1 ? (
                          <img
                            src={product.image_1}
                            alt={product.name}
                            className="h-16 w-16 shrink-0 object-cover"
                          />
                        ) : (
                          <div className="h-16 w-16 shrink-0 bg-[#eadbd6]" />
                        )}

                        <div className="min-w-0">
                          <p className="truncate text-[9px] tracking-[0.08em]">
                            {product.name}
                          </p>
                          <p className="mt-1 text-[9px] text-[#897979]">
                            ${Number(product.price).toFixed(2)}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>

                <p className="mt-4 text-[8px] leading-5 text-[#897979]">
                  {homepage.exclusive.product_ids?.length ?? 0} product(s) selected.
                </p>
              </div>
            </div>
          </section>

          {/* =====================================================
              ABOUT US
          ===================================================== */}

          <section className="mt-8 overflow-hidden rounded-2xl border border-[#201b1b]/10 bg-white">
            <div className="border-b border-[#201b1b]/10 px-6 py-5">
              <p className="text-[8px] tracking-[0.3em] text-[#a77d7f]">
                BRAND
              </p>
              <h2 className="mt-1 font-serif text-2xl">
                About Us
              </h2>
              <p className="mt-2 max-w-xl text-xs leading-6 text-[#766969]">
                Edit the content displayed on the VIREL About Us page.
              </p>
            </div>

            <div className="grid gap-7 p-6 lg:grid-cols-[420px_1fr]">
              <div>
                <div className="relative min-h-[520px] lg:min-h-[680px] overflow-hidden bg-[#eadbd6]">
                  <img
                    src={homepage.about.image ?? "/image/image_4.png"}
                    alt="About VIREL"
                    className="h-full w-full object-cover"
                    style={{
                      objectPosition: `${homepage.about.positionX ?? 50}% ${homepage.about.positionY ?? 50}%`,
                      transform: `scale(${homepage.about.zoom ?? 1})`,
                    }}
                  />

                  {uploading === 3000 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-[9px] tracking-[0.2em] text-white">
                      UPLOADING...
                    </div>
                  )}
                </div>

                <label className="mt-4 flex cursor-pointer items-center justify-center border border-[#201b1b] bg-white px-5 py-3 text-[8px] tracking-[0.2em] transition hover:bg-[#211c1c] hover:text-white">
                  {uploading === 3000 ? "UPLOADING..." : "CHANGE IMAGE"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/avif"
                    className="hidden"
                    disabled={uploading !== null}
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) uploadAboutImage(file);
                      event.target.value = "";
                    }}
                  />
                </label>

                <p className="mt-2 text-[8px] leading-5 text-[#897979]">
                  JPG, PNG, WEBP or AVIF. Maximum 10MB.
                </p>

                <ImageControls
                  image={
                    homepage.about.image ??
                    "/image/image_4.png"
                  }
                  aspectRatio="4/3"
                  positionX={homepage.about.positionX}
                  positionY={homepage.about.positionY}
                  zoom={homepage.about.zoom}
                  onPositionXChange={(value) => updateAbout("positionX", value)}
                  onPositionYChange={(value) => updateAbout("positionY", value)}
                  onZoomChange={(value) => updateAbout("zoom", value)}
                />
              </div>

              <div className="space-y-5">
                <label className="flex items-center gap-3 text-[9px] tracking-[0.08em]">
                  <input
                    type="checkbox"
                    checked={homepage.about.enabled ?? true}
                    onChange={(event) => updateAbout("enabled", event.target.checked)}
                    className="h-4 w-4"
                  />
                  SHOW ABOUT US
                </label>

                <EditorInput
                  label="LABEL"
                  value={homepage.about.label ?? ""}
                  onChange={(value) => updateAbout("label", value)}
                />

                <EditorInput
                  label="TITLE"
                  value={homepage.about.title ?? ""}
                  onChange={(value) => updateAbout("title", value)}
                />

                <EditorInput
                  label="ITALIC TITLE"
                  value={homepage.about.italicTitle ?? ""}
                  onChange={(value) => updateAbout("italicTitle", value)}
                />

                <EditorTextarea
                  label="DESCRIPTION"
                  value={homepage.about.description ?? ""}
                  onChange={(value) => updateAbout("description", value)}
                />

                <div className="grid gap-5 sm:grid-cols-2">
                  <EditorInput
                    label="BUTTON TEXT"
                    value={homepage.about.buttonText ?? ""}
                    onChange={(value) => updateAbout("buttonText", value)}
                  />
                  <EditorInput
                    label="BUTTON LINK"
                    value={homepage.about.buttonLink ?? ""}
                    onChange={(value) => updateAbout("buttonLink", value)}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* =====================================================
    FEATURED PRODUCTS
===================================================== */}

<div className="mt-8">
  <FeaturedEditor
    value={homepage.featured}
    products={products}
    onChange={(value) =>
      setHomepage({
        ...homepage,
        featured: value,
      })
    }
  />
  {/* =====================================================
    BRAND STATEMENT
===================================================== */}

<div className="mt-8">
  <BrandStatementEditor
    value={homepage.brand_statement}
    onChange={(value) =>
      setHomepage({
        ...homepage,
        brand_statement: value,
      })
    }
  />
</div>
{/* =====================================================
    FOOTER
===================================================== */}

<div className="mt-8">
  <FooterEditor
    value={homepage.footer}
    onChange={(value) =>
      setHomepage({
        ...homepage,
        footer: value,
      })
    }
  />
</div>
{/* =====================================================
    SERVICE STRIP
===================================================== */}

<div className="mt-8">
  <ServiceStripEditor
    value={homepage.service_strip}
    onChange={(value) =>
      setHomepage({
        ...homepage,
        service_strip: value,
      })
    }
  />
</div>
</div>

        </div>

      </main>
    );
  }

  // =====================================================
  // IMAGE CONTROLS
  // =====================================================

  function ImageControls({
    image,
    aspectRatio,
    positionX,
    positionY,
    zoom,
    onPositionXChange,
    onPositionYChange,
    onZoomChange,
  }: {
    image: string;
    aspectRatio: "16/7" | "4/3" | "about";
    positionX?: number;
    positionY?: number;
    zoom?: number;
    onPositionXChange: (value: number) => void;
    onPositionYChange: (value: number) => void;
    onZoomChange: (value: number) => void;
  }) {
    const previewRef = useRef<HTMLDivElement | null>(null);
    const draggingRef = useRef(false);
    const lastPointRef = useRef({ x: 0, y: 0 });

    function clamp(value: number, min: number, max: number) {
      return Math.min(max, Math.max(min, value));
    }

    function startDrag(event: React.PointerEvent<HTMLDivElement>) {
      event.currentTarget.setPointerCapture(event.pointerId);
      draggingRef.current = true;
      lastPointRef.current = { x: event.clientX, y: event.clientY };
    }

    function moveDrag(event: React.PointerEvent<HTMLDivElement>) {
      if (!draggingRef.current || !previewRef.current) return;

      const rect = previewRef.current.getBoundingClientRect();
      const deltaX = event.clientX - lastPointRef.current.x;
      const deltaY = event.clientY - lastPointRef.current.y;

      lastPointRef.current = { x: event.clientX, y: event.clientY };

      onPositionXChange(
        clamp((positionX ?? 50) + (deltaX / rect.width) * 100, 0, 100)
      );

      onPositionYChange(
        clamp((positionY ?? 50) + (deltaY / rect.height) * 100, 0, 100)
      );
    }

    function endDrag(event: React.PointerEvent<HTMLDivElement>) {
      draggingRef.current = false;
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    }

    function centerImage() {
      onPositionXChange(50);
      onPositionYChange(50);
    }

    function resetImage() {
      onPositionXChange(50);
      onPositionYChange(50);
      onZoomChange(1);
    }

    return (
      <div className="mt-6 space-y-5 border-t border-[#201b1b]/10 pt-5">

        <div>
          <div className="mb-3 flex items-end justify-between">
            <div>
              <p className="text-[8px] tracking-[0.15em] text-[#766969]">
                LIVE PREVIEW
              </p>
              <p className="mt-1 text-[8px] leading-5 text-[#897979]">
                Drag the image to position it.
              </p>
            </div>

            <span className="text-[8px] tracking-[0.08em] text-[#897979]">
              {Math.round(positionX ?? 50)}% × {Math.round(positionY ?? 50)}%
            </span>
          </div>

          <div
            ref={previewRef}
           className={`group relative w-full overflow-hidden bg-[#eadbd6] select-none ${
  aspectRatio === "16/7"
    ? "aspect-[16/7]"
    : aspectRatio === "about"
      ? "min-h-[520px] lg:min-h-[680px]"
      : "aspect-[4/3]"
}`}
            style={{ touchAction: "none", cursor: "grab" }}
            onPointerDown={startDrag}
            onPointerMove={moveDrag}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            <img
              src={image}
              alt="Image preview"
              draggable={false}
              className="pointer-events-none h-full w-full object-cover"
              style={{
                objectPosition: `${positionX ?? 50}% ${positionY ?? 50}%`,
                transform: `scale(${zoom ?? 1})`,
              }}
            />

            <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-white/60" />
              <div className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-white/60" />
            </div>

            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center pb-3 opacity-0 transition group-hover:opacity-100">
              <span className="bg-black/65 px-3 py-1.5 text-[7px] tracking-[0.15em] text-white backdrop-blur-sm">
                DRAG TO POSITION
              </span>
            </div>
          </div>

          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={centerImage}
              className="flex-1 border border-[#201b1b]/15 bg-white px-4 py-2.5 text-[7px] tracking-[0.18em] transition hover:border-[#201b1b] hover:bg-[#211c1c] hover:text-white"
            >
              CENTER
            </button>

            <button
              type="button"
              onClick={resetImage}
              className="flex-1 border border-[#201b1b]/15 bg-white px-4 py-2.5 text-[7px] tracking-[0.18em] transition hover:border-[#201b1b] hover:bg-[#211c1c] hover:text-white"
            >
              RESET
            </button>
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[8px] tracking-[0.15em] text-[#766969]">
              HORIZONTAL POSITION
            </label>
            <span className="text-[9px] text-[#897979]">
              {Math.round(positionX ?? 50)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={positionX ?? 50}
            onChange={(event) => onPositionXChange(Number(event.target.value))}
            className="w-full accent-[#211c1c]"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[8px] tracking-[0.15em] text-[#766969]">
              VERTICAL POSITION
            </label>
            <span className="text-[9px] text-[#897979]">
              {Math.round(positionY ?? 50)}%
            </span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={positionY ?? 50}
            onChange={(event) => onPositionYChange(Number(event.target.value))}
            className="w-full accent-[#211c1c]"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[8px] tracking-[0.15em] text-[#766969]">
              ZOOM
            </label>
            <span className="text-[9px] text-[#897979]">
              {(zoom ?? 1).toFixed(2)}×
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="2"
            step="0.01"
            value={zoom ?? 1}
            onChange={(event) => onZoomChange(Number(event.target.value))}
            className="w-full accent-[#211c1c]"
          />
        </div>

      </div>
    );
  }

  // =====================================================
  // INPUT
  // =====================================================

  function EditorInput({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (
      value: string
    ) => void;
  }) {
    return (
      <div>

        <label className="mb-2 block text-[8px] tracking-[0.15em] text-[#766969]">
          {label}
        </label>

        <input
          type="text"
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          className="w-full border border-[#201b1b]/15 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a77d7f]"
        />

      </div>
    );
  }

  // =====================================================
  // TEXTAREA
  // =====================================================

  function EditorTextarea({
    label,
    value,
    onChange,
  }: {
    label: string;
    value: string;
    onChange: (
      value: string
    ) => void;
  }) {
    return (
      <div>

        <label className="mb-2 block text-[8px] tracking-[0.15em] text-[#766969]">
          {label}
        </label>

        <textarea
          value={value}
          onChange={(event) =>
            onChange(
              event.target.value
            )
          }
          rows={4}
          className="w-full resize-none border border-[#201b1b]/15 bg-white px-4 py-3 text-sm leading-6 outline-none transition focus:border-[#a77d7f]"
        />

      </div>
    );
  }