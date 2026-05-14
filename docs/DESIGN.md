---
name: Yelkenli Yaşam Tycoon
description: Mobile-first yelkenli tycoon oyunu için kaptan köprüsü estetiğine dayalı tasarım sistemi.
colors:
  ocean-deep: "#06182c"
  ocean-mid: "#0c2a47"
  ocean-rim: "#0f3a5c"
  cyan-glow: "#5eeaf8"
  cyan-soft: "#3ec7e0"
  cyan-deep: "#1d8aa8"
  gold-bright: "#ffd982"
  gold-warm: "#e8a651"
  success-green: "#4be8a3"
  warning-amber: "#ef8a4a"
  danger-red: "#ff6b6b"
  text-primary: "#f4f8ff"
  text-secondary: "#9bbecf"
  text-muted: "#5e7a8e"
typography:
  display:
    fontFamily: "'Sora', system-ui, -apple-system, sans-serif"
    fontWeight: 800
    lineHeight: 1.15
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.55
  label:
    fontFamily: "'Sora', system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 700
    letterSpacing: "0.12em"
rounded:
  sm: "10px"
  md: "14px"
  lg: "18px"
  xl: "20px"
  pill: "999px"
spacing:
  1: "4px"
  2: "8px"
  3: "12px"
  4: "16px"
  5: "20px"
  6: "24px"
  8: "32px"
components:
  button-primary:
    backgroundColor: "{colors.cyan-soft}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "16px 24px"
    height: "56px"
  button-primary-active:
    backgroundColor: "{colors.cyan-deep}"
    textColor: "#ffffff"
    rounded: "{rounded.xl}"
    padding: "16px 24px"
  button-secondary:
    backgroundColor: "rgba(255,255,255,0.05)"
    textColor: "{colors.text-secondary}"
    rounded: "{rounded.xl}"
    padding: "16px 24px"
    height: "56px"
  button-cta-gold:
    backgroundColor: "{colors.gold-warm}"
    textColor: "#1a0f04"
    rounded: "{rounded.lg}"
    padding: "14px 20px"
    height: "60px"
  tab-active:
    backgroundColor: "rgba(94,234,248,0.10)"
    textColor: "{colors.cyan-glow}"
    rounded: "{rounded.sm}"
    padding: "4px 2px"
---

# Design System: Yelkenli Yaşam Tycoon

## 1. Overview

**Creative North Star: "The Coastal Signal"**

Bu sistem bir kaptan köprüsünün görsel dilidir. Karanlık, fonksiyonel, her gösterge amaçlı yerleştirilmiş. Kullanıcı telefonu açtığında bir araç panelinin önüne geçmiş gibi hissetmeli: lacivert yüzey, aktif göstergeler parlıyor, altın uyarılar bekliyor. Dekorasyon yoktur — her renk, her parıltı bir anlam taşır.

Atmosfer sinematik ama klişesiz. "Premium denizcilik" ifadesi burada yacht kataloğu estetiği değil, sahadaki kaptan ekipmanı anlamına gelir. Sert, güvenilir, koşullar ne olursa olsun okunabilir. Gece açık denizde bir ekrana bakıyorsun; ekran sana bakıyor.

Bu sistem şunları açıkça reddeder: parlak casual mobil oyun arayüzleri, rastgele neon karmaşası, efekt yığılmasıyla bozulan okunabilirlik, standart SaaS panel hissi, görsel polish'in oynanışı gölgelemesi.

**Key Characteristics:**
- Karanlık zemin, amaçlı parıltılar — dekoratif değil sinyal
- Her etkileşim fiziksel geri bildirim verir (taktil, güvenli)
- Altın yalnızca ödül ve uyarı için — başka yerde yasak
- Cyan yalnızca aktif durum ve navigasyon için
- Okunabilirlik her zaman atmosferin önünde

## 2. Colors: The Bridge Palette

Üç fonksiyonel katman. Her renk bir rol üstlenir; rol dışı kullanım yasaktır.

