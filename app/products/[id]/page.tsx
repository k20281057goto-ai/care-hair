import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductReviewForm } from "@/features/reviews/product-review-form";
import { ProductActions } from "@/features/products/product-actions";
import { products } from "@/data/products";
import { getProductCareContent } from "@/data/product-care-content";
import { getProductInsight } from "@/data/product-insights";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardEyebrow } from "@/components/ui/card";
import { AffiliateProductImage } from "@/components/affiliate-product-image";

type ProductDetailPageProps = {
  params: {
    id: string;
  };
};

export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

export function generateMetadata({ params }: ProductDetailPageProps): Metadata {
  const product = products.find((item) => item.id === params.id);

  if (!product) {
    return { title: "商品詳細" };
  }

  return {
    title: product.name,
    description: product.feature,
    openGraph: {
      title: `${product.name} | Care Hair`,
      description: product.feature
    }
  };
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const product = products.find((item) => item.id === params.id);

  if (!product) notFound();

  const content = getProductCareContent(product);
  const insight = getProductInsight(product);

  return (
    <main className="pt-[var(--header-height)]">
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-site px-4">
          <div className="relative mx-auto max-w-4xl overflow-hidden rounded-brand border border-line bg-[linear-gradient(135deg,#eef6f2_0%,#ffffff_100%)] p-7 shadow-brand sm:p-10 md:p-14">
            <div
              data-testid="product-detail-hero"
              className={`relative z-10 grid items-center gap-8 ${
                product.affiliateUrl && product.affiliateImageUrl
                  ? "md:grid-cols-[minmax(0,1fr)_280px]"
                  : ""
              }`}
            >
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-green">{product.type === "shampoo" ? "Shampoo" : "Treatment"}</span>
                <p className="mt-5 text-sm font-semibold text-muted">{insight.brand}</p>
                <h1 className="mt-3 max-w-3xl text-balance text-4xl font-medium leading-tight md:text-6xl">{product.name}</h1>
                <p className="mt-6 text-xl font-semibold text-green">{product.price}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {product.tags.map((tag) => <span key={tag} className="rounded-full border border-green/15 bg-white px-3 py-1 text-xs font-semibold text-green">{tag}</span>)}
                </div>
                {product.amazonAffiliateUrl || product.affiliateUrl ? (
                  <div className="mt-7 grid max-w-sm gap-3">
                    {product.amazonAffiliateUrl ? (
                      <a
                        href={product.amazonAffiliateUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer sponsored"
                        className="inline-flex min-h-14 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[#ff9900] bg-[#ff9900] px-8 py-3 text-sm font-medium text-[#111] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e88b00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                      >
                        Amazonで商品を見る
                      </a>
                    ) : null}
                    {product.affiliateUrl ? (
                      <a
                        href={product.affiliateUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer sponsored"
                        className={buttonVariants({ size: "lg" })}
                      >
                        楽天で商品を見る
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {product.affiliateUrl && product.affiliateImageUrl ? (
                <AffiliateProductImage
                  product={product}
                  priority
                  sizes="(max-width: 767px) calc(100vw - 64px), 280px"
                  className="h-64 rounded-brand border border-line shadow-brand"
                  imageClassName="p-5"
                />
              ) : null}
            </div>
            <span aria-hidden="true" className="absolute -bottom-20 -right-16 h-56 w-56 rounded-full border border-green/10 bg-white/50" />
          </div>

          <article className="mx-auto mt-10 max-w-4xl">
            <Card as="section" className="mt-10 md:p-8">
              <h2 className="text-2xl font-medium">こんな人におすすめ</h2>
              <ul className="mt-5 grid gap-3 text-muted sm:grid-cols-2">
                {content.recommendedFor.map((item) => (
                  <li key={item} className="flex gap-3 leading-7">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </Card>

            <Card as="section" className="mt-8 bg-soft md:p-8">
              <CardEyebrow>Care Hair reason</CardEyebrow>
              <h2 className="mt-3 text-2xl font-medium">Care Hairがおすすめする理由</h2>
              <p className="mt-4 leading-8 text-muted">{content.recommendReason}</p>
            </Card>

            <Card as="section" className="mt-8 md:p-8">
              <h2 className="text-2xl font-medium">向いている人</h2>
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                <InfoBlock title="向いている髪質" items={insight.hairTypes} />
                <InfoBlock title="向いている悩み" items={insight.concerns} />
              </div>
            </Card>

            <Card as="section" className="mt-8 md:p-8">
              <h2 className="text-2xl font-medium">商品の特徴</h2>
              <div className="mt-6 grid gap-px overflow-hidden rounded-brand bg-line">
                {[
                  ["香り", content.features.scent],
                  ["洗い上がり", insight.washFeel],
                  ["仕上がり", content.features.finish],
                  ["泡立ち", content.features.foam]
                ].map(([label, value]) => (
                  <div key={label} className="grid gap-2 bg-white p-5 md:grid-cols-[140px_1fr]">
                    <b className="text-green">{label}</b>
                    <span className="leading-7 text-muted">{value}</span>
                  </div>
                ))}
              </div>
            </Card>

            {product.affiliateUrl && product.affiliateImageUrl ? (
              <Card as="section" className="mt-8 md:p-8">
                <div className="grid items-center gap-7 md:grid-cols-[240px_minmax(0,1fr)]">
                  <AffiliateProductImage
                    product={product}
                    sizes="(max-width: 767px) calc(100vw - 64px), 240px"
                    className="h-60 rounded-brand border border-line"
                    imageClassName="p-5"
                  />
                  <div>
                    {product.amazonAffiliateUrl ? (
                      <>
                        <CardEyebrow>Amazon Associate</CardEyebrow>
                        <h2 className="mt-3 text-2xl font-medium">Amazonの商品ページで見る</h2>
                        <a
                          href={product.amazonAffiliateUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer sponsored"
                          className="mt-6 inline-flex min-h-14 items-center justify-center gap-2 rounded-[var(--radius-button)] border border-[#ff9900] bg-[#ff9900] px-8 py-3 text-sm font-medium text-[#111] transition duration-300 hover:-translate-y-0.5 hover:bg-[#e88b00] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green"
                        >
                          Amazonで商品を見る
                        </a>
                        <div className="my-6 border-t border-line" />
                      </>
                    ) : null}
                    <CardEyebrow>Rakuten Affiliate</CardEyebrow>
                    <h2 className="mt-3 text-2xl font-medium">楽天の商品ページで見る</h2>
                    <p className="mt-4 leading-7 text-muted">
                      商品画像と購入先リンクは、楽天アフィリエイトから提供されたものを使用しています。
                    </p>
                    <a
                      href={product.affiliateUrl}
                      target="_blank"
                      rel="nofollow noopener noreferrer sponsored"
                      className={`${buttonVariants({ size: "lg" })} mt-6`}
                    >
                      楽天で商品を見る
                    </a>
                    <p className="mt-3 text-xs leading-6 text-muted">PR：リンク先で購入された場合、Care Hairが紹介料を受け取ることがあります。</p>
                  </div>
                </div>
              </Card>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/search" className={buttonVariants({ variant: "outline" })}>
                条件検索へ
              </Link>
            </div>

            <ProductActions productId={product.id} />

            <ProductReviewForm defaultProductId={product.id} />
          </article>
        </div>
      </section>
    </main>
  );
}

function InfoBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <p className="font-semibold text-green">{title}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <span key={item} className="rounded-full bg-soft px-3 py-1 text-sm text-muted">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
