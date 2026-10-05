export interface CuratedText {
  id: string;
  titleEn: string;
  titleTa: string;
  sanskrit: string;
  iast: string;
  tamil: string;
  translationEn: string;
  translationTa: string;
  source: string;
  translator?: string;
  isAiTranslated: boolean;
  difficulty: number; // 0 to 5
  category: "gita" | "subhashita" | "stotra" | "story" | "upanishad";
}

export const CURATED_TEXTS: CuratedText[] = [
  {
    id: "gita-1-1",
    titleEn: "The Gathering at the Field of Dharma (Gītā 1.1)",
    titleTa: "தர்மபூமியில் ஒன்று கூடிய படை (கீதை 1.1)",
    sanskrit: "धर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः ।\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय ॥",
    iast: "dharmakṣetre kurukṣetre samavetā yuyutsavaḥ |\nmāmakāḥ pāṇḍavāścaiva kimakurvata sañjaya ||",
    tamil: "த⁴ர்மக்ஷேத்ரே குருக்ஷேத்ரே ஸமவேதா யPassyuyutsava: |\nமாமகா: பாண்ட³வாஶ்சைவ கிமகுர்வத ஸஞ்ஜய ||",
    translationEn: "On the sacred field, the field of Kuru, assembled together and eager to fight, what did my sons and the sons of Pāṇḍu do, O Sañjaya?",
    translationTa: "அறநெறிக்களமாகிய குருக்ஷேத்திரத்தில், போரிட விரும்பி ஒன்று கூடிய என் மக்களும் பாண்டுவின் மக்களும் என்ன செய்தார்கள், சஞ்சயா?",
    source: "Bhagavad Gītā, Chapter 1, Verse 1",
    translator: "Traditional Sanskrit Translation",
    isAiTranslated: false,
    difficulty: 2,
    category: "gita",
  },
  {
    id: "gita-2-47",
    titleEn: "Right to Action, Not Fruits (Gītā 2.47)",
    titleTa: "கடமையில் உரிமை, பயனில் இல்லை (கீதை 2.47)",
    sanskrit: "कर्मण्येवाधिकारस्ते मा फलेषु कदाचन ।\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ॥",
    iast: "karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo'stvakarmaṇi ||",
    tamil: "கர்மண்யேவாதி⁴காரஸ்தே மா ப²லேஷு கதா³சந |\nமா கர்மப²லஹேதுர்பூ⁴ர்மா தே ஸங்கோ³ऽஸ்த்வகர்மணி ||",
    translationEn: "You have a right only to perform your duty, never to its fruits. Let not the fruit of action be your motive, nor let your attachment be to inaction.",
    translationTa: "செயலில் மட்டுமே உனக்கு உரிமை உண்டு, அதன் பயன்களில் எப்போதும் இல்லை. பயனை நோக்கமாகக் கொள்ளாதே; செயலற்ற தன்மையிலும் பற்று கொள்ளாதே.",
    source: "Bhagavad Gītā, Chapter 2, Verse 47",
    translator: "Traditional Sanskrit Translation",
    isAiTranslated: false,
    difficulty: 3,
    category: "gita",
  },
  {
    id: "subhashita-vidya",
    titleEn: "Virtue of True Knowledge",
    titleTa: "மெய்யறிவின் பயன் (சுபாஷிதம்)",
    sanskrit: "विद्या ददाति विनयं विनयाद्याति पात्रताम् ।\nपात्रत्वाद्धनमाप्नोति धनाद्धर्मं ततः सुखम् ॥",
    iast: "vidyā dadāti vinayaṃ vinayādyāti pātratām |\npātratvāddhanamāpnoti dhanāddharmaṃ tataḥ sukham ||",
    tamil: "வித்³யா த³தா³தி விநயம் விநயாத்³யாதி பாத்ரதாம் |\nபாத்ரத்வாத்³த⁴நமாப்நோதி த⁴நாத்³த⁴ர்மம் தத: ஸுக²ம் ||",
    translationEn: "Knowledge gives humility; from humility comes worthiness; from worthiness one gains wealth; from wealth comes righteousness; and from that comes true happiness.",
    translationTa: "கல்வி பணிவைத் தருகிறது; பணிவு தகுதியைத் தருகிறது; தகுதி செல்வத்தைத் தருகிறது; செல்வம் அறத்தைத் தருகிறது; அறம் மெய்யான அமைதியைத் தருகிறது.",
    source: "Hitopadeśa (Subhāṣita)",
    translator: "Human Reviewed",
    isAiTranslated: false,
    difficulty: 1,
    category: "subhashita",
  },
  {
    id: "subhashita-udyamena",
    titleEn: "Success through Diligence",
    titleTa: "முயற்சியே வெற்றி (சுபாஷிதம்)",
    sanskrit: "उद्यमेन हि सिध्यन्ति कार्याणि न मनोरथैः ।\nन हि सुप्तस्य सिंहस्य प्रविशन्ति मुखे मृगाः ॥",
    iast: "udyamena hi sidhyanti kāryāṇi na manorathaiḥ |\nna hi suptasya siṃhasya praviśanti mukhe mṛgāḥ ||",
    tamil: "உத்³யமேந ஹி ஸித்⁴யந்தி கார்யாணி ந மநோரதை²: |\nந ஹி ஸுப்தஸ்ய ஸிம்ஹஸ்ய ப்ரவிஶந்தி முகே² ம்ருகா³: ||",
    translationEn: "Tasks are accomplished only through effort and diligence, never through wishful daydreaming; animals do not enter the mouth of a sleeping lion on their own.",
    translationTa: "செயல்கள் முயற்சியாலேயே வெற்றி பெறுகின்றன, வெறும் விருப்பங்களால் அல்ல; தூங்கும் சிங்கத்தின் வாயில் மான்கள் தானாக வந்து விழுவதில்லை.",
    source: "Pañcatantra (Subhāṣita)",
    translator: "Human Reviewed",
    isAiTranslated: false,
    difficulty: 2,
    category: "subhashita",
  },
  {
    id: "upanishad-shanti",
    titleEn: "Lead Me to Light (Bṛhadāraṇyaka Upaniṣad)",
    titleTa: "ஒளியை நோக்கி வழிநடத்துக (உபநிடத சாந்தி)",
    sanskrit: "ॐ असतो मा सद्गमय ।\nतमसो मा ज्योतिर्गमय ।\nमृत्योर्मा अमृतं गमय ॥",
    iast: "om asato mā sadgamaya |\ntamaso mā jyotirgamaya |\nmṛtyormā amṛtaṃ gamaya ||",
    tamil: "ஓம் அஸதோ மா ஸத்³க³மய |\nதமஸோ மா ஜ்யோதிர்க³மய |\nம்ருத்யோர்மா அம்ருதம் க³மய ||",
    translationEn: "Om, lead me from the unreal to the real; lead me from darkness to light; lead me from mortality to immortality.",
    translationTa: "ஓம், பொய்மையிலிருந்து என்னை உண்மைக்கு அழைத்துச் செல்க; இருளிலிருந்து ஒளிக்கு அழைத்துச் செல்க; இறப்பிலிருந்து அழியாப் பெருவாழ்விற்கு அழைத்துச் செல்க.",
    source: "Bṛhadāraṇyaka Upaniṣad 1.3.28",
    translator: "Human Reviewed",
    isAiTranslated: false,
    difficulty: 1,
    category: "upanishad",
  },
  {
    id: "stotra-guru",
    titleEn: "Reverence to the Teacher (Guru Stotra)",
    titleTa: "குரு வணக்கம் (குரு ஸ்தோத்திரம்)",
    sanskrit: "गुरुर्ब्रह्मा गुरुर्विष्णुः गुरुर्देवो महेश्वरः ।\nगुरुः साक्षात् परं ब्रह्म तस्मै श्रीगुरवे नमः ॥",
    iast: "gururbrahmā gururviṣṇuḥ gururdevo maheśvaraḥ |\nguruḥ sākṣāt paraṃ brahma tasmai śrīgurave namaḥ ||",
    tamil: "குருர்ப்³ரஹ்மா குருர்விஷ்ணு: குருர்தே³வோ மஹேஶ்வர: |\nகுரு: ஸாக்ஷாத் பரம் ப்³ரஹ்ம தஸ்மை ஶ்ரீகு³ரவே நம: ||",
    translationEn: "The Guru is Brahmā, the Guru is Viṣṇu, the Guru is the Lord Maheśvara; the Guru is the Supreme Absolute directly realized. Salutations unto that revered Guru.",
    translationTa: "குருவே பிரம்மா, குருவே விஷ்ணு, குருவே மகேஸ்வரன்; குருவே கண்முன் விளங்கும் பரம்பொருள். அத்தகைய போற்றுதலுக்குரிய குருவிற்கு என் வணக்கங்கள்.",
    source: "Guru Gītā",
    translator: "Human Reviewed",
    isAiTranslated: false,
    difficulty: 1,
    category: "stotra",
  },
  {
    id: "story-woodcutter",
    titleEn: "The Honest Woodcutter (Graded Story)",
    titleTa: "நேர்மையான விறகுவெட்டி (எளிய கதை)",
    sanskrit: "एकस्मिन् वने एकः निर्धनः काष्ठतक्षकः अवसत् । सः प्रतिदिनं वने वृक्षाणाम् शाखाः अकर्तयत् ।",
    iast: "ekasmin vane ekaḥ nirdhanaḥ kāṣṭhatakṣakaḥ avasat | saḥ pratidinaṃ vane vṛkṣāṇām śākhāḥ akartayat |",
    tamil: "ஏகஸ்மிந் வநே ஏக: நிர்த⁴ந: காஷ்ட²தக்ஷக: அவஸத் | ஸ: ப்ரதிதி³நம் வநே வ்ருக்ஷாணாம் ஶாகா²: அகர்தயத் |",
    translationEn: "In a forest lived a poor woodcutter. Every day he cut branches of trees in the woods.",
    translationTa: "ஒரு காட்டில் ஓர் ஏழை விறகுவெட்டி வாழ்ந்து வந்தான். அவன் தினந்தோறும் காட்டில் மரங்களின் கிளைகளை வெட்டி வந்தான்.",
    source: "Graded Reader Story",
    translator: "Bhāṣā Editorial Team",
    isAiTranslated: false,
    difficulty: 2,
    category: "story",
  },
];

export function getCuratedTexts(category?: string): CuratedText[] {
  if (!category || category === "all") {
    return CURATED_TEXTS;
  }
  return CURATED_TEXTS.filter((t) => t.category === category);
}

export function getTextById(id: string): CuratedText | undefined {
  return CURATED_TEXTS.find((t) => t.id === id);
}
