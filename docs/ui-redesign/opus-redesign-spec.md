# Yelkenli Yaşam Tycoon — UX/UI Redesign Master Spec

**Hazırlayan rolü:** Senior Mobile Game UX/UI Designer + F2P Product Designer + Implementation Planner  
**Hedef:** Mevcut React/TypeScript kod yapısını koruyarak; cinematic, premium, denizcilik temalı bir mobil oyun deneyimine dönüştürmek.  
**Dokunulmazlar:** Save/load, ekonomi değerleri, core loop, mevcut mekanikler, route/sponsor/XP/upgrade/daily goal/achievement/sea mode logic.  
**Kapsam:** Sadece visual/UX/IX katmanı.

---

## 1. DESIGN DNA

Hedef görsellerden çıkarılmış tasarım dilidir. Bu DNA tüm ekranlara taşınacak.

### 1.1 Renk Paleti (CSS Token Önerileri)

| Token | Değer | Kullanım |
|---|---|---|
| `--ocean-deep` | `#06182c` | App background base |
| `--ocean-mid` | `#0c2a47` | Card background base |
| `--ocean-rim` | `#0f3a5c` | Card top-rim highlight |
| `--cyan-glow` | `#5eeaf8` | Border glow, highlight, ring |
| `--cyan-soft` | `#3ec7e0` | Secondary text accent, bar fill |
| `--cyan-deep` | `#1d8aa8` | Pressed states, dim glow |
| `--gold-bright` | `#ffd982` | Title accent, premium markers, stars |
| `--gold-warm` | `#e8a651` | Title shadow, secondary premium |
| `--success-green` | `#4be8a3` | Advantage chip, progress fill (ok) |
| `--warning-amber` | `#ef8a4a` | Disadvantage chip, caution |
| `--danger-red` | `#ff6b6b` | Critical resource, error |
| `--text-primary` | `#f4f8ff` | Headings, main copy |
| `--text-secondary` | `#9bbecf` | Sub-copy, meta |
| `--text-muted` | `#5e7a8e` | Helper text, locked items |

**Gradient'ler:**
- App BG: radial `--ocean-deep` → `#020a16` + starfield overlay + horizon glow
- Primary CTA: `linear-gradient(135deg, #0d3d5e 0%, #0a5878 100%)` + dış cyan glow
- Card glass: `linear-gradient(180deg, rgba(15,58,92,0.85) 0%, rgba(12,42,71,0.65) 100%)` + üst rim 1px highlight

### 1.2 Tipografi

| Rol | Öneri | Boyut (mobile) | Stil |
|---|---|---|---|
| Display title | Sora / Outfit / Manrope (700-800) | 28-36px | Caps tracking +1.5px, gold gradient text |
| Screen title | Aynı font (700) | 22-24px | All caps, white, letter-spacing +1px |
| Card title | Aynı font (600) | 16-18px | Sentence case |
| Body | Inter (400-500) | 14-15px | line-height 1.5 |
| Meta/label | Inter (500) | 11-12px | All caps, letter-spacing +0.5px, muted |
| Numeric stat | JetBrains Mono / Sora (700) | 22-28px | Tabular nums |

**Önemli:** Mevcut `system-ui` Android/iOS arası tutarsızlık üretiyor. Web font yüklemesi (woff2, preload) zorunlu.

### 1.3 Buton Sistemi

**Primary CTA (büyük, alt CTA):**
- Background: dark teal gradient, içte cyan inner glow
- Border: 1px `--cyan-glow` + dış halo (16px blur, opacity 0.45)
- Icon (sol) + text (caps, 14-15px, bold) + arrow (sağ)
- Yükseklik: 56px, radius: 16px, padding-x: 24px
- Aktif durumda hafif pulse (1.5s loop)

**Secondary (Geri vb):**
- Transparent fill, 1px border `--text-secondary` opacity 0.4
- Yükseklik: 48px, radius: 14px
- Pressed: border'a cyan dönüş

**Ghost (corner shortcut):**
- Daire, 56x56, transparent + ince cyan border
- İkon + altta minik label (10px caps)

**Disabled:**
- Background flat `--ocean-mid`, opacity 0.45, border yok, glow yok

### 1.4 Kart Sistemi

**Glass Card (ana kart):**
- Background gradient (yukarıda)
- Üst kenarda 1px highlight çizgisi (`linear-gradient(90deg, transparent, var(--cyan-glow), transparent)`)
- Border: 1px `rgba(94,234,248,0.18)`
- Radius: 18-20px
- İç padding: 18-20px
- Shadow: `0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(94,234,248,0.06) inset`

**Hero Card (kaptan, tekne, varış):**
- Üstünde 200-260px görsel alanı (boat/captain illustration + cyan glow halo)
- Aşağıda info bloğu
- Görselin etrafında concentric ring (2 katman: ince gold + ince cyan)

**Detail Sheet (alttan kayan):**
- Top radius 22px, alt radius 0
- Üst kenarda drag handle (32x4px muted)
- Backdrop blur 12px

### 1.5 Glow / Işık Dili

Glow oyunun premium hissinin %40'ı. Disiplinli kullanılmalı.

- **Hero glow:** Sadece bir ekranda 1 hero objesi (boat, captain portrait, marina pin) cyan halo alır. 60-80px blur, opacity 0.55.
- **Border glow:** Aktif/seçili element için 1px cyan border + 8-12px outer glow.
- **Rim light:** Tüm kartların üst kenarında ince çizgi.
- **Asla:** Tüm card'lara aynı anda glow verme. Hierarchy ölür.

### 1.6 İkon Dili

Mevcut emoji'ler (🏠 📹 🗺️ 🔧 👤) atılacak. Yerine:

- **SVG icon set, line + soft fill, 2px stroke**
- Ana ikonlar: anchor, compass, sail, wave, lighthouse, captain-hat, camera, route-map, wrench, trophy, handshake, shop, star, settings
- Tab bar boyutu: 24x24px stroke
- Card icon boyutu: 20x20px
- Hero icon boyutu: 56-72px (kaptan kart, varış)
- Renk: aktif `--cyan-glow`, inaktif `--text-muted`

### 1.7 Arka Plan Dili

3 katmanlı parallax yapısı:
1. **Base:** Deep ocean radial gradient
2. **Star layer:** İnce cyan/white nokta dağıtımı, çok yavaş yatay drift (90s)
3. **Horizon glow:** Alt %30'da yumuşak cyan glow + dalga silüeti

Bu katman App-level component olarak çıkarılmalı, sadece onboarding'de değil tüm oyunda persist etmeli.

### 1.8 Spacing / Layout Ritmi

- 4'lük grid: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40
- Section gap: 20px
- Card iç padding: 18px
- Top safe area: 24px (notch + status)
- Bottom safe area: 16px + nav bar
- Hero zone (üst): viewport'un %35-45'i
- Info zone (orta): %35-45'i
- CTA zone (alt): %15-20'si

### 1.9 Modal / Notification Dili

- Modal: backdrop dark blur (12px) + dim, ortada glass card, üst kenarda büyük gold/cyan highlight, dramatic shadow
- Toast: tek satır cam pill, alt sol/sağ konum (mevcut top yerine), tier'lı (ambient/milestone/celebration)
- Celebration: ekranı %70 kaplayan modal, animated reward sayıları (count-up), ikinci layer confetti/spark

### 1.10 Premium Hissi Detayları

- **Subtle particle drift:** Hero görsellerin etrafında 6-10 minik cyan partikül, çok yavaş yukarı drift
- **Number tick animation:** Tüm sayısal gainler count-up (300-500ms easeOut)
- **Tap haptic feel:** Buton press'te 1px depth + 80ms scale 0.98
- **Loading hold:** Asla flash empty state. Skeleton glow shimmer.
- **Sound (Batch 8 opsiyonel):** Tek bir cam tap sesi, tek bir ödül chime'ı, ambient deniz loop'u (mute toggle ayarlarda)

---

## 2. GLOBAL DESIGN PRINCIPLES

Oyunun her ekranına aynen uygulanacak prensipler.

1. **Tek ana CTA kuralı.** Her ekranda tek bir baskın aksiyon. Diğerleri ghost veya secondary.
2. **Sıradaki hamle her zaman görünür.** Player ekranı açtığında "şimdi ne yapacağım" sorusunun cevabı 1 saniyede okunmalı.
3. **Macera önce, rakamlar sonra.** Route/sponsor/upgrade kartlarında önce duygusal/anlatısal kısım, sonra sayısal stat. Sayılar destekleyici.
4. **Tekne duygusal merkez.** Boat görseli her hub ekranında en büyük tek elemandır. Sayılar ondan büyük olamaz.
5. **Rota bir liste değil yolculuktur.** World tour 17 nokta dotlu bir arc/journey'dir; route card destination hero'dur.
6. **Ödül anları gerçek kutlamadır.** Level-up, route complete, achievement = full-screen veya half-screen modal + count-up + glow burst. Toast'a sıkıştırılmaz.
7. **Cooldown durum, hata değil.** "30 dk sonra" disabled buton mesajı değil, görünür progress card olur.
8. **Readiness yolu gösterir, engel kurmaz.** Eksik stat'lar "bunu yap" formatında, "hata" formatında değil.
9. **Duygusal seçim, stat seçim olmasın.** Captain/marina/boat seçiminde önce kim/nerede/ne tür hayat, sonra sayılar.
10. **Hierarchy stat ile değil glow ile.** Aynı pixel boyutunda 2 buton varsa CTA'ya glow ver, diğerine verme. Player gözü cyan halo'ya gider.
11. **360x800 ve 390x667 minimum okunabilirlik.** Hiçbir text 11px altına inmez, hiçbir touch target 44x44'ten küçük olmaz.
12. **Onboarding'i identity choice gibi hisset.** "Eski Kaptan'sın çünkü deneyimini topluluğa aktarmak istiyorsun" hissi, "denizcilik 5 puan" değil.
13. **Ses (text)/görsel/animasyon birlikte konuşur.** Bir ödül anında 3 kanal birden tetiklenir; tek başına sayı artımı yetmez.

---

## 3. SCREEN-BY-SCREEN REDESIGN SPEC

### 3.1 Main Menu

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Cinematic deniz sahnesi, başlık, "YENİ OYUN" + "DEVAM ET" butonları, hardcoded "47.000 kaptan" |
| **Mevcut UX problemi** | Hardcoded sayı sahte hissediyor; "Devam Et" CTA kıyafetiyle "Yeni Oyun"a yenik düşüyor; corner shortcut (ayarlar/mağaza/sosyal/başarımlar) yok |
| **Hedef his** | "Bu dünyaya girmem lazım" |
| **Yeni layout** | Üst %55: gökyüzü + tekne hero + horizon glow + "YENİ MACERA SENİ BEKLİYOR" mikro-eyebrow. Orta: "YELKENLİ YAŞAM TYCOON" gold display title + "Türkiye'den Dünya Turuna" subtitle. Alt %30: 2 ana CTA (YENİ OYUN, DEVAM ET) + altta "🔴 LIVE 47.000 KAPTAN" pill (eğer dinamik yapılamıyorsa "Topluluk büyüyor" ile değiştir). Sol/sağ alt köşelerde 4 ghost circular shortcut: Ayarlar, Mağaza, Başarımlar, Sosyal |
| **Ana CTA** | YENİ OYUN (eğer save yoksa) / DEVAM ET (save varsa) — büyük olan dinamik |
| **Öne çıkan** | Tekne sahnesi, başlık, ana CTA |
| **Azaltılacak** | Hardcoded sayı küçültülecek pill formatına; corner shortcut'lar 56x56 ghost daire |
| **Componentler** | `app-background`, `main-menu-hero`, `primary-button`, `secondary-button`, `corner-shortcut`, `social-proof-pill` |
| **Interaction** | Tekne çok yavaş ileri-geri salınım (4s loop); star layer drift; CTA'lar sırayla 200ms stagger fade-in |
| **Mobil notu** | Hero alanı viewport %55, asla 50%'in altına düşmesin; CTA'lar 360px'de yan yana sığacak şekilde max-width 156px |
| **Risk** | Düşük — Onboarding.tsx içindeki MAIN_MENU bloğu |
| **Acceptance** | Sadece bir CTA glow alır (save var = DEVAM ET, save yok = YENİ OYUN); 4 ghost corner görünür; hero animasyon akıcı 60fps |

