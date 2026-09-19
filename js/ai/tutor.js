// AI Tutor - Sistema di tutoraggio educativo in italiano semplice
class TutorAI {
    constructor() {
        this.name = 'Tutor AI';
        this.context = null;
        this.knowledgeBase = {
            general: {
                'cosa è il desktop': 'Il desktop è come la scrivania del tuo computer: è lo spazio dove puoi mettere le icone delle cose che usi di più!',
                'cosa è un\'icona': 'Un\'icona è come un disegnino che rappresenta un programma o un file. Se ci fai doppio click, lo apri!',
                'cosa è una finestra': 'Una finestra è come un foglio di carta che si apre sul desktop. Puoi spostarla, ingrandirla o chiuderla.',
                'cosa è una cartella': 'Una cartella è come una scatola dove puoi mettere i tuoi file. Ti serve per organizzare le cose!',
                'cosa è un file': 'Un file è come un foglio di carta: può essere un disegno, una foto, un documento...',
                'cosa è internet': 'Internet è come una grande biblioteca mondiale dove puoi trovare informazioni, giocare e parlare con persone lontane.',
                'cosa è un sito web': 'Un sito web è come una pagina di un libro, ma sul computer. Puoi leggerlo, guardare immagini e guardare video.',
                'come si apre un\'app': 'Per aprire un\'app, fai doppio click sulla sua icona! È facile: click, click e si apre!',
                'come si chiude una finestra': 'Per chiudere una finestra, clicca sul pulsante X in alto a destra. È rosso per ricordarti che è per chiudere!',
                'come si sposta una finestra': 'Per spostare una finestra, tieni premuto il titolo blu in alto e trascina dove vuoi!',
                'come si minimizza': 'Per nascondere una finestra temporaneamente, clicca sul trattino (-) in alto a destra. Ricompare nella barra in basso!',
                'come si massimizza': 'Per ingrandire una finestra a tutto schermo, clicca sul quadrato (□) in alto a destra.',
                'come si usa il file manager': 'Nel File Manager puoi creare cartelle, spostare file, rinominare cose... È come l\'armadio dei tuoi file!',
                'come si crea una cartella': 'Per creare una cartella, apri il File Manager e clicca il pulsante "Nuova cartella". Poi dai un nome!',
                'come si elimina un file': 'Per eliminare un file, selezionalo e premi il pulsante "Elimina" nel File Manager. Attenzione: poi sparisce!',
                'come si rinomina': 'Per rinominare un file o una cartella, selezionalo e clicca "Rinomina". Scrivi il nuovo nome e premi Invio.',
                'come si cambia lo sfondo': 'Per cambiare lo sfondo, apri Impostazioni e cerca la sezione "Aspetto" o "Sfondo". Scegli quello che ti piace!',
                'come si cambia la lingua': 'Purtroppo al momento WebOS Educativo è solo in italiano. Ma stiamo lavorando per aggiungere altre lingue!',
                'cosa sono le impostazioni': 'Le Impostazioni sono dove puoi cambiare le preferenze del computer: sfondo, dimensione delle icone, modalità...',
                'cosa è la barra delle applicazioni': 'La barra in basso si chiama barra delle applicazioni. Lì vedi le app aperte, l\'orologio e il pulsante Menu.',
                'cosa è il menu start': 'Il Menu (o Start) è il pulsante in basso a sinistra. Cliccandolo si aprono tutte le app disponibili!',
                'come si spegne': 'Per spegnere, clicca sul pulsante Menu, poi su "Spegni". Vedrai una schermata di arrivederci!',
                'come si riaccende': 'Per riaccendere, clicca sul pulsante "Riaccendi" che appare sulla schermata di spegnimento.',
                'come si gioca': 'Per giocare, apri l\'app "Giochi" dal Menu! Troverai giochi educativi per imparare divertendoti.',
                'cosa è il tutor': 'Io sono il Tutor AI! Il tuo amico che ti spiega come funziona il computer in modo semplice e paziente.',
                'come si usa il tutor': 'Puoi chiedermi qualsiasi cosa! Scrivi nella chat o clicca sulle domande suggerite. Sono qui per aiutarti!',
                'che ore sono': new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
                'che giorno è': new Date().toLocaleDateString('it-IT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
                'come si va a un sito': 'Nel Browser simulato, scrivi l\'indirizzo nella barra in alto e premi Invio. Oppure clicca sui link!',
                'cosa è un link': 'Un link è come un passaggio segreto: cliccandolo vai a un\'altra pagina web! Di solito è blu e sottolineato.',
                'come si torna indietro': 'Per tornare indietro nel browser, clicca la freccia ←. Oppure usa il pulsante "Indietro" del browser.',
                'come si usa la calcolatrice': 'Nella Calcolatrice puoi fare operazioni di base: addizioni, sottrazioni, moltiplicazioni e divisioni. Premi i numeri, poi l\'operatore, poi = per avere il risultato!',
                'come si calcola la percentuale': 'Per calcolare la percentuale, digita il numero e premi il pulsante %. Per esempio: 50 % = 0,50',
                'come si calcola la radice quadrata': 'Per calcolare la radice quadrata, digita il numero e premi il pulsante √. Per esempio: √9 = 3',
                'come si cambia il segno': 'Per cambiare il segno di un numero (da positivo a negativo o viceversa), digita il numero e premi il pulsante ±.',
            },
            bambino: {
                'cosa è il computer': 'Il computer è una macchina magica che ti permette di disegnare, giocare, imparare e tanto altro!',
                'come si gioca': 'Vai nel menu Giochi! Ci sono tanti giochi divertenti dove impari cose nuove mentre ti diverti!',
                'come si disegna': 'Al momento non abbiamo un\'app per disegnare, ma stiamo lavorando per aggiungerla! Intanto puoi esplorare le altre app.',
                'perché devo imparare': 'Imparare a usare il computer è come imparare ad andare in bicicletta: una volta che lo sai, puoi fare tantissime cose!',
                'come si usa la calcolatrice': 'La Calcolatrice serve per fare i compiti di matematica! Prova a fare 2 + 2 e premi = per vedere il risultato!',
                'come si gioca a trascina nella cartella': 'Trascina i file nella cartella giusta! Ogni file appartiene a una cartella: le foto vanno in Immagini, i documenti in Documenti e la musica in Musica!',
            },
            anziano: {
                'cosa è il computer': 'Il computer è uno strumento utile per rimanere in contatto con i parenti, leggere notizie e fare tante cose comodamente da casa.',
                'come si scrive': 'Usa la tastiera! Ogni tasto ha una lettera. Se sbagli, usa il tasto "Canc" per correggere.',
                'come si ingrandisce il testo': 'Nelle Impostazioni puoi cambiare la dimensione delle icone. Inoltre, ogni app ha testo grande e chiaro per essere letto facilmente.',
                'come si chiede aiuto': 'Sono qui per te! Chiedimi qualsiasi cosa e ti risponderò con parole semplici e pazienti. Non hai paura di sbagliare!',
                'come si stampa': 'Al momento la stampa non è disponibile in questo simulatore. Ma se impari qui, potrai stampare anche su un computer vero!',
                'come si invia una email': 'Questa è una versione base, ma se impari a usare il browser qui, potrai inviare email su un computer vero senza difficoltà!',
                'come si usa la calcolatrice': 'La Calcolatrice è utile per fare conti veloci: spese, cambi di valuta, percentuali di sconto. Premi i numeri, l\'operazione e poi =!',
            }
        };

        this.contextHistory = [];
    }

    getResponse(question, userProfile = 'adulto') {
        const q = question.toLowerCase().trim();

        // Check context history for more relevant answers
        if (this.contextHistory.length > 0) {
            const lastContext = this.contextHistory[this.contextHistory.length - 1];
            if (lastContext && lastContext.app) {
                this.context = lastContext.app;
            }
        }

        // Search in profile-specific knowledge base first
        let answer = this.searchKnowledgeBase(q, userProfile);

        // If not found, search in general knowledge base
        if (!answer) {
            answer = this.searchKnowledgeBase(q, 'general');
        }

        // Fallback responses
        if (!answer) {
            answer = this.getFallbackResponse(q, userProfile);
        }

        // Add to context history
        this.contextHistory.push({ question, answer, timestamp: new Date() });
        if (this.contextHistory.length > 20) {
            this.contextHistory.shift();
        }

        return answer;
    }

    searchKnowledgeBase(question, profile) {
        const kb = this.knowledgeBase[profile] || this.knowledgeBase.general;

        for (const [key, value] of Object.entries(kb)) {
            if (question.includes(key) || key.includes(question)) {
                return value;
            }
        }

        // Partial matching
        for (const [key, value] of Object.entries(kb)) {
            const words = key.split(' ');
            const matchCount = words.filter(w => question.includes(w)).length;
            if (matchCount >= words.length * 0.6) {
                return value;
            }
        }

        return null;
    }

    getFallbackResponse(question, profile) {
        const fallbacks = {
            bambino: [
                'Ottima domanda! Prova a esplorare le app nel menu. Se non trovi quello che cerchi, chiedimi ancora!',
                'Mi piace la tua curiosità! Prova a cliccare sulle icone e vedere cosa succede. Sono qui se hai bisogno di aiuto!',
                'Bravo che chiedi! Il computer ha tante cose da scoprire. Vuoi che ti faccia vedere qualcosa di divertente?',
            ],
            anziano: [
                'Buona domanda! Non ti preoccupare se non ti è chiaro: possiamo ripetere quante volte vuoi. Ogni cosa ha il suo tempo.',
                'Capisco la tua domanda. Ricorda: sul computer non si rompe niente se esplori! Prova a cliccare sulle cose e vedi cosa succede.',
                'È normale avere domande! Sono qui per rispondere con calma e pazienza. Cosa ti piacerebbe sapere di più?',
            ],
            adulto: [
                'Buona domanda! Prova a esplorare le app disponibili. Se hai bisogno di aiuto su qualcosa di specifico, chiedimi pure.',
                'Posso aiutarti a capire come funziona questo simulatore. Che cosa ti interessa di più?',
            ]
        };

        const responses = fallbacks[profile] || fallbacks.adulto;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getSuggestions(profile) {
        const suggestions = {
            bambino: [
                'Cosa posso fare?',
                'Come si gioca?',
                'Cosa è il desktop?',
                'Come si apre un\'app?',
                'Come si usa la calcolatrice?',
            ],
            anziano: [
                'Come si usa il computer?',
                'Come si ingrandisce il testo?',
                'Come si chiede aiuto?',
                'Cosa posso fare qui?',
                'Come si usa la calcolatrice?',
            ],
            adulto: [
                'Come funziona il desktop?',
                'Come si usa il file manager?',
                'Cosa posso imparare?',
                'Come si usa la calcolatrice?',
                'Come si calcola una percentuale?',
            ]
        };

        return suggestions[profile] || suggestions.adulto;
    }

    getGuideSteps() {
        return [
            {
                title: 'Benvenuto!',
                text: 'Ciao! Sono il tuo Tutor AI. Ti guiderò alla scoperta di questo computer virtuale. Non worries: qui non si rompe niente!',
                target: null,
            },
            {
                title: 'Il Desktop',
                text: 'Questa è la schermata principale, chiamata "desktop". È come la scrivania: qui puoi mettere le icone dei programmi che usi di più.',
                target: '#desktop',
            },
            {
                title: 'Le Icone',
                text: 'Le icone sono i disegnini colorati sul desktop. Se ci fai doppio click, apri il programma corrispondente! Prova con "File e cartelle".',
                target: '#desktop-icons',
            },
            {
                title: 'La Barra in Basso',
                text: 'La barra nera in basso si chiama "barra delle applicazioni". Qui trovi il pulsante Menu, le app aperte e l\'orologio.',
                target: '#taskbar',
            },
            {
                title: 'Il Menu',
                text: 'Clicca sul pulsante "Menu" in basso a sinistra per vedere tutte le app disponibili!',
                target: '#start-btn',
            },
            {
                title: 'Le Finestre',
                text: 'Quando apri un\'app, si apre una "finestra". Puoi spostarla tenendo premuto il titolo blu, e chiuderla con il pulsante X rosso.',
                target: '#window-container',
            },
            {
                title: 'File e Cartelle',
                text: 'Nel File Manager puoi creare cartelle, creare file, e organizzare i tuoi documenti. È come un armadio digitale! Prova ad aprire l\'app "File e cartelle".',
                target: null,
            },
            {
                title: 'Internet Sicuro',
                text: 'Il Browser simulato ti permette di esplorare pagine sicure per imparare cos\'è Internet. Qui non ci sono pericoli: è tutto controllato!',
                target: null,
            },
            {
                title: 'La Calcolatrice',
                text: 'Nella Calcolatrice puoi fare operazioni matematiche: addizioni, sottrazioni, moltiplicazioni e divisioni. Inoltre, puoi calcolare percentuali con %, radici quadrate con √, e cambiare il segno con ±.',
                target: null,
            },
            {
                title: 'Personalizzazione',
                text: 'Nelle Impostazioni puoi cambiare lo sfondo, la dimensione delle icone e la modalità (Bambino, Adulto, Anziano). Il computer si adatta a te!',
                target: null,
            },
            {
                title: 'Il Tutor AI',
                text: 'Sono qui per aiutarti in qualsiasi momento! Puoi chiedermi qualsiasi cosa nella chat, o cliccare sulle domande suggerite.',
                target: null,
            },
            {
                title: 'Giochi Educativi',
                text: 'Nell\'app Giochi puoi divertirti mentre impari: prova "Trascina nella cartella" per esercitarti con i file, o "Indovina a cosa serve" per imparare le icone!',
                target: null,
            },
            {
                title: 'Pronto!',
                text: 'Perfetto! Ora sai le basi. Esplora le app, chiedimi qualsiasi cosa. Ricorda: qui è tutto virtuale, quindi sperimenta pure senza paura!',
                target: null,
            }
        ];
    }
}

// Export for use in app.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TutorAI;
}
