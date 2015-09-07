var SCCore = function(a, b, c, d, e) {

	if (e)
        console.log('1');

	var i = setInterval(function() {
          "complete" === b.readyState && k.init("undefined" != typeof hunter_code ? hunter_code : null)
    }, 10);

	
	

	//БАЗОВЫЕ ОПЦИИ
	var j = {
            static_domain: "smartcall.kz",            
            socketIOEndpoint: "https://smartcall.kz",
            versions: {
                v1: {
                    stylesheets: ["/widgets/v1/widget.min.css"],
                    scripts: ["/widgets/v1/widget.min.js"]
                }              
            },
            use_storage: 1,
            storage_cache_lifetime: 60
        },
		k = {         
            hunter_code: null,
            head: "undefined" != typeof b.head ? b.head : b.getElementsByTagName("head")[0],           
            currentScript: d,
            opt: j,
            version: null,
            db_params: null,
            cache: {
                css: [],
                js: []
            },
			init: function(a) {				
				var b = this.currentScript.src;	// Url скрипта		
				if ("undefined" != typeof b) {
                    clearInterval(i);
					var c = this.helpers.parseUri(b).query;								
					var d = "undefined" != typeof c.v ? c.v : null;	 // ВЕРСИЯ	- в нашем случае всегда null				
					this.hunter_code = "undefined" != typeof c.hunter_code && c.hunter_code,
					this.getParams(d);	// получение кода

				
                }
				
			},			
			getParams: function(a) {				
				//БЕРЕМ ИЗ storage  время и db_params из storage SESSIONS
				if (this.opt.use_storage && k.storage.test()) {
					k.user.setReferer();
					var b = k.storage.get("db_params_update_time", "session");					
					b && (new Date).getTime() - b <= 1e3 * this.opt.storage_cache_lifetime && (this.db_params = k.storage.get("db_params", "session") || null)	
				}				
				null === this.db_params ? this.server.get(function() {
                    k.preConfig(a)
                }) : this.preConfig(a)	
			},
			preConfig: function(a) {				
				var b = k;
				
				//ОБРАБОТКА РЕЗУЛЬТАТА И ИНИЦИАЛИЗАЦИЯ СТАРТА
			   "undefined" != typeof db_params && null === b.db_params && (b.db_params = db_params), 
				"undefined" != typeof b.db_params && (b.version = b.db_params.version,  // ВЕРСИЯ								
				b.db_params.client_name && (b.user.name = b.db_params.client_name), 
				b.db_params.client_phone && (b.user.client_phone = b.db_params.client_phone)) 
				b.lang.init(b.initWidget) // сначало инициализация языка - затем initWidget

				
            },
			initWidget: function() {
				var a = k; 
                if ("undefined" == typeof a.db_params) return console.warn("error invalid code or database error");
                var b = a.opt.versions["v" + a.version];
                if ("undefined" == typeof b) return console.warn("this version does not exist");
                for (var c = 0; c < b.stylesheets.length; c++) {
                    var d = "//" + a.opt.static_domain + b.stylesheets[c];
                    a.isLoaded("css", d) || a.loadFile("css", d, !1)
                }
				var d = "//" + a.opt.static_domain + b.scripts[0];
                a.isLoaded("js", d) || a.loadFile("js", d, !1, a.startWidget), a.opt.use_storage && a.storage.test() && !a.helpers.isEmpty(a.db_params) ? (a.storage.save("db_params_update_time", (new Date).getTime(), "session"), a.storage.save("db_params", a.db_params, "session")) : console.warn("не удалось загрузить db_params")

            },
			startWidget: function() {
				//СТАРТ ВИДЖЕТА
				console.log('Инициализация виджета завершена успешно');
                SCObject.init()
            },
			loadFile: function(a, c, d, e) {
				
				var f; 
				"js" === a ? (f = b.createElement("script"), f.type = "text/javascript", f.src = c, f.async = !0, f.charset = "UTF-8", 
				(f.readyState ? f.onreadystatechange = function() {
                    ("loaded" === f.readyState || "complete" === f.readyState) && (f.onreadystatechange = null, e())
                } : f.onload = function() {
                    e()
                })) : (f = b.createElement("link"), f.type = "text/css", f.href = c, f.rel = "stylesheet"),				
				this.head.appendChild(f)	
		   },
            isLoaded: function(a, c) {
                for (var d = b.getElementsByTagName("js" === a ? "script" : "link"), e = 0; e < d.length; e++)
                    if (this.helpers.parseUri(c).path == this.helpers.parseUri(d[e].src).path) return !0;
                return !1
            }
		};

//STORAGE
k.storage = function(a) {			
	return {
		db_prefix: "db_smc",
		storage: {
			local: a.localStorage,
			session: a.sessionStorage
		},
		test: function() { // проверка можно ли пользовать storage			
			try {
				return a.JSON && a.JSON.parse && a.JSON.stringify && a.sessionStorage
			} catch (b) {
				return console.warn(b), !1
			}
		},
		get: function(a, b) {					
			if (!this.test()) return !1;
			var b = "session" === b ? "session" : "local";
			//берем из массива b['local || ..'][this.db_prefix + . + a]  !!!Массив указывает куда записывать - смотри малость выше
			try {							
				return JSON.parse(this.storage[b][this.db_prefix + "." + a])
			} catch (c) {
				return !1
			}
		},
		save: function(b, c, d) {
			if (!this.test()) return !1;
			var d = "session" === d ? "session" : "local";
			try {
				this.storage[d][this.db_prefix + "." + b] = a.JSON.stringify(c)
			} catch (e) {
				return !1
			}
		},
		"delete": function(a, b) {
			if (!this.test()) return !1;
			var b = "session" === b ? "session" : "local";
			try {
				this.storage[b][this.db_prefix + "." + a] = void 0
			} catch (c) {
				return !1
			}
		}
	}
}(a);
		
		
k.cookies = function() {
	function a(a) {
		var b, c, d, e = "",
			f = 0;
		for (b = a.split(/(%(?:D0|D1)%.{2})/), c = b.length; c > f; f++) {
			try {
				d = decodeURIComponent(b[f])
			} catch (g) {
				d = b[f]
			}
			e += d
		}
		return e
	}
	var c = function() {
			var c = b.cookie.split(";"),
				d = {};
			return c.forEach(function(b) {
				if (b = b.split("="), 2 === b.length) {
					var c = decodeURIComponent(b[0].trim()),
						e = a(b[1].trim());
					try {
						e = JSON.parse(e)
					} catch (f) {}
					d[c] = e
				}
			}), d
		},
		d = function(a) {
			var b = new Date;
			return b.setDate(b.getDate() + a), b.toUTCString()
		},
		e = {
			expires: d(365),
			path: "/"
		};
	return {
		get: function(a) {
			return c()[a]
		},
		set: function(a, c, f) {
			a = encodeURIComponent(a), c = encodeURIComponent(JSON.stringify(c)), f = f || {}, void 0 != f.expires ? "number" == typeof f.expires ? f.expires = d(f.expires) : f.expires instanceof Date && (f.expires = f.expires.toUTCString()) : f.expires = e.expires, f.path = e.path;
			var g = [a + "=" + c];
			for (var h in f) {
				var i = h,
					j = f[h];
				j !== !0 && (i += "=" + j), g.push(i)
			}
			b.cookie = g.join(";")
		},
		"delete": function(a) {
			this.set(a, "", {
				expires: -1
			})
		}
	}
}();
k.helpers = {
	parseUri: function(a) {
		var b = document.createElement("a");
		return b.href = a, {
			protocol: b.protocol,
			hostname: b.hostname,
			port: b.port,
			path: b.hostname + b.pathname,
			pathname: b.pathname,
			search: b.search,
			query: this.parseQueryString(b.search.replace(/^\?/, "")),
			hash: b.hash,
			host: b.host
		}
	},	
	parseQueryString: function(a) {
		var b = {};
		return a.split("&").forEach(function(a) {
			var c = a.split("=");
			0 !== c[0].length && c[1] && (b[c[0]] = c[1])
		}), b
	},
	makeQueryString: function(a) {
		var b = [];
		for (var c in a)
			b.push(encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));			
		return b.join("&")
	},			
	rand: function(a, b) {
		return b = b ? b : "", a ? this.rand(--a, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(60 * Math.random())) + b) : b
	},
	isNumber: function(a) {
		return !isNaN(parseFloat(a)) && isFinite(a)
	},
	isArray: function(a) {
		return !this.isNull(a) && "[object Array]" === Object.prototype.toString.call(a)
	},
	isObject: function(a) {
		return !this.isEmpty(a) && "object" == typeof a
	},
	isBoolean: function(a) {
		return "boolean" == typeof a
	},
	isString: function(a) {
		return "string" == typeof a
	},
	isNull: function(a) {
		return void 0 === a || null === a
	},
	isEmpty: function(a) {
		return this.isNull(a) || "undefined" != typeof a.length && 0 == a.length
	}
},k.user = function(a) {
	return {
		name: a.cookies.get("hunter_client_name") || null,
		email: a.cookies.get("hunter_client_email") || null,
		client_phone: a.cookies.get("hunter_client_phone") || null,
		gameResults: {},
		domain: c.hostname.replace("www.", ""),
		url: c.href,
		referrer: a.storage.get("ref", "local") || b.referrer || "",
		entrance_page: a.storage.get("entrance_page", "local") || c.href || "",
		is_outer_ref: null,
		session_id: function() {
			return a.cookies.get("hunter_sid") || a.cookies.set("hunter_sid", a.helpers.rand(16)), a.cookies.get("hunter_sid")
		}(),
		setReferer: function() {
			var c = /^(http(s)?:\/\/)?(www\.)?/;
			this.is_outer_ref = 0 !== this.referrer.replace(c, "").indexOf(this.domain), 
			this.referrer = b.referrer, this.entrance_page = this.url;
			this.is_outer_ref && a.storage.save("ref", this.referrer, "local"), 			
			a.storage.save("entrance_page", this.entrance_page, "local")			
		}
	}
}(k);
k.server = {//Загружается параметры если не сохранены
	get: function(a) {
		var b = {};		
		k.hunter_code ? b.hcode = k.hunter_code : b.domain = k.user.domain, b.session_id = k.user.session_id, b.url = k.user.url, b.param = 1, k.user.referrer && (b.referer = k.user.referrer);
		var d = ("https:" === c.protocol ? "https:" : "http:") + "//" + k.opt.static_domain + "/_smartcall?" + k.helpers.makeQueryString(b);		
		k.loadFile("js", d, !1, a)
	},
	send: function(a, b) {
		var c = {};
		k.hunter_code ? c.hcode = k.hunter_code : c.domain = k.user.domain, c.sid = k.user.session_id, c.url = k.user.url, c.version = k.version, k.user.referrer && (c.referer = k.user.referrer), k.user.entrance_page && (c.entrance_page = k.user.entrance_page);
		var d = [k.helpers.makeQueryString(c)];
		a && d.push(k.helpers.makeQueryString(a)), b && d.push(b), (new Image).src = "//" + k.opt.endpoint + "/hunter/?" + d.join("&")
	}
};


