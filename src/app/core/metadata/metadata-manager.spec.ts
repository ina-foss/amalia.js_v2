import {async, fakeAsync, getTestBed, TestBed, tick} from '@angular/core/testing';
import {HttpClient} from '@angular/common/http';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {DefaultLogger} from '../logger/default-logger';
import {DefaultMetadataConverter} from './converter/default-metadata-converter';
import {DefaultMetadataLoader} from './loader/default-metadata-loader';
import {Metadata} from '@ina/amalia-model';
import {MetadataManager} from './metadata-manager';
import {DefaultConfigConverter} from '../config/converter/default-config-converter';
import {ConfigurationManager} from '../config/configuration-manager';
import {PlayerConfigData} from '../config/model/player-config-data';
import {PluginConfigData} from '../config/model/plugin-config-data';
import {ConfigDataSource} from '../config/model/config-data-source';
import {ConfigData} from '../config/model/config-data';
import {DefaultConfigLoader} from '../config/loader/default-config-loader';
import {TimeBarConfig} from '../config/model/time-bar-config';
import {TimeBarPluginComponent} from '../../plugins/time-bar/time-bar-plugin.component';

describe('Test Metadata manager', () => {
    let injector: TestBed;
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    const transcriptionModel = require('tests/assets/metadata/sample-transcription.json');
    const mediaSrc = 'https://www.w3schools.com/html/mov_bbb.mp4';
    const testMetadata = 'http://localhost/test.json';
    let configData: ConfigData;
    const logger = new DefaultLogger();
    let metadataManager: MetadataManager = null;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            declarations: [],
        }).compileComponents();
        injector = getTestBed();
        httpTestingController = injector.inject(HttpTestingController);
        httpClient = injector.inject(HttpClient);
        const player: PlayerConfigData = {
            autoplay: false, crossOrigin: null, data: null, defaultVolume: 0, duration: null, poster: '', src: mediaSrc
        };
        const pluginsConfiguration: Map<string, PluginConfigData<any>> = new Map<string, PluginConfigData<any>>();
        const conf: PluginConfigData<TimeBarConfig> = {name: TimeBarPluginComponent.PLUGIN_NAME, data: {timeFormat: 'f'}};
        pluginsConfiguration.set(TimeBarPluginComponent.PLUGIN_NAME, conf);

        const dataSources: Array<ConfigDataSource> = new Array<ConfigDataSource>();
        configData = {player, pluginsConfiguration, dataSources};
        const configLoader = new DefaultConfigLoader(new DefaultConfigConverter(), logger);
        const configurationManager = new ConfigurationManager(configLoader, logger);
        const metadataLoader = new DefaultMetadataLoader(httpClient, new DefaultMetadataConverter(), logger);
        metadataManager = new MetadataManager(configurationManager, metadataLoader, logger);

    }));

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });


    it('Test Metadata: loader', fakeAsync(() => {
        const converter = new DefaultMetadataConverter();
        const loader = new DefaultMetadataLoader(httpClient, converter, logger);
        const metadataPromise = loader.load(testMetadata);
        // .load('./tests/assets/metadata/sample-transcription.json');
        metadataPromise.then((data) => {
            const m: Metadata = data[0];
            expect(m.id).toContain('transcription_test');
            expect(m.localisation.length).toEqual(1);
            expect(m.localisation[0].sublocalisations.localisation[0].tcin).toContain('00:00:00.0130');
            expect(m.localisation[0].sublocalisations.localisation[0].tcout).toContain('00:14:59.0090');
            expect(m.localisation[0].sublocalisations.localisation[0].data.text)
                // tslint:disable-next-line:max-line-length
                .toContain(' Avis  aux  fans  au  plus  on  devrait  rester  honnête  à  monument  on  .  Ce  serait  ou  que  j\'  ai  .  C\'est  d\'  un  on  a  plein  de  chansons  comme  ça  en  finale  tendance  cette  semaine  .  Les  assassins  sont  disait  on  vous  dédier  votre  votre  vieux  tango  c\'est  c\'est  une  musique  qui  qui  prend  qui  n\'  offre  pas  36  36  seulement  .  Voilà  ,  c\'est  un  peu  comme  comme  le  jazz  ou  ,  comme  l\'  évoque  aussi  les  cendres  et  c\'est  une  que  énorme  et  c\'est  le  passé  et  qui  les  ont  Mahamat  militant  ,  c\'est  pour  la  vie  ,  une  autre  ,  c\'est  pour  la  fin  comme  kiné  à  exister  cet  hémicycle  vérité  à  une  énorme  mais  qui  sert  aussi  pour  sa  part  ,  c\'était  dans  l\'  avenir  ,  et  maintenant  plus  que  ça  met  fin  à  l\'  affaire  .  Je  vous  propose  maintenant  à  tous  les  trois  de  découvrir  l\'  actualité  musicale  de  la  semaine  .  Des  nouvelles  de  Thomas  Dutronc  teste  ses  nouvelles  chansons  en  public  ,  s\'  il  vous  plaît  ,  le  retour  d\'  édition  en  Coupe  d\'  Europe  pourra  donc  qui  a  un  peu  grandi  forcément  et  la  sortie  du  nouvel  album  des  Californiens  de  Foster  ceux  qui  .  Il  est  .  Ben  je  sais  .  Ce  même  petit  détour  par  la  Nouvelle  Eve  dans  le  quartier  de  Pigalle  à  Paris  où  Thomas  Dutronc  a  testé  les  chansons  de  son  futur  album  sur  quelques  privilégiés  .  La  voix  parce  que  j\'  ai  -je  .  Retrouvons  donc  Thomas  Dutronc  dans  sa  loge  ,  quelques  minutes  seulement  avant  son  entrée  en  scène  .  Un  allongé  et  pas  un  bobo  et  alors  qu\'  on  avait  du  des  trucs  bizarres  j\'  décide  de  faire  comme  si  on  était  chez  moi  de  très  convivial  ,  de  mettre  les  gens  dans  la  boucle  la  cession  de  leur  nation  et  voilà  une  vérité  composé  cette  chanson  ,  j\'  en  avais  la  langue  corse  aussi  d\'  histoire  en  19  heures  12  et  en  été  ,  on  était  sur  la  terrasse  ,  etc  ça  comme  ça  ,  hôpital  un  antique  simplement  qu\'  on  ne  sera  pas  demain  .  Donc  ,  Thomas  Dutronc  ,  teste  ses  chansons  mais  aussi  ses  vannes  et  tout  ça  sans  filet  .  Tout  le  monde  .  Celle  des  lycées  ,  ce  n\'  est  pas  encore  les  remplacement  celui  de  les  valises  ,  j\'  ai  dit  ,  sont  prises  qu\'  il  trente  bien  ,  elles  ont  compensé  sur  scène  en  quatre  morceaux  de  dans  ce  perd  il  en  France  ,  il  perdit  vont  -ils  vers  cette  formule  à  98  ,  ça  permet  de  voilà  d\'  improviser  vraiment  faire  de  la  vraie  musique  la  vie  maintenant  succession  soit  mieux  vermeil  .  Sais  qui  c\'est  tous  les  .  Cette  semaine  ,  l\'  actu  ,  c\'est  aussi  le  retour  des  kilos  ,  ils  avaient  tellement  couru  qu\'  on  les  avait  perdu  lui  dis  donc  nous  étions  le  groupe  de  sa  fraude  des  Yvelines  était  porté  disparu  depuis  six  ans  ,  6  ans  ,  bon  sang  mais  c\'est  long  ,  on  avait  fini  par  croire  qu\'  ils  étaient  morts  .  Maintenant  ,  ils  viennent  de  sortir  leur  troisième  album  L\'  équipe  .  Le  chercher  .  Salut  les  gars  .  ça  veut  dire  qu\'  on  faisait  un  break  ,  il  a  déjà  beaucoup  plus  longtemps  et  c\'est  un  peu  étonnant  ,  c\'est  qu\'  on  a  tous  envie  au  même  moment  ,  portant  son  .  Mmh  .  L\'  aviez  quand  même  redemande  bien  les  tibias  continue  du  coup  nous  servir  des  refrains  qui  collent  aux  tympans  et  des  paroles  qui  mettent  le  monde  .  Voilà  ,  il  se  rend  sensations  différent  générations  antérieures  source  plus  .  Et  comme  un  bonheur  ne  vient  jamais  seul  ,  qui  on  va  aussi  retrouver  le  chemin  de  la  scène  ,  et  là  aussi  ,  ils  ont  envie  de  mettre  le  paquet  .  On  ne  peut  jouer  ensemble  sur  scène  qui  étaient  venus  de  Genève  je  pense  qu\'  il  a  une  vraie  écrit  peut-être  de  tous  ces  trucs  simples  visuellement  ,  passionné  par  l\'  image  ,  pense  que  c\'est  un  ça  .  Ah  oui  je  vois  plein  de  ferveur  à  ,  d\'  un  crochet  moulé  et  sinon  ,  est  -ce  que  vous  vous  souvenez  de  ça  en  2011  ,  le  groupe  de  rock  américain  Foster  avait  pris  la  planète  Dassault  avec  son  premier  album  ,  sise  et  ce  méga-  tube  tapis  .  Ils  ont  sorti  leur  deuxième  album  super  modèle  cette  semaine  et  vu  le  succès  du  premier  les  gains  se  sont  clairement  sous  pression  .  La  plus  grosse  prise  de  tête  pour  le  deuxième  album  ,  c\'est  un  c\'est  que  les  gens  vont  l\'  écouter  et  qu\'  ils  ont  beaucoup  d\'  attentes  ,  cinq  femmes  pour  moi  ça  a  été  super  important  d\'  essayer  de  me  détacher  de  ce  serait  proche  à  mettre  la  pression  des  femmes  et  des  critiques  à  distance  .  C\'est  celle  -là  est  parce  que  .  Non  ,  c\'est  super  modèle  ,  le  nouvel  album  ,  le  groupe  a  fait  réaliser  une  gigantesque  fresque  sur  un  mur  de  la  cité  des  anges  ,  ah  on  filme  le  bazar  mais  les  images  en  avance  acquise  et  hop  ,  on  a  l\'  équipe  pour  le  nouveau  single  commis  avec  dans  la  poche  .  Avant  on  aime  ce  qu\'  on  fait  un  faux  et  on  a  beaucoup  de  chance  de  pouvoir  exercer  notre  art  de  votre  très  reconnaissants  ,  oui  ,  c\'est  qu\'  on  prend  ça  au  sérieux  ,  mais  sans  nous  laisser  emprisonner  .  Alors  sans  transition  l\'  �?tat  sa  frontière  ,  est  -ce  que  le  tango  est  par  essence  une  musique  mélancolique  .  Je  pense  que  ce  qui  amène  beaucoup  de  côté  ,  on  veut  dire  quoi  mélancolique  dans  le  tango  ,  c\'est  l\'  instrument  ,  c\'est  le  drame  dans  les  Landes  ,  c\'est  un  état  seront  très  difficiles  à  jouer  et  les  premiers  noms  de  la  liste  ,  en  fait  ,  ils  n\'  arrivaient  pas  trop  à  jouer  et  très  très  rapidement  et  c\'est  vrai  ,  ça  me  fait  rire  ,  non  mais  ça  ,  il  faisait  plutôt  dénote  l\'  en  avait  tiré  et  tout  ça  autour  ,  au  tout  début  ,  ce  qui  a  porté  à  7  c\'est  tous  aussi  de  de  mélancolie  .  Christophe  ,  pardon  ,  vous  connaissez  quoi  de  avant  avant  de  .  Moi  je  suis  fan  des  Rita  Mitsouko  de  de  de  tout  le  tout  début  ,  donc  je  connaissais  .  Toutes  les  églises  et  alors  il  est  bien  hommes  les  d\'  ailleurs  ,  je  suis  arrivé  la  première  fois  qu\'  on  s\'est  vus  c\'est  arrivé  avec  Maureen  il  prenait  place  du  dialogue  paraît  Norfolk  par  Catherine  seulement  arriver  au  tout  début  en  fanfare  .  Et  puis  ,  et  puis  bah  c\'est  assez  mal  c\'est  à  Nantes  que  se  lever  et  l\'  inconnu  à  chaîne  c\'est  peut-être  un  chef  d\'  .  Seventies  .  Ces  jours  -ci  sort  un  album  inédit  de  Johnny  Cash  qui  reste  ,  même  après  sa  mort  ,  l\'  incarnation  même  de  la  musique  anti-  américaine  ,  Johnny  Cash  ,  l\'  homme  en  noir  ,  c\'est  le  portrait  de  la  .  Alors  ,  vous  avez  fait  .  Son  nom  est  Cash  Johnny  Cash  et  ils  s\'  habillent  en  noir  ,  icône  de  la  com  c\'est  inusité  ,  bien  plus  encore  depuis  sa  mort  en  2003  ,  le  chanteur  de  Nashville  Tennessee  toujours  parler  de  lui  cette  semaine  plus  de  .  Trente  ans  après  son  enregistrement  sort  enfin  l\'  album  inédit  a  hautement  geste  en  7  sur  le  label  Columbia  13  pistes  formidable  dont  on  se  demande  encore  pourquoi  ils  sont  restés  si  longtemps  dans  un  tiroir  ,  c\'est  c\'est  le  dévouement  de  son  fils  John  Carter  Cash  ici  dans  les  bras  de  ses  parents  ,  qui  nous  permet  aujourd\'hui  de  découvrir  ces  petits  joyaux  qui  ne  sentent  pas  le  renfermé  ,  si  ces  morceaux  n\'  ont  pas  pris  une  ride  ,  John  Carter  ,  lui  a  un  peu  changé  .  C\'est  triste  ,  mais  à  l\'  époque  la  maison  Disney  pas  su  comment  gérer  l\'  album  d\'  un  projet  marketing  du  ni  comment  le  faire  jouer  en  radio  Prague  .  C\'est  à  cette  époque  ,  le  label  décide  de  ne  pas  renouveler  le  contrat  de  Johnny  Cash  ,  qui  courait  pourtant  depuis  le  début  de  sa  carrière  ,  son  premier  disque  ,  c\'est  à  Memphis  ,  que  l\'  homme  en  noir  l\'  enregistrer  dans  les  mythiques  studios  qui  verte  éclore  Elvis  Presley  un  an  auparavant  ,  un  membre  du  quatuor  vocal  pour  vous  dans  les  années  90  à  revendique  depuis  Paris  l\'  héritage  de  Johnny  Cash  ,  un  héritage  à  cheval  entre  country  rock  and  roll  et  d\'  Aspe  .  Hein  .  Dès  le  départ  ,  il  y  a  une  musique  qui  beaucoup  plus  sombre  que  la  contradiction  ,  elle  dit  des  choses  beaucoup  plus  sombre  ,  il  est  déjà  implanté  ,  effaçant  sa  musique  en  Savoie  et  en  même  temps  il  y  a  ,  il  y  a  un  peu  de  la  même  énergie  que  que  le  jeune  Elvis  Presley  par  exemple  .  Le  jeune  Elvis  avec  qui  il  enregistre  pour  sonnerie  corse  au  sein  du  1000e  Dollar  Quartet  avec  aussi  Thierry  Delay  oui  c\'est  Pékin  Perkins  .  Comme  il  a  été  élevé  entre  dans  les  champs  de  coton  travailler  aussi  dur  que  les  travailleurs  noirs  et  il  a  appris  des  choses  ,  des  chanteurs  noirs  il  adorait  gospel  ,  voilà  .  La  preuve  dans  ce  jour  d\'  un  soir  ,  aux  côtés  du  trompettiste  Louis  Armstrong  ,  bien  loin  de  l\'  Amérique  ,  c\'est  de  négationnistes  et  racistes  de  l\'  époque  .  Hein  ,  c\'est  un  .  Il  vacanciers  les  paroles  est  il  ailleurs  quoi  très  vite  dans  un  des  60  ,  il  prend  le  risque  de  de  d\'  enregistrer  de  ce  qui  est  très  mal  vu  de  l\'  establishment  parce  que  dit  là  ,  ça  veut  dire  les  jeunes  selon  la  la  guitare  .  à  des  années-lumière  de  cette  image  de  conservateur  Johnny  Cash  est  un  humaniste  ,  défenseur  de  la  nature  et  des  Indiens  d\'  Amérique  .  Pour  preuve  ,  ces  dans  des  prisons  américaines  qu\'  il  donne  à  de  nombreuses  reprises  ,  des  concerts  ,  devenu  depuis  légendaire  .  Le  jour  ,  je  ne  mmh  .  Bonsoir  ,  c\'est  mon  père  chantait  des  chansons  pour  se  pour  ,  personne  ne  voulait  jouer  pour  les  mépriser  pour  les  laissés-pour-compte  ou  pour  les  impardonnable  .  Des  concerts  à  l\'  ambiance  extrêmement  tendue  ,  devant  un  public  qui  n\'  aurait  pas  reculé  devant  une  bonne  bagarre  .  ça  été  trouveront  -ils  avec  un  mot  à  dire  qu\'  on  peut  dire  pour  que  ça  explose  ,  il  a  toujours  gardé  de  les  étaient  comme  10  .  Si  ,  avant  d\'  être  remercié  par  son  label  Columbia  au  milieu  des  années  80  Johnny  Cash  publie  pas  moins  de  59  10  en  93  paraître  grand  producteur  de  hip-hop  Johnny  Cash  enregistre  le  premier  des  trois  volumes  de  American  Diniz  ces  disques  sont  aujourd\'hui  considérés  comme  parmi  les  plus  importants  de  sa  carrière  ,  véritable  oeuvre  testamentaire  .  On  voit  le  personnage  qui  était  devenue  la  stature  qu\'  il  avait  tout  d\'  un  coup  ,  c\'était  toute  résistance  quoi  ça  est  en  place  et  après  ça  a  été  ça  c\'est  magnifique  album  à  l\'  Assemblée  .  Après  tête  mais  américains  dont  les  corps  Diniz  ont  permis  à  l\'  héritage  de  mon  père  de  perdurer  ,  j\'  en  suis  persuadé  pour  d\'  autres  ,  essayer  de  monter  des  projets  similaires  mais  ont  échoué  ne  croit  et  le  secret  de  cette  réussite  ,  c\'est  quoi  je  un  .  Ou  hum  .  Par  Johnny  Cash  ,  forcément  c\'est  une  .  été  chassait  et  adoré  Johnny  Cash  et  on  entendait  beaucoup  beaucoup  oui  ,  c\'était  un  artiste  très  sérieux  en  et  qu\'  il  pouvait  jouer  des  choses  à  la  fois  simple  et  qui  vous  touchez  au  coeur  directement  ,  et  ça  me  fait  penser  chasse  Johnny  Cash  .  Alors  là  ,  c\'est  un  petit  magnéto  qui  va  s\'  adresser  à  vous  Catherine  Page  je  donne  la  parole  à  un  groupe  s\'  appelle  chacun  un  groupe  de  rock  français  qui  avait  ce  petit  message  pour  vous  .  Salut  Catherine  je  sais  pas  ,  c\'est  une  connerie  ,  mais  en  connaît  très  bien  et  en  fait  ,  j\'  avais  une  question  à  creuser  c\'est  est  -ce  tu  c\'est  entrer  dans  le  secret  ,  il  y  a  un  statut  mépriser  l\'  avis  général  ,  je  dis  aime  .  J\'  ai  jamais  voulu  marier  dans  lequel  j\'  ai  pas  envie  d\'  épouser  qui  que  ce  soit  ,  mais  quand  même  c\'est  gentil  de  est  aussi  très  flatté  d\'  être  d\'  avoir  cette  invite  ,  mais  peut-être  qu\'  il  faudrait  qu\'  on  se  connaissait  un  petit  peu  plus  que  le  mariage  quand  même  quelque  chose  de  sérieux  normalement  .  Ceci  dit  ,  c\'est  vrai  qu\'  on  peut  se  marier  ,  divorcer  toutes  ces  jouets  voilà  allez  Marion  nouveau  divorce  il  y  a  peu  .  Place  à  prendre  ,  si  on  vous  retrouve  tout  de  suite  pour  un  2e  titre  existe  de  votre  disque  New  de  son  ,  un  titre  qui  s\'  appelle  c\'est  .  Tant  que  ça  .  Mais  je  sais  nous  ont  le  droit  d\'  vous  c\'est  1-1-1-3  à  un  y  un  très  sévère  pour  les  uns  ,  un  à  l\'  est  et  le  nord  c\'est  un  ton  à  nouveau  ,  c\'est  la  même  bien  qu\'  il  y  a  pour  l\'  argent  ,  de  non  ,  il  n\'  a  clairement  et  nous  ,  on  est  d\'  un  mois  et  le  et  on  ose  dire  ,  à  .  Et  l\'  un  des  trains  on  .  Il  neige  on  nous  aurons  des  invités  à  la  et  moi  je  l\'  ai  ,  je  ne  vois  donc  pas  à  moi  c\'est  et  bon  .  un  à  un  et  1-1-1-1  .  Et  de  de  .  Le  nous  ,  on  vient  de  le  dire  ,  point  de  cette  zone  ,  il  a  un  ça  c\'est  pas  nouveau  ,  c\'est  même  si  c\'est  un  un  village  a  laissé  un  voile  la  c\'est  un  moment  service  laisse  la  dans  la  tête  de  la  ville  . ');
        }).catch(() => {
            fail('Error to call assert');
        });
        httpTestingController.expectOne(testMetadata).flush(transcriptionModel, {
            status: 200,
            statusText: 'Ok'
        });
        try {
            // tslint:disable-next-line:no-unused-expression
            new DefaultMetadataLoader(null, converter, logger);
        } catch (e) {
            expect().nothing();
        }
        // Call tick with actually processes te response
        tick();
    }));

    it('Test Metadata: metadata manager ', () => {
        metadataManager.addMetadata(transcriptionModel);
        expect(metadataManager.getMetadata('transcription_test').id).toContain('transcription_test');
        metadataManager.removeMetadata(transcriptionModel);
        //
        try {
            metadataManager.addMetadata(null);
        } catch (e) {
            expect(true).toBeTruthy();
        }

        try {
            metadataManager.getMetadata('transcription_test');
        } catch (e) {
            expect(true).toBeTruthy();
        }
        try {
            metadataManager.removeMetadata(null);
        } catch (e) {
            expect(true).toBeTruthy();
        }

    });
});


