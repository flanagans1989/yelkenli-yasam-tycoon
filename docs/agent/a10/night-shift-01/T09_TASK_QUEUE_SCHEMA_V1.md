# Yelkenli Yasam Tycoon Mobil Oyunu Gece Vardiyası Görev Kartı Şeması v1

## Task ID
- **Gerekli Alan**: Evet
- **Format**: `A10-TASK-XXXX`
- **Açıklama**: Gereksinimlerin veya özelliklerin benzersiz tanımlaması.

## Batch ID
- **Gerekli Alan**: Evet
- **Format**: `A10-BATCH-XX`
- **Açıklama**: Görevlerin gruplandırılacağı parti (batch) kimliği.

## Title
- **Gerekli Alan**: Evet
- **Açıklama**: Gereksinim veya özellik kısa ve açık tanımlaması.

## Goal
- **Gerekli Alan**: Evet
- **Açıklama**: Gereksinimin veya özelliğin hedefi ve beklenen etkisi.

## Task Type
- **Gerekli Alan**: Evet
- **Kanonik Değerler**: `docs-only`, `css-patch-proposal`, `css-patch-apply`, `script-only`, `build-check`, `audit/checklist`
- **Açıklama**: Görevin türüne göre belirlenir.

## Allowed Output File
- **Gerekli Alan**: Evet
- **Açıklama**: Görev tamamlandığında yazılacak dosya veya klasör konusunda belirlenir.

## Allowed Input Context
- **Gerekli Alan**: Evet
- **Açıklama**: Ajanın okuyabileceği kaynaklar konusunda belirlenir, örneğin `docs/`, belirli log kesimi, teknik notlar gibi.

## Forbidden Scope
- **Gerekli Alan**: Evet
- **Açıklama**: Dokunulmaması yasak alanlar veya klasörler konusunda belirlenir, örneğin `src/`, `scripts/`, `package*.json` ve mevcut gerekli dosyalar gibi.

## Agent Command Type
- **Gerekli Alan**: Evet
- **Kanonik Değerler**: `read-only`, `docs-write`, `proposal-only`
- **Açıklama**: Ajanın komut yürütmeyeceği davranışı belirtir.

## Validation Rule
- **Gerekli Alan**: Evet
- **Açıklama**: Görev tamamlanırken uygulanacak doğrulama kuralı veya kontrolü.

## Minimum Output Rule
- **Gerekli Alan**: Evet
- **Açıklama**: En az ihtiyaç duydugu çıktı koşulu belirlenir, genellikle en az 1 başlık + 3 madde + 1 örnek gibi.

## Soft Fail Rule
- **Gerekli Alan**: Evet
- **Açıklama**: Görev parial olarak tamamlanmadığında uygulanacak yumuşak hata kuralı veya kontrolü.

Bu şema, Yelkenli Yasam Tycoon mobil oyunu geliştirme projesi için gece vardiyası sırasında görevlerin nasıl tanımlanacağı ve yönetileceği konusunda önemli bir adım. Her alanda belirlenen kurallar ve gereklilikler, görevlerin doğru ve etkin bir şekilde işlenmesini sağlar.