### Primary
- **Ocean Deep** (`#06182c`): Tüm ekranların temel yüzeyi. Kaptan köprüsünün metal zemin rengi. Saf siyah yasak; bu derin su laciverdinden ayrılmaz.
- **Ocean Mid** (`#0c2a47`): Kart ve bileşen arka planları. Zemin üzerinden ayrışan ikinci yüzey katmanı.
- **Ocean Rim** (`#0f3a5c`): Kenarlıklar, kenar vurguları, üçüncü yüzey katmanı.

### Secondary
- **Cyan Glow** (`#5eeaf8`): Aktif durum, navigasyon seçili, kritik sinyal. Sayfada ≤10% yüzeyde kullanılır. Dekoratif kullanım yasak.
- **Cyan Soft** (`#3ec7e0`): Birincil buton arka planı ve hover durumu.
- **Cyan Deep** (`#1d8aa8`): Buton active/pressed durumu, derin vurgu.

### Tertiary
- **Gold Bright** (`#ffd982`): Ödül, başarı, XP kazanımı. Cooldown sayacı, level-up. Sadece ödül bağlamında.
- **Gold Warm** (`#e8a651`): Gold CTA butonu (içerik yayınla), gradient geçişi alt ucu.

### Neutral
- **Text Primary** (`#f4f8ff`): Başlıklar, kritik değerler. Saf beyaz değil — hafif mavi-soğuk tonu vardır.
- **Text Secondary** (`#9bbecf`): Yardımcı metin, açıklamalar.
- **Text Muted** (`#5e7a8e`): Etiketler, devre dışı durumlar, ikincil metadata.
- **Success Green** (`#4be8a3`): Başarı durumları, tamamlanan hedefler.
- **Warning Amber** (`#ef8a4a`): Kritik kaynak uyarıları.
- **Danger Red** (`#ff6b6b`): Kritik hata, tehlike durumu.

### Named Rules
**The Signal Rule.** Cyan yalnızca "burada bir şey aktif veya seçili" demek için var. İkon rengi, dekoratif glow, dolgu deseni olarak kullanılamaz. Her cyan kullanımında şu soruyu sor: "Bu bir sinyal mi, yoksa dekorasyon mu?"

**The Gold Reserve Rule.** Altın yalnızca ödül bağlamında görünür: XP kazanımı, level-up, cooldown sayacı, içerik yayınla CTA'sı. Başlık vurgusu, kart sınırı, ikon rengi olarak kullanılamaz.

## 3. Typography

**Display Font:** Sora (system-ui fallback)
**Body Font:** Inter (system-ui fallback)

**Character:** Sora'nın geometrik ağırlığı kaptan köprüsünün analog kadranlarını çağrıştırır — keskin, güvenilir, yüksek basınçta okunabilir. Inter saf fonksiyonellik sağlar: uzun metinlerde gözü yormaz, küçük boyutlarda bilgi yoğunluğunu taşır.

### Hierarchy
- **Display** (800 weight, 18–28px, 1.15 line-height): Ekran başlıkları, kahraman metrikleri, kart ana değerleri. Yalnızca Sora.
- **Headline** (700 weight, 15–17px, 1.3 line-height): Sekme isimleri, bölüm başlıkları, büyük buton metni.
- **Title** (700 weight, 13–14px, 1.4 line-height): Kart başlıkları, liste öğesi ana metni.
- **Body** (400 weight, 13–14px, 1.55 line-height): Açıklamalar, yardımcı metin, event sonuçları. Maks 60ch.
- **Label** (700 weight, 10–11px, 0.12em letter-spacing, UPPERCASE): Eyebrow etiketler, chip içerikleri, stat başlıkları.

### Named Rules
**The Uppercase Discipline Rule.** Label tipi yalnızca üst kısımlarda (eyebrow) ve chip/badge içinde büyük harf kullanır. Buton metni, kart başlığı, body metin büyük harf olamaz — salt büyük harf gürültü yaratır, hiyerarşiyi bozar.

**The Tabular Numbers Rule.** Oyun içi sayısal değerler (TL, takipçi, XP, kaynak değerleri) `font-variant-numeric: tabular-nums` kullanır. Değerlerin yan yana değişmesi layout kayması yaratmaz.

## 4. Elevation

