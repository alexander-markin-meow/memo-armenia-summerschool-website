export const locales = ['en', 'hy', 'ru'] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
export type ShapeName = 'button' | 'stone' | 'metal' | 'leaf' | 'tile' | 'spool' | 'bead' | 'paper' | 'ribbon' | 'ring' | 'shard';
export type Medium = 'text' | 'photo' | 'video' | 'mixed';
export type Sensitivity = 'public' | 'review-required';

type VisibleBounds = { top: number; right: number; bottom: number; left: number };

export type CollageMetadata = {
  projectPath: string;
  dimensions: { width: number; height: number };
  visibleBounds: VisibleBounds;
  hitPadding: number;
  label: LocalizedText;
  altText: LocalizedText;
  visualWeight?: number;
};

type MuseumEntrySource = {
  slug: string;
  shape: ShapeName;
  objectName: LocalizedText;
  location: LocalizedText;
  approximateDate: LocalizedText;
  context: LocalizedText;
  project: {
    title: LocalizedText;
    participant: LocalizedText;
    medium: Medium;
    introduction: LocalizedText;
  };
  sensitivity?: Sensitivity;
};

export type MuseumEntry = Omit<MuseumEntrySource, 'sensitivity'> & { sensitivity: Sensitivity; collage: CollageMetadata };

const l = (en: string, hy: string, ru: string): LocalizedText => ({ en, hy, ru });

const fictionalEntry = (
  slug: string,
  shape: ShapeName,
  objectName: LocalizedText,
  location: LocalizedText,
  approximateDate: LocalizedText,
  context: LocalizedText,
  title: LocalizedText,
  participant: LocalizedText,
  medium: Medium,
  introduction: LocalizedText,
): MuseumEntrySource => ({
  slug,
  shape,
  objectName,
  location,
  approximateDate,
  context,
  project: { title, participant, medium, introduction },
});

const shapeProfiles: Record<ShapeName, Pick<CollageMetadata, 'dimensions' | 'visibleBounds' | 'hitPadding' | 'visualWeight'>> = {
  button: { dimensions: { width: 140, height: 140 }, visibleBounds: { top: 2, right: 2, bottom: 2, left: 2 }, hitPadding: 18, visualWeight: 1 },
  stone: { dimensions: { width: 168, height: 108 }, visibleBounds: { top: 8, right: 3, bottom: 7, left: 3 }, hitPadding: 16, visualWeight: 1.08 },
  metal: { dimensions: { width: 168, height: 132 }, visibleBounds: { top: 1, right: 0, bottom: 0, left: 3 }, hitPadding: 16, visualWeight: 1.05 },
  leaf: { dimensions: { width: 128, height: 166 }, visibleBounds: { top: 0, right: 0, bottom: 0, left: 0 }, hitPadding: 18, visualWeight: 0.94 },
  tile: { dimensions: { width: 158, height: 136 }, visibleBounds: { top: 0, right: 0, bottom: 0, left: 1 }, hitPadding: 16, visualWeight: 1.04 },
  spool: { dimensions: { width: 128, height: 166 }, visibleBounds: { top: 0, right: 0, bottom: 0, left: 0 }, hitPadding: 18, visualWeight: 0.96 },
  bead: { dimensions: { width: 140, height: 140 }, visibleBounds: { top: 1, right: 1, bottom: 1, left: 1 }, hitPadding: 18, visualWeight: 1 },
  paper: { dimensions: { width: 168, height: 132 }, visibleBounds: { top: 0, right: 0, bottom: 0, left: 0 }, hitPadding: 16, visualWeight: 1.02 },
  ribbon: { dimensions: { width: 168, height: 96 }, visibleBounds: { top: 3, right: 1, bottom: 3, left: 1 }, hitPadding: 18, visualWeight: 0.98 },
  ring: { dimensions: { width: 140, height: 140 }, visibleBounds: { top: 0, right: 0, bottom: 0, left: 0 }, hitPadding: 18, visualWeight: 1 },
  shard: { dimensions: { width: 168, height: 132 }, visibleBounds: { top: 0, right: 0, bottom: 0, left: 0 }, hitPadding: 16, visualWeight: 1.06 },
};

function withCollageMetadata(entry: MuseumEntrySource): MuseumEntry {
  return {
    ...entry,
    sensitivity: entry.sensitivity ?? 'public',
    collage: {
      projectPath: `/projects/${entry.slug}`,
      ...shapeProfiles[entry.shape],
      label: entry.project.title,
      altText: entry.objectName,
    },
  };
}

