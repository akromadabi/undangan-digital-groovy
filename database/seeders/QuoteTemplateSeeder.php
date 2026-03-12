<?php

namespace Database\Seeders;

use App\Models\QuoteTemplate;
use Illuminate\Database\Seeder;

class QuoteTemplateSeeder extends Seeder
{
    public function run(): void
    {
        QuoteTemplate::truncate();

        $quotes = [
            // ═══════════════════════════════
            // ISLAM — 10 Ayat Al-Quran
            // ═══════════════════════════════
            ['religion' => 'islam', 'title' => 'QS. Ar-Rum: 21', 'sort_order' => 1,
             'ayat' => "وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُمْ مِنْ أَنْفُسِكُمْ أَزْوَاجًا لِتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُمْ مَوَدَّةً وَرَحْمَةً",
             'translation' => "Dan di antara tanda-tanda (kebesaran)-Nya ialah Dia menciptakan pasangan-pasangan untukmu dari jenismu sendiri, agar kamu cenderung dan merasa tenteram kepadanya, dan Dia menjadikan di antaramu rasa kasih dan sayang.",
             'source' => 'QS. Ar-Rum: 21'],

            ['religion' => 'islam', 'title' => 'QS. An-Nur: 32', 'sort_order' => 2,
             'ayat' => "وَأَنكِحُوا الْأَيَامَىٰ مِنكُمْ وَالصَّالِحِينَ مِنْ عِبَادِكُمْ وَإِمَائِكُمْ",
             'translation' => "Dan nikahkanlah orang-orang yang masih membujang di antara kamu, dan juga orang-orang yang layak (menikah) dari hamba-hamba sahayamu yang laki-laki dan perempuan.",
             'source' => 'QS. An-Nur: 32'],

            ['religion' => 'islam', 'title' => 'QS. Adz-Dzariyat: 49', 'sort_order' => 3,
             'ayat' => "وَمِن كُلِّ شَيْءٍ خَلَقْنَا زَوْجَيْنِ لَعَلَّكُمْ تَذَكَّرُونَ",
             'translation' => "Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).",
             'source' => 'QS. Adz-Dzariyat: 49'],

            ['religion' => 'islam', 'title' => 'QS. Yasin: 36', 'sort_order' => 4,
             'ayat' => "سُبْحَانَ الَّذِي خَلَقَ الْأَزْوَاجَ كُلَّهَا مِمَّا تُنبِتُ الْأَرْضُ وَمِنْ أَنفُسِهِمْ وَمِمَّا لَا يَعْلَمُونَ",
             'translation' => "Maha Suci (Allah) yang telah menciptakan semuanya berpasang-pasangan, baik dari apa yang ditumbuhkan oleh bumi dan dari diri mereka sendiri, maupun dari apa yang tidak mereka ketahui.",
             'source' => 'QS. Yasin: 36'],

            ['religion' => 'islam', 'title' => 'QS. An-Nisa: 1', 'sort_order' => 5,
             'ayat' => "يَا أَيُّهَا النَّاسُ اتَّقُوا رَبَّكُمُ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَخَلَقَ مِنْهَا زَوْجَهَا",
             'translation' => "Wahai manusia! Bertakwalah kepada Tuhanmu yang telah menciptakan kamu dari diri yang satu (Adam), dan (Allah) menciptakan pasangannya (Hawa) dari (diri)-nya.",
             'source' => 'QS. An-Nisa: 1'],

            ['religion' => 'islam', 'title' => 'QS. Al-Hujurat: 13', 'sort_order' => 6,
             'ayat' => "يَا أَيُّهَا النَّاسُ إِنَّا خَلَقْنَاكُم مِّن ذَكَرٍ وَأُنثَىٰ وَجَعَلْنَاكُمْ شُعُوبًا وَقَبَائِلَ لِتَعَارَفُوا",
             'translation' => "Wahai manusia! Sungguh, Kami telah menciptakan kamu dari seorang laki-laki dan seorang perempuan, kemudian Kami jadikan kamu berbangsa-bangsa dan bersuku-suku agar kamu saling mengenal.",
             'source' => 'QS. Al-Hujurat: 13'],

            ['religion' => 'islam', 'title' => "QS. Al-A'raf: 189", 'sort_order' => 7,
             'ayat' => "هُوَ الَّذِي خَلَقَكُم مِّن نَّفْسٍ وَاحِدَةٍ وَجَعَلَ مِنْهَا زَوْجَهَا لِيَسْكُنَ إِلَيْهَا",
             'translation' => "Dialah yang menciptakan kamu dari jiwa yang satu (Adam) dan darinya Dia menciptakan pasangannya, agar dia merasa senang kepadanya.",
             'source' => "QS. Al-A'raf: 189"],

            ['religion' => 'islam', 'title' => 'QS. Al-Furqan: 74', 'sort_order' => 8,
             'ayat' => "رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ وَاجْعَلْنَا لِلْمُتَّقِينَ إِمَامًا",
             'translation' => "Ya Tuhan kami, anugerahkanlah kepada kami pasangan kami dan keturunan kami sebagai penyenang hati (kami), dan jadikanlah kami pemimpin bagi orang-orang yang bertakwa.",
             'source' => 'QS. Al-Furqan: 74'],

            ['religion' => 'islam', 'title' => "QS. Ar-Ra'd: 38", 'sort_order' => 9,
             'ayat' => "وَلَقَدْ أَرْسَلْنَا رُسُلًا مِّن قَبْلِكَ وَجَعَلْنَا لَهُمْ أَزْوَاجًا وَذُرِّيَّةً",
             'translation' => "Dan sungguh, Kami telah mengutus beberapa rasul sebelum engkau (Muhammad) dan Kami berikan kepada mereka istri-istri dan keturunan.",
             'source' => "QS. Ar-Ra'd: 38"],

            ['religion' => 'islam', 'title' => 'QS. At-Tahrim: 6', 'sort_order' => 10,
             'ayat' => "يَا أَيُّهَا الَّذِينَ آمَنُوا قُوا أَنفُسَكُمْ وَأَهْلِيكُمْ نَارًا",
             'translation' => "Wahai orang-orang yang beriman! Peliharalah dirimu dan keluargamu dari api neraka.",
             'source' => 'QS. At-Tahrim: 6'],

            // ═══════════════════════════════
            // KRISTEN — 5 Ayat Alkitab
            // ═══════════════════════════════
            ['religion' => 'kristen', 'title' => 'Kejadian 2:24', 'sort_order' => 1,
             'ayat' => "Sebab itu seorang laki-laki akan meninggalkan ayahnya dan ibunya dan bersatu dengan istrinya, sehingga keduanya menjadi satu daging.",
             'translation' => null, 'source' => 'Kejadian 2:24'],

            ['religion' => 'kristen', 'title' => '1 Korintus 13:4-7', 'sort_order' => 2,
             'ayat' => "Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong. Ia tidak melakukan yang tidak sopan dan tidak mencari keuntungan diri sendiri. Ia tidak pemarah dan tidak menyimpan kesalahan orang lain.",
             'translation' => null, 'source' => '1 Korintus 13:4-7'],

            ['religion' => 'kristen', 'title' => 'Pengkhotbah 4:9-12', 'sort_order' => 3,
             'ayat' => "Berdua lebih baik dari pada seorang diri, karena mereka menerima upah yang baik dalam jerih payah mereka. Karena kalau mereka jatuh, yang seorang mengangkat temannya.",
             'translation' => null, 'source' => 'Pengkhotbah 4:9-12'],

            ['religion' => 'kristen', 'title' => 'Markus 10:9', 'sort_order' => 4,
             'ayat' => "Demikianlah mereka bukan lagi dua, melainkan satu. Karena itu, apa yang telah dipersatukan Allah, tidak boleh diceraikan manusia.",
             'translation' => null, 'source' => 'Markus 10:9'],

            ['religion' => 'kristen', 'title' => 'Amsal 18:22', 'sort_order' => 5,
             'ayat' => "Siapa mendapat istri, mendapat sesuatu yang baik, dan ia dikenan TUHAN.",
             'translation' => null, 'source' => 'Amsal 18:22'],

            // ═══════════════════════════════
            // HINDU — 5 Sloka
            // ═══════════════════════════════
            ['religion' => 'hindu', 'title' => 'Manawa Dharmasastra IX.96', 'sort_order' => 1,
             'ayat' => "Untuk menjadi keturunan, untuk kebahagiaan, untuk melaksanakan upacara keagamaan, dan untuk memperoleh kesenangan tertinggi, seorang wanita diberikan kepada seorang pria.",
             'translation' => null, 'source' => 'Manawa Dharmasastra IX.96'],

            ['religion' => 'hindu', 'title' => 'Rg Veda X.85.47', 'sort_order' => 2,
             'ayat' => "Semoga hari-hari yang datang membawa kebahagiaan bagi kalian berdua. Semoga kalian hidup di rumah yang penuh dengan kegembiraan dan anak-anak.",
             'translation' => null, 'source' => 'Rg Veda X.85.47'],

            ['religion' => 'hindu', 'title' => 'Manawa Dharmasastra III.60', 'sort_order' => 3,
             'ayat' => "Di mana wanita dihormati, di sanalah para dewa merasa senang; tetapi di mana mereka tidak dihormati, tidak ada upacara suci yang akan membuahkan hasil.",
             'translation' => null, 'source' => 'Manawa Dharmasastra III.60'],

            ['religion' => 'hindu', 'title' => 'Sarasamuccaya 23', 'sort_order' => 4,
             'ayat' => "Dharma adalah jalan hidup yang benar. Pernikahan adalah dharma yang suci, persatuan dua jiwa dalam cinta dan pengabdian.",
             'translation' => null, 'source' => 'Sarasamuccaya 23'],

            ['religion' => 'hindu', 'title' => 'Manawa Dharmasastra IX.101', 'sort_order' => 5,
             'ayat' => "Suami dan istri yang saling setia akan senantiasa bersatu, baik di dunia ini maupun di dunia yang akan datang.",
             'translation' => null, 'source' => 'Manawa Dharmasastra IX.101'],

            // ═══════════════════════════════
            // BUDDHA — 5 Kutipan
            // ═══════════════════════════════
            ['religion' => 'buddha', 'title' => 'Sigalovada Sutta', 'sort_order' => 1,
             'ayat' => "Seorang suami harus menghormati istrinya, tidak pernah tidak menghargainya, setia kepadanya, menyerahkan otoritas kepadanya, dan memberikannya perhiasan.",
             'translation' => null, 'source' => 'Sigalovada Sutta (DN 31)'],

            ['religion' => 'buddha', 'title' => 'Anguttara Nikaya IV.55', 'sort_order' => 2,
             'ayat' => "Jika suami dan istri ingin hidup bersama baik di kehidupan ini maupun di kehidupan mendatang, keduanya harus memiliki keyakinan yang sama, kebajikan yang sama, kedermawanan yang sama, dan kebijaksanaan yang sama.",
             'translation' => null, 'source' => 'Anguttara Nikaya IV.55'],

            ['religion' => 'buddha', 'title' => 'Dhammapada 328', 'sort_order' => 3,
             'ayat' => "Jika seseorang menemukan teman yang bijaksana, yang hidup baik dan penuh pengertian, hendaklah ia mengatasi segala bahaya dan berjalan bersamanya dengan gembira dan penuh kesadaran.",
             'translation' => null, 'source' => 'Dhammapada 328'],

            ['religion' => 'buddha', 'title' => 'Metta Sutta', 'sort_order' => 4,
             'ayat' => "Semoga semua makhluk hidup berbahagia dan aman, semoga hati mereka dipenuhi kebahagiaan. Seperti seorang ibu melindungi anaknya, demikianlah hendaknya cinta kasih tanpa batas dipancarkan ke seluruh dunia.",
             'translation' => null, 'source' => 'Metta Sutta (Sn 1.8)'],

            ['religion' => 'buddha', 'title' => 'Samyutta Nikaya I.4', 'sort_order' => 5,
             'ayat' => "Cinta sejati lahir dari pengertian. Dalam pengertian tumbuh kesabaran, dalam kesabaran tumbuh kesetiaan, dan dalam kesetiaan tumbuh cinta abadi.",
             'translation' => null, 'source' => 'Samyutta Nikaya I.4'],

            // ═══════════════════════════════
            // UMUM — 5 Kutipan Universal
            // ═══════════════════════════════
            ['religion' => 'umum', 'title' => 'Kutipan Cinta #1', 'sort_order' => 1,
             'ayat' => "Cinta tidak memandang dengan mata, tetapi dengan hati. Dua jiwa yang ditakdirkan bersama akan selalu menemukan jalannya pulang.",
             'translation' => null, 'source' => 'Kutipan Pernikahan'],

            ['religion' => 'umum', 'title' => 'Kutipan Cinta #2', 'sort_order' => 2,
             'ayat' => "Dalam pernikahan, bukan kesempurnaan yang dicari, melainkan ketulusan untuk saling melengkapi. Dua hati yang bersatu dalam cinta akan menguatkan satu sama lain.",
             'translation' => null, 'source' => 'Kutipan Pernikahan'],

            ['religion' => 'umum', 'title' => 'Kutipan Cinta #3', 'sort_order' => 3,
             'ayat' => "Pernikahan adalah awal dari sebuah perjalanan indah bersama. Dengan cinta sebagai kompas dan kesetiaan sebagai peta, setiap langkah menjadi bermakna.",
             'translation' => null, 'source' => 'Kutipan Pernikahan'],

            ['religion' => 'umum', 'title' => 'Kahlil Gibran', 'sort_order' => 4,
             'ayat' => "Cinta satu sama lain, tetapi janganlah membuat ikatan cinta. Biarkanlah cinta itu menjadi lautan yang bergerak di antara pantai-pantai jiwa kalian.",
             'translation' => null, 'source' => 'Kahlil Gibran'],

            ['religion' => 'umum', 'title' => 'Kutipan Cinta #5', 'sort_order' => 5,
             'ayat' => "Tidak ada kata yang lebih indah dari 'kita'. Karena dalam 'kita', ada cerita dua hati yang memilih untuk berjalan bersama, dalam suka dan duka.",
             'translation' => null, 'source' => 'Kutipan Pernikahan'],
        ];

        foreach ($quotes as $quote) {
            QuoteTemplate::create(array_merge($quote, ['is_active' => true]));
        }
    }
}
