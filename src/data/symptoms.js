export const 증상카테고리 = {
  "두경부": {
        "두통": [
            { name: "편두통", code: "G43.9" },
            { name: "긴장성두통", code: "G44.2" },
            { name: "군발성두통", code: "G44.0" },
            { name: "뇌출혈성두통", code: "I61.9" },
            { name: "수막염성두통", code: "G03.9" }
        ],
        "뇌신경": [
            { name: "뇌경색", code: "I63" },
            { name: "뇌출혈", code: "I61" },
            { name: "뇌종양", code: "C71" },
            { name: "뇌염", code: "G04" },
            { name: "수막염", code: "G03" }
        ],
        "안면부": [
            { name: "안면마비", code: "G51.0" },
            { name: "안면경련", code: "G51.3" },
            { name: "삼차신경통", code: "G50.0" },
            { name: "안면외상", code: "S00.9" },
            { name: "턱관절장애", code: "K07.6" }
        ],
        "시각계": [
            { name: "시력저하", code: "H54.7" },
            { name: "충혈", code: "H57.8" },
            { name: "백내장", code: "H26.9" },
            { name: "녹내장", code: "H40.9" },
            { name: "망막질환", code: "H35.9" },
            { name: "안구건조", code: "H04.1" }
        ],
        "청각계": [
            { name: "난청", code: "H91.9" },
            { name: "이명", code: "H93.1" },
            { name: "중이염", code: "H66.9" },
            { name: "어지럼증", code: "R42" },
            { name: "메니에르병", code: "H81.0" }
        ],
        "비강/부비동": [
            { name: "비염", code: "J30.9" },
            { name: "축농증", code: "J32.9" },
            { name: "비중격만곡", code: "J34.2" },
            { name: "후각저하", code: "R43.0" },
            { name: "비출혈", code: "R04.0" }
        ],
        "구강/인후": [
            { name: "구내염", code: "K12.0" },
            { name: "인후통", code: "J02.9" },
            { name: "연하곤란", code: "R13" },
            { name: "편도염", code: "J03.9" },
            { name: "후두염", code: "J04.0" }
        ],
        "치아/구강": [
            { name: "충치", code: "K02.9" },
            { name: "치주염", code: "K05.3" },
            { name: "부정교합", code: "K07.4" },
            { name: "턱관절장애", code: "K07.6" },
            { name: "구취", code: "R19.6" }
        ],
        "침샘": [
            { name: "이하선염", code: "K11.2" },
            { name: "타석증", code: "K11.5" },
            { name: "침샘종양", code: "D11.9" },
            { name: "구강건조증", code: "K11.7" }
        ]
    },
    "호흡기": {
        "상기도": [
            { name: "비염", code: "J30.9" },
            { name: "부비동염", code: "J32.9" },
            { name: "인후염", code: "J02.9" },
            { name: "편도염", code: "J03.9" },
            { name: "후두염", code: "J04.0" },
            { name: "편도비대", code: "J35.1" }
        ],
        "하기도": [
            { name: "기관지염", code: "J40" },
            { name: "폐렴", code: "J18.9" },
            { name: "천식", code: "J45.9" },
            { name: "만성폐쇄성폐질환", code: "J44.9" },
            { name: "기관지확장증", code: "J47" }
        ],
        "폐": [
            { name: "폐결핵", code: "A15.0" },
            { name: "폐암", code: "C34.9" },
            { name: "기흉", code: "J93.9" },
            { name: "폐섬유증", code: "J84.1" },
            { name: "폐색전증", code: "I26.9" },
            { name: "폐부종", code: "J81" }
        ],
        "흉막": [
            { name: "흉막염", code: "R09.1" },
            { name: "흉수", code: "J90" },
            { name: "기흉", code: "J93.9" },
            { name: "혈흉", code: "J94.2" }
        ]
    },
    "심혈관": {
        "관상동맥": [
            { name: "협심증", code: "I20.9" },
            { name: "심근경색", code: "I21.9" }
        ],
        "부정맥": [
            { name: "심방세동", code: "I48" },
            { name: "심실빈맥", code: "I47.2" },
            { name: "서맥", code: "R00.1" }
        ],
        "심부전": [
            { name: "좌심부전", code: "I50.1" },
            { name: "우심부전", code: "I50.0" },
            { name: "심장비대", code: "I51.7" }
        ],
        "판막": [
            { name: "승모판질환", code: "I34.9" },
            { name: "대동맥판질환", code: "I35.9" },
            { name: "심장판막증", code: "I38" }
        ],
        "동맥": [
            { name: "고혈압", code: "I10" },
            { name: "동맥경화", code: "I70.9" },
            { name: "대동맥류", code: "I71.9" },
            { name: "말초동맥질환", code: "I73.9" }
        ],
        "정맥": [
            { name: "심부정맥혈전증", code: "I80.2" },
            { name: "정맥류", code: "I83.9" },
            { name: "혈전성정맥염", code: "I80.9" }
        ],
        "림프": [
            { name: "림프부종", code: "I89.0" },
            { name: "림프염", code: "I88.9" },
            { name: "림프종", code: "C85.9" }
        ]
    },
    "소화기": {
        "식도": [
            { name: "역류성식도염", code: "K21.9" },
            { name: "식도염", code: "K20" },
            { name: "식도경련", code: "K22.4" },
            { name: "식도암", code: "C15.9" },
            { name: "식도정맥류", code: "I85.9" }
        ],
        "위": [
            { name: "위염", code: "K29.7" },
            { name: "위궤양", code: "K25.9" },
            { name: "위암", code: "C16.9" },
            { name: "소화불량", code: "K30" },
            { name: "구역/구토", code: "R11" }
        ],
        "소장/대장": [
            { name: "장염", code: "A09.9" },
            { name: "과민성대장증후군", code: "K58.9" },
            { name: "크론병", code: "K50.9" },
            { name: "대장염", code: "K51.9" },
            { name: "대장암", code: "C18.9" },
            { name: "장폐색", code: "K56.6" }
        ],
        "항문": [
            { name: "치질", code: "K64.9" },
            { name: "치루", code: "K60.3" },
            { name: "치열", code: "K60.2" },
            { name: "항문농양", code: "K61.0" },
            { name: "항문출혈", code: "K62.5" }
        ],
        "간": [
            { name: "간염", code: "K73.9" },
            { name: "간경화", code: "K74.6" },
            { name: "지방간", code: "K76.0" },
            { name: "간암", code: "C22.0" },
            { name: "황달", code: "R17" }
        ],
        "담도": [
            { name: "담석", code: "K80.2" },
            { name: "담낭염", code: "K81.0" },
            { name: "담관염", code: "K83.0" },
            { name: "담낭암", code: "C23" }
        ],
        "췌장": [
            { name: "췌장염", code: "K85.9" },
            { name: "췌장암", code: "C25.9" },
            { name: "췌장기능부전", code: "K86.9" }
        ],
        "영양": [
            { name: "영양실조", code: "E46" },
            { name: "영양과잉", code: "E67.8" },
            { name: "비타민결핍", code: "E56.9" },
            { name: "미네랄결핍", code: "E61.9" }
        ],
        "연하장애": [
            { name: "연하곤란", code: "R13" },
            { name: "역류", code: "K21.9" },
            { name: "흡인", code: "J69.0" }
        ]
    },
    "근골격계": {
        "경추": [
            { name: "경추디스크", code: "M50.9" },
            { name: "경추협착증", code: "M48.02" },
            { name: "경추염좌", code: "S13.4" },
            { name: "거북목증후군", code: "M54.2" }
        ],
        "흉추": [
            { name: "흉추디스크", code: "M51.9" },
            { name: "흉추협착증", code: "M48.03" },
            { name: "흉추측만증", code: "M41.9" }
        ],
        "요추": [
            { name: "요추디스크", code: "M51.9" },
            { name: "요추협착증", code: "M48.06" },
            { name: "요추전방전위증", code: "M43.1" },
            { name: "좌골신경통", code: "M54.3" }
        ],
        "천추/미추": [
            { name: "천추통", code: "M53.3" },
            { name: "미추통", code: "M53.3" },
            { name: "천미추증후군", code: "M53.3" }
        ],
        "어깨": [
            { name: "회전근개염", code: "M75.1" },
            { name: "오십견", code: "M75.0" },
            { name: "어깨충돌증후군", code: "M75.4" },
            { name: "어깨탈구", code: "S43.0" },
            { name: "석회성건염", code: "M75.3" }
        ],
        "상완": [
            { name: "상완골절", code: "S42.3" },
            { name: "상완신경통", code: "M54.1" },
            { name: "이두근건염", code: "M75.2" },
            { name: "삼두근건염", code: "M75.8" }
        ],
        "팔꿈치": [
            { name: "테니스엘보", code: "M77.1" },
            { name: "골프엘보", code: "M77.0" },
            { name: "관절염", code: "M19.02" },
            { name: "척골신경포착", code: "G56.2" }
        ],
        "손목/수지": [
            { name: "손목터널증후군", code: "G56.0" },
            { name: "방아쇠수지", code: "M65.3" },
            { name: "관절염", code: "M19.03" },
            { name: "건초염", code: "M65.9" },
            { name: "듀피트렌구축", code: "M72.0" }
        ],
        "고관절": [
            { name: "고관절염", code: "M16.9" },
            { name: "대퇴골두무혈성괴사", code: "M87.05" },
            { name: "고관절충돌증후군", code: "M25.85" },
            { name: "고관절윤활낭염", code: "M70.7" }
        ],
        "슬관절": [
            { name: "반월상연골파열", code: "S83.2" },
            { name: "십자인대파열", code: "S83.5" },
            { name: "관절염", code: "M17.9" },
            { name: "슬개골연골연화증", code: "M22.4" },
            { name: "점액낭염", code: "M70.5" }
        ],
        "발목/족부": [
            { name: "족관절염좌", code: "S93.4" },
            { name: "아킬레스건염", code: "M76.6" },
            { name: "족저근막염", code: "M72.2" },
            { name: "무지외반증", code: "M20.1" },
            { name: "평발", code: "M21.4" }
        ],
        "근육": [
            { name: "근염", code: "M60.9" },
            { name: "근경련", code: "R25.2" },
            { name: "섬유근통", code: "M79.7" },
            { name: "근막통증증후군", code: "M79.1" },
            { name: "다발성근염", code: "M33.2" }
        ],
        "관절": [
            { name: "류마티스관절염", code: "M06.9" },
            { name: "퇴행성관절염", code: "M19.9" },
            { name: "통풍", code: "M10.9" },
            { name: "강직성척추염", code: "M45" }
        ],
        "뼈": [
            { name: "골다공증", code: "M81.9" },
            { name: "골절", code: "T14.2" },
            { name: "골수염", code: "M86.9" },
            { name: "골종양", code: "D48.0" },
            { name: "파제트병", code: "M88.9" }
        ]
    },
    "비뇨생식기": {
        "신장": [
            { name: "신장염", code: "N10" },
            { name: "신부전", code: "N17.9" },
            { name: "신장결석", code: "N20.0" },
            { name: "신장암", code: "C64" },
            { name: "다낭신", code: "Q61.3" }
        ],
        "요로": [
            { name: "요로결석", code: "N20.9" },
            { name: "방광염", code: "N30.9" },
            { name: "과민성방광", code: "N32.8" },
            { name: "요실금", code: "N39.3" },
            { name: "요도염", code: "N34.1" }
        ],
        "남성생식기": [
            { name: "전립선염", code: "N41.9" },
            { name: "전립선비대", code: "N40" },
            { name: "전립선암", code: "C61" },
            { name: "발기부전", code: "N48.4" },
            { name: "고환염", code: "N45.9" }
        ],
        "여성생식기": [
            { name: "자궁근종", code: "D25.9" },
            { name: "난소낭종", code: "N83.2" },
            { name: "자궁내막증", code: "N80.9" },
            { name: "불임", code: "N97.9" },
            { name: "질염", code: "N76.0" },
            { name: "폐경증후군", code: "N95.1" }
        ]
    },
    "내분비": {
        "갑상선": [
            { name: "갑상선기능항진", code: "E05.9" },
            { name: "갑상선기능저하", code: "E03.9" },
            { name: "갑상선결절", code: "E04.1" },
            { name: "갑상선염", code: "E06.9" }
        ],
        "부신": [
            { name: "쿠싱증후군", code: "E24.9" },
            { name: "에디슨병", code: "E27.1" },
            { name: "부신종양", code: "D35.0" },
            { name: "고알도스테론증", code: "E26.9" }
        ],
        "뇌하수체": [
            { name: "말단비대증", code: "E22.0" },
            { name: "범뇌하수체기능저하증", code: "E23.0" },
            { name: "고프로락틴혈증", code: "E22.1" }
        ],
        "췌장": [
            { name: "제1형당뇨", code: "E10.9" },
            { name: "제2형당뇨", code: "E11.9" },
            { name: "임신성당뇨", code: "O24.9" },
            { name: "췌장내분비종양", code: "D13.7" }
        ],
        "부갑상선": [
            { name: "부갑상선기능항진증", code: "E21.0" },
            { name: "부갑상선기능저하증", code: "E20.9" }
        ],
        "생식선": [
            { name: "성조숙증", code: "E30.1" },
            { name: "지연성성장", code: "E34.3" },
            { name: "성선기능저하", code: "E29.9" }
        ],
        "대사성": [
            { name: "고지혈증", code: "E78.5" },
            { name: "비만", code: "E66.9" },
            { name: "대사증후군", code: "E88.9" },
            { name: "통풍", code: "M10.9" }
        ]
    },
    "피부": {
        "감염성": [
            { name: "백선", code: "B35.9" },
            { name: "옴", code: "B86" },
            { name: "대상포진", code: "B02.9" },
            { name: "농가진", code: "L01.0" },
            { name: "봉와직염", code: "L03.9" }
        ],
        "알레르기": [
            { name: "아토피", code: "L20.9" },
            { name: "접촉성피부염", code: "L23.9" },
            { name: "두드르기", code: "L50.9" },
            { name: "혈관부종", code: "T78.3" }
        ],
        "자가면역": [
            { name: "건선", code: "L40.9" },
            { name: "루푸스", code: "L93.0" },
            { name: "백반증", code: "L80" },
            { name: "천포창", code: "L10.9" }
        ],
        "종양": [
            { name: "피부암", code: "C44.9" },
            { name: "양성종양", code: "D23.9" },
            { name: "색소성병변", code: "D22.9" },
            { name: "기저세포암", code: "C44.91" }
        ],
        "모발/조갑": [
            { name: "탈모", code: "L65.9" },
            { name: "조갑진균증", code: "B35.1" },
            { name: "손발톱영양장애", code: "L60.9" },
            { name: "다한증", code: "R61.9" }
        ]
    },
    "혈액/면역": {
        "적혈구": [
            { name: "빈혈", code: "D64.9" },
            { name: "적혈구증가증", code: "D75.1" },
            { name: "철결핍성빈혈", code: "D50.9" },
            { name: "재생불량성빈혈", code: "D61.9" }
        ],
        "백혈구": [
            { name: "백혈병", code: "C95.9" },
            { name: "림프종", code: "C85.9" },
            { name: "면역결핍", code: "D84.9" },
            { name: "호중구감소증", code: "D70" }
        ],
        "혈소판": [
            { name: "혈소판감소증", code: "D69.6" },
            { name: "혈소판증가증", code: "D75.2" },
            { name: "특발성혈소판감소증", code: "D69.3" }
        ],
        "응고장애": [
            { name: "혈우병", code: "D66" },
            { name: "혈전증", code: "D68.9" },
            { name: "파종성혈관내응고", code: "D65" },
            { name: "폰빌레브란트병", code: "D68.0" }
        ],
        "자가면역": [
            { name: "류마티스관절염", code: "M06.9" },
            { name: "전신홍반루푸스", code: "M32.9" },
            { name: "혈관염", code: "I77.6" }
        ],
        "알레르기": [
            { name: "약물알레르기", code: "T88.7" },
            { name: "음식알레르기", code: "T78.1" },
            { name: "라텍스알레르기", code: "T78.4" },
            { name: "계절성알레르기", code: "J30.2" }
        ]
    },
    "정신/신경": {
        "기분장애": [
            { name: "우울증", code: "F32.9" },
            { name: "양극성장애", code: "F31.9" },
            { name: "불안장애", code: "F41.9" },
            { name: "공황장애", code: "F41.0" }
        ],
        "인지장애": [
            { name: "치매", code: "F03" },
            { name: "경도인지장애", code: "F06.7" },
            { name: "주의력결핍장애", code: "F90.0" }
        ],
        "수면장애": [
            { name: "불면증", code: "G47.0" },
            { name: "수면무호흡", code: "G47.3" },
            { name: "하지불안증후군", code: "G25.8" },
            { name: "기면증", code: "G47.4" }
        ],
        "중독": [
            { name: "알코올중독", code: "F10.2" },
            { name: "약물중독", code: "F19.2" },
            { name: "게임중독", code: "F63.8" },
            { name: "니코틴중독", code: "F17.2" }
        ],
        "발달장애": [
            { name: "자폐스펙트럼", code: "F84.0" },
            { name: "학습장애", code: "F81.9" },
            { name: "언어발달지연", code: "F80.9" },
            { name: "틱장애", code: "F95.9" }
        ],
        "신경발달": [
            { name: "뇌성마비", code: "G80.9" },
            { name: "근육병", code: "G71.9" },
            { name: "척수성근위축증", code: "G12.9" }
        ],
        "정신증": [
            { name: "조현병", code: "F20.9" },
            { name: "망상장애", code: "F22.0" },
            { name: "해리장애", code: "F44.9" },
            { name: "강박장애", code: "F42.9" }
        ]
    },
    "노인의학": {
        "신체기능": [
            { name: "보행장애", code: "R26.2" },
            { name: "낙상", code: "R29.6" },
            { name: "실금", code: "R32" },
            { name: "연하장애", code: "R13" }
        ],
        "인지기능": [
            { name: "치매", code: "F03" },
            { name: "섬망", code: "F05.9" },
            { name: "우울", code: "F32.9" },
            { name: "불면", code: "G47.0" }
        ],
        "노인증후군": [
            { name: "허약", code: "R54" },
            { name: "다발성약물복용", code: "F55" },
            { name: "영양실조", code: "E46" },
            { name: "압박궤양", code: "L89.9" }
        ],
        "노인성질환": [
            { name: "파킨슨병", code: "G20" },
            { name: "골다공증", code: "M81.9" },
            { name: "관절염", code: "M19.9" },
            { name: "노인성난청", code: "H91.1" }
        ]
    },
    "소아청소년": {
        "성장발달": [
            { name: "성장지연", code: "R62.8" },
            { name: "성조숙증", code: "E30.1" },
            { name: "저신장", code: "E34.3" },
            { name: "비만", code: "E66.9" }
        ],
        "선천성": [
            { name: "선천성심장병", code: "Q24.9" },
            { name: "선천성대사이상", code: "E88.9" },
            { name: "염색체이상", code: "Q99.9" },
            { name: "선천성기형", code: "Q89.9" }
        ],
        "소아감염": [
            { name: "수족구병", code: "B08.4" },
            { name: "백일해", code: "A37.9" },
            { name: "로타바이러스", code: "A08.0" },
            { name: "크룹", code: "J05.0" },
            { name: "성홍열", code: "A38" }
        ],
        "소아알레르기": [
            { name: "아토피", code: "L20.9" },
            { name: "천식", code: "J45.9" },
            { name: "식품알레르기", code: "T78.1" },
            { name: "알레르기비염", code: "J30.4" }
        ]
    },
    "응급": {
        "외상": [
            { name: "골절", code: "T14.2" },
            { name: "탈구", code: "T14.3" },
            { name: "염좌", code: "T14.3" },
            { name: "열상", code: "T14.1" },
            { name: "타박상", code: "T14.0" },
            { name: "두부외상", code: "S09.9" }
        ],
        "화상": [
            { name: "화염화상", code: "T30.0" },
            { name: "열탕화상", code: "T30.0" },
            { name: "전기화상", code: "T30.3" },
            { name: "화학화상", code: "T30.4" },
            { name: "방사선화상", code: "T30.4" }
        ],
        "중독": [
            { name: "약물중독", code: "T50.9" },
            { name: "식중독", code: "A05.9" },
            { name: "일산화탄소중독", code: "T58" },
            { name: "농약중독", code: "T60.9" }
        ],
        "환경응급": [
            { name: "열사병", code: "T67.0" },
            { name: "저체온증", code: "T68" },
            { name: "감전", code: "T75.4" },
            { name: "익수", code: "T75.1" },
            { name: "고산병", code: "T70.2" }
        ],
        "알레르기": [
            { name: "아나필락시스", code: "T78.2" },
            { name: "혈관부종", code: "T78.3" },
            { name: "심한 알레르기반응", code: "T78.4" }
        ],
        "출혈": [
            { name: "대량출혈", code: "R58" },
            { name: "위장관출혈", code: "K92.2" },
            { name: "비출혈", code: "R04.0" },
            { name: "산후출혈", code: "O72.1" }
        ],
        "응급질환": [
            { name: "심정지", code: "I46.9" },
            { name: "쇼크", code: "R57.9" },
            { name: "의식저하", code: "R40.2" },
            { name: "경련", code: "R56.8" },
            { name: "급성복증", code: "R10.0" }
        ]
    }
};

const 증상매핑 = {};
Object.entries(증상카테고리).forEach(([대분류, 중분류객체]) => {
  Object.entries(중분류객체).forEach(([중분류, 증상배열]) => {
    증상매핑[중분류] = 증상배열.map(증상 => 
      typeof 증상 === 'object' ? 증상.name : 증상
    );
  });
});

export { 증상매핑 as 증상 };