Bu sistem gölge tabanlı derinlik değil, **tonal katmanlama** kullanır. Derinlik renk yoğunluğuyla ifade edilir: zemin `#06182c`, üstündeki yüzey `#0c2a47`, onun üzerindeki `#0f3a5c`. Yükseldikçe hafif açılır, karanlık kalır.

Glow efektleri derinlik değil sinyal işlevi görür: bir kart veya buton "aktif" olduğunda cyan ya da gold glow ile vurgulanır. Bu bir gölge değil, bir durum göstergesidir.

### Shadow Vocabulary
- **Card Ambient** (`0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(94,234,248,0.06) inset`): Standart kart yükselmesi. Ortam karanlığından ayrışma.
- **Glow Small** (`0 0 12px rgba(94,234,248,0.35)`): Aktif durum vurgusu — küçük ölçek.
- **Glow Medium** (`0 0 24px rgba(94,234,248,0.45)`): Önemli aktif bileşen.
- **Glow Hero** (`0 0 64px rgba(94,234,248,0.55)`): Ana karakter veya ekran kahramanı efekti.
- **Button Press** (`0 0 0 1px rgba(94,234,248,0.45) inset, 0 4px 24px rgba(94,234,248,0.25)`): Buton odaklanma ve hover durumu.
- **Gold Glow** (`0 6px 24px rgba(255,217,130,0.30)`): Gold CTA butonu aktif durumu.

### Named Rules
**The Flat-By-Default Rule.** Yüzeyler dinlenme halinde tonal katmanlama ile ayrışır; glow ve derin gölge yalnızca aktif/hover/focus durumlarında görünür. Dekoratif glow yoktur.

## 5. Components

### Buttons

Taktil ve güvenli. Her buton basıldığında fiziksel geri bildirim verir — scale transform ve box-shadow değişimi. Kaptan ekipmanı gibi: güçlü, güvenilir, elinde hissedilen.

- **Shape:** Geniş yuvarlak köşeler (20px radius) — keskin değil, sert değil; tutuşa uygun.
- **Primary:** Cyan gradient arka plan (`#23abdf → #12638f`), beyaz metin, 56px min-height. `0 4px 0 #0d4a6e` alt gölgesi fiziksel derinlik verir. Active: `scale(0.97) translateY(2px)`, alt gölge düşer.
- **Gold CTA:** İçerik yayınla aksiyonuna özel. Gold gradient (`#e8a651 → #ffd982`), koyu metin (`#1a0f04`), 60px min-height. Pulse animasyonu aktif beklemede devam eder. Active: `scale(0.97)`.
- **Secondary / Ghost:** `rgba(255,255,255,0.05)` arka plan, cyan kenarlık `rgba(94,234,248,0.25)`. Active: `scale(0.97)`.
- **Disabled:** `#2a3a4c` arka plan, muted metin, pointer-events none. Animasyon yok.

### Cards / Containers

- **Corner Style:** Büyük yuvarlak köşeler — lg (18px) standart, xl (20px) hero kartlar.
- **Background:** `linear-gradient(180deg, rgba(15,58,92,0.85), rgba(12,42,71,0.65))` — tonal katmanlama.
- **Border:** `1px solid rgba(94,234,248,0.18)` — ince cyan sinyal kenarlığı.
- **Shadow:** Card Ambient standardı.
- **Internal Padding:** 16–22px yatay, 14–20px dikey. 4px grid.
- **Rim Accent:** Kartların üst kenarında `linear-gradient(90deg, transparent, rgba(94,234,248,0.35), transparent)` çizgi — kaptan köprüsü panel estetiği.

### Navigation (Bottom Tab Bar)

- **Arka Plan:** `rgba(4,13,22,0.97)`, `backdrop-filter: blur(24px)`. Sayfa içeriğinden net ayrışma.
- **Kenarlık:** `1px solid rgba(94,234,248,0.10)` üst kenar + `box-shadow: 0 -8px 32px rgba(0,0,0,0.45)`.
- **Pasif Tab:** `#4a6a85` renk, 11px label, 22px ikon.
- **Aktif Tab:** `#5eeaf8` renk, ikon `scale(1.12) translateY(-4px)`, `drop-shadow(0 4px 14px rgba(94,234,248,0.55))`. Üstte pill arka plan `rgba(94,234,248,0.10)`, altta 20px genişlik `3px` yüksek cyan çizgi göstergesi.
- **Active Press:** `scale(0.88)`, 80ms transition.
- **Min touch target:** 46px yükseklik.