### 3.2 Onboarding — Captain Selection (PICK_PROFILE)

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Carousel, profil ikonu, isim, tagline, 3 skill bar, advantage/disadvantage |
| **Mevcut UX problemi** | Skill bar (Denizcilik 5 / İçerik 2) yeni player için soyut; advantage/disadvantage küçük; carousel ok'ları gözden kaçıyor |
| **Hedef his** | "Bu kaptan ben olabilirim" |
| **Yeni layout** | Üst eyebrow "STEP 1/5". Title "KAPTANINI SEÇ". Hero: 220px yuvarlak portre + concentric gold+cyan ring + alttan altın anchor mührü. Altında bold name + tagline italic. Skill row: 3 yatay glow bar (label sol, bar orta, /5 sağ) — sayı muted, bar dominant. Aşağıda 2 chip: ✓ Tecrübeli Seyirci (yeşil pill) / ⚠ Sosyal Medyaya Uzak (amber pill). Alt: GERİ + LİMANLARA BAK ana CTA. Carousel için sol/sağ büyük tap zone (görünmez), altında 6 dot pagination |
| **Ana CTA** | LİMANLARA BAK → |
| **Öne çıkan** | Portre + name + chip'ler |
| **Azaltılacak** | Skill bar sayıları küçük muted; arrow oklar görünmez geniş tap zone'a |
| **Componentler** | `step-header`, `captain-card`, `skill-bar-row`, `pros-cons-chip`, `pagination-dots`, `primary-button` |
| **Interaction** | Carousel swipe + dot tap; portre seçimde 180ms scale 0.98 → 1.02; ring glow pulse |
| **Mobil notu** | Portre çapı 220px (390 viewport); dots her zaman alt tap zone üstünde |
| **Risk** | Düşük — Onboarding.tsx PICK_PROFILE bloğu |
| **Acceptance** | 6 profil swipe ile geçilebilir; her birinin chip'leri renk ayrımıyla okunur; CTA'da glow tek |

### 3.3 Onboarding — Marina Selection (PICK_MARINA)

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Region filter chip'leri, scrollable liste, alt detay sheet |
| **Mevcut UX problemi** | Liste ekranı haritayı hissettirmiyor; "ÖNERİLEN" badge zayıf; first route options metin bloğu |
| **Hedef his** | "Buradan dünyaya açılıyorum" |
| **Yeni layout** | Üst eyebrow "STEP 2/5". Title "ÇIKIŞ LİMANINI SEÇ". Hero: 380-420px yükseklikte stilize Türkiye haritası (SVG, dark teal land + cyan kıyı çizgisi + grid). Marinalar gold anchor pin (premium) + cyan dot. Aralarında glowing route arc. Region filter haritanın üstünde pill bar (sticky). Marina seçildiğinde alt sheet açılır: marina ikonu (yuvarlak), name, location row (📍 Muğla), 2x2 mini grid (Ulaşım 3/5, Güzellik 5/5, Hava, Su Sıcaklığı), "Yerel İmkanlar" 2-3 chip (✓ Gulet Turları, ✓ Mavi Yolculuk Başlangıcı). Alt CTA: SEÇİLEN LİMANI ONAYLA |
| **Ana CTA** | SEÇİLEN LİMANI ONAYLA → |
| **Öne çıkan** | Harita + seçili marina pin'in glow'u + alt sheet |
| **Azaltılacak** | First route options text → 2-3 chip'e indirgenmiş |
| **Componentler** | `region-filter-bar`, `marina-map`, `marina-pin`, `marina-detail-sheet`, `mini-stat-grid`, `feature-chip`, `primary-button` |
| **Interaction** | Pin tap → camera marina'ya hafif zoom (200ms), alt sheet aşağıdan kayar (300ms); ÖNERİLEN pinler altın anchor; diğerleri cyan dot |
| **Mobil notu** | Harita pinch-zoom yapmasın (oyun için fazla); horizontal pan ile sığmayan kıyıyı gör |
| **Risk** | Orta — yeni harita SVG asset gerek (geçici olarak ilk pas'ta basit illustrated map yeterli) |
| **Acceptance** | 10 marina haritada görünür; ÖNERİLEN pinler altın; seçim alt sheet ile onaylanır; geri tuşu marinaya değil önceki ekrana gider |

### 3.4 Onboarding — Boat Selection (PICK_BOAT)

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | 3 length tab (28/34/40ft), büyük kart, 4 stat bar, fit panel, budget calculator |
| **Mevcut UX problemi** | Çok fazla bilgi tek ekranda; budget calculator soyut sayı; "kim için uygun" panel ezbere |
| **Hedef his** | "İlk teknemi seçiyorum" |
| **Yeni layout** | Üst eyebrow "STEP 3/5". Title "TEKNENİ SEÇ". Length pill bar (3 tab). Hero card: sol blokta class chip + length chip, name (bold gold), one-line tagline (yellow accent), 2 satır description; sağda boat illustration + cyan glow + sub-water reflection. Altında 2x2 stat grid (Maliyet, Dayanıklılık, Konfor, Açık Deniz) — her biri ikon + label + X/7 + glow bar. Alt info: "Kaptan ve Tekne Uyumu" panel — kaptan + tekne ikonları yan yana + 2 küçük benefit (Yakıt Verimliliği +%15, Bakım Süresi -%10). Sağ üstte trophy icon → mağaza ekranına shortcut (opsiyonel). Bütçe artığını CTA'nın hemen üstüne minik metin: "Bu tekneyi seçersen 115.000 TL ile başlarsın". Alt: GERİ + BU TEKNEYİ SEÇ |
| **Ana CTA** | BU TEKNEYİ SEÇ → |
| **Öne çıkan** | Boat illustration + name + 4 stat |
| **Azaltılacak** | "Game role" / "Fit" panelinin uzun metni → 1 satır summary'ye indir |
| **Componentler** | `length-tab-bar`, `boat-hero-card`, `stat-grid-2x2`, `compatibility-panel`, `budget-line`, `primary-button` |
| **Interaction** | Length tab geçişlerde boat illustration crossfade (200ms); stat bar fill animasyonu (400ms easeOut) |
| **Mobil notu** | Hero card max yükseklik 280px; stat grid kart içinde değil, kartın altında ayrı block |
| **Risk** | Düşük — Onboarding.tsx PICK_BOAT bloğu |
| **Acceptance** | 3 tekne arasında crossfade akıcı; bütçe satırı tekne değişiminde anında güncellenir; uyum paneli kaptan profiline göre gerçek değer çeker |

### 3.5 Onboarding — Boat Naming (NAME_BOAT)

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | "Son Hazırlık" başlık, boat SVG, name input, random name button, "Denize İndir" |
| **Mevcut UX problemi** | Boat SVG küçük; live preview gözden kaçıyor; random öneri button minik |
| **Hedef his** | "Bu artık benim teknem" |
| **Yeni layout** | Üst başlık "SON HAZIRLIK" gold display + alt subtitle "STEP 4/5". Hero: 240px stilize boat icon (geometrik, cyan glow, alttan grid floor), etrafında concentric ring + 4-6 minik cyan partikül drift. Altında "TEKNEYE İSİM VER" caps title + helper text. İnput: glass field (full width, 56px yükseklik, cyan border, rounded 14px, placeholder italic muted). İnput altında "Rastgele İsim Öner 🎲" pill secondary buton. Bunun altında live preview chip: « Adı » (eğer doluysa, italic gold). Alt: GERİ + ⚓ DENİZE İNDİR |
| **Ana CTA** | ⚓ DENİZE İNDİR → |
| **Öne çıkan** | Boat hero + input field |
| **Azaltılacak** | Random öneri'nin ikinci ikincil olduğu net olsun |
| **Componentler** | `glass-input`, `random-suggest-pill`, `live-preview-chip`, `primary-button`, `boat-icon-hero` |
| **Interaction** | Input focus'ta cyan border parlar; her tuş vuruşta preview chip count-in (50ms); "Denize İndir" tap'lendiğinde 800ms hero zoom + horizon transition → HUB |
| **Mobil notu** | Klavye açıldığında hero compress (180px); input klavye üstünde stuck |
| **Risk** | Düşük — Onboarding.tsx NAME_BOAT bloğu |
| **Acceptance** | Boş isimle CTA disabled state; random buton yeni öneri her tıkta; transition deneyimi tutarlı |

### 3.6 Liman / Hub Tab

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Daily Goals → Quest card → Boat hero → 2 progress card → Beginner guide → Marina service → Event log (5-6 dark card aynı görsel ağırlıkta) |
| **Mevcut UX problemi** | Hierarchy yok; "Kaptan Tavsiyesi" gözden kaçar; tekne küçük; günlük görevler servis kartı kadar bile büyük değil; event log dipte ama her zaman açık |
| **Hedef his** | "Burası benim üssüm. Şimdi ne yapacağım belli." |
| **Yeni layout** | Top bar (sticky): boat name + boat model sol; credits + followers sağ (flash anim korunur). Persistent strip (slim): Lvl • XP bar • followers count + "Sıradaki Hamle" CTA pill (Kaptan Tavsiyesi yerine bu, baskın ve glow'lu). Hero zone: boat illustration 220-280px, altında location name + horizon glow. Altta tek satır 4 mini stat (Enerji/Su/Yakıt/Tekne %) — küçük chip'ler, kritikse pulsing. Action card stack: 1) **Quest card** (büyük, glow, "İçerik Üret" / "Rotaya Çık" — ne gerekiyorsa). 2) **Daily Goals card** (3 görev row, tamamlananlar ✓ yeşil, all-done state altın halo + +2.500 TL chip). 3) **Marina servisi** collapsed accordion (default closed) — açıldığında dinlen + onar butonları. 4) **Event log** collapsed accordion (default closed) — chevron'la açılır. Beginner guide ilk 3 görev tamamlanana kadar üst stack'te, sonra otomatik gizlenir. |
| **Ana CTA** | "Sıradaki Hamle" strip pill VEYA Quest card buton (aynı aksiyona gider, ikisi senkron) |
| **Öne çıkan** | Hero boat + Sıradaki Hamle |
| **Azaltılacak** | World tour % ve ocean readiness % → 2 progress card yerine top strip içinde tek satır mikro bar |
| **Componentler** | `top-bar`, `captain-status-strip`, `next-action-pill`, `boat-hub-hero`, `mini-resource-row`, `quest-card`, `daily-goals-card`, `accordion-card`, `event-log-row` |
| **Interaction** | Quest card sürekli yumuşak pulse; daily goal tamamlanınca row 600ms green flash + ✓ scale-in; all-done'da kart altın halo + count-up ödül |
| **Mobil notu** | Hero zone yüksekliği 320px (ilk fold içinde quest card görünür); accordion'lar default kapalı, scroll ihtiyacını azaltır |
| **Risk** | Orta — LimanTab.tsx ve App.tsx içindeki strip + daily goal renderı etkilenir |
| **Acceptance** | İlk fold'da: top bar + status strip + hero boat + quest card görünür (390x667'de bile); event log + marina servisi default kapalı; Sıradaki Hamle ile Quest card aynı yere yönlendirir |