k.lang = {
	avail_lang: [],
	langCode: null,
	defLangCode: "en",
	languages: {},
	locales: {
		ru: "ru",		
		en: "en",
	},
	init: function(a) {
	
		this.langCode = this.detectLanguage(k.db_params.language),
		"undefined" == typeof this.langCode && (this.langCode = this.defLangCode);
		this.loadLang(this.langCode, a);
		
	},		
	detectLanguage: function(a) {
		if ("auto" === a) {
			var b = this.getLocale();			
			if (!b) return;
			return this.locales[b.toLowerCase()]
		}
		return a
	},
	getLocale: function() {
		var b; //НАстроики браезура
		return a.navigator && (b = a.navigator.userLanguage || a.navigator.language), b
	},
	loadLang: function(a, b) {		
		var c = "//" + k.opt.static_domain + "/widgets/v" + k.version;
		return c += "/js/i18n/" + a + ".min.js", k.isLoaded("js", c) ? b() : void k.loadFile("js", c, !0, b)
	},
	//ПРОВЕРИТЬ
	addLang: function(a) {
		//ДОДЕЛАТЬ
		console.log('Добавление языка'); 		
		for (code in a) 
			"undefined" != typeof code && 
			"undefined" != typeof a[code] && 
			"object" == typeof a[code] && 
				(this.languages[this.langCode] = a[code], console.log('Операция с языком'))

		
	},
	 addLangRow: function(a, b, c) {
            //var d = c || this.langCode;
            //this.languages[d] && this.babelfish.addPhrase(d, "cbh." + a, b)
        },
        addAvailLang: function(a) {
          // for (code in a) "undefined" == typeof this.avail_lang[a[code]] && this.avail_lang.push(a[code])
        }	
};

	return k;
}(window, window.document, window.location, function() {
    return window.document.currentScript || function() {
        var a = window.document.getElementsByTagName("script");
        return a[a.length - 1]
    }()
}(), "undefined" != typeof SCCore || "undefined" != typeof SCObject);

