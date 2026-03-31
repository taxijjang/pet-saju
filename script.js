const form = document.querySelector("#saju-form");
const petTypeInput = document.querySelector("#pet-type");
const petOptions = document.querySelectorAll(".pet-option");
const keywordButtons = document.querySelectorAll(".keyword-chip");
const languageButtons = document.querySelectorAll(".lang-button");
const sampleButton = document.querySelector("#sample-button");
const resultActions = document.querySelector("#result-actions");
const copyButton = document.querySelector("#copy-button");
const shareButton = document.querySelector("#share-button");
const exportButton = document.querySelector("#export-button");
const submitButton = document.querySelector("#submit-button");
const resultPlaceholder = document.querySelector("#result-placeholder");
const resultContent = document.querySelector("#result-content");
const resultPanel = document.querySelector(".result-panel");
const resultBadges = document.querySelector("#result-badges");
const resultTitle = document.querySelector("#result-title");
const resultSummary = document.querySelector("#result-summary");
const resultStamp = document.querySelector("#result-stamp");
const snapshotHeadline = document.querySelector("#snapshot-headline");
const snapshotBody = document.querySelector("#snapshot-body");
const snapshotTags = document.querySelector("#snapshot-tags");
const breedSelect = document.querySelector("#breed-select");
const breedHint = document.querySelector("#breed-hint");
const breedNamePreview = document.querySelector("#breed-name-preview");
const breedCopy = document.querySelector("#breed-copy");
const petNameInput = document.querySelector("#pet-name");
const guardianNameInput = document.querySelector("#guardian-name");
const birthDateInput = document.querySelector("#birth-date");
const birthTimeInput = document.querySelector("#birth-time");
const keywordCount = document.querySelector("#keyword-count");
const formStatus = document.querySelector("#form-status");
const typeName = document.querySelector("#type-name");
const typeCaption = document.querySelector("#type-caption");
const rhythmTitle = document.querySelector("#rhythm-title");
const rhythmBody = document.querySelector("#rhythm-body");
const temperamentBody = document.querySelector("#temperament-body");
const chemistryBody = document.querySelector("#chemistry-body");
const routineBody = document.querySelector("#routine-body");
const careBody = document.querySelector("#care-body");
const luckBody = document.querySelector("#luck-body");
const charmBody = document.querySelector("#charm-body");

