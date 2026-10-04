export interface ScenarioAction {
  id: string;
  label: string;
  deafPrompt: string; // What the deaf person expresses
  hearingResponse: string; // What the hearing person/staff replies
  visualSign: string;
  category: string;
  gestureDescription: string;
  handShape: string;
}

export interface Scenario {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  bgGradient: string;
  actions: ScenarioAction[];
}

export interface PatientCase {
  id: string;
  name: string;
  age: number;
  gender: string;
  clinic: string;
  doctorName: string;
  complaint: string;
  deafMessage: string;
  doctorResponse: string;
  visualSign: string;
  status: 'فحص نشط' | 'في غرفة الانتظار' | 'طوارئ عاجلة' | 'تم صرف الدواء';
  vitals: {
    heartRate: number;
    bp: string;
    temperature: string;
  };
  conditionHighlight?: string;
}

export const SCENARIOS: Scenario[] = [
  {
    id: 'clinic',
    title: 'تواصل مع الطبيب',
    icon: '👨‍⚕️',
    tagline: 'تصوير مقطع للشكوى الطبية وحفظ الخصوصية',
    bgGradient: 'from-emerald-950/70 to-teal-950/70',
    actions: [
      {
        id: 'c1',
        label: 'أشعر بألم ومغص بالبطن',
        deafPrompt: 'أشعر بألم حاد ومغص في الجانب الأيمن منذ ساعات الصباح',
        hearingResponse: 'تفضل على سرير الفحص وسأقوم بفحص البطن بالسونار فوراً',
        visualSign: '🩺',
        category: 'طبي عاجل',
        gestureDescription: 'وضع الكف على موضع الألم مع حركة دائرية وتعبير ملامح متألم.',
        handShape: 'كف مضموم جزئياً على موضع الألم'
      },
      {
        id: 'c2',
        label: 'أحتاج مسكن وريدي للألم',
        deafPrompt: 'هل يمكن إعطائي إبرة أو دواء مسكن سريع للألم؟',
        hearingResponse: 'نعم سنعطيك مسكناً وريدياً يخفف الألم خلال خمس دقائق',
        visualSign: '💊',
        category: 'علاج وصيدلة',
        gestureDescription: 'حك راحة اليد إشارة لطحن الدواء ثم لمس موضع الوريد.',
        handShape: 'إصبع وسطى يدور في الكف المقابل'
      },
      {
        id: 'c3',
        label: 'متى تظهر نتيجة الفحص؟',
        deafPrompt: 'متى تظهر نتيجة فحص الدم والأشعة الصوتية؟',
        hearingResponse: 'النتائج تظهر بعد ساعة وستصلك رسالة نصية عبر النظام',
        visualSign: '🧪',
        category: 'مختبرات',
        gestureDescription: 'إشارة سحب عينة ثم إشارة الساعة والانتظار.',
        handShape: 'سبابة تشير للذراع ثم نقر على المعصم'
      },
      {
        id: 'c4',
        label: 'أين الصيدلية لصرف العلاج؟',
        deafPrompt: 'أين تقع الصيدلية لصرف الوصفة الطبية؟',
        hearingResponse: 'الصيدلية بالدور الأرضي بجانب بوابة الخروج الرئيسية',
        visualSign: '🏥',
        category: 'إرشادات',
        gestureDescription: 'إشارة الدواء متبوعة بإشارة الاتجاه إلى الأسفل.',
        handShape: 'كف مفتوح موجه نحو الدور الأرضي'
      }
    ]
  },
  {
    id: 'restaurant',
    title: 'المطعم والمقهى',
    icon: '🍽️',
    tagline: 'طلب الطعام، الحساب، والتخصيص بلمسة واحدة',
    bgGradient: 'from-amber-950/70 to-orange-950/70',
    actions: [
      {
        id: 'r1',
        label: 'أريد قائمة الطعام',
        deafPrompt: 'من فضلك أريد الاطلاع على قائمة الوجبات والمشروبات',
        hearingResponse: 'تفضل هذه القائمة وبإمكانك مسح باركود الطاولة أيضاً',
        visualSign: '📋',
        category: 'خدمة',
        gestureDescription: 'فتح الكفين كالكتاب متبوعة بإشارة القراءة بالعينين.',
        handShape: 'كفان متلاصقان يفتحان تدريجياً'
      },
      {
        id: 'r2',
        label: 'بدون سكر أو مكسرات',
        deafPrompt: 'لدي حساسية، أرجو إعداد الوجبة بدون سكر وبدون مكسرات',
        hearingResponse: 'سأؤكد للمطبخ تجهيز الوجبة خاصة ومناسبة لحساسيتك',
        visualSign: '🚫',
        category: 'تخصيص',
        gestureDescription: 'التلويح بالسبابة كعلامة الرفض والمنع ثم إشارة الحلق.',
        handShape: 'سبابة تلوح يميناً ويساراً بحزم'
      },
      {
        id: 'r3',
        label: 'طلب الفاتورة والحساب',
        deafPrompt: 'أريد الحساب وسأدفع بواسطة بطاقة مدى أو آبل باي',
        hearingResponse: 'تفضل جهاز الدفع الإلكتروني، الحساب 45 ريالاً',
        visualSign: '💳',
        category: 'دفع',
        gestureDescription: 'حك الإبهام بالسبابة علامة النقود ثم لمس البطاقة الافتراضية.',
        handShape: 'إبهام وسبابة متقاربان بحركة انزلاقية'
      },
      {
        id: 'r4',
        label: 'أريد الطلب سفري',
        deafPrompt: 'من فضلك اجعل الوجبة معبأة للسفري والطلب الخارجي',
        hearingResponse: 'بالتأكيد، سيتم تغليف الوجبة بعناية وتسليمها لك',
        visualSign: '🥡',
        category: 'تجهيز',
        gestureDescription: 'إشارة لف الكيس ورفعه للأعلى.',
        handShape: 'قبضتان تضمّان كيس التغليف'
      }
    ]
  },
  {
    id: 'airport',
    title: 'المطار والسفر',
    icon: '✈️',
    tagline: 'متابعة بوابات الصعود، الأمتعة، والرحلات',
    bgGradient: 'from-blue-950/70 to-cyan-950/70',
    actions: [
      {
        id: 'a1',
        label: 'أين بوابة المغادرة؟',
        deafPrompt: 'أين تقع بوابة الصعود للرحلة رقم SV1020؟',
        hearingResponse: 'بوابتك هي رقم 18 بالدور الثاني، والنداء بعد 20 دقيقة',
        visualSign: '🚪',
        category: 'ملاحة',
        gestureDescription: 'إشارة الطائرة بالإبهام والخنصر ثم فتح البوابة.',
        handShape: 'إبهام وسبابة وخنصر ممدودون كأجنحة الطائرة'
      },
      {
        id: 'a2',
        label: 'مساعدة في الحقائب',
        deafPrompt: 'أحتاج مساعدة ونقل للأمتعة الثقيلة إلى منصة الشحن',
        hearingResponse: 'فريق المساندة في طريقه إليك ومعه عربة الأمتعة',
        visualSign: '🧳',
        category: 'خدمات',
        gestureDescription: 'إشارة حمل مقبض الحقيبة والمشي بها.',
        handShape: 'قبضة ممسكة للأسفل مع إشارة الرفع'
      },
      {
        id: 'a3',
        label: 'صعود الطائرة لذوي الإعاقة',
        deafPrompt: 'أنا مسافر أصم، هل يمكنني الصعود المبكر للطائرة؟',
        hearingResponse: 'نعم نرحب بك للصعود في أولوية الصعود المخصصة لك',
        visualSign: '♿',
        category: 'أولوية',
        gestureDescription: 'الإشارة إلى الأذن ثم إشارة المشي السريع نحو الطائرة.',
        handShape: 'لمس الأذن ثم بسط الكف للأمام'
      }
    ]
  },
  {
    id: 'bank',
    title: 'البنك والمعاملات',
    icon: '🏦',
    tagline: 'فتح حساب، معالجة بطاقات الصراف، والتمويل',
    bgGradient: 'from-indigo-950/70 to-slate-900',
    actions: [
      {
        id: 'b1',
        label: 'أريد فتح حساب بنكي',
        deafPrompt: 'أريد فتح حساب جاري جديد وتوثيقه عبر النفاذ الوطني',
        hearingResponse: 'أهلاً بك، يرجى تزويدي بالهوية الوطنية لبدء التوثيق',
        visualSign: '📑',
        category: 'حسابات',
        gestureDescription: 'إشارة فتح الدفتر والتوقيع بالسبابة.',
        handShape: 'سبابة تحاكي التوقيع على راحة الكف'
      },
      {
        id: 'b2',
        label: 'بطاقة الصراف مسحوبة',
        deafPrompt: 'جهاز الصراف الآلي سحب بطاقتي وأريد إصدار بديل فوري',
        hearingResponse: 'تم إيقاف البطاقة القديمة وسنطبع لك بطاقة جديدة الآن',
        visualSign: '💳',
        category: 'طوارئ بنكية',
        gestureDescription: 'إشارة إدخال البطاقة ثم سحبها للأسفل.',
        handShape: 'كف يمثل الفتحة وبطاقة تنزلق'
      }
    ]
  },
  {
    id: 'emergency',
    title: 'الطوارئ والإنقاذ',
    icon: '🚨',
    tagline: 'بلاغات سريعة، حوادث، وإخلاء فوري',
    bgGradient: 'from-rose-950/80 to-red-950/80',
    actions: [
      {
        id: 'e1',
        label: 'حادث مروري في الموقع',
        deafPrompt: 'وقع حادث تصادم مروري في الموقع ونحتاج إسعاف ومرور',
        hearingResponse: 'تم تحديد موقعك بدقة والفرق الإسعافية في طريقها إليك',
        visualSign: '💥',
        category: 'حادث',
        gestureDescription: 'تصادم قبضتي اليدين بقوة مع تعبير حذر.',
        handShape: 'قبضتان تصطدمان بقوة'
      },
      {
        id: 'e2',
        label: 'حريق أو تصاعد دخان',
        deafPrompt: 'أرى دخاناً كثيفاً أو حريقاً بالمبنى وأحتاج للدفاع المدني',
        hearingResponse: 'يرجى إخلاء المبنى عبر مخارج الطوارئ فوراً',
        visualSign: '🔥',
        category: 'إنقاذ',
        gestureDescription: 'حركة لهب الأصابع المرتفعة مع إشارة التحذير.',
        handShape: 'أصابع متذبذبة ترتفع للأعلى كلهب النار'
      }
    ]
  },
  {
    id: 'pharmacy',
    title: 'الصيدلية وصرف الدواء',
    icon: '💊',
    tagline: 'صرف الوصفة الطبية وتعليمات الجرعات',
    bgGradient: 'from-teal-950/80 to-slate-900',
    actions: [
      {
        id: 'ph1',
        label: 'أريد صرف الوصفة الطبية',
        deafPrompt: 'معي وصفة طبية إلكترونية عبر تطبيق صحتي لصرف الدواء',
        hearingResponse: 'تفضل برقم الهوية وسأقوم بتجهيز الدواء لك فوراً',
        visualSign: '🧾',
        category: 'صيدلة',
        gestureDescription: 'إشارة تقديم الورقة ثم إشارة تناول القرص.',
        handShape: 'كف ممدود يحاكي تقديم الوصفة'
      },
      {
        id: 'ph2',
        label: 'كم حبة في اليوم؟',
        deafPrompt: 'كم عدد الجرعات والحبات اليومية المطلوبة لكل دواء؟',
        hearingResponse: 'حبة واحدة بعد الإفطار وحبة واحدة قبل النوم مع ماء وفير',
        visualSign: '🕐',
        category: 'إرشادات',
        gestureDescription: 'رفع إصبعين متبوعة بإشارة شرب الماء والشمس والقمر.',
        handShape: 'سبابة ووسطى مرفوعتان'
      }
    ]
  },
  {
    id: 'supermarket',
    title: 'السوبرماركت والتسوق',
    icon: '🛒',
    tagline: 'السؤال عن المنتجات وأسعارها وموقعها',
    bgGradient: 'from-amber-950/70 to-emerald-950/70',
    actions: [
      {
        id: 'sm1',
        label: 'أين قسم المخبوزات؟',
        deafPrompt: 'من فضلك أين أجد قسم الخبز والمنتجات الطازجة؟',
        hearingResponse: 'قسم المخبوزات في الممر الثالث على جهة اليمين',
        visualSign: '🥖',
        category: 'ملاحة داخلية',
        gestureDescription: 'إشارة الخبز بالإبهامين ثم الإشارة للجهة اليمنى.',
        handShape: 'سبابة تشير إلى الممر الأيمن'
      },
      {
        id: 'sm2',
        label: 'أين كاشير الدفع السريع؟',
        deafPrompt: 'أين يقع مسار الدفع السريع والمحاسبة الذاتية؟',
        hearingResponse: 'المحاسبة الذاتية أمام البوابة رقم 2 وتدعم مدى وآبل باي',
        visualSign: '💳',
        category: 'دفع',
        gestureDescription: 'إشارة بطاقة مدى وحركة المسح السريعة.',
        handShape: 'كف يمسك بطاقة افتراضية'
      }
    ]
  },
  {
    id: 'university',
    title: 'الجامعة وقاعة المحاضرات',
    icon: '🎓',
    tagline: 'الاستفسار عن المحاضرات، القاعات، وساعات المكتب',
    bgGradient: 'from-blue-950/80 to-indigo-950/80',
    actions: [
      {
        id: 'un1',
        label: 'أين قاعة المحاضرة؟',
        deafPrompt: 'أبحث عن قاعة المحاضرات رقم B-204 لكلية الطب',
        hearingResponse: 'القاعة في الدور الثاني، اصعد بالمصعد ستجدها أمامك',
        visualSign: '🏫',
        category: 'أكاديمي',
        gestureDescription: 'إشارة القبعة الجامعية ثم إشارة رقم القاعة.',
        handShape: 'لمس الرأس كالقبعة الجامعية'
      },
      {
        id: 'un2',
        label: 'أحتاج السلايدات وملخص المادة',
        deafPrompt: 'هل يمكن مشاركة العرض التقديمي والملاحظات المكتوبة؟',
        hearingResponse: 'تم رفع كافة الشرائط والملخصات على نظام البلاك بورد',
        visualSign: '📚',
        category: 'تعليم',
        gestureDescription: 'إشارة فتح الكتاب ثم إشارة الإرسال.',
        handShape: 'كفان يفتحان كالكتاب'
      }
    ]
  },
  {
    id: 'gas_station',
    title: 'محطة الوقود والخدمات',
    icon: '⛽',
    tagline: 'تعبئة البنزين، فحص الإطارات، والدفع',
    bgGradient: 'from-orange-950/80 to-slate-900',
    actions: [
      {
        id: 'gs1',
        label: 'تعبئة بنزين 91 فل',
        deafPrompt: 'من فضلك عبّئ الخزان بنزين 91 أخضر حتى يمتلئ (فل)',
        hearingResponse: 'حاضر، سأقوم بفتح خزان الوقود وتعبئته 91 الآن',
        visualSign: '⛽',
        category: 'وقود',
        gestureDescription: 'إشارة مقبض خرطوم البنزين ثم علامة الامتلاء.',
        handShape: 'قبضة تحاكي مقبض المضخة'
      },
      {
        id: 'gs2',
        label: 'فحص ضغط الهواء بالإطارات',
        deafPrompt: 'أرجو فحص ضغط هواء الإطارات وضبطه على 32',
        hearingResponse: 'بالتأكيد، سأفحص العجلات الأربع وضبط الضغط لك',
        visualSign: '🛞',
        category: 'صيانة',
        gestureDescription: 'حركة دائرية للعجلة ثم إشارة مقياس الضغط.',
        handShape: 'حركة كف دائرية'
      }
    ]
  },
  {
    id: 'mosque',
    title: 'المسجد وشعائر الصلاة',
    icon: '🕌',
    tagline: 'مواقيت الأذان والإقامة واتجاه القبلة',
    bgGradient: 'from-emerald-950/80 to-teal-950/80',
    actions: [
      {
        id: 'mq1',
        label: 'كم باقي على إقامة الصلاة؟',
        deafPrompt: 'كم دقيقة متبقية على إقامة صلاة الجماعة؟',
        hearingResponse: 'متبقي 5 دقائق على الإقامة، تفضل بالدخول للصف الأول',
        visualSign: '⏱️',
        category: 'صلاة',
        gestureDescription: 'إشارة رفع اليدين لتكبيرة الإحرام ثم نقر المعصم.',
        handShape: 'كفان مفتوحان بمحاذاة الأذنين'
      },
      {
        id: 'mq2',
        label: 'أين مكان الوضوء والمصاحف؟',
        deafPrompt: 'أين تقع دورات المياه وأماكن الوضوء والمصاحف؟',
        hearingResponse: 'مكان الوضوء في الجهة الخارجية يمين مدخل الجامع',
        visualSign: '💧',
        category: 'إرشادات',
        gestureDescription: 'حركة مسح الكفين بالماء ثم الإشارة للجهة اليمنى.',
        handShape: 'غسل الكفين افتراضياً'
      }
    ]
  }
];

