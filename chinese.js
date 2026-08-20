// ===================================================================
// Chinese Engine (Mô-đun Chuyên Biệt Luyện Viết & Luyện Nói Tiếng Trung)
// ===================================================================

const CHINESE_SAMPLE_TEXTS = [
  {
    id: 'zh_sample_1',
    category: 'custom',
    title: '你好与问候 (Chào hỏi & Làm quen)',
    topic: 'HSK 1 - Giao tiếp',
    level: 'Viết ngang',
    formatMode: 'inline',
    pinyin: 'Nǐ hǎo! Hěn gāoxìng rènshí nǐ. Nǐ jīntiān zěnmeyàng? Wǒ hěn hǎo, xièxiè nǐ!',
    meaning: 'Chào bạn! Rất vui được làm quen với bạn. Hôm nay bạn thế nào? Tôi rất khỏe, cảm ơn bạn!',
    text: '你好！很高兴认识你。你今天怎么样？我很好，谢谢你！'
  },
  {
    id: 'zh_sample_2',
    category: 'custom',
    title: '自我介绍 (Giới thiệu bản thân)',
    topic: 'HSK 2 - Bản thân',
    level: 'Viết ngang',
    formatMode: 'inline',
    pinyin: 'Wǒ jiào Xiǎomíng, jīnnián èrshí suì. Wǒ shì dàxuéshēng, wǒ xǐhuān xuéxí hànyǔ hé lǚyóu.',
    meaning: 'Tôi tên là Tiểu Minh, năm nay 20 tuổi. Tôi là sinh viên đại học, tôi thích học tiếng Trung và đi du lịch.',
    text: '我叫小明，今年二十岁。我是大学生，我喜欢学习汉语和旅游。'
  },
  {
    id: 'zh_sample_3',
    category: 'custom',
    title: '在餐厅点餐 (Gọi món tại nhà hàng)',
    topic: 'HSK 2 - Đời sống',
    level: 'Viết ngang',
    formatMode: 'inline',
    pinyin: 'Fúwùyuán, qǐng gěi wǒ càidān. Wǒ xiǎng chī gōngbǎo jīdīng hé mǐfàn, zài lái yì bēi bīng shuǐ.',
    meaning: 'Phục vụ, xin cho tôi xem thực đơn. Tôi muốn ăn gà Cung Bảo và cơm trắng, thêm một ly nước đá nữa.',
    text: '服务员，请给我菜单。我想吃宫保鸡丁和米饭，再来一杯冰水。'
  },
  {
    id: 'zh_sample_4',
    category: 'custom',
    title: '学习汉语的日常 (Học tiếng Trung mỗi ngày)',
    topic: 'HSK 3 - Học tập',
    level: 'Viết ngang',
    formatMode: 'inline',
    pinyin: 'Měitiān zǎoshang wǒ dōu huì liànxí tīnglì hé fāyīn. Suīrán hànzì yǒu yìdiǎnr nán, dànshì hěn yǒuyìsi.',
    meaning: 'Mỗi buổi sáng tôi đều luyện nghe và phát âm. Mặc dù chữ Hán có một chút khó, nhưng rất thú vị.',
    text: '每天早上我都会练习听力和发音。虽然汉字有一点儿难，但是很有意思。'
  },
  {
    id: 'zh_sample_5',
    category: 'custom',
    title: '成语故事：持之以恒 (Kiên trì bền bỉ)',
    topic: 'HSK 4 - Thành ngữ',
    level: 'Viết ngang',
    formatMode: 'inline',
    pinyin: 'Xuéxí yǔyán xūyào chízhīyǐhéng, zhǐyào měitiān jiānchí liànxí, nǐ jiù yídìng néng shuō de hěn liúlì.',
    meaning: 'Học ngôn ngữ cần có sự kiên trì bền bỉ, chỉ cần mỗi ngày kiên trì luyện tập, bạn nhất định sẽ nói rất lưu loát.',
    text: '学习语言需要持之以恒，只要每天坚持练习，你就一定能说得很流利。'
  }
];

class ChineseEngine {
  constructor() {
    this.storageKeys = {
      writeCustomTexts: 'zh_write_custom_texts',
      speakCustomTexts: 'zh_speak_custom_texts',
      streak: 'zh_streak',
      lastDate: 'zh_last_date',
      history: 'zh_history',
      voiceGender: 'zh_voice_gender',
      rate: 'zh_speak_rate',
      fontSize: 'zh_font_size'
    };

    this.defaultVoices = [];
    this.initChineseVoices();
  }