export const ui = {
  siteTitle: l('Lost and Found: Pokr Ayrum', 'Lost and Found: Pokr Ayrum', 'Lost and Found: Pokr Ayrum'),
  collection: l('Collage', 'Կոլաժ', 'Коллаж'),
  language: l('Language', 'Լեզու', 'Язык'),
  skipToContent: l('Skip to content', 'Անցնել հիմնական բովանդակությանը', 'Перейти к основному содержанию'),
  prototype: l('Fictional prototype content', 'Հորինված նախատիպային բովանդակություն', 'Вымышленный прототипный контент'),
  prototypeLong: l(
    'All objects, places, dates, people, and projects shown here are fictional examples created for interface testing.',
    'Այստեղ ներկայացված բոլոր առարկաները, վայրերը, ամսաթվերը, մարդիկ և նախագծերը հորինված օրինակներ են՝ միջերեսի փորձարկման համար։',
    'Все показанные здесь объекты, места, даты, люди и проекты — вымышленные примеры для тестирования интерфейса.',
  ),
  introTitle: l('Start with a found object.', 'Սկսեք գտնված առարկայից։', 'Начните с найденного предмета.'),
  introText: l(
    'A digital collection connecting local fragments to participant projects from the “Person in History” summer school in Lori, Armenia.',
    'Թվային հավաքածու, որը կապում է տեղական բեկորները Լոռիում «մարդը պատմության մեջ» ամառային դպրոցի մասնակիցների նախագծերի հետ։',
    'Цифровая коллекция, соединяющая местные фрагменты с проектами участников летней школы «человек в истории» в Лори, Армения.',
  ),
  collageInstruction: l(
    'Choose an object to open its project.',
    'Ընտրեք առարկա՝ դրա նախագիծը բացելու համար։',
    'Выберите предмет, чтобы открыть его проект.',
  ),
  openProject: l('Open project', 'Բացել նախագիծը', 'Открыть проект'),
  research: l('Research', 'Հետազոտություն', 'Исследование'),
  researchTitle: l('The summer school, in progress.', 'Ամառային դպրոցը՝ ընթացքի մեջ։', 'Летняя школа в процессе.'),
  researchIntro: l(
    'A working record of how projects developed: interviews, shared questions, experiments, and trials. This page tests an editorial structure; it is not a catalogue or a finished archive.',
    'Նախագծերի զարգացման աշխատանքային գրառում՝ հարցազրույցներ, ընդհանուր հարցեր, փորձարկումներ և փորձեր։ Այս էջը ստուգում է խմբագրական կառուցվածքը և ոչ կատալոգ է, ոչ էլ ավարտված արխիվ։',
    'Рабочая запись о том, как развивались проекты: интервью, общие вопросы, эксперименты и пробы. Эта страница проверяет редакционную структуру; это не каталог и не готовый архив.',
  ),
  researchProjects: l('Project paths', 'Նախագծերի ուղիներ', 'Траектории проектов'),
  researchProjectsText: l(
    'Found objects opened several possible routes into stories. These links use fictional projects to test how the research record can lead back into the collage.',
    'Գտնված առարկաները պատմությունների մի քանի հնարավոր ուղիներ բացեցին։ Այս հղումները օգտագործում են հորինված նախագծեր՝ ստուգելու համար, թե ինչպես կարող է հետազոտական գրառումը վերադառնալ կոլաժ։',
    'Найденные предметы открыли несколько возможных путей к историям. Эти ссылки ведут к вымышленным проектам и проверяют, как исследовательская запись может возвращать в коллаж.',
  ),
  researchInterviews: l('Interviews', 'Հարցազրույցներ', 'Интервью'),
  researchInterviewsText: l(
    'Testimony is treated as a relationship, not raw material: record context, consent, edit decisions, translation status, and what must remain private before publishing an extract.',
    'Վկայությունը դիտվում է որպես հարաբերություն, ոչ թե հումք․ հատված հրապարակելուց առաջ գրանցվում են համատեքստը, համաձայնությունը, մոնտաժի որոշումները, թարգմանության վիճակը և այն, ինչ պետք է մնա գաղտնի։',
    'Свидетельство рассматривается как отношение, а не сырьё: до публикации фрагмента фиксируются контекст, согласие, монтажные решения, статус перевода и то, что должно остаться закрытым.',
  ),
  researchConcepts: l('Questions and concepts', 'Հարցեր և հասկացություններ', 'Вопросы и понятия'),
  researchConceptsText: l(
    'How is a home lost or remade? What can an everyday object remember? How do movement, work, family, and local tradition alter one another?',
    'Ինչպե՞ս է տունը կորչում կամ վերակերտվում։ Ի՞նչ կարող է հիշել առօրյա առարկան։ Ինչպե՞ս են շարժումը, աշխատանքը, ընտանիքը և տեղական ավանդույթը փոխում միմյանց։',
    'Как дом теряется или создаётся заново? Что способен помнить повседневный предмет? Как движение, труд, семья и местная традиция меняют друг друга?',
  ),
  researchExperiments: l('Experiments and trials', 'Փորձարկումներ և փորձեր', 'Эксперименты и пробы'),
  researchExperimentsText: l(
    'Field recordings, object rubbings, image sequences, fragments of voice, walks, and abandoned structures became provisional ways to test an idea before choosing a final form.',
    'Դաշտային ձայնագրությունները, առարկաների արտատպումները, պատկերների շարքերը, ձայնի հատվածները, քայլարշավները և լքված կառույցները դարձան գաղափարը վերջնական ձև ընտրելուց առաջ փորձելու ժամանակավոր եղանակներ։',
    'Полевые записи, отпечатки предметов, последовательности изображений, фрагменты голоса, прогулки и заброшенные строения стали временными способами проверить идею до выбора окончательной формы.',
  ),
  researchProcess: l('Process notes', 'Գործընթացի գրառումներ', 'Заметки о процессе'),
  researchProcessText: l(
    'Backstage material belongs here separately from the finished works: false starts, conversations, sketches, editing choices, and questions that remained unresolved.',
    'Կուլիսային նյութն այստեղ ներկայացվում է ավարտված աշխատանքներից առանձին՝ անհաջող սկիզբներ, զրույցներ, ուրվագծեր, մոնտաժի ընտրություններ և չլուծված հարցեր։',
    'Материалы о процессе находятся здесь отдельно от законченных работ: неудачные начала, разговоры, наброски, монтажные решения и вопросы без окончательного ответа.',
  ),
  researchMapLater: l(
    'A map may become another route through this material later. It is intentionally outside this prototype update.',
    'Քարտեզը հետագայում կարող է դառնալ այս նյութով անցնելու մեկ այլ ուղի։ Այն միտումնավոր դուրս է այս նախատիպային թարմացման շրջանակից։',
    'Позже карта может стать ещё одним маршрутом по этим материалам. В это обновление прототипа она намеренно не входит.',
  ),
  about: l('About', 'Մասին', 'О проекте'),
  aboutText: l(
    'A public digital museum concept based on the “Person in History” summer school in Lori, Armenia. This prototype uses fictional material while its content model and care principles are developed.',
    'Հանրային թվային թանգարանի գաղափար՝ հիմնված Լոռիում «մարդը պատմության մեջ» ամառային դպրոցի վրա։ Այս նախատիպն օգտագործում է հորինված նյութ, մինչ մշակվում են բովանդակության մոդելն ու խնամքի սկզբունքները։',
    'Концепция публичного цифрового музея, основанная на летней школе «человек в истории» в Лори, Армения. Этот прототип использует вымышленный материал, пока разрабатываются модель содержания и принципы бережной работы.',
  ),
  socialMedia: l('Social media', 'Սոցիալական մեդիա', 'Социальные сети'),
  socialPending: l(
    'Official links will appear here.',
    'Պաշտոնական հղումները կհայտնվեն այստեղ։',
    'Официальные ссылки появятся здесь.',
  ),
  credits: l('Credits', 'Հեղինակներ', 'Создатели'),
  creditsText: l(
    'Person in History · Site design and development: Alex Markin · 2026',
    '«մարդը պատմության մեջ» · կայքի դիզայն և մշակում՝ Ալեքս Մարկին · 2026',
    '«человек в истории» · дизайн и разработка сайта: Алекс Маркин · 2026',
  ),
  backCollection: l('Back to collection', 'Վերադառնալ հավաքածու', 'Вернуться к коллекции'),
  foundObject: l('Found object', 'Գտնված առարկա', 'Найденный объект'),
  participantProject: l('Participant project', 'Մասնակցի նախագիծ', 'Проект участника'),
  place: l('Place', 'Վայր', 'Место'),
  date: l('Date', 'Ամսաթիվ', 'Дата'),
  medium: l('Medium', 'Մեդիա', 'Медиа'),
  pseudonym: l('pseudonym', 'կեղծանուն', 'псевдоним'),
  previous: l('Previous', 'Նախորդ', 'Предыдущий'),
  next: l('Next', 'Հաջորդ', 'Следующий'),
  adjacentProjects: l('Adjacent projects', 'Հարակից նախագծեր', 'Соседние проекты'),
  gallery: l('Placeholder gallery', 'Պատկերասրահի տեղապահ', 'Макет галереи'),
  video: l('Video placeholder', 'Տեսանյութի տեղապահ', 'Макет видео'),
  playVideo: l('Play prototype video', 'Նվագարկել նախատիպային տեսանյութը', 'Воспроизвести прототипное видео'),
  story: l('Prototype project text', 'Նախատիպային նախագծի տեքստ', 'Текст прототипного проекта'),
  storyOne: l(
    'This deliberately short fictional passage demonstrates the reading width and rhythm for a participant’s future work.',
    'Այս միտումնավոր կարճ հորինված հատվածը ցույց է տալիս մասնակցի ապագա աշխատանքի ընթերցման լայնությունն ու ռիթմը։',
    'Этот намеренно короткий вымышленный фрагмент показывает ширину строки и ритм будущей работы участника.',
  ),
  storyTwo: l(
    'The object is a gateway, not an authenticated artefact. Real content will replace this text only after attribution and consent review.',
    'Առարկան մուտք է, ոչ թե հաստատված պատմական նմուշ։ Իրական բովանդակությունը կփոխարինի այս տեքստին միայն հեղինակության և համաձայնության ստուգումից հետո։',
    'Объект служит входом, а не подтверждённым артефактом. Реальные материалы заменят этот текст только после проверки авторства и согласия.',
  ),
  notFound: l('This project was not found.', 'Այս նախագիծը չի գտնվել։', 'Этот проект не найден.'),
};

