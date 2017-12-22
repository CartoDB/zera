const Interactive = require('../lib/index').Interactive;

describe('Zera', () => {
    let zera;
    let leafletMap;
    let container;

    describe('when the user clicks on the map', () => {
        beforeEach(() => {
            container = document.createElement('div');
            container.setAttribute('id', 'map');
            container.style.height = '200px';
            document.body.appendChild(container);
            leafletMap = L.map('map').setView([42, -0.08], 5);

            zera = new Interactive();
            zera.map(leafletMap);
            zera.tilejson({
                grids: ['https://example.com/{z}/{x}/{y}/grid.json']
            })
        });

        afterEach(() => {
            document.body.removeChild(container);
        })
        
        it('should return a featureOff (off) event when the user clicks outside a feature ', done => {
            // Spy on fetch
            window.fetch = () => Promise.resolve({status: 200, json: () => 'ok'});
            // Fire leaflet event
            leafletMap.fireEvent('click', { latlng: {wrap: () => { return {lat: 9, lng: 8} }}});

            zera.on('off', event => {
                expect(event).to.be.undefined;
                done();
            })
        });

        it('should return a featureOff (off) event when the user moves the mouse outside a feature ', done => {
            // Spy on fetch
            window.fetch = () => Promise.resolve({status: 200, json: () => 'ok'});
            // Fire leaflet event
            leafletMap.fireEvent('mousemove', { latlng: {wrap: () => { return {lat: 9, lng: 8} }}});

            zera.on('off', event => {
                expect(event).to.be.undefined;
                done();
            })
        });

        it('should return a featureOver (on) event when the user clicks inside a feature ', done => {
            const tile = {"grid":["                               !!                               ","                                !                               ","              ##  $$                         %%                 ","              ##  $$  &&                     %%                 ","                     '&&                  (((                   ","                )    ''                    (                    ","               )))   '                                          ","                                                               *","                     ++                 ,,,                    *","             --      ++                  ,                      ","              -                                              .. ","                                                             .. ","              //     00                                       . ","              //     00                                         ","                                                     11         ","                        22 33                        11         ","           44           22 33                                   ","           445     6                                            ","             55   666                                           ","             5                                               77 ","                                                             77 ","                   88                      99            ::     ","                   88               ;;     99            ::     ","                                    ;;    <<          =  :      ","                                          <<          ==  >>    ","                              ?                       =   >>    ","                             ??                                 ","               @        AA    ?            BB                   ","               @@  C    AA                 BB                   ","               @@ CC                                            ","                   C                   D         EEE            ","                                      DD          E             ","                            FF      GG D                        ","                            FF      GG                          ","                                                                ","                                HII                             ","                                HII                             ","                              JJ KK                             ","                              JJ                            LL  ","                                                            LL  ","                                               M                ","                            NN                MMM           OO  ","                            NNP                M            OO  ","                              PP                        QQ      ","                              P RR                      QQ      ","                                RR                  SSS         ","                                                     S          ","                                                                ","                          TT            UUU                     ","                         VTT       WW   UUU                     ","                        VVV     XX WW                           ","                                XX                              ","                    YY                                          ","                    YY                                          ","                                                                ","               ZZ                                               ","               ZZ   [[                                          ","                    [[                                          ","                                                            ]]  ","                                                            ]]  ","                                                                ","           ^^                                                   ","           ^^                                                   ","                                      __                ``      "],"keys":["","66","39","51","57","26","3","80","87","30","12","83","35","58","67","8","11","38","34","72","37","59","89","73","42","61","10","71","5","4","25","14","18","43","55","82","29","49","54","21","86","2","31","77","56","91","41","78","84","62","85","63","68","46","65","92","32","50","15","48","33","19","45"],"data":{"2":{"cartodb_id":5729,"name":"Tangier"},"3":{"cartodb_id":974,"name":"Covilha"},"4":{"cartodb_id":2363,"name":"Cartagena"},"5":{"cartodb_id":2362,"name":"Lorca"},"8":{"cartodb_id":174,"name":"Portalegre"},"10":{"cartodb_id":6319,"name":"Cordoba"},"11":{"cartodb_id":2118,"name":"Albacete"},"12":{"cartodb_id":177,"name":"Castelo Branco"},"14":{"cartodb_id":2622,"name":"Portimao"},"15":{"cartodb_id":2797,"name":"Settat"},"18":{"cartodb_id":2117,"name":"Huelva"},"19":{"cartodb_id":2798,"name":"Er Rachidia"},"21":{"cartodb_id":797,"name":"Algeciras"},"25":{"cartodb_id":6862,"name":"Seville"},"26":{"cartodb_id":178,"name":"Guarda"},"29":{"cartodb_id":2114,"name":"Almeria"},"30":{"cartodb_id":2536,"name":"Castello"},"31":{"cartodb_id":4959,"name":"Ceuta"},"32":{"cartodb_id":7273,"name":"Casablanca"},"33":{"cartodb_id":6372,"name":"Safi"},"34":{"cartodb_id":171,"name":"Merida"},"35":{"cartodb_id":169,"name":"Leiria"},"37":{"cartodb_id":4990,"name":"Setubal"},"38":{"cartodb_id":2366,"name":"Badajoz"},"39":{"cartodb_id":168,"name":"Aveiro"},"41":{"cartodb_id":4569,"name":"Sidi bel Abbes"},"42":{"cartodb_id":796,"name":"Linares"},"43":{"cartodb_id":4933,"name":"Granada"},"45":{"cartodb_id":4571,"name":"Beni Ounif"},"46":{"cartodb_id":6894,"name":"Rabat"},"48":{"cartodb_id":4573,"name":"Sefra"},"49":{"cartodb_id":4932,"name":"Cadiz"},"50":{"cartodb_id":2801,"name":"El Jadida"},"51":{"cartodb_id":179,"name":"Viseu"},"54":{"cartodb_id":795,"name":"Marbella"},"55":{"cartodb_id":2623,"name":"Faro"},"56":{"cartodb_id":5676,"name":"Melilla"},"57":{"cartodb_id":2120,"name":"Guadalajara"},"58":{"cartodb_id":6949,"name":"Valencia"},"59":{"cartodb_id":173,"name":"Evora"},"61":{"cartodb_id":4958,"name":"Murcia"},"62":{"cartodb_id":2795,"name":"Ouezzane"},"63":{"cartodb_id":2796,"name":"Kenitra"},"65":{"cartodb_id":6893,"name":"Fez"},"66":{"cartodb_id":2122,"name":"Salamanca"},"67":{"cartodb_id":175,"name":"Santarem"},"68":{"cartodb_id":2794,"name":"Taza"},"71":{"cartodb_id":2116,"name":"Jaén"},"72":{"cartodb_id":7163,"name":"Lisbon"},"73":{"cartodb_id":172,"name":"Beja"},"77":{"cartodb_id":7103,"name":"Oran"},"78":{"cartodb_id":2792,"name":"Ksar El Kebir"},"80":{"cartodb_id":7265,"name":"Madrid"},"82":{"cartodb_id":2115,"name":"Malaga"},"83":{"cartodb_id":2119,"name":"Toledo"},"84":{"cartodb_id":4570,"name":"Tlimcen"},"85":{"cartodb_id":6371,"name":"Oujda"},"86":{"cartodb_id":4934,"name":"Gibraltar"},"87":{"cartodb_id":2624,"name":"Coimbra"},"89":{"cartodb_id":2535,"name":"Alicante"},"91":{"cartodb_id":2793,"name":"Larache"},"92":{"cartodb_id":2799,"name":"Meknes"}}};
            // Spy on fetch
            window.fetch = () => Promise.resolve({status: 200, json: () => tile});
            // Fire leaflet event
            leafletMap.fireEvent('click', { latlng: {wrap: () => { return {lat: 40.38002840251183, lng: -3.5595703125} }}});

            zera.on('on', event => {
                expect(event.type).equal('click');
                expect(event.data.name).equal('Madrid');
                done();
            })
        });

        it('should return a featureOver (on) event when the user moves the mouse inside a feature ', done => {
            const tile = {"grid":["                               !!                               ","                                !                               ","              ##  $$                         %%                 ","              ##  $$  &&                     %%                 ","                     '&&                  (((                   ","                )    ''                    (                    ","               )))   '                                          ","                                                               *","                     ++                 ,,,                    *","             --      ++                  ,                      ","              -                                              .. ","                                                             .. ","              //     00                                       . ","              //     00                                         ","                                                     11         ","                        22 33                        11         ","           44           22 33                                   ","           445     6                                            ","             55   666                                           ","             5                                               77 ","                                                             77 ","                   88                      99            ::     ","                   88               ;;     99            ::     ","                                    ;;    <<          =  :      ","                                          <<          ==  >>    ","                              ?                       =   >>    ","                             ??                                 ","               @        AA    ?            BB                   ","               @@  C    AA                 BB                   ","               @@ CC                                            ","                   C                   D         EEE            ","                                      DD          E             ","                            FF      GG D                        ","                            FF      GG                          ","                                                                ","                                HII                             ","                                HII                             ","                              JJ KK                             ","                              JJ                            LL  ","                                                            LL  ","                                               M                ","                            NN                MMM           OO  ","                            NNP                M            OO  ","                              PP                        QQ      ","                              P RR                      QQ      ","                                RR                  SSS         ","                                                     S          ","                                                                ","                          TT            UUU                     ","                         VTT       WW   UUU                     ","                        VVV     XX WW                           ","                                XX                              ","                    YY                                          ","                    YY                                          ","                                                                ","               ZZ                                               ","               ZZ   [[                                          ","                    [[                                          ","                                                            ]]  ","                                                            ]]  ","                                                                ","           ^^                                                   ","           ^^                                                   ","                                      __                ``      "],"keys":["","66","39","51","57","26","3","80","87","30","12","83","35","58","67","8","11","38","34","72","37","59","89","73","42","61","10","71","5","4","25","14","18","43","55","82","29","49","54","21","86","2","31","77","56","91","41","78","84","62","85","63","68","46","65","92","32","50","15","48","33","19","45"],"data":{"2":{"cartodb_id":5729,"name":"Tangier"},"3":{"cartodb_id":974,"name":"Covilha"},"4":{"cartodb_id":2363,"name":"Cartagena"},"5":{"cartodb_id":2362,"name":"Lorca"},"8":{"cartodb_id":174,"name":"Portalegre"},"10":{"cartodb_id":6319,"name":"Cordoba"},"11":{"cartodb_id":2118,"name":"Albacete"},"12":{"cartodb_id":177,"name":"Castelo Branco"},"14":{"cartodb_id":2622,"name":"Portimao"},"15":{"cartodb_id":2797,"name":"Settat"},"18":{"cartodb_id":2117,"name":"Huelva"},"19":{"cartodb_id":2798,"name":"Er Rachidia"},"21":{"cartodb_id":797,"name":"Algeciras"},"25":{"cartodb_id":6862,"name":"Seville"},"26":{"cartodb_id":178,"name":"Guarda"},"29":{"cartodb_id":2114,"name":"Almeria"},"30":{"cartodb_id":2536,"name":"Castello"},"31":{"cartodb_id":4959,"name":"Ceuta"},"32":{"cartodb_id":7273,"name":"Casablanca"},"33":{"cartodb_id":6372,"name":"Safi"},"34":{"cartodb_id":171,"name":"Merida"},"35":{"cartodb_id":169,"name":"Leiria"},"37":{"cartodb_id":4990,"name":"Setubal"},"38":{"cartodb_id":2366,"name":"Badajoz"},"39":{"cartodb_id":168,"name":"Aveiro"},"41":{"cartodb_id":4569,"name":"Sidi bel Abbes"},"42":{"cartodb_id":796,"name":"Linares"},"43":{"cartodb_id":4933,"name":"Granada"},"45":{"cartodb_id":4571,"name":"Beni Ounif"},"46":{"cartodb_id":6894,"name":"Rabat"},"48":{"cartodb_id":4573,"name":"Sefra"},"49":{"cartodb_id":4932,"name":"Cadiz"},"50":{"cartodb_id":2801,"name":"El Jadida"},"51":{"cartodb_id":179,"name":"Viseu"},"54":{"cartodb_id":795,"name":"Marbella"},"55":{"cartodb_id":2623,"name":"Faro"},"56":{"cartodb_id":5676,"name":"Melilla"},"57":{"cartodb_id":2120,"name":"Guadalajara"},"58":{"cartodb_id":6949,"name":"Valencia"},"59":{"cartodb_id":173,"name":"Evora"},"61":{"cartodb_id":4958,"name":"Murcia"},"62":{"cartodb_id":2795,"name":"Ouezzane"},"63":{"cartodb_id":2796,"name":"Kenitra"},"65":{"cartodb_id":6893,"name":"Fez"},"66":{"cartodb_id":2122,"name":"Salamanca"},"67":{"cartodb_id":175,"name":"Santarem"},"68":{"cartodb_id":2794,"name":"Taza"},"71":{"cartodb_id":2116,"name":"Jaén"},"72":{"cartodb_id":7163,"name":"Lisbon"},"73":{"cartodb_id":172,"name":"Beja"},"77":{"cartodb_id":7103,"name":"Oran"},"78":{"cartodb_id":2792,"name":"Ksar El Kebir"},"80":{"cartodb_id":7265,"name":"Madrid"},"82":{"cartodb_id":2115,"name":"Malaga"},"83":{"cartodb_id":2119,"name":"Toledo"},"84":{"cartodb_id":4570,"name":"Tlimcen"},"85":{"cartodb_id":6371,"name":"Oujda"},"86":{"cartodb_id":4934,"name":"Gibraltar"},"87":{"cartodb_id":2624,"name":"Coimbra"},"89":{"cartodb_id":2535,"name":"Alicante"},"91":{"cartodb_id":2793,"name":"Larache"},"92":{"cartodb_id":2799,"name":"Meknes"}}};
            // Spy on fetch
            window.fetch = () => Promise.resolve({status: 200, json: () => tile});
            // Fire leaflet event
            leafletMap.fireEvent('mousemove', { latlng: {wrap: () => { return {lat: 40.38002840251183, lng: -3.5595703125} }}});

            zera.on('on', event => {
                expect(event.type).equal('mousemove');
                expect(event.data.name).equal('Madrid');
                done();
            })
        });

        it('should return a featureError (error) event when the user clicks and loadTile returns an error ', done => {
            // Spy on fetch
            window.fetch = () => Promise.reject('unexpected_error');
            // Fire leaflet event
            leafletMap.fireEvent('click', { latlng: {wrap: () => { return {lat: 40.38002840251183, lng: -3.5595703125} }}});

            zera.on('error', error => {
                expect(error).equal('unexpected_error');
                done();
            })
        });

        it('should return a featureError (error) event when the user moves the mouse and loadTile returns an error ', done => {
            // Spy on fetch
            window.fetch = () => Promise.reject('unexpected_error');
            // Fire leaflet event
            leafletMap.fireEvent('mousemove', { latlng: {wrap: () => { return {lat: 40.38002840251183, lng: -3.5595703125} }}});

            zera.on('error', error => {
                expect(error).equal('unexpected_error');
                done();
            })
        });

        it('should return a featureError (error) event when the user clicks and loadTile returns a limit error ', done => {
            // Spy on fetch
            window.fetch = () => Promise.resolve({status: 429, json: () => Promise.resolve('fake_limit_error')});
            // Fire leaflet event
            leafletMap.fireEvent('click', { latlng: {wrap: () => { return {lat: 40.38002840251183, lng: -3.5595703125} }}});

            zera.on('error', error => {
                expect(error).equal('fake_limit_error');
                done();
            })
        });

        it('should return a featureError (error) event when the user moves the mouse and loadTile returns a limit error ', done => {
            // Spy on fetch
            window.fetch = () => Promise.resolve({status: 429, json: () => Promise.resolve('fake_limit_error')});
            // Fire leaflet event
            leafletMap.fireEvent('mousemove', { latlng: {wrap: () => { return {lat: 40.38002840251183, lng: -3.5595703125} }}});

            zera.on('error', error => {
                expect(error).equal('fake_limit_error');
                done();
            })
        });
    });
});