const keywordLimit = 3;
const supportedLanguages = ["ko", "en", "ja"];
const selectedKeywords = new Set();
let currentReading = null;
let currentState = null;
let currentLanguage = "ko";
const buttonDefaultLabels = new Map();
const siteUrl = "https://pet-saju.pages.dev/";
const exportQrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=0&data=${encodeURIComponent(siteUrl)}`;
const i18n = window.DANGNYANG_I18N;
const translatableNodes = document.querySelectorAll("[data-i18n]");
const translatablePlaceholderNodes = document.querySelectorAll("[data-i18n-placeholder]");
const translatableAriaNodes = document.querySelectorAll("[data-i18n-aria-label]");
const pageDescriptionMeta = document.querySelector('meta[name="description"]');
const ogLocaleMeta = document.querySelector('meta[property="og:locale"]');
const ogSiteNameMeta = document.querySelector('meta[property="og:site_name"]');
const ogTitleMeta = document.querySelector('meta[property="og:title"]');
const ogDescriptionMeta = document.querySelector('meta[property="og:description"]');
const ogImageAltMeta = document.querySelector('meta[property="og:image:alt"]');
const twitterTitleMeta = document.querySelector('meta[name="twitter:title"]');
const twitterDescriptionMeta = document.querySelector('meta[name="twitter:description"]');

const breedGroupKeys = {
  "소형견": "dogSmall",
  "중형견": "dogMedium",
  "대형견": "dogLarge",
  "대표 묘종": "catBreed",
  "믹스/기타": "mixed"
};

const breedCatalog = {
  dog: [
    {
      value: "maltese",
      group: "소형견",
      label: "말티즈",
      vibe: "애정 표현이 반짝이는",
      personality: "작은 체구 안에 눈치와 사랑스러움이 아주 알차게 들어 있는 편이에요.",
      social: "사람 곁에 붙어 있는 시간이 길수록 정서가 빠르게 안정돼요.",
      routine: "짧고 자주 놀아주는 루틴이 하루 만족도를 높여줘요.",
      care: "섬세한 칭찬과 다정한 말투가 컨디션 회복에 큰 도움이 됩니다."
    },
    {
      value: "toy-poodle",
      group: "소형견",
      label: "토이 푸들",
      vibe: "센스와 순발력이 좋은",
      personality: "눈빛으로 분위기를 읽고 반응하는 능력이 빨라서 영리한 느낌이 강해요.",
      social: "대화하듯 상호작용해주면 애착이 깊어지는 속도가 빨라요.",
      routine: "간단한 미션 놀이와 두뇌 자극이 들어가면 하루가 훨씬 풍성해져요.",
      care: "지루함이 길어지지 않도록 작은 놀잇감 교체 주기를 주면 좋아요."
    },
    {
      value: "bichon-frise",
      group: "소형견",
      label: "비숑 프리제",
      vibe: "둥글고 밝은 에너지가 큰",
      personality: "사람을 웃게 만드는 사랑스러운 텐션과 놀이성이 잘 살아나는 편이에요.",
      social: "리액션을 자주 주는 집사와 있을 때 애정 표현이 한층 풍부해져요.",
      routine: "짧은 놀이를 자주 섞어주면 하루 리듬이 훨씬 안정적으로 예뻐져요.",
      care: "흥이 오른 뒤엔 천천히 진정할 마무리 루틴을 챙겨주면 좋습니다."
    },
    {
      value: "pomeranian",
      group: "소형견",
      label: "포메라니안",
      vibe: "존재감이 또렷한",
      personality: "사랑받는 분위기를 금방 알아채고 자기 매력을 자연스럽게 발휘해요.",
      social: "관심을 받는 순간 표정과 몸짓이 훨씬 다채로워져요.",
      routine: "짧은 산책과 가벼운 놀이를 자주 넣어주는 패턴이 잘 맞아요.",
      care: "갑작스러운 자극보다 부드러운 예고와 준비 시간을 주면 훨씬 편안해해요."
    },
    {
      value: "chihuahua",
      group: "소형견",
      label: "치와와",
      vibe: "작지만 존재감이 선명한",
      personality: "낯가림과 애착이 모두 뚜렷해서 마음의 온도차가 분명하게 드러나요.",
      social: "믿는 사람에게는 누구보다 열렬하게 마음을 붙이는 경향이 강해요.",
      routine: "짧은 산책과 안심되는 품속 시간을 균형 있게 주면 컨디션이 좋아요.",
      care: "새로운 자극 앞에서는 먼저 안전하다는 확신을 주는 것이 중요해요."
    },
    {
      value: "yorkshire-terrier",
      group: "소형견",
      label: "요크셔테리어",
      vibe: "자존심과 호기심이 함께 살아 있는",
      personality: "작아도 자기 기준이 또렷하고 주변을 똑똑하게 읽는 편이에요.",
      social: "집사의 반응을 세심하게 살피며 자신만의 방식으로 애정을 표현해요.",
      routine: "짧더라도 집중도 높은 교감 시간을 자주 주는 흐름이 잘 맞아요.",
      care: "억지로 맞추기보다 스스로 선택하는 순간을 존중하면 안정감이 커집니다."
    },
    {
      value: "shih-tzu",
      group: "소형견",
      label: "시츄",
      vibe: "포근하고 사람 곁을 좋아하는",
      personality: "편안한 분위기와 애정 교류 속에서 성격이 가장 예쁘게 드러나는 편이에요.",
      social: "가까운 사람 곁에 머무는 것만으로도 충분한 정서적 만족을 느껴요.",
      routine: "무리 없는 산책과 포근한 휴식이 섞인 하루 패턴이 잘 맞습니다.",
      care: "서두르지 않는 말투와 안정적인 생활 리듬이 컨디션 유지에 도움이 돼요."
    },
    {
      value: "miniature-dachshund",
      group: "소형견",
      label: "미니어처 닥스훈트",
      vibe: "끈기 있는 장난기가 매력인",
      personality: "한 번 관심이 생기면 끝까지 파고드는 집중력과 고집이 함께 보여요.",
      social: "노는 방식이 맞는 사람과는 금방 베스트 프렌드가 되는 편이에요.",
      routine: "짧은 탐색 놀이와 냄새 맡기 자극을 자주 넣어주면 만족감이 높아요.",
      care: "제지보다 다른 재미로 시선을 돌려주는 접근이 훨씬 부드럽게 먹힙니다."
    },
    {
      value: "welsh-corgi",
      group: "중형견",
      label: "웰시 코기",
      vibe: "명랑한 추진력이 있는",
      personality: "짧고 사랑스러운 외모와 달리 상황 파악과 추진력이 꽤 좋은 편이에요.",
      social: "가족과 함께 움직이는 루틴에서 소속감과 행복을 크게 느껴요.",
      routine: "짧아도 집중도 높은 놀이 시간을 몇 번 나누어 주는 편이 더 잘 맞아요.",
      care: "흥분한 에너지를 천천히 내려놓을 마무리 루틴을 함께 두면 좋아요."
    },
    {
      value: "shiba-inu",
      group: "중형견",
      label: "시바 이누",
      vibe: "자기 기준이 선명한",
      personality: "호불호와 취향이 또렷해서 자기만의 리듬을 지키려는 힘이 있어요.",
      social: "거리를 존중해주면 오히려 신뢰가 더 빠르게 쌓이는 스타일이에요.",
      routine: "혼자 쉬는 시간과 함께 노는 시간을 분리해 주면 컨디션이 좋아요.",
      care: "억지로 끌기보다 스스로 선택할 여지를 남겨주는 접근이 잘 맞아요."
    },
    {
      value: "beagle",
      group: "중형견",
      label: "비글",
      vibe: "냄새와 호기심에 강하게 반응하는",
      personality: "탐색 본능이 선명해 주변 세계를 몸으로 배우는 걸 좋아하는 편이에요.",
      social: "재밌는 놀이를 같이 해주는 집사와 있을 때 충성심과 즐거움이 같이 올라가요.",
      routine: "노즈워크나 냄새 맡기 시간이 포함되면 하루 만족도가 크게 올라갑니다.",
      care: "지루함이 길어지면 에너지가 넘칠 수 있어 적당한 미션감이 필요해요."
    },
    {
      value: "miniature-schnauzer",
      group: "중형견",
      label: "미니어처 슈나우저",
      vibe: "똘똘하고 경계심이 적절한",
      personality: "눈치가 빠르고 환경 변화를 잘 읽어서 반응이 영리하게 느껴져요.",
      social: "가족과 팀처럼 움직인다는 감각이 생기면 애정과 충성도가 깊어집니다.",
      routine: "짧은 훈련과 놀이를 섞은 리듬이 집중력과 안정감을 동시에 잡아줘요.",
      care: "과하게 자극하기보다 미리 예고하고 루틴을 만들어주면 훨씬 편안해해요."
    },
    {
      value: "cocker-spaniel",
      group: "중형견",
      label: "코카 스패니얼",
      vibe: "부드러운 감정선이 살아 있는",
      personality: "사람과 정서적으로 연결되는 순간에 표정과 에너지가 크게 반짝여요.",
      social: "집사의 감정 톤을 잘 읽기 때문에 다정한 반응이 큰 힘이 됩니다.",
      routine: "산책, 냄새 맡기, 포근한 휴식이 차례로 이어지는 패턴이 잘 맞아요.",
      care: "감정 기복이 길어지지 않도록 차분한 안심 루틴을 곁들여 주면 좋습니다."
    },
    {
      value: "border-collie",
      group: "중형견",
      label: "보더 콜리",
      vibe: "집중력과 눈치가 매우 좋은",
      personality: "상황을 읽고 다음 움직임을 계산하는 듯한 영리함이 크게 드러나요.",
      social: "함께 뭔가를 해내는 경험이 쌓일수록 관계 만족도가 빠르게 커져요.",
      routine: "몸 쓰는 활동과 머리 쓰는 놀이가 균형 있게 들어갈 때 제일 안정적이에요.",
      care: "심심함과 과몰입 사이 균형을 잡아줄 진정 루틴이 함께 있으면 좋아요."
    },
    {
      value: "jindo",
      group: "중형견",
      label: "진돗개",
      vibe: "신중하고 의리 깊은",
      personality: "쉽게 마음을 주진 않지만 한 번 믿으면 오래 지키는 타입에 가까워요.",
      social: "존중받는 거리감과 차분한 일관성에서 깊은 신뢰를 느낍니다.",
      routine: "예측 가능한 산책 루틴과 자기만의 휴식 장소가 중요해요.",
      care: "강하게 몰아붙이기보다 묵직한 신뢰를 쌓는 방식이 훨씬 잘 맞아요."
    },
    {
      value: "french-bulldog",
      group: "중형견",
      label: "프렌치 불독",
      vibe: "표정이 풍부하고 애정 신호가 확실한",
      personality: "리액션이 좋아서 같이 있으면 분위기를 금방 부드럽게 만드는 편이에요.",
      social: "가까운 사람과의 교감 밀도가 높을수록 만족감이 크게 올라가요.",
      routine: "무리 없는 놀이와 자주 쉬는 패턴이 균형을 잘 맞춰줍니다.",
      care: "컨디션 기복을 세심하게 살피며 템포를 조절해주면 더 안정적으로 지낼 수 있어요."
    },
    {
      value: "golden-retriever",
      group: "대형견",
      label: "골든 리트리버",
      vibe: "따뜻한 친화력이 넓은",
      personality: "분위기를 편안하게 만들고 주변 사람을 안심시키는 기운이 커요.",
      social: "함께 움직이고 같이 반응해주는 시간이 곧 사랑의 언어가 됩니다.",
      routine: "넉넉한 산책과 냄새 맡기 시간이 하루 만족감을 크게 끌어올려요.",
      care: "몸을 충분히 쓰는 날일수록 마음도 안정적으로 가라앉아요."
    },
    {
      value: "labrador-retriever",
      group: "대형견",
      label: "래브라도 리트리버",
      vibe: "활기와 친밀감이 풍부한",
      personality: "에너지와 애정 표현이 모두 풍성해서 사람 곁에서 더 빛나는 편이에요.",
      social: "함께 놀아주는 집사에게 빠르게 신뢰와 즐거움을 동시에 쌓아요.",
      routine: "몸을 쓰는 활동과 맛있는 보상이 연결될 때 집중도와 행복이 올라갑니다.",
      care: "신나게 논 뒤 충분히 숨을 고를 시간을 주면 전체 밸런스가 좋아져요."
    },
    {
      value: "samoyed",
      group: "대형견",
      label: "사모예드",
      vibe: "밝고 포근한 존재감이 큰",
      personality: "사람을 향한 호감과 부드러운 에너지가 얼굴과 몸짓에 잘 드러나는 편이에요.",
      social: "함께 움직이며 반응을 주고받는 시간에서 행복이 크게 자라요.",
      routine: "바깥 활동과 시원하게 쉬는 시간의 균형이 컨디션 관리에 중요해요.",
      care: "흥이 오른 상태를 천천히 정리해줄 편안한 마무리 루틴이 필요합니다."
    },
    {
      value: "siberian-husky",
      group: "대형견",
      label: "시베리안 허스키",
      vibe: "자유롭고 에너지가 선명한",
      personality: "자기 페이스가 분명하고, 움직이며 해소할 때 성격이 가장 예쁘게 보여요.",
      social: "억지로 붙잡기보다 함께 달리고 함께 쉬는 리듬에서 신뢰가 자라납니다.",
      routine: "활동량 있는 시간과 차분히 식히는 시간을 세트로 가져가면 좋아요.",
      care: "독립성을 존중하면서도 일관된 약속을 지켜주는 접근이 잘 맞습니다."
    },
    {
      value: "german-shepherd",
      group: "대형견",
      label: "저먼 셰퍼드",
      vibe: "집중력과 책임감이 묵직한",
      personality: "상황을 빠르게 파악하고 가족을 지키려는 기질이 또렷하게 느껴져요.",
      social: "신뢰하는 사람과 팀처럼 움직인다는 감각에서 큰 만족을 느낍니다.",
      routine: "명확한 역할감이 있는 놀이와 규칙적인 활동이 컨디션을 안정시켜요.",
      care: "강한 에너지 뒤에는 충분한 안정 시간과 예측 가능한 루틴이 꼭 필요해요."
    },
    {
      value: "mixed-dog",
      group: "믹스/기타",
      label: "믹스견",
      vibe: "개성이 선명하게 섞인",
      personality: "하나의 전형으로 묶기 어려운 대신 자기만의 매력이 아주 분명하게 보여요.",
      social: "익숙한 사람과의 루틴이 생기면 안정감과 애정 표현이 크게 늘어납니다.",
      routine: "좋아하는 놀이를 중심에 두고 하루를 짜면 만족도가 높아요.",
      care: "아이의 반응을 기준으로 속도를 맞춰주면 개성이 훨씬 예쁘게 살아나요."
    }
  ],
  cat: [
    {
      value: "korean-shorthair",
      group: "대표 묘종",
      label: "코리안 숏헤어",
      vibe: "생활 감각이 좋은",
      personality: "주변 상황을 빠르게 읽고 자기만의 생존 센스와 적응력을 잘 보여줘요.",
      social: "마음을 열기 전에는 관찰이 길지만 신뢰가 생기면 다정함이 깊어요.",
      routine: "숨을 곳과 높은 곳, 조용한 쉼터를 적절히 섞어 주면 하루가 편안해져요.",
      care: "갑작스러운 접촉보다 먼저 시선을 맞추고 허락을 구하는 방식이 잘 맞아요."
    },
    {
      value: "russian-blue",
      group: "대표 묘종",
      label: "러시안 블루",
      vibe: "고요한 우아함이 흐르는",
      personality: "표현은 절제되어도 속정이 깊고 조용한 애착이 오래 가는 편이에요.",
      social: "차분한 집사와의 조용한 눈맞춤에서 큰 안정감을 느껴요.",
      routine: "시끄럽지 않은 놀이와 고요한 휴식이 번갈아 오는 리듬이 잘 맞아요.",
      care: "과한 자극을 줄이고 예측 가능한 일상을 유지하면 컨디션이 안정됩니다."
    },
    {
      value: "persian",
      group: "대표 묘종",
      label: "페르시안",
      vibe: "포근한 귀족미가 있는",
      personality: "느긋한 템포 안에서 기분 좋은 순간을 오래 음미하는 타입에 가까워요.",
      social: "차분하고 다정한 손길이 이어질 때 마음이 부드럽게 열려요.",
      routine: "편안한 쉼터와 낮잠 루틴이 보장될수록 만족도가 높아져요.",
      care: "몸단장과 휴식 시간을 존중받을 때 예민함이 줄어드는 편이에요."
    },
    {
      value: "ragdoll",
      group: "대표 묘종",
      label: "랙돌",
      vibe: "온화한 애착이 깊은",
      personality: "한 번 신뢰한 존재에게는 마음을 넉넉하게 내어주는 편이에요.",
      social: "눈앞에 있어주는 것만으로도 정서적 만족을 느끼는 순간이 많아요.",
      routine: "따뜻한 자리에서 쉬다가도 함께 노는 시간이 적당히 섞여 있으면 좋아요.",
      care: "안심되는 공간과 느린 접근이 아이의 다정함을 더 크게 이끌어냅니다."
    },
    {
      value: "bengal",
      group: "대표 묘종",
      label: "벵갈",
      vibe: "야생미와 장난기가 공존하는",
      personality: "호기심과 운동성이 강해서 지루함을 금방 알아차리는 편이에요.",
      social: "재미있는 놀이 상대가 되어주면 신뢰와 애정이 함께 올라가요.",
      routine: "탐색 놀이와 높은 곳 이동이 포함된 환경이 컨디션 유지에 좋아요.",
      care: "에너지 배출구를 충분히 열어주면 예민함보다 매력이 먼저 드러나요."
    },
    {
      value: "scottish-fold",
      group: "대표 묘종",
      label: "스코티시 폴드",
      vibe: "말랑한 분위기의 사랑둥이",
      personality: "표정과 몸짓이 순하고 포근해서 옆에만 있어도 분위기가 풀어져요.",
      social: "편안함을 느끼는 사람 옆에서 오래 머무르며 애정을 표현하는 편이에요.",
      routine: "과하지 않은 놀이와 충분한 휴식의 균형이 잘 맞아요.",
      care: "조용히 곁에 있어주는 것만으로도 마음이 크게 안정됩니다."
    },
    {
      value: "mixed-cat",
      group: "믹스/기타",
      label: "믹스묘",
      vibe: "매력이 입체적으로 섞인",
      personality: "한 가지 성향으로 설명하기 어려운 대신 의외성과 매력이 풍성하게 보여요.",
      social: "자기 속도로 신뢰를 쌓을 수 있을 때 애정 표현이 훨씬 자연스러워져요.",
      routine: "좋아하는 숨숨집과 관찰 포인트를 중심으로 하루 리듬을 만들면 좋아요.",
      care: "정답을 정해두기보다 아이 반응을 읽으며 맞춰가는 방식이 가장 잘 맞아요."
    }
  ]
};

const elementMeaning = {
  "목": {
    label: "새싹 기운",
    tags: ["호기심", "성장"],
    dog: [
      "새로운 냄새와 친구를 만나면 마음이 먼저 뛰는 탐험가형이에요.",
      "산책길에서 작은 변화도 놓치지 않는 관찰력이 반짝여요.",
      "움직이면서 배우는 스타일이라 직접 경험할수록 자신감이 붙어요."
    ],
    cat: [
      "집안 곳곳을 자기만의 왕국처럼 탐색하는 호기심형이에요.",
      "낯선 소리와 움직임을 재빨리 포착하는 예민한 감각이 있어요.",
      "안전하다고 느껴지면 숨겨둔 장난기와 탐색 본능이 크게 올라와요."
    ],
    chemistry: [
      "따뜻한 칭찬과 부드러운 루틴이 있을 때 가장 편안하게 마음을 엽니다.",
      "새로운 놀이를 함께 해주는 사람에게 유독 빠르게 정을 주는 흐름이 있어요."
    ],
    rhythm: [
      "몸을 조금씩 움직이며 워밍업할 때 기분이 빠르게 좋아지는 편이에요.",
      "짧은 탐색과 작은 성취가 쌓일수록 마음도 밝아져요."
    ],
    care: [
      "하지 말라는 말만 반복하기보다 마음껏 탐색할 수 있는 안전한 범위를 넓혀주면 좋아요.",
      "심심함이 길어지면 에너지가 엉뚱한 방향으로 튈 수 있어 짧은 자극이 자주 필요해요."
    ],
    luck: {
      colors: ["연두", "풀빛 민트"],
      items: ["새 잎사귀 색 장난감", "탐색용 노즈워크 매트"],
      spots: ["햇살이 부드럽게 드는 창가", "새 냄새가 머무는 산책 코너"],
      snacks: ["바삭한 동결건조 간식", "작은 큐브 간식"]
    },
    charms: [
      "오늘은 작은 모험 하나가 큰 기쁨으로 돌아와요.",
      "새로운 자극 하나가 마음을 반짝이게 깨워줄 거예요."
    ]
  },
  "화": {
    label: "반짝 불꽃 기운",
    tags: ["표현력", "활기"],
    dog: [
      "사랑을 받으면 에너지가 더 커지는 무대 체질이에요.",
      "좋아하는 사람 앞에서 표정과 몸짓이 유난히 풍부해져요.",
      "분위기를 끌어올리는 힘이 있어 집안 공기를 환하게 만드는 편이에요."
    ],
    cat: [
      "기분이 좋을 때 존재감이 확 살아나는 작은 스타예요.",
      "자기만의 타이밍에 다가와 애정을 표현하는 뜨거운 심장이 있어요.",
      "한 번 텐션이 오르면 놀이 몰입도와 애정 표현이 같이 커져요."
    ],
    chemistry: [
      "눈을 맞추고 리액션을 크게 해주면 신뢰가 훨씬 빨리 깊어집니다.",
      "기분 좋은 순간을 함께 크게 표현해주는 집사와 특히 호흡이 잘 맞아요."
    ],
    rhythm: [
      "좋아하는 존재가 근처에 있을 때 에너지가 빠르게 올라와요.",
      "텐션이 오른 뒤에는 포근한 정리 시간이 함께 있어야 더 만족스러워요."
    ],
    care: [
      "흥이 오르는 순간을 잘 받아주되, 마무리 루틴으로 천천히 진정시키는 흐름이 중요해요.",
      "관심이 필요한 날에는 짧아도 진한 교감이 큰 안정감으로 이어집니다."
    ],
    luck: {
      colors: ["코랄", "살구빛 오렌지"],
      items: ["말랑한 리본 장난감", "반짝이는 깃털 티저"],
      spots: ["포근한 쿠션 위", "집사가 자주 머무는 따뜻한 자리"],
      snacks: ["부드러운 츄르", "향이 진한 작은 보상 간식"]
    },
    charms: [
      "애정 표현을 아끼지 않을수록 하루의 온도가 올라가요.",
      "좋아하는 존재와 눈을 맞출수록 마음이 더 빛나요."
    ]
  },
  "토": {
    label: "포근 흙 기운",
    tags: ["안정감", "포근함"],
    dog: [
      "집과 가족의 분위기를 오래 기억하는 든든한 안정형이에요.",
      "일상의 리듬이 일정할수록 마음이 부드럽게 풀려요.",
      "익숙한 사람과 익숙한 공간에서 가장 크게 사랑스러워지는 타입이에요."
    ],
    cat: [
      "익숙한 장소와 루틴을 사랑하는 차분한 수호자 타입이에요.",
      "자기만의 안전지대를 정해두고 천천히 관계를 넓혀가요.",
      "마음이 풀리면 묵직하고 오래 가는 애착을 보여주는 편이에요."
    ],
    chemistry: [
      "급하게 다가가기보다 기다려 주는 태도에서 깊은 신뢰를 느껴요.",
      "익숙한 약속과 편안한 반복 속에서 유대감이 단단히 쌓입니다."
    ],
    rhythm: [
      "하루 리듬이 예측 가능할수록 기분 변화 폭이 줄어들어요.",
      "편안한 휴식이 확보되면 놀이와 교감의 만족도도 함께 올라가요."
    ],
    care: [
      "낯선 변화는 천천히 들여오고, 익숙한 냄새와 공간을 안전기지처럼 남겨두면 좋아요.",
      "쉴 수 있는 시간과 장소가 분명할수록 표정도 부드러워집니다."
    ],
    luck: {
      colors: ["버터 옐로", "따뜻한 베이지"],
      items: ["폭신한 담요", "낮은 쿠션 침대"],
      spots: ["낮은 소파 끝자리", "햇살이 남는 바닥 매트"],
      snacks: ["담백한 비스킷 간식", "부드러운 닭가슴살 토핑"]
    },
    charms: [
      "편안한 리듬을 지키면 좋은 기운이 자연스럽게 쌓여요.",
      "익숙한 사랑이 오늘의 가장 큰 방패가 되어줄 거예요."
    ]
  },
  "금": {
    label: "반듯 금빛 기운",
    tags: ["품위", "정리감"],
    dog: [
      "상황을 빠르게 정리하고 규칙을 파악하는 똑똑한 타입이에요.",
      "좋고 싫은 기준이 분명해서 취향이 또렷하게 드러나요.",
      "깔끔한 패턴과 예측 가능한 약속을 좋아하는 경향이 보여요."
    ],
    cat: [
      "거리감 조절이 능숙하고 자신만의 품위를 지키는 세련형이에요.",
      "섬세하게 살피다가도 마음이 열리면 의외의 다정함을 보여줘요.",
      "쾌적하고 정돈된 환경에서 컨디션이 특히 좋아지는 흐름이 있어요."
    ],
    chemistry: [
      "예측 가능한 약속과 존중받는 거리감이 관계를 더 반짝이게 해요.",
      "선 넘지 않는 배려와 섬세한 관찰이 있을 때 신뢰가 빠르게 자라요."
    ],
    rhythm: [
      "정리된 환경에서 마음도 안정되고 집중력도 좋아지는 편이에요.",
      "취향이 맞는 장난감과 자리에는 유난히 오래 애정을 보여요."
    ],
    care: [
      "지저분하거나 시끄러운 자극이 길어지면 피로감이 빨리 올라올 수 있어요.",
      "거리감을 존중받을 때 오히려 더 다정한 순간이 자연스럽게 나옵니다."
    ],
    luck: {
      colors: ["크림 화이트", "은빛 베이지"],
      items: ["반짝이는 인식표", "정리된 장난감 바구니"],
      spots: ["정리된 코너 침대", "깔끔한 창가 선반"],
      snacks: ["작고 정갈한 트릿", "담백한 생선 간식"]
    },
    charms: [
      "차분하게 정돈할수록 숨은 매력이 더 또렷해져요.",
      "깔끔한 리듬 속에서 오늘의 예쁨이 더 선명해져요."
    ]
  },
  "수": {
    label: "은은 물 기운",
    tags: ["공감력", "깊이"],
    dog: [
      "감정을 조용히 읽고 분위기에 맞춰 반응하는 공감형이에요.",
      "신뢰가 생기면 누구보다 깊고 오래 곁을 지키는 편이에요.",
      "섬세한 마음결 덕분에 표정 변화와 분위기를 유난히 잘 읽어요."
    ],
    cat: [
      "표현은 조용하지만 감정 결을 세심하게 느끼는 섬세형이에요.",
      "편안한 사람에게만 보여주는 비밀스러운 애정이 큰 매력이에요.",
      "고요한 환경에서 더 선명하게 반짝이는 잔잔한 매력이 있어요."
    ],
    chemistry: [
      "조용한 말투와 잔잔한 손길이 아이의 마음을 가장 크게 안심시켜요.",
      "급하지 않은 교감 속에서 유대감이 서서히 깊고 단단하게 자랍니다."
    ],
    rhythm: [
      "한 번 마음이 안정되면 오래 잔잔한 만족감을 유지하는 편이에요.",
      "시끄럽지 않은 환경에서 감정 기복이 훨씬 부드러워져요."
    ],
    care: [
      "갑작스러운 큰 소리나 빠른 템포보다 잔잔한 접근이 훨씬 잘 맞아요.",
      "숨을 고를 수 있는 조용한 코너가 있을 때 마음이 빠르게 안정됩니다."
    ],
    luck: {
      colors: ["하늘빛", "잔잔한 블루그레이"],
      items: ["사각거리는 얇은 담요", "조용한 노즈워크 장난감"],
      spots: ["조용한 구석 쉼터", "바람이 잔잔한 창가 옆"],
      snacks: ["부드러운 수분 간식", "은은한 향의 생선 토핑"]
    },
    charms: [
      "서두르지 않는 마음이 오늘의 행운을 끌어와요.",
      "고요함을 지키는 순간에 가장 예쁜 기운이 모여들어요."
    ]
  }
};

const keywordProfiles = {
  "애교만점": {
    trait: ["사랑을 주고받는 순간에 기운이 가장 크게 살아나요."],
    care: ["눈맞춤과 즉각적인 반응을 자주 주면 만족감이 빠르게 차올라요."]
  },
  "호기심대장": {
    trait: ["익숙한 공간 안에서도 새로운 재미를 끝없이 찾아내요."],
    care: ["숨숨집 위치나 장난감을 가끔 바꿔주면 컨디션이 훨씬 좋아져요."]
  },
  "잠꾸러기": {
    trait: ["충분히 쉬고 나야 본래의 반짝임이 또렷하게 드러나요."],
    care: ["방해받지 않는 낮잠 시간이 보장될수록 성격도 훨씬 부드러워져요."]
  },
  "먹보": {
    trait: ["맛있는 보상이 있을 때 집중력과 행복 지수가 확 올라가요."],
    care: ["놀이와 보상을 연결해주면 즐거움과 루틴이 함께 자리 잡아요."]
  },
  "장난꾸러기": {
    trait: ["놀이가 곧 애정 표현이라 몸으로 먼저 마음을 전하는 편이에요."],
    care: ["짧아도 진한 놀이 시간을 하루에 여러 번 주는 방식이 잘 맞아요."]
  },
  "겁이조금많음": {
    trait: ["안전하다는 확신이 생기면 훨씬 더 다정하고 용감해져요."],
    care: ["새로운 것 앞에서는 거리와 시간을 충분히 주는 편이 좋아요."]
  },
  "의젓함": {
    trait: ["작은 변화에도 중심을 잃지 않는 묵직한 안정감이 있어요."],
    care: ["믿고 맡길 수 있는 작은 역할을 주듯 말 걸어주면 만족감이 커져요."]
  },
  "독립적": {
    trait: ["혼자만의 시간을 존중받을 때 애정 표현도 더 자연스러워져요."],
    care: ["붙잡기보다 선택권을 남겨두면 스스로 더 가까이 다가와요."]
  },
  "영리함": {
    trait: ["상황을 빠르게 읽고 패턴을 익히는 속도가 빨라서 눈치가 좋은 편이에요."],
    care: ["간단한 미션이나 규칙 있는 놀이를 섞어주면 만족감이 확 올라가요."]
  },
  "낯가림있음": {
    trait: ["마음을 열기까지 시간이 조금 걸리지만, 한 번 편해지면 애정이 깊어져요."],
    care: ["낯선 사람이나 공간 앞에서는 먼저 관찰할 시간을 충분히 주는 편이 좋아요."]
  },
  "충성심강함": {
    trait: ["믿는 존재를 자기만의 방식으로 오래 지키고 따르는 경향이 강해요."],
    care: ["일관된 루틴과 약속을 지켜주면 신뢰가 훨씬 단단하게 쌓여요."]
  },
  "산책러버": {
    trait: ["바깥 공기와 냄새, 움직임 속에서 기분이 유난히 빠르게 좋아져요."],
    care: ["짧더라도 바깥 자극을 자주 주면 컨디션이 훨씬 안정적으로 유지돼요."]
  },
  "질투쟁이": {
    trait: ["좋아하는 존재를 독점하고 싶은 마음이 커서 애정 표현이 진하게 나오는 편이에요."],
    care: ["비교보다 단독 교감 시간을 챙겨주면 서운함이 금방 풀리는 타입이에요."]
  },
  "수다쟁이": {
    trait: ["소리, 표정, 몸짓으로 자기 기분을 적극적으로 표현하는 편이에요."],
    care: ["반응을 잘 받아주면 표현력이 더 예쁘게 살아나고 답답함도 줄어들어요."]
  },
  "호불호뚜렷": {
    trait: ["좋아하는 것과 싫어하는 것의 기준이 분명해서 취향이 또렷하게 보여요."],
    care: ["억지로 맞추기보다 선호를 존중해줄수록 관계가 더 편안해져요."]
  },
  "섬세함": {
    trait: ["작은 분위기 변화나 말투의 온도까지 세심하게 느끼는 편이에요."],
    care: ["부드러운 목소리와 잔잔한 접근이 아이의 마음을 크게 안정시켜줘요."]
  }
};

const zodiacAnimals = ["쥐", "소", "호랑이", "토끼", "용", "뱀", "말", "양", "원숭이", "닭", "개", "돼지"];
const petLabels = { dog: "강아지", cat: "고양이" };
const archetypeWords = {
  "목": {
    prefix: ["초록", "새벽", "산들"],
    role: ["탐험가", "정찰가", "개척가"]
  },
  "화": {
    prefix: ["햇살", "반짝", "체리"],
    role: ["무드메이커", "스타", "응원단장"]
  },
  "토": {
    prefix: ["포근", "버터", "다정"],
    role: ["수호자", "안식처", "동행자"]
  },
  "금": {
    prefix: ["은빛", "반듯", "크림"],
    role: ["큐레이터", "취향가", "감별가"]
  },
  "수": {
    prefix: ["달빛", "고요", "물결"],
    role: ["공감가", "비밀친구", "해석가"]
  }
};
const seasonMood = {
  spring: "봄기운이 겹쳐 시작과 성장의 흐름이 강한 편이라 호기심과 움직임이 먼저 살아나요.",
  summer: "여름기운이 겹쳐 표현력과 에너지가 풍성한 편이라 반응과 존재감이 시원하게 드러나요.",
  autumn: "가을기운이 겹쳐 섬세함과 균형감이 도드라지는 편이라 표정과 취향이 또렷하게 읽혀요.",
  winter: "겨울기운이 겹쳐 신중함과 감정 깊이가 선명한 편이라 마음의 결이 오래 여운을 남겨요."
};
const timeProfiles = {
  dawn: {
    label: "새벽 태생",
    summary: "하루가 열릴 때의 맑은 기운을 받아 첫 반응이 빠른 편이에요.",
    rhythm: "아침에 기분이 풀리면 하루 전체 컨디션도 함께 좋아지는 흐름이 있어요."
  },
  morning: {
    label: "아침 태생",
    summary: "밝게 올라오는 기운을 타서 낯선 일에도 적응이 비교적 빠른 편이에요.",
    rhythm: "몸과 마음이 예열되면 활기가 꾸준하게 유지되는 타입이에요."
  },
  afternoon: {
    label: "한낮 태생",
    summary: "가장 선명한 시간대의 기운을 받아 자기 표현과 존재감이 안정적으로 드러나요.",
    rhythm: "놀이와 휴식의 균형만 잘 맞으면 하루 중반 이후에 특히 매력이 크게 살아나요."
  },
  evening: {
    label: "해질녘 태생",
    summary: "부드럽게 가라앉는 시간의 결을 받아 감정선과 분위기 감지가 좋은 편이에요.",
    rhythm: "해가 느슨해질수록 애정 표현이나 집중력이 더 예쁘게 드러날 수 있어요."
  },
  night: {
    label: "밤 태생",
    summary: "고요한 시간의 기운을 받아 속정이 깊고 자기만의 리듬을 지키는 힘이 있어요.",
    rhythm: "조용한 시간대에 마음이 더 편안해지며 본래 성격이 선명해지는 경향이 있어요."
  },
  unknown: {
    label: "시간 미상",
    summary: "태어난 시간이 비어 있어 생일 중심의 기본 흐름으로 해석했어요.",
    rhythm: "기본 기질을 중심으로 읽되, 실제 생활 리듬에 따라 표현 방식이 달라질 수 있어요."
  }
};

function getCopy(language = currentLanguage) {
  return i18n.uiCopy[language] || i18n.uiCopy.ko;
}

function getTranslationValue(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function determineInitialLanguage() {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = params.get("lang");
  if (supportedLanguages.includes(fromUrl)) {
    return fromUrl;
  }

  try {
    const storedLanguage = window.localStorage.getItem("dangnyang-language");
    if (supportedLanguages.includes(storedLanguage)) {
      return storedLanguage;
    }
  } catch (error) {
    // Ignore storage access issues.
  }

  const browserLanguage = (navigator.language || "").toLowerCase();
  if (browserLanguage.startsWith("ja")) return "ja";
  if (browserLanguage.startsWith("en")) return "en";
  return "ko";
}

function syncButtonDefaultLabels() {
  buttonDefaultLabels.set(copyButton, getCopy().actions.copy);
  buttonDefaultLabels.set(shareButton, getCopy().actions.share);
  buttonDefaultLabels.set(exportButton, getCopy().actions.export);
}

function updateMetaTags() {
  const copy = getCopy();
  const localeMeta = i18n.localeMeta[currentLanguage] || i18n.localeMeta.ko;

  document.documentElement.lang = localeMeta.htmlLang;
  document.title = copy.pageTitle;
  pageDescriptionMeta.content = copy.pageDescription;
  ogLocaleMeta.content = localeMeta.ogLocale;
  ogSiteNameMeta.content = copy.ogSiteName;
  ogTitleMeta.content = copy.ogTitle;
  ogDescriptionMeta.content = copy.ogDescription;
  ogImageAltMeta.content = copy.ogImageAlt;
  twitterTitleMeta.content = copy.ogTitle;
  twitterDescriptionMeta.content = copy.ogDescription;
}

function applyStaticTranslations() {
  const copy = getCopy();

  translatableNodes.forEach((node) => {
    const value = getTranslationValue(copy, node.dataset.i18n);
    if (typeof value === "string") {
      node.textContent = value;
    }
  });

  translatablePlaceholderNodes.forEach((node) => {
    const value = getTranslationValue(copy, node.dataset.i18nPlaceholder);
    if (typeof value === "string") {
      node.placeholder = value;
    }
  });

  translatableAriaNodes.forEach((node) => {
    const value = getTranslationValue(copy, node.dataset.i18nAriaLabel);
    if (typeof value === "string") {
      node.setAttribute("aria-label", value);
    }
  });

  const heroTags = copy.hero.tags;
  document.querySelectorAll(".hero-tags span").forEach((node, index) => {
    node.textContent = heroTags[index];
  });

  document.querySelectorAll(".note-card li").forEach((node, index) => {
    node.textContent = copy.note.items[index];
  });

  syncButtonDefaultLabels();
}

function updateLanguageButtons() {
  languageButtons.forEach((button) => {
    const isActive = button.dataset.lang === currentLanguage;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function getPetLabel(type, language = currentLanguage) {
  if (language === "ko") {
    return petLabels[type];
  }

  return i18n.petLabels[language][type];
}

function getKeywordProfile(keyword, language = currentLanguage) {
  if (language === "ko") {
    return {
      label: keyword,
      trait: keywordProfiles[keyword].trait,
      care: keywordProfiles[keyword].care
    };
  }

  return i18n.keywordTranslations[language][keyword];
}

function getKeywordLabel(keyword, language = currentLanguage) {
  return getKeywordProfile(keyword, language).label;
}

function getBreedProfileLocalized(type, value, language = currentLanguage) {
  const baseBreed = getBreedProfile(type, value);
  if (language === "ko") {
    return { ...baseBreed, preview: `${baseBreed.personality} ${baseBreed.routine}`, groupKey: breedGroupKeys[baseBreed.group] };
  }

  const translatedBreed = i18n.breedTranslations[language][baseBreed.value];
  return {
    ...baseBreed,
    ...translatedBreed,
    group: i18n.breedGroupLabels[language][translatedBreed.groupKey]
  };
}

function getElementProfileLocalized(name, language = currentLanguage) {
  if (language === "ko") {
    return {
      ...elementMeaning[name],
      short: shortLabel(elementMeaning[name].label)
    };
  }

  return i18n.elementTranslations[language][name];
}

function getTimeProfileKey(time) {
  if (!time) {
    return "unknown";
  }

  const [hour] = time.split(":").map(Number);
  if (hour < 5) return "night";
  if (hour < 8) return "dawn";
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  if (hour < 21) return "evening";
  return "night";
}

function getTimeProfileLocalized(key, language = currentLanguage) {
  if (language === "ko") {
    return timeProfiles[key];
  }

  return i18n.timeProfiles[language][key];
}

function getSeasonMoodLocalized(season, language = currentLanguage) {
  if (language === "ko") {
    return seasonMood[season];
  }

  return i18n.seasonMood[language][season];
}

function getArchetypeWordsLocalized(elementName, language = currentLanguage) {
  if (language === "ko") {
    return archetypeWords[elementName];
  }

  return i18n.archetypeWords[language][elementName];
}

function getZodiacIndex(year) {
  return ((year - 2020) % 12 + 12) % 12;
}

function getZodiacLabel(year, language = currentLanguage) {
  const zodiacIndex = getZodiacIndex(year);
  if (language === "ko") {
    return zodiacAnimals[zodiacIndex];
  }

  return i18n.zodiacAnimals[language][zodiacIndex];
}

function setLanguage(language, { rerender = true } = {}) {
  if (!supportedLanguages.includes(language)) {
    return;
  }

  currentLanguage = language;
  try {
    window.localStorage.setItem("dangnyang-language", language);
  } catch (error) {
    // Ignore storage access issues.
  }

  applyStaticTranslations();
  updateMetaTags();
  updateLanguageButtons();
  updateKeywordButtonLabels();
  updateKeywordCount();
  updateBreedOptions(petTypeInput.value, breedSelect.value);
  updateFormState();

  if (rerender && petNameInput.value.trim() && birthDateInput.value) {
    const values = getFormValues();
    renderReading(buildReading(values, language), values, { scroll: false });
  } else if (currentState) {
    currentState.language = currentLanguage;
    syncShareUrl(currentState);
  }
}

function xmur3(text) {
  let h = 1779033703 ^ text.length;
  for (let i = 0; i < text.length; i += 1) {
    h = Math.imul(h ^ text.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return function hash() {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return (h ^= h >>> 16) >>> 0;
  };
}

function mulberry32(seed) {
  return function random() {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clamp(number, min, max) {
  return Math.min(Math.max(number, min), max);
}

function formatMonthSeason(month) {
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

function getZodiac(year) {
  return getZodiacLabel(year, currentLanguage);
}

function pick(array, random) {
  return array[Math.floor(random() * array.length)];
}

function getBreedProfile(type, value) {
  return breedCatalog[type].find((item) => item.value === value) || breedCatalog[type][0];
}

function renderBreedPreview(type, value) {
  const breed = getBreedProfileLocalized(type, value, currentLanguage);
  breedNamePreview.textContent = breed.label;
  breedCopy.textContent = breed.preview;
}

function updateBreedOptions(type, preferredValue) {
  breedSelect.replaceChildren();
  const groupedBreeds = new Map();

  breedCatalog[type].forEach((breed) => {
    const localizedBreed = getBreedProfileLocalized(type, breed.value, currentLanguage);
    if (!groupedBreeds.has(localizedBreed.group)) {
      groupedBreeds.set(localizedBreed.group, []);
    }
    groupedBreeds.get(localizedBreed.group).push(localizedBreed);
  });

  groupedBreeds.forEach((breeds, groupName) => {
    const container = groupedBreeds.size > 1 ? document.createElement("optgroup") : breedSelect;
    if (container instanceof HTMLOptGroupElement) {
      container.label = groupName;
    }

    breeds.forEach((breed) => {
      const option = document.createElement("option");
      option.value = breed.value;
      option.textContent = breed.label;
      container.append(option);
    });

    if (container instanceof HTMLOptGroupElement) {
      breedSelect.append(container);
    }
  });

  const nextValue = preferredValue && breedCatalog[type].some((breed) => breed.value === preferredValue)
    ? preferredValue
    : breedCatalog[type][0].value;
  breedSelect.value = nextValue;
  breedHint.textContent = getCopy().form.breedHint;
  renderBreedPreview(type, nextValue);
}

function updateKeywordCount() {
  keywordCount.textContent = getCopy().form.keywordCount(selectedKeywords.size, keywordLimit);
  keywordCount.classList.toggle("full", selectedKeywords.size >= keywordLimit);
}

function updateKeywordButtonLabels() {
  keywordButtons.forEach((button) => {
    button.textContent = getKeywordLabel(button.dataset.keyword, currentLanguage);
  });
}

function setSelectedKeywords(keywords) {
  const allowedKeywords = new Set([...keywordButtons].map((button) => button.dataset.keyword));
  const nextKeywords = [];

  keywords.forEach((keyword) => {
    if (!allowedKeywords.has(keyword) || nextKeywords.includes(keyword) || nextKeywords.length >= keywordLimit) {
      return;
    }
    nextKeywords.push(keyword);
  });

  selectedKeywords.clear();
  keywordButtons.forEach((button) => {
    const isSelected = nextKeywords.includes(button.dataset.keyword);
    button.classList.toggle("selected", isSelected);
    if (isSelected) {
      selectedKeywords.add(button.dataset.keyword);
    }
  });
  updateKeywordCount();
}

function flashButtonLabel(button, nextLabel) {
  const defaultLabel = buttonDefaultLabels.get(button);
  const existingTimer = Number(button.dataset.resetTimer || "0");

  if (existingTimer) {
    window.clearTimeout(existingTimer);
  }

  button.textContent = nextLabel;
  button.dataset.resetTimer = String(
    window.setTimeout(() => {
      button.textContent = defaultLabel;
      button.dataset.resetTimer = "";
    }, 1800)
  );
}

function shortLabel(label) {
  return label.replace(" 기운", "");
}

function getRhythmTitle(timeLabel) {
  return getCopy().result.rhythm === "기분 리듬"
    ? (timeLabel === "시간 미상" ? "차분한 기본 리듬" : `${timeLabel} 리듬`)
    : timeLabel;
}

function formatBirthTimeDraft(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }

  const colonMatch = trimmed.match(/^(\d{0,2})(?::(\d{0,2}))?$/);
  if (colonMatch) {
    const hourText = colonMatch[1] || "";
    const minuteText = colonMatch[2] || "";

    if (!minuteText && trimmed.endsWith(":")) {
      return `${hourText}:`;
    }

    return minuteText ? `${hourText}:${minuteText}` : hourText;
  }

  const digits = trimmed.replace(/\D/g, "").slice(0, 4);
  if (!digits) {
    return "";
  }

  if (digits.length <= 2) {
    return digits;
  }

  if (digits.length === 3) {
    return `${digits.slice(0, 1)}:${digits.slice(1)}`;
  }

  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

function normalizeBirthTimeValue(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed) {
    return "";
  }

  const match = trimmed.match(/^(\d{1,2})(?::?(\d{2}))$/);
  if (!match) {
    return "";
  }

  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    return "";
  }

  return `${String(Math.min(Math.max(hour, 0), 23)).padStart(2, "0")}:${String(Math.min(Math.max(minute, 0), 59)).padStart(2, "0")}`;
}

function syncBirthTimeInput({ finalize = false } = {}) {
  const nextValue = finalize
    ? normalizeBirthTimeValue(birthTimeInput.value)
    : formatBirthTimeDraft(birthTimeInput.value);

  if (birthTimeInput.value !== nextValue) {
    birthTimeInput.value = nextValue;
  }
}

function getFormValues() {
  syncBirthTimeInput({ finalize: true });
  const values = Object.fromEntries(new FormData(form).entries());
  values.birthTime = normalizeBirthTimeValue(values.birthTime || "");
  return values;
}

function collectState(values) {
  return {
    language: currentLanguage,
    petType: values.petType,
    petName: values.petName.trim(),
    guardianName: values.guardianName.trim(),
    breed: values.breed,
    birthDate: values.birthDate,
    birthTime: values.birthTime || "",
    keywords: [...selectedKeywords]
  };
}

function buildShareUrl(state) {
  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";

  const params = new URLSearchParams();
  params.set("lang", state.language || currentLanguage);
  params.set("type", state.petType);
  params.set("name", state.petName);
  params.set("breed", state.breed);
  params.set("birth", state.birthDate);

  if (state.guardianName) {
    params.set("guardian", state.guardianName);
  }

  if (state.birthTime) {
    params.set("time", state.birthTime);
  }

  if (state.keywords.length) {
    params.set("keywords", state.keywords.join(","));
  }

  url.search = params.toString();
  return url.toString();
}

function syncShareUrl(state) {
  const shareUrl = buildShareUrl(state);

  try {
    const url = new URL(shareUrl);
    const nextPath = `${url.pathname}${url.search}`;
    window.history.replaceState(null, "", nextPath);
  } catch (error) {
    // Ignore history updates when the current environment does not support them.
  }

  return shareUrl;
}

function renderSnapshotTags(items) {
  snapshotTags.replaceChildren();

  items.forEach((item) => {
    const tag = document.createElement("span");
    tag.textContent = item;
    snapshotTags.append(tag);
  });
}

function updateFormState() {
  const hasRequiredFields = petNameInput.value.trim() && birthDateInput.value;
  submitButton.disabled = !hasRequiredFields;
  formStatus.textContent = hasRequiredFields
    ? getCopy().form.statusReady
    : getCopy().form.statusIdle;
}

function getTimeProfile(time) {
  return getTimeProfileLocalized(getTimeProfileKey(time), currentLanguage);
}

function buildArchetypeName(primary, secondary, random, language = currentLanguage) {
  const prefix = pick(getArchetypeWordsLocalized(primary.name, language).prefix, random);
  const role = pick(getArchetypeWordsLocalized(secondary.name, language).role, random);
  return `${prefix} ${role}`;
}

function setPetType(type, preferredBreed) {
  petTypeInput.value = type;
  petOptions.forEach((button) => {
    const isActive = button.dataset.type === type;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  updateBreedOptions(type, preferredBreed);
}

petOptions.forEach((button) => {
  button.addEventListener("click", () => {
    setPetType(button.dataset.type);
    updateFormState();
  });
});

breedSelect.addEventListener("change", () => {
  renderBreedPreview(petTypeInput.value, breedSelect.value);
});

[petNameInput, birthDateInput].forEach((input) => {
  input.addEventListener("input", updateFormState);
  input.addEventListener("change", updateFormState);
});

birthTimeInput.addEventListener("input", () => {
  syncBirthTimeInput();
});

birthTimeInput.addEventListener("blur", () => {
  syncBirthTimeInput({ finalize: true });
});

birthTimeInput.addEventListener("change", () => {
  syncBirthTimeInput({ finalize: true });
});

keywordButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const keyword = button.dataset.keyword;
    if (selectedKeywords.has(keyword)) {
      selectedKeywords.delete(keyword);
      button.classList.remove("selected");
      updateKeywordCount();
      return;
    }

    if (selectedKeywords.size >= keywordLimit) {
      updateKeywordCount();
      return;
    }

    selectedKeywords.add(keyword);
    button.classList.add("selected");
    updateKeywordCount();
  });
});

sampleButton.addEventListener("click", () => {
  const sample = i18n.samples[currentLanguage] || i18n.samples.ko;
  setPetType("dog", "welsh-corgi");
  petNameInput.value = sample.petName;
  guardianNameInput.value = sample.guardianName;
  birthDateInput.value = "2021-04-18";
  birthTimeInput.value = "08:10";
  setSelectedKeywords(["장난꾸러기", "먹보", "의젓함"]);
  updateFormState();
});

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const helper = document.createElement("textarea");
  helper.value = text;
  helper.setAttribute("readonly", "");
  helper.style.position = "fixed";
  helper.style.top = "-9999px";
  helper.style.opacity = "0";
  document.body.append(helper);
  helper.select();
  document.execCommand("copy");
  helper.remove();
}

function buildSummaryText(reading) {
  const copy = getCopy(reading.language);
  return [
    reading.shareTitleText,
    `${reading.archetype}`,
    "",
    reading.summary,
    "",
    `${copy.summaryLabels.snapshot}: ${reading.snapshotHeadline}`,
    reading.snapshotBody,
    "",
    `${copy.summaryLabels.temperament}: ${reading.temperament}`,
    `${copy.summaryLabels.chemistry}: ${reading.chemistry}`,
    `${copy.summaryLabels.routine}: ${reading.routine}`,
    `${copy.summaryLabels.care}: ${reading.care}`,
    `${copy.summaryLabels.luck}: ${reading.luck}`,
    `${copy.summaryLabels.charm}: ${reading.charm}`
  ].join("\n");
}

function roundedRectPath(ctx, x, y, width, height, radius) {
  const nextRadius = Math.min(radius, width / 2, height / 2);

  ctx.beginPath();
  ctx.moveTo(x + nextRadius, y);
  ctx.lineTo(x + width - nextRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + nextRadius);
  ctx.lineTo(x + width, y + height - nextRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - nextRadius, y + height);
  ctx.lineTo(x + nextRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - nextRadius);
  ctx.lineTo(x, y + nextRadius);
  ctx.quadraticCurveTo(x, y, x + nextRadius, y);
  ctx.closePath();
}

function fillRoundedRect(ctx, x, y, width, height, radius, fillStyle) {
  ctx.save();
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  ctx.restore();
}

function strokeRoundedRect(ctx, x, y, width, height, radius, strokeStyle, lineWidth = 1) {
  ctx.save();
  roundedRectPath(ctx, x, y, width, height, radius);
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.stroke();
  ctx.restore();
}

function getWrappedLines(ctx, text, maxWidth, maxLines) {
  const lines = [];
  const paragraphs = String(text).split("\n");

  paragraphs.forEach((paragraph) => {
    if (!paragraph) {
      lines.push("");
      return;
    }

    let currentLine = "";
    for (const char of Array.from(paragraph)) {
      const candidate = `${currentLine}${char}`;
      if (ctx.measureText(candidate).width <= maxWidth || !currentLine) {
        currentLine = candidate;
        continue;
      }

      lines.push(currentLine.trimEnd());
      currentLine = char.trimStart();
    }

    if (currentLine) {
      lines.push(currentLine.trimEnd());
    }
  });

  const visibleLines = typeof maxLines === "number" ? lines.slice(0, maxLines) : [...lines];

  if (typeof maxLines === "number" && lines.length > maxLines && visibleLines.length) {
    const lastIndex = visibleLines.length - 1;
    let lastLine = visibleLines[lastIndex];

    while (ctx.measureText(`${lastLine}...`).width > maxWidth && lastLine.length > 0) {
      lastLine = lastLine.slice(0, -1);
    }

    visibleLines[lastIndex] = `${lastLine}...`;
  }

  return visibleLines;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
  const visibleLines = getWrappedLines(ctx, text, maxWidth, maxLines);

  visibleLines.forEach((line, index) => {
    ctx.fillText(line, x, y + lineHeight * index);
  });

  return y + lineHeight * visibleLines.length;
}

function drawPills(ctx, items, startX, startY, maxWidth) {
  let cursorX = startX;
  let cursorY = startY;
  const gap = 12;
  const horizontalPadding = 16;
  const height = 42;

  items.forEach((item) => {
    const width = ctx.measureText(item).width + horizontalPadding * 2;

    if (cursorX + width > startX + maxWidth) {
      cursorX = startX;
      cursorY += height + gap;
    }

    fillRoundedRect(ctx, cursorX, cursorY, width, height, 21, "rgba(255, 255, 255, 0.82)");
    strokeRoundedRect(ctx, cursorX, cursorY, width, height, 21, "rgba(47, 38, 31, 0.08)");
    ctx.fillText(item, cursorX + horizontalPadding, cursorY + 27);
    cursorX += width + gap;
  });

  return cursorY + height;
}

function measurePillsHeight(ctx, items, maxWidth) {
  let cursorX = 0;
  let rows = 1;
  const gap = 12;
  const horizontalPadding = 16;
  const height = 42;

  items.forEach((item) => {
    const width = ctx.measureText(item).width + horizontalPadding * 2;

    if (cursorX && cursorX + width > maxWidth) {
      rows += 1;
      cursorX = 0;
    }

    cursorX += width + gap;
  });

  return rows * height + (rows - 1) * gap;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load image: ${src}`));
    image.src = src;
  });
}

