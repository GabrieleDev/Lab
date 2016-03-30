
//Definizioni varibili di autenticazione
var utente;

//Definizione variabili evento
var startDate; // 
var endDate;
var title;
var eventLocation;
var notes;

//Plugin di ispezione info utente
var deviceInfo;

/**
 * Principale-----> Logica 
 */
var app = {
    // Costruzione applicazione
    initialize: function() {
    	
        this.bindEvents();
    },
  
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
   
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        
        
        //Chiude comunque l'applicazione e l'eventuale service in background
        document.getElementById("chiudi").addEventListener("click",Close, false);
        
        //Contenuto file di configurazione
        var testo;
        
        
        //Catturo informazioni sul dispositivo --> Account sincronizzato
       deviceInfo = cordova.require("cordova/plugin/DeviceInformation");
        deviceInfo.get(function(result) {
        	
            var t=JSON.parse(result);  
            
          
            
            //Account name di riferimento sincronizzato (Plugin DeviceInfo modificato)
            utente=t['accountFirstName'];
            
            
            //Letturafile config
            var cred=["test","prova"];
            var success = function(message) {  
            	
            	document.getElementById("cercaE").value="Aggiorna";
            	document.getElementById("psw").value=message;
            	document.getElementById("psw").style.display="none";
			    document.getElementById('suggerimento').innerHTML = "";
			    document.getElementById('nascosto').innerHTML = "Bentornato "+utente;


            };
         	  var failure = function() {  };
         	  
         	  hello.connectFile(cred,success,failure);
            
            	
                if(utente==null){
                navigator.notification.alert("Non ho trovato nessun account sincronizzato sul dispositivo\nL'applicazione non puo funzionare !",null,"Events navigator","Ho capito");

                }else{
                	
                	
                	//Controllo accesso ad internet
                    var networkState = navigator.network.connection.type;

                    //Possibili stati
                    var states = {};
                    states[Connection.UNKNOWN]  = 'Unknown connection';
                    states[Connection.ETHERNET] = 'Ethernet connection';
                    states[Connection.WIFI]     = 'WiFi connection';
                    states[Connection.CELL_2G]  = 'Cell 2G connection';
                    states[Connection.CELL_3G]  = 'Cell 3G connection';
                    states[Connection.CELL_4G]  = 'Cell 4G connection';
                    states[Connection.NONE]     = 'No network connection';

                    if(states[networkState]=='No network connection'){
                    	//Disabilitazione modifiche
       			        document.getElementById('suggerimento').innerHTML = "E' necessario che il dispositivo sia connesso ad Internet.";
                		document.getElementById("cercaE").disabled = true; 	
                		document.getElementById("psw").disabled = true; 
                		document.getElementById("cercaE").style.display="none";
                		document.getElementById("psw").style.display="none";
                		
                    }else {
                
                    //Gestione info utente 
    			     document.getElementById('nascosto').innerHTML = "E' richiesta la password dell'utente: "+utente;
    			     document.getElementById('suggerimento').innerHTML = "Password:";

            
                // Permesso background
                cordova.plugins.backgroundMode.setDefaults({ text:'Sono attivo in background'});
                // abilitazione background mode
                cordova.plugins.backgroundMode.enable();

             
               
            
                //Scatta l'evento al click del bottone "sincronizza" -si conclude il caricamento della procedura
                
                document.getElementById("cercaE").addEventListener("click", StartService, false);
			    document.getElementById('suggerimento').innerHTML = "Password:";

                    
                    }     
   
            }
                
        
         //Log di errore sull'eventlistener       
        }, function() {
            console.log("error");
        });




       
    },
    
    
    // Stato app -
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};


/*
 * Richiesta di avvio della procedura di autenticazione account
 */
function StartService(){
	
	 navigator.notification.confirm(
	           'Sei sicuro di voler attivare servizio di notifica?', 
	           CreaEvent, 
	           'Events Navigator', 
	           'SI,Annulla'  
	    );

}

/*
 * Chiude ed interrompe il servizio 
 */
function Close(){
	 navigator.notification.confirm(
	           'Sei sicuro di voler annullare la procedura?', 
	           onConfirmQuit, 
	           'Events Navigator', 
	           'SI,Annulla'  
	    );
}

/*
 * Se viene cliccato ok si chiude l'applicazione
 */
function onConfirmQuit(button){
	   if(button == "1"){
	     navigator.app.exitApp(); 
	   }
	}

 /*
  *Catturo il campo password dal documento index.html -->richiama modulo di accesso e lettura 
  */
function CreaEvent(button){
	
   
     
	
	if(button==1){
	
	document.getElementById('suggerimento').innerHTML = "Caricamento in corso...";
	//Bottone lampeggia al caricamento
    document.getElementById("sincro").className = "blink";
	
    //Richiesta password account inserita form
    var psw=document.getElementById("psw").value;

	
	if(psw!=""){
			
		
		
		
		
		setInterval(function() {
			//Richiamo accesso account mail dispositivo
			
			//Caricamento con splashscrren
			navigator.splashscreen.show();
			
			LeggiAccount(psw);
			//Ogni 15 secondi emette la richiesta al  imap di posta
			}, 15000);
		
	     

		
	
		navigator.splashscreen.hide();
		
		//Disabilitazione modifiche
		document.getElementById("cercaE").disabled = true; 	
		document.getElementById("psw").disabled = true; 
		  

	}else {
		//Gestore campo password vuoto
		document.getElementById('suggerimento').innerHTML = "Il campo password non puo' restare vuoto";
		 document.getElementById("sincro").className = "";
	}
	}	
	
	
}
	