### 3.7 İçerik / Content Creation Tab

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Stats header → 2 sub-tab (Üret/Sponsor) → Career card → hint → platform grid → content type pills → produce button (or cooldown text) → result card |
| **Mevcut UX problemi** | Cooldown disabled buton üzerinde text — durumu hissettirmiyor; çok fazla kart aynı yerde; viral chance gizli; result card sıradan |
| **Hedef his** | "Şu an bir şey üretiyorum / şu an dinleniyorum" |
| **Yeni layout** | Sub-tab segmented control üstte (İçerik Üret / Sponsorluklar). **Üret modu:** Career mini-strip (1 satır: Followers + sponsor next-tier progress chip). Hero card: "Bugün hangi ekipmanı kullanıyorsun" — 4 platform tile (2x2 grid, ikon + ad + minik fit-bar bu kaptana göre). Seçilince content type pill'ler revealed (chip strip, scrollable, ✓ matchli olanlar gold border). Alt: PRİMARY ÜRET buton büyük. **Cooldown durumu:** Üret CTA yerine cooldown card belirir — büyük circular timer (24:32 dk gibi count-down) + "Mola anı, kahveni iç" copy + ambient gif/illustration. Sub-tab'a "Sponsorluk" badge eklenir cooldown sırasında alt aktivite önerisi olarak. **Result modu:** Full-card celebration — quality score büyük gauge (0-100, yarım daire gold/cyan), platform + type chip, gain card (+X follower / +Y TL), viral state ise "🔥 VIRAL" altın overlay, comment quote italik, "Yeni İçerik Üret" secondary CTA |
| **Ana CTA** | İÇERİK ÜRET (üret modu) / yok (cooldown) / YENİ İÇERİK ÜRET (result modu) |
| **Öne çıkan** | Platform seçimi + üret butonu (üret); circular timer (cooldown); quality gauge + gain (result) |
| **Azaltılacak** | Helper hint mini metne; career card 1 satıra |
| **Componentler** | `segmented-control`, `platform-tile`, `content-type-chip`, `circular-timer-card`, `quality-gauge`, `gain-row`, `viral-overlay` |
| **Interaction** | Platform seçildiğinde 200ms tile elevation + content types stagger reveal; cooldown timer her 30sn re-render; result viral'da 1.2s gold burst |
| **Mobil notu** | Platform tile min 156x140; chip strip horizontal scroll; circular timer 200x200 ortalı |
| **Risk** | Orta — App.tsx renderIcerikTab inline fonksiyon; cooldown state'i logic değişmeden visual rewrite |
| **Acceptance** | Cooldown asla disabled buton metni olarak görünmez; result viral'da görsel olarak ayırt edilir; sub-tab geçişleri akıcı |

### 3.8 Rota / Route Selection Tab

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Current route card (description + feeling + risk badge + duration + content potential + readiness section + CTA), next route preview küçük |
| **Mevcut UX problemi** | İlk gördüğü şey eksik readiness; rota duygusal değil checklist; world tour % sayı |
| **Hedef his** | "Bir sonraki destinasyona gitmek istiyorum" |
| **Yeni layout** | Üst: World Tour Arc — 17 dot horizontal (tamamlananlar gold dolu, current cyan glow, kalanlar muted), arc swipe edilebilir, üzerine basıldığında ufak peek; arc altında "X/17 ROTA TAMAMLANDI" ve % bar. Hero: Current Route Hero Card — full-width destination illustration (ileride gerçek bg, şimdilik gradient + glow), üzerinde gold pin "Yunan Adaları", risk pill (renk kodlu), duration chip. Card altında **Yolculuk Notu** italic short quote (max 2 satır), **Süre + Zorluk + Content Potansiyeli** 3 mikro stat row. Sonra **Hazırlık Durumu** accordion: default'ta kompakt — 6 stat → 6 küçük checkmark/cross icon row + "Hazır" / "X eksik" status pill. Açıldığında detail. Altta CTA: ROTAYA ÇIK (hazırsa glow'lu primary; eksikse "Tekneye Git" secondary'ye dönüşür ve gerçek aksiyonu yapar). Next route preview: hero card altında küçük "Sonraki Destinasyon: Adriyatik" peek-card |
| **Ana CTA** | ROTAYA ÇIK (hazır) / TEKNEYİ HAZIRLA (eksik) |
| **Öne çıkan** | Destination hero + journey arc |
| **Azaltılacak** | Readiness detayı default kapalı; sayısal değerler stat chip'lere |
| **Componentler** | `journey-arc`, `route-hero-card`, `risk-pill`, `readiness-status-row`, `readiness-detail-accordion`, `next-route-peek`, `primary-button` |
| **Interaction** | Journey arc'ta dot tap'leri minik tooltip ile route adını gösterir; route hero'da subtle parallax (10px); CTA "ROTAYA ÇIK" pulse |
| **Mobil notu** | Hero card max 220px; arc 60px yüksekliğinde |
| **Risk** | Orta — RotaTab.tsx + readiness logic'i sadece visual yer değiştirir, hesaplama değişmez |
| **Acceptance** | Readiness eksikse CTA otomatik "Tekneyi Hazırla"ya döner ve Tekne tab'ına gider; journey arc 17 dot'u doğru renderlar; current route hero scrollda ilk fold'da |