export const PATIENT_CASES: PatientCase[] = [
  {
    id: 'p0',
    name: 'ناصر الدوسري',
    age: 42,
    gender: 'ذكر',
    clinic: 'عيادة الأنف والأذن والحنجرة',
    doctorName: 'د. وليد المالكي',
    complaint: 'انقطاع تام مفاجئ في الصوت (Aphonia) إثر التهاب حنجري حاد',
    deafMessage: 'فقدت صوتي تماماً فجأة منذ أمس ولا أستطيع النطق بأي حرف، وأشعر بحرقة وجفاف شديد في الحنجرة.',
    doctorResponse: 'أهلاً يا ناصر، سنفحص الأحبال الصوتية بالمنظار الدقيق وستتلقى بخاخاً ومهدئاً لالتهاب الحنجرة، لا تحاول إجهاد صوتك وسنتواصل عبر تطبيق مُعِين.',
    visualSign: '🔇',
    status: 'طوارئ عاجلة',
    conditionHighlight: 'حالة انقطاع الصوت التام المفاجئ — يتواصل كلياً عبر لغة الإشارة والكتابة',
    vitals: {
      heartRate: 88,
      bp: '125/82',
      temperature: '38.2°'
    }
  },
  {
    id: 'p1',
    name: 'أحمد الشمري',
    age: 34,
    gender: 'ذكر',
    clinic: 'عيادة الباطنية والجهاز الهضمي',
    doctorName: 'د. فهد العتيبي',
    complaint: 'مغص حاد في الجانب الأيمن بعد تناول وجبة طعام',
    deafMessage: 'أشعر بألم حاد ومغص بالجانب الأيمن يزداد عند الضغط، وأشعر بغثيان.',
    doctorResponse: 'أهلاً بك يا أحمد، سأقوم بفحص البطن بالأشعة التلفزيونية ونعطيك مسكناً وريدياً.',
    visualSign: '🩺',
    status: 'فحص نشط',
    conditionHighlight: 'أصم منذ الولادة — يفضل التواصل عبر تصوير مقاطع الفيديو الإشارية',
    vitals: {
      heartRate: 76,
      bp: '120/80',
      temperature: '37.1°'
    }
  },
  {
    id: 'p2',
    name: 'سارة القحطاني',
    age: 27,
    gender: 'أنثى',
    clinic: 'عيادة طب الأسنان وجراحة الفم',
    doctorName: 'د. ريم الدوسري',
    complaint: 'ألم مستمر في الضرس الخلفي وتورم طفيف في اللثة',
    deafMessage: 'الضرس الخلفي يؤلمني بشدة عند شرب الماء البارد ولا أستطيع النوم.',
    doctorResponse: 'سنقوم بتصوير أشعة سينية للضرس، ويبدو أن هناك تسوساً يحتاج لتنظيف وحشو.',
    visualSign: '🦷',
    status: 'في غرفة الانتظار',
    conditionHighlight: 'ضعف سمعي شديد — تعتمد على قراءة الشفاه وتطبيق مُعِين',
    vitals: {
      heartRate: 82,
      bp: '118/75',
      temperature: '36.8°'
    }
  },
  {
    id: 'p3',
    name: 'الطفلة ليان (مع والدتها)',
    age: 7,
    gender: 'أنثى',
    clinic: 'مركز التخاطب وزراعة القوقعة',
    doctorName: 'د. مريم السالم',
    complaint: 'برمجة وضبط معالج الصوت وزراعة القوقعة والتأهيل السمعي',
    deafMessage: 'أشعر بأصوات صفير عالية عندما أكون في المدرسة وأريد خفض حساسية الجهاز.',
    doctorResponse: 'يا أهلاً بالبطلة ليان، سنضبط الترددات ونقوم باختبار الاستجابة السمعية الممتع مع الألعاب الآن.',
    visualSign: '🦻',
    status: 'فحص نشط',
    conditionHighlight: 'تأهيل سمعي مبكر وفق برامج رؤية 2030 للطفولة',
    vitals: {
      heartRate: 90,
      bp: '105/68',
      temperature: '36.9°'
    }
  }
];
