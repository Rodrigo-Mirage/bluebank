function AppViewModel() {

	var model=this; 
    model.loaded = ko.observable(true);
	model.janela = ko.observable("login");
	model.id = ko.observable("");
	model.ag = ko.observable("");
	model.acc = ko.observable("");
	model.cpf = ko.observable("");

	model.tag = ko.observable("");
	model.tid = ko.observable("");
	model.tacc = ko.observable("");
	model.tcpf = ko.observable("");
	model.tvalor = ko.observable("");
	model.tnome = ko.observable("");
	model.logerr = ko.observable(false);


	model.mess = ko.observable("");

	model.total = ko.observable(0);
	model.hist =ko.observableArray();


	model.logar = function(){
			model.logerr(false);
			var data = {
				"ag":this.ag(),
				"acc":this.acc(),
				"cpf":this.cpf()
			};
			post("../getacc", ko.toJSON(data), function(res) {
					if(!res.mess){
						model.janela("inicio");
						model.id(res.id);

						model.load();

					}else{
						model.logerr(true);
					}
			});
	}

	model.load = function(){
		if(model.hist().length>0){
			model.total(0);
			model.hist.removeAll();
		}
		var data = {
			"id":model.id()
		};
		post("../sumary",ko.toJSON(data), function(res) {
			for(var i=0;i < res.length;i++){
				if(res[i].send == model.id()){
					model.total(model.total()-res[i].valor)
					model.hist.push({'tipo':"Enviado",'valor':-res[i].valor});
			
				}
				if(res[i].rec == model.id()){
					model.total(model.total()+res[i].valor);
					model.hist.push({'tipo':"Recebido",'valor':res[i].valor});
			
				}
			}
		});
	};

	model.saldo = function(){
		model.janela("saldo");
	};
	model.transferencia = function(){
		model.janela("transferir");
	};

	model.voltar = function(){
		model.janela("inicio");

		model.tag("");
		model.tacc("");
		model.tcpf("");
		model.tvalor("");
		model.tnome("");
		model.tid("");
		model.mess("");
	};

	model.confirmar = function(){
		if(model.tid()==""){
			var data = {
				"ag":this.tag(),
				"acc":this.tacc(),
				"cpf":this.tcpf()
			};

			post("../getacc", ko.toJSON(data), function(res) {
					if(!res.mess){
						if(model.total()<model.tvalor()){
							model.mess("Seu Saldo não é suficiente para a transação.");
							model.janela("final");

						}else{
							model.tnome(res.nome);
							model.tid(res.id);
							model.janela("confirmação");
						}
					}else{
							model.mess("A Conta de Destino não existe");
							model.janela("final");

					}
			});
		}
		else{
			var data = {
				"send":model.id(),
				"rec":model.tid(),
				"valor":model.tvalor()
			};
			post("../confirm",ko.toJSON(data), function(res) {
				model.janela("final");
				model.mess(res.mess);
				model.load();
			});

		}
	};

	model.logout = function(){
		window.location.reload(false); 
	};

}

	post = function(url, data, callback, callbackFalha, async) {
		if (typeof async == 'undefined')
			async=true;
		$.ajax({
			url:url,
			type:"POST",
			data:data,
			async:async,
			contentType:"application/json; charset=utf-8",
			success: function(data) {
				
				if (callback){
					callback(data);
				}
			},
			error: function(data) {
				if (callbackFalha){
					callbackFalha(data);
				}
			}
		});
	};

	get = function(url, data, callback, callbackFalha, async) {
		if (typeof async == 'undefined')
			async=true;
		$.ajax({
			url:url,
			type:"GET",
			data:data,
			async:async,
			contentType:"application/json; charset=utf-8",
			success: function(data) {
				if (data && data.length)
					data=eval("("+data+")");
				if (callback)
					callback(data);
			},
			error: function(data) {
				if (callbackFalha)
					callbackFalha(data);
			}
		});
	};


	get('/getall','',function(data){});


ko.applyBindings(new AppViewModel());