function measureInfoCardHeight(ctx, width, card) {
  const innerWidth = width - 68;
  let height = 36;

  ctx.font = '28px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
  height += 30;

  if (card.title) {
    height += 14;
    ctx.font = '44px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
    height += getWrappedLines(ctx, card.title, innerWidth, 2).length * 52;
  }

  height += 18;
  ctx.font = '27px "Gowun Dodum", "Noto Sans JP", sans-serif';
  height += getWrappedLines(ctx, card.body, innerWidth).length * 40;
  height += 34;

  return Math.max(height, card.minHeight || 0);
}

function drawInfoCard(ctx, x, y, width, height, card) {
  fillRoundedRect(ctx, x, y, width, height, 28, card.fill);
  strokeRoundedRect(ctx, x, y, width, height, 28, "rgba(47, 38, 31, 0.08)");

  ctx.fillStyle = "#ff6b45";
  ctx.font = '28px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
  ctx.fillText(card.label, x + 34, y + 48);

  let cursorY = y + 82;

  if (card.title) {
    ctx.fillStyle = "#2f261f";
    ctx.font = '44px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
    cursorY = drawWrappedText(ctx, card.title, x + 34, cursorY, width - 68, 52, 2);
    cursorY += 12;
  }

  ctx.fillStyle = "#4f4338";
  ctx.font = '27px "Gowun Dodum", "Noto Sans JP", sans-serif';
  drawWrappedText(ctx, card.body, x + 34, cursorY, width - 68, 40);
}

