import {TextUtils} from './text-utils';

describe('test text utils', () => {

    const transcriptionModel = require('tests/assets/metadata/sample-transcription.json');

    it('Test text utils:  ', () => {
        const fackText1 = 'La journée commence. Il s’habille comme il peut tout en prenant son café. Chemise blanche repassée la veille par lui-même. ';
        const fackText2 = 'Une cravate comme tous les jours. Et son costume noir de chez Sam Montiel, très chic et très branché. Chaussures cuir noir. ';
        const fackText3 = 'Comme il aime faire remarquer : "Vous êtes soit dans vos chaussures, soit dans votre lit. Alors il faut de bonnes chaussures' +
            ' et une bonne literie !". La météo a annoncé un ciel bleu et des températures au-dessus de la normale saisonnière. C’est un très beau mois de mai qui s’annonce.';

        expect(TextUtils.hasSearchText('aussi', 'aussi')).toEqual(true);
        expect(TextUtils.hasSearchText(fackText1, 'journee')).toEqual(true);
        expect(TextUtils.hasSearchText(fackText1, 'il')).toEqual(true);
        expect(TextUtils.hasSearchText(fackText1, 'elle')).toEqual(false);
    });
});