### Progress Bars

- **Track:** `rgba(255,255,255,0.08)`, pill radius.
- **Fill:** `linear-gradient(90deg, #23abdf, #2ec4a0)`. Shimmer: pseudo-element `linear-gradient(90deg, transparent, rgba(255,255,255,0.28), transparent)` 2s infinite — premium hissi, değerin "canlı" olduğunu gösterir.
- **Transition:** `width 0.5s cubic-bezier(0.16,1,0.3,1)` — yay bazlı easing, ani değil.

### Stat Chips (Topbar)

- **Arka Plan:** `rgba(94,234,248,0.07)`, `border: 1px solid rgba(94,234,248,0.12)`.
- **Radius:** 10px.
- **Metin:** 13px, 800 weight, tabular-nums.
- **Flash:** `scale(1.22)` + `filter: brightness(1.4) drop-shadow(0 0 6px rgba(75,232,163,0.7))` — ödül geldiğinde canlı, belirgin.

### Sub-tabs

- **Container:** `rgba(0,0,0,0.3)` arka plan, `border: 1px solid rgba(255,255,255,0.06)`, 16px radius, 6px padding.
- **Pasif:** Şeffaf arka plan, `#8aafcc` metin.
- **Aktif:** `rgba(94,234,248,0.14)` arka plan, `#5eeaf8` metin, `inset 0 0 0 1px rgba(94,234,248,0.22)` iç kenarlık.
- **Press:** `scale(0.95)`, 80ms.

## 6. Do's and Don'ts

### Do:
- **Do** her interaktif elemana `touch-action: manipulation` ekle — 300ms tap gecikmesini kaldırır.
- **Do** tüm butonlara `:active` press feedback ver: `scale(0.97)` minimum, 80ms transition ile.
- **Do** cyan'ı yalnızca aktif/seçili/navigasyon durumları için kullan — sinyal değerini koru.
- **Do** altını yalnızca ödül bağlamında kullan: XP, level-up, içerik yayınla CTA, cooldown timer.
- **Do** tüm sayısal değerlerde `font-variant-numeric: tabular-nums` kullan.
- **Do** progress barlarına shimmer ekle — değerin canlı ve aktif olduğunu gösterir.
- **Do** `env(safe-area-inset-bottom)` ile alt navigasyon barını modern telefonlara uyarla.
- **Do** bottom tab bar'da aktif tab için hem pill arka plan hem alt çizgi gösterge kullan — tek gösterge yetersiz.

### Don't:
- **Don't** gradient text kullan (`background-clip: text` ile). Dekoratif, anlamsız. Vurgu için solid renk ve font-weight değişimi kullan.
- **Don't** glassmorphism'i dekoratif amaçla kullan — bulanık kartlar yalnızca modal/overlay arka plan için geçerlidir.
- **Don't** parlak, casual mobil oyun arayüzleri yap — bu oyun bir kaptan ekipmanıdır, oyuncak değil.
- **Don't** rastgele neon karmaşası ekle — her parıltı bir anlam taşımalı.
- **Don't** okunabilirliği bozan efekt yığılması yap — atmosfer okunabilirliğin önüne geçemez.
- **Don't** standart SaaS panel hissi ver — düz beyaz arka plan, grid layout, kart üstüne kart yasak.
- **Don't** görsel polish ile oyun döngüsünü gölgele — her ekleme oynanışı netleştirmeli, karmaşıklaştırmamalı.
- **Don't** saf siyah (`#000`) veya saf beyaz (`#fff`) kullan — tüm nötraller hafif hue tonu taşır.
- **Don't** `border-left` veya `border-right` > 1px renkli vurgu çizgisi kart veya liste öğesine uygula — tam kenarlık veya arka plan tonu kullan.
- **Don't** aynı boyut ve yapıda tekrar eden kart gridi yap — her ekranın bilgi hiyerarşisi farklı şekillendirilmeli.
