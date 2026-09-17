"use client";

import Link from "next/link";
import { CheckCircle2, Scale, X } from "lucide-react";
import { AffiliateProductImage } from "@/components/affiliate-product-image";
import { getProductInsight } from "@/data/product-insights";
import { products } from "@/data/products";
import { getRecommendationReasons } from "@/lib/diagnosis";
import { useCareHairState } from "@/lib/user-state";
import type { ScoreMap } from "@/types/diagnosis";
import type { Product } from "@/types/product";

export function CompareProducts() {
  const { state, hydrated, toggleComparison } = useCareHairState();
  const compared = state.comparisonProductIds.map((id) => products.find((product) => product.id === id)).filter(Boolean) as Product[];
  const latestDiagnosis = state.diagnoses[0];
  const best = latestDiagnosis
    ? [...compared].sort((a, b) => compatibility(b, latestDiagnosis.scores) - compatibility(a, latestDiagnosis.scores))[0]
    : null;

  if (!hydrated) return <div className="mt-10 rounded-2xl border border-line bg-white p-8 text-sm text-muted">比較商品を読み込んでいます。</div>;
  if (!compared.length) {
    return (
      <div className="mt-10 rounded-[20px] border border-line bg-white p-8 text-center shadow-brand sm:p-12">
        <Scale className="mx-auto h-9 w-9 text-green" />
        <h2 className="mt-4 text-2xl font-semibold">比較する商品がまだありません</h2>
        <p className="mt-3 text-sm leading-7 text-muted">商品カードの「比較する」から、気になる商品を最大3つ追加してください。</p>
        <Link href="/search" className="mt-6 inline-flex min-h-12 items-center justify-center rounded-full bg-green px-6 text-sm font-semibold text-white">商品を探す</Link>
      </div>
    );
  }

  return (
    <div className="mt-10">
      {best && latestDiagnosis ? (
        <section className="mb-6 rounded-[20px] border border-green/30 bg-[#eef6f2] p-6 sm:p-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-green"><CheckCircle2 className="h-5 w-5" />あなたにはこれがおすすめ</p>
          <h2 className="mt-3 text-2xl font-semibold">{best.name}</h2>
          <p className="mt-3 text-sm leading-7 text-muted">{getRecommendationReasons(best, latestDiagnosis.scores).join("、")}が、最新の診断回答と強く重なっています。</p>
        </section>
      ) : (
        <p className="mb-6 rounded-2xl border border-line bg-white p-5 text-sm leading-7 text-muted">診断すると、比較中の商品からあなた向けの候補と理由を表示できます。</p>
      )}

      <div className="overflow-x-auto rounded-[20px] border border-line bg-white shadow-brand">
        <table className="w-full min-w-[760px] table-fixed text-left text-sm">
          <thead>
            <tr className="align-top">
              <th className="w-40 bg-soft p-4 text-green">比較項目</th>
              {compared.map((product) => (
                <th key={product.id} className="border-l border-line p-4">
                  <button type="button" onClick={() => toggleComparison(product.id)} className="ml-auto grid h-9 w-9 place-items-center rounded-full border border-line text-muted hover:text-green" aria-label={`${product.name}を比較から外す`}><X className="h-4 w-4" /></button>
                  {product.affiliateImageUrl && product.affiliateUrl ? (
                    <AffiliateProductImage
                      product={product}
                      sizes="160px"
                      className="mx-auto mt-3 h-36 max-w-44 rounded-xl border border-line"
                      imageClassName="p-3"
                    />
                  ) : null}
                  <Link href={`/products/${product.id}`} className="mt-3 block rounded-xl bg-soft p-4 transition hover:bg-secondary">
                    <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-green">{product.type === "shampoo" ? "Shampoo" : "Treatment"}</span>
                    <span className="mt-2 block text-xs font-semibold text-muted">{getProductInsight(product).brand}</span>
                    <span className="mt-2 block text-base font-semibold leading-6">{product.name}</span>
                  </Link>
                  {product.amazonAffiliateUrl ? (
                    <a href={product.amazonAffiliateUrl} target="_blank" rel="nofollow noopener noreferrer sponsored" className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-[#ff9900] bg-[#ff9900] px-3 text-xs font-semibold text-[#111] transition hover:bg-[#e88b00]">
                      Amazonで商品を見る
                    </a>
                  ) : null}
                  {product.affiliateUrl ? (
                    <a href={product.affiliateUrl} target="_blank" rel="nofollow noopener noreferrer sponsored" className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-full border border-green px-3 text-xs font-semibold text-green">
                      楽天で商品を見る
                    </a>
                  ) : null}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {comparisonRows.map((row) => (
              <tr key={row.label} className="border-t border-line">
                <th className="bg-soft p-4 font-semibold text-green">{row.label}</th>
                {compared.map((product) => <td key={product.id} className="border-l border-line p-4 leading-6 text-muted">{row.value(product, latestDiagnosis?.scores)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-4 text-xs leading-6 text-muted">価格・Amazon評価は確認時点の参考情報です。容量が確認できない商品は100mlあたり価格を表示していません。</p>
    </div>
  );
}

const comparisonRows: Array<{ label: string; value: (product: Product, scores?: ScoreMap) => string }> = [
  { label: "ブランド", value: (product) => getProductInsight(product).brand },
  { label: "価格", value: (product) => product.price },
  { label: "容量", value: (product) => product.volumeMl ? `${product.volumeMl}ml` : "未確認" },
  { label: "100mlあたり", value: (product) => { const value = getProductInsight(product).pricePer100Ml; return value ? `約${value}円` : "—"; } },
  { label: "向いている髪質", value: (product) => getProductInsight(product).hairTypes.join("・") },
  { label: "向いている悩み", value: (product) => getProductInsight(product).concerns.join("・") },
  { label: "仕上がり", value: (product) => getProductInsight(product).finishCategory },
  { label: "重さ", value: (product) => getProductInsight(product).weight },
  { label: "香り", value: (product) => product.scent },
  { label: "Amazon評価", value: (product) => { const insight = getProductInsight(product); return insight.rating !== null ? `${insight.rating}（${insight.reviewCount}件）` : "未確認"; } },
  { label: "あなたとの相性", value: (product, scores) => scores ? compatibilityLabel(compatibility(product, scores)) : "診断後に表示" },
  { label: "おすすめ理由", value: (product, scores) => scores ? getRecommendationReasons(product, scores).join("／") : "診断後に表示" }
];

function compatibility(product: Product, scores: ScoreMap) {
  return Object.entries(product.scores).reduce((sum, [key, value]) => sum + (scores[key as keyof ScoreMap] ?? 0) * (value ?? 0), 0);
}

function compatibilityLabel(value: number) {
  if (value >= 160) return "相性が高い";
  if (value >= 80) return "相性あり";
  return "候補として比較";
}
