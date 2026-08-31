export const locales = ['en', 'hy', 'ru'] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;
export type ShapeName = 'button' | 'stone' | 'metal' | 'leaf' | 'tile' | 'spool';
export type Medium = 'text' | 'photo' | 'video' | 'mixed';

export type MuseumEntry = {
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
};

const l = (en: string, hy: string, ru: string): LocalizedText => ({ en, hy, ru });

export const ui = {
  siteSubtitle: l('MEMO summer school museum', 'MEMO-ի ամառային դպրոցի թանգարան', 'Музей летней школы MEMO'),
  collection: l('Collection', 'Հավաքածու', 'Коллекция'),
  catalogue: l('Catalogue', 'Կատալոգ', 'Каталог'),
  language: l('Language', 'Լեզու', 'Язык'),
  prototype: l('Fictional prototype content', 'Հորինված նախատիպային բովանդակություն', 'Вымышленный прототипный контент'),
  prototypeLong: l(
    'All objects, places, dates, people, and projects shown here are fictional examples created for interface testing.',
    'Այստեղ ներկայացված բոլոր առարկաները, վայրերը, ամսաթվերը, մարդիկ և նախագծերը հորինված օրինակներ են՝ միջերեսի փորձարկման համար։',
    'Все показанные здесь объекты, места, даты, люди и проекты — вымышленные примеры для тестирования интерфейса.',
  ),
  backCollection: l('Back to collection', 'Վերադառնալ հավաքածու', 'Вернуться к коллекции'),
  backCatalogue: l('Back to catalogue', 'Վերադառնալ կատալոգ', 'Вернуться в каталог'),
  foundObject: l('Found object', 'Գտնված առարկա', 'Найденный объект'),
  participantProject: l('Participant project', 'Մասնակցի նախագիծ', 'Проект участника'),
  place: l('Place', 'Վայր', 'Место'),
  date: l('Date', 'Ամսաթիվ', 'Дата'),
  medium: l('Medium', 'Մեդիա', 'Медиа'),
  pseudonym: l('pseudonym', 'կեղծանուն', 'псевдоним'),
  previous: l('Previous', 'Նախորդ', 'Предыдущий'),
  next: l('Next', 'Հաջորդ', 'Следующий'),
  objectType: l('Object type', 'Առարկայի տեսակ', 'Тип объекта'),
  location: l('Location', 'Վայր', 'Место'),
  projectMedium: l('Project medium', 'Նախագծի մեդիա', 'Медиа проекта'),
  all: l('All', 'Բոլորը', 'Все'),
  applyFilters: l('Apply filters', 'Կիրառել զտիչները', 'Применить фильтры'),
  clearFilters: l('Clear filters', 'Մաքրել զտիչները', 'Сбросить фильтры'),
  results: l('projects', 'նախագիծ', 'проектов'),
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

export const entries: MuseumEntry[] = [
  {
    slug: 'blue-coat-button',
    shape: 'button',
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
    shape: 'tile',
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
    shape: 'metal',
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
    shape: 'tile',
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
    shape: 'spool',
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
    shape: 'tile',
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
    shape: 'leaf',
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
];

export const isLocale = (value: string): value is Locale => locales.includes(value as Locale);
export const text = (value: LocalizedText, locale: Locale) => value[locale] || value.en;
export const entryBySlug = (slug: string) => entries.find((entry) => entry.slug === slug);
export const mediumLabel = (medium: Medium, locale: Locale) => ({
  text: l('Text', 'Տեքստ', 'Текст'),
  photo: l('Photo', 'Լուսանկար', 'Фотография'),
  video: l('Video', 'Տեսանյութ', 'Видео'),
  mixed: l('Mixed', 'Խառը մեդիա', 'Смешанная техника'),
}[medium][locale]);
