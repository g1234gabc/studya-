export class ChemistryKnowledgeBase {
  private static chemistryQuestions: { [key: string]: string } = {
    // Chemistry reaction questions
    'gümüş nitrat ve sodyum klorür tepkimesi': `Gümüş nitrat (AgNO3) ile sodyum klorür (NaCl) tepkimesi:

Tepkime denklemi: AgNO3 (suda) + NaCl (suda) → AgCl (çökelti) + NaNO3 (suda)

Çökelti: Gümüş klorür (AgCl), beyaz renkli bir çökeltidir.

Sulu çözeltideki iyonlar:
1. AgNO3 çözeltisi: Ag+ ve NO3- iyonları
2. NaCl çözeltisi: Na+ ve Cl- iyonları
3. Tepkime sonrası: Na+ ve NO3- (suda çözünür), AgCl (katı çökelti)

Net iyon denklemi:
Ag+ (suda) + Cl- (suda) → AgCl (katı)

Tepkime özellikleri:
- Çökme tepkimesidir
- Stokiyometrik oranda gerçekleşir
- Sıcaklıktan fazla etkilenmez`,

    // More chemistry questions can be added here
    'kimyasal tepkime nedir': `Kimyasal tepkime, bir veya daha fazla maddenin başka maddelere dönüşmesi işlemidir. 

Temel özellikleri:
1. Yeni madde oluşumu
2. Atomların yeniden düzenlenmesi
3. Enerji değişimi
4. Kimyasal bağların kırılması ve oluşması`,

    // Fallback response
    'default': `Üzgünüm, bu soruya şu anda tam yanıt veremiyorum. 
Kimya ile ilgili genel bilgiler almak isterseniz:
- Periyodik tabloyu inceleyebilirsiniz
- Kimyasal tepkimeler hakkında daha fazla bilgi edinebilirsiniz
- Spesifik bir konu hakkında daha net soru sorabilirsiniz`
  };

  static getResponse(question: string): string {
    // Normalize the question by converting to lowercase and removing punctuation
    const normalizedQuestion = question.toLowerCase()
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
      .trim();

    // Check for exact or partial matches
    for (const [key, response] of Object.entries(this.chemistryQuestions)) {
      if (normalizedQuestion.includes(key)) {
        return response;
      }
    }

    // Return default response if no match found
    return this.chemistryQuestions['default'];
  }
}
