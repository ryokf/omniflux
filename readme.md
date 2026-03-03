
# OmniFlux — Assets Aggregator

OmniFlux adalah platform untuk mengumpulkan, menormalisasi, dan menyelaraskan aset (mis. media dan metadata) dari berbagai sumber, sehingga memudahkan pencarian, manajemen, dan distribusi ke klien.

Arsitektur singkat:
- Backend API (Rust) di apps/api — menangani ingest, normalisasi, deduplikasi, penyimpanan, dan endpoint bagi klien.
- Mobile client (Flutter) di apps/mobile — antarmuka pengguna untuk browsing, sinkronisasi offline, dan pengelolaan aset.

Fitur utama:
- Pipeline ingest dan normalisasi otomatis
- Ekstraksi metadata, tagging, dan pencarian terpusat
- Sinkronisasi data dan dukungan mode offline pada perangkat mobile
- Ekspor dan integrasi ke layanan eksternal

Mulai cepat:
- Lihat [apps/api](apps/api) untuk petunjuk build dan menjalankan API.
- Lihat [apps/mobile](apps/mobile) untuk petunjuk menjalankan aplikasi Flutter.

Untuk detail desain dan alur, lihat dokumen Software Design Document (SDD) yang dilampirkan.