/*
 * Funzione che crea l'evento sul dispositivo (IOS,Android)
 */
function Sincronizza(btn){
    if(btn==1){
    	

   	  var success = function(message) {  };
   	  var error = function(message) {  };
   	
   	  //Plugin 'Calendar'
   	  window.plugins.calendar.createEventInteractively(title,eventLocation,notes,startDate,endDate,success,error);

   	
   	
   	    }else {
   	    	
            //Non sincronizza 
   	    	
   	    }
}

/*
 * Funzione per la visualizzazione contatti (Non utilizzata)
 */
function onSuccess(contacts) {
    alert('Trovati:' + contacts.length + ' contacts.');
};



/*
 * Funzione di gestione errori (Contacts)
 */
function onError(contactError) {
    alert('non sono riuscito a trovare nulla');
};


/*
 * Accesso e Lettura account sincronizzato dispositivo
 * //param = password 
 */


function LeggiAccount(pass ){

	//Credenziali accesso raccolte
    var password=pass;
    var user=utente;

    
    var am = window.plugins.accountmanager;
    //Accesso account
    //Richiamo mio plugin di lettura
     var credenziali=[user,password];
	 var success = function(message) {
		 
		 navigator.splashscreen.hide();
		 //Gli errori sono identificati da una lettera maiuscola
		 
		 //Errore di autenticazione sul server = null
		if(message=="ErroreG"){
			
			document.getElementById('appname').innerHTML = "La password risulta errata";
			  window.plugins.toast.showWithOptions({
			        message: "La password risulta errata",
			        duration: "long",
			        position: "top",
			        styling: {
			          opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
			          backgroundColor: '#990000', // make sure you use #RRGGBB. Default #333333
			          textColor: '#FFFF00', // Ditto. Default #FFFFFF
			          cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
			          horizontalPadding: 20, // iOS default 16, Android default 50
			          verticalPadding: 16 // iOS default 12, Android default 30
			        }
			      });
			location.reload();
		
			
			
			//In realtà l'errore si riferisce al fatto che non abbia trovato ancora un evento
		}else if(message=="ErroreE"){
			
			 //creazione file config
	        var cred=[password,"prova"];
	        var success = function(message) {  
	        	
	            ///Rimandato al livello più basso 

	        };
	     	  var failure = function() { alert("Impossibile creare file di configurazione!"); };
	     	  
	     	  hello.connectFileW(cred,success,failure);
			
			//L'utente può attivare la modalità background
			 document.getElementById('suggerimento').innerHTML = "Servizio notifica  attivo...\n";
			 document.getElementById("cercaE").style.display="none";
			 document.getElementById('nascosto').style.display="none";
			 document.getElementById('psw').style.display="none";
			 
			 document.getElementById('infoAttivo').innerHTML = "Ora puoi ridurre l'applicazione.\n\nPremi annulla per  concludere  servizio ";
			 
		}else{
			
			
			//Valorizzo i campi evento e invio richiesta di sincronizzazione sul dispositivo
			//---- TEST : Data quella corrente
		    startDate = new Date(2016,2,15,18,30,0,0,0); // beware: month 0 = january, 11 = december
		    endDate = new Date(2016,2,15,19,30,0,0,0);
		    title = message.substring(0,20);
		    eventLocation =message.substring(75,85);
		    notes = message;
		    //------------------------------------
		    
		  //Toast di notifica dell'avvenuta ricezione dell'evento
		    window.plugins.toast.showWithOptions({
		        message: "Hai ricevuto un invito ad un evento ",
		        duration: "short",
		        position: "bottom",
		        styling: {
		          opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
		          backgroundColor: '#000099', // make sure you use #RRGGBB. Default #333333
		          textColor: '#FFFF00', // Ditto. Default #FFFFFF
		          cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
		          horizontalPadding: 20, // iOS default 16, Android default 50
		          verticalPadding: 16 // iOS default 12, Android default 30
		        }
		      });
	   
		  //richiesta sincronizzazione finale sul dispositivo
		    var conf=navigator.notification.confirm("Ho trovato un evento  \nProcedo con la sincronizzazione ?",Sincronizza,"Events Navigator","OK,Non procedere");
		  //---------------------------------------------
		    
		   
   }}
	 
	 

	 /*
	  * Plugin non caricato correttamente
	  */
   var failure = function() {

   }

   //Connessione : Plugin sviluppato : 'com.gab.reader'
   hello.connect(credenziali , success, failure);

}

/*
 * Inizalizzo e avvio app nativa di riferimento
 */
app.initialize();
