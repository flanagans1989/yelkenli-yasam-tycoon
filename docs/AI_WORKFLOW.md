# AI İş Akışı Kılavuzu

## Amaç
Claude ile çalışırken token israfını önlemek ve bağlamı hızlıca kurmak için bu dokümanlar kullanılır. Her oturumda tüm kodu taramak yerine sadece ilgili dosyalar okunur.

## Oturum Başlangıcı
Her yeni konuşmada Claude şu dosyaları okumalıdır (bu sırayla):
1. `docs/PROJECT_CONTEXT.md` — mimari ve dosya yapısı
2. `docs/TASK_LIST.md` — mevcut görevler
3. İlgili kaynak dosyası (örn. `src/App.tsx`, `game-data/routes.ts`)

Tüm repo taranmamalıdır. Sadece göreve özel dosyalar açılmalıdır.

## Görev Başlamadan Önce
```
[ ] TASK_LIST.md okundu
[ ] İlgili oyun-data dosyası okundu (gerekiyorsa)
[ ] UI_RULES.md veya GAME_DESIGN_RULES.md okundu (UI/mekanik değişiklikse)
```

## Kod Değişikliği Kuralları
- **Küçük diff:** Sadece değişen satırları düzenle, tüm dosyayı yeniden yazma.
- **Kapsam dışı düzenleme yapma:** Görevle ilgisiz kod temizliği, yorum ekleme, refactor yapma.
- **Bağımsız fonksiyon:** Her yeni oyun mekaniği önce `game-data/` klasöründe tanımlanmalı, `App.tsx`'te yalnızca import ile kullanılmalı.
- **Build sonrası kontrol:** Kod değişikliğinin ardından `npm run build` çalıştır. Sadece docs değişikliklerinde çalıştırma.
- **package.json dokunma:** Yeni bağımlılık önerilmez. Mevcut stack yeterli.

## Dosya Sorumlulukları
| Değişiklik | Nereye dokun |
|---|---|
| Yeni tekne / marina | `game-data/boats.ts` veya `game-data/marinas.ts` |
| Yeni rota | `game-data/routes.ts` |
| Sponsor / ekonomi | `game-data/economy.ts` |
| Sosyal platform | `game-data/socialPlatforms.ts` |
| UI bileşeni | `src/App.tsx` + `src/App.css` |
| Oyun dengesi | ilgili `game-data/*.ts` dosyası |

## Prompt Şablonu (Kullanıcı için)
Yeni oturumda Claude'a şunu söyle:
```
docs/PROJECT_CONTEXT.md, docs/TASK_LIST.md ve docs/AI_WORKFLOW.md dosyalarını oku, ardından [görev] üzerinde çalış.
```

## Token Tasarrufu İpuçları
- Dosyayı tamamen okumak yerine ilgili satır aralığını belirt (örn. `Read offset:100 limit:50`)
- Büyük dosyalarda önce Grep ile sembol ara, sonra ilgili kısmı oku
- App.tsx büyük; renderLimanTab, renderSeaModeTab gibi fonksiyonlar için satır numarasıyla git
- Değişiklik küçükse Edit aracını kullan, Write'ı yalnızca yeni dosyalar için kullan

## Sık Kullanılan Semboller (App.tsx referans)
| Sembol | Yaklaşık Satır |
|---|---|
| Step type tanımı | ~17 |
| finalizeGame() | ~295 |
| advanceDay() | ~769 |
| handleProduceContentV2() | ~835 |
| renderLimanTab() | ~971 |
| renderSeaModeTab() | ~1018 |
| renderIcerikTab() | ~1055 |
| renderRotaTab() | ~1194 |
| renderTekneTab() | ~1222 |
| renderKaptanTab() | ~1320 |