async function buildExportCanvas(reading) {
  if (document.fonts?.ready) {
    await document.fonts.ready;
  }

  const copy = getCopy(reading.language);
  const canvas = document.createElement("canvas");
  canvas.width = 1200;
  canvas.height = 1600;
  let ctx = canvas.getContext("2d");
  const pillItems = [reading.primaryLabel, reading.secondaryLabel, ...reading.snapshotTags].slice(0, 6);
  const wideCardWidth = 976;
  const columnGap = 18;
  const columnWidth = (wideCardWidth - columnGap) / 2;
  const cardRows = [
    [
      {
        label: copy.result.type,
        title: reading.archetype,
        body: reading.typeSummary,
        fill: "rgba(255, 244, 214, 0.9)",
        minHeight: 220
      },
      {
        label: copy.result.rhythm,
        title: reading.rhythmTitleText,
        body: reading.rhythm,
        fill: "rgba(240, 251, 248, 0.92)",
        minHeight: 220
      }
    ],
    [
      {
        label: copy.result.temperament,
        body: reading.temperament,
        fill: "rgba(255, 255, 255, 0.92)",
        minHeight: 228
      },
      {
        label: copy.result.chemistry,
        body: reading.chemistry,
        fill: "rgba(255, 255, 255, 0.92)",
        minHeight: 228
      }
    ],
    [
      {
        label: copy.result.routine,
        body: reading.routine,
        fill: "rgba(255, 248, 238, 0.94)",
        minHeight: 228
      },
      {
        label: copy.result.care,
        body: reading.care,
        fill: "rgba(245, 250, 255, 0.94)",
        minHeight: 228
      }
    ]
  ];
  const snapshotCard = {
    label: copy.result.snapshot,
    title: reading.snapshotHeadline,
    body: `${reading.snapshotBody} ${reading.snapshotTags.join(" · ")}`,
    fill: "rgba(255, 249, 228, 0.94)",
    minHeight: 210
  };
  const luckCard = {
    label: copy.result.luck,
    body: reading.luck,
    fill: "rgba(255, 244, 236, 0.92)",
    minHeight: 206
  };

  ctx.font = '30px "Gowun Dodum", "Noto Sans JP", sans-serif';
  const summaryBottom = 426 + getWrappedLines(ctx, reading.summary, 940, 4).length * 46;
  ctx.font = '24px "Gowun Dodum", "Noto Sans JP", sans-serif';
  const pillsBottom = summaryBottom + 28 + measurePillsHeight(ctx, pillItems, 940);
  const contentStartY = pillsBottom + 34;

  const snapshotHeight = measureInfoCardHeight(ctx, wideCardWidth, snapshotCard);
  const cardRowHeights = cardRows.map((row) =>
    Math.max(
      measureInfoCardHeight(ctx, columnWidth, row[0]),
      measureInfoCardHeight(ctx, columnWidth, row[1])
    )
  );
  const luckHeight = measureInfoCardHeight(ctx, wideCardWidth, luckCard);
  ctx.font = '31px "Gowun Dodum", "Noto Sans JP", sans-serif';
  const charmHeight = 48 + 24 + getWrappedLines(ctx, reading.charm, 908).length * 42 + 36;

  const footerY =
    contentStartY +
    snapshotHeight +
    18 +
    cardRowHeights.reduce((total, rowHeight) => total + rowHeight, 0) +
    18 * cardRows.length +
    luckHeight +
    24;
  const canvasHeight = Math.max(1760, footerY + 216);

  canvas.height = canvasHeight;
  ctx = canvas.getContext("2d");

  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, "#fff7ec");
  gradient.addColorStop(0.55, "#fffdf9");
  gradient.addColorStop(1, "#fff2e4");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 140, 107, 0.2)";
  ctx.beginPath();
  ctx.arc(1060, 220, 190, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(122, 211, 195, 0.18)";
  ctx.beginPath();
  ctx.arc(180, canvas.height - 260, 220, 0, Math.PI * 2);
  ctx.fill();

  fillRoundedRect(ctx, 60, 60, 1080, canvas.height - 120, 44, "rgba(255, 252, 247, 0.9)");
  strokeRoundedRect(ctx, 60, 60, 1080, canvas.height - 120, 44, "rgba(47, 38, 31, 0.08)", 2);

  const qrBoxX = 848;
  const qrBoxY = 104;
  const qrBoxSize = 208;
  const qrImageX = qrBoxX + 14;
  const qrImageY = qrBoxY + 14;
  const qrImageSize = 180;
  const headerTextWidth = 680;

  fillRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, 238, 28, "rgba(255, 255, 255, 0.9)");
  strokeRoundedRect(ctx, qrBoxX, qrBoxY, qrBoxSize, 238, 28, "rgba(47, 38, 31, 0.08)");

  try {
    const qrImage = await loadImage(exportQrCodeUrl);
    ctx.drawImage(qrImage, qrImageX, qrImageY, qrImageSize, qrImageSize);
  } catch (error) {
    fillRoundedRect(ctx, qrImageX, qrImageY, qrImageSize, qrImageSize, 20, "rgba(255, 247, 236, 0.95)");
    strokeRoundedRect(ctx, qrImageX, qrImageY, qrImageSize, qrImageSize, 20, "rgba(47, 38, 31, 0.08)");
    ctx.fillStyle = "#716453";
    ctx.font = '24px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
    ctx.fillText("QR", qrBoxX + 88, qrBoxY + 116);
  }

  ctx.fillStyle = "#ff6b45";
  ctx.font = '24px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
  ctx.fillText(copy.result.qr, qrBoxX + 36, qrBoxY + 224);

  ctx.fillStyle = "#ff6b45";
  ctx.font = '28px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
  ctx.fillText("DANGNYANG SAJU", 112, 138);

  ctx.fillStyle = "#2f261f";
  ctx.font = '54px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
  ctx.fillText(reading.exportTitleText, 112, 210, headerTextWidth);

  ctx.fillStyle = "#716453";
  ctx.font = '26px "Gowun Dodum", "Noto Sans JP", sans-serif';
  ctx.fillText(reading.exportMetaText, 112, 256, headerTextWidth);

  ctx.fillStyle = "#2f261f";
  ctx.font = '78px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
  ctx.fillText(reading.archetype, 112, 360, headerTextWidth);

  ctx.fillStyle = "#716453";
  ctx.font = '30px "Gowun Dodum", "Noto Sans JP", sans-serif';
  let cursorY = drawWrappedText(ctx, reading.summary, 112, 426, 940, 46, 4);

  ctx.font = '24px "Gowun Dodum", "Noto Sans JP", sans-serif';
  cursorY = drawPills(ctx, pillItems, 112, cursorY + 28, 940);

  cursorY += 34;

  drawInfoCard(ctx, 112, cursorY, wideCardWidth, snapshotHeight, snapshotCard);
  cursorY += snapshotHeight + 18;

  cardRows.forEach((row, index) => {
    const rowHeight = cardRowHeights[index];
    drawInfoCard(ctx, 112, cursorY, columnWidth, rowHeight, row[0]);
    drawInfoCard(ctx, 112 + columnWidth + columnGap, cursorY, columnWidth, rowHeight, row[1]);
    cursorY += rowHeight + 18;
  });

  drawInfoCard(ctx, 112, cursorY, wideCardWidth, luckHeight, luckCard);

  fillRoundedRect(ctx, 112, footerY, 976, charmHeight, 32, "rgba(47, 38, 31, 0.92)");

  ctx.fillStyle = "#ffd980";
  ctx.font = '24px "Jua", "M PLUS Rounded 1c", "Noto Sans JP", sans-serif';
  ctx.fillText(copy.result.exportCharm, 146, footerY + 48);

  ctx.fillStyle = "#fff8ef";
  ctx.font = '31px "Gowun Dodum", "Noto Sans JP", sans-serif';
  drawWrappedText(ctx, reading.charm, 146, footerY + 92, 908, 42);

  return canvas;
}