### 3.9 Sea Mode

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Boat animation, sea status card, critical resource banner, 2x2 resource grid, sea event text, "Bir Gün İlerle" buton |
| **Mevcut UX problemi** | Liman'a benzer hissediyor, "denizdeyim" hissi zayıf; resource grid statik; bottom nav diğer tab'larla aynı (kafa karıştırır) |
| **Hedef his** | "Açık denizdeyim. Her gün önemli." |
| **Yeni layout** | Tüm BG dalga animasyonu güçlendirilmiş + horizon glow daha aşağıda. Top: voyage progress arc (tamamlanan gün dot'lu, kalan gün glow). Hero: boat illustration daha büyük, dalga üzerinde subtle bob (±6px y). Altında current location → destination chip ("Marmaris ↣ Yunan Adaları"). **Resource bar:** 4 stat tek satır slim row, kritikse her biri kendi pulsing red glow alır + icon shake. Critical state'te full-width banner üstte sticky. Action zone altta: "Bir Gün İlerle" tek büyük CTA + "Kalan: 5 gün" sub-text. Sea event text → kompakt log row (en son event), "Geçmiş olaylar" accordion. **Decision modal:** event tetiklenince full-screen modal — koyu blur overlay, glass card ortada, event başlık + storied description + 2 choice buton. Choice'larda effect preview chip'leri (+10 fuel, -200 TL gibi). Modal kapanmadan başka aksiyon alınamaz. **Bottom nav sea mode'da:** Liman tab "Denizdesin" pill'e döner ve diğer tab'lar muted ama erişilebilir |
| **Ana CTA** | BİR GÜN İLERLE / decision tetiklenirse 2 choice buton |
| **Öne çıkan** | Boat hero + voyage arc + advance CTA |
| **Azaltılacak** | Resource grid 2x2 yerine slim row; sea event scroll-back accordion |
| **Componentler** | `voyage-progress-arc`, `boat-sea-hero`, `route-pair-chip`, `resource-row-slim`, `critical-banner`, `sea-event-modal`, `event-history-accordion`, `primary-button` |
| **Interaction** | "Bir Gün İlerle" tap → boat 400ms ileri kayma + dalga ripple + day count -1 tick; resource bar drain animation (300ms); decision modal entrance dramatic (opacity + scale 0.95→1) |
| **Mobil notu** | Modal full-screen scroll edilebilir; choice butonları min 56px; boat hero alanı %30 viewport |
| **Risk** | Orta — SeaModeTab.tsx + decision modal yeni component |
| **Acceptance** | Decision modal tetiklendiğinde başka tab'a geçilemez (logic mevcut, sadece görsel kilit); critical resource pulsing; voyage arc gün gün ilerler |

### 3.10 Arrival / Reward Screen

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Anchor icon, "Varış!" heading, port name, feeling quote, rewards grid, world tour summary, "Limana Dön" |
| **Mevcut UX problemi** | "Card" gibi hissediyor, kutlama gibi hissetmiyor; ödül sayıları statik |
| **Hedef his** | "Başardım. Bu hak edildi." |
| **Yeni layout** | Full-screen takeover, arka planda subtle gold particle confetti drift. Üstte "VARIŞ ✦" gold burst eyebrow. Hero: destination port illustration + büyük gold pin ile port name. Altında feeling quote, italic, gold accent quote marks. **Reward block:** 2 büyük number tile yan yana (Credits + Followers), her biri count-up animasyonla 0'dan hedefe (1.2s easeOut), altında +X bonus chip. World tour progress: arc'ta yeni dot gold "açıldı" animasyonu + bar fill. Sonra "Sıradaki Destinasyon: Adriyatik" peek-card. Alt: LİMANA DÖN ana CTA. Ek olarak: route XP gain (+80) altında küçük chip; level-up varsa ekstra modal layer (3.11) |
| **Ana CTA** | LİMANA DÖN |
| **Öne çıkan** | Port name + count-up reward + world tour gold pin animation |
| **Azaltılacak** | "Rota Tamamlandı" badge implicit oldu (zaten varış ekranında) |
| **Componentler** | `arrival-takeover`, `confetti-particles`, `reward-count-up-tile`, `journey-arc-update`, `next-route-peek`, `primary-button` |
| **Interaction** | Sahne entrance: hero scale 0.95→1 (400ms), reward 800ms sonra count-up tetik, journey arc dot 1600ms'de gold burst, peek 2200ms fade-in |
| **Mobil notu** | Reward tile minimum 140px height; CTA viewport altında %15 |
| **Risk** | Orta — handleArrival visual layer değişir, logic dokunulmaz |
| **Acceptance** | Sayılar count-up animasyonla artıyor; gold pin animasyonu world progress'i görsel değiştiriyor; "Limana Dön" handleArrival'i tetikliyor |

### 3.11 Sponsor Tab (içerik tab içinde sub-tab)

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Sponsor career card (brand trust, tier, bar, follower target), "Teklifleri Kontrol Et" button, offers list, accepted sponsors badges |
| **Mevcut UX problemi** | Manual "check offers" patternı zorla; tier progress'i duygusuz; brand trust soyut |
| **Hedef his** | "Markalar beni tanıyor, kariyer büyüyor" |
| **Yeni layout** | Üst: Tier badge hero — current tier ikon (mikro/küçük/orta...) büyük gold ring içinde + "X/Y takipçi" sub-text + next tier name. Tier progress bar büyük + yan tier icon path (5 nokta horizontal). Brand Trust mini-stat row (chip). **Offers section:** "Yeni Teklifler" başlık altında card list. Her teklif glass card: brand ikonu yuvarlak, brand name, tier chip, reward range chip, "İmzala" primary buton. Eğer offer yoksa: empty state — "Daha fazla takipçiyle yeni teklifler gelecek" + bir sonraki tier'a kadar followers needed sayısı (manual button yok, otomatik check her render'da). **Accepted sponsors:** 2x grid badge wall, her biri minik logo placeholder + brand name |
| **Ana CTA** | İMZALA (her offer kartında) — global ekran CTA'sı yok |
| **Öne çıkan** | Tier hero + offer cards |
| **Azaltılacak** | "Teklifleri Kontrol Et" buton kaldırılır, otomatik render'da çağrılır |
| **Componentler** | `tier-hero-card`, `tier-progress-path`, `offer-card`, `empty-state-card`, `accepted-badge-grid` |
| **Interaction** | Tier hero ring slow rotate; offer card tap'inde modal preview ile imza onay |
| **Mobil notu** | Offer card min height 96px; tier path 5 nokta arasında 48px |
| **Risk** | Orta — App.tsx içindeki sponsor render bloğu; "check offers" pattern çağrı yer değiştirir, logic aynı |
| **Acceptance** | Tier path görsel; offer otomatik check; saturation warning (her 3'te 1) toast olarak akar |

### 3.12 Tekne / Boat Upgrades Tab

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Boat summary card → 4-stat grid → helper hint → 10 category pill bar → install detail box → upgrade card list |
| **Mevcut UX problemi** | 10 kategori bar ezici; her upgrade card aşırı text; install timer küçük; boat hero küçük |
| **Hedef his** | "Hayalimdeki tekneyi yapıyorum" |
| **Yeni layout** | Hero: Boat illustration büyük (mevcut hub'la aynı asset, burada da 220px) + "X/27 upgrade tamamlandı" gold sub-text. Altında: Ocean Readiness master bar (büyük) + 4-stat mini chip row (Enerji/Su/Güvenlik/Navigasyon). **Eğer install in progress:** Top'ta priority card — circular timer + upgrade ikonu + name + "Kurulumda: 12 dk kaldı". **Kategori bar:** 10 değil, top 4 priority chip + "Tümü" chevron (modal'da kalan 6). Priority sıralama: o anki rotanın eksik stat'ına göre dinamik. **Upgrade card:** condensed — ikon (sol), name + cost (sağ), description max 1 satır, 2-3 effect badge (+E +S vs), "AL" buton. "Detay" tap → expand. Strategy hint default gizli, expand'de çıkar. Warning/error badge'leri minik chip |
| **Ana CTA** | AL (her card içinde) |
| **Öne çıkan** | Boat hero + active install timer + priority categories |
| **Azaltılacak** | Strategy hint expand'de; 10 kategoriden 6'sı modal'da; description 1 satıra |
| **Componentler** | `boat-tekne-hero`, `master-readiness-bar`, `install-progress-card`, `priority-category-bar`, `upgrade-card-condensed`, `effect-badge` |
| **Interaction** | Card tap → expand 250ms; AL tap → primary button momentary glow → install timer üstte yumuşakça çıkar; install complete → toast (Batch 5) |
| **Mobil notu** | Upgrade card min 80px height collapsed, ~180px expanded; kategori chip min 44x44 |
| **Risk** | Orta — App.tsx renderTekneTab inline; logic dokunulmaz, sadece visual recompose |
| **Acceptance** | Install timer her zaman üstte görünür; kategori bar default top 4; expand/collapse smooth; AL butonu disabled state'lerini koruyor |

### 3.13 Kaptan / Profile Tab

| Alan | İçerik |
|---|---|
| **Mevcut yapı** | Header → career card → 6-skill mini grid → 2 career goals bar → achievement showcase (13 chip) → event log |
| **Mevcut UX problemi** | Skill mini-grid placeholder hissi; achievement chip'leri zayıf; rank label gözden kaçar |
| **Hedef his** | "Geldiğim yeri görüyorum" |
| **Yeni layout** | Hero: kaptan portresi (onboarding'deki aynı captain card stili, 180px) + altta name + tagline + rank chip büyük gold. **Career strip:** 3 büyük number — Level X / XP bar / Routes Y/17. **Career goals:** 2 büyük arc — Dünya Turu (full circle progress) ve 1M Followers (full circle progress) yan yana. **Skills:** "Yetenekler" başlığı altında 6 skill row — her birinin yanında /5 yıldız ve mini glow bar. **Achievements showcase:** "Başarı Yolculuğu" başlık + "X/13 rozet" → 13 badge grid (3-col), kilitli badge'ler silhouette + ⃝ + dim, açılmış badge'ler gold + glow + ikon. Tap → detail modal. **Event log:** accordion default kapalı |
| **Ana CTA** | Yok (informational tab) — opsiyonel "Ayarlar" üst sağ ghost |
| **Öne çıkan** | Hero portresi + 2 career arc + achievement grid |
| **Azaltılacak** | Career narrative text rank chip + 1 satır summary'e indirgenir |
| **Componentler** | `captain-profile-hero`, `rank-chip`, `career-stat-strip`, `career-goal-arc`, `skill-row`, `achievement-badge`, `achievement-detail-modal` |
| **Interaction** | Achievement badge tap → modal açılır (title + description + unlock condition); kilitli badge'lerde lock icon overlay |
| **Mobil notu** | Badge grid 3 kolon, her badge min 96x96; arc'lar yan yana 360px'de sığar |
| **Risk** | Düşük-orta — KaptanTab.tsx visual rewrite |
| **Acceptance** | 13 achievement doğru lock/unlock state; arc'lar gerçek değerlerden çekiyor; rank chip level'a göre |

### 3.14 Achievements (modal/showcase)

Kaptan tab'da showcase olarak yaşıyor (3.13). Ek olarak: **achievement unlock celebration moment** — Batch 5'te full-screen mini modal (1.5sn): badge ikonu büyür + halo + "BAŞARIM AÇILDI" caps + badge name + description, tap-to-dismiss. Bu mevcut toast'a ek bir tier.

### 3.15 Notifications / Toasts (3-Tier System)

Tek toast yapısı yetmiyor. 3 tier önerisi:

| Tier | Trigger | Görsel | Süre |
|---|---|---|---|
| Ambient (1) | content done, sea event resolved, small gain | Slim pill, alt-merkez, ikon + 1 satır text | 2.5s |
| Milestone (2) | sponsor offer arrived, upgrade complete, daily goal item done | Full-width banner üst-merkez, ikon + title + sub-text | 3.5s |
| Celebration (3) | level-up, achievement unlock, daily goals 3/3, route complete | Half-screen modal, glow, count-up sayı, tap-to-dismiss | manuel/4s otomatik |

**Konum:** Mevcut top-fixed → ambient pill alt-merkez (Android safe-area sorununu çözer), milestone üst, celebration ortalı.

**Queue logic değişmez**, sadece visual tier seçimi pushToast çağrılarına eklenir.

### 3.16 Save / Settings

Mevcut: yok (silent autosave).

**Yeni minimal Ayarlar modal'ı (Batch 8 önerisi):**
- Top corner shortcut'tan açılır
- Sound toggle (varsa)
- Haptic toggle
- Save'i yedekle (export to clipboard JSON) — opsiyonel
- Save'i sıfırla (kırmızı, double confirm)
- Versiyon info, gizlilik linki
- "Devam" CTA modal'ı kapatır

Save logic dokunulmaz; sadece export/reset UI'ı eklenir.

### 3.17 Bottom Navigation

5 tab korunur. Ama:
- Emoji ikon → SVG icon set
- Aktif tab: cyan glow underline + ikon cyan, label cyan
- İnaktif: muted icon + muted label
- Notification badge sistemi: küçük gold dot, hangi tab'da aksiyon varsa (sponsor offer, upgrade complete, level-up, decision pending, daily goal done)
- Sea mode'da Liman tab'ı "Denizde" wave icon'a döner

---

## 4. COMPONENT SYSTEM

Tüm oyunda paylaşılan, yeniden kullanılabilir component listesi.

| Component | Amaç | Görsel Stil | Kullanım | Interaction | Mobil notu |
|---|---|---|---|---|---|
| `app-background` | Persistent ambient ocean (3 katman: deep BG + starfield + horizon glow) | Deep navy radial + slow drifting stars + bottom horizon glow | Tüm ekranlarda altyapı | Star drift 90s loop | Performance: GPU layer |
| `main-menu-hero` | Cinematic boat sahnesi | Boat silhouette + reflection + waves + horizon | Sadece MAIN_MENU | Boat ±4px y bob 4s | Yükseklik viewport %55 |
| `onboarding-card` | Step-based seçim kartı | Glass card + üst rim | PICK_PROFILE/MARINA/BOAT/NAME | Stagger reveal | Max width 360px |
| `captain-card` | Kaptan portresi + skill | Yuvarlak portre + concentric ring (gold+cyan) | PICK_PROFILE, KaptanTab hero | Ring slow pulse | Portre 180-220px |
| `marina-map` | Türkiye haritası + pin | SVG dark land + cyan kıyı + glow routes | PICK_MARINA | Pin tap zoom 200ms | Horizontal pan only |
| `marina-pin` | Konum işaretçisi | Gold anchor (premium) / cyan dot | Marina map | Tap → select | Min 44x44 tap zone |
| `boat-card` | Tekne hero + 4 stat | Glass card + boat illustration + glow + 2x2 stat grid | PICK_BOAT | Tab geçişi crossfade | Hero max 280px |
| `glass-card` | Genel container | Gradient bg + üst rim highlight + cyan border | Yaygın | Press 1px depth | Padding 18-20 |
| `primary-button` | Ana CTA | Dark teal gradient + cyan border + outer glow + icon left + arrow right | Her ekranda max 1 | Pulse 1.5s loop | 56px height, radius 16 |
| `secondary-button` | Geri/iptal/ikincil | Transparent + ince border | Yaygın | Border cyan on press | 48px height |
| `ghost-button` | Corner shortcut | Daire + ince border | Main menu corners, settings | Tap glow | 56x56 |
| `bottom-navigation` | Tab bar | 5 tab SVG icon + label + active glow + badge | HUB/SEA_MODE | Tap → tab switch | 64px + safe area |
| `captain-status-strip` | Top persistent strip | Slim row: lvl + xp bar + followers + Sıradaki Hamle pill | HUB üstü | Sıradaki Hamle pulse | 48px |
| `next-action-pill` | Sıradaki hamle CTA | Cyan glow pill, dynamic copy | Status strip | Pulse + tap → ilgili tab | Min 160px width |
| `boat-hub-hero` | Hub tekne görseli | Boat SVG + water reflection + horizon + location label | LimanTab hero | Slow bob | 280-320px h |
| `quest-card` | Sıradaki ana aksiyon | Glass card + büyük ikon + büyük buton + dynamic copy | LimanTab | Pulse loop | Min 120px h |
| `daily-goals-card` | 3 günlük görev | Glass card + 3 row + theme chip + reward chip | LimanTab | Tamamlanma flash; all-done halo | ~180px h |
| `accordion-card` | Collapsed bilgi grubu | Glass card + chevron + collapsed/expanded states | Marina servis, event log | Smooth expand 250ms | Header 56px |
| `mini-resource-row` | 4 stat tek satır | Slim chip row, kritik state pulsing | Hub + Sea mode | Pulsing red <25% | 40px h |
| `journey-arc` | World tour 17 nokta | Horizontal dot path (gold/cyan/muted) + arc line | Rota tab top | Dot tap tooltip | 60px h |
| `route-hero-card` | Destination kart | Hero illustration + pin + risk pill + duration chip | Rota tab | Subtle parallax | Max 220px h |
| `risk-pill` | Risk seviye chip | Color-coded pill (yeşil-amber-kırmızı) | Route hero | — | Min 72px width |
| `readiness-status-row` | Hazırlık özet | 6 mini icon (✓/✗) + status pill | Rota tab | — | 48px |
| `voyage-progress-arc` | Sea mode gün arc | Dot path: tamamlanan günler dolu, current glow | Sea mode top | Day advance fill | 50px h |
| `sea-event-modal` | Decision modal | Full-screen blur + glass card + event title + 2 choice + effect chips | Sea mode | Entrance 300ms scale | Full-screen scroll |
| `circular-timer-card` | Cooldown / install timer | Daire timer + countdown text + ambient illustration | İçerik (cooldown), Tekne (install) | Re-render 30s | 200x200 |
| `quality-gauge` | İçerik quality skoru | Yarım daire gold/cyan dolum 0-100 | İçerik result | Fill anim 800ms | 180x100 |
| `gain-row` | +X follower / +Y TL | Inline ikonlu row | Result, arrival | Count-up | 36px |
| `viral-overlay` | Viral state işareti | Gold "🔥 VIRAL" overlay + spark | İçerik result | 1.2s burst | Overlay |
| `tier-hero-card` | Sponsor tier badge | Tier ikon + ring + tier name + sub | Sponsor sub-tab | Ring slow rotate | Hero |
| `tier-progress-path` | 5 tier yatay path | Dot path (mikro→global) + glow current | Sponsor | — | 60px h |
| `offer-card` | Sponsor teklifi | Brand logo + name + tier chip + reward + İMZALA | Sponsor | Tap → confirm modal | Min 96px h |
| `boat-tekne-hero` | Upgrade ekranı boat | Hub boat ile aynı asset + "X/27 upgrade" sub | Tekne tab | — | 220px |
| `master-readiness-bar` | Ocean readiness master | Geniş progress bar + label | Tekne tab | Fill anim on change | 60px |
| `install-progress-card` | Kurulum priority kart | Circular timer + upgrade ikonu + name | Tekne tab top (conditional) | Re-render 30s | 100px h |
| `priority-category-bar` | Top 4 kategori chip | Pill bar + chevron "Tümü" | Tekne tab | Tap → filter | 48px h |
| `upgrade-card-condensed` | Upgrade kart compact | İkon + name + cost + 2-3 effect badge + AL | Tekne tab | Expand 250ms | 80px collapsed |
| `effect-badge` | Stat etki chip | Mini chip: icon + +X | Upgrade card, sea decision | — | 24px h |
| `captain-profile-hero` | Kaptan profil hero | Portre + name + tagline + rank chip | KaptanTab top | Rank chip glow | 220px |
| `career-goal-arc` | Goal progress | Full circle progress + center label | KaptanTab | Fill smooth | 140x140 |
| `achievement-badge` | Başarım rozeti | Açık: gold filled + glow / kilitli: silhouette + dim | KaptanTab grid | Tap → modal | 96x96 |
| `notification-toast-ambient` | Tier 1 bildirim | Slim pill alt-merkez | Global | 2.5s auto-dismiss | Min height 36 |
| `notification-banner-milestone` | Tier 2 bildirim | Full-width banner üst | Global | 3.5s auto-dismiss | 64px |
| `celebration-modal` | Tier 3 bildirim | Half-screen modal + count-up + glow | Global (level-up, route, daily 3/3) | Tap-to-dismiss | Half-screen |
| `arrival-takeover` | Varış ekranı | Full-screen takeover + confetti + reward count-up | ARRIVAL_SCREEN | Multi-stage entrance | Full-screen |
| `progress-bar` | Genel progress | Dark track + cyan fill + optional glow tip | Yaygın | Smooth fill | Min 8px h |

---

## 5. CLAUDE CODE IMPLEMENTATION ROADMAP

8 batch, her biri bağımsız test edilebilir, sadece Batch 1 öncelikli (visual foundation).

### Batch 1 — Global Visual Foundation

| Alan | İçerik |
|---|---|
| **ID** | B1-FOUNDATION |
| **Amaç** | Tüm ekranlarda kullanılacak token, font, button, glass card, app background sistemini kurmak |
| **Kapsam** | CSS token tanımları, web font yükleme, base button/card sınıfları, app-background katmanı |
| **Etkilenen ekranlar** | Hiçbiri görsel olarak henüz değişmez (foundation only); var olan ekranlar yeni token'ları otomatik kullanmaya başlar |
| **Muhtemel dosyalar** | `src/index.css`, `src/App.css`, `index.html` (font preload), opsiyonel yeni `src/styles/tokens.css` |
| **Yapılacak işler** | (1) `src/styles/tokens.css` oluştur, tüm renk/spacing/radius/shadow token'larını CSS variable olarak tanımla; (2) `index.html`'de Google Fonts veya self-hosted woff2 (Sora + Inter) preload; (3) App.css içinde `.glass-card`, `.primary-button`, `.secondary-button`, `.ghost-button` base sınıfları ekle; (4) App-level background component (`AppBackground.tsx`) oluştur, App.tsx'in en üst layout'una ekle, mevcut onboarding'in ocean BG'si bunu kullanır; (5) Mevcut renkleri yeni token'lara map et — DOM/JSX değiştirmeden sadece CSS değer güncellemesi |
| **Dokunulmaması gereken** | Save/load, ekonomi, herhangi bir state, herhangi bir component'in JSX yapısı |
| **Risk** | Düşük (saf CSS + 1 wrapper component) |
| **Test checklist** | npm run build çalışır; mevcut tüm ekranlar yeni renkleri/font'u alır; main menu hâlâ tıklanır; "Devam Et" save varsa görünür; build size <%5 büyür |
| **Acceptance** | Tüm ekranlarda yeni font; tüm dark cardlar yeni glass styling; eski renk kodları kalmamış; AppBackground tüm step'lerde (MAIN_MENU dahil) render |
| **Commit mesajı** | `feat(visual): add design tokens, web fonts, glass card foundation, app background layer` |

**Claude Code prompt:**
```
Bu repodaki Yelkenli Yaşam Tycoon oyunu için Batch 1 — Global Visual Foundation'ı uygula.

ÖNCE:
1. git status çalıştır, bana dirty file varsa söyle ve devam etme
2. npm run build çalıştır, mevcut build temiz mi onayla

SADECE BATCH 1 KAPSAMI:
- src/styles/tokens.css yeni dosya: master spec'teki tüm CSS variables (--ocean-deep, --cyan-glow, --gold-bright, vb tam liste)
- index.html: Sora (700, 800) ve Inter (400, 500, 600) Google Fonts preload veya self-host
- src/App.css: yeni .glass-card, .primary-button, .secondary-button, .ghost-button base classes
- src/components/AppBackground.tsx yeni component: 3 katmanlı ocean BG (deep + stars + horizon glow), App.tsx layout'unun en üst seviyesine ekle, mevcut Onboarding.tsx içindeki ocean-bg div'ini bununla değiştir
- Mevcut hard-coded renkleri (rgba'lar, hex'ler) tokens'a map et — sadece CSS değerleri, JSX yapısını değiştirme

DOKUNMA:
- save/load (yelkenli_save key, version 2, tüm load mantığı)
- ekonomi değerleri (STARTING_BUDGET, boat costs, route rewards, sponsor tiers, daily reward, level bonuses, content income formula)
- route/sponsor/XP/upgrade/daily goal/achievement/sea mode/content cooldown logic
- Onboarding.tsx step akışı, App.tsx state mantığı, herhangi bir component'in JSX/JS yapısı

SONRA:
1. npm run build tekrar çalıştır, başarılı olmalı
2. Bana değişen dosya listesi + her birinin ne değiştirdiğine dair 1-2 satır özet ver
3. Bundle size farkını söyle
4. push YAPMA, sadece local commit yap mesajı: "feat(visual): add design tokens, web fonts, glass card foundation, app background layer"

Olmayan dosya ismi uydurma. Şüphede kal ve sor.
```

---

### Batch 2 — Main Menu + Onboarding

| Alan | İçerik |
|---|---|
| **ID** | B2-ONBOARDING |
| **Amaç** | İlk izlenimi cinematic, profile/boat seçimini identity choice gibi hissettir |
| **Kapsam** | Main menu hero + corner shortcut, profile carousel, marina map (basit illustrated), boat card, naming screen |
| **Etkilenen ekranlar** | MAIN_MENU, PICK_PROFILE, PICK_MARINA, PICK_BOAT, NAME_BOAT |
| **Muhtemel dosyalar** | `src/components/Onboarding.tsx`, `src/App.css`, opsiyonel yeni `src/components/onboarding/*.tsx` (CaptainCard, MarinaMap, BoatCard, NamingScreen) |
| **Yapılacak işler** | (1) Main menu: corner shortcut'ları ekle (4 ghost daire, ayarlar/mağaza/başarımlar/sosyal — şimdilik şu anki olmayan tab'lara link verme, sadece görsel + console.log); (2) PICK_PROFILE: skill bar yatay glow bar'a + advantage/disadvantage chip pill formatına + carousel için sol/sağ büyük tap zone; (3) PICK_MARINA: ilk pas'ta basit illustrated Türkiye haritası SVG (kıyıyı temsil eden çizgi + 10 pin), bottom sheet açılma animasyonu, ÖNERİLEN pin altın anchor; (4) PICK_BOAT: 2x2 stat grid + uyum paneli, length tab geçişlerinde crossfade; (5) NAME_BOAT: glass input + random pill + live preview chip + stylized boat hero |
| **Dokunulmaması gereken** | profileIndex/marinaIndex/boatIndex state mantığı, boatName validation, "Denize İndir" → HUB transition logic, save trigger |
| **Risk** | Düşük (Onboarding.tsx visual rewrite, 5 step) |
| **Test checklist** | 5 step sırayla çalışır, geri butonu doğru çalışır; profile seçimi marina ekranındaki ÖNERİLEN'i etkiler; boat seçimi bütçe değerini doğru hesaplar (mevcut formul); empty boat name → CTA disabled; "Denize İndir" HUB'a geçer |
| **Acceptance** | 5 ekran spec'teki layout'a uyar; mobile 360x800 ve 390x667'de hiçbir element kesilmez; transition akıcı |
| **Commit mesajı** | `feat(onboarding): redesign main menu, captain/marina/boat/naming screens` |

**Claude Code prompt:**
```
Yelkenli Yaşam Tycoon için Batch 2 — Main Menu + Onboarding redesign'ı uygula.
Batch 1 (Global Visual Foundation) merge edilmiş olmalı. Yoksa devam etme, bana söyle.

ÖNCE:
1. git status temiz olmalı
2. npm run build başarılı olmalı

SADECE BATCH 2 KAPSAMI (master spec section 3.1 - 3.5):
- src/components/Onboarding.tsx içindeki MAIN_MENU, PICK_PROFILE, PICK_MARINA, PICK_BOAT, NAME_BOAT bloklarını yeniden tasarla
- Yeni komponent dosyaları opsiyonel: src/components/onboarding/CaptainCard.tsx, MarinaMap.tsx, BoatCard.tsx, NamingHero.tsx
- App.css içinde gerekli yeni class'lar (.captain-card, .marina-map, .boat-hero-card, .glass-input, vb)

ÖZELLİKLE:
- Main Menu: 4 ghost corner shortcut ekle (Ayarlar/Mağaza/Başarımlar/Sosyal), şimdilik onClick={() => console.log('TODO')} yeterli, link verme
- Captain selection: skill bar yatay glow bar; advantage/disadvantage chip pill; carousel ok'ları görünmez büyük tap zone + alt 6 dot
- Marina: basit SVG illustrated map (Türkiye kıyı çizgisi + 10 pin), pin altın anchor (premium) veya cyan dot, alt detail sheet animasyonlu
- Boat: 2x2 stat grid, "Kaptan ve Tekne Uyumu" panel (kaptan + boat ikonu + 2 benefit chip), bütçe satırı CTA üstü
- Naming: stylized geometrik boat hero (cyan glow, alt grid floor), glass input, random pill, live preview chip

DOKUNMA:
- profileIndex / marinaIndex / boatIndex state mantığı, validation, transition fonksiyonları
- save/load
- ekonomi (STARTING_BUDGET, boat cost values)
- HUB'a geçiş logic'i ("Denize İndir" handler)

SONRA:
1. npm run build başarılı
2. Manual test: 5 step'in her birini sırayla aç, geri butonu çalışır mı, boş isimle "Denize İndir" disabled mı
3. Değişen dosya listesi + her birinin özeti
4. Push YAPMA, commit mesajı: "feat(onboarding): redesign main menu, captain/marina/boat/naming screens"

Olmayan dosya/component uydurma. Şüphede sor.
```

---

### Batch 3 — Liman / Hub

| Alan | İçerik |
|---|---|
| **ID** | B3-HUB |
| **Amaç** | Hub'ı "ev" hissettir, tekneyi merkez yap, "sıradaki hamle" her zaman görünür |
| **Kapsam** | Top bar + status strip + Sıradaki Hamle pill, hub boat hero, quest card, daily goals card, accordion'lar (marina servis, event log) |
| **Etkilenen ekranlar** | HUB > Liman tab |
| **Muhtemel dosyalar** | `src/components/HubScreen.tsx`, `src/components/LimanTab.tsx`, `src/App.tsx` (renderDailyGoalsCard + status strip), `src/App.css` |
| **Yapılacak işler** | (1) Top bar: boat name + model sol; credits + followers sağ (mevcut flash anim korunur); (2) Status strip: Lvl + XP bar + followers + büyük "Sıradaki Hamle" pill (Kaptan Tavsiyesi logic'ini buna bağla); (3) LimanTab içinde: boat hero büyüt (220-280px), 4 mini resource row (chip), Quest card stack başına, Daily Goals card 2. sıraya, Marina servis ve Event log accordion default kapalı; (4) Beginner guide ilk 3 görev tamamlanana kadar üstte, sonra otomatik gizlenir |
| **Dokunulmaması gereken** | Daily goal logic (theme rotation, reset, 3/3 reward), Kaptan Tavsiyesi suggestion algoritması, marina rest/repair mekaniği, event log push logic |
| **Risk** | Orta (LimanTab + App.tsx inline render iki yerden) |
| **Test checklist** | 390x667'de ilk fold'da: top bar + strip + boat hero + quest card görünür; daily goals tamamlandığında flash + all-done halo; accordion expand/collapse; Sıradaki Hamle pill ve Quest card aynı yere yönlendirir |
| **Acceptance** | Hierarchy net (sadece quest card + Sıradaki Hamle glow alır); event log default kapalı; marina servis default kapalı |
| **Commit mesajı** | `feat(hub): redesign Liman tab with hero boat, status strip, quest stack, accordion services` |

**Claude Code prompt:**
```
Yelkenli Yaşam Tycoon için Batch 3 — Liman / Hub redesign'ı uygula.
Batch 1 ve 2 merge edilmiş olmalı.

ÖNCE: git status temiz, npm run build başarılı.

SADECE BATCH 3 KAPSAMI (master spec section 3.6):
- src/components/HubScreen.tsx: top bar (boat name + credits/followers), status strip (Lvl, XP bar, followers, "Sıradaki Hamle" pill)
- src/components/LimanTab.tsx: layout yeniden — boat hero (220-280px) + location label, 4 mini resource chip row, quest card (büyük, glow), daily goals card, accordion'lar (marina servis + event log default kapalı), beginner guide conditional
- src/App.tsx içinde renderDailyGoalsCard ve "Kaptan Tavsiyesi" render logic'inin output'u Status Strip'teki Sıradaki Hamle pill'e map'lenecek (suggestion algoritması değişmez)
- src/App.css gerekli class'lar

DOKUNMA:
- Daily goal logic: dailyGoals array, lastDailyReset, dailyRewardClaimed, theme rotation, 3/3 +2.500 TL reward, hasCompletedDailyGoalsOnce
- Kaptan Tavsiyesi suggestion logic (sadece görsel container değişir, içeriği üreten kod aynı kalır)
- Marina rest +30/+30/+20/+10 ve repair -250 TL/+35 mekaniği
- Event log pushLog mantığı
- Resource state'leri (energy, water, fuel, boatCondition)
- save/load

SONRA:
1. npm run build başarılı
2. Test: yeni başlamış oyunda first fold'da quest card görünür mü; daily goal tamamlandığında flash; accordion'lar açılıp kapanıyor mu; "Sıradaki Hamle" tap'ı doğru tab'a gidiyor mu
3. Değişen dosya özeti
4. Push YAPMA, commit: "feat(hub): redesign Liman tab with hero boat, status strip, quest stack, accordion services"

Şüphede sor.
```

---

### Batch 4 — Rota + Sea Mode

| Alan | İçerik |
|---|---|
| **ID** | B4-VOYAGE |
| **Amaç** | Rotayı destinasyon hissettir, sea mode'u "denizdeyim" hissettir |
| **Kapsam** | Rota tab (journey arc, route hero, readiness accordion), Sea mode (voyage arc, boat hero, slim resource row, decision modal) |
| **Etkilenen ekranlar** | HUB > Rota tab, SEA_MODE |
| **Muhtemel dosyalar** | `src/components/RotaTab.tsx`, `src/components/SeaModeTab.tsx`, opsiyonel yeni `src/components/voyage/JourneyArc.tsx`, `RouteHeroCard.tsx`, `SeaDecisionModal.tsx`, `src/App.css` |
| **Yapılacak işler** | (1) Rota: 17 dot journey arc üstte, current route hero card, readiness 6 mini icon row + accordion detail, sonraki destinasyon peek; CTA "Rotaya Çık" hazırsa primary, eksikse "Tekneyi Hazırla" → Tekne tab; (2) Sea mode: voyage arc top, boat hero büyüt + bob, route pair chip ("Marmaris ↣ Yunan"), slim resource row, critical banner sticky, sea event history accordion, "Bir Gün İlerle" tek büyük CTA; (3) Decision event: full-screen modal, glass card, event title + story + 2 choice + effect preview chips |
| **Dokunulmaması gereken** | Route order, route requirements, readiness comparison logic, voyageDaysRemaining advance, resource drain formülü, decision event logic ve effect uygulaması, %30 trigger probability |
| **Risk** | Orta (3 component değişimi + yeni decision modal) |
| **Test checklist** | Journey arc 17 dot doğru render (tamamlanmış/current/kalan); readiness eksikse CTA "Tekneyi Hazırla"ya döner; sea mode'da advance day → resource drain anim; decision event %30 ihtimalle modal açılır, choice seçimi etkileri uygular ve modal kapanır |
| **Acceptance** | Rota CTA dinamik; sea decision modal açıkken arka plan etkileşimi engellenir |
| **Commit mesajı** | `feat(voyage): redesign Rota tab and Sea mode with journey arc, hero card, decision modal` |

**Claude Code prompt:**
```
Yelkenli Yaşam Tycoon için Batch 4 — Rota + Sea Mode redesign'ı uygula.
Batch 1, 2, 3 merge edilmiş olmalı.

ÖNCE: git status temiz, npm run build başarılı.

SADECE BATCH 4 KAPSAMI (master spec section 3.8 ve 3.9):
- src/components/RotaTab.tsx: journey arc (17 dot horizontal: gold filled completed, cyan glow current, muted remaining), route hero card (destination illustration placeholder + pin + risk pill + duration chip + feeling quote 2 satır + 3 mikro stat row), readiness status row (6 mini ✓/✗ icon + status pill) + accordion detail, next route peek, CTA dinamik (hazır → "Rotaya Çık" primary; eksik → "Tekneyi Hazırla" secondary tıklanınca tab="tekne")
- src/components/SeaModeTab.tsx: voyage progress arc top (gün gün dot), boat hero büyüt (200-240px) + bob anim, route pair chip, slim resource row (4 chip, kritikse pulsing red), critical banner sticky, "Bir Gün İlerle" tek primary CTA, sea event history accordion default kapalı
- Yeni src/components/voyage/SeaDecisionModal.tsx: full-screen overlay + glass card + title + description + 2 choice button + effect chips (-200 TL, +10 fuel vb visual chips). Modal açıldığında pendingDecisionId state'ini kullanır, choice seçimi mevcut handler'ı çağırır

DOKUNMA:
- Route order (currentRouteId akışı, completedRouteIds)
- Route requirements ve readiness comparison (6 stat vs required)
- voyageDaysRemaining advance day logic, resource drain formülü
- Decision event %30 trigger probability ve effect uygulaması
- Achievement / world progress / arrival transition

SONRA:
1. npm run build başarılı
2. Test: journey arc 17 dot doğru renklerle; readiness eksikken CTA "Tekneyi Hazırla" diyor ve Tekne tab'a gidiyor; sea mode'da advance day çalışır, decision event tetiklendiğinde modal açılır; choice ile etkiler uygulanır
3. Değişen dosya özeti
4. Push YAPMA, commit: "feat(voyage): redesign Rota tab and Sea mode with journey arc, hero card, decision modal"

Şüphede sor. Decision logic kodunu yeniden yazmaya kalkma — sadece görseli değişir.
```

---

### Batch 5 — Arrival + Reward + Notification System

| Alan | İçerik |
|---|---|
| **ID** | B5-CELEBRATION |
| **Amaç** | Her milestone gerçek kutlama; 3-tier notification sistemi |
| **Kapsam** | Arrival takeover, level-up celebration modal, daily 3/3 celebration, achievement unlock celebration, 3-tier toast (ambient/milestone/celebration) |
| **Etkilenen ekranlar** | ARRIVAL_SCREEN, global notification katmanı, level-up moment, daily goals 3/3 moment |
| **Muhtemel dosyalar** | `src/App.tsx` (ARRIVAL_SCREEN render + toast container), opsiyonel yeni `src/components/celebrations/ArrivalTakeover.tsx`, `CelebrationModal.tsx`, `NotificationToast.tsx`, `src/App.css` |
| **Yapılacak işler** | (1) ARRIVAL_SCREEN: full-screen takeover, confetti particles, port hero + pin, count-up reward tile (credits + followers), journey arc gold pin animation, next route peek, "Limana Dön" CTA; (2) Level-up: yeni `useEffect` çağrısı captainLevel artışını yakalar (mevcut state değişikliği üzerinden) ve celebration modal tetikler (yeni level + bonus credits + tap-to-dismiss); (3) Daily 3/3: existing dailyRewardClaimed=true transition'ında celebration modal; (4) Achievement unlock: mevcut toast yerine celebration moment (1.5s mini modal); (5) Toast component'i 3 tier'a ayır: pushToast çağrılarına `tier` opsiyonel parametre eklenir, default tier 1 (ambient pill alt-merkez), tier 2 (milestone banner üst), tier 3 (celebration modal); pushToast call-site'lar değişmez, sadece pushToast içinde tip seçimi |
| **Dokunulmaması gereken** | handleArrival logic (XP +80, credits, followers, route ID transition, daily goal complete_route), captain XP threshold ve level hesabı, daily 3/3 +2.500 TL logic, achievement unlock condition'ları, mevcut pushToast call site'lar |
| **Risk** | Orta-yüksek (toast altyapı değişikliği + 4 yeni celebration moment) |
| **Test checklist** | Route complete → arrival takeover; level-up → celebration modal görünür ve credits bonus uygulanır (mevcut logic); daily 3/3 → celebration; achievement unlock → 1.5s celebration; toast'ların tier'ı doğru (content done = ambient, sponsor offer = milestone, level-up = celebration) |
| **Acceptance** | Hiçbir ödül anı sıradan toast'a düşmez; arrival ekranı sayıları count-up; mobile safe area'da toast pozisyonu doğru |
| **Commit mesajı** | `feat(celebration): add 3-tier notification system, arrival takeover, level-up and milestone moments` |

**Claude Code prompt:**
```
Yelkenli Yaşam Tycoon için Batch 5 — Arrival + Reward + Notification System uygula.
Batch 1-4 merge edilmiş olmalı.

ÖNCE: git status temiz, npm run build başarılı.

SADECE BATCH 5 KAPSAMI (master spec section 3.10, 3.14, 3.15):

1. ARRIVAL_SCREEN: src/App.tsx içindeki ARRIVAL_SCREEN render bloğunu yeni `<ArrivalTakeover />` component'ı ile değiştir
   - src/components/celebrations/ArrivalTakeover.tsx: full-screen takeover, confetti particles (CSS keyframes), port hero + gold pin + name, feeling quote, reward count-up tile (credits + followers), journey arc gold pin animation, next route peek, "LİMANA DÖN" CTA
   - Count-up: 0'dan hedefe 1.2s easeOut animasyon (basit JS interval veya CSS counter)

2. Notification 3-tier:
   - src/components/celebrations/NotificationToast.tsx: ToastItem'a opsiyonel `tier?: 'ambient' | 'milestone' | 'celebration'` ekle (varsayılan 'ambient')
   - Tier 1 (ambient): slim pill, alt-merkez fixed (bottom safe area + 16px), 2.5s
   - Tier 2 (milestone): full-width banner, üst, 3.5s
   - Tier 3 (celebration): half-screen modal, glow, 4s veya tap-to-dismiss
   - pushToast call site'larda mevcut tip parametresine bakarak tier mapping: upgrade/sponsor → milestone, achievement → celebration, content/voyage/sea_decision → ambient (mevcut tip değerleri korunur, sadece tier hesabı eklenir)

3. Level-up celebration:
   - Mevcut captainLevel artışını yakalayan useEffect içine, level değişimi tespit edildiğinde pushToast({type:'celebration', tier:'celebration', title:`Seviye ${newLevel}`, body:`+${newLevel*500} TL bonus`}) ekle
   - Mevcut +newLevel*500 TL bonus ve event log push'u dokunma

4. Daily 3/3 celebration: dailyRewardClaimed=true olduğu yerde pushToast tier:'celebration', title:'Günlük 3/3 ✓', body:'+2.500 TL' ekle

5. Achievement unlock: mevcut achievement toast'ı tier:'celebration' olarak işaretle

DOKUNMA:
- handleArrival fonksiyon logic (XP, credits, followers, transition)
- captain XP threshold tablosu, level hesaplama
- daily goal 3/3 logic (+2.500 TL bonus)
- achievement unlock condition'ları
- pushToast'ın call-site'larındaki mevcut argümanlar (sadece tier eklenir, tip değişmez)
- save/load

SONRA:
1. npm run build başarılı
2. Manual test: route complete (kısa rotada test et) → arrival takeover; XP'ye yeterli content üret → level-up celebration; daily goal'leri tamamla → 3/3 celebration; ilk content → achievement celebration
3. Değişen dosya özeti
4. Push YAPMA, commit: "feat(celebration): add 3-tier notification system, arrival takeover, level-up and milestone moments"

Şüphede sor.
```

---

### Batch 6 — İçerik + Sponsor

| Alan | İçerik |
|---|---|
| **ID** | B6-CONTENT-SPONSOR |
| **Amaç** | İçerik üretimini akıcı bir döngü hissettir, cooldown'u durum yap, sponsor'u kariyer hissettir |
| **Kapsam** | İçerik tab (üret/cooldown/result), sponsor sub-tab (tier hero, offer cards, otomatik check) |
| **Etkilenen ekranlar** | HUB > İçerik tab |
| **Muhtemel dosyalar** | `src/App.tsx` (renderIcerikTab inline), opsiyonel yeni `src/components/content/ContentTab.tsx`, `SponsorTab.tsx`, `CircularTimerCard.tsx`, `QualityGauge.tsx`, `OfferCard.tsx`, `src/App.css` |
| **Yapılacak işler** | (1) Sub-tab segmented control (Üret/Sponsorluklar); (2) Üret modu: career mini-strip + 4 platform tile (2x2) + content type chip strip (matchli olanlar gold border) + büyük ÜRET CTA; (3) Cooldown modu: ÜRET CTA yerine circular timer card (countdown + ambient illustration); (4) Result modu: full-card celebration — quality gauge (yarım daire), platform+type chip, gain row, viral overlay, comment quote, secondary "Yeni İçerik Üret"; (5) Sponsor sub-tab: tier hero card, tier progress path (5 nokta), otomatik offer check (mevcut "Teklifleri Kontrol Et" buton kaldırılır, fonksiyon her render'da useEffect ile çağrılır — eğer mevcut logic her zaman çağrılmaya uygunsa; değilse buton "Yenile" şeklinde ghost'a iner), offer card list, accepted badges grid |
| **Dokunulmaması gereken** | Content quality formülü (base + skill + match + upgrade + location + variance), cooldown 30 dk timer, viral chance, platform multipliers, sponsor tier requirements, brand trust accumulation, saturation warning her 3'te 1 logic, accepted sponsor name persistence |
| **Risk** | Orta (renderIcerikTab oldukça büyük inline blok; "Teklifleri Kontrol Et" pattern değişimi dikkatli) |
| **Test checklist** | Cooldown sırasında üret yerine timer card; result sonrası "Yeni İçerik Üret" reset; viral content gold overlay; sponsor tier doğru tier hero'ya yansır; offer accept brand trust artırır; her 3'te 1 saturation warning toast'ı düşer |
| **Acceptance** | "Teklifleri Kontrol Et" buton kaldırıldı veya secondary'a indi; cooldown durum, hata değil; result celebration |
| **Commit mesajı** | `feat(content-sponsor): redesign Içerik tab cooldown/result and Sponsor tier hero, auto-check offers` |

**Claude Code prompt:**
```
Yelkenli Yaşam Tycoon için Batch 6 — İçerik + Sponsor redesign'ı uygula.
Batch 1-5 merge edilmiş olmalı.

ÖNCE: git status temiz, npm run build başarılı.

SADECE BATCH 6 KAPSAMI (master spec section 3.7 ve 3.11):

1. İçerik tab (sub-tab "Üret"):
   - src/App.tsx içindeki renderIcerikTab fonksiyonunu ya yeni komponentlere böl ya da yerinde rewrite et
   - Üret modu: career mini-strip (followers + sponsor next-tier progress) → 4 platform tile (2x2 grid) → seçilince content type chip strip reveal (match olanlar gold border) → "İÇERİK ÜRET" primary CTA
   - Cooldown modu (lastContentAt && Date.now() - lastContentAt < 30dk): ÜRET CTA yerine yeni `<CircularTimerCard />` (200x200 daire timer + countdown text + "Mola anı" copy)
   - Result modu (contentResult var): yeni `<QualityGauge />` (yarım daire 0-100), platform+type chip, gain row (count-up), viral overlay (gold burst), comment quote, "Yeni İçerik Üret" secondary

2. Sponsor sub-tab:
   - Tier hero card (current tier ikonu + ring + tier name + sub)
   - Tier progress path (5 nokta horizontal: micro→global, current glow)
   - Brand trust mini-stat chip
   - Offer auto-check: useEffect içinde sub-tab "sponsor" aktifken her render veya 30sn'de mevcut "Teklifleri Kontrol Et" handler'ı çağır (logic değiştirme, sadece tetik yerini değiştir). Manual buton kaldır VEYA "Yenile" şeklinde ghost olarak indirile
   - Offer card list (her teklif: brand logo placeholder + name + tier chip + reward range + "İmzala" primary)
   - Accepted sponsors badge grid (2-col)
   - Empty state: "X takipçi sonra yeni teklifler"

DOKUNMA:
- Content quality formula (base 40 + skill*5 + match +10 + platform/type combo +10 + upgradeContentBonus + location + variance ±)
- Content cooldown 30 dk (CONTENT_COOLDOWN_MS)
- Platform multipliers (viewTube 1.5/1.0, clipTok 0.8/1.8, instaSea 1.1/1.3, facePort 1.0/1.1)
- Viral chance ve viral effect (×3 followers, ×2 credits)
- CONTENT_COMMENTS comment seçim logic
- Sponsor tier requirements (followers + brand trust thresholds)
- Brand trust accumulation, saturation warning her 3'te 1
- acceptedSponsors persistence

SONRA:
1. npm run build başarılı
2. Test: bir içerik üret → result celebration → cooldown timer → 30dk geçince üret tekrar açık (timer manuel test için zorlanabilir mi diye lastContentAt'i kısaltmadan); sponsor sub-tab açıldığında otomatik offer check çalışır; offer accept → brand trust artar
3. Değişen dosya özeti
4. Push YAPMA, commit: "feat(content-sponsor): redesign Içerik tab cooldown/result and Sponsor tier hero, auto-check offers"

renderIcerikTab inline kalabilir, mecbur değilse komponent çıkarmak için JSX'i bölme. Şüphede sor.
```

---

### Batch 7 — Tekne + Kaptan + Achievements

| Alan | İçerik |
|---|---|
| **ID** | B7-PROFILE-UPGRADES |
| **Amaç** | Upgrade akışını öncelikli, kaptan profilini gurur ekranı yap |
| **Kapsam** | Tekne tab (boat hero, install priority card, top 4 priority categories, condensed cards), Kaptan tab (hero portresi, career arc, achievement grid + unlock modal) |
| **Etkilenen ekranlar** | HUB > Tekne tab, HUB > Kaptan tab |
| **Muhtemel dosyalar** | `src/App.tsx` (renderTekneTab inline), `src/components/KaptanTab.tsx`, opsiyonel yeni `src/components/upgrades/InstallProgressCard.tsx`, `UpgradeCardCondensed.tsx`, `src/components/captain/AchievementBadge.tsx`, `AchievementDetailModal.tsx`, `CareerGoalArc.tsx`, `src/App.css` |
| **Yapılacak işler** | (1) Tekne tab: boat hero + "X/27 upgrade" + master readiness bar + 4 mini stat chip; install in progress varsa priority card top'ta (circular timer); kategori bar top 4 priority chip + chevron "Tümü" (modal); upgrade card condensed (icon + name + cost + 2-3 effect badge + AL); tap'le expand description + strategy hint + warning/error badge'ler; (2) Kaptan tab: hero portresi + name + tagline + rank chip; career strip (Lvl/XP/Routes); 2 career goal arc yan yana (Dünya Turu, 1M Followers); 6 skill row (yıldız + bar); achievements showcase 3-col badge grid (kilit silhouette/açık gold), tap → detail modal |
| **Dokunulmaması gereken** | Upgrade install timer (installDays × 30 min, tek seferde 1 upgrade), purchasedUpgradeIds persistence, effect uygulanması (energy/water/boatCondition + diğer derived stat'lar), upgrade compatibility/marina req kontrolleri, captain rank tablosu, XP threshold, achievement unlock condition'ları |
| **Risk** | Orta (renderTekneTab + KaptanTab ikisi birden) |
| **Test checklist** | Upgrade satın alma → install timer üstte; install bitince effect uygulanır + toast tier; kategori bar top 4 dinamik priority (eğer logic varsa, yoksa sabit 4); kaptan tab 13 achievement doğru lock/unlock state; achievement tap → detail modal açılır |
| **Acceptance** | Upgrade card collapsed default, expand smooth; achievement badge görsel ayrımı (kilitli/açık) net |
| **Commit mesajı** | `feat(profile-upgrades): redesign Tekne tab condensed cards and Kaptan tab career arcs and achievement grid` |

**Claude Code prompt:**
```
Yelkenli Yaşam Tycoon için Batch 7 — Tekne + Kaptan + Achievements redesign'ı uygula.
Batch 1-6 merge edilmiş olmalı.

ÖNCE: git status temiz, npm run build başarılı.

SADECE BATCH 7 KAPSAMI (master spec section 3.12 ve 3.13):

1. Tekne tab (src/App.tsx renderTekneTab inline):
   - Boat hero (220px) + "X/27 upgrade tamamlandı" sub
   - Master Ocean Readiness bar (geniş)
   - 4-stat mini chip row (Enerji/Su/Güvenlik/Navigasyon)
   - InstallProgressCard conditional: upgradeInProgress varsa top'ta priority card (circular timer + upgrade icon + name + "X dk kaldı")
   - Kategori bar: top 4 priority chip (eğer dinamik priority hesabı yoksa, sabit ilk 4 kategori) + chevron "Tümü" (10 kategori modal)
   - Upgrade card condensed: icon + name + cost + 2-3 effect badge + AL button; tap'le expand → description + strategy hint + warning/error badges (mevcut conditional badge logic'leri korunur)

2. Kaptan tab (src/components/KaptanTab.tsx):
   - Hero: kaptan portresi (180px, captain-card stilinde) + name + tagline + rank chip (gold)
   - Career strip: 3 büyük number (Lvl X, XP bar, Routes Y/17)
   - 2 career goal arc yan yana (CareerGoalArc 140x140): Dünya Turu (worldProgress%), 1M Followers (followers/10000 capped 100%)
   - 6 skill row (yıldız + glow bar)
   - Achievements showcase: "Başarı Yolculuğu" + "X/13 rozet" + 3-col badge grid (AchievementBadge: açık gold filled glow, kilitli silhouette + lock icon overlay)
   - Achievement badge tap → AchievementDetailModal (title + description + unlock condition + status)
   - Event log accordion default kapalı

DOKUNMA:
- Upgrade install timer (installDays × 30 min), upgradeInProgress state
- purchasedUpgradeIds persistence
- Effect uygulanması (effects.energy/water/boatCondition immediate %, diğerleri derived)
- Upgrade compatibility per boat, marina requirement display
- Captain rank tablosu (level → rank), XP threshold tablosu
- 13 achievement unlock condition'ları
- save/load

SONRA:
1. npm run build başarılı
2. Test: bir upgrade satın al → install timer üstte; install simulasyonu için bekleme yerine state'i manuel kontrol et; kaptan tab açıldığında 13 achievement doğru lock/unlock state; bir badge tap → detail modal
3. Değişen dosya özeti
4. Push YAPMA, commit: "feat(profile-upgrades): redesign Tekne tab condensed cards and Kaptan tab career arcs and achievement grid"

Şüphede sor.
```

---

### Batch 8 — Final Mobile Polish

| Alan | İçerik |
|---|---|
| **ID** | B8-POLISH |
| **Amaç** | Cross-cutting iyileştirmeler, mobile cilalama, ayarlar modal'ı |
| **Kapsam** | SVG icon set (emoji'lerin yerine), bottom nav badge sistemi, safe area handling, touch target audit, ayarlar modal, sound toggle (opsiyonel), responsive testler |
| **Etkilenen ekranlar** | Tüm ekranlar (cross-cutting) |
| **Muhtemel dosyalar** | `public/icons.svg` (sprite), `src/components/Icon.tsx` (yeni icon component), `src/components/HubScreen.tsx` (bottom nav), `src/components/SettingsModal.tsx` (yeni), `src/App.css` (safe area, touch targets), Capacitor config `android/` (status bar, navigation bar) |
| **Yapılacak işler** | (1) SVG icon sprite + `<Icon name="anchor" />` component, tüm emoji kullanımlarını değiştir (bottom nav, achievement badges'in "🏅" hariç olabilir); (2) Bottom nav notification badge: tab başına gold dot eğer aksiyon varsa (sponsor offer var, upgrade complete var ama görülmemiş, level-up oldu ama dismissed değil, decision pending, daily goal item completable); (3) safe-area-inset CSS kullanımı (Android navigation bar overlap fix); (4) Tüm touch target'leri 44x44 minimum doğrula, gerekirse padding ekle; (5) Settings modal: top corner shortcut → modal aç, sound toggle (opsiyonel implement), haptic toggle (opsiyonel), save'i sıfırla (double confirm, kırmızı destructive); (6) 360x800 ve 390x667 manuel test; (7) Stagger card entrance animasyonları konsistans; (8) Ambient sea loop sound (opsiyonel, mute default) |
| **Dokunulmaması gereken** | save/load (export/reset opsiyonel ama "sıfırla" double confirm zorunlu), tüm logic, ekonomi |
| **Risk** | Düşük (cross-cutting cosmetic) |
| **Test checklist** | Tüm tab'larda emoji kalmamış; bottom nav badge'leri doğru tetiklenir; 360x800 + 390x667 + iPhone safe area + Android nav bar safe area; ayarlar modal açılır/kapanır; sıfırla double confirm |
| **Acceptance** | Hiçbir emoji tab icon olarak kalmamış; tüm touch target ≥44x44; safe area Android'de doğru |
| **Commit mesajı** | `chore(polish): SVG icons, bottom nav badges, safe area, settings modal, mobile polish` |

**Claude Code prompt:**
```
Yelkenli Yaşam Tycoon için Batch 8 — Final Mobile Polish uygula.
Batch 1-7 merge edilmiş olmalı.

ÖNCE: git status temiz, npm run build başarılı.

SADECE BATCH 8 KAPSAMI (master spec section 3.16, 3.17, ve genel polish):

1. SVG icon sprite:
   - public/icons.svg sprite oluştur (anchor, compass, sail, wave, lighthouse, captain-hat, camera, route-map, wrench, trophy, handshake, shop, star, settings, home, content, route, boat, captain — gerekli tüm icon'lar)
   - src/components/Icon.tsx: <Icon name="anchor" size={24} /> tarzı reusable component
   - Bottom nav'da emoji (🏠 📹 🗺️ 🔧 👤) → <Icon /> ile değiştir
   - Diğer emoji kullanımları (UI'daki tab icon ve action button icon'lar) → SVG. ⚓ gibi anchor metin emoji'leri kalabilir butonların text içinde, ama tab/header icon'larda SVG.

2. Bottom nav notification badge:
   - HubScreen.tsx içindeki bottom nav'a tab başına opsiyonel gold dot
   - Trigger logic: sponsorOffers.length > 0 → İçerik tab; upgradeInProgress null AND son install completed UI'da görülmedi → Tekne tab; pending decision → Sea mode'da Liman tab pulse; daily goal completable bir görev varsa → Liman tab
   - "Görüldü" state'i için minimal local state (kalıcı save'e yazma — silent dismiss tab'a girilince)

3. Safe area:
   - src/App.css: env(safe-area-inset-*) kullanımı (top, bottom, left, right)
   - Bottom nav'da safe-area-inset-bottom padding
   - Status bar'da safe-area-inset-top padding
   - index.html viewport meta'da viewport-fit=cover

4. Touch target audit:
   - Tüm buton, link, tab, chip min 44x44 — gerekirse padding ekle
   - Özellikle: pagination dot'lar, accordion chevron'lar, achievement badges, kategori chip'leri

5. Settings modal:
   - src/components/SettingsModal.tsx: backdrop blur + glass card
   - İçerik: sound toggle (opsiyonel — implement etme, sadece UI hazır), haptic toggle (opsiyonel), versiyon info, "Save'i Sıfırla" destructive button (red border, double confirm: "Emin misin?" → "Geri alınamaz, sil")
   - Main menu corner shortcut'tan ve Kaptan tab'tan açılır
   - Sıfırla logic: localStorage.removeItem('yelkenli_save') + window.location.reload()

6. Stagger entrance animations:
   - Card stack'lerde her card 60-100ms delay ile fade-in/slide-up (tüm hub tab'larında)
   - Halihazırda var olan animasyonları bozma, sadece tutarlılık ekle

7. Capacitor android (eğer Android workflow aktifse):
   - StatusBar plugin: setStyle Dark, setBackgroundColor #06182c
   - NavigationBar: setBackgroundColor matching theme

DOKUNMA:
- save/load logic (sıfırla butonu sadece localStorage clear + reload, başka touch yok)
- ekonomi
- Tüm game state ve mekanikler

SONRA:
1. npm run build başarılı
2. Test: 360x800 ve 390x667 viewport'larda manuel görsel kontrol; bottom nav badge'leri ilgili durumda görünür; ayarlar açılır/kapanır; sıfırla double confirm; emoji kalmamış (achievement chip text'leri hariç)
3. Değişen dosya özeti + bundle size farkı
4. Push YAPMA, commit: "chore(polish): SVG icons, bottom nav badges, safe area, settings modal, mobile polish"

SVG icon'ları sıfırdan illustrasyon yapmak yerine basit line+fill stroke 2 kullan. Şüphede sor.
```

---

## 6. FINAL PROFESSIONAL RECOMMENDATION

### 6.1 Hangi Batch ile Başlamalısın?

**Batch 1 — Global Visual Foundation. Tartışmasız.**

Sebebi: token sistemi yoksa diğer batch'lerin çıktıları tutarsız olur, tekrar elden geçirmek gerekir. Batch 1 saf CSS + 1 wrapper component olduğu için riski en düşük olan ama sonraki tüm batch'lerin verimini en çok artıran iştir. **2 saatlik iş, 60 saatlik kazanç.**

Batch 1'den sonra önerilen sıra:
1. **B1** (foundation) — yapılmadan diğerleri tutarsız olur
2. **B5** (celebration + 3-tier toast) — mevcut oyunun en hissedilen UX boşluğu (level-up'ın görünmez olması, arrival ekranının düz olması). Gameplay zaten çalışıyor, sadece duygu eksik.
3. **B3** (hub) — günlük oyun deneyiminin en çok yaşanan ekranı; "ne yapacağım belli değil" sorununu çözer
4. **B2** (onboarding) — first impression; ama mevcut oyuncuyu etkilemez, sadece yeni player için
5. **B4** (voyage) — sea mode'a immersion getirir
6. **B6** (içerik + sponsor) — cooldown'u durum yapar, en sık tekrarlanan döngüyü iyileştirir
7. **B7** (tekne + kaptan) — kariyer ekranı gururu
8. **B8** (polish) — son cila

### 6.2 En Yüksek Etki / En Düşük Risk 3 Değişiklik

1. **3-tier notification + level-up celebration** (Batch 5'in alt kümesi): Mevcut tek-tier toast yapısına `tier` parametresi eklemek + level-up'ı yakalamak en az 4 saatlik iş, ama "oyun beni umursuyor" hissini bir gecede ekler. Risk düşük çünkü mevcut pushToast call-site'larına dokunulmuyor.

2. **Status strip "Sıradaki Hamle" pill** (Batch 3'ün küçük parçası): "Kaptan Tavsiyesi" suggestion logic'ini status strip'e taşıyıp pulse glow eklemek. Mevcut algoritmayı kullanır, sadece konum + görsel değişir. "Şimdi ne yapayım" sorusunu kalıcı olarak çözer. Risk minimal.

3. **Cooldown circular timer card** (Batch 6'nın küçük parçası): "30 dk sonra tekrar üret" disabled buton text'ini büyük circular timer card'a yükseltmek. Mevcut cooldown logic'ine dokunmadan, durumu ödüle çevirir. Player oyuna dönmek için bekler.

Bu 3'ünü tek bir hibrit batch olarak yapabilirsin — toplam ~6-8 saat iş, ama oyunun "feel"ini %40 değiştirir.

### 6.3 Şimdilik Kesinlikle Değiştirmemen Gerekenler

- **Save migration mantığı** (`migrateSave`, version 2 → 3 atlama). Yeni state field'ı eklemek istersen önce migration path'i planla.
- **Ekonomi sabitleri**: STARTING_BUDGET 150.000, boat costs (35k/60k/85k), sponsor tier thresholds, content quality formülünün katsayıları, route reward multiplier'ları, daily 3/3 = 2.500 TL, level-up = level × 500 TL. **Hiçbiri test edilmeden değişmez** — balance fragile.
- **Route order ve world progress %**: 17 route'un sırası ve worldProgressPercent değerleri "Atlantik Kaptanı" ve "Dünya Turu Kaptanı" achievement'larına bağlı. Sırayı değiştirme.
- **Content cooldown 30 dk**: Bu süre tüm session economy'sinin temposunu belirliyor. Kısaltma/uzatma testi ayrı analiz işidir.
- **Sea decision %30 trigger**: Bu olasılık voyage süresini ve XP/risk dengesini kuruyor.
- **3-stat upgrade efficacy**: Mevcut upgrade effect'leri readiness penalty + resource drain ile entegre. Yeni effect ekleme/çıkarma yok.

### 6.4 Hedef Görsellerde Uygulamadan Önce Düzeltilmesi Gereken Tutarsızlıklar

Görselleri tek tek inceledim, şu noktalarda görsel-kod mismatch riski var:

1. **Image 1 (Main Menu) — "47.000 KAPTAN" hardcoded.** Brief'te de bu sayı sahte. Ya gerçek bir source'a (Anthropic API'den server-side endpoint'le, veya basit GitHub-hosted JSON ile) bağla, ya da pill'i "Topluluğumuz büyüyor" gibi pasif metne çevir. Sahte sayı uzun vadede güveni sarsar.

2. **Image 2 (Captain Selection) — Görselde sadece 1 kaptan ve "STEP 1/5" var ama brief'te 6 captain profile.** Carousel olduğunu, swipe'la 6 profil arasında geçildiğini görsel olarak ima etmek için alt 6 dot pagination şart. Tek kart ekranında 6 seçenek olduğu duyurulmazsa player tek kaptan olduğunu sanır.

3. **Image 3 (Marina) — Harita üzerinde "PREMIUM" badge'leri var ama brief'te marinaların premium/free ayrımı belirtilmemiş.** Eğer "PREMIUM" oyun-içi para veya gerçek-para konsepti değilse, bu badge yanlış beklenti üretir. Önerim: "PREMIUM" → "ÖNERİLEN" veya kaldır. Brief'teki gerçek "recommended for profile" mantığını kullan.

4. **Image 4 (Boat Selection) — Sağ alttaki "MAĞAZA" trophy butonu.** Mağaza henüz yok (brief'te yok). Bu element ya kaldırılır ya da Batch 8'de gerçek mağaza ekranına bağlanır. Şimdilik koyma.

5. **Image 4 (Boat) — "Yüksek emek, düşük giriş maliyeti" copy gold renkte.** Bu çok iyi bir copy paterni ama brief'teki boatClassMeta.tone field'ında bu tarzda kısa tagline var mı kontrol etmek gerek. Yoksa, her boat için tagline data'sı yazılmalı (game-data/boats.ts veya src/data/boats.ts'de).

6. **Image 5 (Naming) — "Tekneyi Adlandır" üstündeki büyük geometric boat ikonu mevcut SVG asset'le eşleşmeyebilir.** Mevcut hub'daki boat SVG ile naming ekranındaki ikon farklı tarzlardaysa kalibre edilmeli — tek bir boat illustrasyon dili (geometrik+cyan+anchor) tüm oyunda kullanılmalı.

7. **Tüm görseller — Türkçe karakterler düzgün render olmuş** (ç, ğ, ı, ö, ş, ü). Web font seçiminde Latin Extended A subset'inin yüklendiğinden emin ol; Sora/Inter ikisinin de bu subset'i var, sorun yok.

8. **Görsellerde gold ve cyan ikisinin de yoğun kullanımı.** Bunu ekran bazlı disipline etmen lazım: bir ekranda gold dominant (varış, achievement) veya cyan dominant (sea, sea decision). İkisini eşit ağırlıkta her ekranda kullanırsan hiyerarşi kaybolur.

---

## Özet Karar

**Bu hafta:** Batch 1 (foundation) + Batch 5'in level-up + 3-tier toast alt kümesi. Toplam 8-12 saat iş, ölçülebilir his değişimi.

**Önümüzdeki 2 hafta:** Batch 3 (hub) + Batch 4 (voyage). Bu aşamada ana gameplay döngüsü premium hisseder.

**Sonraki ay:** Batch 2, 6, 7, 8 sırayla.

**Ekonomi sabitlerine ve mekanik logic'e dokunma. Bu redesign sadece duyguyu, hiyerarşiyi ve hissedilebilirliği değiştirir — sayıları değil.**

---

*Spec sonu. Her batch prompt'unu kopyala, Claude Code'a tek tek ver, batch tamamlandıktan sonra sonraki prompt'a geç. Bir batch tamamlanmadan diğerini başlatma. Build her batch sonunda yeşil olmalı.*