const entrySources: MuseumEntrySource[] = [
  {
    slug: 'blue-coat-button',
    shape: 'bead',
    objectName: l('Blue coat button', 'Կապույտ վերարկուի կոճակ', 'Пуговица от синего пальто'),
    location: l('Dsegh, Lori', 'Դսեղ, Լոռի', 'Дсех, Лори'),
    approximateDate: l('c. 1990s — prototype date', 'մոտ 1990-ականներ — նախատիպային ամսաթիվ', 'ок. 1990-х — дата прототипа'),
    context: l(
      'A fictional coat button imagined for a prototype story about repair, care, and everyday winter routines.',
      'Հորինված վերարկուի կոճակ՝ նախատիպային պատմության համար՝ վերանորոգման, խնամքի և ձմեռային առօրյայի մասին։',
      'Вымышленная пуговица от пальто для прототипной истории о ремонте, заботе и зимней повседневности.',
    ),
    project: {
      title: l('Three Missing Stitches', 'Երեք բացակայող կար', 'Три недостающих стежка'),
      participant: l('Arpi K.', 'Արփի Կ.', 'Арпи К.'),
      medium: 'text',
      introduction: l(
        'A short fictional note that follows a button through mending hands and changing seasons.',
        'Կարճ հորինված գրառում՝ կոճակի ճանապարհի մասին՝ վերանորոգող ձեռքերի և փոփոխվող եղանակների միջով։',
        'Короткая вымышленная заметка о пуговице, проходящей через руки, занятые починкой, и смену сезонов.',
      ),
    },
  },
  {
    slug: 'riverbank-stone',
    shape: 'stone',
    objectName: l('Riverbank stone', 'Գետափի քար', 'Камень с берега реки'),
    location: l('Stepanavan, Lori', 'Ստեփանավան, Լոռի', 'Степанаван, Лори'),
    approximateDate: l('Undated — prototype object', 'Ամսաթվագրված չէ — նախատիպային առարկա', 'Без даты — объект прототипа'),
    context: l(
      'A fictional smooth stone used as a prompt for noticing scale, touch, and imagined river routes.',
      'Հորինված հարթ քար՝ մասշտաբի, շփման և երևակայական գետուղիների մասին մտածելու համար։',
      'Вымышленный гладкий камень как повод задуматься о масштабе, прикосновении и воображаемых речных маршрутах.',
    ),
    project: {
      title: l('Weight of a Small River', 'Փոքր գետի ծանրությունը', 'Вес маленькой реки'),
      participant: l('M. Vardan', 'Մ. Վարդան', 'М. Вардан'),
      medium: 'photo',
      introduction: l(
        'A fictional photographic study of one stone placed against broad, invented landscapes.',
        'Հորինված լուսանկարչական ուսումնասիրություն՝ մեկ քարի և ընդարձակ երևակայական բնապատկերների համադրությամբ։',
        'Вымышленное фотографическое исследование одного камня на фоне широких воображаемых ландшафтов.',
      ),
    },
  },
  {
    slug: 'folded-metal-fragment',
    shape: 'metal',
    objectName: l('Folded metal fragment', 'Ծռված մետաղական բեկոր', 'Согнутый металлический фрагмент'),
    location: l('Alaverdi, Lori', 'Ալավերդի, Լոռի', 'Алаверди, Лори'),
    approximateDate: l('c. 1970s — prototype date', 'մոտ 1970-ականներ — նախատիպային ամսաթիվ', 'ок. 1970-х — дата прототипа'),
    context: l(
      'A fictional bent fragment proposed as a prompt about sound, work, and materials without assigning a real origin.',
      'Հորինված ծռված բեկոր՝ ձայնի, աշխատանքի և նյութերի մասին մտածելու համար՝ առանց իրական ծագում վերագրելու։',
      'Вымышленный изогнутый фрагмент как повод подумать о звуке, труде и материалах без приписывания реального происхождения.',
    ),
    project: {
      title: l('Listening to the Edge', 'Լսելով եզրը', 'Слушая край'),
      participant: l('Lilit S.', 'Լիլիթ Ս.', 'Лилит С.'),
      medium: 'video',
      introduction: l(
        'A fictional video score built from soft taps, pauses, and close views of a folded surface.',
        'Հորինված տեսաձայնային էտյուդ՝ մեղմ հարվածներից, դադարներից և ծռված մակերեսի խոշոր պլաններից։',
        'Вымышленный видеоэтюд из тихих касаний, пауз и крупных планов изогнутой поверхности.',
      ),
    },
  },
  {
    slug: 'pressed-wild-leaf',
    shape: 'leaf',
    objectName: l('Pressed wild leaf', 'Սեղմված վայրի տերև', 'Засушенный дикий лист'),
    location: l('Odzun, Lori', 'Օձուն, Լոռի', 'Одзун, Лори'),
    approximateDate: l('c. 2020s — prototype date', 'մոտ 2020-ականներ — նախատիպային ամսաթիվ', 'ок. 2020-х — дата прототипа'),
    context: l(
      'A fictional pressed leaf representing a temporary observation rather than a botanical record.',
      'Հորինված սեղմված տերև՝ անցողիկ դիտարկում ներկայացնելու համար, ոչ թե բուսաբանական գրանցում։',
      'Вымышленный засушенный лист, представляющий мимолётное наблюдение, а не ботаническую запись.',
    ),
    project: {
      title: l('A Map That Drifts', 'Թափառող քարտեզ', 'Карта, которая дрейфует'),
      participant: l('Nare A.', 'Նարե Ա.', 'Наре А.'),
      medium: 'mixed',
      introduction: l(
        'A fictional assemblage of leaf rubbings, lines, and remembered routes that never settles into one map.',
        'Հորինված համադրություն՝ տերևի դրոշմներից, գծերից և հիշվող ուղիներից, որը չի դառնում մեկ կայուն քարտեզ։',
        'Вымышленная композиция из отпечатков листа, линий и запомнившихся маршрутов, не складывающаяся в одну карту.',
      ),
    },
  },
  {
    slug: 'green-glazed-tile-shard',
    shape: 'paper',
    objectName: l('Green glazed tile shard', 'Կանաչ ջնարակապատ սալիկի բեկոր', 'Фрагмент зелёной глазурованной плитки'),
    location: l('Tumanyan, Lori', 'Թումանյան, Լոռի', 'Туманян, Лори'),
    approximateDate: l('c. 1980s — prototype date', 'մոտ 1980-ականներ — նախատիպային ամսաթիվ', 'ок. 1980-х — дата прототипа'),
    context: l(
      'A fictional glazed tile shard used to explore fragments, colour, and imagined domestic spaces.',
      'Հորինված ջնարակապատ սալիկի բեկոր՝ բեկորների, գույնի և երևակայական տնային տարածքների մասին մտածելու համար։',
      'Вымышленный фрагмент глазурованной плитки для размышления о цвете и воображаемых домашних пространствах.',
    ),
    project: {
      title: l('Green Room, Unbuilt', 'Կանաչ սենյակ՝ չկառուցված', 'Зелёная комната, которой нет'),
      participant: l('Sona D.', 'Սոնա Դ.', 'Сона Д.'),
      medium: 'photo',
      introduction: l(
        'A fictional photo series that lets one green surface suggest rooms, windows, and possible futures.',
        'Հորինված լուսանկարների շարք, որտեղ մեկ կանաչ մակերեսը հուշում է սենյակներ, պատուհաններ և հնարավոր ապագաներ։',
        'Вымышленная фотосерия, в которой одна зелёная поверхность намекает на комнаты, окна и возможные будущие.',
      ),
    },
  },
  {
    slug: 'red-thread-spool',
    shape: 'spool',
    objectName: l('Red thread spool', 'Կարմիր թելի կոճ', 'Катушка красных ниток'),
    location: l('Spitak, Lori', 'Սպիտակ, Լոռի', 'Спитак, Лори'),
    approximateDate: l('c. 2000s — prototype date', 'մոտ 2000-ականներ — նախատիպային ամսաթիվ', 'ок. 2000-х — дата прототипа'),
    context: l(
      'A fictional spool of red thread inviting a gentle reflection on connection, repair, and unfinished work.',
      'Կարմիր թելի հորինված կոճ՝ կապի, վերանորոգման և անավարտ աշխատանքի մասին նուրբ մտորումների համար։',
      'Вымышленная катушка красных ниток для бережного размышления о связи, починке и незавершённой работе.',
    ),
    project: {
      title: l('What the Thread Holds', 'Ինչ է պահում թելը', 'Что держит нить'),
      participant: l('T. Mariam', 'Տ. Մարիամ', 'Т. Мариам'),
      medium: 'mixed',
      introduction: l(
        'A fictional combination of spoken words, still images, and a hand-drawn line that joins without tying a knot.',
        'Հորինված համադրություն՝ խոսքային հատվածների, անշարժ պատկերների և ձեռքով գծված գծի, որը միացնում է՝ առանց հանգույց կապելու։',
        'Вымышленное сочетание устных фрагментов, неподвижных изображений и линии, которая соединяет, не завязывая узел.',
      ),
    },
  },
  {
    slug: 'amber-glass-bead',
    shape: 'button',
    objectName: l('Amber glass bead', 'Սաթագույն ապակե ուլունք', 'Янтарная стеклянная бусина'),
    location: l('Mets Ayrum, Lori', 'Մեծ Այրում, Լոռի', 'Мец Айрум, Лори'),
    approximateDate: l('Undated — prototype object', 'Ամսաթվագրված չէ — նախատիպային առարկա', 'Без даты — объект прототипа'),
    context: l(
      'A fictional amber-coloured bead, imagined as a small lens for stories about light and passing time.',
      'Սաթագույն հորինված ուլունք՝ որպես լույսի և անցնող ժամանակի պատմությունների փոքր ոսպնյակ։',
      'Вымышленная янтарная бусина — маленькая линза для историй о свете и проходящем времени.',
    ),
    project: {
      title: l('The Light Between Steps', 'Լույսը քայլերի միջև', 'Свет между шагами'),
      participant: l('Anush R.', 'Անուշ Ռ.', 'Ануш Р.'),
      medium: 'photo',
      introduction: l(
        'A fictional photo sequence that follows a glint from a doorstep to an imagined hillside path.',
        'Հորինված լուսաշարք, որը հետևում է փայլին՝ շեմքից մինչև երևակայական բլրի արահետ։',
        'Вымышленная фотопоследовательность, которая ведёт за бликом от порога к воображаемой тропе на склоне.',
      ),
    },
  },
  {
    slug: 'charcoal-rubbing',
    shape: 'tile',
    objectName: l('Charcoal rubbing', 'Ածխային դրոշմ', 'Угольный оттиск'),
    location: l('Shnogh, Lori', 'Շնող, Լոռի', 'Шнох, Лори'),
    approximateDate: l('c. 2010s — prototype date', 'մոտ 2010-ականներ — նախատիպային ամսաթիվ', 'ок. 2010-х — дата прототипа'),
    context: l(
      'A fictional paper rubbing that records no real inscription, only the pressure of a hand in a prototype exercise.',
      'Հորինված թղթե դրոշմ, որը չի արձանագրում իրական գրություն, այլ միայն ձեռքի ճնշում նախատիպային փորձի մեջ։',
      'Вымышленный бумажный оттиск без реальной надписи — только давление руки в прототипном упражнении.',
    ),
    project: {
      title: l('Surface, Remembered', 'Հիշված մակերես', 'Поверхность в памяти'),
      participant: l('Gor H.', 'Գոռ Հ.', 'Гор Х.'),
      medium: 'text',
      introduction: l(
        'A fictional fragment about touch as a way of noticing what cannot be read aloud.',
        'Հորինված հատված՝ շփման մասին՝ որպես այն նկատելու ձև, ինչը բարձրաձայն չի կարդացվում։',
        'Вымышленный фрагмент о прикосновении как способе заметить то, что нельзя прочесть вслух.',
      ),
    },
  },
  {
    slug: 'brass-keyhole-plate',
    shape: 'shard',
    objectName: l('Brass keyhole plate', 'Փականանցքի պղնձե թիթեղ', 'Латунная накладка от замочной скважины'),
    location: l('Kurtan, Lori', 'Կուրթան, Լոռի', 'Куртан, Лори'),
    approximateDate: l('c. 1960s — prototype date', 'մոտ 1960-ականներ — նախատիպային ամսաթիվ', 'ок. 1960-х — дата прототипа'),
    context: l(
      'A fictional brass plate offered as a prompt about thresholds without linking it to a real house or family.',
      'Հորինված պղնձե թիթեղ՝ շեմերի մասին մտածելու առիթ, առանց այն կապելու իրական տան կամ ընտանիքի հետ։',
      'Вымышленная латунная накладка как повод подумать о порогах, не связывая её с реальным домом или семьёй.',
    ),
    project: {
      title: l('Who Kept the Door', 'Ով պահեց դուռը', 'Кто держал дверь'),
      participant: l('Mika P.', 'Միկա Պ.', 'Мика П.'),
      medium: 'video',
      introduction: l(
        'A fictional quiet film score built around openings, pauses, and the sound of an imagined latch.',
        'Հորինված հանգիստ կինոէտյուդ՝ բացվածքների, դադարների և երևակայական փականի ձայնի շուրջ։',
        'Вымышленный тихий киноэтюд об открытиях, паузах и звуке воображаемой защёлки.',
      ),
    },
  },
  {
    slug: 'mossy-ceramic-chip',
    shape: 'stone',
    objectName: l('Mossy ceramic chip', 'Մամռապատ կերամիկական կտոր', 'Керамический осколок с мхом'),
    location: l('Haghpat, Lori', 'Հաղպատ, Լոռի', 'Ахпат, Лори'),
    approximateDate: l('c. 1980s — prototype date', 'մոտ 1980-ականներ — նախատիպային ամսաթիվ', 'ок. 1980-х — дата прототипа'),
    context: l(
      'A fictional ceramic chip whose mossy colour is a visual prompt, not a claim about a real excavation.',
      'Հորինված կերամիկական կտոր, որի մամռագույնը տեսողական հուշում է, ոչ թե իրական պեղման մասին պնդում։',
      'Вымышленный керамический осколок, чей мшистый цвет служит зрительной подсказкой, а не заявлением о раскопках.',
    ),
    project: {
      title: l('Weather for a Fragment', 'Եղանակ բեկորի համար', 'Погода для фрагмента'),
      participant: l('Lena V.', 'Լենա Վ.', 'Лена В.'),
      medium: 'mixed',
      introduction: l(
        'A fictional collage of colour notes and weather words gathered around one imperfect edge.',
        'Հորինված կոլաժ՝ գունային նշումներից և եղանակային բառերից՝ մեկ անկատար եզրի շուրջ։',
        'Вымышленный коллаж из цветовых заметок и слов о погоде вокруг одного несовершенного края.',
      ),
    },
  },
  {
    slug: 'paper-seed-envelope',
    shape: 'paper',
    objectName: l('Paper seed envelope', 'Թղթե սերմերի ծրար', 'Бумажный пакетик для семян'),
    location: l('Vahagnadzor, Lori', 'Վահագնաձոր, Լոռի', 'Вահагнадзор, Лори'),
    approximateDate: l('c. 2000s — prototype date', 'մոտ 2000-ականներ — նախատիպային ամսաթիվ', 'ок. 2000-х — дата прототипа'),
    context: l(
      'A fictional folded seed envelope that holds imagined names rather than real collected plants.',
      'Հորինված ծալված սերմերի ծրար, որը պահում է երևակայական անուններ, ոչ թե իրական հավաքված բույսեր։',
      'Вымышленный сложенный пакетик для семян с воображаемыми названиями, а не реальными собранными растениями.',
    ),
    project: {
      title: l('Names for a Future Garden', 'Ապագա այգու անուններ', 'Названия для будущего сада'),
      participant: l('Sirus M.', 'Սիրուս Մ.', 'Сирус М.'),
      medium: 'text',
      introduction: l(
        'A fictional list-poem that lets unnamed seeds become a shared vocabulary for care.',
        'Հորինված բանաստեղծական ցանկ, որտեղ անանուն սերմերը դառնում են խնամքի ընդհանուր բառապաշար։',
        'Вымышленное стихотворение-список, в котором безымянные семена становятся общим словарём заботы.',
      ),
    },
  },
  {
    slug: 'copper-wire-loop',
    shape: 'ring',
    objectName: l('Copper wire loop', 'Պղնձե լարի օղակ', 'Петля медной проволоки'),
    location: l('Akhtala, Lori', 'Ախթալա, Լոռի', 'Ахтала, Лори'),
    approximateDate: l('Undated — prototype object', 'Ամսաթվագրված չէ — նախատիպային առարկա', 'Без даты — объект прототипа'),
    context: l(
      'A fictional loop of copper wire for thinking about circuits, repair, and routes that return.',
      'Պղնձե լարի հորինված օղակ՝ շղթաների, վերանորոգման և վերադարձող ուղիների մասին մտածելու համար։',
      'Вымышленная петля медной проволоки для размышления о цепях, ремонте и маршрутах, которые возвращаются.',
    ),
    project: {
      title: l('A Circuit of Listening', 'Լսելու շղթա', 'Цепь слушания'),
      participant: l('Ruben L.', 'Ռուբեն Լ.', 'Рубен Л.'),
      medium: 'video',
      introduction: l(
        'A fictional sound-and-image study in which a line carries a question around a room.',
        'Հորինված ձայնա-պատկերային ուսումնասիրություն, որտեղ գիծը հարց է տանում սենյակի շուրջ։',
        'Вымышленное звуковое и визуальное исследование, в котором линия несёт вопрос по комнате.',
      ),
    },
  },
  {
    slug: 'faded-bus-ticket',
    shape: 'paper',
    objectName: l('Faded bus ticket', 'Խունացած ավտոբուսի տոմս', 'Выцветший автобусный билет'),
    location: l('Vanadzor, Lori', 'Վանաձոր, Լոռի', 'Ванадзор, Лори'),
    approximateDate: l('c. 1990s — prototype date', 'մոտ 1990-ականներ — նախատիպային ամսաթիվ', 'ок. 1990-х — дата прототипа'),
    context: l(
      'A fictional ticket with invented routes and dates, used only to explore how a journey may be remembered.',
      'Հորինված տոմս՝ երևակայական երթուղիներով և ամսաթվերով, որը ծառայում է միայն ճանապարհի հիշողությունն ուսումնասիրելուն։',
      'Вымышленный билет с придуманными маршрутами и датами, нужный только для разговора о памяти путешествия.',
    ),
    project: {
      title: l('Last Stop, First Story', 'Վերջին կանգառ, առաջին պատմություն', 'Конечная, первая история'),
      participant: l('Eva T.', 'Եվա Տ.', 'Ева Т.'),
      medium: 'photo',
      introduction: l(
        'A fictional image essay assembled from windows, waiting places, and routes that do not appear on a map.',
        'Հորինված պատկերային էսսե՝ պատուհաններից, սպասման վայրերից և քարտեզում չերևացող երթուղիներից։',
        'Вымышленное фотоэссе из окон, мест ожидания и маршрутов, которых нет на карте.',
      ),
    },
  },
  {
    slug: 'dried-apple-slice',
    shape: 'shard',
    objectName: l('Dried apple slice', 'Չորացրած խնձորի շերտ', 'Сушёная долька яблока'),
    location: l('Pambak, Lori', 'Փամբակ, Լոռի', 'Памбак, Лори'),
    approximateDate: l('c. 2020s — prototype date', 'մոտ 2020-ականներ — նախատիպային ամսաթիվ', 'ок. 2020-х — дата прототипа'),
    context: l(
      'A fictional dried apple slice, offered as an ordinary seasonal marker rather than a documented food history.',
      'Չորացրած խնձորի հորինված շերտ՝ որպես սովորական սեզոնային նշան, ոչ թե սննդի փաստագրված պատմություն։',
      'Вымышленная сушёная долька яблока как простой сезонный знак, а не документальная история еды.',
    ),
    project: {
      title: l('A Season Kept in Paper', 'Թղթում պահված եղանակ', 'Сезон, сохранённый в бумаге'),
      participant: l('Mariam O.', 'Մարիամ Օ.', 'Мариам О.'),
      medium: 'mixed',
      introduction: l(
        'A fictional exchange of recipes, colour swatches, and remembered conversations about autumn.',
        'Հորինված փոխանակում՝ բաղադրատոմսերի, գունային նմուշների և աշնան մասին հիշվող զրույցների։',
        'Вымышленный обмен рецептами, цветовыми образцами и запомнившимися разговорами об осени.',
      ),
    },
  },
  fictionalEntry(
    'weathered-matchbook', 'paper',
    l('Weathered matchbook', 'Մաշված լուցկու տուփ', 'Потёртый коробок спичек'),
    l('Sarchapet, Lori', 'Սարչապետ, Լոռի', 'Сарчапет, Лори'),
    l('c. 1990s — prototype date', 'մոտ 1990-ականներ — նախատիպային ամսաթիվ', 'ок. 1990-х — дата прототипа'),
    l('A fictional empty matchbook that suggests warmth, waiting, and an invented evening gathering.', 'Հորինված դատարկ լուցկու տուփ, որը հուշում է ջերմություն, սպասում և երևակայական երեկոյան հավաք։', 'Вымышленный пустой коробок спичек, напоминающий о тепле, ожидании и придуманной вечерней встрече.'),
    l('Strike a Small Light', 'Վառիր փոքր լույս', 'Зажечь маленький свет'), l('Rosa N.', 'Ռոզա Ն.', 'Роза Н.'), 'text',
    l('A fictional note about the rituals that make a room feel occupied.', 'Հորինված գրառում այն ծեսերի մասին, որոնք սենյակը կենդանի են դարձնում։', 'Вымышленная заметка о ритуалах, которые делают комнату обжитой.'),
  ),
  fictionalEntry(
    'blue-enamel-cap', 'bead',
    l('Blue enamel cap', 'Կապույտ էմալե կափարիչ', 'Синяя эмалированная крышка'),
    l('Lernapat, Lori', 'Լեռնապատ, Լոռի', 'Лернапaт, Лори'),
    l('Undated — prototype object', 'Ամսաթվագրված չէ — նախատիպային առարկա', 'Без даты — объект прототипа'),
    l('A fictional blue cap used as a prompt for small domestic systems and shared water.', 'Հորինված կապույտ կափարիչ՝ փոքր կենցաղային համակարգերի և կիսվող ջրի մասին մտածելու համար։', 'Вымышленная синяя крышка как повод подумать о маленьких домашних системах и общей воде.'),
    l('Blue, Held Open', 'Կապույտ՝ բաց պահված', 'Синий, оставленный открытым'), l('S. Avo', 'Ս. Ավո', 'С. Аво'), 'photo',
    l('A fictional photo study of blue surfaces, jars, and borrowed containers.', 'Հորինված լուսանկարչական ուսումնասիրություն՝ կապույտ մակերեսների, բանկաների և փոխառված տարաների մասին։', 'Вымышленное фотонаблюдение за синими поверхностями, банками и одолженными ёмкостями.'),
  ),
  fictionalEntry(
    'twine-knot', 'ribbon',
    l('Twine knot', 'Թելի հանգույց', 'Узел бечёвки'),
    l('Bazum, Lori', 'Բազում, Լոռի', 'Базум, Лори'),
    l('c. 2000s — prototype date', 'մոտ 2000-ականներ — նախատիպային ամսաթիվ', 'ок. 2000-х — дата прототипа'),
    l('A fictional knot of rough twine, imagined as a temporary way to keep things together.', 'Կոպիտ թելի հորինված հանգույց՝ որպես իրերը ժամանակավորապես մի պահելու ձև։', 'Вымышленный узел грубой бечёвки — временный способ удерживать вещи вместе.'),
    l('How a Knot Waits', 'Ինչպես է հանգույցը սպասում', 'Как ждёт узел'), l('Davit E.', 'Դավիթ Ե.', 'Давит Е.'), 'mixed',
    l('A fictional score of gestures, pauses, and things tied for later.', 'Հորինված պարտիտուրա՝ ժեստերի, դադարների և հետո համար կապված իրերի մասին։', 'Вымышленная партитура жестов, пауз и вещей, связанных на потом.'),
  ),
  fictionalEntry(
    'slate-pencil-stub', 'stone',
    l('Slate pencil stub', 'Թերթաքարե մատիտի կտոր', 'Огрызок грифельного карандаша'),
    l('Jrashen, Lori', 'Ջրաշեն, Լոռի', 'Джрашен, Лори'),
    l('c. 1970s — prototype date', 'մոտ 1970-ականներ — նախատիպային ամսաթիվ', 'ок. 1970-х — дата прототипа'),
    l('A fictional pencil stub that marks an imagined list without preserving any real handwriting.', 'Հորինված մատիտի կտոր, որը նշում է երևակայական ցանկ՝ չպահպանելով իրական ձեռագիր։', 'Вымышленный огрызок карандаша, отмечающий придуманную запись без сохранения реального почерка.'),
    l('Margins for a Voice', 'Դաշտեր ձայնի համար', 'Поля для голоса'), l('Meline G.', 'Մելինե Գ.', 'Мелине Г.'), 'text',
    l('A fictional page that leaves its most important lines at the edge.', 'Հորինված էջ, որը կարևոր տողերը թողնում է եզրին։', 'Вымышленная страница, оставляющая самые важные строки на полях.'),
  ),
  fictionalEntry(
    'nickel-washer', 'ring',
    l('Nickel washer', 'Նիկելե օղակ', 'Никелевая шайба'),
    l('Gugark, Lori', 'Գուգարք, Լոռի', 'Гугарк, Лори'),
    l('Undated — prototype object', 'Ամսաթվագրված չէ — նախատիպային առարկա', 'Без даты — объект прототипа'),
    l('A fictional metal ring proposed as a small question about pressure, fitting, and repair.', 'Հորինված մետաղե օղակ՝ ճնշման, համապատասխանեցման և վերանորոգման մասին փոքր հարցի համար։', 'Вымышленное металлическое кольцо как маленький вопрос о давлении, совпадении и ремонте.'),
    l('The Space Around a Bolt', 'Պտուտակի շուրջ տարածություն', 'Пространство вокруг болта'), l('Karo J.', 'Կարո Ջ.', 'Каро Д.'), 'video',
    l('A fictional close-up film of circles, tools, and interrupted work.', 'Հորինված խոշոր պլանով ֆիլմ՝ շրջանների, գործիքների և ընդհատված աշխատանքի մասին։', 'Вымышленный крупноплановый фильм о кругах, инструментах и прерванной работе.'),
  ),
  fictionalEntry(
    'violet-bottle-fragment', 'shard',
    l('Violet bottle fragment', 'Մանուշակագույն շշի բեկոր', 'Фрагмент фиолетовой бутылки'),
    l('Fioletovo, Lori', 'Ֆիոլետովո, Լոռի', 'Фиолетово, Лори'),
    l('c. 1980s — prototype date', 'մոտ 1980-ականներ — նախատիպային ամսաթիվ', 'ок. 1980-х — дата прототипа'),
    l('A fictional coloured fragment that catches light without claiming a real source or use.', 'Գունավոր հորինված բեկոր, որը բռնում է լույսը՝ չպնդելով իրական ծագում կամ գործածություն։', 'Вымышленный цветной фрагмент, ловящий свет без заявления о реальном происхождении или применении.'),
    l('Purple at the Window', 'Մանուշակագույնը պատուհանի մոտ', 'Фиолетовый у окна'), l('Nina B.', 'Նինա Բ.', 'Нина Б.'), 'photo',
    l('A fictional sequence in which one colour changes a room by degrees.', 'Հորինված շարք, որտեղ մեկ գույն աստիճանաբար փոխում է սենյակը։', 'Вымышленная серия, в которой один цвет постепенно меняет комнату.'),
  ),
  fictionalEntry(
    'paper-map-corner', 'paper',
    l('Paper map corner', 'Թղթե քարտեզի անկյուն', 'Уголок бумажной карты'),
    l('Tashir, Lori', 'Տաշիր, Լոռի', 'Ташир, Лори'),
    l('c. 2010s — prototype date', 'մոտ 2010-ականներ — նախատիպային ամսաթիվ', 'ок. 2010-х — дата прототипа'),
    l('A fictional map corner whose lines lead only to made-up routes.', 'Հորինված քարտեզի անկյուն, որի գծերը տանում են միայն երևակայական երթուղիներ։', 'Вымышленный уголок карты, линии которого ведут только к придуманным маршрутам.'),
    l('The Road That Ends Early', 'Ճանապարհը, որ շուտ է ավարտվում', 'Дорога, которая заканчивается рано'), l('Aren C.', 'Արեն Չ.', 'Арен Ч.'), 'mixed',
    l('A fictional assemblage of detours, folded paper, and directions withheld.', 'Հորինված համադրություն՝ շրջանցումներից, ծալված թղթից և չասված ուղղություններից։', 'Вымышленная композиция из объездов, сложенной бумаги и невыданных направлений.'),
  ),
  fictionalEntry(
    'apricot-pit', 'bead',
    l('Apricot pit', 'Ծիրանի կորիզ', 'Абрикосовая косточка'),
    l('Shirakamut, Lori', 'Շիրակամուտ, Լոռի', 'Ширакаму́т, Лори'),
    l('c. 2020s — prototype date', 'մոտ 2020-ականներ — նախատիպային ամսաթիվ', 'ок. 2020-х — дата прототипа'),
    l('A fictional apricot pit that keeps a season present without standing for a real harvest.', 'Ծիրանի հորինված կորիզ, որը պահում է սեզոնը ներկայում՝ չներկայացնելով իրական բերք։', 'Вымышленная абрикосовая косточка, сохраняющая сезон без отсылки к реальному урожаю.'),
    l('One Stone, One Summer', 'Մեկ կորիզ, մեկ ամառ', 'Одна косточка, одно лето'), l('Lusine T.', 'Լուսինե Տ.', 'Лусине Т.'), 'text',
    l('A fictional miniature about fruit, shade, and the small measures of a day.', 'Հորինված մանրապատում՝ մրգի, ստվերի և օրվա փոքր չափումների մասին։', 'Вымышленная миниатюра о фруктах, тени и малых мерах дня.'),
  ),
  fictionalEntry(
    'chalk-line-sample', 'paper',
    l('Chalk line sample', 'Կավճե գծի նմուշ', 'Образец меловой линии'),
    l('Saramej, Lori', 'Սարամեջ, Լոռի', 'Сарамедж, Лори'),
    l('Undated — prototype object', 'Ամսաթվագրված չէ — նախատիպային առարկա', 'Без даты — объект прототипа'),
    l('A fictional chalk mark that measures nothing permanent and can be wiped away.', 'Հորինված կավճե նշան, որը ոչինչ մշտական չի չափում և կարող է մաքրվել։', 'Вымышленная меловая отметка, которая не измеряет ничего постоянного и может быть стёрта.'),
    l('A Line for Returning', 'Վերադարձի գիծ', 'Линия для возвращения'), l('Vahan S.', 'Վահան Ս.', 'Ваган С.'), 'video',
    l('A fictional moving image following temporary marks across a floor.', 'Հորինված շարժվող պատկեր՝ հատակով անցնող ժամանակավոր նշանների մասին։', 'Вымышленное движущееся изображение о временных отметках на полу.'),
  ),
  fictionalEntry(
    'reed-whistle', 'leaf',
    l('Reed whistle', 'Եղեգնյա սուլիչ', 'Тростниковый свисток'),
    l('Privolnoye, Lori', 'Պրիվոլնոյե, Լոռի', 'Привольное, Лори'),
    l('c. 2000s — prototype date', 'մոտ 2000-ականներ — նախատիպային ամսաթիվ', 'ок. 2000-х — дата прототипа'),
    l('A fictional reed whistle imagined for a story about breath and open fields.', 'Եղեգնյա հորինված սուլիչ՝ շնչի և բաց դաշտերի մասին պատմության համար։', 'Вымышленный тростниковый свисток для истории о дыхании и открытых полях.'),
    l('Wind Learns a Name', 'Քամին անուն է սովորում', 'Ветер учит имя'), l('Tamar I.', 'Թամար Ի.', 'Тамар И.'), 'mixed',
    l('A fictional sound work made from air, reeds, and remembered calls.', 'Հորինված ձայնային աշխատանք՝ օդից, եղեգներից և հիշվող կանչերից։', 'Вымышленная звуковая работа из воздуха, тростника и запомнившихся зовов.'),
  ),
  fictionalEntry(
    'cork-float', 'spool',
    l('Cork float', 'Խցանի լողակ', 'Пробковый поплавок'),
    l('Norashen, Lori', 'Նորաշեն, Լոռի', 'Норашен, Лори'),
    l('c. 1990s — prototype date', 'մոտ 1990-ականներ — նախատիպային ամսաթիվ', 'ок. 1990-х — дата прототипа'),
    l('A fictional cork float that imagines a still pond rather than documenting a fishing practice.', 'Խցանի հորինված լողակ, որը երևակայում է հանդարտ լճակ՝ չփաստագրելով ձկնորսական սովորույթ։', 'Вымышленный пробковый поплавок, воображающий тихий пруд, а не документирующий рыболовную практику.'),
    l('Above the Waterline', 'Ջրագծից վեր', 'Над уровнем воды'), l('Hayk R.', 'Հայկ Ռ.', 'Айк Р.'), 'photo',
    l('A fictional photo essay about surfaces that almost hold a reflection.', 'Հորինված ֆոտոէսսե՝ մակերեսների մասին, որոնք գրեթե պահում են արտացոլանքը։', 'Вымышленное фотоэссе о поверхностях, которые почти удерживают отражение.'),
  ),
  fictionalEntry(
    'plum-thread-skein', 'ribbon',
    l('Plum thread skein', 'Սալորագույն թելի կծիկ', 'Моток сливовой нити'),
    l('Lermontovo, Lori', 'Լերմոնտովո, Լոռի', 'Лермонтово, Лори'),
    l('c. 2010s — prototype date', 'մոտ 2010-ականներ — նախատիպային ամսաթիվ', 'ок. 2010-х — дата прототипа'),
    l('A fictional skein of coloured thread proposed as a route through repair and ornament.', 'Գունավոր թելի հորինված կծիկ՝ վերանորոգման և զարդարանքի միջով ուղի պատկերացնելու համար։', 'Вымышленный моток цветной нити как маршрут через починку и орнамент.'),
    l('A Colour to Mend With', 'Գույն՝ վերանորոգելու համար', 'Цвет для починки'), l('Seda K.', 'Սեդա Կ.', 'Седа К.'), 'mixed',
    l('A fictional collection of seams, dyed paper, and instructions without a pattern.', 'Հորինված հավաքածու՝ կարերից, ներկված թղթից և առանց ձևանմուշի հրահանգներից։', 'Вымышленная коллекция швов, окрашенной бумаги и инструкций без выкройки.'),
  ),
  fictionalEntry(
    'iron-nail', 'metal',
    l('Iron nail', 'Երկաթե մեխ', 'Железный гвоздь'),
    l('Margahovit, Lori', 'Մարգահովիտ, Լոռի', 'Маргаховит, Лори'),
    l('c. 1960s — prototype date', 'մոտ 1960-ականներ — նախատիպային ամսաթիվ', 'ок. 1960-х — дата прототипа'),
    l('A fictional iron nail, held apart from any real building, repair, or event.', 'Երկաթե հորինված մեխ՝ առանձնացված ցանկացած իրական շինությունից, վերանորոգումից կամ իրադարձությունից։', 'Вымышленный железный гвоздь, отделённый от любого реального здания, ремонта или события.'),
    l('What a Wall Keeps', 'Ինչ է պահում պատը', 'Что хранит стена'), l('Levon M.', 'Լևոն Մ.', 'Левон М.'), 'text',
    l('A fictional prose fragment about fastening, removing, and leaving a trace.', 'Հորինված արձակ հատված՝ ամրացնելու, հանելու և հետք թողնելու մասին։', 'Вымышленный прозаический фрагмент о закреплении, извлечении и оставленном следе.'),
  ),
  fictionalEntry(
    'woven-fabric-patch', 'ribbon',
    l('Woven fabric patch', 'Գործվածքի կտոր', 'Тканая заплата'),
    l('Dzoraget, Lori', 'Ձորագետ, Լոռի', 'Дзорагет, Лори'),
    l('c. 1980s — prototype date', 'մոտ 1980-ականներ — նախատիպային ամսաթիվ', 'ок. 1980-х — дата прототипа'),
    l('A fictional fabric patch that asks how colour and touch travel between hands.', 'Գործվածքի հորինված կտոր, որը հարցնում է՝ ինչպես են գույնն ու շփումը անցնում ձեռքից ձեռք։', 'Вымышленная тканая заплата, спрашивающая, как цвет и прикосновение переходят из рук в руки.'),
    l('Pattern Without a Border', 'Զարդանախշ՝ առանց եզրի', 'Узор без края'), l('Anahit F.', 'Անահիտ Ֆ.', 'Анаит Ф.'), 'photo',
    l('A fictional set of close images that follows threads across changing light.', 'Հորինված խոշոր պլանների շարք, որը հետևում է թելերին փոփոխվող լույսի մեջ։', 'Вымышленная серия крупных планов, следящая за нитями в меняющемся свете.'),
  ),
  fictionalEntry(
    'mirror-backing', 'shard',
    l('Mirror backing', 'Հայելու թիկունք', 'Оборотная сторона зеркала'),
    l('Vardablur, Lori', 'Վարդաբլուր, Լոռի', 'Вардаблур, Лори'),
    l('Undated — prototype object', 'Ամսաթվագրված չէ — նախատիպային առարկա', 'Без даты — объект прототипа'),
    l('A fictional dull mirror backing that refuses to show a face or claim a provenance.', 'Հայելու հորինված խամրած թիկունք, որը հրաժարվում է դեմք ցույց տալ կամ ծագում պնդել։', 'Вымышленная тусклая оборотная сторона зеркала, не показывающая лицо и не заявляющая происхождение.'),
    l('What Reflection Leaves Out', 'Ինչ է արտացոլանքը բաց թողնում', 'Что упускает отражение'), l('Maro P.', 'Մարո Պ.', 'Маро П.'), 'video',
    l('A fictional film of glints, backs of objects, and deliberately missed portraits.', 'Հորինված ֆիլմ՝ փայլերի, առարկաների թիկունքների և միտումնավոր բաց թողնված դիմանկարների մասին։', 'Вымышленный фильм о бликах, оборотах предметов и намеренно пропущенных портретах.'),
  ),
  fictionalEntry(
    'folded-note', 'paper',
    l('Folded note', 'Ծալված գրություն', 'Сложенная записка'),
    l('Katnaghbyur, Lori', 'Կաթնաղբյուր, Լոռի', 'Катнахбюр, Лори'),
    l('c. 2020s — prototype date', 'մոտ 2020-ականներ — նախատիպային ամսաթիվ', 'ок. 2020-х — дата прототипа'),
    l('A fictional folded note with no readable message, held only for its gestures of passing.', 'Հորինված ծալված գրություն՝ առանց ընթեռնելի հաղորդագրության, պահված միայն փոխանցելու ժեստի համար։', 'Вымышленная сложенная записка без читаемого сообщения, сохранённая только ради жеста передачи.'),
    l('Passed Hand to Hand', 'Ձեռքից ձեռք փոխանցված', 'Передано из рук в руки'), l('Arman Z.', 'Արման Զ.', 'Арман З.'), 'text',
    l('A fictional short text about messages that change before they arrive.', 'Հորինված կարճ տեքստ՝ հաղորդագրությունների մասին, որոնք փոխվում են մինչ հասնելը։', 'Вымышленный короткий текст о сообщениях, которые меняются до прибытия.'),
  ),
];

export const entries: MuseumEntry[] = entrySources.map(withCollageMetadata);

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);
export const text = (value: LocalizedText, locale: Locale) => value[locale] || value.en;
export const entryBySlug = (slug: string) => entries.find((entry) => entry.slug === slug);
export const mediumLabel = (medium: Medium, locale: Locale) => ({
  text: l('Text', 'Տեքստ', 'Текст'),
  photo: l('Photo', 'Լուսանկար', 'Фотография'),
  video: l('Video', 'Տեսանյութ', 'Видео'),
  mixed: l('Mixed', 'Խառը մեդիա', 'Смешанная техника'),
}[medium][locale]);