function downloadCanvas(canvas, fileName) {
  if (canvas.toBlob) {
    canvas.toBlob((blob) => {
      if (!blob) {
        return;
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    }, "image/png");
    return;
  }

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = fileName;
  link.click();
}

copyButton.addEventListener("click", async () => {
  if (!currentReading) {
    return;
  }

  try {
    await copyTextToClipboard(buildSummaryText(currentReading));
    flashButtonLabel(copyButton, getCopy(currentReading.language).actions.copySuccess);
  } catch (error) {
    flashButtonLabel(copyButton, getCopy(currentReading.language).actions.copyFail);
  }
});

shareButton.addEventListener("click", async () => {
  if (!currentReading || !currentState) {
    return;
  }

  const shareUrl = syncShareUrl(currentState);
  const shareData = {
    title: currentReading.shareTitleText,
    text: `${currentReading.archetype} · ${currentReading.summary}`,
    url: shareUrl
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      flashButtonLabel(shareButton, getCopy(currentReading.language).actions.shareSuccess);
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
    }
  }

  try {
    await copyTextToClipboard(shareUrl);
    flashButtonLabel(shareButton, getCopy(currentReading.language).actions.shareCopied);
  } catch (error) {
    flashButtonLabel(shareButton, getCopy(currentReading.language).actions.copyFail);
  }
});

