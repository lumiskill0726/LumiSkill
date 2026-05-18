# 🚀 LumiSkill SEO Guide — How to Rank on Google

## ✅ What Has Already Been Done (In Your Code)

### 1. Meta Tags & Keywords
- **50+ keywords** added including all brand variations:
  - `LumiSkill`, `Lumi Skill`, `LumiSkills`, `Lumi Skills`, `lumiskill.com`
- Keywords for searches like:
  - `best online coding classes India`
  - `coding for class 6 7 8 9 10 11 12`
  - `python course for students India`
  - `AI course for school students`
  - `live coding classes for kids India`

### 2. JSON-LD Structured Data (Helps Google understand your site)
- ✅ **WebSite schema** — Google sitelinks search box
- ✅ **EducationalOrganization schema** — Brand name + alternate names (Lumi Skill, LumiSkills)
- ✅ **CourseList schema** — All 8 courses with prices
- ✅ **FAQPage schema** — 6 common questions (shows as FAQ in Google results)
- ✅ **Per-Course schema** — Each course page has its own Course schema with ratings
- ✅ **BreadcrumbList schema** — Shows course path in Google results
- ✅ **Course FAQ schema** — Course-specific FAQs eligible for rich results

### 3. Technical SEO
- ✅ Sitemap at `/sitemap.xml` — All 21 pages indexed
- ✅ Robots.txt at `/robots.txt` — Configured correctly
- ✅ Canonical URLs — All lowercase `lumiskill.com`
- ✅ Open Graph — WhatsApp/Facebook previews
- ✅ Twitter Cards — Twitter previews

---

## 🔴 CRITICAL STEPS YOU MUST DO (Outside the Code)

### STEP 1: Deploy Your Website
Google cannot index `localhost:3001`. Your site MUST be live on the internet.
- **Best option:** Deploy to [Vercel](https://vercel.com) (free, made for Next.js)
  1. Push your code to GitHub
  2. Connect GitHub to Vercel
  3. Deploy in 2 minutes
- **Your domain:** Buy `lumiskill.com` from [GoDaddy](https://godaddy.com) or [Namecheap](https://namecheap.com) (~₹800/year)
- Point your domain to Vercel

### STEP 2: Google Search Console (MOST IMPORTANT)
This tells Google your site exists.
1. Go to [search.google.com/search-console](https://search.google.com/search-console)
2. Add your property: `https://www.lumiskill.com`
3. Verify ownership (HTML file method or DNS method)
4. After verification, go to **Sitemaps** → Submit `https://www.lumiskill.com/sitemap.xml`
5. Google will start indexing your pages within 1–7 days

**Add your verification code to `src/app/layout.js`:**
```js
verification: {
  google: 'YOUR_CODE_FROM_SEARCH_CONSOLE_HERE',
},
```

### STEP 3: Bing Webmaster Tools
1. Go to [bing.com/webmasters](https://bing.com/webmasters)
2. Submit your sitemap
3. Bing also drives traffic (especially in India via Microsoft Edge)

### STEP 4: Google My Business (For Local SEO)
1. Go to [business.google.com](https://business.google.com)
2. Create "LumiSkill" as an Online Business / Education
3. This helps you appear in Google Maps and local searches

---

## 📈 How Long Until You Rank?

| Search Query | Expected Time |
|---|---|
| `lumiskill` (brand name) | 1–2 weeks after deployment |
| `lumi skill` / `lumiskills` | 2–4 weeks |
| `online coding classes India` | 3–6 months (competitive) |
| `best coding academy class 6` | 2–4 months |
| `python course for students India` | 3–6 months |

> **Key insight:** Brand name searches (`lumiskill`, `lumi skill`) rank FAST (within weeks) once you submit to Search Console. Generic keywords take longer.

---

## 📣 Boost SEO Faster — Content Marketing

### Create a Blog (Add `/blog` to your Next.js site)
Blog posts rank for long-tail keywords that bring parents to your site.

**Suggested blog post titles:**
1. "Best Coding Languages for Class 6 Students in India 2025"
2. "Should My Child Learn Python or Java First?"
3. "How LumiSkill Teaches AI to Class 11 Students"
4. "10 Benefits of Online Coding Classes for School Students"
5. "What is DSA and Why Should Class 11–12 Students Learn It?"

### Social Media Signals
- Post reels on Instagram: `@lumiskill`
- Post on YouTube: Student project demos
- Share in parent WhatsApp groups
- Links FROM other sites TO yours = Google ranks you higher

---

## 🔧 Technical Optimizations Already Done

| Feature | Status |
|---|---|
| Meta titles & descriptions | ✅ All pages |
| Keywords (50+ terms) | ✅ Including brand variations |
| Open Graph / Twitter Cards | ✅ All pages |
| Canonical URLs (no duplicate content) | ✅ Lowercase |
| Sitemap.xml | ✅ 21 pages |
| Robots.txt | ✅ Configured |
| JSON-LD Schemas | ✅ 6 schema types |
| Mobile responsive | ✅ |
| Page speed (static generation) | ✅ SSG/SSR |
| HTTPS | ✅ After deployment |

---

## 📞 Quick Summary

1. **Deploy** → Vercel + buy `lumiskill.com` domain
2. **Search Console** → Submit sitemap → Google indexes you
3. **Brand searches** (`lumiskill`, `lumi skill`) will appear in 1–2 weeks
4. **Generic searches** take 3–6 months with regular content
5. **Blog + Social** = faster ranking

The SEO code is complete. Now focus on **getting the site live!** 🚀
