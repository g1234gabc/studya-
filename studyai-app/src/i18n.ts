import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          title: 'StudyAI Assistant',
          language: 'Language',
          selectLanguage: 'Select language',
          question: 'Your Question',
          placeholder: 'Ask any question...',
          answer: 'Answer:',
          errorMessage: 'An error occurred while processing your question.'
        }
      },
      tr: {
        translation: {
          title: 'StudyAI Asistanı',
          language: 'Dil',
          selectLanguage: 'Dil seçin',
          question: 'Sorunuz',
          placeholder: 'Herhangi bir soru sorun...',
          answer: 'Cevap:',
          errorMessage: 'Sorunuzu işlerken bir hata oluştu.'
        }
      },
      de: {
        translation: {
          title: 'StudyAI Assistent',
          language: 'Sprache',
          selectLanguage: 'Sprache auswählen',
          question: 'Ihre Frage',
          placeholder: 'Stellen Sie eine beliebige Frage...',
          answer: 'Antwort:',
          errorMessage: 'Bei der Verarbeitung Ihrer Frage ist ein Fehler aufgetreten.'
        }
      },
      fr: {
        translation: {
          title: 'Assistant StudyAI',
          language: 'Langue',
          selectLanguage: 'Sélectionnez une langue',
          question: 'Votre Question',
          placeholder: 'Posez n\'importe quelle question...',
          answer: 'Réponse :',
          errorMessage: 'Une erreur s\'est produite lors du traitement de votre question.'
        }
      }
    },
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
});

export default i18n;