exportButton.addEventListener("click", async () => {
  if (!currentReading) {
    return;
  }

  exportButton.disabled = true;
  exportButton.textContent = getCopy(currentReading.language).actions.exportPreparing;

  try {
    const canvas = await buildExportCanvas(currentReading);
    downloadCanvas(canvas, `dangnyang-saju-${currentReading.petName}.png`);
    flashButtonLabel(exportButton, getCopy(currentReading.language).actions.exportSuccess);
  } catch (error) {
    exportButton.textContent = buttonDefaultLabels.get(exportButton);
    flashButtonLabel(exportButton, getCopy(currentReading.language).actions.exportFail);
  } finally {
    exportButton.disabled = false;
  }
});

function buildElementScores(seedText, birthDate, birthTime) {
  const hashSeed = xmur3(seedText)();
  const random = mulberry32(hashSeed);
  const digits = `${birthDate.replaceAll("-", "")}${birthTime.replaceAll(":", "") || "0000"}`
    .split("")
    .map((digit) => Number(digit));
  const names = ["목", "화", "토", "금", "수"];

  return names.map((name, index) => {
    const base = 38 + digits[index % digits.length] * 4;
    const spice = digits[(index + 3) % digits.length] * 2 + Math.floor(random() * 18);
    return {
      name,
      score: clamp(base + spice, 28, 98)
    };
  });
}

