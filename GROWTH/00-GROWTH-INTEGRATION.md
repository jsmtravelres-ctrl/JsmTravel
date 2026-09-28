# JSM TRAVEL — Growth Integration Pack

هذا الحِزم مبني مباشرة على متطلبات Growth الظاهرة في الصور المرفقة:

1. SEO فعلي
2. Hotel Discovery Engine
3. Conversion System
4. Content Growth
5. Organic + Social Funnel
6. Analytics & Optimization

## مبدأ التنفيذ
الموقع يجب أن يحوّل:
زيارة → صفحة منتج/فندق/رحلة → طلب عرض/حجز → Lead داخل CRM → متابعة → حجز.

## نقاط الربط المتوقعة
- GET /api/hotels?destination=...
- GET /api/hotels/:id
- POST /api/leads
- POST /api/events
- صفحات الفندق: /hotels/{slug}
- صفحات الوجهات: /destinations/{slug}
- صفحات العروض والرحلات: /offers/{slug}

إذا كانت أسماء الـAPI الحالية مختلفة، غيّرها في ملف الإعداد فقط ولا تغيّر واجهة المستخدم.