  // Khởi tạo giọng đọc tiếng Trung (zh-CN, zh-TW, zh-HK)
  initChineseVoices() {
    const updateVoices = () => {
      if ('speechSynthesis' in window) {
        this.defaultVoices = window.speechSynthesis.getVoices().filter(v => 
          v.lang && (v.lang.startsWith('zh') || v.lang.includes('cmn') || v.lang.includes('mandarin') || v.lang.includes('chinese'))
        );
      }
    };
    updateVoices();
    if ('speechSynthesis' in window && window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  }

  // Lấy giọng đọc tiếng Trung tối ưu
  getChineseVoice(gender = 'google') {
    if (!this.defaultVoices.length) {
      this.initChineseVoices();
    }

    const voices = this.defaultVoices;
    if (!voices.length) {
      return { voice: null, pitch: 1.0, lang: 'zh-CN' };
    }

    if (gender === 'female') {
      // Ưu tiên giọng nữ tiếng Trung (Xiaoxiao, Huihui, Yaoyao, Tingting, Sinji, etc.)
      const femaleKeywords = ['xiaoxiao', 'huihui', 'yaoyao', 'tingting', 'sin-ji', 'meijia', 'female', 'nữ'];
      const match = voices.find(v => {
        const name = (v.name || '').toLowerCase();
        return femaleKeywords.some(k => name.includes(k));
      });
      if (match) return { voice: match, pitch: 1.05, lang: 'zh-CN' };
      return { voice: voices[0], pitch: 1.1, lang: 'zh-CN' };
    } else if (gender === 'male') {
      // Ưu tiên giọng nam tiếng Trung (Kangkang, Zhiwei, Yunxi, Danny, male, etc.)
      const maleKeywords = ['kangkang', 'zhiwei', 'yunxi', 'danny', 'male', 'nam'];
      const match = voices.find(v => {
        const name = (v.name || '').toLowerCase();
        return maleKeywords.some(k => name.includes(k));
      });
      if (match) return { voice: match, pitch: 0.9, lang: 'zh-CN' };
      return { voice: voices[0], pitch: 0.85, lang: 'zh-CN' };
    } else if (gender === 'tw') {
      // Giọng tiếng Trung Đài Loan (zh-TW)
      const match = voices.find(v => (v.lang || '').includes('TW') || (v.name || '').includes('Taiwan'));
      if (match) return { voice: match, pitch: 1.0, lang: 'zh-TW' };
      return { voice: voices[0], pitch: 1.0, lang: 'zh-CN' };
    } else {
      // Mặc định: Google 普通话 (Standard Mandarin zh-CN)
      const match = voices.find(v => {
        const name = (v.name || '').toLowerCase();
        return name.includes('google') || name.includes('mandarin') || name.includes('chinese') || name.includes('mainland');
      });
      if (match) return { voice: match, pitch: 1.0, lang: 'zh-CN' };
      return { voice: voices[0], pitch: 1.0, lang: 'zh-CN' };
    }
  }

  // Phát âm tiếng Trung chuẩn bằng Web Speech API
  speak(text, rate = 1.0, gender = 'google', onEnd = null, onError = null) {
    if (!text || !('speechSynthesis' in window)) {
      if (onEnd) onEnd();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/\+/g, ' ').trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const voiceInfo = this.getChineseVoice(gender);

      if (voiceInfo.voice) {
        utterance.voice = voiceInfo.voice;
      }
      utterance.lang = voiceInfo.lang || 'zh-CN';
      utterance.rate = Math.max(0.4, Math.min(2.0, parseFloat(rate) || 1.0));
      utterance.pitch = voiceInfo.pitch || 1.0;

      if (onEnd) utterance.onend = onEnd;
      if (onError) utterance.onerror = onError;

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Chinese TTS error:', e);
      if (onEnd) onEnd();
    }
  }

  // Lấy danh sách bài mẫu tiếng Trung
  getDefaultSampleTexts() {
    return JSON.parse(JSON.stringify(CHINESE_SAMPLE_TEXTS));
  }

  // Khởi tạo và nạp dữ liệu tiếng Trung từ LocalStorage
  loadTexts() {
    try {
      const rawWrite = localStorage.getItem(this.storageKeys.writeCustomTexts);
      const rawSpeak = localStorage.getItem(this.storageKeys.speakCustomTexts);

      let writeTexts = rawWrite ? JSON.parse(rawWrite) : null;
      let speakTexts = rawSpeak ? JSON.parse(rawSpeak) : null;

      // Nếu người dùng mới chuyển sang tiếng Trung lần đầu, nạp sẵn bộ bài mẫu HSK phong phú
      if (!writeTexts || writeTexts.length === 0) {
        writeTexts = this.getDefaultSampleTexts();
        localStorage.setItem(this.storageKeys.writeCustomTexts, JSON.stringify(writeTexts));
      }
      if (!speakTexts || speakTexts.length === 0) {
        speakTexts = this.getDefaultSampleTexts();
        localStorage.setItem(this.storageKeys.speakCustomTexts, JSON.stringify(speakTexts));
      }

      return { writeTexts, speakTexts };
    } catch (e) {
      return {
        writeTexts: this.getDefaultSampleTexts(),
        speakTexts: this.getDefaultSampleTexts()
      };
    }
  }

  // Kiểm tra xem ký tự có phải là Chữ Hán (CJK Ideograph) không
  isChineseChar(char) {
    if (!char) return false;
    return /[\u4e00-\u9fa5\u3400-\u4dbf\uf900-\ufaff]/.test(char);
  }

  // Kiểm tra xem ký tự có phải là dấu câu tiếng Trung không
  isChinesePunctuation(char) {
    if (!char) return false;
    return /[，。？！；：“”‘’（）《》【】、…—]/.test(char);
  }
}

// Gắn vào window để ứng dụng gọi dễ dàng
window.chineseEngine = new ChineseEngine();