function renderBadges(items) {
  resultBadges.replaceChildren();
  items.forEach((item) => {
    const badge = document.createElement("span");
    badge.textContent = item;
    resultBadges.append(badge);
  });
}

function buildReading(values, language = currentLanguage) {
  const petType = values.petType;
  const petName = values.petName.trim();
  const copy = getCopy(language);
  const guardianName = values.guardianName.trim() || copy.fallbackGuardian;
  const birthDate = values.birthDate;
  const birthTime = values.birthTime || "";
  const keywords = [...selectedKeywords];
  const baseBreed = getBreedProfile(petType, values.breed);
  const breed = getBreedProfileLocalized(petType, values.breed, language);
  const seedText = [petType, baseBreed.value, petName, guardianName, birthDate, birthTime, keywords.sort().join("|")].join("|");
  const random = mulberry32(xmur3(seedText)());
  const scores = buildElementScores(seedText, birthDate, birthTime || "00:00").sort((a, b) => b.score - a.score);
  const primary = scores[0];
  const secondary = scores[1];
  const birth = new Date(`${birthDate}T${birthTime || "12:00"}`);
  const season = formatMonthSeason(birth.getMonth() + 1);
  const zodiac = getZodiacLabel(birth.getFullYear(), language);
  const zodiacBadge = language === "ko" ? `${zodiac}띠` : language === "ja" ? `${zodiac}年` : `Year of the ${zodiac}`;
  const timeKey = getTimeProfileKey(birthTime);
  const timeProfile = getTimeProfileLocalized(timeKey, language);
  const primaryProfile = getElementProfileLocalized(primary.name, language);
  const secondaryProfile = getElementProfileLocalized(secondary.name, language);
  const archetype = buildArchetypeName(primary, secondary, random, language);
  const keywordTraitLine = keywords.length
    ? keywords.map((keyword) => pick(getKeywordProfile(keyword, language).trait, random)).join(" ")
    : language === "ko"
      ? "성격 키워드를 더 고르면 이 아이만의 결이 한층 또렷해져요."
      : language === "ja"
        ? "性格キーワードを足すと、その子らしさがもっとくっきり見えてきます。"
        : "Add a few temperament keywords to make the reading feel even more like your pet.";
  const keywordCareLine = keywords.length
    ? keywords.map((keyword) => pick(getKeywordProfile(keyword, language).care, random)).join(" ")
    : language === "ko"
      ? "좋아하는 자극과 불편해하는 순간을 천천히 기록해두면 해석이 훨씬 정교해져요."
      : language === "ja"
        ? "好きな刺激と苦手な刺激をゆっくり記録していくと、読み取りがよりしっくりしやすくなります。"
        : "Keeping gentle notes on what they love and dislike makes the reading feel more spot on.";
  const primaryShort = primaryProfile.short || shortLabel(primaryProfile.label);
  const secondaryShort = secondaryProfile.short || shortLabel(secondaryProfile.label);
  const badgePetLabel = getPetLabel(petType, language);

  let balanceLine = "";
  let summary = "";
  let typeSummary = "";
  let rhythm = "";
  let temperament = "";
  let chemistry = "";
  let routine = "";
  let care = "";
  let luck = "";
  let charm = "";
  let snapshotHeadline = "";
  let snapshotBody = "";
  let resultTitleText = "";
  let stampText = "";
  let rhythmTitleText = "";
  let shareTitleText = "";
  let exportTitleText = "";
  let exportMetaText = "";

  if (language === "ko") {
    balanceLine = primary.score - secondary.score >= 9
      ? `${primaryProfile.label} 쪽 결이 조금 더 선명해서, 평소 분위기와 반응의 축이 비교적 또렷한 편이에요.`
      : `${primaryProfile.label}과 ${secondaryProfile.label}이 고르게 포개져, 한쪽으로 치우치기보다 볼수록 매력이 깊어지는 균형형에 가까워요.`;
    summary = `${petName}는 ${baseBreed.label} 특유의 ${baseBreed.vibe} 분위기 위에 ${primaryProfile.label}이 중심을 이루고, ${secondaryProfile.label}이 여운처럼 따라오는 아이예요. ${seasonMood[season]} ${timeProfile.summary}`;
    typeSummary = `${baseBreed.label}다운 ${baseBreed.vibe} 인상에 ${primaryProfile.tags.join(" · ")} 흐름이 가장 선명하게 얹혀 있어요. ${balanceLine}`;
    rhythm = `${timeProfile.label}의 결이 은근히 배어 있어 ${timeProfile.rhythm} ${pick(primaryProfile.rhythm, random)}`;
    temperament = `${pick(primaryProfile[petType], random)} ${pick(secondaryProfile[petType], random)} ${baseBreed.personality} ${keywordTraitLine}`;
    chemistry = `${guardianName} 님과의 케미는 ${pick(secondaryProfile.chemistry, random)} ${baseBreed.social} 특히 ${primaryProfile.label}의 기운이 또렷하게 올라오는 날에는 칭찬이나 간식, 짧은 눈맞춤처럼 바로 전해지는 반응이 관계의 온도를 빠르게 높여줘요.`;
    routine = `${baseBreed.routine} ${pick(primaryProfile.rhythm, random)} ${pick([timeProfile.rhythm, pick(secondaryProfile.rhythm, random)], random)}`;
    care = `${pick(primaryProfile.care, random)} ${keywordCareLine} ${baseBreed.care}`;
    luck = `오늘의 행운 컬러는 ${pick(primaryProfile.luck.colors, random)}, 잘 맞는 아이템은 ${pick(secondaryProfile.luck.items, random)}이에요. ${pick(primaryProfile.luck.spots, random)} 가까이에서 쉬거나 놀면 흐름이 한결 부드러워지고, ${pick(secondaryProfile.luck.snacks, random)} 같은 작은 보상은 기분 전환에 특히 잘 맞아요.`;
    charm = pick([...primaryProfile.charms, ...secondaryProfile.charms, "좋아하는 존재를 믿는 마음이 오늘의 가장 큰 힘이 됩니다."], random);
    snapshotHeadline = `${primaryShort} 중심 · ${secondaryShort} 보조`;
    snapshotBody = `${petName}에게서는 ${primaryProfile.tags.join(" · ")} 흐름이 먼저 읽히고, ${secondaryProfile.tags.join(" · ")} 결이 뒤에서 분위기를 더 풍성하게 받쳐줘요. ${balanceLine}`;
    resultTitleText = `${petName}에게 가장 또렷한 기질은 ${primaryProfile.label}과 ${secondaryProfile.label}`;
    stampText = `${primaryShort}\n${badgePetLabel}`;
    rhythmTitleText = timeKey === "unknown" ? "차분한 기본 리듬" : `${timeProfile.label} 리듬`;
    shareTitleText = `${petName}의 댕냥 사주 카드`;
    exportTitleText = `${petName}의 기질 카드`;
    exportMetaText = `${badgePetLabel} · ${baseBreed.label} · ${zodiacBadge}`;
  } else {
    const groupCopy = i18n.groupReadingCopy[language][breed.groupKey];
    const seasonLine = getSeasonMoodLocalized(season, language);

    if (language === "en") {
      balanceLine = primary.score - secondary.score >= 9
        ? `${primaryProfile.label} shows up a little more strongly, so the center of this pet's temperament feels fairly clear.`
        : `${primaryProfile.label} and ${secondaryProfile.label} blend together nicely, so several charms tend to show up at once.`;
      summary = `${petName} carries the ${breed.vibe} tone often felt in ${breed.label}, with ${primaryProfile.label} leading and ${secondaryProfile.label} softly backing it up. ${seasonLine} ${timeProfile.summary}`;
      typeSummary = `${breed.label} often reads as ${breed.vibe}, and ${primaryProfile.tags.join(" · ")} shows up especially clearly here. ${balanceLine}`;
      rhythm = `There is a ${timeProfile.label.toLowerCase()} note in the chart, so ${timeProfile.rhythm} ${pick(primaryProfile.rhythm, random)}`;
      temperament = `${pick(primaryProfile[petType], random)} ${pick(secondaryProfile[petType], random)} ${breed.preview} ${keywordTraitLine}`;
      chemistry = `With ${guardianName}, the chemistry feels like this: ${pick(secondaryProfile.chemistry, random)} ${groupCopy.social} On days when ${primaryProfile.label} shows up more clearly, quick praise, treats, or warm eye contact deepen the bond fast.`;
      routine = `${groupCopy.routine} ${pick(primaryProfile.rhythm, random)} ${pick([timeProfile.rhythm, pick(secondaryProfile.rhythm, random)], random)}`;
      care = `${pick(primaryProfile.care, random)} ${keywordCareLine} ${groupCopy.care}`;
      luck = `Today's lucky color is ${pick(primaryProfile.luck.colors, random)}, and the best-matched item is ${pick(secondaryProfile.luck.items, random)}. Spending time near ${pick(primaryProfile.luck.spots, random)} helps the mood settle, and a tiny reward like ${pick(secondaryProfile.luck.snacks, random)} can brighten the whole flow.`;
      charm = pick([...primaryProfile.charms, ...secondaryProfile.charms, "Trusting the ones you love becomes today's strongest lucky charm."], random);
      snapshotHeadline = `${primaryShort} leads · ${secondaryShort} supports`;
      snapshotBody = `${petName} first reads as ${primaryProfile.tags.join(" · ")}, then ${secondaryProfile.tags.join(" · ")} comes in to soften and deepen the charm. ${balanceLine}`;
      resultTitleText = `${petName}'s energy leans toward ${primaryProfile.label} + ${secondaryProfile.label}`;
      stampText = `${primaryShort}\n${badgePetLabel}`;
      rhythmTitleText = timeKey === "unknown" ? "Default calm rhythm" : `${timeProfile.label} rhythm`;
      shareTitleText = `${petName}'s Dangnyang reading`;
      exportTitleText = `${petName}'s vibe card`;
      exportMetaText = `${badgePetLabel} · ${breed.label} · ${zodiacBadge}`;
    } else {
      balanceLine = primary.score - secondary.score >= 9
        ? `${primaryProfile.label} がやや強く出ていて、ふだんの気質の軸が比較的はっきりしています。`
        : `${primaryProfile.label} と ${secondaryProfile.label} がきれいに混ざり合い、いくつもの魅力が一緒に見えやすいバランスタイプです。`;
      summary = `${petName} には ${breed.label} らしい ${breed.vibe} があり、その上に ${primaryProfile.label} が軸として立ち、${secondaryProfile.label} がやわらかく艶を足しています。${seasonLine} ${timeProfile.summary}`;
      typeSummary = `${breed.label} らしい ${breed.vibe} に、${primaryProfile.tags.join(" · ")} の流れが特にはっきり重なっています。${balanceLine}`;
      rhythm = `${timeProfile.label} の気配が入っているので、${timeProfile.rhythm} ${pick(primaryProfile.rhythm, random)}`;
      temperament = `${pick(primaryProfile[petType], random)} ${pick(secondaryProfile[petType], random)} ${breed.preview} ${keywordTraitLine}`;
      chemistry = `${guardianName} さんとの相性はこんな感じです。${pick(secondaryProfile.chemistry, random)} ${groupCopy.social} とくに ${primaryProfile.label} がくっきり出る日は、ほめ言葉やおやつ、目を合わせるような反応が距離をぐっと縮めます。`;
      routine = `${groupCopy.routine} ${pick(primaryProfile.rhythm, random)} ${pick([timeProfile.rhythm, pick(secondaryProfile.rhythm, random)], random)}`;
      care = `${pick(primaryProfile.care, random)} ${keywordCareLine} ${groupCopy.care}`;
      luck = `ラッキーカラーは ${pick(primaryProfile.luck.colors, random)}、相性のいいアイテムは ${pick(secondaryProfile.luck.items, random)} です。今日は ${pick(primaryProfile.luck.spots, random)} で休んだり遊んだりすると流れが整いやすく、${pick(secondaryProfile.luck.snacks, random)} のような小さなごほうびが気分転換を助けてくれます。`;
      charm = pick([...primaryProfile.charms, ...secondaryProfile.charms, "大好きな存在を信じる気持ちが、今日いちばんの力になりやすいです。"], random);
      snapshotHeadline = `${primaryShort} が主役 · ${secondaryShort} が補助`;
      snapshotBody = `${petName} はまず ${primaryProfile.tags.join(" · ")} の流れが見え、その横で ${secondaryProfile.tags.join(" · ")} の気配が魅力を深めます。${balanceLine}`;
      resultTitleText = `${petName} の気質は ${primaryProfile.label} と ${secondaryProfile.label} が中心`;
      stampText = `${primaryShort}\n${badgePetLabel}`;
      rhythmTitleText = timeKey === "unknown" ? "落ち着いた基本リズム" : `${timeProfile.label} リズム`;
      shareTitleText = `${petName} の댕냥サジュ`;
      exportTitleText = `${petName} の気質カード`;
      exportMetaText = `${badgePetLabel} · ${breed.label} · ${zodiacBadge}`;
    }
  }

  const snapshotTags = [...primaryProfile.tags, ...secondaryProfile.tags, ...keywords.map((keyword) => getKeywordLabel(keyword, language))].filter(
    (item, index, array) => array.indexOf(item) === index
  );

  return {
    language,
    petType,
    petName,
    guardianName,
    breed,
    zodiac,
    zodiacBadge,
    badgePetLabel,
    timeLabel: timeProfile.label,
    timeKey,
    primary,
    secondary,
    primaryLabel: primaryProfile.label,
    secondaryLabel: secondaryProfile.label,
    primaryShort,
    secondaryShort,
    primaryProfile,
    secondaryProfile,
    archetype,
    summary,
    snapshotHeadline,
    snapshotBody,
    snapshotTags,
    typeSummary,
    rhythm,
    rhythmTitleText,
    temperament,
    chemistry,
    routine,
    care,
    luck,
    charm,
    resultTitleText,
    stampText,
    shareTitleText,
    exportTitleText,
    exportMetaText,
    scores
  };
}

function renderReading(reading, values, options = {}) {
  currentReading = reading;
  currentState = collectState(values);
  currentState.language = reading.language;
  syncShareUrl(currentState);

  renderBadges([
    reading.badgePetLabel,
    reading.breed.label,
    reading.zodiacBadge,
    reading.primaryLabel,
    reading.secondaryLabel
  ]);
  resultTitle.textContent = reading.resultTitleText;
  resultSummary.textContent = reading.summary;
  resultStamp.textContent = reading.stampText;
  snapshotHeadline.textContent = reading.snapshotHeadline;
  snapshotBody.textContent = reading.snapshotBody;
  renderSnapshotTags(reading.snapshotTags);
  typeName.textContent = reading.archetype;
  typeCaption.textContent = reading.typeSummary;
  rhythmTitle.textContent = reading.rhythmTitleText;
  rhythmBody.textContent = reading.rhythm;
  temperamentBody.textContent = reading.temperament;
  chemistryBody.textContent = reading.chemistry;
  routineBody.textContent = reading.routine;
  careBody.textContent = reading.care;
  luckBody.textContent = reading.luck;
  charmBody.textContent = reading.charm;

  resultPlaceholder.classList.add("hidden");
  resultContent.classList.remove("hidden");
  resultActions.classList.remove("hidden");

  if (options.scroll !== false && window.matchMedia("(max-width: 960px)").matches) {
    resultPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function restoreStateFromUrl() {
  const params = new URLSearchParams(window.location.search);

  const language = params.get("lang");
  if (supportedLanguages.includes(language)) {
    currentLanguage = language;
  }

  if (!params.size || (params.size === 1 && params.has("lang"))) {
    return;
  }

  const petType = params.get("type") === "cat" ? "cat" : "dog";
  const preferredBreed = params.get("breed") || undefined;
  setPetType(petType, preferredBreed);

  petNameInput.value = params.get("name") || "";
  guardianNameInput.value = params.get("guardian") || "";
  birthDateInput.value = params.get("birth") || "";
  birthTimeInput.value = normalizeBirthTimeValue(params.get("time") || "");
  setSelectedKeywords((params.get("keywords") || "").split(",").filter(Boolean));
  updateFormState();

  const values = getFormValues();
  if (!values.petName || !values.birthDate) {
    return;
  }

  renderReading(buildReading(values, currentLanguage), values, { scroll: false });
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const values = getFormValues();
  if (!values.petName || !values.birthDate) {
    return;
  }

  renderReading(buildReading(values, currentLanguage), values);
});

languageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(button.dataset.lang);
  });
});

currentLanguage = determineInitialLanguage();
applyStaticTranslations();
updateMetaTags();
updateLanguageButtons();
updateKeywordButtonLabels();
setPetType("dog", "maltese");
updateKeywordCount();
updateFormState();
restoreStateFromUrl();
