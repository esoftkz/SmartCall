var SCObject = function(win, doc, loc, na) {
	
    function cancelEvent(a) {
        return a = a ? a : win.event, a.stopPropagation && a.stopPropagation(), a.preventDefault && a.preventDefault(), a.cancelBubble = !0, a.cancel = !0, a.returnValue = !1, !1
    }

    function Position(a, b) {
        this.X = a, this.Y = b, this.Add = function(a) {
            var b = new Position(this.X, this.Y);
            return null != a && (isNaN(a.X) || (b.X += a.X), isNaN(a.Y) || (b.Y += a.Y)), b
        }, this.Subtract = function(a) {
            var b = new Position(this.X, this.Y);
            return null != a && (isNaN(a.X) || (b.X -= a.X), isNaN(a.Y) || (b.Y -= a.Y)), b
        }, this.Min = function(a) {
            var b = new Position(this.X, this.Y);
            return null == a ? b : (!isNaN(a.X) && this.X > a.X && (b.X = a.X), !isNaN(a.Y) && this.Y > a.Y && (b.Y = a.Y), b)
        }, this.Max = function(a) {
            var b = new Position(this.X, this.Y);
            return null == a ? b : (!isNaN(a.X) && this.X < a.X && (b.X = a.X), !isNaN(a.Y) && this.Y < a.Y && (b.Y = a.Y), b)
        }, this.Bound = function(a, b) {
            var c = this.Max(a);
            return c.Min(b)
        }, this.Check = function() {
            var a = new Position(this.X, this.Y);
            return isNaN(a.X) && (a.X = 0), isNaN(a.Y) && (a.Y = 0), a
        }, this.Apply = function(a) {
            "string" == typeof a && (a = doc.getElementById(a)), null != a && (isNaN(this.X) || (a.style.left = this.X + "px"), isNaN(this.Y) || (a.style.top = this.Y + "px"))
        }
    }

    function absoluteCursorPostion(a) {
        return a = a ? a : win.event, isNaN(win.scrollX) ? new Position(a.clientX + doc.documentElement.scrollLeft + doc.body.scrollLeft, a.clientY + doc.documentElement.scrollTop + doc.body.scrollTop) : new Position(a.clientX + win.scrollX, a.clientY + win.scrollY)
    }

    function dragObject(a, b, c, d, e, f, g, h) {
        function i(b) {
            return q || !r || s ? void 0 : (q = !0, null != e && e(b, a), o = absoluteCursorPostion(b), p = new Position(parseInt(a.style.left), parseInt(a.style.top)), p = p.Check(), doc.addEventListener("mousemove", j, !1), doc.addEventListener("mouseup", l, !1), cancelEvent(b))
        }

        function j(b) {
            if (q && !s) {
                var e = absoluteCursorPostion(b);
                return e = e.Add(p).Subtract(o), e = e.Bound(c, d), e.Apply(a), null != f && f(e, a), k(e), cancelEvent(b)
            }
        }

        function k(a) {
            var b = $("#cbh_phone");
            b.removeClass("cbh-icon-sideways-right"), b.removeClass("cbh-icon-sideways-left"), 100 * a.X / view_w < 10 ? b.addClass("cbh-icon-sideways-left") : 100 * a.X / view_w > 80 && b.addClass("cbh-icon-sideways-right")
        }

        function l(a) {
            return m(a), cancelEvent(a)
        }

        function m(b) {
            var c = absoluteCursorPostion(b),
                d = Math.abs(o.X - c.X),
                e = Math.abs(o.Y - c.Y);
            q && !s && (doc.removeEventListener("mousemove", j, !1), doc.removeEventListener("mouseup", l, !1), o = null, p = null, null != g && g(a), q = !1, 30 > d && 30 > e && (sendGaEvent("send", "event", "Callbackhunter_PHONEICON", "clicked"), sendYaMetrikaEvent("Callbackhunter_PHONEICON"), icon_clicked = !0, widget_show_reason = 1, micromenuOpen = !1, dialogs.callNow()))
        }
        if ("string" == typeof a && (a = doc.getElementById(a)), null != a) {
            if (null != c && null != d) {
                var n = c.Min(d);
                d = c.Max(d), c = n
            }
            var o = null,
                p = null,
                q = !1,
                r = !1,
                s = !1;
            this.checkSide = function(a) {
                return k(a)
            }, this.ChangeBounds = function(a, b) {
                null != a && null != b && (c = a.Min(b), d = a.Max(b))
            }, this.Dispose = function() {
                s || (this.StopListening(!0), a = null, b = null, c = null, d = null, e = null, f = null, g = null, s = !0)
            }, this.StartListening = function() {
                r || s || (r = !0, b.addEventListener("mousedown", i, !1))
            }, this.StopListening = function(a) {
                r && !s && (b.removeEventListener("mousedown", i, !1), r = !1, a && q && m())
            }, this.IsDragging = function() {
                return q
            }, this.IsListening = function() {
                return r
            }, this.IsDisposed = function() {
                return s
            }, "string" == typeof b && (b = doc.getElementById(b)), null == b && (b = a), h || this.StartListening()
        }
    }

    function stackBlurImage(a, b, c, d) {
        var e = doc.getElementById(a),
            f = e.naturalWidth,
            g = e.naturalHeight,
            h = doc.getElementById(b);
        h.style.width = f + "px", h.style.height = g + "px", h.width = f, h.height = g;
        var i = h.getContext("2d");
        i.clearRect(0, 0, f, g), i.drawImage(e, 0, 0), isNaN(c) || 1 > c || (d ? stackBlurCanvasRGBA(b, 0, 0, f, g, c) : stackBlurCanvasRGB(b, 0, 0, f, g, c))
    }

    function stackBlurCanvasRGBA(a, b, c, d, e, f) {
        if (!(isNaN(f) || 1 > f)) {
            f |= 0;
            var g, h = doc.getElementById(a),
                i = h.getContext("2d");
            try {
                try {
                    g = i.getImageData(b, c, d, e)
                } catch (j) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"), g = i.getImageData(b, c, d, e)
                    } catch (j) {
                        throw alert("Cannot access local image"), new Error("unable to access local image data: " + j)
                    }
                }
            } catch (j) {
                throw alert("Cannot access image"), new Error("unable to access image data: " + j)
            }
            var k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E, F, G, H, I = g.data,
                J = f + f + 1,
                K = d - 1,
                L = e - 1,
                M = f + 1,
                N = M * (M + 1) / 2,
                O = new BlurStack,
                P = O;
            for (m = 1; J > m; m++)
                if (P = P.next = new BlurStack, m == M) var Q = P;
            P.next = O;
            var R = null,
                S = null;
            q = p = 0;
            var T = mul_table[f],
                U = shg_table[f];
            for (l = 0; e > l; l++) {
                for (z = A = B = C = r = s = t = u = 0, v = M * (D = I[p]), w = M * (E = I[p + 1]), x = M * (F = I[p + 2]), y = M * (G = I[p + 3]), r += N * D, s += N * E, t += N * F, u += N * G, P = O, m = 0; M > m; m++) P.r = D, P.g = E, P.b = F, P.a = G, P = P.next;
                for (m = 1; M > m; m++) n = p + ((m > K ? K : m) << 2), r += (P.r = D = I[n]) * (H = M - m), s += (P.g = E = I[n + 1]) * H, t += (P.b = F = I[n + 2]) * H, u += (P.a = G = I[n + 3]) * H, z += D, A += E, B += F, C += G, P = P.next;
                for (R = O, S = Q, k = 0; d > k; k++) I[p + 3] = G = u * T >> U, 0 != G ? (G = 255 / G, I[p] = (r * T >> U) * G, I[p + 1] = (s * T >> U) * G, I[p + 2] = (t * T >> U) * G) : I[p] = I[p + 1] = I[p + 2] = 0, r -= v, s -= w, t -= x, u -= y, v -= R.r, w -= R.g, x -= R.b, y -= R.a, n = q + ((n = k + f + 1) < K ? n : K) << 2, z += R.r = I[n], A += R.g = I[n + 1], B += R.b = I[n + 2], C += R.a = I[n + 3], r += z, s += A, t += B, u += C, R = R.next, v += D = S.r, w += E = S.g, x += F = S.b, y += G = S.a, z -= D, A -= E, B -= F, C -= G, S = S.next, p += 4;
                q += d
            }
            for (k = 0; d > k; k++) {
                for (A = B = C = z = s = t = u = r = 0, p = k << 2, v = M * (D = I[p]), w = M * (E = I[p + 1]), x = M * (F = I[p + 2]), y = M * (G = I[p + 3]), r += N * D, s += N * E, t += N * F, u += N * G, P = O, m = 0; M > m; m++) P.r = D, P.g = E, P.b = F, P.a = G, P = P.next;
                for (o = d, m = 1; f >= m; m++) p = o + k << 2, r += (P.r = D = I[p]) * (H = M - m), s += (P.g = E = I[p + 1]) * H, t += (P.b = F = I[p + 2]) * H, u += (P.a = G = I[p + 3]) * H, z += D, A += E, B += F, C += G, P = P.next, L > m && (o += d);
                for (p = k, R = O, S = Q, l = 0; e > l; l++) n = p << 2, I[n + 3] = G = u * T >> U, G > 0 ? (G = 255 / G, I[n] = (r * T >> U) * G, I[n + 1] = (s * T >> U) * G, I[n + 2] = (t * T >> U) * G) : I[n] = I[n + 1] = I[n + 2] = 0, r -= v, s -= w, t -= x, u -= y, v -= R.r, w -= R.g, x -= R.b, y -= R.a, n = k + ((n = l + M) < L ? n : L) * d << 2, r += z += R.r = I[n], s += A += R.g = I[n + 1], t += B += R.b = I[n + 2], u += C += R.a = I[n + 3], R = R.next, v += D = S.r, w += E = S.g, x += F = S.b, y += G = S.a, z -= D, A -= E, B -= F, C -= G, S = S.next, p += d
            }
            i.putImageData(g, b, c)
        }
    }

    function stackBlurCanvasRGB(a, b, c, d, e, f) {
        if (!(isNaN(f) || 1 > f)) {
            f |= 0;
            var g, h = doc.getElementById(a),
                i = h.getContext("2d");
            try {
                try {
                    g = i.getImageData(b, c, d, e)
                } catch (j) {
                    try {
                        netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead"), g = i.getImageData(b, c, d, e)
                    } catch (j) {
                        throw alert("Cannot access local image"), new Error("unable to access local image data: " + j)
                    }
                }
            } catch (j) {
                throw alert("Cannot access image"), new Error("unable to access image data: " + j)
            }
            var k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z, A, B, C, D, E = g.data,
                F = f + f + 1,
                G = d - 1,
                H = e - 1,
                I = f + 1,
                J = I * (I + 1) / 2,
                K = new BlurStack,
                L = K;
            for (m = 1; F > m; m++)
                if (L = L.next = new BlurStack, m == I) var M = L;
            L.next = K;
            var N = null,
                O = null;
            q = p = 0;
            var P = mul_table[f],
                Q = shg_table[f];
            for (l = 0; e > l; l++) {
                for (x = y = z = r = s = t = 0, u = I * (A = E[p]), v = I * (B = E[p + 1]), w = I * (C = E[p + 2]), r += J * A, s += J * B, t += J * C, L = K, m = 0; I > m; m++) L.r = A, L.g = B, L.b = C, L = L.next;
                for (m = 1; I > m; m++) n = p + ((m > G ? G : m) << 2), r += (L.r = A = E[n]) * (D = I - m), s += (L.g = B = E[n + 1]) * D, t += (L.b = C = E[n + 2]) * D, x += A, y += B, z += C, L = L.next;
                for (N = K, O = M, k = 0; d > k; k++) E[p] = r * P >> Q, E[p + 1] = s * P >> Q, E[p + 2] = t * P >> Q, r -= u, s -= v, t -= w, u -= N.r, v -= N.g, w -= N.b, n = q + ((n = k + f + 1) < G ? n : G) << 2, x += N.r = E[n], y += N.g = E[n + 1], z += N.b = E[n + 2], r += x, s += y, t += z, N = N.next, u += A = O.r, v += B = O.g, w += C = O.b, x -= A, y -= B, z -= C, O = O.next, p += 4;
                q += d
            }
            for (k = 0; d > k; k++) {
                for (y = z = x = s = t = r = 0, p = k << 2, u = I * (A = E[p]), v = I * (B = E[p + 1]), w = I * (C = E[p + 2]), r += J * A, s += J * B, t += J * C, L = K, m = 0; I > m; m++) L.r = A, L.g = B, L.b = C, L = L.next;
                for (o = d, m = 1; f >= m; m++) p = o + k << 2, r += (L.r = A = E[p]) * (D = I - m), s += (L.g = B = E[p + 1]) * D, t += (L.b = C = E[p + 2]) * D, x += A, y += B, z += C, L = L.next, H > m && (o += d);
                for (p = k, N = K, O = M, l = 0; e > l; l++) n = p << 2, E[n] = r * P >> Q, E[n + 1] = s * P >> Q, E[n + 2] = t * P >> Q, r -= u, s -= v, t -= w, u -= N.r, v -= N.g, w -= N.b, n = k + ((n = l + I) < H ? n : H) * d << 2, r += x += N.r = E[n], s += y += N.g = E[n + 1], t += z += N.b = E[n + 2], N = N.next, u += A = O.r, v += B = O.g, w += C = O.b, x -= A, y -= B, z -= C, O = O.next, p += d
            }
            i.putImageData(g, b, c)
        }
    }

    function BlurStack() {
        this.r = 0, this.g = 0, this.b = 0, this.a = 0, this.next = null
    }

    function SD(a, b) {
        function c() {
            if (1 == arguments.length) this._date = new Date(arguments[0]), this._localDate = new Date(+this._date + b);
            else {
                var a = Array.prototype.slice.call(arguments);
                a.unshift(null), this._localDate = new(Function.prototype.bind.apply(Date, a)), this._date = new Date(this._localDate - b)
            }
        }
        if (null == b) {
            if (!a || parseInt(a, 10) <= 0) return Date;
            b = +new Date - parseInt(a, 10)
        }
        if (Math.abs(b) < 6e5) return Date;
        var d, e;
        return function() {
            var a = (new Date).getTimezoneOffset(),
                c = Math.floor(b / 1e3 / 60);
            d = (a - c) % 1440, e = "GMT", e += 0 >= d ? "+" : "-";
            var f = Math.abs(d),
                g = Math.floor(f / 60);
            10 > g && (e += "0"), e += g;
            var h = f % 60;
            10 > h && (e += "0"), e += h, e += " (AREA 51)"
        }(), c._offset = b, ["getDate", "getDay", "getFullYear", "getHours", "getMilliseconds", "getMinutes", "getMonth", "getSeconds", "toDateString"].forEach(function(a) {
            c.prototype[a] = function() {
                return this._localDate[a]()
            }
        }), ["getUTCDate", "getUTCDay", "getUTCFullYear", "getUTCHours", "getUTCMilliseconds", "getUTCMinutes", "getUTCMonth", "getUTCSeconds", "toISOString", "toLocaleString", "toLocaleDateString", "toLocaleTimeString", "getTime", "valueOf", "toJSON"].forEach(function(a) {
            c.prototype[a] = function() {
                return this._date[a]()
            }
        }), ["setDate", "setFullYear", "setHours", "setMilliseconds", "setMinutes", "setMonth", "setSeconds", "setTime"].forEach(function(a) {
            c.prototype[a] = function() {
                return this._localDate[a].apply(this._localDate, arguments), this._date = new Date(this._localDate - b), this._date.valueOf()
            }
        }), ["setUTCDate", "setUTCFullYear", "setUTCHours", "setUTCMilliseconds", "setUTCMinutes", "setUTCMonth", "setUTCSeconds"].forEach(function(a) {
            c.prototype[a] = function() {
                return this._date[a].apply(this._date, arguments), this._localDate = new Date(+this._date + b), this._date.valueOf()
            }
        }), c.prototype.toUTCString = function() {
            return this._date.toUTCString().replace("UTC", "GMT")
        }, c.prototype.getTimezoneOffset = function() {
            return d
        }, c.prototype.toTimeString = function() {
            return this._localDate.toTimeString().split(" ")[0] + " " + e
        }, c.prototype.toString = function() {
            return this.toDateString() + " " + this.toTimeString()
        }, c
    }

    function Sweety() {
        var a = function(a) {
                return new b(a)
            },
            b = function(a) {
                var b;
                "string" == typeof a && a.length > 0 ? b = "<" === a.substr(0, 1) ? c.create(a) : c.find(document, a) : "object" == typeof a && null !== a && (b = a), this.elements = [];
                var d = Object.prototype.toString.call(b);
                return b && ("[object HTMLCollection]" === d || "[object NodeList]" === d ? this.elements = Array.prototype.slice.call(b) : "[object Array]" === d ? this.elements = b : "[SweetyElement]" === b.toString() ? this.elements = b.elements : this.elements = [b]), this
            },
            c = a.fn = {
                create: function(a) {
                    var b = document.createElement("div");
                    return b.innerHTML = a, b.children
                },
                find: function(a, b) {
                    var c;
                    switch (b.substr(0, 1)) {
                        case ".":
                            c = a.getElementsByClassName(b.substr(1));
                            break;
                        case "#":
                            c = a.getElementById(b.substr(1));
                            break;
                        case "@":
                            c = a.getElementsByName(b.substr(1));
                            break;
                        default:
                            c = a.getElementsByTagName(b)
                    }
                    return c
                },
                each: function(a, b) {
                    for (var c = 0, d = a.length; d > c; c++) b(a[c], c, a)
                },
                objEach: function(a, b) {
                    for (var c in a) a.hasOwnProperty(c) && b(c, a[c])
                },
                contains: function(a, b) {
                    return -1 !== a.indexOf(b)
                },
                getClasses: function(a) {
                    return "" === a.className ? [] : a.className.split(/\s+/)
                },
                saveClasses: function(a, b) {
                    a.className = b.join(" ")
                },
                getStyles: function(a) {
                    var b = a.style.cssText.split(/;\s*/),
                        c = {};
                    return this.each(b, function(a) {
                        var b = a.split(/:\s*/);
                        2 === b.length && (c[b[0]] = b[1])
                    }), c
                },
                saveStyles: function(a, b) {
                    var c = [];
                    this.objEach(b, function(a, b) {
                        c.push(a + ":" + b)
                    }), a.style.cssText = c.join(";")
                }
            };
        return b.prototype = {
            toArray: function() {
                return this.elements
            },
            findChild: function(b) {
                return this.elements[0] ? a(c.find(this.elements[0], b)) : a()
            },
            findParent: function(b) {
                if (!this.elements[0]) return a();
                var d = this.elements[0];
                if (!b) return this.parent();
                if ("." === b.substr(0, 1))
                    for (;
                        (d = d.parentElement) && !c.contains(c.getClasses(d), b.substr(1)););
                else
                    for (;
                        (d = d.parentElement) && d.tagName.toUpperCase() != b.toUpperCase(););
                return a(d)
            },
            parent: function() {
                return this.elements[0] ? a(this.elements[0].parentElement) : a()
            },
            forEach: function(a) {
                return c.each(this.elements, a), this
            },
            getProp: function(a) {
                return this.elements[0] ? this.elements[0][a] : void 0
            },
            setProp: function(a, b) {
                var d = {};
                return "object" == typeof a ? d = a : d[a] = b, this.forEach(function(a) {
                    c.objEach(d, function(b, c) {
                        a[b] = c
                    })
                }), this
            },
            prop: function(a, b) {
                return void 0 != b || "object" == typeof a ? this.setProp(a, b) : this.getProp(a)
            },
            getAttr: function(a) {
                return this.elements[0] ? this.elements[0].getAttribute(a) : null
            },
            setAttr: function(a, b) {
                var d = {};
                return "[object Object]" === a.toString() ? d = a : d[a] = b, this.forEach(function(a) {
                    c.objEach(d, function(b, c) {
                        a.setAttribute(b, c)
                    })
                }), this
            },
            removeAttr: function(a) {
                var b = [];
                return "object" == typeof a ? b = a : b.push(a), this.forEach(function(a) {
                    c.each(b, function(b) {
                        a.removeAttribute(b)
                    })
                }), this
            },
            hasAttr: function(a) {
                return this.elements[0] ? this.elements[0].hasAttribute(a) : !1
            },
            attr: function(a, b) {
                return void 0 != b || "object" == typeof a ? (this.setAttr(a, b), this) : this.getAttr(a)
            },
            val: function(a) {
                if (this.elements[0] && "SELECT" == this.elements[0].tagName && this.elements[0].multiple) {
                    if (void 0 != a) return "string" == typeof a && (a = a.split(" ")), this.findChild("option").forEach(function(b) {
                        c.contains(a, b.value) ? b.selected = !0 : b.selected = !1
                    }), this;
                    var b = [];
                    return this.findChild("option").forEach(function(a) {
                        a.selected && b.push(a.value)
                    }), b.length > 0 ? b : null
                }
                if (this.elements[0] && "INPUT" == this.elements[0].tagName && "radio" == this.elements[0].type) {
                    if (void 0 != a) return this.forEach(function(b) {
                        b.value == a ? b.checked = !0 : b.checked = !1
                    }), this;
                    var b = null;
                    return this.forEach(function(a) {
                        a.checked && (b = a.value)
                    }), b
                }
                if (this.elements[0] && "INPUT" == this.elements[0].tagName && "checkbox" == this.elements[0].type) {
                    if (void 0 != a) return "string" == typeof a && (a = a.split(" ")), this.forEach(function(b) {
                        c.contains(a, b.value) ? b.checked = !0 : b.checked = !1
                    }), this;
                    var b = [];
                    return this.forEach(function(a) {
                        a.checked && b.push(a.value)
                    }), b.length > 0 ? b : null
                }
                return void 0 != this.prop("value") ? this.prop("value", a) : this.attr("value", a)
            },
            addClass: function(a) {
                return "string" == typeof a && (a = a.split(/\s+/)), this.forEach(function(b) {
                    var d = c.getClasses(b);
                    c.each(a, function(a) {
                        -1 === d.indexOf(a) && d.push(a)
                    }), c.saveClasses(b, d)
                }), this
            },
            removeClass: function(a) {
                return "string" == typeof a && (a = a.split(/\s+/)), this.forEach(function(b) {
                    var d = c.getClasses(b);
                    c.each(a, function(a) {
                        var b = d.indexOf(a); - 1 !== b && d.splice(b, 1)
                    }), c.saveClasses(b, d)
                }), this
            },
            hasClass: function(a) {
                return this.elements[0] ? c.contains(c.getClasses(this.elements[0]), a) : !1
            },
            toggleClass: function(a) {
                return this.hasClass(a) ? this.removeClass(a) : this.addClass(a), this
            },
            addStyle: function(a, b) {
                return this.forEach(function(d) {
                    var e = c.getStyles(d);
                    void 0 != b ? e[a] = b : "object" == typeof a && c.objEach(a, function(a, b) {
                        e[a] = b
                    }), c.saveStyles(d, e)
                }), this
            },
            removeStyle: function(a) {
                return "string" == typeof a && (a = [a]), this.forEach(function(b) {
                    var d = c.getStyles(b);
                    c.each(a, function(a) {
                        delete d[a]
                    }), c.saveStyles(b, d)
                }), this
            },
            css: function(a, b) {
                return this.addStyle(a, b)
            },
            html: function(a) {
                return void 0 != a ? (this.empty().forEach(function(b) {
                    b.innerHTML = a
                }), this) : this.elements[0] ? this.elements[0].innerHTML : void 0
            },
            empty: function() {
                return this.forEach(function(a) {
                    for (; a.firstChild;) a.removeChild(a.firstChild)
                }), this
            },
            append: function(a) {
                return this.elements[0] && a ? ("[SweetyElement]" === a.toString() ? c.each(a.elements, function(a) {
                    this.elements[0].appendChild(a)
                }.bind(this)) : this.elements[0].appendChild(a), this) : this
            },
            remove: function() {
                this.forEach(function(a) {
                    a.parentNode.removeChild(a)
                }), this.elements = []
            },
            on: function(a, b) {
                return "string" == typeof a && (a = a.split(" ")), c.each(a, function(a) {
                    this.forEach(function(c) {
                        c.addEventListener(a, b, !1)
                    })
                }.bind(this)), this
            },
            off: function(a, b) {
                return "string" == typeof a && (a = a.split(" ")), c.each(a, function(a) {
                    this.forEach(function(c) {
                        c.removeEventListener(a, b, !1)
                    })
                }.bind(this)), this
            },
            exists: function() {
                return 0 === this.elements.length ? !1 : !0
            },
            toString: function() {
                return "[SweetyElement]"
            }
        }, c.each(arguments, function(a) {
            "object" == typeof a && c.objEach(a, function(a, c) {
                "function" == typeof c && (b.prototype[a] = c)
            })
        }), a
    }

    function Countdown(a) {
        helpers.isArray(a.elemId) || (a.elemId = [a.elemId]), this.elemId = a.elemId, this.elems = [];
        var b;
        for (var c in this.elemId) this.elemId.hasOwnProperty(c) && ("string" == typeof a.elemId[c] ? b = doc.getElementById(a.elemId[c]) : a.elemId[c] instanceof Element && (b = a.elemId[c]), b && (this.elems[a.elemId[c]] = b));
        this.time = a.time, this.template = a.template, this.msNumbers = a.msNumbers || 2, this.delta = a.delta || 33, this.reset()
    }

    function WidgetSounds(a) {
        if (this._canPlay = !1, a.hollow || "undefined" == typeof Audio) return this;
        var b = new Audio;
        return b.canPlayType("audio/mp3") ? (this._canPlay = !0, this._path = a.path, this._muted = !1, void(this._sounds = {})) : this
    }

    function init() {
		console.log('Инициализарован');
        //postloadfunction(), widgetSounds = new WidgetSounds({
        //    path: "//" + SCCore.opt.static_domain + "/widget2/sound/"
       // }), widgetSounds.add("open", "sound_open.mp3")
    }


    function drawWidget() {
        var a = $("#cbh_widget_wrapper"),
            b = defaultRating;
        if ("undefined" != typeof h_params.rating && parseFloat(h_params.rating) > .9 && (b = parseFloat(h_params.rating)), 0 === a.elements.length) {
            var c = tpl.main({
                rating: (Math.floor(10 * b) / 10).toFixed(1),
                client_phone: dialogs.client_phone ? dialogs.client_phone : "",
                countdown: countdown
            });
            $(doc.body).append($(c)), setPhoneIconName(), a = $("#cbh_widget_wrapper")
        }
        helpers.freeMode() && a.addClass("cbh-free-usage"), $(".cbh-widget").addClass("cbh-" + SCCore.lang.langCode), helpers.setWrapperH(), dialogForms.addEvents()
    }

    function setPhoneIconName() {
        if (SCCore.user.name) {
            var a = {
                name: SCCore.user.name.split(/\s+/)[0]
            };
            $("#cbh_widget_helloName1").html(__("phoneIcon.helloName1", a)), $("#cbh_widget_helloName2").html(__("phoneIcon.helloName2", a)), setTimeout(function() {
                $(".cbh-widget-name-text").scaleText(100, 10, 30, "cbh-widget-name-text")
            }, 1e3)
        }
    }

    function toggleDayNightMode() {
        SCCore.server.get(function() {
            init(), "worktime" === widget_mode ? widget_mode = "night" : "night" === widget_mode && (widget_mode = "worktime"), is_mobile ? showSimpleMobileDialog() : showSimpleDialog()
        })
    }

    function showNamedDialog(a) {
        showSimpleDialog(), dialogs[a]()
    }

    function showSimpleDialog() {
        showWidget(), "worktime" === widget_mode ? (countdownObj = new Countdown({
            elemId: "cbh_timer",
            time: 1e3 * countdown,
            template: '<div class="cbh-numbs">%minutes%</div><div class="cbh-d">:</div><div class="cbh-numbs">%seconds%</div><div class="cbh-d">:</div><div class="cbh-numbs">%ms%</div>'
        }), helpers.freeMode() && $("#cbh_info").html(__("callNow.info-free")), helpers.hideDialogItems(), helpers.freeMode() && callStatus.render(__("callNow.head-free")), helpers.showDialogItem("#cbh_item_call"), dialogs.client_phone && callStatus.connect(), typingEffect.effect()) : showSimpleDialogNightMode()
    }

    function showSimpleDialogNightMode() {
        dialogs.callLaterAction();
        var a, b = __("callLater.head_night");
        a = __(helpers.freeMode() ? "callLater.text_night-free" : "callLater.text_night"), $("#cbh_item_call_deferred_head").html(b).removeClass("cbh-typed").addClass("cbh-typing"), $("#cbh_item_call_deferred_text").html(a).removeClass("cbh-typed").addClass("cbh-typing")
    }

    function sendYaMetrikaEvent(a) {
        if (!disable_metrika_events) {
            if (!yaMetrikaName)
                for (var b in win)
                    if (win.hasOwnProperty(b) && b.match(/yaCounter\d+/) && win[b].reachGoal) {
                        yaMetrikaName = b;
                        break
                    }
            if (yaMetrikaName) try {
                win[yaMetrikaName].reachGoal(a)
            } catch (c) {}
        }
    }

    function sendGaEvent(a, b, c, d) {
        if (!disable_ga_events)
            if ("undefined" != typeof win.ga_cbh && helpers.isFunction(win.ga_cbh) && ga_cbh(a, b, c, d), "undefined" != typeof win.ga && helpers.isFunction(win.ga)) try {
                for (var e = win.ga.getAll(), f = 0; f < e.length; ++f) {
                    var g = e[f];
                    g.send(b, c, d)
                }
            } catch (h) {} else if ("object" == typeof win._gaq && helpers.isFunction(win._gaq.push)) try {
                win._gaq.push(["_trackEvent", c, d])
            } catch (h) {}
    }

    function initGA() {
        if (!disable_ga_events) {
            if ("undefined" != typeof h_params.ga_disable && 1 == h_params.ga_disable) return !1;
            ga_cbh = null,
                function(a, b, c, d, e, f, g) {
                    a.GoogleAnalyticsObject = e, a[e] = a[e] || function() {
                        (a[e].q = a[e].q || []).push(arguments)
                    }, a[e].l = 1 * new Date, f = b.createElement(c), g = b.getElementsByTagName(c)[0], f.async = 1, f.src = d, g.parentNode.insertBefore(f, g)
                }(win, doc, "script", "//www.google-analytics.com/analytics.js", "ga_cbh"), ga_cbh = ga_cbh || win.ga_cbh, ga_cbh("create", "UA-50011917-2", "callbackhunter.com"), ga_cbh("send", "pageview")
        }
    }

    function showPhoneIcon() {
        $(".cbh").hasClass("cbh-show") || $("#cbh_phone").show()
    }

    function hidePhoneIcon() {
        $("#cbh_phone").hide().addClass("cbh-off")
    }

    function animatePhoneScroll() {
        var a, b, c, d, e, f = $("#cbh_phone"),
            g = 0,
            h = 0;
        $(win).on("scroll", function() {
            if (clearTimeout(c), clearTimeout(d), !e) {
                var i = win.getComputedStyle(f.elements[0], null);
                a = parseInt(i.getPropertyValue("left"), 10), b = parseInt(i.getPropertyValue("top"), 10), e = !0
            }
            h += helpers.getScrollTop() - g;
            var j = b - h;
            g = helpers.getScrollTop(), f.css({
                left: a + "px",
                top: j + "px"
            }), c = setTimeout(function() {
                f.css({
                    left: a + "px",
                    top: b + "px"
                }), h = 0
            }, 200), d = setTimeout(function() {
                e = !1
            }, 1e3)
        })
    }

    function activatePhoneIcon() {
        $("#cbh_phone").addClass(["cbh-pulse", "cbh-fast"])
    }

    function deactivatePhoneIcon() {
        $("#cbh_phone").removeClass(["cbh-pulse", "cbh-fast", "cbh-slow"])
    }

    function checkPhone(a) {
        if ("string" == typeof a && (a = $(a)), a.exists()) {
            var b = a.val();
            if ("" === b)
                if ("undefined" != typeof default_phone[SCCore.lang.langCode] && "" !== default_phone[SCCore.lang.langCode]) a.val(default_phone[SCCore.lang.langCode]);
                else {
                    var c = !1;
                    for (var d in default_phone) "" != default_phone[d] && (c = default_phone[d]);
                    c === !1 ? "" !== phone_code ? a.val(phone_code) : a.val("+") : a.val("+" + c)
                }
            b = a.val(), "ru" === SCCore.lang.langCode && "+8" === b && a.val("+7"), "ru" !== SCCore.lang.langCode || "495" !== b && "+495" !== b || a.val("+7495"), "ru" !== SCCore.lang.langCode || "499" !== b && "+499" !== b || a.val("+7499"), "+" !== b.charAt(0) && a.val("+" + b.replace("+", "")), a.val(a.val().replace(/[^\d\+.]/g, ""))
        }
    }

    function drawPhone() {
        var a = $("#cbh_phone");
        if (a.removeClass("cbh-off").show(a), is_mobile) helpers.addCSSRules({
            ".cbh-mobile-widget": "color: #" + phone_icon_color_code + "!important;",
            ".cbh-mobile-widget .cbh-bg-icon": "background-color: #" + phone_icon_color_code + "!important;"
        }), "undefined" != typeof h_params.text_color && "white" === h_params.text_color && helpers.addCSSRules({
            "#cbh_mobile_widget_wrapper *": "color: #fff!important;",
            "#cbh_mobile_widget_wrapper .cbh-mobile-body input[type=text], #cbh_mobile_widget_wrapper .cbh-mobile-body input[type=tel]": "color: #333!important;"
        });
        else {
            helpers.addCSSRules({
                ".cbh-widget .cbh-bg-icon": "background: #" + phone_icon_color_code + "!important;",
                ".cbh-widget.cbh-icon-sideways-right .cbh-bg-icon:after": "border-color: transparent transparent transparent #" + phone_icon_color_code + "!important;",
                ".cbh-widget.cbh-icon-sideways-left .cbh-bg-icon:after": "border-color: transparent #" + phone_icon_color_code + " transparent transparent!important;",
                ".cbh-widget": "color: #" + phone_icon_color_code + "!important;",
                ".cbh-widget .cbh-widget-global-icon .cbh-widget-bg": "opacity: " + phone_icon_opacity + "!important;"
            }), "undefined" != typeof h_params.enable_micromenu && 1 == h_params.enable_micromenu ? helpers.addCSSRules({
                ".cbh-widget-micromenu div": "background-color: #" + phone_icon_color_code + "!important; opacity: 0.5!important;",
                ".cbh-widget-micromenu div:hover": "opacity: 1!important;"
            }) : helpers.addCSSRules({
                ".cbh-widget-micromenu": "display: none;"
            }), "undefined" != typeof h_params.text_color && "white" === h_params.text_color && (helpers.addCSSRules({
                "#cbh_widget_wrapper .cbh-body *": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-body a": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-body .cbh-powered-by": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-body .cbh-powered-by a": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-item-later__link": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-body .cbh-link a": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-body .cbh-wrapper .cbh-item .cbh-text .cbh-normal-text,.cbh-body .cbh-wrapper .cbh-item .cbh-text .cbh-big-text": "color: #fff!important;"
            }), helpers.addCSSRules({
                "#cbh_widget_wrapper .cbh-body ::-webkit-input-placeholder": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-body ::-moz-placeholder": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-body :-moz-placeholder": "color: #fff!important;",
                "#cbh_widget_wrapper .cbh-body :-ms-input-placeholder": "color: #fff!important;"
            })), "undefined" != typeof widget_body_opacity && widget_body_opacity > .3 && 1 > widget_body_opacity && helpers.addCSSRules({
                "#cbh_container .cbh-background, #cbh_container .cbh-body": "opacity: " + widget_body_opacity + ";"
            });
            var b = view_w * phoneicon_x / 100;
            b > view_w - 200 && (b = view_w - 200), 0 > b && (b = 0);
            var c = phoneicon_y * (view_h - 150) / 100 + 30;
            phoneDragObject.checkSide({
                X: b,
                Y: c
            }), a.css({
                opacity: phone_icon_opacity,
                left: b + "px",
                top: c + "px"
            })
        }
        0 !== phoneiconScrollOffset || is_mobile || showPhoneIcon(), a.on("mouseover", function() {
            $(".cbh-widget").hasClass("cbh-show") && ($(".cbh-widget-micromenu").removeClass("cbh-hide-micromenu"), micromenuOpen = !0)
        }).on("mouseleave", function() {
            $(".cbh-widget-micromenu").addClass("cbh-hide-micromenu"), micromenuOpen = !1
        }), $(".cbh-widget-content").on("mouseover", function() {
            deactivatePhoneIcon(), widgetIconAnimation.stop()
        }).on("mouseleave", function() {
            widgetIconAnimation.reset()
        }), widgetIconAnimation.init()
    }

    function redrawPhone() {
        var a = $("#cbh_phone");
        if (a.exists()) {
            var b = view_w,
                c = view_h,
                d = helpers.viewportSize(),
                e = d.width,
                f = d.height,
                g = win.getComputedStyle(a.elements[0], null),
                h = parseInt(g.getPropertyValue("left"), 10),
                i = parseInt(g.getPropertyValue("top"), 10),
                j = h,
                k = i;
            i > c / 2 && (k = f - (c - i)), h > b / 2 && (j = e - (b - h)), view_w = e, view_h = f, a.css({
                left: j + "px",
                top: k + "px"
            }), phoneDragObject.ChangeBounds(new Position(0, 0), new Position(view_w - 200, view_h - 150))
        }
    }

    function drawWidgetMobile() {
        var a = $("#cbh_mobile_widget_wrapper");
        if (0 === a.elements.length) {
            var b = tpl.mobile({
                client_phone: dialogs.client_phone ? dialogs.client_phone : "",
                countdown: countdown
            });
            $(doc.body).append($(b)), a = $("#cbh_mobile_widget_wrapper")
        }
        helpers.freeMode() && a.addClass("cbh-free-usage"), drawPhone(), scalePhone()
    }

    function setShowCookie() {
        SCCore.cookies.set("hunter_showed", "1", {
            expires: 1
        }), SCCore.cookies.set("hunter_session", "1", {
            expires: 30
        })
    }

    function showMobileWidget() {
        widgetOpen || (widgetOpen = !0, $("#cbh_mobile_widget").show(), scaleWidget(), $(".cbh-banner-bg").show(), block_auto_popup = !0, sendGaEvent("send", "event", "Callbackhunter_OPEN_MOBILE", "clicked"), sendYaMetrikaEvent("Callbackhunter_OPEN_MOBILE"), SCCore.cookies.get("hunter_showed") || setShowCookie(), sendShowWidget())
    }

    function showSimpleMobileDialog() {
        dialogs.client_phone && callStatus.connect(), showMobileWidget(), helpers.hideDialogItems(), "worktime" === widget_mode ? (countdownObj = new Countdown({
            elemId: "cbh_timer",
            time: 1e3 * countdown,
            template: '<div class="cbh-numbs">%minutes%</div><div class="cbh-d">:</div><div class="cbh-numbs">%seconds%</div><div class="cbh-d">:</div><div class="cbh-numbs">%ms%</div>'
        }), $("#cbh_mobile_item_call").show()) : showMobileDialogNightMode(), typingEffect.effect()
    }

    function showMobileDialogNightMode() {
        dialogs.callLaterMobileAction();
        var a;
        a = helpers.freeMode() ? "callLater.mobile.text_night-free" : "callLater.mobile.text_night", a = __(a, {
            delay: '<span id="nightModeCountdownMobile"></span>'
        }), $("#cbh_mobile_deferred_text").html(a), modeToggleCountdownObj.addContainer("nightModeCountdownMobile")
    }

    function showWidgetEnter(a) {
        show_enter && (block_auto_popup || block_show_banner || min_popup_delay > 0 || (clearTimeout(dialog_timer), ("undefined" != typeof a && a || !SCCore.cookies.get("hunter_showed")) && (widgetOpen || !helpers.isNull(enter_or_exit_at) && minimum_enter_or_exit_delay > avgTimerSec - enter_or_exit_at || (enter_or_exit_at = avgTimerSec, widget_show_reason = 2, showWidget(), dialogs.enterWelcome(), topMenu.activate("intro")))))
    }

    function showWidget() {
        if ("undefined" != typeof h_params.enable_micromenu && 1 == h_params.enable_micromenu) {
            if (micromenuOpen) return;
            $(".cbh-widget-micromenu").addClass("cbh-hide-micromenu")
        }
        var a = $("#cbh_container");
        a.exists() && !a.hasClass("cbh-show") && (widgetSounds.play("open"), block_auto_popup = !0, widgetOpen = !0, a.show().addClass("cbh-on"), $(".cbh-banner-bg").css("display", "block"), $("#cbh_phone").hide(), SCCore.cookies.get("hunter_showed") || setShowCookie(), sendGaEvent("send", "event", "Callbackhunter_OPEN", "clicked"), sendYaMetrikaEvent("Callbackhunter_OPEN"), sendShowWidget())
    }

    function showWidgetExit(a) {
        clearTimeout(dialog_timer), widgetOpen || !helpers.isNull(enter_or_exit_at) && minimum_enter_or_exit_delay > avgTimerSec - enter_or_exit_at || (enter_or_exit_at = avgTimerSec, widget_show_reason = 3, is_mobile ? showMobileWidget() : showWidget(), a ? dialogs.intro() : dialogs.exitWeTreasure())
    }

    function sendShowWidget() {
        SCCore.server.send({
            open: 1
        })
    }

    function sendHideWidget() {
        SCCore.server.send({
            close: 1
        })
    }

    function catchHash() {
        if (loc.hash) {
            var a = loc.hash.substring(1);
            "callbackhunter" == a && (dialogs.callNow(), loc.hash = "#callbackhunter-ok"), "callbackhunter-dialog" == a && (showWidgetExit(!0), loc.hash = "#callbackhunter-dialog-ok")
        }
    }

    function catchWidgetExitMobile() {
        if (show_exit && !block_show_banner && !(block_auto_popup || min_popup_delay > 0)) {
            var a = doc.body,
                b = doc.documentElement,
                c = Math.max(a.scrollHeight, a.offsetHeight, b.clientHeight, b.scrollHeight, b.offsetHeight),
                d = helpers.viewportSize(),
                e = helpers.getScrollTop(),
                f = d.height + e;
            !showedExit && reachedPageEnd && reachedScrollBottom > f && (showedExit = !0, showWidgetExit()), reachedScrollBottom = f, !reachedPageEnd && .05 * c > c - f && (reachedPageEnd = !0)
        }
    }

    function sendActualCallback(a) {
        a = a || {};
        var b, c = a.phone,
            d = a.office_id;
        return "undefined" == typeof c && (c = $("#cbh_phone_input").val()), helpers.phoneNumberOk(c) ? (call_rand_id = SCCore.helpers.rand(16), b = catchManagerPhone(), a.deferred ? SCCore.server.send({
            phone: c,
            client_name: SCCore.user.name || "",
            wp_code: "undefined" != typeof h_params.wp_code ? h_params.wp_code : "",
            lang: SCCore.lang.langCode,
            night_hour: a.deferredHours,
            night_minute: a.deferredMinutes || 0,
            office_id: d,
            call_rand_id: call_rand_id,
            phone_manager_tracked: b,
            widget_show_reason: widget_show_reason,
            user_date: JSON.stringify({
                utc: (new Date).toUTCString(),
                local: "" + new Date,
                utc_strong: (new StrongDate).toUTCString(),
                local_strong: (new StrongDate).toString(),
                chosen_day: a.day,
                chosen_hour: a.hour
            })
        }) : (callStatus.connect(), SCCore.server.send({
            phone: c,
            client_name: SCCore.user.name || "",
            wp_code: "undefined" != typeof h_params.wp_code ? h_params.wp_code : "",
            lang: SCCore.lang.langCode,
            office_id: d,
            reverse: reverse ? 1 : 0,
            call_rand_id: call_rand_id,
            phone_manager_tracked: b,
            widget_show_reason: widget_show_reason
        })), callStatus.autoRefreshStatus = !0, sendGaEvent("send", "event", "Callbackhunter_CALL", "clicked"), sendYaMetrikaEvent("Callbackhunter_CALL"), !0) : !1
    }

    function sendDeferredCallback(a) {
        a = a || {};
        var b = $("#cbh_phone_input_deferred"),
            c = b.val();
        if (!helpers.freeMode() && show_office_choice && !a.office && helpers.phoneNumberOk(c) && h_params.show_office_list && h_params.show_office_list.length > 1) return void dialogs.showOfficeChoice(!0);
        var d, e, f, g, h, i, j = "undefined" == typeof a ? !1 : a.office,
            k = new StrongDate,
            l = 0,
            m = 0,
            n = +$(".cbh-deferred__day-val").attr("data-day");
        n > 0 && (d = new StrongDate(n).getDay(), e = $(".cbh-deferred__hour-val").html(), e && (e = e.split(":"), f = parseInt(e[0], 10), g = parseInt(e[1], 10)), h = new StrongDate(n), h.setHours(f), h.setMinutes(g), i = h - k, l = Math.floor(i / 36e5), m = Math.floor((i - 60 * l * 60 * 1e3) / 6e4));
        var o;
        o = helpers.freeMode() && 0 > n ? {
            phone: c,
            deferred: !0
        } : {
            phone: c,
            office_id: j,
            deferred: !0,
            deferredHours: l,
            deferredMinutes: m,
            hour: $(".cbh-deferred__hour-val").html(),
            day: $(".cbh-deferred__day-val").html()
        }, sendActualCallback(o) ? dialogs.name ? dialogs.doYouWantRecordsOnEmail() : dialogs.letsCallLaterByName() : b.focus().css("border-color", "red!important")
    }

    function sendMobileDeferredCallback(a, b) {
        phone = a.cbh_mobile_night_mode_phone, hour = a.hour, minutes = a.minutes, sendActualCallback({
            phone: phone,
            office_id: 0,
            deferred: !0,
            deferredHours: hour,
            deferredMinutes: minutes
        }) ? (helpers.hideDialogItems(), dialogs.whatWouldYouLikeToBeCalled({
            head: "whatWouldYouLikeToBeCalled.head_from_mobile",
            text: "whatWouldYouLikeToBeCalled.text_from_mobile"
        })) : b.cbh_mobile_night_mode_phone().focus()
    }

    function sendCallback(a) {
        if (!countdownObj.running) {
            var b = $("#cbh_phone_input"),
                c = b.val(),
                d = "undefined" == typeof a ? !1 : a.office;
            return !helpers.freeMode() && show_office_choice && !d && helpers.phoneNumberOk(c) && h_params.show_office_list && h_params.show_office_list.length > 1 ? void dialogs.showOfficeChoice() : void(sendActualCallback({
                phone: c,
                office_id: d
            }) ? (dialogs.client_phone = c, helpers.freeMode() ? dialogs.doYouWantRecordsOnEmail() : countdownObj.start(dialogs.didCallSucceed), afterCallCustomActions(), "" !== after_action_url && ((new Image).src = after_action_url), SCCore.cookies.set("hunter_client_phone", c)) : b.focus().css("border-color", "red!important"))
        }
    }

    function afterCallCustomActions() {
        if ("undefined" != typeof custom_layout && null !== custom_layout && "undefined" != typeof custom_layout.actions && "object" == typeof custom_layout.actions.aftercall) {
            var a = custom_layout.actions.aftercall;
            if (a.length)
                for (var b in a) {
                    var c = a[b][0],
                        d = a[b][1];
                    if ("hide_by_id" === c) {
                        var e = doc.getElementById(d);
                        e && (e.style.display = "none")
                    }
                }
        }
    }

    function loadCustomLayoutCSS() {
        if (null !== h_params && "undefined" != typeof h_params.custom_layout && h_params.custom_layout.length) {
            var a = h_params.custom_layout;
            for (var b in a)
                if (1 == a[b].status) {
                    custom_layout = a[b];
                    break
                }
            null !== custom_layout && "undefined" != typeof custom_layout.css_file && custom_layout.css_file.length && SCCore.loadFile("css", SCCore.opt.static_domain + "/widget/custom/" + custom_layout.css_file, !0)
        }
    }

    function parseCustomLang() {
        if (null !== custom_layout && "undefined" != typeof custom_layout.translate)
            for (var a in custom_layout.translate) {
                var b = custom_layout.translate[a];
                if ("undefined" != typeof SCCore.lang.languages[a])
                    for (var c in b) SCCore.lang.addLangRow(c, b[c], a)
            }
    }

    function parseCustomLayout() {
        if (null !== custom_layout && "undefined" != typeof custom_layout.domnodes && custom_layout.domnodes.length)
            for (var a in custom_layout.domnodes) {
                var b = custom_layout.domnodes[a];
                if ("undefined" != typeof b.node) {
                    var c = "undefined" != typeof b.rel ? b.rel : !1,
                        d = "undefined" != typeof b.rel_position ? b.rel_position : !1;
                    if ("before" === d && c.match(/^#/)) {
                        c = c.replace(/^#/, "");
                        var e, f = doc.getElementById(c);
                        if (f && (e = f.parentNode), f && e) {
                            var g = doc.createElement("div");
                            g.innerHTML = b.node, e.insertBefore(g, f)
                        }
                    }
                }
            }
    }

    function checkIpDeny() {
        if (null === h_params || "undefined" == typeof h_params || "undefined" == typeof h_params.user_ip || "undefined" == typeof h_params.ip_deny || !h_params.ip_deny.length) return !1;
        for (var a in h_params.ip_deny)
            if (h_params.ip_deny.hasOwnProperty(a)) {
                var b = h_params.ip_deny[a] + "";
                if (b = b.replace(/ /g, "").replace(/\*/g, "\\d").replace(/\./g, "\\."), h_params.user_ip.match(b)) return !0
            }
        return !1
    }

    function postloadfunction() {
        if ((!SCCore.helpers.isEmpty(SCCore.db_params) || null !== h_params && 0 !== h_params.length) && (null === h_params && (h_params = SCCore.db_params), !checkIpDeny() && helpers.checkUtmAccess() !== !1)) {
            var a;
            if ("undefined" != typeof h_params.restrict_by_url && 1 == h_params.restrict_by_url && "undefined" != typeof h_params.url_restrict && h_params.url_restrict.length > 0)
                for (var b = JSON.parse(h_params.url_restrict), c = 0; c < b.length; c++) {
                    if (loc.pathname.replace(/^\/|\/$/g, "") == b[c].replace(/^\/|\/$/g, "")) return;
                    try {
                        if (a = new RegExp(b[c]), a.test(loc.pathname)) return
                    } catch (d) {}
                }
            if ("undefined" != typeof h_params.apply_by_url && 1 == h_params.apply_by_url && "undefined" != typeof h_params.url_apply && h_params.url_apply.length > 0) {
                for (var e = JSON.parse(h_params.url_apply), f = !1, c = 0; c < e.length; c++) {
                    loc.pathname.replace(/^\/|\/$/g, "") == e[c].replace(/^\/|\/$/g, "") && (f = !0);
                    try {
                        a = new RegExp(e[c]), a.test(loc.pathname) && (f = !0)
                    } catch (d) {}
                }
                if (0 == f) return
            }
            if (initGA(), loadCustomLayoutCSS(), null !== h_params && "undefined" != typeof h_params.timestamp && (StrongDate = SD(1e3 * h_params.timestamp, h_params.time_offset), StrongDate._offset ? h_params.time_offset = StrongDate._offset : h_params.time_offset = 1), is_mobile = helpers.isMobile(), SCCore.cookies.get("hunter_showed") && 1 == SCCore.cookies.get("hunter_showed") && h_params.show_once && "1" == h_params.show_once && (block_auto_popup = !0), SCCore.cookies.get("hunter_session") && 1 == SCCore.cookies.get("hunter_session") && h_params.show_once_session && "1" == h_params.show_once_session && (block_auto_popup = !0), h_params.active && 1 == h_params.active && (widget_mode = "worktime"), "night" == widget_mode && h_params.disable_night_mode && 1 == h_params.disable_night_mode) return void(block_auto_popup = !0);
            if ("undefined" != typeof h_params.sensitivity && parseInt(h_params.sensitivity) >= 1 && parseInt(h_params.sensitivity) <= 10 && (activityTracker.accelerometer.factor = 1 + .06 * (5 - h_params.sensitivity)), "undefined" != typeof h_params.is_spot && 1 == parseInt(h_params.is_spot) && ("undefined" != typeof SCCore.lang.languages.ru && (SCCore.lang.languages.ru.clbh_banner_work_to = '<a target="blank" id="clbh_banner_work_to_link" href="http://callbackspot.com">Работает на технологии CallbackSpot.com</a>'), "undefined" != typeof SCCore.lang.languages.en && (SCCore.lang.languages.en.clbh_banner_work_to = '<a target="blank" id="clbh_banner_work_to_link" href="http://callbackspot.com">Powered by technology CallbackSpot.com</a>')), "undefined" != typeof h_params.comments_url && h_params.comments_url.length > 0 && helpers.isValidURL(h_params.comments_url) && (comments_url = h_params.comments_url, /^https?:\/\//.test(comments_url) || (comments_url = "http://" + comments_url)), helpers.workTime.init(h_params.weekday, h_params.start_arr, h_params.stop_arr, h_params.time_zone), telemetry.addUserData(), "undefined" != typeof h_params.client_phone && (dialogs.client_phone = h_params.client_phone, client_phone.match(/^\+/) || (dialogs.client_phone = "+" + h_params.client_phone)), "undefined" != typeof h_params.client_name && (SCCore.user.name = h_params.client_name), "undefined" != typeof h_params.client_calls && (h_params.client_calls < 10 ? aggression = 1.3 : h_params.client_calls >= 10 && h_params.client_calls <= 20 ? aggression = 1 : h_params.client_calls > 20 && (aggression = .7)), "undefined" != typeof h_params.dialog_instead_of_chat && (dialog_instead_of_chat = 0 !== parseInt(h_params.dialog_instead_of_chat)), "undefined" != typeof h_params.mc_instead_of_contact_form && "worktime" === widget_mode && (mc_instead_of_contact_form = 0 !== parseInt(h_params.mc_instead_of_contact_form)), "undefined" != typeof h_params.sound_chat_message && (sound_chat_message = 1 === parseInt(h_params.sound_chat_message)), "undefined" != typeof h_params.pulse_animation && (pulse_animation = 1 === parseInt(h_params.pulse_animation)), "undefined" != typeof h_params.show_powered_by && (show_powered_by = 1 === parseInt(h_params.show_powered_by)), "undefined" != typeof h_params.free_mode && (free_mode = 0 == parseInt(h_params.free_mode) ? !1 : !0, loc.hash)) {
                var g = loc.hash.substring(1);
                "callbackhunter-dark" === g && (free_mode = !0)
            }
            if ("undefined" != typeof h_params.has_payments && (has_payments = 0 == parseInt(h_params.has_payments) ? !1 : !0), "undefined" != typeof h_params.time_connection && (countdown = parseInt(h_params.time_connection)), h_params.phone_icon && "1" == h_params.phone_icon)
                if ("undefined" != typeof h_params.phone_icon_opacity && .3 < parseFloat(h_params.phone_icon_opacity) && parseFloat(h_params.phone_icon_opacity) < 1.01 && (phone_icon_opacity = parseFloat(h_params.phone_icon_opacity)), h_params.phone_icon_color_code) phone_icon_color_code = h_params.phone_icon_color_code;
                else if (h_params.phone_icon_color) switch (h_params.phone_icon_color) {
                case "green":
                    phone_icon_color_code = "00aff2";
                    break;
                case "gray":
                    phone_icon_color_code = "cccccc"
            }
            if ("undefined" != typeof h_params.widget_body_opacity && .3 < parseFloat(h_params.widget_body_opacity) && parseFloat(h_params.widget_body_opacity) < 1 && (widget_body_opacity = parseFloat(h_params.widget_body_opacity)), h_params.background_color_code && (background_color_code = h_params.background_color_code), helpers.freeMode() || (helpers.isMobile() ? helpers.addCSSRules({
                    ".cbh-mobile-body.cbh-mobile-white": "background-color: #" + background_color_code + "!important;"
                }) : helpers.addCSSRules({
                    ".cbh .cbh-background .cbh-faded": "background-color: #" + background_color_code + "!important; opacity: 0.7!important;",
                    ".cbh .cbh-background .cbh-faded.no-blur": "background-color: #" + background_color_code + "!important; opacity: 0.97!important;"
                })), countdown > 0 && "night" == widget_mode) {
                var h = new StrongDate(+new StrongDate + 1e3 * countdown);
                h.setMinutes(0), h.setSeconds(0), modeToggleCountdown = (+h - new StrongDate) / 1e3
            } else if ("worktime" == widget_mode) {
                var i = helpers.workTime.getTimeStopToday(),
                    h = new StrongDate;
                h.setHours(i), h.setMinutes(0), h.setSeconds(0), modeToggleCountdown = (+h - new StrongDate) / 1e3
            }
            modeToggleCountdown && (modeToggleCountdownObj = new Countdown({
                time: 1e3 * modeToggleCountdown,
                delta: 3e4,
                template: "%text%"
            }), modeToggleCountdownObj.start(function() {
                toggleDayNightMode()
            })), is_mobile ? (void 0 === h_params.disable_mobile_widget || "0" === h_params.disable_mobile_widget || "callbackhunter" === loc.hash.substring(1)) && (drawWidgetMobile(), "undefined" != typeof h_params.mobile_phone_icon_pos_x && $(".cbh-mobile-phone-wrapper").css("margin-left", h_params.mobile_phone_icon_pos_x + "%"), $(win).on("hashchange", catchHash), $("#cbh_phone").on("click", function() {
                widget_show_reason = 1, showSimpleMobileDialog()
            }), $(".cbh-banner-bg").on("click", helpers.hideWidget), $("#cbh_mobile_close").on("click", helpers.hideWidget), dialogForms.addEvents(), $(win).on("scroll", catchWidgetExitMobile)) : (drawWidget(), h_params.brand_image && !free_mode && ($(".cbh-branding").addClass("cbh-brand-image").css({
                "background-image": "url(//" + SCCore.opt.static_domain + "/uploads/brand/" + h_params.brand_image + ")"
            }), $(".cbh-powered-by").addClass("cbh-branded"), $(".cbh-wrapper").addClass("cbh-branded")), "undefined" != typeof h_params.enable_blur ? enable_blur = 0 !== parseInt(h_params.enable_blur) : enable_blur = !1, helpers.blurEnabled() ? setTimeout(function() {
                CbhHtml2Canvas(doc.body, {
                    onrendered: function(a) {
                        a.id = "cbh_canvas", $(".cbh-blured").append(a), stackBlurCanvasRGB("cbh_canvas", 0, 0, a.width, a.height, 30)
                    }
                })
            }, 500) : ($(".cbh-faded").addClass("no-blur"), $(".cbh-background").addClass("no-blur")), $(".cbh-x").on("click", helpers.hideWidget), $(".cbh-banner-bg").on("click", helpers.hideWidget), $(".cbh-arrow").on("click", helpers.hideWidget), $(win).on("hashchange", catchHash), dialog_timer = setTimeout(showWidgetEnter, 4e4 * aggression), telemetry.start(), activityTracker.start()), $(".cbh-powered-by").html(__(helpers.freeMode() ? "free_powered_by" : "powered_by")), show_powered_by || ($(".cbh-powered-by").remove(), $(".cbh-mobile-pwrd").remove()), "undefined" != typeof h_params.min_popup_delay && parseInt(h_params.min_popup_delay) > 0 && (min_popup_delay = parseInt(h_params.min_popup_delay) * aggression, clearInterval(minPopupTimer), minPopupTimer = setInterval(countPopupDelayTimer, 1e3)), "undefined" != typeof h_params.min_window_exit_delay && parseInt(h_params.min_window_exit_delay) > 0 && (min_window_exit_delay = parseInt(h_params.min_window_exit_delay)), "undefined" != typeof h_params.min_enter_on_active_delay && parseInt(h_params.min_enter_on_active_delay) > 0 && (min_enter_on_active_delay = parseInt(h_params.min_enter_on_active_delay)), "undefined" != typeof h_params.popup_after && parseInt(h_params.popup_after) > 0 && (popup_after = parseInt(h_params.popup_after) * aggression, setTimeout(function() {
                helpers.isVisible("#cbh_container") || showWidgetEnter(!0)
            }, 1e3 * popup_after)), clearInterval(avgTimer), avgTimer = setInterval(showByAvg, 1e3), "undefined" != typeof h_params.f_label && "" !== h_params.f_label ? $(".cbh-powered-by-link").attr("href", "http://callbackhunter.com/" + h_params.f_label) : "undefined" != typeof h_params.affiliate_link && "" !== h_params.affiliate_link && $(".cbh-powered-by-link").attr("href", $(".cbh-powered-by-link").attr("href") + "#a_aid=" + h_params.affiliate_link), "undefined" != typeof h_params.show_enter && (show_enter = 1 == parseInt(h_params.show_enter) ? !0 : !1), "undefined" != typeof h_params.show_exit && (show_exit = 1 == parseInt(h_params.show_exit) ? !0 : !1), "undefined" != typeof h_params.phone_code && (phone_code = h_params.phone_code), "undefined" != typeof h_params.after_action && (after_action_url = h_params.after_action), "undefined" != typeof h_params.has_minutes && (has_minutes = 0 === parseInt(h_params.has_minutes) ? !1 : !0), enable_discount = "undefined" != typeof h_params.enable_discount ? 0 === parseInt(h_params.enable_discount) ? !1 : !0 : !1, "undefined" != typeof h_params.show_office_choice && (show_office_choice = 0 === parseInt(h_params.show_office_choice) ? !1 : !0), !is_mobile && h_params.phone_icon && "1" == h_params.phone_icon && ("undefined" != typeof h_params.phoneicon_x && (phoneicon_x = h_params.phoneicon_x), "undefined" != typeof h_params.phoneicon_y && (phoneicon_y = h_params.phoneicon_y), "undefined" != typeof h_params.phone_icon_always && 1 == h_params.phone_icon_always && (phoneiconScrollOffset = 0), phoneDragObject = new dragObject("cbh_phone", null, new Position(0, 0), new Position(helpers.viewportSize().width - 200, helpers.viewportSize().height - 150), null, null, null, !1), drawPhone(), Object.prototype.toString.call(win.HTMLElement).indexOf("Constructor") > 0 || animatePhoneScroll(), $(win).on("resize", redrawPhone), distanceTracker.start()), !is_mobile && h_params.show_hello && "1" == h_params.show_hello && setTimeout(function() {
                dialogs.sayHello(), showWidget()
            }, 7e3);
            for (var j in h_params) h_params.hasOwnProperty(j) && j.match(/show_phone_/) && (default_phone[j.split("show_phone_")[1]] = h_params[j]);
            catchHash(), SCCore.server.send({
                tmp_visit: 1
            })
        }
    }

    function countPopupDelayTimer() {
        min_popup_delay--, 0 >= min_popup_delay && clearInterval(minPopupTimer)
    }

    function showByAvg() {
        if (avgTimerSec++, h_params.avg && h_params.avg && !(min_popup_delay > 0 || 5 > avgTimerSec) && avgTimerSec >= parseInt(h_params.avg) - 2) {
            if (clearInterval(avgTimer), !show_exit) return;
            if (!activity_exit_event) return;
            if (block_show_banner) return;
            if (block_auto_popup) return;
            showWidgetExit(!0)
        }
    }

    function callParents(a) {
        (new Image).src = "//mom.callbackhunter.com/make_call.php?phone_child=" + a.myPhone + "&phone_parent=" + a.parentsPhone
    }

    function doScale(a) {
        var b = {};
        b.elem = a.element, b.currentViewportWidth = win.innerWidth, b.currentViewportHeight = win.innerHeight, a.pos && (b.pos = a.pos), b.currentViewportWidth < b.currentViewportHeight ? (b.startElemWidth = b.elem.clientWidth || a.elemWidthPortrait, b.startElemHeight = b.elem.clientHeight || a.elemHeightPortrait, b.totalViewportWidth = a.viewportWidthPortrait, a.posPortrait && (b.pos = a.posPortrait)) : (b.startElemWidth = b.elem.clientWidth || a.elemWidthLandscape, b.startElemHeight = b.elem.clientHeight || a.elemHeightLandscape, b.totalViewportWidth = a.viewportWidthLandscape, a.posLandscape && (b.pos = a.posLandscape)), b.scale = b.currentViewportWidth / b.totalViewportWidth, b.resultElemWidth = b.scale * b.startElemWidth, b.resultElemHeight = b.scale * b.startElemHeight, b.positionCorrectionX = (b.resultElemWidth - b.startElemWidth) / 2, b.positionCorrectionY = (b.resultElemHeight - b.startElemHeight) / 2 - 5, b.elem.style.cssText += "-moz-transform: scale(" + b.scale + "," + b.scale + ");", b.elem.style.cssText += "-ms-transform: scale(" + b.scale + "," + b.scale + ");", b.elem.style.cssText += "-webkit-transform: scale(" + b.scale + "," + b.scale + ");", b.elem.style.cssText += "-o-transform: scale(" + b.scale + "," + b.scale + ");", b.elem.style.cssText += "transform: scale(" + b.scale + "," + b.scale + ");", void 0 != b.pos.right && (b.elem.style.cssText += "right:" + (b.pos.right * b.scale + b.positionCorrectionX) + "px !important;"), void 0 != b.pos.bottom && (b.elem.style.cssText += "bottom:" + (b.pos.bottom * b.scale + b.positionCorrectionY) + "px !important;"), void 0 != b.pos.left && (b.elem.style.cssText += "left:" + (b.pos.left * b.scale + b.positionCorrectionX) + "px !important;"), void 0 != b.pos.top && (b.elem.style.cssText += "top:" + (b.pos.top * b.scale + b.positionCorrectionY) + "px !important;")
    }

    function rescaleWidget() {
        doScale({
            element: doc.getElementById("cbh_mobile_widget"),
            elemWidthPortrait: 2450,
            elemHeightPortrait: 328,
            viewportWidthPortrait: 450,
            elemWidthLandscape: 2450,
            elemHeightLandscape: 328,
            viewportWidthLandscape: 1080,
            posPortrait: {
                bottom: -3,
                right: -1e3
            },
            posLandscape: {
                bottom: -3,
                right: -685
            }
        })
    }

    function rescalePhone() {
        doScale({
            element: doc.getElementById("cbh_mobile_phone_wrapper"),
            viewportWidthPortrait: 480,
            viewportWidthLandscape: 840,
            pos: {
                bottom: 30
            }
        })
    }

    function scalePhone() {
        rescalePhone(), $(doc).on("scroll", rescalePhone), $(win).on("resize", rescalePhone), $(doc).on("drag", rescalePhone)
    }

    function scaleWidget() {
        rescaleWidget(), $(doc).on("scroll", rescaleWidget), $(win).on("resize", rescaleWidget), $(doc).on("drag", rescaleWidget),
            function() {
                function a() {
                    var a = win.innerWidth;
                    b != a && (b = a, rescaleWidget())
                }
                var b = 0;
                zoomIntervalID = setInterval(a, 100)
            }()
    }

    function unscaleWidget() {
        $(doc).off("scroll", rescaleWidget), $(win).off("resize", rescaleWidget), $(doc).off("drag", rescaleWidget), clearInterval(zoomIntervalID), doc.getElementById("cbh_mobile_widget").style.cssText = ""
    }

    function catchManagerPhone() {
        var a = "",
            b = "",
            c = "",
            d = null;
        if (null === h_params) return "";
        if ("undefined" != typeof h_params.phone_track_enable && 1 == h_params.phone_track_enable)
            for (var e = ["calltouch_phone", "calltouch_phone_1", "calltouch_phone_2"], f = 0; f < e.length; f++)
                if ("string" == typeof win[e[f]]) return "+" + win[e[f]].replace(/[^0-9]/g, "");
        if ("string" != typeof h_params.phone_track_whereis) return "";
        if ("string" == typeof h_params.phone_track_prefix && (c = h_params.phone_track_prefix), a = h_params.phone_track_whereis, b = a.slice(0, 1), "." !== b && "#" !== b) return "";
        if ("#" === b) d = doc.getElementById(a.substring(1));
        else if ("." === b) {
            var g = doc.getElementsByClassName(a.substring(1));
            g && "undefined" != typeof g[0] && (d = g[0])
        }
        return d ? "+" + (c + (d.innerText || d.textContent)).replace(/[^0-9]/g, "") : ""
    }
    var define, module, linkify = function() {
        var a = "[a-z\\d.-]+://",
            b = "(?:(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])",
            c = "(?:(?:[^\\s!@#$%^&*()_=+[\\]{}\\\\|;:'\",.<>/?]+)\\.)+",
            d = "(?:ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|ms|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah|ye|yt|yu|za|zm|zw)",
            e = "(?:" + c + d + "|" + b + ")",
            f = "(?:[;/][^#?<>\\s]*)?",
            g = "(?:\\?[^#<>\\s]*)?(?:#[^<>\\s]*)?",
            h = "\\b" + a + "[^<>\\s]+",
            i = "\\b" + e + f + g + "(?!\\w)",
            j = "mailto:",
            k = "(?:" + j + ")?[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@" + e + g + "(?!\\w)",
            l = new RegExp("(?:" + h + "|" + i + "|" + k + ")", "ig"),
            m = new RegExp("^" + a, "i"),
            n = {
                "'": "`",
                ">": "<",
                ")": "(",
                "]": "[",
                "}": "{",
                "»": "«",
                "›": "‹"
            },
            o = {
                callback: function(a, b) {
                    return b ? '<a href="' + b + '" title="' + b + '">' + a + "</a>" : a
                },
                punct_regexp: /(?:[!?.,:;'"]|(?:&|&amp;)(?:lt|gt|quot|apos|raquo|laquo|rsaquo|lsaquo);)$/
            };
        return function(a, b) {
            b = b || {};
            var c, d, e, f, g, h, i, k, p, q, r, s, t = "",
                u = [];
            for (d in o) void 0 === b[d] && (b[d] = o[d]);
            for (; c = l.exec(a);)
                if (e = c[0], h = l.lastIndex, i = h - e.length, !/[\/:]/.test(a.charAt(i - 1))) {
                    do k = e, s = e.substr(-1), r = n[s], r && (p = e.match(new RegExp("\\" + r + "(?!$)", "g")), q = e.match(new RegExp("\\" + s, "g")), (p ? p.length : 0) < (q ? q.length : 0) && (e = e.substr(0, e.length - 1), h--)), b.punct_regexp && (e = e.replace(b.punct_regexp, function(a) {
                        return h -= a.length, ""
                    })); while (e.length && e !== k);
                    f = e, m.test(f) || (f = (-1 !== f.indexOf("@") ? f.indexOf(j) ? j : "" : f.indexOf("irc.") ? f.indexOf("ftp.") ? "http://" : "ftp://" : "irc://") + f), g != i && (u.push([a.slice(g, i)]), g = h), u.push([e, f])
                }
            for (u.push([a.substr(g)]), d = 0; d < u.length; d++) t += b.callback.apply(win, u[d]);
            return t || a
        }
    }();
    ! function(a, b, c) {
        "use strict";

        function d(a, b, c) {
            var d, e = a.runtimeStyle && a.runtimeStyle[b],
                f = a.style;
            return !/^-?[0-9]+\.?[0-9]*(?:px)?$/i.test(c) && /^-?\d/.test(c) && (d = f.left, e && (a.runtimeStyle.left = a.currentStyle.left), f.left = "fontSize" === b ? "1em" : c || 0, c = f.pixelLeft + "px", f.left = d, e && (a.runtimeStyle.left = e)), /^(thin|medium|thick)$/i.test(c) ? c : Math.round(parseFloat(c)) + "px"
        }

        function e(a) {
            return parseInt(a, 10)
        }

        function f(a, b, e, f) {
            if (a = (a || "").split(","), a = a[f || 0] || a[0] || "auto", a = l.Util.trimText(a).split(" "), "backgroundSize" !== e || a[0] && !a[0].match(/cover|contain|auto/)) {
                if (a[0] = -1 === a[0].indexOf("%") ? d(b, e + "X", a[0]) : a[0], a[1] === c) {
                    if ("backgroundSize" === e) return a[1] = "auto", a;
                    a[1] = a[0]
                }
                a[1] = -1 === a[1].indexOf("%") ? d(b, e + "Y", a[1]) : a[1]
            } else;
            return a
        }

        function g(a, b, c, d, e, f) {
            var g, h, i, j, k = l.Util.getCSS(b, a, e);
            if (1 === k.length && (j = k[0], k = [], k[0] = j, k[1] = j), -1 !== k[0].toString().indexOf("%")) i = parseFloat(k[0]) / 100, h = c.width * i, "backgroundSize" !== a && (h -= (f || d).width * i);
            else if ("backgroundSize" === a)
                if ("auto" === k[0]) h = d.width;
                else if (/contain|cover/.test(k[0])) {
                var m = l.Util.resizeBounds(d.width, d.height, c.width, c.height, k[0]);
                h = m.width, g = m.height
            } else h = parseInt(k[0], 10);
            else h = parseInt(k[0], 10);
            return "auto" === k[1] ? g = h / d.width * d.height : -1 !== k[1].toString().indexOf("%") ? (i = parseFloat(k[1]) / 100, g = c.height * i, "backgroundSize" !== a && (g -= (f || d).height * i)) : g = parseInt(k[1], 10), [h, g]
        }

        function h(a, b) {
            var c = [];
            return {
                storage: c,
                width: a,
                height: b,
                clip: function() {
                    c.push({
                        type: "function",
                        name: "clip",
                        arguments: arguments
                    })
                },
                translate: function() {
                    c.push({
                        type: "function",
                        name: "translate",
                        arguments: arguments
                    })
                },
                fill: function() {
                    c.push({
                        type: "function",
                        name: "fill",
                        arguments: arguments
                    })
                },
                save: function() {
                    c.push({
                        type: "function",
                        name: "save",
                        arguments: arguments
                    })
                },
                restore: function() {
                    c.push({
                        type: "function",
                        name: "restore",
                        arguments: arguments
                    })
                },
                fillRect: function() {
                    c.push({
                        type: "function",
                        name: "fillRect",
                        arguments: arguments
                    })
                },
                createPattern: function() {
                    c.push({
                        type: "function",
                        name: "createPattern",
                        arguments: arguments
                    })
                },
                drawShape: function() {
                    var a = [];
                    return c.push({
                        type: "function",
                        name: "drawShape",
                        arguments: a
                    }), {
                        moveTo: function() {
                            a.push({
                                name: "moveTo",
                                arguments: arguments
                            })
                        },
                        lineTo: function() {
                            a.push({
                                name: "lineTo",
                                arguments: arguments
                            })
                        },
                        arcTo: function() {
                            a.push({
                                name: "arcTo",
                                arguments: arguments
                            })
                        },
                        bezierCurveTo: function() {
                            a.push({
                                name: "bezierCurveTo",
                                arguments: arguments
                            })
                        },
                        quadraticCurveTo: function() {
                            a.push({
                                name: "quadraticCurveTo",
                                arguments: arguments
                            })
                        }
                    }
                },
                drawImage: function() {
                    c.push({
                        type: "function",
                        name: "drawImage",
                        arguments: arguments
                    })
                },
                fillText: function() {
                    c.push({
                        type: "function",
                        name: "fillText",
                        arguments: arguments
                    })
                },
                setVariable: function(a, b) {
                    return c.push({
                        type: "variable",
                        name: a,
                        arguments: b
                    }), b
                }
            }
        }

        function i(a) {
            return {
                zindex: a,
                children: []
            }
        }
        var j, k, l = {};
        l.Util = {}, l.Util.log = function(b) {
                l.logging && a.console && a.console.log && a.console.log(b)
            }, l.Util.trimText = function(a) {
                return function(b) {
                    return a ? a.apply(b) : ((b || "") + "").replace(/^\s+|\s+$/g, "")
                }
            }(String.prototype.trim), l.Util.asFloat = function(a) {
                return parseFloat(a)
            },
            function() {
                var a = /((rgba|rgb)\([^\)]+\)(\s-?\d+px){0,})/g,
                    b = /(-?\d+px)|(#.+)|(rgb\(.+\))|(rgba\(.+\))/g;
                l.Util.parseTextShadows = function(c) {
                    if (!c || "none" === c) return [];
                    for (var d = c.match(a), e = [], f = 0; d && f < d.length; f++) {
                        var g = d[f].match(b);
                        e.push({
                            color: g[0],
                            offsetX: g[1] ? g[1].replace("px", "") : 0,
                            offsetY: g[2] ? g[2].replace("px", "") : 0,
                            blur: g[3] ? g[3].replace("px", "") : 0
                        })
                    }
                    return e
                }
            }(), l.Util.parseBackgroundImage = function(a) {
                var b, c, d, e, f, g, h, i, j = " \r\n	",
                    k = [],
                    l = 0,
                    m = 0,
                    n = function() {
                        b && ('"' === c.substr(0, 1) && (c = c.substr(1, c.length - 2)), c && i.push(c), "-" === b.substr(0, 1) && (e = b.indexOf("-", 1) + 1) > 0 && (d = b.substr(0, e), b = b.substr(e)), k.push({
                            prefix: d,
                            method: b.toLowerCase(),
                            value: f,
                            args: i
                        })), i = [], b = d = c = f = ""
                    };
                n();
                for (var o = 0, p = a.length; p > o; o++)
                    if (g = a[o], !(0 === l && j.indexOf(g) > -1)) {
                        switch (g) {
                            case '"':
                                h ? h === g && (h = null) : h = g;
                                break;
                            case "(":
                                if (h) break;
                                if (0 === l) {
                                    l = 1, f += g;
                                    continue
                                }
                                m++;
                                break;
                            case ")":
                                if (h) break;
                                if (1 === l) {
                                    if (0 === m) {
                                        l = 0, f += g, n();
                                        continue
                                    }
                                    m--
                                }
                                break;
                            case ",":
                                if (h) break;
                                if (0 === l) {
                                    n();
                                    continue
                                }
                                if (1 === l && 0 === m && !b.match(/^url$/i)) {
                                    i.push(c), c = "", f += g;
                                    continue
                                }
                        }
                        f += g, 0 === l ? b += g : c += g
                    }
                return n(), k
            }, l.Util.Bounds = function(a) {
                var b, c = {};
                return a.getBoundingClientRect && (b = a.getBoundingClientRect(), c.top = b.top, c.bottom = b.bottom || b.top + b.height, c.left = b.left, c.width = a.offsetWidth, c.height = a.offsetHeight), c
            }, l.Util.OffsetBounds = function(a) {
                var b = a.offsetParent ? l.Util.OffsetBounds(a.offsetParent) : {
                    top: 0,
                    left: 0
                };
                return {
                    top: a.offsetTop + b.top,
                    bottom: a.offsetTop + a.offsetHeight + b.top,
                    left: a.offsetLeft + b.left,
                    width: a.offsetWidth,
                    height: a.offsetHeight
                }
            }, l.Util.getCSS = function(a, c, d) {
                j !== a && (k = b.defaultView.getComputedStyle(a, null));
                var g = k[c];
                if (/^background(Size|Position)$/.test(c)) return f(g, a, c, d);
                if (/border(Top|Bottom)(Left|Right)Radius/.test(c)) {
                    var h = g.split(" ");
                    return h.length <= 1 && (h[1] = h[0]), h.map(e)
                }
                return g
            }, l.Util.resizeBounds = function(a, b, c, d, e) {
                var f, g, h = c / d,
                    i = a / b;
                return e && "auto" !== e ? i > h ^ "contain" === e ? (g = d, f = d * i) : (f = c, g = c / i) : (f = c, g = d), {
                    width: f,
                    height: g
                }
            }, l.Util.BackgroundPosition = function(a, b, c, d, e) {
                var f = g("backgroundPosition", a, b, c, d, e);
                return {
                    left: f[0],
                    top: f[1]
                }
            }, l.Util.BackgroundSize = function(a, b, c, d) {
                var e = g("backgroundSize", a, b, c, d);
                return {
                    width: e[0],
                    height: e[1]
                }
            }, l.Util.Extend = function(a, b) {
                for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
                return b
            }, l.Util.Children = function(a) {
                var b;
                try {
                    b = a.nodeName && "IFRAME" === a.nodeName.toUpperCase() ? a.contentDocument || a.contentWindow.document : function(a) {
                        var b = [];
                        return null !== a && ! function(a, b) {
                            var d = a.length,
                                e = 0;
                            if ("number" == typeof b.length)
                                for (var f = b.length; f > e; e++) a[d++] = b[e];
                            else
                                for (; b[e] !== c;) a[d++] = b[e++];
                            return a.length = d, a
                        }(b, a), b
                    }(a.childNodes)
                } catch (d) {
                    l.Util.log("html2canvas.Util.Children failed with exception: " + d.message), b = []
                }
                return b
            }, l.Util.isTransparent = function(a) {
                return "transparent" === a || "rgba(0, 0, 0, 0)" === a
            }, l.Util.Font = function() {
                var a = {};
                return function(b, d, e) {
                    if (a[b + "-" + d] !== c) return a[b + "-" + d];
                    var f, g, h, i = e.createElement("div"),
                        j = e.createElement("img"),
                        k = e.createElement("span"),
                        l = "Hidden Text";
                    return i.style.visibility = "hidden", i.style.fontFamily = b, i.style.fontSize = d, i.style.margin = 0, i.style.padding = 0, e.body.appendChild(i), j.src = "data:image/gif;base64,R0lGODlhAQABAIABAP///wAAACwAAAAAAQABAAACAkQBADs=", j.width = 1, j.height = 1, j.style.margin = 0, j.style.padding = 0, j.style.verticalAlign = "baseline", k.style.fontFamily = b, k.style.fontSize = d, k.style.margin = 0, k.style.padding = 0, k.appendChild(e.createTextNode(l)), i.appendChild(k), i.appendChild(j), f = j.offsetTop - k.offsetTop + 1, i.removeChild(k), i.appendChild(e.createTextNode(l)), i.style.lineHeight = "normal", j.style.verticalAlign = "super", g = j.offsetTop - i.offsetTop + 1, h = {
                        baseline: f,
                        lineWidth: 1,
                        middle: g
                    }, a[b + "-" + d] = h, e.body.removeChild(i), h
                }
            }(),
            function() {
                function a(a) {
                    return function(b) {
                        try {
                            a.addColorStop(b.stop, b.color)
                        } catch (d) {
                            c.log(["failed to add color stop: ", d, "; tried to add: ", b])
                        }
                    }
                }
                var c = l.Util,
                    d = {};
                l.Generate = d;
                var e = [/^(-webkit-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-o-linear-gradient)\(([a-z\s]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-webkit-gradient)\((linear|radial),\s((?:\d{1,3}%?)\s(?:\d{1,3}%?),\s(?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)\-]+)\)$/, /^(-moz-linear-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?))([\w\d\.\s,%\(\)]+)\)$/, /^(-webkit-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/, /^(-moz-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s?([a-z\-]*)([\w\d\.\s,%\(\)]+)\)$/, /^(-o-radial-gradient)\(((?:\d{1,3}%?)\s(?:\d{1,3}%?)),\s(\w+)\s([a-z\-]+)([\w\d\.\s,%\(\)]+)\)$/];
                d.parseGradient = function(a, b) {
                    var c, d, f, g, h, i, j, k, l, m, n, o, p = e.length;
                    for (d = 0; p > d && !(f = a.match(e[d])); d += 1);
                    if (f) switch (f[1]) {
                        case "-webkit-linear-gradient":
                        case "-o-linear-gradient":
                            if (c = {
                                    type: "linear",
                                    x0: null,
                                    y0: null,
                                    x1: null,
                                    y1: null,
                                    colorStops: []
                                }, h = f[2].match(/\w+/g))
                                for (i = h.length, d = 0; i > d; d += 1) switch (h[d]) {
                                    case "top":
                                        c.y0 = 0, c.y1 = b.height;
                                        break;
                                    case "right":
                                        c.x0 = b.width, c.x1 = 0;
                                        break;
                                    case "bottom":
                                        c.y0 = b.height, c.y1 = 0;
                                        break;
                                    case "left":
                                        c.x0 = 0, c.x1 = b.width
                                }
                            if (null === c.x0 && null === c.x1 && (c.x0 = c.x1 = b.width / 2), null === c.y0 && null === c.y1 && (c.y0 = c.y1 = b.height / 2), h = f[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g))
                                for (i = h.length, j = 1 / Math.max(i - 1, 1), d = 0; i > d; d += 1) k = h[d].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/), k[2] ? (g = parseFloat(k[2]), g /= "%" === k[3] ? 100 : b.width) : g = d * j, c.colorStops.push({
                                    color: k[1],
                                    stop: g
                                });
                            break;
                        case "-webkit-gradient":
                            if (c = {
                                    type: "radial" === f[2] ? "circle" : f[2],
                                    x0: 0,
                                    y0: 0,
                                    x1: 0,
                                    y1: 0,
                                    colorStops: []
                                }, h = f[3].match(/(\d{1,3})%?\s(\d{1,3})%?,\s(\d{1,3})%?\s(\d{1,3})%?/), h && (c.x0 = h[1] * b.width / 100, c.y0 = h[2] * b.height / 100, c.x1 = h[3] * b.width / 100, c.y1 = h[4] * b.height / 100), h = f[4].match(/((?:from|to|color-stop)\((?:[0-9\.]+,\s)?(?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)\))+/g))
                                for (i = h.length, d = 0; i > d; d += 1) k = h[d].match(/(from|to|color-stop)\(([0-9\.]+)?(?:,\s)?((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\)/), g = parseFloat(k[2]), "from" === k[1] && (g = 0), "to" === k[1] && (g = 1), c.colorStops.push({
                                    color: k[3],
                                    stop: g
                                });
                            break;
                        case "-moz-linear-gradient":
                            if (c = {
                                    type: "linear",
                                    x0: 0,
                                    y0: 0,
                                    x1: 0,
                                    y1: 0,
                                    colorStops: []
                                }, h = f[2].match(/(\d{1,3})%?\s(\d{1,3})%?/), h && (c.x0 = h[1] * b.width / 100, c.y0 = h[2] * b.height / 100, c.x1 = b.width - c.x0, c.y1 = b.height - c.y0), h = f[3].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}%)?)+/g))
                                for (i = h.length, j = 1 / Math.max(i - 1, 1), d = 0; i > d; d += 1) k = h[d].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%)?/), k[2] ? (g = parseFloat(k[2]), k[3] && (g /= 100)) : g = d * j, c.colorStops.push({
                                    color: k[1],
                                    stop: g
                                });
                            break;
                        case "-webkit-radial-gradient":
                        case "-moz-radial-gradient":
                        case "-o-radial-gradient":
                            if (c = {
                                    type: "circle",
                                    x0: 0,
                                    y0: 0,
                                    x1: b.width,
                                    y1: b.height,
                                    cx: 0,
                                    cy: 0,
                                    rx: 0,
                                    ry: 0,
                                    colorStops: []
                                }, h = f[2].match(/(\d{1,3})%?\s(\d{1,3})%?/), h && (c.cx = h[1] * b.width / 100, c.cy = h[2] * b.height / 100), h = f[3].match(/\w+/), k = f[4].match(/[a-z\-]*/), h && k) switch (k[0]) {
                                case "farthest-corner":
                                case "cover":
                                case "":
                                    l = Math.sqrt(Math.pow(c.cx, 2) + Math.pow(c.cy, 2)), m = Math.sqrt(Math.pow(c.cx, 2) + Math.pow(c.y1 - c.cy, 2)), n = Math.sqrt(Math.pow(c.x1 - c.cx, 2) + Math.pow(c.y1 - c.cy, 2)), o = Math.sqrt(Math.pow(c.x1 - c.cx, 2) + Math.pow(c.cy, 2)), c.rx = c.ry = Math.max(l, m, n, o);
                                    break;
                                case "closest-corner":
                                    l = Math.sqrt(Math.pow(c.cx, 2) + Math.pow(c.cy, 2)), m = Math.sqrt(Math.pow(c.cx, 2) + Math.pow(c.y1 - c.cy, 2)), n = Math.sqrt(Math.pow(c.x1 - c.cx, 2) + Math.pow(c.y1 - c.cy, 2)), o = Math.sqrt(Math.pow(c.x1 - c.cx, 2) + Math.pow(c.cy, 2)), c.rx = c.ry = Math.min(l, m, n, o);
                                    break;
                                case "farthest-side":
                                    "circle" === h[0] ? c.rx = c.ry = Math.max(c.cx, c.cy, c.x1 - c.cx, c.y1 - c.cy) : (c.type = h[0], c.rx = Math.max(c.cx, c.x1 - c.cx), c.ry = Math.max(c.cy, c.y1 - c.cy));
                                    break;
                                case "closest-side":
                                case "contain":
                                    "circle" === h[0] ? c.rx = c.ry = Math.min(c.cx, c.cy, c.x1 - c.cx, c.y1 - c.cy) : (c.type = h[0], c.rx = Math.min(c.cx, c.x1 - c.cx), c.ry = Math.min(c.cy, c.y1 - c.cy))
                            }
                            if (h = f[5].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\)(?:\s\d{1,3}(?:%|px))?)+/g))
                                for (i = h.length, j = 1 / Math.max(i - 1, 1), d = 0; i > d; d += 1) k = h[d].match(/((?:rgb|rgba)\(\d{1,3},\s\d{1,3},\s\d{1,3}(?:,\s[0-9\.]+)?\))\s*(\d{1,3})?(%|px)?/), k[2] ? (g = parseFloat(k[2]), g /= "%" === k[3] ? 100 : b.width) : g = d * j, c.colorStops.push({
                                    color: k[1],
                                    stop: g
                                })
                    }
                    return c
                }, d.Gradient = function(c, d) {
                    if (0 !== d.width && 0 !== d.height) {
                        var e, f, g = b.createElement("canvas"),
                            h = g.getContext("2d");
                        if (g.width = d.width, g.height = d.height, e = l.Generate.parseGradient(c, d)) switch (e.type) {
                            case "linear":
                                f = h.createLinearGradient(e.x0, e.y0, e.x1, e.y1), e.colorStops.forEach(a(f)), h.fillStyle = f, h.fillRect(0, 0, d.width, d.height);
                                break;
                            case "circle":
                                f = h.createRadialGradient(e.cx, e.cy, 0, e.cx, e.cy, e.rx), e.colorStops.forEach(a(f)), h.fillStyle = f, h.fillRect(0, 0, d.width, d.height);
                                break;
                            case "ellipse":
                                var i = b.createElement("canvas"),
                                    j = i.getContext("2d"),
                                    k = Math.max(e.rx, e.ry),
                                    m = 2 * k;
                                i.width = i.height = m, f = j.createRadialGradient(e.rx, e.ry, 0, e.rx, e.ry, k), e.colorStops.forEach(a(f)), j.fillStyle = f, j.fillRect(0, 0, m, m), h.fillStyle = e.colorStops[e.colorStops.length - 1].color, h.fillRect(0, 0, g.width, g.height), h.drawImage(i, e.cx - e.rx, e.cy - e.ry, 2 * e.rx, 2 * e.ry)
                        }
                        return g
                    }
                }, d.ListAlpha = function(a) {
                    var b, c = "";
                    do b = a % 26, c = String.fromCharCode(b + 64) + c, a /= 26; while (26 * a > 26);
                    return c
                }, d.ListRoman = function(a) {
                    var b, c = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"],
                        d = [1e3, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1],
                        e = "",
                        f = c.length;
                    if (0 >= a || a >= 4e3) return a;
                    for (b = 0; f > b; b += 1)
                        for (; a >= d[b];) a -= d[b], e += c[b];
                    return e
                }
            }(), l.Parse = function(d, e) {
                function f() {
                    return Math.max(Math.max(ka.body.scrollWidth, ka.documentElement.scrollWidth), Math.max(ka.body.offsetWidth, ka.documentElement.offsetWidth), Math.max(ka.body.clientWidth, ka.documentElement.clientWidth))
                }

                function g() {
                    return Math.max(Math.max(ka.body.scrollHeight, ka.documentElement.scrollHeight), Math.max(ka.body.offsetHeight, ka.documentElement.offsetHeight), Math.max(ka.body.clientHeight, ka.documentElement.clientHeight))
                }

                function j(a, b) {
                    var c = parseInt(pa(a, b), 10);
                    return isNaN(c) ? 0 : c
                }

                function k(a, b, c, d, e, f) {
                    "transparent" !== f && (a.setVariable("fillStyle", f), a.fillRect(b, c, d, e), ja += 1)
                }

                function m(a, b, c) {
                    return a.length > 0 ? b + c.toUpperCase() : void 0
                }

                function n(a, b) {
                    switch (b) {
                        case "lowercase":
                            return a.toLowerCase();
                        case "capitalize":
                            return a.replace(/(^|\s|:|-|\(|\))([a-z])/g, m);
                        case "uppercase":
                            return a.toUpperCase();
                        default:
                            return a
                    }
                }

                function o(a) {
                    return /^(normal|none|0px)$/.test(a)
                }

                function p(a, b, c, d) {
                    null !== a && la.trimText(a).length > 0 && (d.fillText(a, b, c), ja += 1)
                }

                function q(a, b, c, d) {
                    var e = !1,
                        f = pa(b, "fontWeight"),
                        g = pa(b, "fontFamily"),
                        h = pa(b, "fontSize"),
                        i = la.parseTextShadows(pa(b, "textShadow"));
                    switch (parseInt(f, 10)) {
                        case 401:
                            f = "bold";
                            break;
                        case 400:
                            f = "normal"
                    }
                    return a.setVariable("fillStyle", d), a.setVariable("font", [pa(b, "fontStyle"), pa(b, "fontVariant"), f, h, g].join(" ")), a.setVariable("textAlign", e ? "right" : "left"), i.length && (a.setVariable("shadowColor", i[0].color), a.setVariable("shadowOffsetX", i[0].offsetX), a.setVariable("shadowOffsetY", i[0].offsetY), a.setVariable("shadowBlur", i[0].blur)), "none" !== c ? la.Font(g, h, ka) : void 0
                }

                function r(a, b, c, d, e) {
                    switch (b) {
                        case "underline":
                            k(a, c.left, Math.round(c.top + d.baseline + d.lineWidth), c.width, 1, e);
                            break;
                        case "overline":
                            k(a, c.left, Math.round(c.top), c.width, 1, e);
                            break;
                        case "line-through":
                            k(a, c.left, Math.ceil(c.top + d.middle + d.lineWidth), c.width, 1, e)
                    }
                }

                function s(a, b, c, d, e) {
                    var f;
                    if (ma.rangeBounds && !e)("none" !== c || 0 !== la.trimText(b).length) && (f = t(b, a.node, a.textOffset)), a.textOffset += b.length;
                    else if (a.node && "string" == typeof a.node.nodeValue) {
                        var g = d ? a.node.splitText(b.length) : null;
                        f = u(a.node, e), a.node = g
                    }
                    return f
                }

                function t(a, b, c) {
                    var d = ka.createRange();
                    return d.setStart(b, c), d.setEnd(b, c + a.length), d.getBoundingClientRect()
                }

                function u(a, b) {
                    var c = a.parentNode,
                        d = ka.createElement("wrapper"),
                        e = a.cloneNode(!0);
                    d.appendChild(a.cloneNode(!0)), c.replaceChild(d, a);
                    var f = b ? la.OffsetBounds(d) : la.Bounds(d);
                    return c.replaceChild(e, d), f
                }

                function v(a, b, c) {
                    var d, f, g = c.ctx,
                        h = pa(a, "color"),
                        i = pa(a, "textDecoration"),
                        j = pa(a, "textAlign"),
                        k = {
                            node: b,
                            textOffset: 0
                        };
                    la.trimText(b.nodeValue).length > 0 && (b.nodeValue = n(b.nodeValue, pa(a, "textTransform")), j = j.replace(["-webkit-auto"], ["auto"]), f = !e.letterRendering && /^(left|right|justify|auto)$/.test(j) && o(pa(a, "letterSpacing")) ? b.nodeValue.split(/(\b| )/) : b.nodeValue.split(""), d = q(g, a, i, h), e.chinese && f.forEach(function(a, b) {
                        /.*[\u4E00-\u9FA5].*$/.test(a) && (a = a.split(""), a.unshift(b, 1), f.splice.apply(f, a))
                    }), f.forEach(function(a, b) {
                        var e = s(k, a, i, b < f.length - 1, c.transform.matrix);
                        e && (p(a, e.left, e.bottom, g), r(g, i, e, d, h))
                    }))
                }

                function w(a, b) {
                    var c, d, e = ka.createElement("boundelement");
                    return e.style.display = "inline", c = a.style.listStyleType, a.style.listStyleType = "none", e.appendChild(ka.createTextNode(b)), a.insertBefore(e, a.firstChild), d = la.Bounds(e), a.removeChild(e), a.style.listStyleType = c, d
                }

                function x(a) {
                    var b = -1,
                        c = 1,
                        d = a.parentNode.childNodes;
                    if (a.parentNode) {
                        for (; d[++b] !== a;) 1 === d[b].nodeType && c++;
                        return c
                    }
                    return -1
                }

                function y(a, b) {
                    var c, d = x(a);
                    switch (b) {
                        case "decimal":
                            c = d;
                            break;
                        case "decimal-leading-zero":
                            c = 1 === d.toString().length ? d = "0" + d.toString() : d.toString();
                            break;
                        case "upper-roman":
                            c = l.Generate.ListRoman(d);
                            break;
                        case "lower-roman":
                            c = l.Generate.ListRoman(d).toLowerCase();
                            break;
                        case "lower-alpha":
                            c = l.Generate.ListAlpha(d).toLowerCase();
                            break;
                        case "upper-alpha":
                            c = l.Generate.ListAlpha(d)
                    }
                    return c + ". "
                }

                function z(a, b, c) {
                    var d, e, f, g = b.ctx,
                        h = pa(a, "listStyleType");
                    if (/^(decimal|decimal-leading-zero|upper-alpha|upper-latin|upper-roman|lower-alpha|lower-greek|lower-latin|lower-roman)$/i.test(h)) {
                        if (e = y(a, h), f = w(a, e), q(g, a, "none", pa(a, "color")), "inside" !== pa(a, "listStylePosition")) return;
                        g.setVariable("textAlign", "left"), d = c.left, p(e, d, f.bottom, g)
                    }
                }

                function A(a) {
                    var b = d[a];
                    return b && b.succeeded === !0 ? b.img : !1
                }

                function B(a, b) {
                    var c = Math.max(a.left, b.left),
                        d = Math.max(a.top, b.top),
                        e = Math.min(a.left + a.width, b.left + b.width),
                        f = Math.min(a.top + a.height, b.top + b.height);
                    return {
                        left: c,
                        top: d,
                        width: e - c,
                        height: f - d
                    }
                }

                function C(a, b, c) {
                    var d, e = "static" !== b.cssPosition,
                        f = e ? pa(a, "zIndex") : "auto",
                        g = pa(a, "opacity"),
                        h = "none" !== pa(a, "cssFloat");
                    b.zIndex = d = i(f), d.isPositioned = e, d.isFloated = h, d.opacity = g, d.ownStacking = "auto" !== f || 1 > g, c && c.zIndex.children.push(b)
                }

                function D(a, b, c, d, e) {
                    var f = j(b, "paddingLeft"),
                        g = j(b, "paddingTop"),
                        h = j(b, "paddingRight"),
                        i = j(b, "paddingBottom");
                    P(a, c, 0, 0, c.width, c.height, d.left + f + e[3].width, d.top + g + e[0].width, d.width - (e[1].width + e[3].width + f + h), d.height - (e[0].width + e[2].width + g + i))
                }

                function E(a) {
                    return ["Top", "Right", "Bottom", "Left"].map(function(b) {
                        return {
                            width: j(a, "border" + b + "Width"),
                            color: pa(a, "border" + b + "Color")
                        }
                    })
                }

                function F(a) {
                    return ["TopLeft", "TopRight", "BottomRight", "BottomLeft"].map(function(b) {
                        return pa(a, "border" + b + "Radius")
                    })
                }

                function G(a, b, c, d) {
                    var e = function(a, b, c) {
                        return {
                            x: a.x + (b.x - a.x) * c,
                            y: a.y + (b.y - a.y) * c
                        }
                    };
                    return {
                        start: a,
                        startControl: b,
                        endControl: c,
                        end: d,
                        subdivide: function(f) {
                            var g = e(a, b, f),
                                h = e(b, c, f),
                                i = e(c, d, f),
                                j = e(g, h, f),
                                k = e(h, i, f),
                                l = e(j, k, f);
                            return [G(a, g, j, l), G(l, k, i, d)]
                        },
                        curveTo: function(a) {
                            a.push(["bezierCurve", b.x, b.y, c.x, c.y, d.x, d.y])
                        },
                        curveToReversed: function(d) {
                            d.push(["bezierCurve", c.x, c.y, b.x, b.y, a.x, a.y])
                        }
                    }
                }

                function H(a, b, c, d, e, f, g) {
                    b[0] > 0 || b[1] > 0 ? (a.push(["line", d[0].start.x, d[0].start.y]), d[0].curveTo(a), d[1].curveTo(a)) : a.push(["line", f, g]), (c[0] > 0 || c[1] > 0) && a.push(["line", e[0].start.x, e[0].start.y])
                }

                function I(a, b, c, d, e, f, g) {
                    var h = [];
                    return b[0] > 0 || b[1] > 0 ? (h.push(["line", d[1].start.x, d[1].start.y]), d[1].curveTo(h)) : h.push(["line", a.c1[0], a.c1[1]]), c[0] > 0 || c[1] > 0 ? (h.push(["line", f[0].start.x, f[0].start.y]), f[0].curveTo(h), h.push(["line", g[0].end.x, g[0].end.y]), g[0].curveToReversed(h)) : (h.push(["line", a.c2[0], a.c2[1]]), h.push(["line", a.c3[0], a.c3[1]])), b[0] > 0 || b[1] > 0 ? (h.push(["line", e[1].end.x, e[1].end.y]), e[1].curveToReversed(h)) : h.push(["line", a.c4[0], a.c4[1]]), h
                }

                function J(a, b, c) {
                    var d = a.left,
                        e = a.top,
                        f = a.width,
                        g = a.height,
                        h = b[0][0],
                        i = b[0][1],
                        j = b[1][0],
                        k = b[1][1],
                        l = b[2][0],
                        m = b[2][1],
                        n = b[3][0],
                        o = b[3][1],
                        p = f - j,
                        q = g - m,
                        r = f - l,
                        s = g - o;
                    return {
                        topLeftOuter: sa(d, e, h, i).topLeft.subdivide(.5),
                        topLeftInner: sa(d + c[3].width, e + c[0].width, Math.max(0, h - c[3].width), Math.max(0, i - c[0].width)).topLeft.subdivide(.5),
                        topRightOuter: sa(d + p, e, j, k).topRight.subdivide(.5),
                        topRightInner: sa(d + Math.min(p, f + c[3].width), e + c[0].width, p > f + c[3].width ? 0 : j - c[3].width, k - c[0].width).topRight.subdivide(.5),
                        bottomRightOuter: sa(d + r, e + q, l, m).bottomRight.subdivide(.5),
                        bottomRightInner: sa(d + Math.min(r, f + c[3].width), e + Math.min(q, g + c[0].width), Math.max(0, l - c[1].width), Math.max(0, m - c[2].width)).bottomRight.subdivide(.5),
                        bottomLeftOuter: sa(d, e + s, n, o).bottomLeft.subdivide(.5),
                        bottomLeftInner: sa(d + c[3].width, e + s, Math.max(0, n - c[3].width), Math.max(0, o - c[2].width)).bottomLeft.subdivide(.5)
                    }
                }

                function K(a, b, c, d, e) {
                    var f = pa(a, "backgroundClip"),
                        g = [];
                    switch (f) {
                        case "content-box":
                        case "padding-box":
                            H(g, d[0], d[1], b.topLeftInner, b.topRightInner, e.left + c[3].width, e.top + c[0].width), H(g, d[1], d[2], b.topRightInner, b.bottomRightInner, e.left + e.width - c[1].width, e.top + c[0].width), H(g, d[2], d[3], b.bottomRightInner, b.bottomLeftInner, e.left + e.width - c[1].width, e.top + e.height - c[2].width), H(g, d[3], d[0], b.bottomLeftInner, b.topLeftInner, e.left + c[3].width, e.top + e.height - c[2].width);
                            break;
                        default:
                            H(g, d[0], d[1], b.topLeftOuter, b.topRightOuter, e.left, e.top), H(g, d[1], d[2], b.topRightOuter, b.bottomRightOuter, e.left + e.width, e.top), H(g, d[2], d[3], b.bottomRightOuter, b.bottomLeftOuter, e.left + e.width, e.top + e.height), H(g, d[3], d[0], b.bottomLeftOuter, b.topLeftOuter, e.left, e.top + e.height)
                    }
                    return g
                }

                function L(a, b, c) {
                    var d, e, f, g, h, i, j = b.left,
                        k = b.top,
                        l = b.width,
                        m = b.height,
                        n = F(a),
                        o = J(b, n, c),
                        p = {
                            clip: K(a, o, c, n, b),
                            borders: []
                        };
                    for (d = 0; 4 > d; d++)
                        if (c[d].width > 0) {
                            switch (e = j, f = k, g = l, h = m - c[2].width, d) {
                                case 0:
                                    h = c[0].width, i = I({
                                        c1: [e, f],
                                        c2: [e + g, f],
                                        c3: [e + g - c[1].width, f + h],
                                        c4: [e + c[3].width, f + h]
                                    }, n[0], n[1], o.topLeftOuter, o.topLeftInner, o.topRightOuter, o.topRightInner);
                                    break;
                                case 1:
                                    e = j + l - c[1].width, g = c[1].width, i = I({
                                        c1: [e + g, f],
                                        c2: [e + g, f + h + c[2].width],
                                        c3: [e, f + h],
                                        c4: [e, f + c[0].width]
                                    }, n[1], n[2], o.topRightOuter, o.topRightInner, o.bottomRightOuter, o.bottomRightInner);
                                    break;
                                case 2:
                                    f = f + m - c[2].width, h = c[2].width, i = I({
                                        c1: [e + g, f + h],
                                        c2: [e, f + h],
                                        c3: [e + c[3].width, f],
                                        c4: [e + g - c[3].width, f]
                                    }, n[2], n[3], o.bottomRightOuter, o.bottomRightInner, o.bottomLeftOuter, o.bottomLeftInner);
                                    break;
                                case 3:
                                    g = c[3].width, i = I({
                                        c1: [e, f + h + c[2].width],
                                        c2: [e, f],
                                        c3: [e + g, f + c[0].width],
                                        c4: [e + g, f + h]
                                    }, n[3], n[0], o.bottomLeftOuter, o.bottomLeftInner, o.topLeftOuter, o.topLeftInner)
                            }
                            p.borders.push({
                                args: i,
                                color: c[d].color
                            })
                        }
                    return p
                }

                function M(a, b) {
                    var c = a.drawShape();
                    return b.forEach(function(a, b) {
                        c[0 === b ? "moveTo" : a[0] + "To"].apply(null, a.slice(1))
                    }), c
                }

                function N(a, b, c) {
                    "transparent" !== c && (a.setVariable("fillStyle", c), M(a, b), a.fill(), ja += 1)
                }

                function O(a, b, c) {
                    var d, e, f = ka.createElement("valuewrap"),
                        g = ["lineHeight", "textAlign", "fontFamily", "color", "fontSize", "paddingLeft", "paddingTop", "width", "height", "border", "borderLeftWidth", "borderTopWidth"];
                    g.forEach(function(b) {
                        try {
                            f.style[b] = pa(a, b)
                        } catch (c) {
                            la.log("html2canvas: Parse: Exception caught in renderFormValue: " + c.message)
                        }
                    }), f.style.borderColor = "black", f.style.borderStyle = "solid", f.style.display = "block", f.style.position = "absolute", (/^(submit|reset|button|text|password)$/.test(a.type) || "SELECT" === a.nodeName) && (f.style.lineHeight = pa(a, "height")), f.style.top = b.top + "px", f.style.left = b.left + "px", d = "SELECT" === a.nodeName ? (a.options[a.selectedIndex] || 0).text : a.value, d || (d = a.placeholder), e = ka.createTextNode(d), f.appendChild(e), oa.appendChild(f), v(a, e, c), oa.removeChild(f)
                }

                function P(a) {
                    a.drawImage.apply(a, Array.prototype.slice.call(arguments, 1)), ja += 1
                }

                function Q(c, d) {
                    var e = a.getComputedStyle(c, d);
                    if (e && e.content && "none" !== e.content && "-moz-alt-content" !== e.content && "none" !== e.display) {
                        var f = e.content + "",
                            g = f.substr(0, 1);
                        g === f.substr(f.length - 1) && g.match(/'|"/) && (f = f.substr(1, f.length - 2));
                        var h = "url" === f.substr(0, 3),
                            i = b.createElement(h ? "img" : "span");
                        return i.className = qa + "-before " + qa + "-after", Object.keys(e).filter(R).forEach(function(a) {
                            try {
                                i.style[a] = e[a]
                            } catch (b) {
                                la.log(["Tried to assign readonly property ", a, "Error:", b])
                            }
                        }), h ? i.src = la.parseBackgroundImage(f)[0].args[0] : i.innerHTML = f, i
                    }
                }

                function R(b) {
                    return isNaN(a.parseInt(b, 10))
                }

                function S(a, b) {
                    var c = Q(a, ":before"),
                        d = Q(a, ":after");
                    (c || d) && (c && (a.className += " " + qa + "-before", a.parentNode.insertBefore(c, a), fa(c, b, !0), a.parentNode.removeChild(c), a.className = a.className.replace(qa + "-before", "").trim()), d && (a.className += " " + qa + "-after", a.appendChild(d), fa(d, b, !0), a.removeChild(d), a.className = a.className.replace(qa + "-after", "").trim()))
                }

                function T(a, b, c, d) {
                    var e = Math.round(d.left + c.left),
                        f = Math.round(d.top + c.top);
                    a.createPattern(b), a.translate(e, f), a.fill(), a.translate(-e, -f)
                }

                function U(a, b, c, d, e, f, g, h) {
                    var i = [];
                    i.push(["line", Math.round(e), Math.round(f)]), i.push(["line", Math.round(e + g), Math.round(f)]), i.push(["line", Math.round(e + g), Math.round(h + f)]), i.push(["line", Math.round(e), Math.round(h + f)]), M(a, i), a.save(), a.clip(), T(a, b, c, d), a.restore()
                }

                function V(a, b, c) {
                    k(a, b.left, b.top, b.width, b.height, c)
                }

                function W(a, b, c, d, e) {
                    var f = la.BackgroundSize(a, b, d, e),
                        g = la.BackgroundPosition(a, b, d, e, f),
                        h = pa(a, "backgroundRepeat").split(",").map(la.trimText);
                    switch (d = Y(d, f), h = h[e] || h[0]) {
                        case "repeat-x":
                            U(c, d, g, b, b.left, b.top + g.top, 99999, d.height);
                            break;
                        case "repeat-y":
                            U(c, d, g, b, b.left + g.left, b.top, d.width, 99999);
                            break;
                        case "no-repeat":
                            U(c, d, g, b, b.left + g.left, b.top + g.top, d.width, d.height);
                            break;
                        default:
                            T(c, d, g, {
                                top: b.top,
                                left: b.left,
                                width: d.width,
                                height: d.height
                            })
                    }
                }

                function X(a, b, c) {
                    for (var d, e = pa(a, "backgroundImage"), f = la.parseBackgroundImage(e), g = f.length; g--;)
                        if (e = f[g], e.args && 0 !== e.args.length) {
                            var h = "url" === e.method ? e.args[0] : e.value;
                            d = A(h), d ? W(a, b, c, d, g) : la.log("html2canvas: Error loading background:", e)
                        }
                }

                function Y(a, b) {
                    if (a.width === b.width && a.height === b.height) return a;
                    var c, d = ka.createElement("canvas");
                    return d.width = b.width, d.height = b.height, c = d.getContext("2d"), P(c, a, 0, 0, a.width, a.height, 0, 0, b.width, b.height), d
                }

                function Z(a, b, c) {
                    return a.setVariable("globalAlpha", pa(b, "opacity") * (c ? c.opacity : 1))
                }

                function $(a) {
                    return a.replace("px", "")
                }

                function _(a, b) {
                    var c = pa(a, "transform") || pa(a, "-webkit-transform") || pa(a, "-moz-transform") || pa(a, "-ms-transform") || pa(a, "-o-transform"),
                        d = pa(a, "transform-origin") || pa(a, "-webkit-transform-origin") || pa(a, "-moz-transform-origin") || pa(a, "-ms-transform-origin") || pa(a, "-o-transform-origin") || "0px 0px";
                    d = d.split(" ").map($).map(la.asFloat);
                    var e;
                    if (c && "none" !== c) {
                        var f = c.match(ta);
                        if (f) switch (f[1]) {
                            case "matrix":
                                e = f[2].split(",").map(la.trimText).map(la.asFloat)
                        }
                    }
                    return {
                        origin: d,
                        matrix: e
                    }
                }

                function aa(a, b, c, d) {
                    var i = h(b ? c.width : f(), b ? c.height : g()),
                        j = {
                            ctx: i,
                            opacity: Z(i, a, b),
                            cssPosition: pa(a, "position"),
                            borders: E(a),
                            transform: d,
                            clip: b && b.clip ? la.Extend({}, b.clip) : null
                        };
                    return C(a, j, b), e.useOverflow === !0 && /(hidden|scroll|auto)/.test(pa(a, "overflow")) === !0 && /(BODY)/i.test(a.nodeName) === !1 && (j.clip = j.clip ? B(j.clip, c) : c), j
                }

                function ba(a, b, c) {
                    var d = {
                        left: b.left + a[3].width,
                        top: b.top + a[0].width,
                        width: b.width - (a[1].width + a[3].width),
                        height: b.height - (a[0].width + a[2].width)
                    };
                    return c && (d = B(d, c)), d
                }

                function ca(a, b) {
                    var c = b.matrix ? la.OffsetBounds(a) : la.Bounds(a);
                    return b.origin[0] += c.left, b.origin[1] += c.top, c
                }

                function da(a, b, c, d) {
                    var e, f = _(a, b),
                        g = ca(a, f),
                        h = aa(a, b, g, f),
                        i = h.borders,
                        j = h.ctx,
                        k = ba(i, g, h.clip),
                        l = L(a, g, i),
                        m = na.test(a.nodeName) ? "#efefef" : pa(a, "backgroundColor");
                    switch (M(j, l.clip), j.save(), j.clip(), k.height > 0 && k.width > 0 && !d ? (V(j, g, m), X(a, k, j)) : d && (h.backgroundColor = m), j.restore(), l.borders.forEach(function(a) {
                        N(j, a.args, a.color)
                    }), c || S(a, h), a.nodeName) {
                        case "IMG":
                            (e = A(a.getAttribute("src"))) ? D(j, a, e, g, i): la.log("html2canvas: Error loading <img>:" + a.getAttribute("src"));
                            break;
                        case "INPUT":
                            /^(text|url|email|submit|button|reset)$/.test(a.type) && (a.value || a.placeholder || "").length > 0 && O(a, g, h);
                            break;
                        case "TEXTAREA":
                            (a.value || a.placeholder || "").length > 0 && O(a, g, h);
                            break;
                        case "SELECT":
                            (a.options || a.placeholder || "").length > 0 && O(a, g, h);
                            break;
                        case "LI":
                            z(a, h, k);
                            break;
                        case "CANVAS":
                            D(j, a, a, g, i)
                    }
                    return h
                }

                function ea(a) {
                    return "none" !== pa(a, "display") && "hidden" !== pa(a, "visibility") && !a.hasAttribute("data-html2canvas-ignore")
                }

                function fa(a, b, c) {
                    ea(a) && (b = da(a, b, c, !1) || b, na.test(a.nodeName) || ga(a, b, c))
                }

                function ga(a, b, c) {
                    la.Children(a).forEach(function(d) {
                        d.nodeType === d.ELEMENT_NODE ? fa(d, b, c) : d.nodeType === d.TEXT_NODE && v(a, d, b)
                    })
                }

                function ha() {
                    var a = pa(b.documentElement, "backgroundColor"),
                        c = la.isTransparent(a) && ia === b.body,
                        d = da(ia, null, !1, c);
                    return ga(ia, d), c && (a = d.backgroundColor), oa.removeChild(ra), {
                        backgroundColor: a,
                        stack: d
                    }
                }
                a.scroll(0, 0);
                var ia = e.elements === c ? b.body : e.elements[0],
                    ja = 0,
                    ka = ia.ownerDocument,
                    la = l.Util,
                    ma = la.Support(e, ka),
                    na = new RegExp("(" + e.ignoreElements + ")"),
                    oa = ka.body,
                    pa = la.getCSS,
                    qa = "___html2canvas___pseudoelement",
                    ra = ka.createElement("style");
                ra.innerHTML = "." + qa + '-before:before { content: "" !important; display: none !important; }.' + qa + '-after:after { content: "" !important; display: none !important; }', oa.appendChild(ra), d = d || {};
                var sa = function(a) {
                        return function(b, c, d, e) {
                            var f = d * a,
                                g = e * a,
                                h = b + d,
                                i = c + e;
                            return {
                                topLeft: G({
                                    x: b,
                                    y: i
                                }, {
                                    x: b,
                                    y: i - g
                                }, {
                                    x: h - f,
                                    y: c
                                }, {
                                    x: h,
                                    y: c
                                }),
                                topRight: G({
                                    x: b,
                                    y: c
                                }, {
                                    x: b + f,
                                    y: c
                                }, {
                                    x: h,
                                    y: i - g
                                }, {
                                    x: h,
                                    y: i
                                }),
                                bottomRight: G({
                                    x: h,
                                    y: c
                                }, {
                                    x: h,
                                    y: c + g
                                }, {
                                    x: b + f,
                                    y: i
                                }, {
                                    x: b,
                                    y: i
                                }),
                                bottomLeft: G({
                                    x: h,
                                    y: i
                                }, {
                                    x: h - f,
                                    y: i
                                }, {
                                    x: b,
                                    y: c + g
                                }, {
                                    x: b,
                                    y: c
                                })
                            }
                        }
                    }(4 * ((Math.sqrt(2) - 1) / 3)),
                    ta = /(matrix)\((.+)\)/;
                return ha()
            }, l.Preload = function(d) {
                function e(a) {
                    A.href = a, A.href = A.href;
                    var b = A.protocol + A.host;
                    return b === p
                }

                function f() {
                    u.log("html2canvas: start: images: " + t.numLoaded + " / " + t.numTotal + " (failed: " + t.numFailed + ")"), !t.firstRun && t.numLoaded >= t.numTotal && (u.log("Finished loading images: # " + t.numTotal + " (failed: " + t.numFailed + ")"), "function" == typeof d.complete && d.complete(t))
                }

                function g(b, e, g) {
                    var h, i, j = d.proxy;
                    A.href = b, b = A.href, h = "html2canvas_" + v++, g.callbackname = h, j += j.indexOf("?") > -1 ? "&" : "?", j += "url=" + encodeURIComponent(b) + "&callback=" + h, i = x.createElement("script"), a[h] = function(b) {
                        "error:" === b.substring(0, 6) ? (g.succeeded = !1, t.numLoaded++, t.numFailed++, f()) : (o(e, g), e.src = b), a[h] = c;
                        try {
                            delete a[h]
                        } catch (d) {}
                        i.parentNode.removeChild(i), i = null, delete g.script, delete g.callbackname
                    }, i.setAttribute("type", "text/javascript"), i.setAttribute("src", j), g.script = i, a.document.body.appendChild(i)
                }

                function h(b, c) {
                    var d = a.getComputedStyle(b, c),
                        e = d.content;
                    "url" === e.substr(0, 3) && q.loadImage(l.Util.parseBackgroundImage(e)[0].args[0]), m(d.backgroundImage, b)
                }

                function i(a) {
                    h(a, ":before"), h(a, ":after")
                }

                function j(a, b) {
                    var d = l.Generate.Gradient(a, b);
                    d !== c && (t[a] = {
                        img: d,
                        succeeded: !0
                    }, t.numTotal++, t.numLoaded++, f())
                }

                function k(a) {
                    return a && a.method && a.args && a.args.length > 0
                }

                function m(a, b) {
                    var d;
                    l.Util.parseBackgroundImage(a).filter(k).forEach(function(a) {
                        "url" === a.method ? q.loadImage(a.args[0]) : a.method.match(/\-?gradient$/) && (d === c && (d = l.Util.Bounds(b)), j(a.value, d))
                    })
                }

                function n(a) {
                    var b = !1;
                    try {
                        u.Children(a).forEach(n)
                    } catch (d) {}
                    try {
                        b = a.nodeType
                    } catch (e) {
                        b = !1, u.log("html2canvas: failed to access some element's nodeType - Exception: " + e.message)
                    }
                    if (1 === b || b === c) {
                        i(a);
                        try {
                            m(u.getCSS(a, "backgroundImage"), a)
                        } catch (d) {
                            u.log("html2canvas: failed to get background-image - Exception: " + d.message)
                        }
                        m(a)
                    }
                }

                function o(b, e) {
                    b.onload = function() {
                        e.timer !== c && a.clearTimeout(e.timer), t.numLoaded++, e.succeeded = !0, b.onerror = b.onload = null, f()
                    }, b.onerror = function() {
                        if ("anonymous" === b.crossOrigin && (a.clearTimeout(e.timer), d.proxy)) {
                            var c = b.src;
                            return b = new Image, e.img = b, b.src = c, void g(b.src, b, e)
                        }
                        t.numLoaded++, t.numFailed++, e.succeeded = !1, b.onerror = b.onload = null, f()
                    }
                }
                var p, q, r, s, t = {
                        numLoaded: 0,
                        numFailed: 0,
                        numTotal: 0,
                        cleanupDone: !1
                    },
                    u = l.Util,
                    v = 0,
                    w = d.elements[0] || b.body,
                    x = w.ownerDocument,
                    y = w.getElementsByTagName("img"),
                    z = y.length,
                    A = x.createElement("a"),
                    B = function(a) {
                        return a.crossOrigin !== c
                    }(new Image);
                for (A.href = loc.href, p = A.protocol + A.host, q = {
                        loadImage: function(a) {
                            var b, f;
                            a && t[a] === c && (b = new Image, a.match(/data:image\/.*;base64,/i) ? (b.src = a.replace(/url\(['"]{0,}|['"]{0,}\)$/gi, ""), f = t[a] = {
                                img: b
                            }, t.numTotal++, o(b, f)) : e(a) || d.allowTaint === !0 ? (f = t[a] = {
                                img: b
                            }, t.numTotal++, o(b, f), b.src = a) : B && !d.allowTaint && d.useCORS ? (b.crossOrigin = "anonymous", f = t[a] = {
                                img: b
                            }, t.numTotal++, o(b, f), b.src = a) : d.proxy && (f = t[a] = {
                                img: b
                            }, t.numTotal++, g(a, b, f)))
                        },
                        cleanupDOM: function(e) {
                            var g, h;
                            if (!t.cleanupDone) {
                                e && "string" == typeof e ? u.log("html2canvas: Cleanup because: " + e) : u.log("html2canvas: Cleanup after timeout: " + d.timeout + " ms.");
                                for (h in t)
                                    if (t.hasOwnProperty(h) && (g = t[h], "object" == typeof g && g.callbackname && g.succeeded === c)) {
                                        a[g.callbackname] = c;
                                        try {
                                            delete a[g.callbackname]
                                        } catch (i) {}
                                        g.script && g.script.parentNode && (g.script.setAttribute("src", "about:blank"), g.script.parentNode.removeChild(g.script)), t.numLoaded++, t.numFailed++, u.log("html2canvas: Cleaned up failed img: '" + h + "' Steps: " + t.numLoaded + " / " + t.numTotal)
                                    }
                                a.stop !== c ? a.stop() : b.execCommand !== c && b.execCommand("Stop", !1), b.close !== c && b.close(), t.cleanupDone = !0, e && "string" == typeof e || f()
                            }
                        },
                        renderingDone: function() {
                            s && a.clearTimeout(s)
                        }
                    }, d.timeout > 0 && (s = a.setTimeout(q.cleanupDOM, d.timeout)), u.log("html2canvas: Preload starts: finding background-images"), t.firstRun = !0, n(w), u.log("html2canvas: Preload: Finding images"), r = 0; z > r; r += 1) q.loadImage(y[r].getAttribute("src"));
                return t.firstRun = !1, u.log("html2canvas: Preload: Done."), t.numTotal === t.numLoaded && f(), q
            }, l.Renderer = function(a, d) {
                function e(a) {
                    function b(a) {
                        Object.keys(a).sort().forEach(function(c) {
                            var d = [],
                                f = [],
                                g = [],
                                h = [];
                            a[c].forEach(function(a) {
                                    a.node.zIndex.isPositioned || a.node.zIndex.opacity < 1 ? g.push(a) : a.node.zIndex.isFloated ? f.push(a) : d.push(a)
                                }),
                                function i(a) {
                                    a.forEach(function(a) {
                                        h.push(a), a.children && i(a.children)
                                    })
                                }(d.concat(f, g)), h.forEach(function(a) {
                                    a.context ? b(a.context) : e.push(a.node)
                                })
                        })
                    }
                    var d, e = [];
                    return d = function(a) {
                        function b(a, d, e) {
                            var f = "auto" === d.zIndex.zindex ? 0 : Number(d.zIndex.zindex),
                                g = a,
                                h = d.zIndex.isPositioned,
                                i = d.zIndex.isFloated,
                                j = {
                                    node: d
                                },
                                k = e;
                            d.zIndex.ownStacking ? (g = j.context = {
                                "!": [{
                                    node: d,
                                    children: []
                                }]
                            }, k = c) : (h || i) && (k = j.children = []), 0 === f && e ? e.push(j) : (a[f] || (a[f] = []), a[f].push(j)), d.zIndex.children.forEach(function(a) {
                                b(g, a, k)
                            })
                        }
                        var d = {};
                        return b(d, a), d
                    }(a), b(d), e
                }

                function f(a) {
                    var b;
                    if ("string" == typeof d.renderer && l.Renderer[a] !== c) b = l.Renderer[a](d);
                    else {
                        if ("function" != typeof a) throw new Error("Unknown renderer");
                        b = a(d)
                    }
                    if ("function" != typeof b) throw new Error("Invalid renderer defined");
                    return b
                }
                return f(d.renderer)(a, d, b, e(a.stack), l)
            }, l.Util.Support = function(a, b) {
                function d() {
                    var a = new Image,
                        d = b.createElement("canvas"),
                        e = d.getContext === c ? !1 : d.getContext("2d");
                    if (e === !1) return !1;
                    d.width = d.height = 10, a.src = ["data:image/svg+xml,", "<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'>", "<foreignObject width='10' height='10'>", "<div xmlns='http://www.w3.org/1999/xhtml' style='width:10;height:10;'>", "sup", "</div>", "</foreignObject>", "</svg>"].join("");
                    try {
                        e.drawImage(a, 0, 0), d.toDataURL()
                    } catch (f) {
                        return !1
                    }
                    return l.Util.log("html2canvas: Parse: SVG powered rendering available"), !0
                }

                function e() {
                    var a, c, d, e, f = !1;
                    return b.createRange && (a = b.createRange(), a.getBoundingClientRect && (c = b.createElement("boundtest"), c.style.height = "123px", c.style.display = "block", b.body.appendChild(c), a.selectNode(c), d = a.getBoundingClientRect(), e = d.height, 123 === e && (f = !0), b.body.removeChild(c))), f
                }
                return {
                    rangeBounds: e(),
                    svgRendering: a.svgRendering && d()
                }
            }, a.CbhHtml2Canvas = function(b, c) {
                b = b.length ? b : [b];
                var d, e, f = {
                    logging: !1,
                    elements: b,
                    background: "#fff",
                    proxy: null,
                    timeout: 0,
                    useCORS: !1,
                    allowTaint: !1,
                    svgRendering: !1,
                    ignoreElements: "IFRAME|OBJECT|PARAM",
                    useOverflow: !0,
                    letterRendering: !1,
                    chinese: !1,
                    width: null,
                    height: null,
                    taintTest: !0,
                    renderer: "Canvas"
                };
                return f = l.Util.Extend(c, f), l.logging = f.logging, f.complete = function(a) {
                    ("function" != typeof f.onpreloaded || f.onpreloaded(a) !== !1) && (d = l.Parse(a, f), ("function" != typeof f.onparsed || f.onparsed(d) !== !1) && (e = l.Renderer(d, f), "function" == typeof f.onrendered && f.onrendered(e)))
                }, a.setTimeout(function() {
                    l.Preload(f)
                }, 0), {
                    render: function(a, b) {
                        return l.Renderer(a, l.Util.Extend(b, f))
                    },
                    parse: function(a, b) {
                        return l.Parse(a, l.Util.Extend(b, f))
                    },
                    preload: function(a) {
                        return l.Preload(l.Util.Extend(a, f))
                    },
                    log: l.Util.log
                }
            }, a.CbhHtml2Canvas.log = l.Util.log, a.CbhHtml2Canvas.Renderer = {
                Canvas: c
            }, l.Renderer.Canvas = function(a) {
                function d(a, b) {
                    a.beginPath(), b.forEach(function(b) {
                        a[b.name].apply(a, b.arguments)
                    }), a.closePath()
                }

                function e(a) {
                    if (-1 === h.indexOf(a.arguments[0].src)) {
                        j.drawImage(a.arguments[0], 0, 0);
                        try {
                            j.getImageData(0, 0, 1, 1)
                        } catch (b) {
                            return i = g.createElement("canvas"), j = i.getContext("2d"), !1
                        }
                        h.push(a.arguments[0].src)
                    }
                    return !0
                }

                function f(b, c) {
                    switch (c.type) {
                        case "variable":
                            b[c.name] = c.arguments;
                            break;
                        case "function":
                            switch (c.name) {
                                case "createPattern":
                                    if (c.arguments[0].width > 0 && c.arguments[0].height > 0) try {
                                        b.fillStyle = b.createPattern(c.arguments[0], "repeat")
                                    } catch (f) {
                                        k.log("html2canvas: Renderer: Error creating pattern", f.message)
                                    }
                                    break;
                                case "drawShape":
                                    d(b, c.arguments);
                                    break;
                                case "drawImage":
                                    c.arguments[8] > 0 && c.arguments[7] > 0 && (!a.taintTest || a.taintTest && e(c)) && b.drawImage.apply(b, c.arguments);
                                    break;
                                default:
                                    b[c.name].apply(b, c.arguments)
                            }
                    }
                }
                a = a || {};
                var g = b,
                    h = [],
                    i = b.createElement("canvas"),
                    j = i.getContext("2d"),
                    k = l.Util,
                    m = a.canvas || g.createElement("canvas");
                return function(a, b, d, e, g) {
                    var h, i, j, l = m.getContext("2d"),
                        n = a.stack;
                    return m.width = m.style.width = b.width || n.ctx.width, m.height = m.style.height = b.height || n.ctx.height, j = l.fillStyle, l.fillStyle = k.isTransparent(n.backgroundColor) && b.background !== c ? b.background : a.backgroundColor, l.fillRect(0, 0, m.width, m.height), l.fillStyle = j, e.forEach(function(a) {
                        l.textBaseline = "bottom", l.save(), a.transform.matrix && (l.translate(a.transform.origin[0], a.transform.origin[1]), l.transform.apply(l, a.transform.matrix), l.translate(-a.transform.origin[0], -a.transform.origin[1])), a.clip && (l.beginPath(), l.rect(a.clip.left, a.clip.top, a.clip.width, a.clip.height), l.clip()), a.ctx.storage && a.ctx.storage.forEach(function(a) {
                            f(l, a)
                        }), l.restore()
                    }), k.log("html2canvas: Renderer: Canvas renderer done - returning canvas obj"), 1 === b.elements.length && "object" == typeof b.elements[0] && "BODY" !== b.elements[0].nodeName ? (i = g.Util.Bounds(b.elements[0]), h = d.createElement("canvas"), h.width = Math.ceil(i.width), h.height = Math.ceil(i.height), l = h.getContext("2d"), l.drawImage(m, i.left, i.top, i.width, i.height, 0, 0, i.width, i.height), m = null, h) : m
                }
            }
    }(window, document);
    var JSON = window.JSON;
    ! function MootoolsJSONIsJustWrong() {
            window.MooTools && "undefined" != typeof Native && Native.implement && (JSON = {}, function() {
                "use strict";

                function f(a) {
                    return 10 > a ? "0" + a : a
                }

                function this_value() {
                    return this.valueOf()
                }

                function quote(a) {
                    return rx_escapable.lastIndex = 0, rx_escapable.test(a) ? '"' + a.replace(rx_escapable, function(a) {
                        var b = meta[a];
                        return "string" == typeof b ? b : "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                    }) + '"' : '"' + a + '"'
                }

                function str(a, b) {
                    var c, d, e, f, g, h = gap,
                        i = b[a];
                    switch (i && "object" == typeof i && "function" == typeof i.toJSON && "[object Array]" !== Object.prototype.toString.apply(i) && (i = i.toJSON(a)), "function" == typeof rep && (i = rep.call(b, a, i)), typeof i) {
                        case "string":
                            return quote(i);
                        case "number":
                            return isFinite(i) ? String(i) : "null";
                        case "boolean":
                        case "null":
                            return String(i);
                        case "object":
                            if (!i) return "null";
                            if (gap += indent, g = [], "[object Array]" === Object.prototype.toString.apply(i)) {
                                for (f = i.length, c = 0; f > c; c += 1) g[c] = str(c, i) || "null";
                                return e = 0 === g.length ? "[]" : gap ? "[\n" + gap + g.join(",\n" + gap) + "\n" + h + "]" : "[" + g.join(",") + "]", gap = h, e
                            }
                            if (rep && "object" == typeof rep)
                                for (f = rep.length, c = 0; f > c; c += 1) "string" == typeof rep[c] && (d = rep[c], e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                            else
                                for (d in i) Object.prototype.hasOwnProperty.call(i, d) && (e = str(d, i), e && g.push(quote(d) + (gap ? ": " : ":") + e));
                            return e = 0 === g.length ? "{}" : gap ? "{\n" + gap + g.join(",\n" + gap) + "\n" + h + "}" : "{" + g.join(",") + "}", gap = h, e
                    }
                }
                var rx_one = /^[\],:{}\s]*$/,
                    rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                    rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                    rx_four = /(?:^|:|,)(?:\s*\[)+/g,
                    rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
                    rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
                Date.prototype.toJSON = function() {
                    return isFinite(this.valueOf()) ? this.getUTCFullYear() + "-" + f(this.getUTCMonth() + 1) + "-" + f(this.getUTCDate()) + "T" + f(this.getUTCHours()) + ":" + f(this.getUTCMinutes()) + ":" + f(this.getUTCSeconds()) + "Z" : null
                }, Boolean.prototype.toJSON = this_value, Number.prototype.toJSON = this_value, String.prototype.toJSON = this_value, Array.prototype.toJSON = function() {
                    return str("", {
                        "": this
                    })
                };
                var gap, indent, meta, rep;
                "function" != typeof JSON.stringify && (meta = {
                    "\b": "\\b",
                    "	": "\\t",
                    "\n": "\\n",
                    "\f": "\\f",
                    "\r": "\\r",
                    '"': '\\"',
                    "\\": "\\\\"
                }, JSON.stringify = function(a, b, c) {
                    var d;
                    if (gap = "", indent = "", "number" == typeof c)
                        for (d = 0; c > d; d += 1) indent += " ";
                    else "string" == typeof c && (indent = c);
                    if (rep = b, b && "function" != typeof b && ("object" != typeof b || "number" != typeof b.length)) throw new Error("JSON.stringify");
                    return str("", {
                        "": a
                    })
                }), "function" != typeof JSON.parse && (JSON.parse = function(text, reviver) {
                    function walk(a, b) {
                        var c, d, e = a[b];
                        if (e && "object" == typeof e)
                            for (c in e) Object.prototype.hasOwnProperty.call(e, c) && (d = walk(e, c), void 0 !== d ? e[c] = d : delete e[c]);
                        return reviver.call(a, b, e)
                    }
                    var j;
                    if (text = String(text), rx_dangerous.lastIndex = 0, rx_dangerous.test(text) && (text = text.replace(rx_dangerous, function(a) {
                            return "\\u" + ("0000" + a.charCodeAt(0).toString(16)).slice(-4)
                        })), rx_one.test(text.replace(rx_two, "@").replace(rx_three, "]").replace(rx_four, ""))) return j = eval("(" + text + ")"), "function" == typeof reviver ? walk({
                        "": j
                    }, "") : j;
                    throw new SyntaxError("JSON.parse")
                })
            }())
        }(),
        function(a) {
            "use strict";
            for (var b, c, d = {}, e = function() {}, f = "memory".split(","), g = "assert,clear,count,debug,dir,dirxml,error,exception,group,groupCollapsed,groupEnd,info,log,markTimeline,profile,profiles,profileEnd,show,table,time,timeEnd,timeline,timelineEnd,timeStamp,trace,warn".split(","); b = f.pop();) a[b] = a[b] || d;
            for (; c = g.pop();) a[c] = a[c] || e
        }(this.console = this.console || {}),
        function() {
            Array.prototype.indexOf && -1 == [].indexOf(1) || (Array.prototype.indexOf = function(a, b) {
                var c;
                if (null == this) throw new TypeError('"this" is null or not defined');
                var d = Object(this),
                    e = d.length >>> 0;
                if (0 === e) return -1;
                var f = +b || 0;
                if (Math.abs(f) === 1 / 0 && (f = 0), f >= e) return -1;
                for (c = Math.max(f >= 0 ? f : e - Math.abs(f), 0); e > c;) {
                    if (c in d && d[c] === a) return c;
                    c++
                }
                return -1
            })
        }(),
        function() {
            function a(a) {
                for (var b, c = [], d = new RegExp("(^| )" + a + "( |$)"), e = this.getElementsByTagName("*"), f = e.length, g = 0; f > g;) b = e[g], d.test(b.className) && c.push(b), g += 1;
                return c
            }
            window.MooTools && "undefined" != typeof Native && Native.implement && document.getElementsByClassName && "[object Array]" == Object.prototype.toString.call(document.getElementsByClassName("test")) && (document.getElementsByClassName = a, Element.prototype.getElementsByClassName = a)
        }(), ! function(a) {
            if ("object" == typeof exports && "undefined" != typeof module) module.exports = a();
            else if ("function" == typeof define && define.amd) define([], a);
            else {
                var b;
                "undefined" != typeof window ? b = window : "undefined" != typeof global ? b = global : "undefined" != typeof self && (b = self), b.io = a()
            }
        }(function() {
            var a;
            return function b(a, c, d) {
                function e(g, h) {
                    if (!c[g]) {
                        if (!a[g]) {
                            var i = "function" == typeof require && require;
                            if (!h && i) return i(g, !0);
                            if (f) return f(g, !0);
                            throw new Error("Cannot find module '" + g + "'")
                        }
                        var j = c[g] = {
                            exports: {}
                        };
                        a[g][0].call(j.exports, function(b) {
                            var c = a[g][1][b];
                            return e(c ? c : b)
                        }, j, j.exports, b, a, c, d)
                    }
                    return c[g].exports
                }
                for (var f = "function" == typeof require && require, g = 0; g < d.length; g++) e(d[g]);
                return e
            }({
                1: [function(a, b, c) {
                    b.exports = a("./lib/")
                }, {
                    "./lib/": 2
                }],
                2: [function(a, b, c) {
                    function d(a, b) {
                        "object" == typeof a && (b = a, a = void 0), b = b || {};
                        var c, d = e(a),
                            f = d.source,
                            j = d.id;
                        return b.forceNew || b["force new connection"] || !1 === b.multiplex ? (h("ignoring socket cache for %s", f), c = g(f, b)) : (i[j] || (h("new io instance for %s", f), i[j] = g(f, b)), c = i[j]), c.socket(d.path)
                    }
                    var e = a("./url"),
                        f = a("socket.io-parser"),
                        g = a("./manager"),
                        h = a("debug")("socket.io-client");
                    b.exports = c = d;
                    var i = c.managers = {};
                    c.protocol = f.protocol, c.connect = d, c.Manager = a("./manager"), c.Socket = a("./socket")
                }, {
                    "./manager": 3,
                    "./socket": 5,
                    "./url": 6,
                    debug: 10,
                    "socket.io-parser": 46
                }],
                3: [function(a, b, c) {
                    function d(a, b) {
                        return this instanceof d ? (a && "object" == typeof a && (b = a, a = void 0), b = b || {}, b.path = b.path || "/socket.io", this.nsps = {}, this.subs = [], this.opts = b, this.reconnection(b.reconnection !== !1), this.reconnectionAttempts(b.reconnectionAttempts || 1 / 0), this.reconnectionDelay(b.reconnectionDelay || 1e3), this.reconnectionDelayMax(b.reconnectionDelayMax || 5e3), this.randomizationFactor(b.randomizationFactor || .5), this.backoff = new m({
                            min: this.reconnectionDelay(),
                            max: this.reconnectionDelayMax(),
                            jitter: this.randomizationFactor()
                        }), this.timeout(null == b.timeout ? 2e4 : b.timeout), this.readyState = "closed", this.uri = a, this.connected = [], this.encoding = !1, this.packetBuffer = [], this.encoder = new h.Encoder, this.decoder = new h.Decoder, this.autoConnect = b.autoConnect !== !1, void(this.autoConnect && this.open())) : new d(a, b)
                    }
                    var e = (a("./url"), a("engine.io-client")),
                        f = a("./socket"),
                        g = a("component-emitter"),
                        h = a("socket.io-parser"),
                        i = a("./on"),
                        j = a("component-bind"),
                        k = (a("object-component"), a("debug")("socket.io-client:manager")),
                        l = a("indexof"),
                        m = a("backo2");
                    b.exports = d, d.prototype.emitAll = function() {
                        this.emit.apply(this, arguments);
                        for (var a in this.nsps) this.nsps[a].emit.apply(this.nsps[a], arguments)
                    }, d.prototype.updateSocketIds = function() {
                        for (var a in this.nsps) this.nsps[a].id = this.engine.id
                    }, g(d.prototype), d.prototype.reconnection = function(a) {
                        return arguments.length ? (this._reconnection = !!a, this) : this._reconnection
                    }, d.prototype.reconnectionAttempts = function(a) {
                        return arguments.length ? (this._reconnectionAttempts = a, this) : this._reconnectionAttempts
                    }, d.prototype.reconnectionDelay = function(a) {
                        return arguments.length ? (this._reconnectionDelay = a, this.backoff && this.backoff.setMin(a), this) : this._reconnectionDelay
                    }, d.prototype.randomizationFactor = function(a) {
                        return arguments.length ? (this._randomizationFactor = a, this.backoff && this.backoff.setJitter(a), this) : this._randomizationFactor
                    }, d.prototype.reconnectionDelayMax = function(a) {
                        return arguments.length ? (this._reconnectionDelayMax = a, this.backoff && this.backoff.setMax(a), this) : this._reconnectionDelayMax
                    }, d.prototype.timeout = function(a) {
                        return arguments.length ? (this._timeout = a, this) : this._timeout
                    }, d.prototype.maybeReconnectOnOpen = function() {
                        !this.reconnecting && this._reconnection && 0 === this.backoff.attempts && this.reconnect()
                    }, d.prototype.open = d.prototype.connect = function(a) {
                        if (k("readyState %s", this.readyState), ~this.readyState.indexOf("open")) return this;
                        k("opening %s", this.uri), this.engine = e(this.uri, this.opts);
                        var b = this.engine,
                            c = this;
                        this.readyState = "opening", this.skipReconnect = !1;
                        var d = i(b, "open", function() {
                                c.onopen(), a && a()
                            }),
                            f = i(b, "error", function(b) {
                                if (k("connect_error"), c.cleanup(), c.readyState = "closed", c.emitAll("connect_error", b), a) {
                                    var d = new Error("Connection error");
                                    d.data = b, a(d)
                                } else c.maybeReconnectOnOpen();
                            });
                        if (!1 !== this._timeout) {
                            var g = this._timeout;
                            k("connect attempt will timeout after %d", g);
                            var h = setTimeout(function() {
                                k("connect attempt timed out after %d", g), d.destroy(), b.close(), b.emit("error", "timeout"), c.emitAll("connect_timeout", g)
                            }, g);
                            this.subs.push({
                                destroy: function() {
                                    clearTimeout(h)
                                }
                            })
                        }
                        return this.subs.push(d), this.subs.push(f), this
                    }, d.prototype.onopen = function() {
                        k("open"), this.cleanup(), this.readyState = "open", this.emit("open");
                        var a = this.engine;
                        this.subs.push(i(a, "data", j(this, "ondata"))), this.subs.push(i(this.decoder, "decoded", j(this, "ondecoded"))), this.subs.push(i(a, "error", j(this, "onerror"))), this.subs.push(i(a, "close", j(this, "onclose")))
                    }, d.prototype.ondata = function(a) {
                        this.decoder.add(a)
                    }, d.prototype.ondecoded = function(a) {
                        this.emit("packet", a)
                    }, d.prototype.onerror = function(a) {
                        k("error", a), this.emitAll("error", a)
                    }, d.prototype.socket = function(a) {
                        var b = this.nsps[a];
                        if (!b) {
                            b = new f(this, a), this.nsps[a] = b;
                            var c = this;
                            b.on("connect", function() {
                                b.id = c.engine.id, ~l(c.connected, b) || c.connected.push(b)
                            })
                        }
                        return b
                    }, d.prototype.destroy = function(a) {
                        var b = l(this.connected, a);
                        ~b && this.connected.splice(b, 1), this.connected.length || this.close()
                    }, d.prototype.packet = function(a) {
                        k("writing packet %j", a);
                        var b = this;
                        b.encoding ? b.packetBuffer.push(a) : (b.encoding = !0, this.encoder.encode(a, function(a) {
                            for (var c = 0; c < a.length; c++) b.engine.write(a[c]);
                            b.encoding = !1, b.processPacketQueue()
                        }))
                    }, d.prototype.processPacketQueue = function() {
                        if (this.packetBuffer.length > 0 && !this.encoding) {
                            var a = this.packetBuffer.shift();
                            this.packet(a)
                        }
                    }, d.prototype.cleanup = function() {
                        for (var a; a = this.subs.shift();) a.destroy();
                        this.packetBuffer = [], this.encoding = !1, this.decoder.destroy()
                    }, d.prototype.close = d.prototype.disconnect = function() {
                        this.skipReconnect = !0, this.backoff.reset(), this.readyState = "closed", this.engine && this.engine.close()
                    }, d.prototype.onclose = function(a) {
                        k("close"), this.cleanup(), this.backoff.reset(), this.readyState = "closed", this.emit("close", a), this._reconnection && !this.skipReconnect && this.reconnect()
                    }, d.prototype.reconnect = function() {
                        if (this.reconnecting || this.skipReconnect) return this;
                        var a = this;
                        if (this.backoff.attempts >= this._reconnectionAttempts) k("reconnect failed"), this.backoff.reset(), this.emitAll("reconnect_failed"), this.reconnecting = !1;
                        else {
                            var b = this.backoff.duration();
                            k("will wait %dms before reconnect attempt", b), this.reconnecting = !0;
                            var c = setTimeout(function() {
                                a.skipReconnect || (k("attempting reconnect"), a.emitAll("reconnect_attempt", a.backoff.attempts), a.emitAll("reconnecting", a.backoff.attempts), a.skipReconnect || a.open(function(b) {
                                    b ? (k("reconnect attempt error"), a.reconnecting = !1, a.reconnect(), a.emitAll("reconnect_error", b.data)) : (k("reconnect success"), a.onreconnect())
                                }))
                            }, b);
                            this.subs.push({
                                destroy: function() {
                                    clearTimeout(c)
                                }
                            })
                        }
                    }, d.prototype.onreconnect = function() {
                        var a = this.backoff.attempts;
                        this.reconnecting = !1, this.backoff.reset(), this.updateSocketIds(), this.emitAll("reconnect", a)
                    }
                }, {
                    "./on": 4,
                    "./socket": 5,
                    "./url": 6,
                    backo2: 7,
                    "component-bind": 8,
                    "component-emitter": 9,
                    debug: 10,
                    "engine.io-client": 11,
                    indexof: 42,
                    "object-component": 43,
                    "socket.io-parser": 46
                }],
                4: [function(a, b, c) {
                    function d(a, b, c) {
                        return a.on(b, c), {
                            destroy: function() {
                                a.removeListener(b, c)
                            }
                        }
                    }
                    b.exports = d
                }, {}],
                5: [function(a, b, c) {
                    function d(a, b) {
                        this.io = a, this.nsp = b, this.json = this, this.ids = 0, this.acks = {}, this.io.autoConnect && this.open(), this.receiveBuffer = [], this.sendBuffer = [], this.connected = !1, this.disconnected = !0
                    }
                    var e = a("socket.io-parser"),
                        f = a("component-emitter"),
                        g = a("to-array"),
                        h = a("./on"),
                        i = a("component-bind"),
                        j = a("debug")("socket.io-client:socket"),
                        k = a("has-binary");
                    b.exports = c = d;
                    var l = {
                            connect: 1,
                            connect_error: 1,
                            connect_timeout: 1,
                            disconnect: 1,
                            error: 1,
                            reconnect: 1,
                            reconnect_attempt: 1,
                            reconnect_failed: 1,
                            reconnect_error: 1,
                            reconnecting: 1
                        },
                        m = f.prototype.emit;
                    f(d.prototype), d.prototype.subEvents = function() {
                        if (!this.subs) {
                            var a = this.io;
                            this.subs = [h(a, "open", i(this, "onopen")), h(a, "packet", i(this, "onpacket")), h(a, "close", i(this, "onclose"))]
                        }
                    }, d.prototype.open = d.prototype.connect = function() {
                        return this.connected ? this : (this.subEvents(), this.io.open(), "open" == this.io.readyState && this.onopen(), this)
                    }, d.prototype.send = function() {
                        var a = g(arguments);
                        return a.unshift("message"), this.emit.apply(this, a), this
                    }, d.prototype.emit = function(a) {
                        if (l.hasOwnProperty(a)) return m.apply(this, arguments), this;
                        var b = g(arguments),
                            c = e.EVENT;
                        k(b) && (c = e.BINARY_EVENT);
                        var d = {
                            type: c,
                            data: b
                        };
                        return "function" == typeof b[b.length - 1] && (j("emitting packet with ack id %d", this.ids), this.acks[this.ids] = b.pop(), d.id = this.ids++), this.connected ? this.packet(d) : this.sendBuffer.push(d), this
                    }, d.prototype.packet = function(a) {
                        a.nsp = this.nsp, this.io.packet(a)
                    }, d.prototype.onopen = function() {
                        j("transport is open - connecting"), "/" != this.nsp && this.packet({
                            type: e.CONNECT
                        })
                    }, d.prototype.onclose = function(a) {
                        j("close (%s)", a), this.connected = !1, this.disconnected = !0, delete this.id, this.emit("disconnect", a)
                    }, d.prototype.onpacket = function(a) {
                        if (a.nsp == this.nsp) switch (a.type) {
                            case e.CONNECT:
                                this.onconnect();
                                break;
                            case e.EVENT:
                                this.onevent(a);
                                break;
                            case e.BINARY_EVENT:
                                this.onevent(a);
                                break;
                            case e.ACK:
                                this.onack(a);
                                break;
                            case e.BINARY_ACK:
                                this.onack(a);
                                break;
                            case e.DISCONNECT:
                                this.ondisconnect();
                                break;
                            case e.ERROR:
                                this.emit("error", a.data)
                        }
                    }, d.prototype.onevent = function(a) {
                        var b = a.data || [];
                        j("emitting event %j", b), null != a.id && (j("attaching ack callback to event"), b.push(this.ack(a.id))), this.connected ? m.apply(this, b) : this.receiveBuffer.push(b)
                    }, d.prototype.ack = function(a) {
                        var b = this,
                            c = !1;
                        return function() {
                            if (!c) {
                                c = !0;
                                var d = g(arguments);
                                j("sending ack %j", d);
                                var f = k(d) ? e.BINARY_ACK : e.ACK;
                                b.packet({
                                    type: f,
                                    id: a,
                                    data: d
                                })
                            }
                        }
                    }, d.prototype.onack = function(a) {
                        j("calling ack %s with %j", a.id, a.data);
                        var b = this.acks[a.id];
                        b.apply(this, a.data), delete this.acks[a.id]
                    }, d.prototype.onconnect = function() {
                        this.connected = !0, this.disconnected = !1, this.emit("connect"), this.emitBuffered()
                    }, d.prototype.emitBuffered = function() {
                        var a;
                        for (a = 0; a < this.receiveBuffer.length; a++) m.apply(this, this.receiveBuffer[a]);
                        for (this.receiveBuffer = [], a = 0; a < this.sendBuffer.length; a++) this.packet(this.sendBuffer[a]);
                        this.sendBuffer = []
                    }, d.prototype.ondisconnect = function() {
                        j("server disconnect (%s)", this.nsp), this.destroy(), this.onclose("io server disconnect")
                    }, d.prototype.destroy = function() {
                        if (this.subs) {
                            for (var a = 0; a < this.subs.length; a++) this.subs[a].destroy();
                            this.subs = null
                        }
                        this.io.destroy(this)
                    }, d.prototype.close = d.prototype.disconnect = function() {
                        return this.connected && (j("performing disconnect (%s)", this.nsp), this.packet({
                            type: e.DISCONNECT
                        })), this.destroy(), this.connected && this.onclose("io client disconnect"), this
                    }
                }, {
                    "./on": 4,
                    "component-bind": 8,
                    "component-emitter": 9,
                    debug: 10,
                    "has-binary": 38,
                    "socket.io-parser": 46,
                    "to-array": 50
                }],
                6: [function(a, b, c) {
                    (function(c) {
                        function d(a, b) {
                            var d = a,
                                b = b || c.location;
                            return null == a && (a = b.protocol + "//" + b.host), "string" == typeof a && ("/" == a.charAt(0) && (a = "/" == a.charAt(1) ? b.protocol + a : b.hostname + a), /^(https?|wss?):\/\//.test(a) || (f("protocol-less url %s", a), a = "undefined" != typeof b ? b.protocol + "//" + a : "https://" + a), f("parse %s", a), d = e(a)), d.port || (/^(http|ws)$/.test(d.protocol) ? d.port = "80" : /^(http|ws)s$/.test(d.protocol) && (d.port = "443")), d.path = d.path || "/", d.id = d.protocol + "://" + d.host + ":" + d.port, d.href = d.protocol + "://" + d.host + (b && b.port == d.port ? "" : ":" + d.port), d
                        }
                        var e = a("parseuri"),
                            f = a("debug")("socket.io-client:url");
                        b.exports = d
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    debug: 10,
                    parseuri: 44
                }],
                7: [function(a, b, c) {
                    function d(a) {
                        a = a || {}, this.ms = a.min || 100, this.max = a.max || 1e4, this.factor = a.factor || 2, this.jitter = a.jitter > 0 && a.jitter <= 1 ? a.jitter : 0, this.attempts = 0
                    }
                    b.exports = d, d.prototype.duration = function() {
                        var a = this.ms * Math.pow(this.factor, this.attempts++);
                        if (this.jitter) {
                            var b = Math.random(),
                                c = Math.floor(b * this.jitter * a);
                            a = 0 == (1 & Math.floor(10 * b)) ? a - c : a + c
                        }
                        return 0 | Math.min(a, this.max)
                    }, d.prototype.reset = function() {
                        this.attempts = 0
                    }, d.prototype.setMin = function(a) {
                        this.ms = a
                    }, d.prototype.setMax = function(a) {
                        this.max = a
                    }, d.prototype.setJitter = function(a) {
                        this.jitter = a
                    }
                }, {}],
                8: [function(a, b, c) {
                    var d = [].slice;
                    b.exports = function(a, b) {
                        if ("string" == typeof b && (b = a[b]), "function" != typeof b) throw new Error("bind() requires a function");
                        var c = d.call(arguments, 2);
                        return function() {
                            return b.apply(a, c.concat(d.call(arguments)))
                        }
                    }
                }, {}],
                9: [function(a, b, c) {
                    function d(a) {
                        return a ? e(a) : void 0
                    }

                    function e(a) {
                        for (var b in d.prototype) a[b] = d.prototype[b];
                        return a
                    }
                    b.exports = d, d.prototype.on = d.prototype.addEventListener = function(a, b) {
                        return this._callbacks = this._callbacks || {}, (this._callbacks[a] = this._callbacks[a] || []).push(b), this
                    }, d.prototype.once = function(a, b) {
                        function c() {
                            d.off(a, c), b.apply(this, arguments)
                        }
                        var d = this;
                        return this._callbacks = this._callbacks || {}, c.fn = b, this.on(a, c), this
                    }, d.prototype.off = d.prototype.removeListener = d.prototype.removeAllListeners = d.prototype.removeEventListener = function(a, b) {
                        if (this._callbacks = this._callbacks || {}, 0 == arguments.length) return this._callbacks = {}, this;
                        var c = this._callbacks[a];
                        if (!c) return this;
                        if (1 == arguments.length) return delete this._callbacks[a], this;
                        for (var d, e = 0; e < c.length; e++)
                            if (d = c[e], d === b || d.fn === b) {
                                c.splice(e, 1);
                                break
                            }
                        return this
                    }, d.prototype.emit = function(a) {
                        this._callbacks = this._callbacks || {};
                        var b = [].slice.call(arguments, 1),
                            c = this._callbacks[a];
                        if (c) {
                            c = c.slice(0);
                            for (var d = 0, e = c.length; e > d; ++d) c[d].apply(this, b)
                        }
                        return this
                    }, d.prototype.listeners = function(a) {
                        return this._callbacks = this._callbacks || {}, this._callbacks[a] || []
                    }, d.prototype.hasListeners = function(a) {
                        return !!this.listeners(a).length
                    }
                }, {}],
                10: [function(a, b, c) {
                    function d(a) {
                        return d.enabled(a) ? function(b) {
                            b = e(b);
                            var c = new Date,
                                f = c - (d[a] || c);
                            d[a] = c, b = a + " " + b + " +" + d.humanize(f), window.console && console.log && Function.prototype.apply.call(console.log, console, arguments)
                        } : function() {}
                    }

                    function e(a) {
                        return a instanceof Error ? a.stack || a.message : a
                    }
                    b.exports = d, d.names = [], d.skips = [], d.enable = function(a) {
                        try {
                            localStorage.debug = a
                        } catch (b) {}
                        for (var c = (a || "").split(/[\s,]+/), e = c.length, f = 0; e > f; f++) a = c[f].replace("*", ".*?"), "-" === a[0] ? d.skips.push(new RegExp("^" + a.substr(1) + "$")) : d.names.push(new RegExp("^" + a + "$"))
                    }, d.disable = function() {
                        d.enable("")
                    }, d.humanize = function(a) {
                        var b = 1e3,
                            c = 6e4,
                            d = 60 * c;
                        return a >= d ? (a / d).toFixed(1) + "h" : a >= c ? (a / c).toFixed(1) + "m" : a >= b ? (a / b | 0) + "s" : a + "ms"
                    }, d.enabled = function(a) {
                        for (var b = 0, c = d.skips.length; c > b; b++)
                            if (d.skips[b].test(a)) return !1;
                        for (var b = 0, c = d.names.length; c > b; b++)
                            if (d.names[b].test(a)) return !0;
                        return !1
                    };
                    try {
                        window.localStorage && d.enable(localStorage.debug)
                    } catch (f) {}
                }, {}],
                11: [function(a, b, c) {
                    b.exports = a("./lib/")
                }, {
                    "./lib/": 12
                }],
                12: [function(a, b, c) {
                    b.exports = a("./socket"), b.exports.parser = a("engine.io-parser")
                }, {
                    "./socket": 13,
                    "engine.io-parser": 25
                }],
                13: [function(a, b, c) {
                    (function(c) {
                        function d(a, b) {
                            if (!(this instanceof d)) return new d(a, b);
                            if (b = b || {}, a && "object" == typeof a && (b = a, a = null), a && (a = k(a), b.host = a.host, b.secure = "https" == a.protocol || "wss" == a.protocol, b.port = a.port, a.query && (b.query = a.query)), this.secure = null != b.secure ? b.secure : c.location && "https:" == location.protocol, b.host) {
                                var e = b.host.split(":");
                                b.hostname = e.shift(), e.length ? b.port = e.pop() : b.port || (b.port = this.secure ? "443" : "80")
                            }
                            this.agent = b.agent || !1, this.hostname = b.hostname || (c.location ? location.hostname : "localhost"), this.port = b.port || (c.location && location.port ? location.port : this.secure ? 443 : 80), this.query = b.query || {}, "string" == typeof this.query && (this.query = m.decode(this.query)), this.upgrade = !1 !== b.upgrade, this.path = (b.path || "/engine.io").replace(/\/$/, "") + "/", this.forceJSONP = !!b.forceJSONP, this.jsonp = !1 !== b.jsonp, this.forceBase64 = !!b.forceBase64, this.enablesXDR = !!b.enablesXDR, this.timestampParam = b.timestampParam || "t", this.timestampRequests = b.timestampRequests, this.transports = b.transports || ["polling", "websocket"], this.readyState = "", this.writeBuffer = [], this.callbackBuffer = [], this.policyPort = b.policyPort || 843, this.rememberUpgrade = b.rememberUpgrade || !1, this.binaryType = null, this.onlyBinaryUpgrades = b.onlyBinaryUpgrades, this.pfx = b.pfx || null, this.key = b.key || null, this.passphrase = b.passphrase || null, this.cert = b.cert || null, this.ca = b.ca || null, this.ciphers = b.ciphers || null, this.rejectUnauthorized = b.rejectUnauthorized || null, this.open()
                        }

                        function e(a) {
                            var b = {};
                            for (var c in a) a.hasOwnProperty(c) && (b[c] = a[c]);
                            return b
                        }
                        var f = a("./transports"),
                            g = a("component-emitter"),
                            h = a("debug")("engine.io-client:socket"),
                            i = a("indexof"),
                            j = a("engine.io-parser"),
                            k = a("parseuri"),
                            l = a("parsejson"),
                            m = a("parseqs");
                        b.exports = d, d.priorWebsocketSuccess = !1, g(d.prototype), d.protocol = j.protocol, d.Socket = d, d.Transport = a("./transport"), d.transports = a("./transports"), d.parser = a("engine.io-parser"), d.prototype.createTransport = function(a) {
                            h('creating transport "%s"', a);
                            var b = e(this.query);
                            b.EIO = j.protocol, b.transport = a, this.id && (b.sid = this.id);
                            var c = new f[a]({
                                agent: this.agent,
                                hostname: this.hostname,
                                port: this.port,
                                secure: this.secure,
                                path: this.path,
                                query: b,
                                forceJSONP: this.forceJSONP,
                                jsonp: this.jsonp,
                                forceBase64: this.forceBase64,
                                enablesXDR: this.enablesXDR,
                                timestampRequests: this.timestampRequests,
                                timestampParam: this.timestampParam,
                                policyPort: this.policyPort,
                                socket: this,
                                pfx: this.pfx,
                                key: this.key,
                                passphrase: this.passphrase,
                                cert: this.cert,
                                ca: this.ca,
                                ciphers: this.ciphers,
                                rejectUnauthorized: this.rejectUnauthorized
                            });
                            return c
                        }, d.prototype.open = function() {
                            var a;
                            if (this.rememberUpgrade && d.priorWebsocketSuccess && -1 != this.transports.indexOf("websocket")) a = "websocket";
                            else {
                                if (0 == this.transports.length) {
                                    var b = this;
                                    return void setTimeout(function() {
                                        b.emit("error", "No transports available")
                                    }, 0)
                                }
                                a = this.transports[0]
                            }
                            this.readyState = "opening";
                            var a;
                            try {
                                a = this.createTransport(a)
                            } catch (c) {
                                return this.transports.shift(), void this.open()
                            }
                            a.open(), this.setTransport(a)
                        }, d.prototype.setTransport = function(a) {
                            h("setting transport %s", a.name);
                            var b = this;
                            this.transport && (h("clearing existing transport %s", this.transport.name), this.transport.removeAllListeners()), this.transport = a, a.on("drain", function() {
                                b.onDrain()
                            }).on("packet", function(a) {
                                b.onPacket(a)
                            }).on("error", function(a) {
                                b.onError(a)
                            }).on("close", function() {
                                b.onClose("transport close")
                            })
                        }, d.prototype.probe = function(a) {
                            function b() {
                                if (m.onlyBinaryUpgrades) {
                                    var b = !this.supportsBinary && m.transport.supportsBinary;
                                    l = l || b
                                }
                                l || (h('probe transport "%s" opened', a), k.send([{
                                    type: "ping",
                                    data: "probe"
                                }]), k.once("packet", function(b) {
                                    if (!l)
                                        if ("pong" == b.type && "probe" == b.data) {
                                            if (h('probe transport "%s" pong', a), m.upgrading = !0, m.emit("upgrading", k), !k) return;
                                            d.priorWebsocketSuccess = "websocket" == k.name, h('pausing current transport "%s"', m.transport.name), m.transport.pause(function() {
                                                l || "closed" != m.readyState && (h("changing transport and sending upgrade packet"), j(), m.setTransport(k), k.send([{
                                                    type: "upgrade"
                                                }]), m.emit("upgrade", k), k = null, m.upgrading = !1, m.flush())
                                            })
                                        } else {
                                            h('probe transport "%s" failed', a);
                                            var c = new Error("probe error");
                                            c.transport = k.name, m.emit("upgradeError", c)
                                        }
                                }))
                            }

                            function c() {
                                l || (l = !0, j(), k.close(), k = null)
                            }

                            function e(b) {
                                var d = new Error("probe error: " + b);
                                d.transport = k.name, c(), h('probe transport "%s" failed because of error: %s', a, b), m.emit("upgradeError", d)
                            }

                            function f() {
                                e("transport closed")
                            }

                            function g() {
                                e("socket closed")
                            }

                            function i(a) {
                                k && a.name != k.name && (h('"%s" works - aborting "%s"', a.name, k.name), c())
                            }

                            function j() {
                                k.removeListener("open", b), k.removeListener("error", e), k.removeListener("close", f), m.removeListener("close", g), m.removeListener("upgrading", i)
                            }
                            h('probing transport "%s"', a);
                            var k = this.createTransport(a, {
                                    probe: 1
                                }),
                                l = !1,
                                m = this;
                            d.priorWebsocketSuccess = !1, k.once("open", b), k.once("error", e), k.once("close", f), this.once("close", g), this.once("upgrading", i), k.open()
                        }, d.prototype.onOpen = function() {
                            if (h("socket open"), this.readyState = "open", d.priorWebsocketSuccess = "websocket" == this.transport.name, this.emit("open"), this.flush(), "open" == this.readyState && this.upgrade && this.transport.pause) {
                                h("starting upgrade probes");
                                for (var a = 0, b = this.upgrades.length; b > a; a++) this.probe(this.upgrades[a])
                            }
                        }, d.prototype.onPacket = function(a) {
                            if ("opening" == this.readyState || "open" == this.readyState) switch (h('socket receive: type "%s", data "%s"', a.type, a.data), this.emit("packet", a), this.emit("heartbeat"), a.type) {
                                case "open":
                                    this.onHandshake(l(a.data));
                                    break;
                                case "pong":
                                    this.setPing();
                                    break;
                                case "error":
                                    var b = new Error("server error");
                                    b.code = a.data, this.emit("error", b);
                                    break;
                                case "message":
                                    this.emit("data", a.data), this.emit("message", a.data)
                            } else h('packet received with socket readyState "%s"', this.readyState)
                        }, d.prototype.onHandshake = function(a) {
                            this.emit("handshake", a), this.id = a.sid, this.transport.query.sid = a.sid, this.upgrades = this.filterUpgrades(a.upgrades), this.pingInterval = a.pingInterval, this.pingTimeout = a.pingTimeout, this.onOpen(), "closed" != this.readyState && (this.setPing(), this.removeListener("heartbeat", this.onHeartbeat), this.on("heartbeat", this.onHeartbeat))
                        }, d.prototype.onHeartbeat = function(a) {
                            clearTimeout(this.pingTimeoutTimer);
                            var b = this;
                            b.pingTimeoutTimer = setTimeout(function() {
                                "closed" != b.readyState && b.onClose("ping timeout")
                            }, a || b.pingInterval + b.pingTimeout)
                        }, d.prototype.setPing = function() {
                            var a = this;
                            clearTimeout(a.pingIntervalTimer), a.pingIntervalTimer = setTimeout(function() {
                                h("writing ping packet - expecting pong within %sms", a.pingTimeout), a.ping(), a.onHeartbeat(a.pingTimeout)
                            }, a.pingInterval)
                        }, d.prototype.ping = function() {
                            this.sendPacket("ping")
                        }, d.prototype.onDrain = function() {
                            for (var a = 0; a < this.prevBufferLen; a++) this.callbackBuffer[a] && this.callbackBuffer[a]();
                            this.writeBuffer.splice(0, this.prevBufferLen), this.callbackBuffer.splice(0, this.prevBufferLen), this.prevBufferLen = 0, 0 == this.writeBuffer.length ? this.emit("drain") : this.flush()
                        }, d.prototype.flush = function() {
                            "closed" != this.readyState && this.transport.writable && !this.upgrading && this.writeBuffer.length && (h("flushing %d packets in socket", this.writeBuffer.length), this.transport.send(this.writeBuffer), this.prevBufferLen = this.writeBuffer.length, this.emit("flush"))
                        }, d.prototype.write = d.prototype.send = function(a, b) {
                            return this.sendPacket("message", a, b), this
                        }, d.prototype.sendPacket = function(a, b, c) {
                            if ("closing" != this.readyState && "closed" != this.readyState) {
                                var d = {
                                    type: a,
                                    data: b
                                };
                                this.emit("packetCreate", d), this.writeBuffer.push(d), this.callbackBuffer.push(c), this.flush()
                            }
                        }, d.prototype.close = function() {
                            function a() {
                                d.onClose("forced close"), h("socket closing - telling transport to close"), d.transport.close()
                            }

                            function b() {
                                d.removeListener("upgrade", b), d.removeListener("upgradeError", b), a()
                            }

                            function c() {
                                d.once("upgrade", b), d.once("upgradeError", b)
                            }
                            if ("opening" == this.readyState || "open" == this.readyState) {
                                this.readyState = "closing";
                                var d = this;
                                this.writeBuffer.length ? this.once("drain", function() {
                                    this.upgrading ? c() : a()
                                }) : this.upgrading ? c() : a()
                            }
                            return this
                        }, d.prototype.onError = function(a) {
                            h("socket error %j", a), d.priorWebsocketSuccess = !1, this.emit("error", a), this.onClose("transport error", a)
                        }, d.prototype.onClose = function(a, b) {
                            if ("opening" == this.readyState || "open" == this.readyState || "closing" == this.readyState) {
                                h('socket close with reason: "%s"', a);
                                var c = this;
                                clearTimeout(this.pingIntervalTimer), clearTimeout(this.pingTimeoutTimer), setTimeout(function() {
                                    c.writeBuffer = [], c.callbackBuffer = [], c.prevBufferLen = 0
                                }, 0), this.transport.removeAllListeners("close"), this.transport.close(), this.transport.removeAllListeners(), this.readyState = "closed", this.id = null, this.emit("close", a, b)
                            }
                        }, d.prototype.filterUpgrades = function(a) {
                            for (var b = [], c = 0, d = a.length; d > c; c++) ~i(this.transports, a[c]) && b.push(a[c]);
                            return b
                        }
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    "./transport": 14,
                    "./transports": 15,
                    "component-emitter": 9,
                    debug: 22,
                    "engine.io-parser": 25,
                    indexof: 42,
                    parsejson: 34,
                    parseqs: 35,
                    parseuri: 36
                }],
                14: [function(a, b, c) {
                    function d(a) {
                        this.path = a.path, this.hostname = a.hostname, this.port = a.port, this.secure = a.secure, this.query = a.query, this.timestampParam = a.timestampParam, this.timestampRequests = a.timestampRequests, this.readyState = "", this.agent = a.agent || !1, this.socket = a.socket, this.enablesXDR = a.enablesXDR, this.pfx = a.pfx, this.key = a.key, this.passphrase = a.passphrase, this.cert = a.cert, this.ca = a.ca, this.ciphers = a.ciphers, this.rejectUnauthorized = a.rejectUnauthorized
                    }
                    var e = a("engine.io-parser"),
                        f = a("component-emitter");
                    b.exports = d, f(d.prototype), d.timestamps = 0, d.prototype.onError = function(a, b) {
                        var c = new Error(a);
                        return c.type = "TransportError", c.description = b, this.emit("error", c), this
                    }, d.prototype.open = function() {
                        return ("closed" == this.readyState || "" == this.readyState) && (this.readyState = "opening", this.doOpen()), this
                    }, d.prototype.close = function() {
                        return ("opening" == this.readyState || "open" == this.readyState) && (this.doClose(), this.onClose()), this
                    }, d.prototype.send = function(a) {
                        if ("open" != this.readyState) throw new Error("Transport not open");
                        this.write(a)
                    }, d.prototype.onOpen = function() {
                        this.readyState = "open", this.writable = !0, this.emit("open")
                    }, d.prototype.onData = function(a) {
                        var b = e.decodePacket(a, this.socket.binaryType);
                        this.onPacket(b)
                    }, d.prototype.onPacket = function(a) {
                        this.emit("packet", a)
                    }, d.prototype.onClose = function() {
                        this.readyState = "closed", this.emit("close")
                    }
                }, {
                    "component-emitter": 9,
                    "engine.io-parser": 25
                }],
                15: [function(a, b, c) {
                    (function(b) {
                        function d(a) {
                            var c, d = !1,
                                h = !1,
                                i = !1 !== a.jsonp;
                            if (b.location) {
                                var j = "https:" == location.protocol,
                                    k = location.port;
                                k || (k = j ? 443 : 80), d = a.hostname != location.hostname || k != a.port, h = a.secure != j
                            }
                            if (a.xdomain = d, a.xscheme = h, c = new e(a), "open" in c && !a.forceJSONP) return new f(a);
                            if (!i) throw new Error("JSONP disabled");
                            return new g(a)
                        }
                        var e = a("xmlhttprequest"),
                            f = a("./polling-xhr"),
                            g = a("./polling-jsonp"),
                            h = a("./websocket");
                        c.polling = d, c.websocket = h
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    "./polling-jsonp": 16,
                    "./polling-xhr": 17,
                    "./websocket": 19,
                    xmlhttprequest: 20
                }],
                16: [function(a, b, c) {
                    (function(c) {
                        function d() {}

                        function e(a) {
                            f.call(this, a), this.query = this.query || {}, h || (c.___eio || (c.___eio = []), h = c.___eio), this.index = h.length;
                            var b = this;
                            h.push(function(a) {
                                b.onData(a)
                            }), this.query.j = this.index, c.document && c.addEventListener && c.addEventListener("beforeunload", function() {
                                b.script && (b.script.onerror = d)
                            }, !1)
                        }
                        var f = a("./polling"),
                            g = a("component-inherit");
                        b.exports = e;
                        var h, i = /\n/g,
                            j = /\\n/g;
                        g(e, f), e.prototype.supportsBinary = !1, e.prototype.doClose = function() {
                            this.script && (this.script.parentNode.removeChild(this.script), this.script = null), this.form && (this.form.parentNode.removeChild(this.form), this.form = null, this.iframe = null), f.prototype.doClose.call(this)
                        }, e.prototype.doPoll = function() {
                            var a = this,
                                b = document.createElement("script");
                            this.script && (this.script.parentNode.removeChild(this.script), this.script = null), b.async = !0, b.src = this.uri(), b.onerror = function(b) {
                                a.onError("jsonp poll error", b)
                            };
                            var c = document.getElementsByTagName("script")[0];
                            c.parentNode.insertBefore(b, c), this.script = b;
                            var d = "undefined" != typeof navigator && /gecko/i.test(navigator.userAgent);
                            d && setTimeout(function() {
                                var a = document.createElement("iframe");
                                document.body.appendChild(a), document.body.removeChild(a)
                            }, 100)
                        }, e.prototype.doWrite = function(a, b) {
                            function c() {
                                d(), b()
                            }

                            function d() {
                                if (e.iframe) try {
                                    e.form.removeChild(e.iframe)
                                } catch (a) {
                                    e.onError("jsonp polling iframe removal error", a)
                                }
                                try {
                                    var b = '<iframe src="javascript:0" name="' + e.iframeId + '">';
                                    f = document.createElement(b)
                                } catch (a) {
                                    f = document.createElement("iframe"), f.name = e.iframeId, f.src = "javascript:0"
                                }
                                f.id = e.iframeId, e.form.appendChild(f), e.iframe = f
                            }
                            var e = this;
                            if (!this.form) {
                                var f, g = document.createElement("form"),
                                    h = document.createElement("textarea"),
                                    k = this.iframeId = "eio_iframe_" + this.index;
                                g.className = "socketio", g.style.position = "absolute", g.style.top = "-1000px", g.style.left = "-1000px", g.target = k, g.method = "POST", g.setAttribute("accept-charset", "utf-8"), h.name = "d", g.appendChild(h), document.body.appendChild(g), this.form = g, this.area = h
                            }
                            this.form.action = this.uri(), d(), a = a.replace(j, "\\\n"), this.area.value = a.replace(i, "\\n");
                            try {
                                this.form.submit()
                            } catch (l) {}
                            this.iframe.attachEvent ? this.iframe.onreadystatechange = function() {
                                "complete" == e.iframe.readyState && c()
                            } : this.iframe.onload = c
                        }
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    "./polling": 18,
                    "component-inherit": 21
                }],
                17: [function(a, b, c) {
                    (function(c) {
                        function d() {}

                        function e(a) {
                            if (i.call(this, a), c.location) {
                                var b = "https:" == location.protocol,
                                    d = location.port;
                                d || (d = b ? 443 : 80), this.xd = a.hostname != c.location.hostname || d != a.port, this.xs = a.secure != b
                            }
                        }

                        function f(a) {
                            this.method = a.method || "GET", this.uri = a.uri, this.xd = !!a.xd, this.xs = !!a.xs, this.async = !1 !== a.async, this.data = void 0 != a.data ? a.data : null, this.agent = a.agent, this.isBinary = a.isBinary, this.supportsBinary = a.supportsBinary, this.enablesXDR = a.enablesXDR, this.pfx = a.pfx, this.key = a.key, this.passphrase = a.passphrase, this.cert = a.cert, this.ca = a.ca, this.ciphers = a.ciphers, this.rejectUnauthorized = a.rejectUnauthorized, this.create()
                        }

                        function g() {
                            for (var a in f.requests) f.requests.hasOwnProperty(a) && f.requests[a].abort()
                        }
                        var h = a("xmlhttprequest"),
                            i = a("./polling"),
                            j = a("component-emitter"),
                            k = a("component-inherit"),
                            l = a("debug")("engine.io-client:polling-xhr");
                        b.exports = e, b.exports.Request = f, k(e, i), e.prototype.supportsBinary = !0, e.prototype.request = function(a) {
                            return a = a || {}, a.uri = this.uri(), a.xd = this.xd, a.xs = this.xs, a.agent = this.agent || !1, a.supportsBinary = this.supportsBinary, a.enablesXDR = this.enablesXDR, a.pfx = this.pfx, a.key = this.key, a.passphrase = this.passphrase, a.cert = this.cert, a.ca = this.ca, a.ciphers = this.ciphers, a.rejectUnauthorized = this.rejectUnauthorized, new f(a)
                        }, e.prototype.doWrite = function(a, b) {
                            var c = "string" != typeof a && void 0 !== a,
                                d = this.request({
                                    method: "POST",
                                    data: a,
                                    isBinary: c
                                }),
                                e = this;
                            d.on("success", b), d.on("error", function(a) {
                                e.onError("xhr post error", a)
                            }), this.sendXhr = d
                        }, e.prototype.doPoll = function() {
                            l("xhr poll");
                            var a = this.request(),
                                b = this;
                            a.on("data", function(a) {
                                b.onData(a)
                            }), a.on("error", function(a) {
                                b.onError("xhr poll error", a)
                            }), this.pollXhr = a
                        }, j(f.prototype), f.prototype.create = function() {
                            var a = {
                                agent: this.agent,
                                xdomain: this.xd,
                                xscheme: this.xs,
                                enablesXDR: this.enablesXDR
                            };
                            a.pfx = this.pfx, a.key = this.key, a.passphrase = this.passphrase, a.cert = this.cert, a.ca = this.ca, a.ciphers = this.ciphers, a.rejectUnauthorized = this.rejectUnauthorized;
                            var b = this.xhr = new h(a),
                                d = this;
                            try {
                                if (l("xhr open %s: %s", this.method, this.uri), b.open(this.method, this.uri, this.async), this.supportsBinary && (b.responseType = "arraybuffer"), "POST" == this.method) try {
                                    this.isBinary ? b.setRequestHeader("Content-type", "application/octet-stream") : b.setRequestHeader("Content-type", "text/plain;charset=UTF-8")
                                } catch (e) {}
                                "withCredentials" in b && (b.withCredentials = !0), this.hasXDR() ? (b.onload = function() {
                                    d.onLoad()
                                }, b.onerror = function() {
                                    d.onError(b.responseText)
                                }) : b.onreadystatechange = function() {
                                    4 == b.readyState && (200 == b.status || 1223 == b.status ? d.onLoad() : setTimeout(function() {
                                        d.onError(b.status)
                                    }, 0))
                                }, l("xhr data %s", this.data), b.send(this.data)
                            } catch (e) {
                                return void setTimeout(function() {
                                    d.onError(e)
                                }, 0)
                            }
                            c.document && (this.index = f.requestsCount++, f.requests[this.index] = this)
                        }, f.prototype.onSuccess = function() {
                            this.emit("success"), this.cleanup()
                        }, f.prototype.onData = function(a) {
                            this.emit("data", a), this.onSuccess()
                        }, f.prototype.onError = function(a) {
                            this.emit("error", a), this.cleanup(!0)
                        }, f.prototype.cleanup = function(a) {
                            if ("undefined" != typeof this.xhr && null !== this.xhr) {
                                if (this.hasXDR() ? this.xhr.onload = this.xhr.onerror = d : this.xhr.onreadystatechange = d, a) try {
                                    this.xhr.abort()
                                } catch (b) {}
                                c.document && delete f.requests[this.index], this.xhr = null
                            }
                        }, f.prototype.onLoad = function() {
                            var a;
                            try {
                                var b;
                                try {
                                    b = this.xhr.getResponseHeader("Content-Type").split(";")[0]
                                } catch (c) {}
                                a = "application/octet-stream" === b ? this.xhr.response : this.supportsBinary ? "ok" : this.xhr.responseText
                            } catch (c) {
                                this.onError(c)
                            }
                            null != a && this.onData(a)
                        }, f.prototype.hasXDR = function() {
                            return "undefined" != typeof c.XDomainRequest && !this.xs && this.enablesXDR
                        }, f.prototype.abort = function() {
                            this.cleanup()
                        }, c.document && (f.requestsCount = 0, f.requests = {}, c.attachEvent ? c.attachEvent("onunload", g) : c.addEventListener && c.addEventListener("beforeunload", g, !1))
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    "./polling": 18,
                    "component-emitter": 9,
                    "component-inherit": 21,
                    debug: 22,
                    xmlhttprequest: 20
                }],
                18: [function(a, b, c) {
                    function d(a) {
                        var b = a && a.forceBase64;
                        (!j || b) && (this.supportsBinary = !1), e.call(this, a)
                    }
                    var e = a("../transport"),
                        f = a("parseqs"),
                        g = a("engine.io-parser"),
                        h = a("component-inherit"),
                        i = a("debug")("engine.io-client:polling");
                    b.exports = d;
                    var j = function() {
                        var b = a("xmlhttprequest"),
                            c = new b({
                                xdomain: !1
                            });
                        return null != c.responseType
                    }();
                    h(d, e), d.prototype.name = "polling", d.prototype.doOpen = function() {
                        this.poll()
                    }, d.prototype.pause = function(a) {
                        function b() {
                            i("paused"), c.readyState = "paused", a()
                        }
                        var c = this;
                        if (this.readyState = "pausing", this.polling || !this.writable) {
                            var d = 0;
                            this.polling && (i("we are currently polling - waiting to pause"), d++, this.once("pollComplete", function() {
                                i("pre-pause polling complete"), --d || b()
                            })), this.writable || (i("we are currently writing - waiting to pause"), d++, this.once("drain", function() {
                                i("pre-pause writing complete"), --d || b()
                            }))
                        } else b()
                    }, d.prototype.poll = function() {
                        i("polling"), this.polling = !0, this.doPoll(), this.emit("poll")
                    }, d.prototype.onData = function(a) {
                        var b = this;
                        i("polling got data %s", a);
                        var c = function(a, c, d) {
                            return "opening" == b.readyState && b.onOpen(), "close" == a.type ? (b.onClose(), !1) : void b.onPacket(a)
                        };
                        g.decodePayload(a, this.socket.binaryType, c), "closed" != this.readyState && (this.polling = !1, this.emit("pollComplete"), "open" == this.readyState ? this.poll() : i('ignoring poll - transport state "%s"', this.readyState))
                    }, d.prototype.doClose = function() {
                        function a() {
                            i("writing close packet"), b.write([{
                                type: "close"
                            }])
                        }
                        var b = this;
                        "open" == this.readyState ? (i("transport open - closing"), a()) : (i("transport not open - deferring close"), this.once("open", a))
                    }, d.prototype.write = function(a) {
                        var b = this;
                        this.writable = !1;
                        var c = function() {
                                b.writable = !0, b.emit("drain")
                            },
                            b = this;
                        g.encodePayload(a, this.supportsBinary, function(a) {
                            b.doWrite(a, c)
                        })
                    }, d.prototype.uri = function() {
                        var a = this.query || {},
                            b = this.secure ? "https" : "http",
                            c = "";
                        return !1 !== this.timestampRequests && (a[this.timestampParam] = +new Date + "-" + e.timestamps++), this.supportsBinary || a.sid || (a.b64 = 1), a = f.encode(a), this.port && ("https" == b && 443 != this.port || "http" == b && 80 != this.port) && (c = ":" + this.port), a.length && (a = "?" + a), b + "://" + this.hostname + c + this.path + a
                    }
                }, {
                    "../transport": 14,
                    "component-inherit": 21,
                    debug: 22,
                    "engine.io-parser": 25,
                    parseqs: 35,
                    xmlhttprequest: 20
                }],
                19: [function(a, b, c) {
                    function d(a) {
                        var b = a && a.forceBase64;
                        b && (this.supportsBinary = !1), e.call(this, a)
                    }
                    var e = a("../transport"),
                        f = a("engine.io-parser"),
                        g = a("parseqs"),
                        h = a("component-inherit"),
                        i = a("debug")("engine.io-client:websocket"),
                        j = a("ws");
                    b.exports = d, h(d, e), d.prototype.name = "websocket", d.prototype.supportsBinary = !0, d.prototype.doOpen = function() {
                        if (this.check()) {
                            var a = this.uri(),
                                b = void 0,
                                c = {
                                    agent: this.agent
                                };
                            c.pfx = this.pfx, c.key = this.key, c.passphrase = this.passphrase, c.cert = this.cert, c.ca = this.ca, c.ciphers = this.ciphers, c.rejectUnauthorized = this.rejectUnauthorized, this.ws = new j(a, b, c), void 0 === this.ws.binaryType && (this.supportsBinary = !1), this.ws.binaryType = "arraybuffer", this.addEventListeners()
                        }
                    }, d.prototype.addEventListeners = function() {
                        var a = this;
                        this.ws.onopen = function() {
                            a.onOpen()
                        }, this.ws.onclose = function() {
                            a.onClose()
                        }, this.ws.onmessage = function(b) {
                            a.onData(b.data)
                        }, this.ws.onerror = function(b) {
                            a.onError("websocket error", b)
                        }
                    }, "undefined" != typeof navigator && /iPad|iPhone|iPod/i.test(navigator.userAgent) && (d.prototype.onData = function(a) {
                        var b = this;
                        setTimeout(function() {
                            e.prototype.onData.call(b, a)
                        }, 0)
                    }), d.prototype.write = function(a) {
                        function b() {
                            c.writable = !0, c.emit("drain")
                        }
                        var c = this;
                        this.writable = !1;
                        for (var d = 0, e = a.length; e > d; d++) f.encodePacket(a[d], this.supportsBinary, function(a) {
                            try {
                                c.ws.send(a)
                            } catch (b) {
                                i("websocket closed before onclose event")
                            }
                        });
                        setTimeout(b, 0)
                    }, d.prototype.onClose = function() {
                        e.prototype.onClose.call(this)
                    }, d.prototype.doClose = function() {
                        "undefined" != typeof this.ws && this.ws.close()
                    }, d.prototype.uri = function() {
                        var a = this.query || {},
                            b = this.secure ? "wss" : "ws",
                            c = "";
                        return this.port && ("wss" == b && 443 != this.port || "ws" == b && 80 != this.port) && (c = ":" + this.port), this.timestampRequests && (a[this.timestampParam] = +new Date), this.supportsBinary || (a.b64 = 1), a = g.encode(a), a.length && (a = "?" + a),
                            b + "://" + this.hostname + c + this.path + a
                    }, d.prototype.check = function() {
                        return !(!j || "__initialize" in j && this.name === d.prototype.name)
                    }
                }, {
                    "../transport": 14,
                    "component-inherit": 21,
                    debug: 22,
                    "engine.io-parser": 25,
                    parseqs: 35,
                    ws: 37
                }],
                20: [function(a, b, c) {
                    var d = a("has-cors");
                    b.exports = function(a) {
                        var b = a.xdomain,
                            c = a.xscheme,
                            e = a.enablesXDR;
                        try {
                            if ("undefined" != typeof XMLHttpRequest && (!b || d)) return new XMLHttpRequest
                        } catch (f) {}
                        try {
                            if ("undefined" != typeof XDomainRequest && !c && e) return new XDomainRequest
                        } catch (f) {}
                        if (!b) try {
                            return new ActiveXObject("Microsoft.XMLHTTP")
                        } catch (f) {}
                    }
                }, {
                    "has-cors": 40
                }],
                21: [function(a, b, c) {
                    b.exports = function(a, b) {
                        var c = function() {};
                        c.prototype = b.prototype, a.prototype = new c, a.prototype.constructor = a
                    }
                }, {}],
                22: [function(a, b, c) {
                    function d() {
                        return "WebkitAppearance" in document.documentElement.style || window.console && (console.firebug || console.exception && console.table) || navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31
                    }

                    function e() {
                        var a = arguments,
                            b = this.useColors;
                        if (a[0] = (b ? "%c" : "") + this.namespace + (b ? " %c" : " ") + a[0] + (b ? "%c " : " ") + "+" + c.humanize(this.diff), !b) return a;
                        var d = "color: " + this.color;
                        a = [a[0], d, "color: inherit"].concat(Array.prototype.slice.call(a, 1));
                        var e = 0,
                            f = 0;
                        return a[0].replace(/%[a-z%]/g, function(a) {
                            "%" !== a && (e++, "%c" === a && (f = e))
                        }), a.splice(f, 0, d), a
                    }

                    function f() {
                        return "object" == typeof console && "function" == typeof console.log && Function.prototype.apply.call(console.log, console, arguments)
                    }

                    function g(a) {
                        try {
                            null == a ? localStorage.removeItem("debug") : localStorage.debug = a
                        } catch (b) {}
                    }

                    function h() {
                        var a;
                        try {
                            a = localStorage.debug
                        } catch (b) {}
                        return a
                    }
                    c = b.exports = a("./debug"), c.log = f, c.formatArgs = e, c.save = g, c.load = h, c.useColors = d, c.colors = ["lightseagreen", "forestgreen", "goldenrod", "dodgerblue", "darkorchid", "crimson"], c.formatters.j = function(a) {
                        return JSON.stringify(a)
                    }, c.enable(h())
                }, {
                    "./debug": 23
                }],
                23: [function(a, b, c) {
                    function d() {
                        return c.colors[k++ % c.colors.length]
                    }

                    function e(a) {
                        function b() {}

                        function e() {
                            var a = e,
                                b = +new Date,
                                f = b - (j || b);
                            a.diff = f, a.prev = j, a.curr = b, j = b, null == a.useColors && (a.useColors = c.useColors()), null == a.color && a.useColors && (a.color = d());
                            var g = Array.prototype.slice.call(arguments);
                            g[0] = c.coerce(g[0]), "string" != typeof g[0] && (g = ["%o"].concat(g));
                            var h = 0;
                            g[0] = g[0].replace(/%([a-z%])/g, function(b, d) {
                                if ("%" === b) return b;
                                h++;
                                var e = c.formatters[d];
                                if ("function" == typeof e) {
                                    var f = g[h];
                                    b = e.call(a, f), g.splice(h, 1), h--
                                }
                                return b
                            }), "function" == typeof c.formatArgs && (g = c.formatArgs.apply(a, g));
                            var i = e.log || c.log || console.log.bind(console);
                            i.apply(a, g)
                        }
                        b.enabled = !1, e.enabled = !0;
                        var f = c.enabled(a) ? e : b;
                        return f.namespace = a, f
                    }

                    function f(a) {
                        c.save(a);
                        for (var b = (a || "").split(/[\s,]+/), d = b.length, e = 0; d > e; e++) b[e] && (a = b[e].replace(/\*/g, ".*?"), "-" === a[0] ? c.skips.push(new RegExp("^" + a.substr(1) + "$")) : c.names.push(new RegExp("^" + a + "$")))
                    }

                    function g() {
                        c.enable("")
                    }

                    function h(a) {
                        var b, d;
                        for (b = 0, d = c.skips.length; d > b; b++)
                            if (c.skips[b].test(a)) return !1;
                        for (b = 0, d = c.names.length; d > b; b++)
                            if (c.names[b].test(a)) return !0;
                        return !1
                    }

                    function i(a) {
                        return a instanceof Error ? a.stack || a.message : a
                    }
                    c = b.exports = e, c.coerce = i, c.disable = g, c.enable = f, c.enabled = h, c.humanize = a("ms"), c.names = [], c.skips = [], c.formatters = {};
                    var j, k = 0
                }, {
                    ms: 24
                }],
                24: [function(a, b, c) {
                    function d(a) {
                        var b = /^((?:\d+)?\.?\d+) *(ms|seconds?|s|minutes?|m|hours?|h|days?|d|years?|y)?$/i.exec(a);
                        if (b) {
                            var c = parseFloat(b[1]),
                                d = (b[2] || "ms").toLowerCase();
                            switch (d) {
                                case "years":
                                case "year":
                                case "y":
                                    return c * l;
                                case "days":
                                case "day":
                                case "d":
                                    return c * k;
                                case "hours":
                                case "hour":
                                case "h":
                                    return c * j;
                                case "minutes":
                                case "minute":
                                case "m":
                                    return c * i;
                                case "seconds":
                                case "second":
                                case "s":
                                    return c * h;
                                case "ms":
                                    return c
                            }
                        }
                    }

                    function e(a) {
                        return a >= k ? Math.round(a / k) + "d" : a >= j ? Math.round(a / j) + "h" : a >= i ? Math.round(a / i) + "m" : a >= h ? Math.round(a / h) + "s" : a + "ms"
                    }

                    function f(a) {
                        return g(a, k, "day") || g(a, j, "hour") || g(a, i, "minute") || g(a, h, "second") || a + " ms"
                    }

                    function g(a, b, c) {
                        return b > a ? void 0 : 1.5 * b > a ? Math.floor(a / b) + " " + c : Math.ceil(a / b) + " " + c + "s"
                    }
                    var h = 1e3,
                        i = 60 * h,
                        j = 60 * i,
                        k = 24 * j,
                        l = 365.25 * k;
                    b.exports = function(a, b) {
                        return b = b || {}, "string" == typeof a ? d(a) : b["long"] ? f(a) : e(a)
                    }
                }, {}],
                25: [function(a, b, c) {
                    (function(b) {
                        function d(a, b) {
                            var d = "b" + c.packets[a.type] + a.data.data;
                            return b(d)
                        }

                        function e(a, b, d) {
                            if (!b) return c.encodeBase64Packet(a, d);
                            var e = a.data,
                                f = new Uint8Array(e),
                                g = new Uint8Array(1 + e.byteLength);
                            g[0] = r[a.type];
                            for (var h = 0; h < f.length; h++) g[h + 1] = f[h];
                            return d(g.buffer)
                        }

                        function f(a, b, d) {
                            if (!b) return c.encodeBase64Packet(a, d);
                            var e = new FileReader;
                            return e.onload = function() {
                                a.data = e.result, c.encodePacket(a, b, !0, d)
                            }, e.readAsArrayBuffer(a.data)
                        }

                        function g(a, b, d) {
                            if (!b) return c.encodeBase64Packet(a, d);
                            if (q) return f(a, b, d);
                            var e = new Uint8Array(1);
                            e[0] = r[a.type];
                            var g = new u([e.buffer, a.data]);
                            return d(g)
                        }

                        function h(a, b, c) {
                            for (var d = new Array(a.length), e = m(a.length, c), f = function(a, c, e) {
                                    b(c, function(b, c) {
                                        d[a] = c, e(b, d)
                                    })
                                }, g = 0; g < a.length; g++) f(g, a[g], e)
                        }
                        var i = a("./keys"),
                            j = a("has-binary"),
                            k = a("arraybuffer.slice"),
                            l = a("base64-arraybuffer"),
                            m = a("after"),
                            n = a("utf8"),
                            o = navigator.userAgent.match(/Android/i),
                            p = /PhantomJS/i.test(navigator.userAgent),
                            q = o || p;
                        c.protocol = 3;
                        var r = c.packets = {
                                open: 0,
                                close: 1,
                                ping: 2,
                                pong: 3,
                                message: 4,
                                upgrade: 5,
                                noop: 6
                            },
                            s = i(r),
                            t = {
                                type: "error",
                                data: "parser error"
                            },
                            u = a("blob");
                        c.encodePacket = function(a, c, f, h) {
                            "function" == typeof c && (h = c, c = !1), "function" == typeof f && (h = f, f = null);
                            var i = void 0 === a.data ? void 0 : a.data.buffer || a.data;
                            if (b.ArrayBuffer && i instanceof ArrayBuffer) return e(a, c, h);
                            if (u && i instanceof b.Blob) return g(a, c, h);
                            if (i && i.base64) return d(a, h);
                            var j = r[a.type];
                            return void 0 !== a.data && (j += f ? n.encode(String(a.data)) : String(a.data)), h("" + j)
                        }, c.encodeBase64Packet = function(a, d) {
                            var e = "b" + c.packets[a.type];
                            if (u && a.data instanceof u) {
                                var f = new FileReader;
                                return f.onload = function() {
                                    var a = f.result.split(",")[1];
                                    d(e + a)
                                }, f.readAsDataURL(a.data)
                            }
                            var g;
                            try {
                                g = String.fromCharCode.apply(null, new Uint8Array(a.data))
                            } catch (h) {
                                for (var i = new Uint8Array(a.data), j = new Array(i.length), k = 0; k < i.length; k++) j[k] = i[k];
                                g = String.fromCharCode.apply(null, j)
                            }
                            return e += b.btoa(g), d(e)
                        }, c.decodePacket = function(a, b, d) {
                            if ("string" == typeof a || void 0 === a) {
                                if ("b" == a.charAt(0)) return c.decodeBase64Packet(a.substr(1), b);
                                if (d) try {
                                    a = n.decode(a)
                                } catch (e) {
                                    return t
                                }
                                var f = a.charAt(0);
                                return Number(f) == f && s[f] ? a.length > 1 ? {
                                    type: s[f],
                                    data: a.substring(1)
                                } : {
                                    type: s[f]
                                } : t
                            }
                            var g = new Uint8Array(a),
                                f = g[0],
                                h = k(a, 1);
                            return u && "blob" === b && (h = new u([h])), {
                                type: s[f],
                                data: h
                            }
                        }, c.decodeBase64Packet = function(a, c) {
                            var d = s[a.charAt(0)];
                            if (!b.ArrayBuffer) return {
                                type: d,
                                data: {
                                    base64: !0,
                                    data: a.substr(1)
                                }
                            };
                            var e = l.decode(a.substr(1));
                            return "blob" === c && u && (e = new u([e])), {
                                type: d,
                                data: e
                            }
                        }, c.encodePayload = function(a, b, d) {
                            function e(a) {
                                return a.length + ":" + a
                            }

                            function f(a, d) {
                                c.encodePacket(a, g ? b : !1, !0, function(a) {
                                    d(null, e(a))
                                })
                            }
                            "function" == typeof b && (d = b, b = null);
                            var g = j(a);
                            return b && g ? u && !q ? c.encodePayloadAsBlob(a, d) : c.encodePayloadAsArrayBuffer(a, d) : a.length ? void h(a, f, function(a, b) {
                                return d(b.join(""))
                            }) : d("0:")
                        }, c.decodePayload = function(a, b, d) {
                            if ("string" != typeof a) return c.decodePayloadAsBinary(a, b, d);
                            "function" == typeof b && (d = b, b = null);
                            var e;
                            if ("" == a) return d(t, 0, 1);
                            for (var f, g, h = "", i = 0, j = a.length; j > i; i++) {
                                var k = a.charAt(i);
                                if (":" != k) h += k;
                                else {
                                    if ("" == h || h != (f = Number(h))) return d(t, 0, 1);
                                    if (g = a.substr(i + 1, f), h != g.length) return d(t, 0, 1);
                                    if (g.length) {
                                        if (e = c.decodePacket(g, b, !0), t.type == e.type && t.data == e.data) return d(t, 0, 1);
                                        var l = d(e, i + f, j);
                                        if (!1 === l) return
                                    }
                                    i += f, h = ""
                                }
                            }
                            return "" != h ? d(t, 0, 1) : void 0
                        }, c.encodePayloadAsArrayBuffer = function(a, b) {
                            function d(a, b) {
                                c.encodePacket(a, !0, !0, function(a) {
                                    return b(null, a)
                                })
                            }
                            return a.length ? void h(a, d, function(a, c) {
                                var d = c.reduce(function(a, b) {
                                        var c;
                                        return c = "string" == typeof b ? b.length : b.byteLength, a + c.toString().length + c + 2
                                    }, 0),
                                    e = new Uint8Array(d),
                                    f = 0;
                                return c.forEach(function(a) {
                                    var b = "string" == typeof a,
                                        c = a;
                                    if (b) {
                                        for (var d = new Uint8Array(a.length), g = 0; g < a.length; g++) d[g] = a.charCodeAt(g);
                                        c = d.buffer
                                    }
                                    b ? e[f++] = 0 : e[f++] = 1;
                                    for (var h = c.byteLength.toString(), g = 0; g < h.length; g++) e[f++] = parseInt(h[g]);
                                    e[f++] = 255;
                                    for (var d = new Uint8Array(c), g = 0; g < d.length; g++) e[f++] = d[g]
                                }), b(e.buffer)
                            }) : b(new ArrayBuffer(0))
                        }, c.encodePayloadAsBlob = function(a, b) {
                            function d(a, b) {
                                c.encodePacket(a, !0, !0, function(a) {
                                    var c = new Uint8Array(1);
                                    if (c[0] = 1, "string" == typeof a) {
                                        for (var d = new Uint8Array(a.length), e = 0; e < a.length; e++) d[e] = a.charCodeAt(e);
                                        a = d.buffer, c[0] = 0
                                    }
                                    for (var f = a instanceof ArrayBuffer ? a.byteLength : a.size, g = f.toString(), h = new Uint8Array(g.length + 1), e = 0; e < g.length; e++) h[e] = parseInt(g[e]);
                                    if (h[g.length] = 255, u) {
                                        var i = new u([c.buffer, h.buffer, a]);
                                        b(null, i)
                                    }
                                })
                            }
                            h(a, d, function(a, c) {
                                return b(new u(c))
                            })
                        }, c.decodePayloadAsBinary = function(a, b, d) {
                            "function" == typeof b && (d = b, b = null);
                            for (var e = a, f = [], g = !1; e.byteLength > 0;) {
                                for (var h = new Uint8Array(e), i = 0 === h[0], j = "", l = 1; 255 != h[l]; l++) {
                                    if (j.length > 310) {
                                        g = !0;
                                        break
                                    }
                                    j += h[l]
                                }
                                if (g) return d(t, 0, 1);
                                e = k(e, 2 + j.length), j = parseInt(j);
                                var m = k(e, 0, j);
                                if (i) try {
                                    m = String.fromCharCode.apply(null, new Uint8Array(m))
                                } catch (n) {
                                    var o = new Uint8Array(m);
                                    m = "";
                                    for (var l = 0; l < o.length; l++) m += String.fromCharCode(o[l])
                                }
                                f.push(m), e = k(e, j)
                            }
                            var p = f.length;
                            f.forEach(function(a, e) {
                                d(c.decodePacket(a, b, !0), e, p)
                            })
                        }
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    "./keys": 26,
                    after: 27,
                    "arraybuffer.slice": 28,
                    "base64-arraybuffer": 29,
                    blob: 30,
                    "has-binary": 31,
                    utf8: 33
                }],
                26: [function(a, b, c) {
                    b.exports = Object.keys || function(a) {
                        var b = [],
                            c = Object.prototype.hasOwnProperty;
                        for (var d in a) c.call(a, d) && b.push(d);
                        return b
                    }
                }, {}],
                27: [function(a, b, c) {
                    function d(a, b, c) {
                        function d(a, e) {
                            if (d.count <= 0) throw new Error("after called too many times");
                            --d.count, a ? (f = !0, b(a), b = c) : 0 !== d.count || f || b(null, e)
                        }
                        var f = !1;
                        return c = c || e, d.count = a, 0 === a ? b() : d
                    }

                    function e() {}
                    b.exports = d
                }, {}],
                28: [function(a, b, c) {
                    b.exports = function(a, b, c) {
                        var d = a.byteLength;
                        if (b = b || 0, c = c || d, a.slice) return a.slice(b, c);
                        if (0 > b && (b += d), 0 > c && (c += d), c > d && (c = d), b >= d || b >= c || 0 === d) return new ArrayBuffer(0);
                        for (var e = new Uint8Array(a), f = new Uint8Array(c - b), g = b, h = 0; c > g; g++, h++) f[h] = e[g];
                        return f.buffer
                    }
                }, {}],
                29: [function(a, b, c) {
                    ! function(a) {
                        "use strict";
                        c.encode = function(b) {
                            var c, d = new Uint8Array(b),
                                e = d.length,
                                f = "";
                            for (c = 0; e > c; c += 3) f += a[d[c] >> 2], f += a[(3 & d[c]) << 4 | d[c + 1] >> 4], f += a[(15 & d[c + 1]) << 2 | d[c + 2] >> 6], f += a[63 & d[c + 2]];
                            return e % 3 === 2 ? f = f.substring(0, f.length - 1) + "=" : e % 3 === 1 && (f = f.substring(0, f.length - 2) + "=="), f
                        }, c.decode = function(b) {
                            var c, d, e, f, g, h = .75 * b.length,
                                i = b.length,
                                j = 0;
                            "=" === b[b.length - 1] && (h--, "=" === b[b.length - 2] && h--);
                            var k = new ArrayBuffer(h),
                                l = new Uint8Array(k);
                            for (c = 0; i > c; c += 4) d = a.indexOf(b[c]), e = a.indexOf(b[c + 1]), f = a.indexOf(b[c + 2]), g = a.indexOf(b[c + 3]), l[j++] = d << 2 | e >> 4, l[j++] = (15 & e) << 4 | f >> 2, l[j++] = (3 & f) << 6 | 63 & g;
                            return k
                        }
                    }("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/")
                }, {}],
                30: [function(a, b, c) {
                    (function(a) {
                        function c(a, b) {
                            b = b || {};
                            for (var c = new d, e = 0; e < a.length; e++) c.append(a[e]);
                            return b.type ? c.getBlob(b.type) : c.getBlob()
                        }
                        var d = a.BlobBuilder || a.WebKitBlobBuilder || a.MSBlobBuilder || a.MozBlobBuilder,
                            e = function() {
                                try {
                                    var a = new Blob(["hi"]);
                                    return 2 == a.size
                                } catch (b) {
                                    return !1
                                }
                            }(),
                            f = d && d.prototype.append && d.prototype.getBlob;
                        b.exports = function() {
                            return e ? a.Blob : f ? c : void 0
                        }()
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {}],
                31: [function(a, b, c) {
                    (function(c) {
                        function d(a) {
                            function b(a) {
                                if (!a) return !1;
                                if (c.Buffer && c.Buffer.isBuffer(a) || c.ArrayBuffer && a instanceof ArrayBuffer || c.Blob && a instanceof Blob || c.File && a instanceof File) return !0;
                                if (e(a)) {
                                    for (var d = 0; d < a.length; d++)
                                        if (b(a[d])) return !0
                                } else if (a && "object" == typeof a) {
                                    a.toJSON && (a = a.toJSON());
                                    for (var f in a)
                                        if (a.hasOwnProperty(f) && b(a[f])) return !0
                                }
                                return !1
                            }
                            return b(a)
                        }
                        var e = a("isarray");
                        b.exports = d
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    isarray: 32
                }],
                32: [function(a, b, c) {
                    b.exports = Array.isArray || function(a) {
                        return "[object Array]" == Object.prototype.toString.call(a)
                    }
                }, {}],
                33: [function(b, c, d) {
                    (function(b) {
                        ! function(e) {
                            function f(a) {
                                for (var b, c, d = [], e = 0, f = a.length; f > e;) b = a.charCodeAt(e++), b >= 55296 && 56319 >= b && f > e ? (c = a.charCodeAt(e++), 56320 == (64512 & c) ? d.push(((1023 & b) << 10) + (1023 & c) + 65536) : (d.push(b), e--)) : d.push(b);
                                return d
                            }

                            function g(a) {
                                for (var b, c = a.length, d = -1, e = ""; ++d < c;) b = a[d], b > 65535 && (b -= 65536, e += t(b >>> 10 & 1023 | 55296), b = 56320 | 1023 & b), e += t(b);
                                return e
                            }

                            function h(a, b) {
                                return t(a >> b & 63 | 128)
                            }

                            function i(a) {
                                if (0 == (4294967168 & a)) return t(a);
                                var b = "";
                                return 0 == (4294965248 & a) ? b = t(a >> 6 & 31 | 192) : 0 == (4294901760 & a) ? (b = t(a >> 12 & 15 | 224), b += h(a, 6)) : 0 == (4292870144 & a) && (b = t(a >> 18 & 7 | 240), b += h(a, 12), b += h(a, 6)), b += t(63 & a | 128)
                            }

                            function j(a) {
                                for (var b, c = f(a), d = c.length, e = -1, g = ""; ++e < d;) b = c[e], g += i(b);
                                return g
                            }

                            function k() {
                                if (s >= r) throw Error("Invalid byte index");
                                var a = 255 & q[s];
                                if (s++, 128 == (192 & a)) return 63 & a;
                                throw Error("Invalid continuation byte")
                            }

                            function l() {
                                var a, b, c, d, e;
                                if (s > r) throw Error("Invalid byte index");
                                if (s == r) return !1;
                                if (a = 255 & q[s], s++, 0 == (128 & a)) return a;
                                if (192 == (224 & a)) {
                                    var b = k();
                                    if (e = (31 & a) << 6 | b, e >= 128) return e;
                                    throw Error("Invalid continuation byte")
                                }
                                if (224 == (240 & a)) {
                                    if (b = k(), c = k(), e = (15 & a) << 12 | b << 6 | c, e >= 2048) return e;
                                    throw Error("Invalid continuation byte")
                                }
                                if (240 == (248 & a) && (b = k(), c = k(), d = k(), e = (15 & a) << 18 | b << 12 | c << 6 | d, e >= 65536 && 1114111 >= e)) return e;
                                throw Error("Invalid UTF-8 detected")
                            }

                            function m(a) {
                                q = f(a), r = q.length, s = 0;
                                for (var b, c = [];
                                    (b = l()) !== !1;) c.push(b);
                                return g(c)
                            }
                            var n = "object" == typeof d && d,
                                o = "object" == typeof c && c && c.exports == n && c,
                                p = "object" == typeof b && b;
                            (p.global === p || p.window === p) && (e = p);
                            var q, r, s, t = String.fromCharCode,
                                u = {
                                    version: "2.0.0",
                                    encode: j,
                                    decode: m
                                };
                            if ("function" == typeof a && "object" == typeof a.amd && a.amd) a(function() {
                                return u
                            });
                            else if (n && !n.nodeType)
                                if (o) o.exports = u;
                                else {
                                    var v = {},
                                        w = v.hasOwnProperty;
                                    for (var x in u) w.call(u, x) && (n[x] = u[x])
                                } else e.utf8 = u
                        }(this)
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {}],
                34: [function(a, b, c) {
                    (function(a) {
                        var c = /^[\],:{}\s]*$/,
                            d = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
                            e = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
                            f = /(?:^|:|,)(?:\s*\[)+/g,
                            g = /^\s+/,
                            h = /\s+$/;
                        b.exports = function(b) {
                            return "string" == typeof b && b ? (b = b.replace(g, "").replace(h, ""), a.JSON && JSON.parse ? JSON.parse(b) : c.test(b.replace(d, "@").replace(e, "]").replace(f, "")) ? new Function("return " + b)() : void 0) : null
                        }
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {}],
                35: [function(a, b, c) {
                    c.encode = function(a) {
                        var b = "";
                        for (var c in a) a.hasOwnProperty(c) && (b.length && (b += "&"), b += encodeURIComponent(c) + "=" + encodeURIComponent(a[c]));
                        return b
                    }, c.decode = function(a) {
                        for (var b = {}, c = a.split("&"), d = 0, e = c.length; e > d; d++) {
                            var f = c[d].split("=");
                            b[decodeURIComponent(f[0])] = decodeURIComponent(f[1])
                        }
                        return b
                    }
                }, {}],
                36: [function(a, b, c) {
                    var d = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                        e = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
                    b.exports = function(a) {
                        var b = a,
                            c = a.indexOf("["),
                            f = a.indexOf("]"); - 1 != c && -1 != f && (a = a.substring(0, c) + a.substring(c, f).replace(/:/g, ";") + a.substring(f, a.length));
                        for (var g = d.exec(a || ""), h = {}, i = 14; i--;) h[e[i]] = g[i] || "";
                        return -1 != c && -1 != f && (h.source = b, h.host = h.host.substring(1, h.host.length - 1).replace(/;/g, ":"), h.authority = h.authority.replace("[", "").replace("]", "").replace(/;/g, ":"), h.ipv6uri = !0), h
                    }
                }, {}],
                37: [function(a, b, c) {
                    function d(a, b, c) {
                        var d;
                        return d = b ? new f(a, b) : new f(a)
                    }
                    var e = function() {
                            return this
                        }(),
                        f = e.WebSocket || e.MozWebSocket;
                    b.exports = f ? d : null, f && (d.prototype = f.prototype)
                }, {}],
                38: [function(a, b, c) {
                    (function(c) {
                        function d(a) {
                            function b(a) {
                                if (!a) return !1;
                                if (c.Buffer && c.Buffer.isBuffer(a) || c.ArrayBuffer && a instanceof ArrayBuffer || c.Blob && a instanceof Blob || c.File && a instanceof File) return !0;
                                if (e(a)) {
                                    for (var d = 0; d < a.length; d++)
                                        if (b(a[d])) return !0
                                } else if (a && "object" == typeof a) {
                                    a.toJSON && (a = a.toJSON());
                                    for (var f in a)
                                        if (Object.prototype.hasOwnProperty.call(a, f) && b(a[f])) return !0
                                }
                                return !1
                            }
                            return b(a)
                        }
                        var e = a("isarray");
                        b.exports = d
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    isarray: 39
                }],
                39: [function(a, b, c) {
                    b.exports = a(32)
                }, {}],
                40: [function(a, b, c) {
                    var d = a("global");
                    try {
                        b.exports = "XMLHttpRequest" in d && "withCredentials" in new d.XMLHttpRequest
                    } catch (e) {
                        b.exports = !1
                    }
                }, {
                    global: 41
                }],
                41: [function(a, b, c) {
                    b.exports = function() {
                        return this
                    }()
                }, {}],
                42: [function(a, b, c) {
                    var d = [].indexOf;
                    b.exports = function(a, b) {
                        if (d) return a.indexOf(b);
                        for (var c = 0; c < a.length; ++c)
                            if (a[c] === b) return c;
                        return -1
                    }
                }, {}],
                43: [function(a, b, c) {
                    var d = Object.prototype.hasOwnProperty;
                    c.keys = Object.keys || function(a) {
                        var b = [];
                        for (var c in a) d.call(a, c) && b.push(c);
                        return b
                    }, c.values = function(a) {
                        var b = [];
                        for (var c in a) d.call(a, c) && b.push(a[c]);
                        return b
                    }, c.merge = function(a, b) {
                        for (var c in b) d.call(b, c) && (a[c] = b[c]);
                        return a
                    }, c.length = function(a) {
                        return c.keys(a).length
                    }, c.isEmpty = function(a) {
                        return 0 == c.length(a)
                    }
                }, {}],
                44: [function(a, b, c) {
                    var d = /^(?:(?![^:@]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,
                        e = ["source", "protocol", "authority", "userInfo", "user", "password", "host", "port", "relative", "path", "directory", "file", "query", "anchor"];
                    b.exports = function(a) {
                        for (var b = d.exec(a || ""), c = {}, f = 14; f--;) c[e[f]] = b[f] || "";
                        return c
                    }
                }, {}],
                45: [function(a, b, c) {
                    (function(b) {
                        var d = a("isarray"),
                            e = a("./is-buffer");
                        c.deconstructPacket = function(a) {
                            function b(a) {
                                if (!a) return a;
                                if (e(a)) {
                                    var f = {
                                        _placeholder: !0,
                                        num: c.length
                                    };
                                    return c.push(a), f
                                }
                                if (d(a)) {
                                    for (var g = new Array(a.length), h = 0; h < a.length; h++) g[h] = b(a[h]);
                                    return g
                                }
                                if ("object" == typeof a && !(a instanceof Date)) {
                                    var g = {};
                                    for (var i in a) g[i] = b(a[i]);
                                    return g
                                }
                                return a
                            }
                            var c = [],
                                f = a.data,
                                g = a;
                            return g.data = b(f), g.attachments = c.length, {
                                packet: g,
                                buffers: c
                            }
                        }, c.reconstructPacket = function(a, b) {
                            function c(a) {
                                if (a && a._placeholder) {
                                    var e = b[a.num];
                                    return e
                                }
                                if (d(a)) {
                                    for (var f = 0; f < a.length; f++) a[f] = c(a[f]);
                                    return a
                                }
                                if (a && "object" == typeof a) {
                                    for (var g in a) a[g] = c(a[g]);
                                    return a
                                }
                                return a
                            }
                            return a.data = c(a.data), a.attachments = void 0, a
                        }, c.removeBlobs = function(a, c) {
                            function f(a, i, j) {
                                if (!a) return a;
                                if (b.Blob && a instanceof Blob || b.File && a instanceof File) {
                                    g++;
                                    var k = new FileReader;
                                    k.onload = function() {
                                        j ? j[i] = this.result : h = this.result, --g || c(h)
                                    }, k.readAsArrayBuffer(a)
                                } else if (d(a))
                                    for (var l = 0; l < a.length; l++) f(a[l], l, a);
                                else if (a && "object" == typeof a && !e(a))
                                    for (var m in a) f(a[m], m, a)
                            }
                            var g = 0,
                                h = a;
                            f(h), g || c(h)
                        }
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {
                    "./is-buffer": 47,
                    isarray: 48
                }],
                46: [function(a, b, c) {
                    function d() {}

                    function e(a) {
                        var b = "",
                            d = !1;
                        return b += a.type, (c.BINARY_EVENT == a.type || c.BINARY_ACK == a.type) && (b += a.attachments, b += "-"), a.nsp && "/" != a.nsp && (d = !0, b += a.nsp), null != a.id && (d && (b += ",", d = !1), b += a.id), null != a.data && (d && (b += ","), b += l.stringify(a.data)), k("encoded %j as %s", a, b), b
                    }

                    function f(a, b) {
                        function c(a) {
                            var c = n.deconstructPacket(a),
                                d = e(c.packet),
                                f = c.buffers;
                            f.unshift(d), b(f)
                        }
                        n.removeBlobs(a, c)
                    }

                    function g() {
                        this.reconstructor = null
                    }

                    function h(a) {
                        var b = {},
                            d = 0;
                        if (b.type = Number(a.charAt(0)), null == c.types[b.type]) return j();
                        if (c.BINARY_EVENT == b.type || c.BINARY_ACK == b.type) {
                            for (var e = "";
                                "-" != a.charAt(++d) && (e += a.charAt(d), d != a.length););
                            if (e != Number(e) || "-" != a.charAt(d)) throw new Error("Illegal attachments");
                            b.attachments = Number(e)
                        }
                        if ("/" == a.charAt(d + 1))
                            for (b.nsp = ""; ++d;) {
                                var f = a.charAt(d);
                                if ("," == f) break;
                                if (b.nsp += f, d == a.length) break
                            } else b.nsp = "/";
                        var g = a.charAt(d + 1);
                        if ("" !== g && Number(g) == g) {
                            for (b.id = ""; ++d;) {
                                var f = a.charAt(d);
                                if (null == f || Number(f) != f) {
                                    --d;
                                    break
                                }
                                if (b.id += a.charAt(d), d == a.length) break
                            }
                            b.id = Number(b.id)
                        }
                        if (a.charAt(++d)) try {
                            b.data = l.parse(a.substr(d))
                        } catch (h) {
                            return j()
                        }
                        return k("decoded %s as %j", a, b), b
                    }

                    function i(a) {
                        this.reconPack = a, this.buffers = []
                    }

                    function j(a) {
                        return {
                            type: c.ERROR,
                            data: "parser error"
                        }
                    }
                    var k = a("debug")("socket.io-parser"),
                        l = a("json3"),
                        m = (a("isarray"), a("component-emitter")),
                        n = a("./binary"),
                        o = a("./is-buffer");
                    c.protocol = 4, c.types = ["CONNECT", "DISCONNECT", "EVENT", "BINARY_EVENT", "ACK", "BINARY_ACK", "ERROR"], c.CONNECT = 0, c.DISCONNECT = 1, c.EVENT = 2, c.ACK = 3, c.ERROR = 4, c.BINARY_EVENT = 5, c.BINARY_ACK = 6, c.Encoder = d, c.Decoder = g, d.prototype.encode = function(a, b) {
                        if (k("encoding packet %j", a), c.BINARY_EVENT == a.type || c.BINARY_ACK == a.type) f(a, b);
                        else {
                            var d = e(a);
                            b([d])
                        }
                    }, m(g.prototype), g.prototype.add = function(a) {
                        var b;
                        if ("string" == typeof a) b = h(a), c.BINARY_EVENT == b.type || c.BINARY_ACK == b.type ? (this.reconstructor = new i(b), 0 === this.reconstructor.reconPack.attachments && this.emit("decoded", b)) : this.emit("decoded", b);
                        else {
                            if (!o(a) && !a.base64) throw new Error("Unknown type: " + a);
                            if (!this.reconstructor) throw new Error("got binary data when not reconstructing a packet");
                            b = this.reconstructor.takeBinaryData(a), b && (this.reconstructor = null, this.emit("decoded", b))
                        }
                    }, g.prototype.destroy = function() {
                        this.reconstructor && this.reconstructor.finishedReconstruction()
                    }, i.prototype.takeBinaryData = function(a) {
                        if (this.buffers.push(a), this.buffers.length == this.reconPack.attachments) {
                            var b = n.reconstructPacket(this.reconPack, this.buffers);
                            return this.finishedReconstruction(), b
                        }
                        return null
                    }, i.prototype.finishedReconstruction = function() {
                        this.reconPack = null, this.buffers = []
                    }
                }, {
                    "./binary": 45,
                    "./is-buffer": 47,
                    "component-emitter": 9,
                    debug: 10,
                    isarray: 48,
                    json3: 49
                }],
                47: [function(a, b, c) {
                    (function(a) {
                        function c(b) {
                            return a.Buffer && a.Buffer.isBuffer(b) || a.ArrayBuffer && b instanceof ArrayBuffer
                        }
                        b.exports = c
                    }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                }, {}],
                48: [function(a, b, c) {
                    b.exports = a(32)
                }, {}],
                49: [function(b, c, d) {
                    ! function(b) {
                        function c(a) {
                            if (c[a] !== g) return c[a];
                            var b;
                            if ("bug-string-char-index" == a) b = "a" != "a" [0];
                            else if ("json" == a) b = c("json-stringify") && c("json-parse");
                            else {
                                var d, e = '{"a":[1,true,false,null,"\\u0000\\b\\n\\f\\r\\t"]}';
                                if ("json-stringify" == a) {
                                    var f = k.stringify,
                                        i = "function" == typeof f && l;
                                    if (i) {
                                        (d = function() {
                                            return 1
                                        }).toJSON = d;
                                        try {
                                            i = "0" === f(0) && "0" === f(new Number) && '""' == f(new String) && f(h) === g && f(g) === g && f() === g && "1" === f(d) && "[1]" == f([d]) && "[null]" == f([g]) && "null" == f(null) && "[null,null,null]" == f([g, h, null]) && f({
                                                a: [d, !0, !1, null, "\x00\b\n\f\r "]
                                            }) == e && "1" === f(null, d) && "[\n 1,\n 2\n]" == f([1, 2], null, 1) && '"-271821-04-20T00:00:00.000Z"' == f(new Date(-864e13)) && '"+275760-09-13T00:00:00.000Z"' == f(new Date(864e13)) && '"-000001-01-01T00:00:00.000Z"' == f(new Date(-621987552e5)) && '"1969-12-31T23:59:59.999Z"' == f(new Date(-1))
                                        } catch (j) {
                                            i = !1
                                        }
                                    }
                                    b = i
                                }
                                if ("json-parse" == a) {
                                    var m = k.parse;
                                    if ("function" == typeof m) try {
                                        if (0 === m("0") && !m(!1)) {
                                            d = m(e);
                                            var n = 5 == d.a.length && 1 === d.a[0];
                                            if (n) {
                                                try {
                                                    n = !m('"  "')
                                                } catch (j) {}
                                                if (n) try {
                                                    n = 1 !== m("01")
                                                } catch (j) {}
                                                if (n) try {
                                                    n = 1 !== m("1.")
                                                } catch (j) {}
                                            }
                                        }
                                    } catch (j) {
                                        n = !1
                                    }
                                    b = n
                                }
                            }
                            return c[a] = !!b
                        }
                        var e, f, g, h = {}.toString,
                            i = "function" == typeof a && a.amd,
                            j = "object" == typeof JSON && JSON,
                            k = "object" == typeof d && d && !d.nodeType && d;
                        k && j ? (k.stringify = j.stringify, k.parse = j.parse) : k = b.JSON = j || {};
                        var l = new Date(-0xc782b5b800cec);
                        try {
                            l = -109252 == l.getUTCFullYear() && 0 === l.getUTCMonth() && 1 === l.getUTCDate() && 10 == l.getUTCHours() && 37 == l.getUTCMinutes() && 6 == l.getUTCSeconds() && 708 == l.getUTCMilliseconds()
                        } catch (m) {}
                        if (!c("json")) {
                            var n = "[object Function]",
                                o = "[object Date]",
                                p = "[object Number]",
                                q = "[object String]",
                                r = "[object Array]",
                                s = "[object Boolean]",
                                t = c("bug-string-char-index");
                            if (!l) var u = Math.floor,
                                v = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334],
                                w = function(a, b) {
                                    return v[b] + 365 * (a - 1970) + u((a - 1969 + (b = +(b > 1))) / 4) - u((a - 1901 + b) / 100) + u((a - 1601 + b) / 400)
                                };
                            (e = {}.hasOwnProperty) || (e = function(a) {
                                var b, c = {};
                                return (c.__proto__ = null, c.__proto__ = {
                                    toString: 1
                                }, c).toString != h ? e = function(a) {
                                    var b = this.__proto__,
                                        c = a in (this.__proto__ = null, this);
                                    return this.__proto__ = b, c
                                } : (b = c.constructor, e = function(a) {
                                    var c = (this.constructor || b).prototype;
                                    return a in this && !(a in c && this[a] === c[a])
                                }), c = null, e.call(this, a)
                            });
                            var x = {
                                    "boolean": 1,
                                    number: 1,
                                    string: 1,
                                    undefined: 1
                                },
                                y = function(a, b) {
                                    var c = typeof a[b];
                                    return "object" == c ? !!a[b] : !x[c]
                                };
                            if (f = function(a, b) {
                                    var c, d, g, i = 0;
                                    (c = function() {
                                        this.valueOf = 0
                                    }).prototype.valueOf = 0, d = new c;
                                    for (g in d) e.call(d, g) && i++;
                                    return c = d = null, i ? f = 2 == i ? function(a, b) {
                                        var c, d = {},
                                            f = h.call(a) == n;
                                        for (c in a) f && "prototype" == c || e.call(d, c) || !(d[c] = 1) || !e.call(a, c) || b(c)
                                    } : function(a, b) {
                                        var c, d, f = h.call(a) == n;
                                        for (c in a) f && "prototype" == c || !e.call(a, c) || (d = "constructor" === c) || b(c);
                                        (d || e.call(a, c = "constructor")) && b(c)
                                    } : (d = ["valueOf", "toString", "toLocaleString", "propertyIsEnumerable", "isPrototypeOf", "hasOwnProperty", "constructor"], f = function(a, b) {
                                        var c, f, g = h.call(a) == n,
                                            i = !g && "function" != typeof a.constructor && y(a, "hasOwnProperty") ? a.hasOwnProperty : e;
                                        for (c in a) g && "prototype" == c || !i.call(a, c) || b(c);
                                        for (f = d.length; c = d[--f]; i.call(a, c) && b(c));
                                    }), f(a, b)
                                }, !c("json-stringify")) {
                                var z = {
                                        92: "\\\\",
                                        34: '\\"',
                                        8: "\\b",
                                        12: "\\f",
                                        10: "\\n",
                                        13: "\\r",
                                        9: "\\t"
                                    },
                                    A = "000000",
                                    B = function(a, b) {
                                        return (A + (b || 0)).slice(-a)
                                    },
                                    C = "\\u00",
                                    D = function(a) {
                                        var b, c = '"',
                                            d = 0,
                                            e = a.length,
                                            f = e > 10 && t;
                                        for (f && (b = a.split("")); e > d; d++) {
                                            var g = a.charCodeAt(d);
                                            switch (g) {
                                                case 8:
                                                case 9:
                                                case 10:
                                                case 12:
                                                case 13:
                                                case 34:
                                                case 92:
                                                    c += z[g];
                                                    break;
                                                default:
                                                    if (32 > g) {
                                                        c += C + B(2, g.toString(16));
                                                        break
                                                    }
                                                    c += f ? b[d] : t ? a.charAt(d) : a[d]
                                            }
                                        }
                                        return c + '"'
                                    },
                                    E = function(a, b, c, d, i, j, k) {
                                        var l, m, n, t, v, x, y, z, A, C, F, G, H, I, J, K;
                                        try {
                                            l = b[a]
                                        } catch (L) {}
                                        if ("object" == typeof l && l)
                                            if (m = h.call(l), m != o || e.call(l, "toJSON")) "function" == typeof l.toJSON && (m != p && m != q && m != r || e.call(l, "toJSON")) && (l = l.toJSON(a));
                                            else if (l > -1 / 0 && 1 / 0 > l) {
                                            if (w) {
                                                for (v = u(l / 864e5), n = u(v / 365.2425) + 1970 - 1; w(n + 1, 0) <= v; n++);
                                                for (t = u((v - w(n, 0)) / 30.42); w(n, t + 1) <= v; t++);
                                                v = 1 + v - w(n, t), x = (l % 864e5 + 864e5) % 864e5, y = u(x / 36e5) % 24, z = u(x / 6e4) % 60, A = u(x / 1e3) % 60, C = x % 1e3
                                            } else n = l.getUTCFullYear(), t = l.getUTCMonth(), v = l.getUTCDate(), y = l.getUTCHours(), z = l.getUTCMinutes(), A = l.getUTCSeconds(), C = l.getUTCMilliseconds();
                                            l = (0 >= n || n >= 1e4 ? (0 > n ? "-" : "+") + B(6, 0 > n ? -n : n) : B(4, n)) + "-" + B(2, t + 1) + "-" + B(2, v) + "T" + B(2, y) + ":" + B(2, z) + ":" + B(2, A) + "." + B(3, C) + "Z"
                                        } else l = null;
                                        if (c && (l = c.call(b, a, l)), null === l) return "null";
                                        if (m = h.call(l), m == s) return "" + l;
                                        if (m == p) return l > -1 / 0 && 1 / 0 > l ? "" + l : "null";
                                        if (m == q) return D("" + l);
                                        if ("object" == typeof l) {
                                            for (I = k.length; I--;)
                                                if (k[I] === l) throw TypeError();
                                            if (k.push(l), F = [], J = j, j += i, m == r) {
                                                for (H = 0, I = l.length; I > H; H++) G = E(H, l, c, d, i, j, k), F.push(G === g ? "null" : G);
                                                K = F.length ? i ? "[\n" + j + F.join(",\n" + j) + "\n" + J + "]" : "[" + F.join(",") + "]" : "[]"
                                            } else f(d || l, function(a) {
                                                var b = E(a, l, c, d, i, j, k);
                                                b !== g && F.push(D(a) + ":" + (i ? " " : "") + b)
                                            }), K = F.length ? i ? "{\n" + j + F.join(",\n" + j) + "\n" + J + "}" : "{" + F.join(",") + "}" : "{}";
                                            return k.pop(), K
                                        }
                                    };
                                k.stringify = function(a, b, c) {
                                    var d, e, f, g;
                                    if ("function" == typeof b || "object" == typeof b && b)
                                        if ((g = h.call(b)) == n) e = b;
                                        else if (g == r) {
                                        f = {};
                                        for (var i, j = 0, k = b.length; k > j; i = b[j++], g = h.call(i), (g == q || g == p) && (f[i] = 1));
                                    }
                                    if (c)
                                        if ((g = h.call(c)) == p) {
                                            if ((c -= c % 1) > 0)
                                                for (d = "", c > 10 && (c = 10); d.length < c; d += " ");
                                        } else g == q && (d = c.length <= 10 ? c : c.slice(0, 10));
                                    return E("", (i = {}, i[""] = a, i), e, f, d, "", [])
                                }
                            }
                            if (!c("json-parse")) {
                                var F, G, H = String.fromCharCode,
                                    I = {
                                        92: "\\",
                                        34: '"',
                                        47: "/",
                                        98: "\b",
                                        116: "  ",
                                        110: "\n",
                                        102: "\f",
                                        114: "\r"
                                    },
                                    J = function() {
                                        throw F = G = null, SyntaxError()
                                    },
                                    K = function() {
                                        for (var a, b, c, d, e, f = G, g = f.length; g > F;) switch (e = f.charCodeAt(F)) {
                                            case 9:
                                            case 10:
                                            case 13:
                                            case 32:
                                                F++;
                                                break;
                                            case 123:
                                            case 125:
                                            case 91:
                                            case 93:
                                            case 58:
                                            case 44:
                                                return a = t ? f.charAt(F) : f[F], F++, a;
                                            case 34:
                                                for (a = "@", F++; g > F;)
                                                    if (e = f.charCodeAt(F), 32 > e) J();
                                                    else if (92 == e) switch (e = f.charCodeAt(++F)) {
                                                    case 92:
                                                    case 34:
                                                    case 47:
                                                    case 98:
                                                    case 116:
                                                    case 110:
                                                    case 102:
                                                    case 114:
                                                        a += I[e], F++;
                                                        break;
                                                    case 117:
                                                        for (b = ++F, c = F + 4; c > F; F++) e = f.charCodeAt(F), e >= 48 && 57 >= e || e >= 97 && 102 >= e || e >= 65 && 70 >= e || J();
                                                        a += H("0x" + f.slice(b, F));
                                                        break;
                                                    default:
                                                        J()
                                                } else {
                                                    if (34 == e) break;
                                                    for (e = f.charCodeAt(F), b = F; e >= 32 && 92 != e && 34 != e;) e = f.charCodeAt(++F);
                                                    a += f.slice(b, F)
                                                }
                                                if (34 == f.charCodeAt(F)) return F++, a;
                                                J();
                                            default:
                                                if (b = F, 45 == e && (d = !0, e = f.charCodeAt(++F)), e >= 48 && 57 >= e) {
                                                    for (48 == e && (e = f.charCodeAt(F + 1), e >= 48 && 57 >= e) && J(), d = !1; g > F && (e = f.charCodeAt(F), e >= 48 && 57 >= e); F++);
                                                    if (46 == f.charCodeAt(F)) {
                                                        for (c = ++F; g > c && (e = f.charCodeAt(c), e >= 48 && 57 >= e); c++);
                                                        c == F && J(), F = c
                                                    }
                                                    if (e = f.charCodeAt(F), 101 == e || 69 == e) {
                                                        for (e = f.charCodeAt(++F), (43 == e || 45 == e) && F++, c = F; g > c && (e = f.charCodeAt(c), e >= 48 && 57 >= e); c++);
                                                        c == F && J(), F = c
                                                    }
                                                    return +f.slice(b, F)
                                                }
                                                if (d && J(), "true" == f.slice(F, F + 4)) return F += 4, !0;
                                                if ("false" == f.slice(F, F + 5)) return F += 5, !1;
                                                if ("null" == f.slice(F, F + 4)) return F += 4, null;
                                                J()
                                        }
                                        return "$"
                                    },
                                    L = function(a) {
                                        var b, c;
                                        if ("$" == a && J(), "string" == typeof a) {
                                            if ("@" == (t ? a.charAt(0) : a[0])) return a.slice(1);
                                            if ("[" == a) {
                                                for (b = []; a = K(), "]" != a; c || (c = !0)) c && ("," == a ? (a = K(), "]" == a && J()) : J()), "," == a && J(), b.push(L(a));
                                                return b
                                            }
                                            if ("{" == a) {
                                                for (b = {}; a = K(), "}" != a; c || (c = !0)) c && ("," == a ? (a = K(), "}" == a && J()) : J()), ("," == a || "string" != typeof a || "@" != (t ? a.charAt(0) : a[0]) || ":" != K()) && J(), b[a.slice(1)] = L(K());
                                                return b
                                            }
                                            J()
                                        }
                                        return a
                                    },
                                    M = function(a, b, c) {
                                        var d = N(a, b, c);
                                        d === g ? delete a[b] : a[b] = d
                                    },
                                    N = function(a, b, c) {
                                        var d, e = a[b];
                                        if ("object" == typeof e && e)
                                            if (h.call(e) == r)
                                                for (d = e.length; d--;) M(e, d, c);
                                            else f(e, function(a) {
                                                M(e, a, c)
                                            });
                                        return c.call(a, b, e)
                                    };
                                k.parse = function(a, b) {
                                    var c, d;
                                    return F = 0, G = "" + a, c = L(K()), "$" != K() && J(), F = G = null, b && h.call(b) == n ? N((d = {}, d[""] = c, d), "", b) : c
                                }
                            }
                        }
                        i && a(function() {
                            return k
                        })
                    }(this)
                }, {}],
                50: [function(a, b, c) {
                    function d(a, b) {
                        var c = [];
                        b = b || 0;
                        for (var d = b || 0; d < a.length; d++) c[d - b] = a[d];
                        return c
                    }
                    b.exports = d
                }, {}]
            }, {}, [1])(1)
        });
    var mul_table = [512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259],
        shg_table = [9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24];
    "undefined" != typeof module && (module.exports = SD), Countdown.prototype.addContainer = function(a) {
        var b;
        "string" == typeof a ? (b = a, a = $("#" + b)) : b = a.getAttr("id"), a && b && (this.elems[b] = a.elements[0], this.reset())
    }, Countdown.prototype.divide = function(a) {
        var b = 1e3,
            c = 60 * b,
            d = 60 * c,
            e = {};
        e.hours = Math.floor(a / d), e.minutes = Math.floor((a - e.hours * d) / c), e.seconds = Math.floor((a - (e.hours * d + e.minutes * c)) / b), e.ms = a - (e.hours * d + e.minutes * c + e.seconds * b), e.ms = e.ms.toString().substr(0, this.msNumbers);
        var f = Math.floor(a / b);
        return is_mobile ? 86400 >= f ? e.text = __("countdown.tomorrow") : 172800 >= f ? e.text = __("countdown.afterTomorrow") : e.text = __("countdown.after") + " " + helpers.secondsToString(f, 0) : e.text = e.hours > 23 ? helpers.secondsToString(f, 0, 1) : helpers.secondsToString(f, 1, 2), e
    }, Countdown.prototype.set = function(a) {
        a = this.divide(a);
        for (var b in this.elems)
            if (this.elems.hasOwnProperty(b))
                for (var c in a) a.hasOwnProperty(c) && ("text" != c && (a[c] = String("0" + a[c]).slice(-2)), null == this.elems[b].placeholders[c] && (this.elems[b].placeholders[c] = doc.getElementById(b + "_" + c)), this.elems[b].placeholders[c] && (this.elems[b].placeholders[c].innerHTML = a[c]))
    }, Countdown.prototype.reset = function() {
        this.running = !1;
        for (var a in this.elems) this.elems.hasOwnProperty(a) && (this.elems[a].innerHTML = this.template.replace(/%(.+?)%/g, '<span id="' + a + '_$1"></span>'), this.elems[a].placeholders = {});
        this.set(this.time - 10)
    }, Countdown.prototype.start = function(a) {
        if (!this.running) {
            this.running = !0;
            var b = +new Date;
            this.countdownInterval = setInterval(function() {
                var c = +new Date,
                    d = this.time - (c - b);
                d > 0 ? this.set(d) : (this.set(0), clearInterval(this.countdownInterval), this.running = !1, a())
            }.bind(this), this.delta)
        }
    }, Countdown.prototype.stop = function() {
        clearInterval(this.countdownInterval)
    };
    var widgetIconAnimation = function() {
            var a, b, c = ".cbh-widget-content",
                d = ".cbh-widget-",
                e = "cbh-rotate-icon",
                f = [],
                g = !1,
                h = is_mobile ? {
                    first: "phone",
                    phone: {
                        duration: 15e3,
                        next: "call"
                    },
                    call: {
                        duration: 3e3
                    }
                } : {
                    first: "phone",
                    phone: {
                        duration: 4e3,
                        next: SCCore.user.name ? "name" : "call"
                    },
                    name: {
                        duration: 4e3,
                        next: "call"
                    },
                    call: {
                        duration: 1500,
                        next: "rating"
                    },
                    rating: {
                        duration: 2e3,
                        next: "logo"
                    },
                    logo: {
                        duration: 1e3
                    }
                },
                i = function() {
                    b = $(c).findChild("div");
                    for (var a in h) h.hasOwnProperty(a) && "object" == typeof h[a] && (f[a] = b.findParent().findChild(d + a));
                    j()
                },
                j = function() {
                    g = !0;
                    var c = function(d) {
                        b.removeClass(e), f[d].addClass(e),
                            function(b) {
                                a = setTimeout(function() {
                                    if (g) {
                                        f[b].removeClass(e);
                                        var a = h[b].next ? h[b].next : h.first;
                                        c(a)
                                    }
                                }, h[b].duration)
                            }(d)
                    };
                    c(h.first)
                },
                k = function() {
                    clearTimeout(a), setTimeout(function() {
                        g || j()
                    }, 30)
                },
                l = function() {
                    g = !1, clearTimeout(a), b.removeClass(e)
                };
            return {
                init: function() {
                    return i()
                },
                reset: function() {
                    return k()
                },
                stop: function() {
                    return l()
                }
            }
        }(),
        activityTracker = {
            accelerometer: {
                current: 1e3,
                start: 1e3,
                step: 8,
                factor: 1
            },
            edges: {
                a: 1,
                b: 1
            },
            threshold: 98,
            exitThreshold: 24,
            activityLastTime: null,
            activityTimer: null,
            catchLastTime: null,
            mouseLastPos: null,
            lastTimeSpeed: null,
            Z: 4e3,
            start: function(a) {
                this.accelerometer.start = this.accelerometer.start * this.accelerometer.factor, this.accelerometer.step = this.accelerometer.step * this.accelerometer.factor, Object.keys(this.edges).forEach(function(a) {
                    var b = "hunter_edge_" + a,
                        c = SCCore.cookies.get(b);
                    c ? (this.edges[a] = c, c < this.threshold && (this.accelerometer.current = this.accelerometer.start - c * this.accelerometer.step)) : this.accelerometer.current = this.accelerometer.start
                }.bind(this)), this.save(), this.activityLastTime = Date.now(), this.activityTimer = setInterval(this.checkActivity.bind(this), 500), $(win).on("mousemove", this.catchMovement.bind(this))
            },
            save: function() {
                Object.keys(this.edges).forEach(function(a) {
                    var b = "hunter_edge_" + a;
                    SCCore.cookies.set(b, this.edges[a], {
                        expires: 30
                    })
                }.bind(this))
            },
            checkActivity: function() {
                var a = Date.now(),
                    b = 1,
                    c = 97,
                    d = 95,
                    e = Object.keys(this.edges),
                    f = helpers.getRandomInt(1, e.length),
                    g = e[f - 1];
                a - this.activityLastTime <= 8e3 && (this.edges[g] < c - 1 ? (this.edges[g] = this.edges[g] + b, this.edges[g] > c && (this.edges[g] = c), this.accelerometer.current -= this.accelerometer.step) : this.edges[g] = c, this.save());
                var h = e.reduce(function(a, b) {
                    return a + this.edges[b]
                }.bind(this), 0);
                h > this.exitThreshold && (activity_exit_event = !0), this.edges[g] >= d && (this.accelerometer.current = 20)
            },
            catchMovement: function(a) {
                if (this.activityLastTime = Date.now(), show_exit && activity_exit_event && !block_show_banner && !block_auto_popup && !(min_popup_delay > 0 || 5 > avgTimerSec)) {
                    if (!this.catchLastTime) return this.catchLastTime = Date.now(), this.mouseLastPos = a.screenY, void(this.lastTimeSpeed = 0);
                    var b = Date.now(),
                        c = b - this.catchLastTime;
                    if (!(5 > c)) {
                        var d = a.screenY - this.mouseLastPos,
                            e = Math.round(d / c * 100),
                            f = e - this.lastTimeSpeed,
                            g = Math.round(f / c * 100),
                            h = 0;
                        0 > g && (h = Math.round(-1e3 * g / this.Z), h > this.accelerometer.current / 2 && showWidgetExit()), this.catchLastTime = b, this.mouseLastPos = a.screenY, this.lastTimeSpeed = e
                    }
                }
            }
        },
        distanceTracker = {
            lastSeenAt: {
                x: null,
                y: null,
                dx: null,
                dy: null
            },
            totalDistance: 0,
            totalScrollDistance: 0,
            lastSeenScrollAt: null,
            activityStartedAt: null,
            start: function() {
                $(document).on("mousemove", this.measureDistance.bind(this)), $(document).on("scroll", this.measureScroll.bind(this)), setInterval(this.clearDistance.bind(this), 1500)
            },
            windowWidth: function() {
                return win.innerWidth || document.documentElement.clientWidth || document.body.clientWidth || 0
            },
            windowHeight: function() {
                return win.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0
            },
            measureDistance: function(a) {
                if (helpers.isNull(this.activityStartedAt) && (this.activityStartedAt = avgTimerSec), makeMeasureDistance) {
                    var b = (this.windowWidth(), this.windowHeight(), a.clientX),
                        c = a.clientY;
                    this.lastSeenAt.dx = b - this.lastSeenAt.x, this.lastSeenAt.dy = c - this.lastSeenAt.y, this.lastSeenAt.x && (this.totalDistance += Math.sqrt(Math.pow(this.lastSeenAt.y - c, 2) + Math.pow(this.lastSeenAt.x - b, 2))), this.lastSeenAt.x = b, this.lastSeenAt.y = c
                }
            },
            clearDistance: function() {
                makeMeasureDistance && (deactivatePhoneIcon(), pulse_animation && (Math.round(this.totalDistance) > 1e3 || Math.round(this.totalScrollDistance) > 200) && activatePhoneIcon(), this.totalDistance = 0, this.totalScrollDistance = 0)
            },
            measureScroll: function() {
                if (makeMeasureDistance) {
                    var a = win.pageYOffset;
                    a >= phoneiconScrollOffset ? showPhoneIcon() : hidePhoneIcon(), this.lastSeenScrollAt && (this.totalScrollDistance += Math.abs(this.lastSeenScrollAt - a)), this.lastSeenScrollAt = a
                }
            }
        },
        telemetry = {
            data: {},
            start: function() {
                var a = this.addEvent.bind(this);
                $(win).on("click", a), $(win).on("mouseover", a), $(win).on("mouseout", a), $(win).on("contextmenu", a), $(win).on("keypress", a), $("input").on("focus", a);
                var b = /Firefox/i.test(navigator.userAgent) ? "DOMMouseScroll" : "mousewheel";
                $(doc).on(b, a), setInterval(this.send.bind(this), 3e4)
            },
            addUserData: function() {
                var a = navigator.appName + ";" + navigator.appVersion + ";" + navigator.userAgent + ";" + navigator.cookieEnabled,
                    b = screen.availWidth + ";" + screen.availHeight + ";" + screen.colorDepth,
                    c = new Date;
                this.data.browser = a, this.data.screen = b, this.data.date = c, this.data.href = loc.href
            },
            addEvent: function(a) {
                this.data[a.type] || (this.data[a.type] = []), this.data[a.type].push(JSON.stringify({
                    type: a.type,
                    x: a.x,
                    y: a.y
                })), (this.data.keypress || this.data.focus) && (block_show_banner = !0), ("DOMMouseScroll" == a.type || "mousewheel" == a.type) && (activity_exit_event = !0)
            },
            send: function() {
                SCCore.server.send(null, this.stringify(this.data)), this.reset()
            },
            stringify: function(a) {
                var b, c = [];
                for (b in a)
                    if (a.hasOwnProperty(b)) {
                        var d = a[b];
                        "[object Array]" == Object.prototype.toString.call(d) ? c.push(encodeURIComponent(b) + "=" + encodeURIComponent(d.length)) : c.push(encodeURIComponent(b) + "=" + encodeURIComponent(d))
                    }
                return c.join("&")
            },
            reset: function() {
                this.data = {}
            }
        },
        sweetyExtensions = {
            show: function() {
                return this.addClass("cbh-show"), this.removeClass("cbh-hide"), this
            },
            hide: function() {
                return this.addClass("cbh-hide"), this.removeClass("cbh-show"), this
            },
            focus: function() {
                return this.elements[0] && this.elements[0].focus(), this
            },
            prepend: function(a) {
                if (!this.elements[0] || !a) return this;
                if ("[SweetyElement]" === a.toString()) a.elements.forEach(function(a) {
                    var b = this.elements[0].children[0] ? this.elements[0].children[0] : null;
                    this.elements[0].insertBefore(a, b)
                }.bind(this));
                else {
                    var b = this.elements[0].children[0] ? this.elements[0].children[0] : null;
                    this.elements[0].insertBefore(a, b)
                }
                return this
            },
            width: function() {
                return this.elements[0] ? this.elements[0].offsetWidth : null
            },
            height: function() {
                return this.elements[0] ? this.elements[0].offsetHeight : null
            },
            getComputedStyle: function() {
                return win.getComputedStyle(this.elements[0], null)
            },
            scaleText: function(a, b, c, d) {
                this.forEach(function(e) {
                    var f = $(e).html(),
                        g = $("<span></span>"),
                        h = c;
                    for (g.html(f).addClass(d).css({
                            "font-size": h + "px"
                        }), $(document.body).append(g); parseInt(g.width(), 10) > a && h > b;) h -= 1, g.css({
                        "font-size": h + "px"
                    });
                    g.remove(), $(e).css({
                        "font-size": h + "px"
                    })
                })
            }
        };
    WidgetSounds.prototype.add = function(a, b) {
        if (!this._canPlay) return this;
        var c = new Audio;
        return c.volume = .1, c.preload = "auto", c.src = this._path + b, this._sounds[a] = c, this
    }, WidgetSounds.prototype.play = function(a) {
        this._canPlay && this._sounds[a] && !this._muted && this._sounds[a].play()
    }, WidgetSounds.prototype.mute = function() {
        this._muted = !0
    }, WidgetSounds.prototype.unmute = function() {
        this._muted = !1
    };
    var is_debug = 0,
        is_debug_dom = 0,
        skip_typing_effect = !1,
        skip_typing_effect_on_mobile = !0,
        disable_canvas = !1,
        disable_ga_events = !1,
        disable_metrika_events = !1,
        enable_discount = !1,
        show_office_choice = !0,
        dialog_instead_of_chat = !1,
        mc_instead_of_contact_form = !1,
        sound_chat_message = !1,
        pulse_animation = !1,
        show_powered_by = !0,
        aggression = 1.3,
        timer = null,
        dialog_timer = null,
        widget_closed_at = null,
        enter_or_exit_at = null,
        minimum_enter_or_exit_delay = 180,
        distance_timer = null,
        block_show_banner = !1,
        countdown = 26,
        countdownObj, modeToggleCountdown = 0,
        modeToggleCountdownObj, activity_exit_event = !1,
        h_params = null,
        reverse = !0,
        block_auto_popup = !1,
        min_popup_delay = 0,
        minPopupTimer = null,
        min_window_exit_delay = 0,
        min_enter_on_active_delay = 18,
        avgTimer = null,
        avgTimerSec = 0,
        show_enter = !0,
        show_exit = !0,
        phone_code = "",
        is_mobile = !1,
        office_id = 0,
        client_phone = "",
        call_rand_id = "",
        custom_layout = null,
        widget_mode = "night",
        ga_cbh = function() {},
        yaMetrikaName = null,
        makeMeasureDistance = !0,
        phoneiconScrollOffset = 0,
        phoneDragObject = null,
        ua = navigator.userAgent.toLowerCase(),
        isOpera = ua.indexOf("opera") > -1,
        isIE = !isOpera && ua.indexOf("msie") > -1,
        view_w = !document.compatMode && !isIE || isOpera ? (document.parentWindow || document.defaultView).innerWidth : "CSS1Compat" == document.compatMode ? document.documentElement.clientWidth : document.body.clientWidth,
        view_h = !document.compatMode && !isIE || isOpera ? (document.parentWindow || document.defaultView).innerHeight : "CSS1Compat" == document.compatMode ? document.documentElement.clientHeight : document.body.clientHeight,
        phoneicon_x = 90,
        phoneicon_y = 100,
        after_action_url = "",
        has_minutes = !0,
        complain_sent = !1,
        addEvent = null,
        removeEvent = null,
        default_phone = {},
        reachedPageEnd = !1,
        reachedScrollBottom, showedExit = !1,
        widgetOpen = !1,
        micromenuOpen = !1,
        has_payments = !1,
        free_mode = !1,
        widgetSounds = new WidgetSounds({
            hollow: !0
        }),
        defaultRating = 5,
        phone_icon_color = "green",
        phone_icon_color_code = null,
        background_color_code = "f0f0f0",
        phone_icon_opacity = 1,
        widget_body_opacity = 1,
        VK_default_count = 2526,
        Twitter_default_count = 2155,
        Facebook_default_count = 484,
        icon_clicked = !1,
        widget_show_reason = null,
        StrongDate = Date,
        comments_url = "http://blog.callbackhunter.ru/?p=2292",
        Tpl = function() {};
    Tpl.prototype._ = function(a) {
        return "undefined" == typeof a ? "" : a
    }, Tpl.prototype.about_mobile = function(a) {
        a = a || {};
        return '<div class="cbh-mobile-logo"></div><div class="cbh-normal-text cbh-typing cbh-mobile-about">' + __("aboutMobile.main", a) + "</div>"
    }, Tpl.prototype.main = function(a) {
        a = a || {};
        var b = this;
        return '<div id="cbh_widget_wrapper"><div class="cbh-widget cbh-fast" id="cbh_phone"><div class="cbh-widget-micromenu cbh-hide-micromenu"><div class="cbh-icon-phone cbh-icon-anim1"></div><div class="cbh-icon-dialog cbh-icon-anim2"></div><div class="cbh-icon-subscribe cbh-icon-anim3"></div></div><div class="cbh-widget-global-icon"><div class="cbh-widget-bg"><span class="cbh-bg-icon"></span></div><div class="cbh-widget-content"><div class="cbh-widget-phone cbh-rotate-icon"><span class="cbh-widget-phone-icon"></span></div><div class="cbh-widget-name"><span class="cbh-widget-name-wrap cbh-widget-name-text" id="cbh_widget_helloName1"></span><span class="cbh-widget-name-wrap cbh-widget-name-text" id="cbh_widget_helloName2"></span></div><div class="cbh-widget-call"><span class="cbh-widget-call-icon"></span></div><div class="cbh-widget-rating"><span class="cbh-widget-rating-value">' + b._(a.rating) + '</span><span class="cbh-widget-rating-icon"></span></div><div class="cbh-widget-logo"><span class="cbh-widget-logo-icon"></span></div></div></div></div><div class="cbh" id="cbh_container"><div class="cbh-background"><div class="cbh-blured"></div><div class="cbh-faded"></div></div><div class="cbh-arrow"><div class="cbh-arrow-wrapper"><div class="cbh-arrow-part"></div><div class="cbh-arrow-part cbh-bottom"></div></div></div><div class="cbh-body"><div class="cbh-x" id="cbh-x"></div><div class="cbh-icons"></div><div class="cbh-wrapper"><div class="cbh-item cbh-show" style="height: 253px;" id="cbh_item_call"><div class="cbh-text"><div id="cbh_status" class="cbh-status cbh-big-text cbh-typing j-cbh-big-text-now">' + __("callNow.head", a) + '</div><input type="text" class="cbh-input" id="cbh_phone_input" value="' + b._(a.client_phone) + '" placeholder="' + __("callNow.input_phone", a) + '" maxlength="18" /><div class="cbh-button" id="cbh_send" style="margin-bottom: 15px">' + __("callNow.action_submit", a) + '</div><div class="cbh-timer cbh-clear" id="cbh_timer"></div><div id="cbh_info" class="cbh-info"></div><div class="cbh-item-later" id=""><span class="cbh-item-later__link" href="">' + __("callNow.link_later", a) + '</span></div></div></div><div class="cbh-item" style="height: 253px;" id="cbh_item_call_deferred"><div class="cbh-text"><div class="cbh-big-text cbh-typing j-cbh-big-text-later" id="cbh_item_call_deferred_head"></div><div class="cbh-normal-text cbh-typing" id="cbh_item_call_deferred_text"></div><div class="cbh-deferred"><div class="cbh-deferred__day"><span class="cbh-deferred__day-val"></span><div class="cbh-timer-sel cbh-hide" id="cbh_timer_sel_day"><ul class="cbh-timer-sel__hold cbh-timer-sel__hold__day"></ul></div></div><span class="cbh-deferred__sep"> ' + __("callLater.in", a) + ' </span><div class="cbh-deferred__hour"><span class="cbh-deferred__hour-val">21:00</span><div class="cbh-timer-sel cbh-hide" id="cbh_timer_sel_hour"><ul class="cbh-timer-sel__hold cbh-timer-sel__hold__hour"></ul></div></div></div><input type="text" class="cbh-input" id="cbh_phone_input_deferred" value="' + b._(a.client_phone) + '" placeholder="' + __("callLater.input_phone", a) + '" maxlength="18" /><div class="cbh-button" id="cbh_send_deferred">' + __("callLater.action_submit", a) + '</div><div class="cbh-info" id=\'cbh_deferred_info\'></div></div></div><div class="cbh-item" id="cbh_item_call_rating" style="height: 200px;"><div class="cbh-text"><div class="cbh-big-text cbh-typing">' + __("callRating.head", a) + '</div><div class="cbh-normal-text cbh-typing">' + __("callRating.text", a) + '</div><ul class="cbh-call-rating"><li><a href="#" id="cbh_call_rating_1" data-value="1">1</a></li><li><a href="#" id="cbh_call_rating_2" data-value="2">2</a></li><li><a href="#" id="cbh_call_rating_3" data-value="3">3</a></li><li><a href="#" id="cbh_call_rating_4" data-value="4">4</a></li><li><a href="#" id="cbh_call_rating_5" data-value="5">5</a></li></ul></div></div><div class="cbh-item" id="cbh_item_dialog" style="height: 253px;"><div class="cbh-text" id="cbh_item_dialog_content" ></div></div><div class="cbh-item" id="cbh_chat" style="height: 60%;"><div class="cbh-text"><div class="cbh-big-text cbh-centered cbh-typing">' + __("chat.head", a) + '</div><div class="cbh-normal-text cbh-centered cbh-typing">' + __("chat.text", a) + '</div></div><div class="cbh-chat"><div class="cbh-messages cbh-chat-messages"><div class="cbh-messages-wrapper"><div id="cbh_chat_messages" class="cbh-messages-scrollable"></div></div></div><div class="cbh-chat-input"><input type="text" class="cbh-input" id="cbh_chat_msg" placeholder="' + __("chat.msg_placeholder", a) + '" /><div class="cbh-btn" id="cbh_chat_send">' + __("chat.action_send", a) + '</div></div></div></div><div class="cbh-item" id="cbh_mc"><div class="cbh-text"><div class="cbh-big-text cbh-typing">' + __("messageCall.head", a) + '</div></div><div class="cbh-chat cbh-mc-chat cbh-hide"><div class="cbh-messages cbh-mc-messages"><div class="cbh-messages-wrapper"><div id="cbh_mc_messages" class="cbh-messages-scrollable"></div></div></div></div><div class="cbh-text"><input type="text" class="cbh-input" id="cbh_mc_msg" placeholder="' + __("messageCall.msg_placeholder", a) + '" /><div class="cbh-button" id="cbh_mc_start">' + __("messageCall.action_start", a) + '</div><div class="cbh-button cbh-hide" id="cbh_mc_send">' + __("messageCall.action_send", a) + '</div></div><div class="cbh-timer cbh-clear" id="cbh_mc_timer"></div></div></div><div class="cbh-powered-by">' + __("powered_by", a) + '</div></div><div class="cbh-branding"></div></div></div><div><div class="cbh-banner-bg"></div></div>'
    }, Tpl.prototype.mobile = function(a) {
        a = a || {};
        var b = this;
        return '<div id="cbh_mobile_widget_wrapper"><div class="cbh-mobile-phone-wrapper" id="cbh_mobile_phone_wrapper"><div class="cbh-mobile-widget" id="cbh_phone"><div class="cbh-widget-global-icon"><div class="cbh-widget-bg"><span class="cbh-bg-icon"></span></div><div class="cbh-widget-content"><div class="cbh-widget-phone cbh-rotate-icon"><span class="cbh-widget-phone-icon"></span></div><div class="cbh-widget-call"><span class="cbh-widget-call-icon"></span></div></div></div></div></div><div class="cbh-mobile-body cbh-mobile-daily cbh-mobile-white" id="cbh_mobile_widget"><div class="cbh-mobile-arrow" id="cbh_mobile_close"></div><div class="cbh-wrapper"><div class="cbh-item" id="cbh_mobile_item_call"><div class="cbh-mobile-steps cbh-mobile-step-1"><div class="cbh-big-text cbh-typing" id="cbh_status">' + __("callNow.mobile.head", a) + '</div><input type="tel" placeholder="' + __("callNow.mobile.input_phone", a) + '" id="cbh_phone_input" value="' + b._(a.client_phone) + '"><input type="submit" value="' + __("callNow.mobile.action_submit", a) + '" id="cbh_send"><div class=\'cbh-link\'><a href="#" id="cbh_mobile_call_later">' + __("callNow.mobile.link_later", a) + '</a></div><div class="cbh-mobile-timer" id="cbh_timer"></div></div></div><div class="cbh-item" id="cbh_item_dialog"><div class="cbh-mobile-steps" id="cbh_item_dialog_content"></div></div><div class="cbh-item" id="cbh_item_call_rating"><div class="cbh-mobile-steps cbh-mobile-step-3"><div class="cbh-big-text cbh-typing">' + __("callRating.mobile.head", a) + '</div><div class="cbh-normal-text cbh-typing">' + __("callRating.mobile.text", a) + '</div><ul class="cbh-call-rating"><li><a href="#" id="cbh_call_rating_1" data-value="1">1</a></li><li><a href="#" id="cbh_call_rating_2" data-value="2">2</a></li><li><a href="#" id="cbh_call_rating_3" data-value="3">3</a></li><li><a href="#" id="cbh_call_rating_4" data-value="4">4</a></li><li><a href="#" id="cbh_call_rating_5" data-value="5">5</a></li></ul></div></div><div class="cbh-item" id="cbh_mobile_deferred"><div class="cbh-mobile-steps cbh-mobile-step-1"><div class="cbh-big-text cbh-typing" id="cbh_mobile_deferred_text"></div><div class="cbh-mobile-time" id="cbh_mobile_time_select"></div></div></div></div><div class="cbh-mobile-pwrd">Powered by <a href="http://callbackhunter.com/free?utm_source=widget" target="_blank" id="cbh_about_link">CallbackHunter</a></div></div></div><div class="cbh-banner-bg"></div>'
    }, Tpl.prototype.socials = function(a) {
        a = a || {};
        var b = this;
        return '<div class="cbh-just-block"><a target="_blank" href="' + b._(a.comments_url) + '" class="cbh-button" style="text-decoration: none;">' + __("loveHateText", a) + '</a><div class="cbh-normal-text cbh-centered" id="cbh_social_text">' + b._(a.text) + '</div><div class="cbh-social-block"><div class="cbh-social-icons cbh-vk"><a href="http://vkontakte.ru/share.php?url=http://callbackhunter.com" id="cbh_social_vk"></a><div class="cbh-social-count" id="cbh_social_vk_count">' + b._(a.VK_default_count) + '</div></div><div class="cbh-social-icons cbh-fb"><a href="http://www.facebook.com/sharer.php?u=http://callbackhunter.com" id="cbh_social_fb"></a><div class="cbh-social-count" id="cbh_social_fb_count">' + b._(a.Facebook_default_count) + '</div></div><div class="cbh-social-icons cbh-tw"><a href="http://twitter.com/share?text=CallbackHunter&url=http://callbackhunter.com" id="cbh_social_tw"></a><div class="cbh-social-count" id="cbh_social_tw_count">' + b._(a.Twitter_default_count) + "</div></div></div></div>"
    }, Tpl.prototype.topmenu_item = function(a) {
        a = a || {};
        var b = this;
        return '<div class="cbh-icon"><div class="cbh-img"></div><div class="cbh-text">' + b._(a.label) + "</div></div>"
    };
    var tpl = new Tpl;
    SCCore.lang.addAvailLang(["ru", "en", "fr"]);
    var __ = function(a, b) {
            return SCCore.lang.translate(a, b)
        },
        $ = Sweety(sweetyExtensions),
        topMenu = {
            clicked: !1,
            inited: !1,
            init: function() {
                return this.inited ? console.error("Repeated topMenu init.") : (this.inited = !0, this.routes = {}, this.routes.callNow = {
                    style: "cbh-icon-phone",
                    action: dialogs.callNow,
                    label: __("topMenu.call")
                }, dialog_instead_of_chat ? this.routes.intro = {
                    style: "cbh-icon-dialog",
                    action: dialogs.intro,
                    label: __("topMenu.dialog")
                } : this.routes.chat = {
                    style: "cbh-icon-dialog",
                    action: dialogs.chat,
                    label: __("topMenu.chat")
                }, mc_instead_of_contact_form ? this.routes.messageCall = {
                    style: "cbh-icon-dialog",
                    action: dialogs.messageCall,
                    label: __("topMenu.mc")
                } : this.routes.contactForm = {
                    style: "cbh-icon-subscribe",
                    action: dialogs.contactForm,
                    label: __("topMenu.mail")
                }, Object.keys(this.routes).forEach(function(a, b) {
                    var c = this.routes[a],
                        d = $(tpl.topmenu_item({
                            label: c.label
                        }));
                    d.attr("id", "route_" + a).addClass([c.style, "cbh-icon-anim" + (b + 1)]).on("click", function() {
                        $(".cbh-widget").hide(), this.activate(a), "undefined" != typeof h_params.enable_micromenu && 1 == h_params.enable_micromenu && ($(".cbh-widget-micromenu").addClass("cbh-hide-micromenu"), micromenuOpen = !1), this.clicked = !0, c.action(), this.clicked = !1
                    }.bind(this)), $(".cbh-icons").append(d)
                }.bind(this)), void this.activate("callNow"))
            },
            activate: function(a) {
                helpers.isMobile() || ($(".cbh-icon").removeClass("cbh-active"), $("#route_" + a).addClass("cbh-active"))
            }
        },
        dialogForms = {
            addEvents: function() {
                is_mobile ? ($("#cbh_about_link").on("click", dialogs.aboutMobile), $("#cbh_mobile_call_later").on("click", dialogs.callLaterMobileAction)) : ($(win).on("resize", function() {
                    helpers.setWrapperH()
                }).on("scroll", function() {
                    var a = helpers.viewportSize(),
                        b = helpers.getScrollTop();
                    $("#cbh_canvas").css({
                        "-webkit-transform": "translatey(-" + b + "px)",
                        "-moz-transform": "translatey(-" + b + "px)",
                        transform: "translatey(-" + b + "px)",
                        width: a.width
                    })
                }), topMenu.init(), $(".cbh-deferred__day").on("click", function(a) {
                    $("#cbh_timer_sel_day").toggleClass("cbh-hide"), a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
                }), $(".cbh-deferred__hour").on("click", function(a) {
                    $("#cbh_timer_sel_hour").toggleClass("cbh-hide"), a.stopPropagation ? a.stopPropagation() : a.cancelBubble = !0
                }), $("#cbh_container").on("click", function() {
                    $("#cbh_timer_sel_day").addClass("cbh-hide"), $("#cbh_timer_sel_hour").addClass("cbh-hide")
                }), $(".cbh-timer-sel__hold__day").on("click", function(a) {
                    var b = $(a.target || a.srcElement),
                        c = $(".cbh-deferred__hour-val");
                    return helpers.fillDeferredSelectors(b.html()), $(".cbh-deferred__day-val").html(b.html()).attr("data-day", b.attr("data-day")), helpers.freeMode() && ($("#cbh_send_deferred_day_container").html(helpers.capitalizeFirstLetter(b.html())), $("#cbh_send_deferred_hour_container").html(__("callLater.in") + " " + c.html()), b.html() === __("callLater.when.nearestTime") ? $("#cbh_send_deferred_hour_container").hide() : $("#cbh_send_deferred_hour_container").show()), !1
                }), $(".cbh-timer-sel__hold__hour").on("click", function(a) {
                    var b = $(a.target || a.srcElement);
                    return $(".cbh-deferred__hour-val").html(b.html()), helpers.freeMode() && $("#cbh_send_deferred_hour_container").html(__("callLater.in") + " " + b.html()), !1
                }), helpers.fillDeferredSelectors(), $(".cbh-item-later__link").on("click", dialogs.callLaterAction), $(win).on("keydown", function(a) {
                    if (a.ctrlKey) {
                        var b = a.keyCode ? a.keyCode : a.which ? a.which : null;
                        (52 === b || 54 === b || 112 === b) && ("worktime" === widget_mode ? dialogs.chat() : (showWidget(), dialogs.okText()))
                    }
                })), $("#cbh_phone_input").on("focus", function() {
                    checkPhone("#cbh_phone_input")
                }).on("keypress", function() {
                    checkPhone("#cbh_phone_input")
                }).on("keyup", function(a) {
                    return checkPhone("#cbh_phone_input"), 13 === a.which || 13 === a.keyCode ? (sendCallback(), !1) : !0
                }).on(["click", "keypress", "focus"], function() {
                    callStatus.connect()
                }), $("#cbh_phone_input_deferred").on("focus", function() {
                    checkPhone("#cbh_phone_input_deferred")
                }).on("keypress", function() {
                    checkPhone("#cbh_phone_input_deferred")
                }).on("keyup", function(a) {
                    return checkPhone("#cbh_phone_input_deferred"), 13 === a.which || 13 === a.keyCode ? (sendDeferredCallback(), !1) : !0
                }), $("#cbh_send").on("click", function() {
                    sendCallback()
                })
            }
        },
        zoomIntervalID, typingEffect = {
            settings: {
                speed: [100, 100],
                thinkSlow: 3,
                mistakeSlow: 8,
                mistakeChance: .01
            },
            getSpeed: function() {
                return this.settings.speed
            },
            setSpeed: function(a, b) {
                this.settings.speed = [a, b]
            },
            timer: null,
            effect: function(a, b) {
                var c = typingEffect;
                if (clearTimeout(typingEffect.timer), c.options = a || {}, skip_typing_effect || is_mobile && skip_typing_effect_on_mobile) return void("function" == typeof b && b());
                Array.prototype.slice.call(doc.getElementsByClassName("cbh-cursor")).forEach(function(a) {
                    a.parentNode.removeChild(a)
                });
                var d = doc.getElementsByClassName("cbh-wrapper")[0].getElementsByClassName("cbh-show")[0];
                if ("undefined" != typeof d) {
                    c.options.doNotReset || Array.prototype.slice.call(d.getElementsByClassName("cbh-typed")).forEach(function(a) {
                        a.className = a.className.replace("cbh-typed", "cbh-typing")
                    }), c.remaining = 0, c.typed = !1, c.think = !1, c.mistake = !1;
                    var e = Array.prototype.slice.call(d.getElementsByClassName("cbh-typing"));
                    if ("undefined" != typeof e)
                        if (e.forEach(c.typeIt), c.remaining > 0) {
                            var f = c.settings,
                                g = 1e3 / (f.speed[0] + f.speed[0] * Math.round(Math.random() * (f.speed[1] / f.speed[0] - 1)));
                            c.mistake ? g = f.mistakeSlow * g : c.think && (g = f.thinkSlow * g), c.timer = setTimeout(function() {
                                c.effect({
                                    doNotReset: !0,
                                    mistake: c.mistake,
                                    noCursor: c.options.noCursor
                                }, b)
                            }, g)
                        } else c.options.noCursor || "undefined" != typeof e[e.length - 1] && (e[e.length - 1].innerHTML += '<span class="cbh-cursor">_</span>'), "function" == typeof b && b()
                }
            },
            typeIt: function(a) {
                var b, c, d, e, f, g, h, i = typingEffect,
                    j = Array.prototype.slice.call(a.getElementsByClassName("cbh-typing-tmp"));
                if (j.length > 0) {
                    if (i.typed) return void i.remaining++;
                    if (b = j[0], c = j[1], d = j[2], e = j[3], i.options.height && (e.style.height = i.options.height + "px"), c.innerHTML = "_", f = d.innerHTML, 0 == f.length) return;
                    if (i.typed = !0, i.options.mistake) return i.think = !0, b.innerHTML = b.innerHTML.substr(0, b.innerHTML.length - 1), void i.remaining++;
                    if (Math.random() < i.settings.mistakeChance) {
                        i.mistake = !0;
                        var k = __("typingMistakes").split("");
                        return b.innerHTML += k[Math.round(Math.random() * (k.length - 1))], void i.remaining++
                    }
                    var l = 0;
                    g = f.substr(l, 1), h = g, "<" == g && ! function n() {
                        l++, g = f.substr(l, 1), h += g, ">" != g && l < f.length && n()
                    }(), " " == g && (i.think = !0), b.innerHTML += h, d.innerHTML = d.innerHTML.substr(l + 1), d.innerHTML.length > 0 ? i.remaining++ : (a.innerHTML = e.innerHTML, a.className = a.className.replace("cbh-typing", "cbh-typed"), a.style.height = "", a.style.display = "")
                } else {
                    b = doc.createElement("span"), c = doc.createElement("span"), d = doc.createElement("span"), e = doc.createElement("span"), b.className = c.className = d.className = e.className = "cbh-typing-tmp";
                    var m = a.innerHTML;
                    a.innerHTML = "", d.innerHTML = m, e.innerHTML = m, d.style.cssText = "display:none!important;", e.style.cssText = "top: -10000px; position: absolute;", a.appendChild(b), a.appendChild(c), a.appendChild(d), a.appendChild(e), a.style.height = e.offsetHeight + "px", a.style.display = "block", e.style.cssText = "display:none!important;", i.typeIt(a)
                }
            }
        },
        socialLikes = {
            getTwitterCount: function(a, b) {
                var c = "https://cdn.api.twitter.com/1/urls/count.json?url=" + encodeURIComponent(a) + "&callback={cb}";
                helpers.requestJSONP(c, function(a) {
                    try {
                        b(a.count)
                    } catch (c) {}
                })
            },
            getFacebookCount: function(a, b) {
                var c = "https://graph.facebook.com/fql?q=SELECT+total_count+FROM+link_stat+WHERE+url%3D%22" + encodeURIComponent(a) + "%22&callback={cb}";
                helpers.requestJSONP(c, function(a) {
                    try {
                        b(a.data[0].total_count)
                    } catch (c) {}
                })
            },
            getVKCount: function(a, b) {
                var c = "https://vk.com/share.php?act=count&index={index}&url=" + encodeURIComponent(a);
                win.VK = win.VK || {}, win.VK.Share = win.VK.Share || {}, win.VK.Share.__count = win.VK.Share.__count || win.VK.Share.count || function() {}, win.ClbhObject.__SLCallbacks = win.ClbhObject.__SLCallbacks || {}, win.VK.Share.count = function(a, b) {
                    win.ClbhObject.__SLCallbacks[a] ? win.ClbhObject.__SLCallbacks[a](b) : win.VK.Share.__count(a, b)
                };
                var d = 500 + Math.floor(1e3 * Math.random());
                win.ClbhObject.__SLCallbacks[d] = function(a) {
                    b(a), delete win.ClbhObject.__SLCallbacks[d]
                };
                var e = document.getElementsByTagName("head")[0],
                    f = document.createElement("script");
                f.type = "text/javascript", f.src = c.replace("{index}", d), f.async = !0, e.appendChild(f)
            },
            popupTwitterShare: function(a, b) {
                helpers.popupWindow("https://twitter.com/intent/tweet?url=" + encodeURIComponent(a) + "&text=" + encodeURIComponent(b), 600, 450)
            },
            popupFacebookShare: function(a) {
                helpers.popupWindow("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(a), 600, 500)
            },
            popupVKShare: function(a, b) {
                helpers.popupWindow("https://vk.com/share.php?url=" + encodeURIComponent(a) + "&title=" + encodeURIComponent(b), 550, 330)
            }
        },
        helpers = {
            sheet: function() {
                var a = document.createElement("style");
                return a.appendChild(document.createTextNode("")), document.head.appendChild(a), a.sheet
            }(),
            addCSSRule: function(a, b, c) {
                try {
                    "insertRule" in helpers.sheet ? helpers.sheet.insertRule(a + "{" + b + "}", c) : "addRule" in helpers.sheet && helpers.sheet.addRule(a, b, c)
                } catch (d) {}
            },
            addCSSRules: function(a) {
                for (var b in a) a.hasOwnProperty(b) && helpers.addCSSRule(b, a[b])
            },
            loadFonts: function() {
                var a = doc.createElement("link");
                a.setAttribute("rel", "stylesheet"), a.setAttribute("type", "text/css"), a.setAttribute("href", ("https:" === loc.protocol ? "https:" : "http:") + "//fonts.googleapis.com/css?family=Roboto:100,300&subset=latin,cyrillic-ext"), doc.getElementsByTagName("head")[0].appendChild(a)
            },
            fillDeferredSelectorsMobile: function(a) {
                if ("string" == typeof a) {
                    for (var b, c, d, e, f = 1e3, g = 60 * f, h = 60 * g, i = 24 * h, j = $(a).html(""), k = parseInt(h_params.time_connection, 10), l = new StrongDate, m = new StrongDate(+l + k * f), n = helpers.workTime.getTimeUser(), o = helpers.workTime.getTimeUserDates(), p = m.getDay(), q = l.getDay(), r = n[p].length > 1 ? 1 : 0, s = 0; n[q][s] < 60 * l.getHours();) s++;
                    n[q].splice(0, s);
                    for (var t = 0; 4 > t; t++) {
                        if (r >= n[p].length) {
                            do m = new StrongDate(+m + 1 * i), p = m.getDay(); while (0 === n[p].length);
                            r = n[p].length > 1 ? 1 : 0
                        }
                        diffDays = Math.floor((+m - +l) / i), e = new StrongDate(+m), e.setHours(Math.floor(n[p][r] / 60)), e.setMinutes(0), b = $("<span>").addClass("cbh-mobile-time-select").attr("data-ts", +e), c = helpers.formatMinToHour(n[p][r]), 0 !== diffDays && (1 === diffDays ? c += "<div>" + __("callLater.when.tomorrow") + "</div>" : (d = helpers.findInArray(o, function(a) {
                            return a.n === p
                        }), c += "<div>" + o[d].s + "</div>")), b.html("<div>" + c + "</div>"), r += 2, j.append(b)
                    }
                }
            },
            fillDeferredSelectors: function(a) {
                var b = $(".cbh-timer-sel__hold__day");
                if (b.exists()) {
                    b.empty();
                    var c = helpers.workTime.getTimeUserWords(),
                        d = helpers.workTime.getTimeUserTimestamps(),
                        e = helpers.workTime.getTimeUser(),
                        f = (new StrongDate).getHours(),
                        g = (new StrongDate).getDay(),
                        h = !1;
                    for (var i in e[g]) e[g].hasOwnProperty(i) && (60 * f >= e[g][i] || (h = !0));
                    var j, k = __("callLater.when.nearestTime");
                    helpers.freeMode() && b.append($('<li><span data-day="-1">' + k + "</span></li>"));
                    var l = [];
                    for (var m in c) c.hasOwnProperty(m) && (c[m].s !== __("callLater.when.today") || h) && (l.push({
                        t: d[m].d,
                        s: c[m].s
                    }), (null == j || a === c[m].s) && (j = c[m].n, $(".cbh-deferred__day-val").html(c[m].s).attr("data-day", d[m].d)));
                    l = l.sort(function(a, b) {
                        return a.t > b.t
                    });
                    for (var m in l) l.hasOwnProperty(m) && b.append($('<li><span data-day="' + l[m].t + '">' + l[m].s + "</span></li>"));
                    var n = "";
                    if (b = $(".cbh-timer-sel__hold__hour"), b.exists()) {
                        if (a === k) return $(".cbh-deferred__sep").css({
                            display: "none!important;"
                        }), $(".cbh-deferred__hour").css({
                            display: "none!important;"
                        }), void $(".cbh-deferred__day").css({
                            width: "210px!important;"
                        });
                        $(".cbh-deferred__sep").css({
                            display: !1
                        }), $(".cbh-deferred__hour").css({
                            display: !1
                        }), $(".cbh-deferred__day").css({
                            width: !1
                        }), b.empty();
                        for (var i in e[j])
                            if (e[j].hasOwnProperty(i) && !(g == j && 60 * f >= e[j][i])) {
                                var o = helpers.formatMinToHour(e[j][i]);
                                b.append($("<li><span>" + o + "</span></li>")), n || (n = o)
                            }
                        $(".cbh-deferred__hour-val").html(n)
                    }
                }
            },
            showDialogItem: function(a) {
                clearTimeout(this.animationReset), this.hideDialogItems();
                var b = $(a);
                b.show(), this.animationReset = setTimeout(function() {
                    b.addStyle("opacity", "0.1!important"), this.animationReset = setTimeout(function() {
                        b.removeStyle("opacity")
                    }, 10)
                }, 10)
            },
            hideDialogItems: function() {
                $(".cbh-item").removeClass("cbh-show"), $(".cbh-form").removeClass("cbh-show")
            },
            hideWidget: function() {
                widgetOpen = !1, widget_closed_at = avgTimerSec, is_mobile ? (sendGaEvent("send", "event", "Callbackhunter_CLOSE_MOBILE", "clicked"), sendYaMetrikaEvent("Callbackhunter_CLOSE_MOBILE"), $("#cbh_mobile_widget").hide(), $(".cbh-banner-bg").hide(), unscaleWidget()) : (sendGaEvent("send", "event", "Callbackhunter_CLOSE", "clicked"), sendYaMetrikaEvent("Callbackhunter_CLOSE"), $(".cbh").hide(), $(".cbh-banner-bg").css("display", "none"), $(".cbh-widget").show()), sendHideWidget()
            },
            requestJSONP: function(a, b) {
                var c = document.getElementsByTagName("head")[0],
                    d = document.createElement("script");
                d.type = "text/javascript";
                var e = "cb" + Math.floor(1e6 * Math.random());
                win[e] = function(a) {
                    b(a), delete win[e]
                }, d.src = a.replace("{cb}", e), d.async = !0, c.appendChild(d)
            },
            popupWindow: function(a, b, c) {
                var d = 0,
                    e = 0;
                screen.width > b && (d = Math.floor((screen.width - b) / 2)), screen.height > c && (e = Math.floor((screen.height - c) / 2));
                var f = win.open(a, "cbh_" + Math.floor(100 * Math.random()), "left=" + d + ",top= " + e + ",width=" + b + ",height=" + c + ",personalbar=0,toolbar=0,scrollbars=1,resizable=1");
                f && f.focus()
            },
            isVisible: function(a) {
                "string" == typeof a && (a = $(a).elements[0]);
                var b = a.currentStyle ? a.currentStyle : win.getComputedStyle(a);
                return b.display && b.visibility ? "none" != b.display && "hidden" != b.visibility && (a.offsetHeight > 0 || a.offsetWidth > 0) : a.offsetHeight > 0 || a.offsetWidth > 0
            },
            getScrollTop: function() {
                if ("undefined" != typeof pageYOffset) return pageYOffset;
                var a = document.body,
                    b = document.documentElement;
                return b = b.clientHeight ? b : a, b.scrollTop
            },
            findInArray: function(a, b) {
                if (!helpers.isArray(a) || !helpers.isFunction(b)) return !1;
                for (var c in a)
                    if (b(a[c]) === !0) return c;
                return -1
            },
            isMobile: function() {
                return /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino|android|ipad|playbook|silk/i.test(navigator.userAgent || navigator.vendor || win.opera) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test((navigator.userAgent || navigator.vendor || win.opera).substr(0, 4))
            },
            formatMinToHour: function(a) {
                var b = Math.floor(a / 60);
                10 > b && (b = "0" + b);
                var c = a % 60;
                return 10 > c && (c = "0" + c), b + ":" + c
            },
            millisecondsToTime: function(a) {
                var b = a % 1e3,
                    c = Math.floor(a / 1e3 % 60),
                    d = Math.floor(a / 6e4 % 60);
                return [d, c, b]
            },
            getRandomInt: function(a, b) {
                return Math.floor(Math.random() * (b - a + 1)) + a
            },
            viewportSize: function() {
                var a = !document.compatMode && !isIE || isOpera ? (document.parentWindow || document.defaultView).innerWidth : "CSS1Compat" == document.compatMode ? document.documentElement.clientWidth : document.body.clientWidth,
                    b = !document.compatMode && !isIE || isOpera ? (document.parentWindow || document.defaultView).innerHeight : "CSS1Compat" == document.compatMode ? document.documentElement.clientHeight : document.body.clientHeight;
                return {
                    width: a,
                    height: b
                }
            },
            setWrapperH: function() {
                var a = helpers.viewportSize();
                is_debug && is_debug_dom && console.log("Viewport:" + a.width + " / " + a.height), $(".cbh").css("height", a.height + "px!important"), $("#cbh_container").css("height", a.height + "px"), $("#cbh_widget_wrapper").css("height", a.height + "px")
            },
            freeMode: function() {
                return free_mode === !0
            },
            discountEnabled: function() {
                return enable_discount === !0
            },
            blurEnabled: function() {
                return !disable_canvas && enable_blur === !0
            },
            capitalizeFirstLetter: function(a) {
                return a.charAt(0).toUpperCase() + a.slice(1)
            },
            secondsToString: function(a, b, c, d) {
                a = parseInt(a), "string" != typeof d && (d = " "), -1 === [0, 1, 2, 3].indexOf(b) && (b = "1"), -1 === [0, 1, 2, 3].indexOf(c) && (c = "1");
                var e = ["days", "hours", "minutes", "seconds"];
                if (3 === c) return __(e[3], {
                    num: a
                });
                for (var f = [Math.floor(a / 86400), Math.floor(a % 86400 / 3600), Math.floor(a % 86400 % 3600 / 60), a % 86400 % 3600 % 60], g = 1; 3 > g; g++) g > c && (f[g + 1] += f[1] * (0 === g ? 24 : 60), f[g] = 0);
                0 === b && 0 === f[0] && f[1] > 0 && (f[0] = 1, f[1] = 0);
                var h = [];
                for (var g in f)
                    if (f.hasOwnProperty(g) && 0 !== f[g] && (h.push(__(e[g], {
                            num: f[g]
                        })), g > b)) break;
                return h.join(d)
            },
            phoneNumberOk: function(a) {
                return "string" != typeof a || "" === a || a.length <= 10 ? !1 : /(.)\1{6,}/i.test(a) ? !1 : !0
            },
            isArray: function(a) {
                return "[object Array]" === Object.prototype.toString.call(a)
            },
            isFunction: function(a) {
                var b = {};
                return a && "[object Function]" === b.toString.call(a)
            },
            isNull: function(a) {
                return null === a && "object" == typeof a
            },
            isValidURL: function(a) {
                var b = new RegExp("^(https?:\\/\\/)?((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|((\\d{1,3}\\.){3}\\d{1,3}))(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*(\\?[;&a-z\\d%_.~+=-]*)?(\\#[-a-z\\d_]*)?$", "i");
                return !!b.test(a)
            },
            checkUtmAccess: function() {
                var a, b = decodeURIComponent(loc.search.substring(1)),
                    c = decodeURIComponent(SCCore.user.referrer),
                    d = decodeURIComponent(SCCore.user.entrance_page) || "";
                if (null !== h_params && (a = h_params), a && null != a.block_by_utm && 1 == a.block_by_utm && null == a.utm_allowed) return !0;
                if (null != a.allow_by_utm && 1 == a.allow_by_utm && null != a.utm_negate)
                    for (var e = a.utm_negate, f = 0; f < e.length; f++)
                        if (b.indexOf(e[f]) > -1 || d.indexOf(e[f]) > -1 || c.indexOf(e[f]) > -1) return !1;
                if (null != a.block_by_utm && 1 == a.block_by_utm && null != a.utm_allowed) {
                    for (var g = a.utm_allowed, f = 0; f < g.length; f++)
                        if (b.indexOf(g[f]) > -1 || d.indexOf(g[f]) > -1 || c.indexOf(g[f]) > -1) return !0
                } else if (null == a.block_by_utm || null != a.block_by_utm && 0 == a.block_by_utm) return !0;
                return !1
            },
            workTime: function() {
                var a = [0, 1, 2, 3, 4, 5, 6],
                    b = 9,
                    c = 18,
                    d = 0,
                    e = {
                        0: [],
                        1: [],
                        2: [],
                        3: [],
                        4: [],
                        5: [],
                        6: []
                    },
                    f = {
                        0: [],
                        1: [],
                        2: [],
                        3: [],
                        4: [],
                        5: [],
                        6: []
                    },
                    g = [],
                    h = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
                    i = [],
                    j = [],
                    k = -(new StrongDate).getTimezoneOffset(),
                    l = function(a) {
                        return parseInt(b[a])
                    },
                    m = function(a) {
                        var b = l(a),
                            d = parseInt(c[a]);
                        return b === d && 0 === b ? d = 24 : d += 1, d
                    },
                    n = function(n, o, p, q) {
                        b = o, c = p, k = -(new StrongDate).getTimezoneOffset(), a = n.split(","), q = q.replace(/^UTC/, "");
                        var r = 1;
                        "" === q ? d = 0 : ("+" === q.slice(0, 1) && (r = -1), q = q.substr(1).split(":"), d = r * (60 * parseInt(q[0], 10) + parseInt(q[1], 10)));
                        for (var s = 0; s < a.length; s++)
                            for (var t = parseInt(a[s], 10), u = l(t), v = m(t), w = u; v > w; w++) {
                                var x = 60 * w + d;
                                if (x >= 0 && 1440 > x) e[t].push(x);
                                else if (x >= 1440) {
                                    var y = (t + 1) % 7;
                                    "undefined" != typeof a[y] && e[y].push(x - 1440)
                                } else if (0 > x) {
                                    var y = (t - 1) % 7;
                                    "undefined" != typeof a[y] && e[y].push(1440 - Math.abs(x))
                                }
                            }
                        if (k) {
                            for (var s in e)
                                if (e.hasOwnProperty(s) && e[s].length)
                                    for (var t = parseInt(s, 10), z = 0; z < e[t].length; z++) {
                                        var x = e[t][z] + k;
                                        if (x >= 0 && 1440 > x) f[s].push(x);
                                        else if (x >= 1440) {
                                            var y = 6 >= t + 1 ? t + 1 : 0;
                                            f[y].push(x - 1440)
                                        } else if (0 > x) {
                                            var y = 6 >= t - 1 ? t - 1 : 0;
                                            f[y].push(1440 - x)
                                        }
                                    }
                        } else f = e;
                        for (var A = (new StrongDate).getDay(), B = 0, s = A; A + 14 > s && 4 > B; s++) {
                            var C = s - A,
                                D = s % 7;
                            if ("undefined" != typeof f[D] && f[D].length) {
                                var E = "",
                                    F = new StrongDate(+new StrongDate + 1e3 * C * 24 * 60 * 60),
                                    G = F.getDate() + " " + __("monthes." + h[F.getMonth()]);
                                switch (C) {
                                    case 0:
                                        E = __("callLater.when.today");
                                        break;
                                    case 1:
                                        E = __("callLater.when.tomorrow");
                                        break;
                                    case 2:
                                        E = __("callLater.when.afterTomorrow");
                                        break;
                                    default:
                                        E = G
                                }
                                g.push({
                                    n: D,
                                    s: E
                                }), i.push({
                                    n: D,
                                    s: G
                                }), j.push({
                                    n: D,
                                    d: +F
                                }), B++
                            }
                        }
                    },
                    o = function(a) {
                        return a.toJSON = 0, JSON.parse(JSON.stringify(a))
                    };
                return {
                    init: n,
                    getTimeUserWords: function() {
                        return o(g)
                    },
                    getTimeUserDates: function() {
                        return o(i)
                    },
                    getTimeUserTimestamps: function() {
                        return o(j)
                    },
                    getTimeUser: function() {
                        return o(f)
                    },
                    getTimeStopToday: function() {
                        return m((new StrongDate).getDay())
                    }
                }
            }()
        },
        dialogs = {
            stopInput: !1,
            createDialog: function(a, b) {
                helpers.hideDialogItems();
                var c = is_mobile ? "#cbh_mobile_widget" : "#cbh_item_dialog";
                is_mobile && (a.height ? $(c).addStyle("height", a.height + "!important") : is_mobile && $(c).removeStyle("height")), a.doNotSave && delete dialogs.currentAction, setTimeout(function() {
                    var c = $("#cbh_item_dialog_content");
                    c.empty(), dialogs.stopInput = !1;
                    var d = "",
                        e = function(a) {
                            var b = __(a, {
                                name: f,
                                plain_name: SCCore.user.name,
                                callbackhunter: g,
                                countdown: countdown
                            });
                            return b ? b : a
                        },
                        f = '<a href="#" class="cbh-dialog-name" id="cbh_dialog_name">' + SCCore.user.name + "</a>",
                        g = '<span id="cbh_dialog_balloon_container"><a class="cbh-dialog-name">CallbackHunter</a><div class="cbh-dialogs-balloon" id="cbh_dialog_balloon"></div></span>';
                    if (a.head && (d += '<div class="cbh-big-text cbh-typing ' + a.headClass + '">' + e(a.head) + "</div>"), a.text && (d += '<div class="cbh-normal-text cbh-typing">' + e(a.text) + "</div>"), a.centeredHead && (d += '<div class="cbh-big-text cbh-typing cbh-centered">' + e(a.centeredHead) + "</div>"), a.centeredText && (d += '<div class="cbh-normal-text cbh-typing cbh-centered">' + e(a.centeredText) + "</div>"), c.html(d), a.form) {
                        var h = $("<div>").addClass("cbh-form");
                        a.formClass && h.addClass(a.formClass), c.append(h), a.form.forEach(function(a, b) {
                            var c = $("<div>");
                            h.append(c);
                            var d = $("<div>").attr("data-index", b).addClass("cbh-form-elem");
                            if ("button" === a.type) {
                                var f = $("<div>").addClass("cbh-button").html(e(a.text)).on("click", function() {
                                    a.doNotSave || (dialogs.currentAction = a.action, delete dialogs.currentOptions), a.action()
                                });
                                a.id && f.attr("id", a.id), d.append(f)
                            } else if ("timer" === a.type && a.id && a.countdownObj instanceof Countdown) {
                                var g = $("<div>").addClass(is_mobile ? "cbh-mobile-timer" : "cbh-timer").attr("id", a.id);
                                d.append(g)
                            }
                            if ("link" === a.type) {
                                var i = $("<div>").addClass("cbh-link"),
                                    j = $("<a>").attr("href", "#").html(e(a.text)).on("click", function(b) {
                                        return b.preventDefault(), a.doNotSave || (dialogs.currentAction = a.action, delete dialogs.currentOptions), a.action(), !1
                                    });
                                i.append(j), d.append(i)
                            } else if ("text" === a.type || "tel" === a.type || "textarea" === a.type) {
                                var k;
                                k = "textarea" === a.type ? $("<textarea>") : $("<input>").attr("type", a.type), k.attr({
                                    name: a.name,
                                    id: "cbh_item_dialog_input_" + b,
                                    placeholder: e(a.text)
                                }).addClass(["cbh-input", "cbh-form-input"]), a.value ? k.val(a.value) : k.val(""), d.append(k)
                            } else if ("checkbox" === a.type) {
                                var k = $("<input>").attr("type", a.type);
                                k.attr({
                                    name: a.name,
                                    id: "cbh_item_dialog_input_" + b
                                }).addClass(["cbh-radio", "cbh-form-input"]), a.value ? k.val(a.value) : k.val("1"), k.prop("checked", a.checked ? !0 : !1);
                                var l = $("<label>" + e(a.text) + "</label>").attr({
                                    "class": "cbh-label",
                                    "for": "cbh_item_dialog_input_" + b
                                });
                                d.append(k).append(l)
                            } else if ("radio" === a.type || "checklist" === a.type) a.options.forEach(function(b, c) {
                                var f = $("<input>");
                                "checklist" === a.type ? f.attr("type", "checkbox") : f.attr("type", "radio"), f.attr({
                                    id: "cbh_item_dialog_radio_" + a.name + "_" + c,
                                    name: a.name,
                                    value: b.value
                                }).addClass(["cbh-radio", "cbh-form-input"]), d.append(f), d.append(document.createTextNode(" "));
                                var g = $("<label>").addClass("cbh-label").html(e(b.text)).attr("for", f.attr("id"));
                                if (d.append(g), b.addTextField) {
                                    var h = $("<input>").attr({
                                        type: "text",
                                        name: a.name + "_" + b.value + "_text"
                                    }).addClass(["cbh-input", "cbh-form-input"]).on("click", function() {
                                        f.prop("checked", !0)
                                    });
                                    g.append(h)
                                }
                                d.append($("<br>"))
                            });
                            else if ("select" === a.type) {
                                var m = $("<div>").addClass("cbh-dialog-select").on("click", function() {
                                        o.toggleClass("cbh-hide")
                                    }),
                                    n = $("<span>").addClass("cbh-form-input").html(__("generic_select_choose")).attr({
                                        value: "",
                                        name: a.name
                                    });
                                $(document).on("click", function(a) {
                                    a.target != m.elements[0] && a.target != n.elements[0] && o.addClass("cbh-hide")
                                }), m.append(n);
                                var o = $("<div>").addClass(["cbh-dialogs-select-list", "cbh-hide"]).attr("id", "cbh_item_dialog_select_" + b);
                                m.append(o);
                                var p = $("<ul>").addClass("cbh-dialogs-select-list__hold");
                                o.append(p), a.options.forEach(function(a) {
                                    var b = $("<li>").html('<a href="#">' + (e(a.text) || a.value) + "</a>").val(a.value);
                                    a.selected && n.html(e(a.text) || a.value).val(a.value), b.on("click", function() {
                                        return n.html(e(a.text) || a.value).val(a.value), !1
                                    }), p.append(b)
                                }), d.append(m)
                            } else if ("submit" === a.type) {
                                var f = $("<div>").addClass("cbh-button").html(e(a.text || "generic_submit")).on("click", function() {
                                    if (!dialogs.stopInput) {
                                        var b = {},
                                            c = {};
                                        $(".cbh-form-input").forEach(function(a) {
                                            var d = $(a).findParent(".cbh-form-elem");
                                            if ($(a).removeClass("cbh-form-input-error"), d.exists()) {
                                                var f = $("#cbh_form_error_" + d.attr("data-index"));
                                                f.empty(), c[a.name] = function(b) {
                                                    return $(a).addClass("cbh-form-input-error"), b && f.html(e(b)), dialogs.stopInput = !1, a
                                                }
                                            }
                                            "INPUT" == a.tagName && ("text" == a.type || "tel" == a.type) || "TEXTAREA" == a.tagName ? b[a.name] = a.value.trim() : "INPUT" == a.tagName && "radio" == a.type ? a.checked && (b[a.name] = a.value.trim()) : "INPUT" == a.tagName && "checkbox" == a.type ? a.checked && (b[a.name] || (b[a.name] = []), b[a.name].push(a.value.trim())) : "SPAN" == a.tagName && (b[a.getAttribute("name")] = a.getAttribute("value").trim())
                                        }), a.action && (a.doNotSave || (dialogs.currentAction = a.action, dialogs.currentOptions = b), a.action(b, c))
                                    }
                                });
                                a.id && f.attr("id", a.id), d.append(f)
                            } else if ("info" === a.type) {
                                var q = $("<div>").addClass("cbh-info").html(e(a.text) || "");
                                d.append(q)
                            } else if ("custom" === a.type) {
                                var r = $("<div>").addClass("cbh-custom");
                                a.custom(r), d.append(r)
                            } else if ("share" === a.type) {
                                var s = $("<div>"),
                                    t = tpl.socials({
                                        comments_url: comments_url,
                                        VK_default_count: VK_default_count,
                                        Twitter_default_count: Twitter_default_count,
                                        Facebook_default_count: Facebook_default_count,
                                        text: e(a.text)
                                    });
                                s.html(t);
                                var u = "http://callbackhunter.com";
                                socialLikes.getTwitterCount(u, function(a) {
                                    $("#cbh_social_tw_count").html(a)
                                }), socialLikes.getVKCount(u, function(a) {
                                    $("#cbh_social_vk_count").html(a)
                                }), socialLikes.getFacebookCount(u, function(a) {
                                    $("#cbh_social_fb_count").html(a)
                                }), d.append(s)
                            }
                            c.append(d), g && "timer" === a.type && a.id && a.countdownObj instanceof Countdown && a.countdownObj.addContainer(g);
                            var v = $("<div>").addClass("cbh-form-error-message").setAttr("id", "cbh_form_error_" + b);
                            c.append(v)
                        })
                    }
                    if (a.info) {
                        var i = $("<div>").addClass("cbh-info").html(e(a.info));
                        c.append(i)
                    }
                    is_mobile || (dialogs.repositionDialog(), $(win).off("resize", dialogs.repositionDialog).on("resize", dialogs.repositionDialog)), helpers.showDialogItem("#cbh_item_dialog"), a.showFormImmediately && $(".cbh-form").show(), typingEffect.effect(null, function() {
                        setTimeout(function() {
                            $(".cbh-form").show()
                        }, 200), "function" == typeof b && b(), $("#cbh_dialog_name").on("click", dialogs.tellYourNameAgain);
                        var a = $("#cbh_dialog_balloon");
                        if (!is_mobile) {
                            var c = $(".cbh-powered-by-link").attr("href") || (SCCore.opt.endpoint ? "http://" + SCCore.opt.endpoint : !1) || "http://callbackhunter.com";
                            a.html(a.html() + '<div class="cbh-dialogs-balloon-box">' + __("aboutBaloon", {
                                link: c
                            }) + "</div>"), $("#cbh_dialog_balloon_container").on("mouseover", function() {
                                a.show()
                            }), $("#cbh_dialog_balloon_container").on("mouseleave", function() {
                                a.hide()
                            })
                        }
                        if (is_mobile && $("#cbh_dialog_balloon_container").on("click", function() {
                                dialogs.aboutMobile(dialogs.currentAction)
                            }), $("#cbh_social_tw").exists()) {
                            var d = "http://callbackhunter.com",
                                e = "CallbackHunter";
                            $("#cbh_social_tw").on("click", function(a) {
                                a.preventDefault(), socialLikes.popupTwitterShare(d, e)
                            }), $("#cbh_social_vk").on("click", function(a) {
                                a.preventDefault(), socialLikes.popupVKShare(d, e)
                            }), $("#cbh_social_fb").on("click", function(a) {
                                a.preventDefault(), socialLikes.popupFacebookShare(d)
                            })
                        }
                    })
                }, 250)
            },
            repositionDialog: function() {
                var a = $("#cbh_item_dialog");
                a.addStyle("height", "auto !important").addStyle("bottom", "auto !important");
                var b = a.getComputedStyle().height;
                a.addStyle("bottom", "0 !important").addStyle("height", b + " !important")
            },
            callNow: function() {
                topMenu.activate("callNow");
                var a;
                a = helpers.freeMode() ? __("callStatus.callNow-free") : __("callStatus.callNow", {
                    countdown: countdown
                }), callStatus.autoRefreshStatus = !1, callStatus.render(a), is_mobile ? showSimpleMobileDialog() : showSimpleDialog()
            },
            intro: function() {
                if (topMenu.activate("intro"), dialogs.currentAction) return dialogs.currentAction(dialogs.currentOptions);
                var a = "",
                    b = "";
                if ("worktime" === widget_mode) {
                    a = helpers.freeMode() ? "intro.text-free" : "intro.text", b = SCCore.user.name ? "intro.head-name" : "intro.head";
                    var c = {
                        head: b,
                        text: a,
                        form: [{
                            type: "button",
                            text: "intro.action_callNow",
                            action: dialogs.callNow
                        }, {
                            type: "button",
                            text: "intro.action_contactForm",
                            action: dialogs.contactForm
                        }]
                    };
                    topMenu.clicked && c.form.push({
                        type: "button",
                        text: "intro.action_okText",
                        action: dialogs.okText
                    }), dialogs.createDialog(c)
                } else {
                    b = SCCore.user.name ? "intro.off.head-name" : "intro.off.head";
                    var c = {
                        head: b,
                        text: "intro.off.text",
                        form: [{
                            type: "button",
                            text: "intro.off.action_callLaterAction",
                            action: dialogs.callLaterAction
                        }, {
                            type: "button",
                            text: "intro.off.action_contactForm",
                            action: dialogs.contactForm
                        }]
                    };
                    topMenu.clicked && c.form.push({
                        type: "button",
                        text: "intro.off.action_okText",
                        action: dialogs.okText
                    }), dialogs.createDialog(c)
                }
            },
            chooseText: function() {
                var a, b, c;
                dialog_instead_of_chat ? (a = "chooseText.text_dialog", b = "chooseText.action_okText", c = dialogs.okText) : (a = "chooseText.text_chat", b = "chooseText.action_chat", c = dialogs.chat), dialogs.createDialog({
                    head: "chooseText.head",
                    text: a,
                    form: [{
                        type: "button",
                        text: b,
                        action: c
                    }, {
                        type: "button",
                        text: "chooseText.action_contactForm",
                        action: dialogs.contactForm
                    }]
                })
            },
            choosePhoneOrText: function() {
                var a, b, c;
                dialog_instead_of_chat ? (a = "choosePhoneOrText.text_dialog", b = "choosePhoneOrText.action_okText", c = dialogs.okText) : (a = "choosePhoneOrText.text_chat", b = "choosePhoneOrText.action_chat", c = dialogs.chat), dialogs.createDialog({
                    head: "choosePhoneOrText.head",
                    text: a,
                    form: [{
                        type: "button",
                        text: "choosePhoneOrText.action_doYouWantCallback",
                        action: dialogs.doYouWantCallback
                    }, {
                        type: "button",
                        text: b,
                        action: c
                    }, {
                        type: "button",
                        text: "choosePhoneOrText.action_contactForm",
                        action: dialogs.contactForm
                    }]
                })
            },
            letsText: function() {
                dialogs.createDialog({
                    head: "letsText.head",
                    text: "letsText.text",
                    form: [{
                        type: "button",
                        text: "letsText.action_okText",
                        action: dialogs.okText
                    }, {
                        type: "button",
                        text: "letsText.action_doYouWantCallback",
                        action: dialogs.doYouWantCallback
                    }]
                })
            },
            doYouWantCallback: function() {
                var a;
                a = helpers.freeMode() ? "doYouWantCallback.text-free" : "worktime" === widget_mode ? "doYouWantCallback.text_worktime" : "doYouWantCallback.text_off", dialogs.createDialog({
                    head: "doYouWantCallback.heads",
                    text: a,
                    form: [{
                        type: "button",
                        text: "letsText.action_call",
                        action: "worktime" === widget_mode ? dialogs.callNow : dialogs.callLaterAction,
                        doNotSave: !0
                    }, {
                        type: "button",
                        text: "doYouWantCallback.action_okText",
                        action: dialogs.okText
                    }]
                })
            },
            okText: function() {
                return SCCore.user.name ? void dialogs.createDialog({
                    head: "okText.head",
                    text: "okText.text",
                    form: [{
                        type: "button",
                        text: "okText.action_doYouWantCallback2",
                        action: dialogs.doYouWantCallback2
                    }, {
                        type: "button",
                        text: "okText.action_gameStart",
                        action: dialogs.gameStart
                    }]
                }) : dialogs.tellYourName()
            },
            sayHello: function() {
                if (!widgetOpen) {
                    var a, b, c;
                    "worktime" === widget_mode ? (a = "sayHello.text_worktime", b = "sayHello.action_callNow", c = dialogs.callNow) : (a = "sayHello.text_off", b = "sayHello.action_callLaterAction", c = dialogs.callLaterAction), dialogs.createDialog({
                        mode: "sayHello",
                        head: SCCore.user.name ? "sayHello.head-name" : "sayHello.head",
                        text: a,
                        form: [{
                            type: "button",
                            text: b,
                            action: c,
                            doNotSave: !0,
                            id: "sayHelloButton"
                        }, {
                            type: "link",
                            text: "sayHello.action_hide",
                            action: function() {
                                helpers.hideWidget()
                            }
                        }]
                    }, function() {
                        setTimeout(function() {
                            helpers.isVisible("#sayHelloButton") && helpers.hideWidget()
                        }, 4e3)
                    })
                }
            },
            tellYourName: function() {
                dialogs.createDialog({
                    head: "tellYourName.head",
                    text: "tellYourName.text",
                    form: [{
                        type: "text",
                        text: "tellYourName.input_name",
                        name: "name",
                        value: SCCore.user.name || ""
                    }, {
                        type: "checkbox",
                        text: "tellYourName.checkbox_oferta",
                        name: "oferta",
                        checked: !0
                    }, {
                        type: "submit",
                        text: "tellYourName.action_saveName",
                        action: function(a, b) {
                            dialogs.saveName(a, b, dialogs.pleasedToMeet)
                        },
                        doNotSave: !0
                    }, {
                        type: "link",
                        text: "tellYourName.link_pleasedToMeet",
                        action: dialogs.pleasedToMeet
                    }]
                })
            },
            tellYourNameAgain: function() {
                dialogs.createDialog({
                    head: "tellYourNameAgain.head",
                    text: "tellYourNameAgain.text",
                    form: [{
                        type: "text",
                        text: "tellYourNameAgain.input_name",
                        name: "name",
                        value: SCCore.user.name || ""
                    }, {
                        type: "checkbox",
                        text: "tellYourNameAgain.checkbox_oferta",
                        name: "oferta",
                        checked: !0
                    }, {
                        type: "submit",
                        text: "tellYourNameAgain.action_saveName",
                        action: function(a, b) {
                            dialogs.saveName(a, b, dialogs.intro)
                        },
                        doNotSave: !0
                    }]
                })
            },
            saveName: function(a, b, c) {
                return a.oferta ? a && a.name ? (SCCore.user.name = a.name, SCCore.cookies.set("hunter_client_name", a.name), SCCore.server.send({
                    dialogs_name: SCCore.user.name
                }), setPhoneIconName(), void c()) : b.name("saveName.error_name") : b.oferta("saveName.error_oferta")
            },
            validateEmail: function(a, b, c) {
                return a && a.email ? 0 === a.email.length || -1 === a.email.indexOf("@") || -1 === a.email.indexOf(".") ? b.email("validateEmail.error_invalid") : void c() : b.email("validateEmail.error_empty")
            },
            sendQuestion: function(a, b, c) {
                return dialogs.stopInput = !0, a.question ? void dialogs.validateEmail(a, b, function() {
                    dialogs.saveEmail(a.email), SCCore.server.send({
                        question: JSON.stringify(a)
                    }), sendGaEvent("send", "event", "Callbackhunter_EMAIL", "clicked"), sendYaMetrikaEvent("Callbackhunter_EMAIL"), c()
                }) : b.question("sendQuestion.error_empty")
            },
            saveEmail: function(a) {
                SCCore.user.email = a, SCCore.cookies.set("hunter_client_email", a)
            },
            pleasedToMeet: function() {
                var a, b;
                SCCore.user.name ? (a = "pleasedToMeet.head-name", b = "pleasedToMeet.text-name") : (a = "pleasedToMeet.head", b = "pleasedToMeet.text"), dialogs.createDialog({
                    head: a,
                    text: b,
                    form: [{
                        type: "button",
                        text: "pleasedToMeet.action_doYouWantCallback2",
                        action: dialogs.doYouWantCallback2
                    }, {
                        type: "button",
                        text: "pleasedToMeet.action_gameStart",
                        action: dialogs.gameStart
                    }]
                })
            },
            chooseCallParentsOrGame: function() {
                var a;
                a = SCCore.user.name ? "chooseCallParentsOrGame.text-name" : "chooseCallParentsOrGame.text", dialogs.createDialog({
                    head: "chooseCallParentsOrGame.head",
                    text: a,
                    form: [{
                        type: "button",
                        text: "chooseCallParentsOrGame.action_callParents",
                        action: dialogs.callParents
                    }, {
                        type: "button",
                        text: "chooseCallParentsOrGame.action_gameStart",
                        action: dialogs.gameStart
                    }]
                })
            },
            doYouWantCallback2: function() {
                var a, b;
                helpers.freeMode() ? (a = "doYouWantCallback2.head-free", b = SCCore.user.name ? "doYouWantCallback2.text-free-name" : "doYouWantCallback2.text-free") : (a = "doYouWantCallback2.head", b = "worktime" === widget_mode ? "doYouWantCallback2.text_work" : "doYouWantCallback2.text_off", SCCore.user.name && (b += "-name")), dialogs.createDialog({
                    head: a,
                    text: b,
                    form: [{
                        type: "button",
                        text: "doYouWantCallback2.action_callNow",
                        action: dialogs.callNow,
                        doNotSave: !0
                    }, {
                        type: "button",
                        text: "doYouWantCallback2.action_letsCallLater",
                        action: dialogs.letsCallLater
                    }]
                })
            },
            callLaterMobileAction: function() {
                helpers.hideDialogItems(), $("#cbh_mobile_deferred").show();
                var a;
                a = helpers.freeMode() ? "callLaterMobileAction.text-free" : "callLaterMobileAction.text", $("#cbh_mobile_deferred_text").html(__(a)), helpers.fillDeferredSelectorsMobile("#cbh_mobile_time_select");
                var b = $(".cbh-mobile-time-select");
                b.on("click", function(a) {
                    var b = new StrongDate,
                        c = new StrongDate(+$(a.currentTarget).attr("data-ts")),
                        d = c - b,
                        e = Math.floor(d / 36e5),
                        f = Math.floor((d - 60 * e * 60 * 1e3) / 6e4);
                    dialogs.askPhoneNumberNight(e, f)
                })
            },
            askPhoneNumberNight: function(a, b) {
                dialogs.createDialog({
                    head: "askPhoneNumberNight.head",
                    info: "askPhoneNumberNight.info",
                    form: [{
                        type: "tel",
                        text: "askPhoneNumberNight.input_phone",
                        name: "cbh_mobile_night_mode_phone",
                        value: SCCore.user.client_phone || ""
                    }, {
                        type: "submit",
                        text: "askPhoneNumberNight.action_submit",
                        action: function(c, d) {
                            c.hour = a, c.minutes = b, sendMobileDeferredCallback(c, d)
                        },
                        doNotSave: !0
                    }]
                })
            },
            showOfficeChoice: function(a) {
                var b = h_params.show_office_list,
                    c = [];
                for (var d in b) b.hasOwnProperty(d) && c.push({
                    value: b[d].id,
                    text: b[d].name,
                    selected: 0 == d
                });
                var e = {
                    head: "showOfficeChoice.head",
                    headClass: "cbh-status",
                    form: [{
                        type: "select",
                        name: "office",
                        options: c
                    }, {
                        type: "submit",
                        text: "showOfficeChoice.action_submit",
                        action: function(b) {
                            a ? sendDeferredCallback(b) : sendCallback(b)
                        }
                    }]
                };
                a || e.form.push({
                    type: "timer",
                    id: "cbh_timer_office",
                    countdownObj: countdownObj
                }), dialogs.createDialog(e)
            },
            callLaterAction: function() {
                topMenu.activate("callNow");
                var a = 0,
                    b = 0;
                helpers.freeMode() && (a = $(".cbh-deferred__day-val").html(), b = $(".cbh-deferred__hour-val").html(), $("#cbh_deferred_info").html(__("callLaterAction.info", {
                    day: helpers.capitalizeFirstLetter(a),
                    time: b
                }))), $("#cbh_item_call_deferred_head").html(__("callLaterAction.head")).removeClass("cbh-typed").addClass("cbh-typing"), typingEffect.effect(), $("#cbh_item_call_deferred_text").html(""), helpers.showDialogItem("#cbh_item_call_deferred"), $("#cbh_send_deferred").off("click").on("click", function() {
                    sendDeferredCallback()
                })
            },
            letsCallLater: function() {
                dialogs.createDialog({
                    height: is_mobile ? "390px" : "250px",
                    doNotSave: !0,
                    head: SCCore.user.name ? "letscallLater.head-name" : "letscallLater.head",
                    text: "letscallLater.text",
                    form: [{
                        type: "button",
                        text: "letscallLater.action_time",
                        action: is_mobile ? dialogs.callLaterMobileAction : dialogs.callLaterAction,
                        doNotSave: !0
                    }, {
                        type: "button",
                        text: "letscallLater.action_contactForm",
                        action: dialogs.contactForm,
                        doNotSave: !0
                    }]
                })
            },
            deferredCallRegistered: function() {
                helpers.hideDialogItems(), dialogs.createDialog({
                    head: "deferredCallRegistered.head",
                    text: "deferredCallRegistered.text",
                    form: [{
                        type: "submit",
                        text: "deferredCallRegistered.action_intro",
                        action: dialogs.intro,
                        doNotSave: !0
                    }]
                })
            },
            letsCallLaterByName: function() {
                var a, b;
                helpers.freeMode() && (a = $(".cbh-deferred__day-val").html(), b = $(".cbh-deferred__hour-val").html());
                var c = "";
                a && b && (c = a === __("callLater.when.nearestTime") ? "letsCallLaterByName.text_near" : __("letsCallLaterByName.text", {
                    day: a,
                    hour: b
                })), dialogs.createDialog({
                    head: "letsCallLaterByName.head",
                    text: c,
                    form: [{
                        type: "text",
                        text: "letsCallLaterByName.input_name",
                        name: "name",
                        value: SCCore.user.name || ""
                    }, {
                        type: "checkbox",
                        text: "letsCallLaterByName.checkbox_oferta",
                        name: "oferta",
                        checked: !0
                    }, {
                        type: "submit",
                        id: "acceptName",
                        text: "letsCallLaterByName.action_submit",
                        action: function(a, b) {
                            dialogs.saveName(a, b, dialogs.doYouWantRecordsOnEmail)
                        },
                        doNotSave: !0
                    }, {
                        type: "link",
                        text: "letsCallLaterByName.link_no",
                        action: dialogs.doYouWantRecordsOnEmail
                    }]
                })
            },
            contactForm: function() {
                topMenu.activate("contactForm");
                var a = "contactForm.text";
                helpers.freeMode() && (a += "-free"), SCCore.user.name && (a += "-name"), dialogs.createDialog({
                    head: "contactForm.head",
                    formClass: "cbh-letter",
                    text: a,
                    form: [{
                        text: "contactForm.input_question",
                        name: "question",
                        type: "textarea"
                    }, {
                        type: "text",
                        text: "contactForm.input_email",
                        name: "email",
                        value: SCCore.user.email
                    }, {
                        type: "text",
                        text: "contactForm.input_phone",
                        name: "phone",
                        value: SCCore.user.client_phone
                    }, {
                        type: "submit",
                        action: function(a, b) {
                            dialogs.sendQuestion(a, b, dialogs.hopeIEarnedYourSmile)
                        }
                    }],
                    showFormImmediately: !0
                })
            },
            emailSent: function() {
                dialogs.createDialog({
                    head: "emailSent.head",
                    text: "emailSent.text",
                    form: [{
                        type: "button",
                        text: "emailSent.action_no",
                        action: dialogs.hopeIEarnedYourSmile
                    }, {
                        type: "button",
                        text: "emailSent.action_gameStart",
                        action: dialogs.gameStart
                    }]
                })
            },
            maybePlayGame: function() {
                dialogs.createDialog({
                    head: SCCore.user.name ? "maybePlayGame.head-name" : "maybePlayGame.head",
                    text: "maybePlayGame.text",
                    form: [{
                        type: "button",
                        text: "maybePlayGame.action_no",
                        action: dialogs.hopeIEarnedYourSmile
                    }, {
                        type: "button",
                        text: "maybePlayGame.action_gameStart",
                        action: dialogs.gameStart
                    }]
                })
            },
            callInNeed: function() {
                dialogs.createDialog({
                    height: "250px",
                    head: "callInNeed.head",
                    text: "callInNeed.text",
                    form: [{
                        type: "button",
                        text: "callInNeed.action_hide",
                        action: function() {
                            helpers.hideWidget()
                        },
                        doNotSave: !0
                    }, {
                        type: "button",
                        text: "callInNeed.action_farewell",
                        action: dialogs.farewell
                    }]
                })
            },
            farewell: function() {
                dialogs.createDialog({
                    head: "farewell.head",
                    text: "farewell.text",
                    doNotSave: !0
                }, function() {
                    setTimeout(function() {
                        helpers.hideWidget()
                    }, 3e3)
                })
            },
            callParents: function() {
                dialogs.createDialog({
                    head: "callParents.head",
                    text: "callParents.text",
                    form: [{
                        type: "text",
                        text: "callParents.input_phone",
                        name: "myPhone"
                    }, {
                        type: "text",
                        text: "callParents.input_parents_phone",
                        name: "parentsPhone"
                    }, {
                        type: "submit",
                        text: "callParents.action_submit",
                        action: function(a) {
                            "" != a.myPhone && "" != a.parentsPhone && (callParents(a), dialogs.shareCallParents())
                        }
                    }]
                })
            },
            shareCallParents: function() {
                dialogs.createDialog({
                    head: "sharecallParents.head",
                    form: [{
                        type: "share",
                        text: "sharecallParents.text"
                    }]
                })
            },
            gameStart: function() {
                var a = "gameStart.text";
                helpers.discountEnabled() && (a += "-discount"), dialogs.createDialog({
                    head: "gameStart.head",
                    text: a,
                    form: [{
                        type: "button",
                        text: "gameStart.action_gameFirstQuestion",
                        action: dialogs.gameFirstQuestion
                    }, {
                        type: "button",
                        text: "gameStart.action_callInNeed",
                        action: dialogs.callInNeed
                    }]
                })
            },
            gameFirstQuestion: function() {
                dialogs.createDialog({
                    head: "gameFirstQuestion.head",
                    text: "gameFirstQuestion.text",
                    form: [{
                        type: "select",
                        name: "score",
                        options: [{
                            value: 1
                        }, {
                            value: 2
                        }, {
                            value: 3
                        }, {
                            value: 4
                        }, {
                            value: 5
                        }, {
                            value: 6
                        }, {
                            value: 7
                        }, {
                            value: 8
                        }, {
                            value: 9
                        }, {
                            value: 10,
                            selected: !0
                        }]
                    }, {
                        type: "submit",
                        text: "gameFirstQuestion.action_submit",
                        action: dialogs.gameSecondQuestion
                    }]
                })
            },
            gameSecondQuestion: function(a) {
                var b = parseInt(a.score, 10),
                    c = "gameSecondQuestion.head",
                    d = "gameSecondQuestion.text";
                if (b >= 1 && 3 >= b) c += "-low", d += "-low";
                else if (b >= 4 && 7 >= b) c += "-avg", d += "-avg";
                else {
                    if (!(b >= 8 && 10 >= b)) return;
                    c += "-high", d += "-high"
                }
                d = __(d), helpers.discountEnabled() && (d += __("gameSecondQuestion.text-discount")), SCCore.user.gameResults.score = b, dialogs.createDialog({
                    height: is_mobile ? "450px" : "300px",
                    head: c,
                    text: d + __("gameSecondQuestion.text"),
                    form: [{
                        type: "checklist",
                        name: "important",
                        options: [{
                            text: "gameSecondQuestion.option.communication",
                            value: "communication"
                        }, {
                            text: "gameSecondQuestion.option.service",
                            value: "service"
                        }, {
                            text: "gameSecondQuestion.option.pricing",
                            value: "pricing"
                        }, {
                            text: "gameSecondQuestion.option.other",
                            value: "other",
                            addTextField: !0
                        }]
                    }, {
                        type: "submit",
                        text: "gameSecondQuestion.action_submit",
                        action: dialogs.gameThirdQuestion
                    }]
                })
            },
            gameThirdQuestion: function(a) {
                var b;
                a.important && 0 !== a.important.length && (-1 === a.important.indexOf("other") || "" !== a.important_other_text) && (SCCore.user.gameResults.important = a.important, -1 !== a.important.indexOf("other") && (SCCore.user.gameResults.important_other_text = a.important_other_text), b = helpers.discountEnabled() ? "gameThirdQuestion.text-discount" : "gameThirdQuestion.text", dialogs.createDialog({
                    height: is_mobile ? "470px" : "370px",
                    head: "gameThirdQuestion.head",
                    text: b,
                    form: [{
                        type: "checklist",
                        name: "hobbies",
                        options: [{
                            text: "gameThirdQuestion.option.travel",
                            value: "travel"
                        }, {
                            text: "gameThirdQuestion.option.fishing",
                            value: "fishing"
                        }, {
                            text: "gameThirdQuestion.option.dancing",
                            value: "dancing"
                        }, {
                            text: "gameThirdQuestion.option.sports",
                            value: "sports"
                        }, {
                            text: "gameThirdQuestion.option.business",
                            value: "business"
                        }, {
                            text: "gameThirdQuestion.option.music",
                            value: "music"
                        }, {
                            text: "gameThirdQuestion.option.movies",
                            value: "movies"
                        }, {
                            text: "gameThirdQuestion.option.other",
                            value: "other",
                            addTextField: !0
                        }]
                    }, {
                        type: "submit",
                        text: "gameThirdQuestion.action_submit",
                        action: dialogs.gameFourthQuestion
                    }]
                }))
            },
            gameFourthQuestion: function(a) {
                if (a.hobbies && 0 !== a.hobbies.length && (-1 === a.hobbies.indexOf("other") || "" !== a.hobbies_other_text)) {
                    SCCore.user.gameResults.hobbies = a.hobbies, -1 !== a.hobbies.indexOf("other") && (SCCore.user.gameResults.hobbies_other_text = a.hobbies_other_text);
                    var b = "gameFourthQuestion.head-" + a.hobbies[0],
                        c = "gameFourthQuestion.text-" + a.hobbies[0];
                    "fishing" == a.hobbies[0] && SCCore.user.name && (b += "-name", c += "-name"), c = __(c), helpers.discountEnabled() && (c += __("gameFourthQuestion.text-discount")), dialogs.createDialog({
                        height: is_mobile ? "330px" : "270px",
                        head: b,
                        text: c + __("gameFourthQuestion.text"),
                        form: [{
                            type: "text",
                            text: "gameFourthQuestion.input_experience",
                            name: "experience"
                        }, {
                            type: "submit",
                            text: "gameFourthQuestion.action_submit",
                            action: dialogs.gameFifthQuestion
                        }]
                    })
                }
            },
            gameFifthQuestion: function(a) {
                a.experience && (SCCore.user.gameResults.experience = a.experience, dialogs.createDialog({
                    height: "450px",
                    head: "gameFifthQuestion.head",
                    text: "gameFifthQuestion.text",
                    form: [{
                        type: "radio",
                        name: "occupation",
                        options: [{
                            text: "gameFifthQuestion.option.marketing",
                            value: "marketing"
                        }, {
                            text: "gameFifthQuestion.option.business_owner",
                            value: "business_owner"
                        }, {
                            text: "gameFifthQuestion.option.top_manager",
                            value: "top_manager"
                        }, {
                            text: "gameFifthQuestion.option.sales_manager",
                            value: "sales_manager"
                        }, {
                            text: "gameFifthQuestion.option.head_of_sales_division",
                            value: "head_of_sales_division"
                        }, {
                            text: "gameFifthQuestion.option.office_manager",
                            value: "office_manager"
                        }, {
                            text: "gameFifthQuestion.option.accountant",
                            value: "accountant"
                        }, {
                            text: "gameFifthQuestion.option.lawyer",
                            value: "lawyer"
                        }, {
                            text: "gameFifthQuestion.option.logistician",
                            value: "logistician"
                        }, {
                            text: "gameFifthQuestion.option.other",
                            value: "other"
                        }]
                    }, {
                        type: "submit",
                        text: "gameFifthQuestion.action_submit",
                        action: dialogs.gameFinish
                    }]
                }))
            },
            gameFinish: function(a) {
                if (a.occupation && 0 !== a.occupation.length) {
                    var b = "gameFinish.head-" + a.occupation,
                        c = __("gameFinish.text-" + a.occupation);
                    SCCore.user.gameResults.occupation = a.occupation, SCCore.user.gameResults.discount = "10%", SCCore.server.send({
                        dialogs_results: JSON.stringify(SCCore.user.gameResults)
                    }), SCCore.cookies.set("hunter_game_finished", "1"), c += __(helpers.discountEnabled() ? "gameFinish.text-discount" : "gameFinish.text"), dialogs.createDialog({
                        height: "450px",
                        head: b,
                        text: c,
                        form: [{
                            type: "button",
                            text: "gameFinish.action_callNow",
                            action: dialogs.callNow
                        }, {
                            type: "button",
                            text: "gameFinish.action_letsCallLater",
                            action: dialogs.letsCallLater
                        }, {
                            type: is_mobile ? "link" : "button",
                            text: "gameFinish.action_callInNeed",
                            action: dialogs.callInNeed
                        }]
                    })
                }
            },
            exitWeTreasure: function() {
                var a, b, c = "exitWeTreasure.head",
                    d = "exitWeTreasure.action_call";
                SCCore.user.name && (c += "-name"), helpers.freeMode() ? b = "exitWeTreasure.text-free" : "worktime" === widget_mode ? b = "exitWeTreasure.text_worktime" : (b = "exitWeTreasure.text_off", d = "exitWeTreasure.action_callLater"), a = {
                    head: c,
                    text: b,
                    form: [{
                        type: "button",
                        text: d,
                        action: function() {
                            SCCore.cookies.set("hunter_exit_visited", 1), "worktime" !== widget_mode || helpers.freeMode() ? "worktime" !== widget_mode ? showSimpleDialogNightMode() : dialogs.callLaterAction() : dialogs.callNow()
                        },
                        doNotSave: !0
                    }, {
                        type: "link",
                        text: "exitWeTreasure.action_text",
                        action: function() {
                            SCCore.cookies.set("hunter_exit_visited", 1), dialogs.contactForm()
                        }
                    }]
                }, dialogs.createDialog(a)
            },
            pleaseRateCall: function() {
                helpers.showDialogItem("#cbh_item_call_rating");
                for (var a, b = function(b) {
                        if (!a) {
                            var c;
                            for (c = 1; 5 >= c; c++) $("#cbh_call_rating_" + c).removeClass("cbh-marked");
                            for (c = 1; c <= parseInt(b.target.getAttribute("data-value"), 10); c++) $("#cbh_call_rating_" + c).addClass("cbh-marked")
                        }
                    }, c = function() {
                        if (!a)
                            for (var b = 1; 5 >= b; b++) $("#cbh_call_rating_" + b).removeClass("cbh-marked")
                    }, d = function(c) {
                        if (a) return !1;
                        a = !0, b(c);
                        var d = parseInt(c.target.getAttribute("data-value"), 10);
                        return SCCore.server.send({
                            rating: d,
                            call_rand_id: call_rand_id
                        }), SCCore.user.name ? dialogs.doYouWantRecordsOnEmail(!0) : dialogs.whatWouldYouLikeToBeCalled(), !1
                    }, e = 1; 5 >= e; e++) $("#cbh_call_rating_" + e).on("mouseover", b).on("mouseleave", c).on("click", d);
                typingEffect.effect()
            },
            didCallSucceed: function() {
                var a = "didCallSucceed.head",
                    b = "didCallSucceed.text";
                SCCore.user.name && (a += "-name", b += "-name"), dialogs.createDialog({
                    showFormImmediately: !0,
                    head: a,
                    text: b,
                    form: [{
                        type: "button",
                        text: "didCallSucceed.action_yes",
                        action: dialogs.pleaseRateCall
                    }, {
                        type: "button",
                        text: "didCallSucceed.action_no",
                        action: dialogs.forceMajeure
                    }]
                })
            },
            subscribeAndShare: function() {
                dialogs.createDialog({
                    centeredHead: "subscribeAndShare.head",
                    centeredText: "subscribeAndShare.text",
                    form: [{
                        type: "text",
                        name: "email",
                        text: "subscribeAndShare.input_email"
                    }, {
                        type: "submit",
                        text: "subscribeAndShare.action_submit",
                        action: function(a, b) {
                            return a.email ? 0 === a.email.length || -1 === a.email.indexOf("@") || -1 === a.email.indexOf(".") ? b.email("subscribeAndShare.error_invalid_email") : void dialogs.subscribed() : b.email("subscribeAndShare.error_no_email")
                        },
                        doNotSave: !0
                    }, {
                        type: "share",
                        text: "subscribeAndShare.share"
                    }]
                })
            },
            subscribed: function() {
                dialogs.createDialog({
                    centeredHead: "subscribed.head",
                    centeredText: "subscribed.text",
                    form: [{
                        type: "button",
                        text: "subscribed.action_hide",
                        action: helpers.hideWidget,
                        doNotSave: !0
                    }]
                })
            },
            enterWelcome: function() {
                return dialogs.currentAction = null, delete dialogs.currentOptions, dialogs.intro()
            },
            letMeGetUsedTo: function() {
                dialogs.createDialog({
                    height: is_mobile ? "390px" : "250px",
                    head: "letMeGetUsedTo.head",
                    text: "letMeGetUsedTo.text",
                    form: [{
                        type: "button",
                        text: "letMeGetUsedTo.action_ok",
                        action: dialogs.farewell,
                        doNotSave: !0
                    }, {
                        type: "button",
                        text: "letMeGetUsedTo.action_hide",
                        action: helpers.hideWidget,
                        doNotSave: !0
                    }]
                })
            },
            whatWouldYouLikeToBeCalled: function(a) {
                a = a || {};
                var b, c;
                SCCore.user.name ? dialogs.doYouWantRecordsOnEmail() : (b = a.head ? a.head : "whatWouldYouLikeToBeCalled.head", c = a.text ? a.text : "whatWouldYouLikeToBeCalled.text", dialogs.createDialog({
                    height: is_mobile ? "390px" : "250px",
                    head: b,
                    text: c,
                    showFormImmediately: !0,
                    form: [{
                        type: "text",
                        text: "whatWouldYouLikeToBeCalled.input_name",
                        name: "name",
                        value: SCCore.user.name || ""
                    }, {
                        type: "checkbox",
                        text: "whatWouldYouLikeToBeCalled.checkbox_oferta",
                        name: "oferta",
                        checked: !0
                    }, {
                        type: "submit",
                        text: "whatWouldYouLikeToBeCalled.action_submit",
                        action: function(a, b) {
                            dialogs.saveName(a, b, dialogs.doYouWantRecordsOnEmail)
                        },
                        doNotSave: !0
                    }, {
                        type: "link",
                        text: "whatWouldYouLikeToBeCalled.link_skip",
                        action: dialogs.doYouWantRecordsOnEmail
                    }]
                }))
            },
            doYouWantRecordsOnEmail: function(a) {
                var b, c;
                helpers.freeMode() ? SCCore.user.name ? (b = "doYouWantRecordsOnEmail.head-free-name", c = "worktime" === widget_mode ? "doYouWantRecordsOnEmail.text_worktime-free-name" : "doYouWantRecordsOnEmail.text_off-free-name") : "worktime" === widget_mode ? (b = "doYouWantRecordsOnEmail.head_worktime-free", c = "doYouWantRecordsOnEmail.text_worktime-free") : (b = "doYouWantRecordsOnEmail.head_off-free", c = "doYouWantRecordsOnEmail.text_off-free") : SCCore.user.name ? (b = "doYouWantRecordsOnEmail.head-name", c = a ? "doYouWantRecordsOnEmail.text_call_rated-name" : "doYouWantRecordsOnEmail.text-name") : a ? (b = "doYouWantRecordsOnEmail.head_call_rated", c = "doYouWantRecordsOnEmail.text_call_rated") : (b = "doYouWantRecordsOnEmail.head", c = "doYouWantRecordsOnEmail.text"), dialogs.createDialog({
                    head: b,
                    text: c,
                    form: [{
                        type: "text",
                        text: "doYouWantRecordsOnEmail.input_email",
                        name: "email",
                        value: SCCore.user.email
                    }, {
                        type: "submit",
                        text: "doYouWantRecordsOnEmail.action_submit",
                        action: dialogs.saveEmailRecordsPreference
                    }, {
                        type: "link",
                        text: "doYouWantRecordsOnEmail.link_no",
                        action: dialogs.hopeIEarnedYourSmile
                    }]
                })
            },
            saveEmailRecordsPreference: function(a, b) {
                dialogs.validateEmail(a, b, function() {
                    dialogs.saveEmail(a.email), SCCore.server.send({
                        email: a.email
                    }), dialogs.hopeIEarnedYourSmile()
                })
            },
            hopeIEarnedYourSmile: function() {
                var a, b;
                SCCore.user.name ? (a = "hopeIEarnedYourSmile.head-name", b = "hopeIEarnedYourSmile.text-name") : (a = "hopeIEarnedYourSmile.head", b = "hopeIEarnedYourSmile.text"), dialogs.createDialog({
                    head: a,
                    text: b,
                    form: [{
                        type: "share",
                        text: "hopeIEarnedYourSmile.share"
                    }]
                })
            },
            forceMajeure: function() {
                var a, b;
                SCCore.user.name ? (a = "forceMajeure.head-name", b = "forceMajeure.text-name") : (a = "forceMajeure.head", b = "forceMajeure.text"), dialogs.createDialog({
                    head: a,
                    text: b,
                    form: [{
                        type: "button",
                        text: "forceMajeure.action_ok",
                        action: function() {
                            sendActualCallback(), dialogs.hopeIEarnedYourSmile()
                        },
                        doNotSave: !0
                    }, {
                        type: "link",
                        text: "forceMajeure.action_no",
                        action: dialogs.hopeIEarnedYourSmile,
                        doNotSave: !0
                    }]
                })
            },
            aboutMobile: function(a) {
                dialogs.createDialog({
                    form: [{
                        type: "custom",
                        custom: function(a) {
                            a.html(tpl.about_mobile())
                        }
                    }, {
                        type: "link",
                        text: "aboutMobile.link_close",
                        action: helpers.isFunction(a) ? a : showSimpleMobileDialog
                    }]
                })
            },
            chat: function() {
                showSimpleDialog(), topMenu.activate("chat"), helpers.showDialogItem("#cbh_chat"), typingEffect.effect(), chat.connect()
            },
            messageCall: function() {
                showSimpleDialog(), topMenu.activate("messageCall"), helpers.showDialogItem("#cbh_mc"), typingEffect.effect(), messageCall.init()
            }
        },
        socketIo = {
            connect: function(a) {
                socketIo.io = io.connect(SCCore.opt.socketIOEndpoint), socketIo.io.on("connect", function() {
                    socketIo.io.emit("init", {
                        sid: SCCore.user.session_id,
                        code: SCCore.hunter_code
                    })
                }), socketIo.io.on("initFinish", function() {
                    a()
                })
            }
        },
        callStatus = {
            progressTimeout: null,
            statusTimeout: null,
            autoRefreshStatus: !0,
            connect: function() {
                return helpers.freeMode() ? void 0 : socketIo.io ? void(callStatus.io || (callStatus.io = socketIo.io, callStatus.io.on("connect", callStatus.subscribe), callStatus.subscribe(), callStatus.io.on("callStatus", function(a) {
                    callStatus.changeStatus(a.event)
                }))) : socketIo.connect(callStatus.connect)
            },
            subscribe: function() {
                callStatus.io.emit("callStatus")
            },
            changeStatus: function(a) {
                if (clearTimeout(callStatus.statusTimeout), callStatus.autoRefreshStatus) {
                    var b = "";
                    switch (a) {
                        case "callingToManager":
                            b = SCCore.user.name ? __("callStatus.callingToManager-name", {
                                name: SCCore.user.name
                            }) : __("callStatus.callingToManager");
                            break;
                        case "managerInvalid":
                            b = b = __("callStatus.managerInvalid");
                            break;
                        case "callingToClient":
                            b = SCCore.user.name ? __("callStatus.callingToClient-name", {
                                name: SCCore.user.name
                            }) : __("callStatus.callingToClient"), callStatus.statusTimeout = setTimeout(function() {
                                callStatus.changeStatus("callingToClient2")
                            }, 3500);
                            break;
                        case "callingToClient2":
                            b = SCCore.user.name ? __("callStatus.callingToClient2-name", {
                                name: SCCore.user.name
                            }) : __("callStatus.callingToClient2"), callStatus.statusTimeout = setTimeout(function() {
                                callStatus.changeStatus("callingToClient3")
                            }, 3e3);
                            break;
                        case "callingToClient3":
                            b = __("callStatus.callingToClient3");
                            break;
                        case "callingToClient4":
                            b = SCCore.user.name ? __("callStatus.callingToClient4-name", {
                                name: SCCore.user.name
                            }) : __("callStatus.callingToClient4");
                            break;
                        case "client":
                            b = __("callStatus.client");
                            break;
                        case "clientInvalid":
                            b = SCCore.user.name ? __("callStatus.clientInvalid-name", {
                                name: SCCore.user.name
                            }) : __("callStatus.clientInvalid")
                    }
                    if ("" != b) {
                        b = '<span class="cbh-typing">' + b + "</span>", callStatus.render(b);
                        var c = typingEffect.getSpeed();
                        typingEffect.setSpeed(30, 30), typingEffect.effect({
                            doNotReset: !0,
                            noCursor: !0
                        }, function() {
                            clearTimeout(callStatus.progressTimeout), callStatus.progressTimeout = setTimeout(callStatus.progressDots, 1e3), typingEffect.setSpeed(c[0], c[1])
                        })
                    }
                }
            },
            render: function(a) {
                $(".cbh-status").html(a)
            },
            progressDots: function() {
                $(".cbh-status").forEach(function(a) {
                    var b = a.getElementsByTagName("span")[0];
                    a && b && (/\.\.\.$/.test(b.innerHTML) ? b.innerHTML = b.innerHTML.replace(/\.\.\.$/, ".") : /\.\.$/.test(b.innerHTML) ? b.innerHTML = b.innerHTML.replace(/\.\.$/, "...") : /\.$/.test(b.innerHTML) && (b.innerHTML = b.innerHTML.replace(/\.$/, "..")))
                }), callStatus.progressTimeout = setTimeout(callStatus.progressDots, 1e3)
            }
        },
        chat = {
            timeout: 2,
            inited: !1,
            loading: !1,
            currentBacklog: 0,
            perBatch: 10,
            maxBacklog: 50,
            oldestMessage: null,
            connect: function() {
                return socketIo.io ? void(chat.io || (chat.io = socketIo.io, chat.color = "", chat.canPost = !0, chat.io.on("connect", chat.enterChat), chat.io.on("disconnect", chat.handleDisconnect), chat.io.on("chatData", chat.handleJoinData), chat.io.on("chatLogs", chat.handleLogs), chat.io.on("chatMessage", chat.handleIncomingMessage), chat.enterChat(), $("#cbh_chat_send").on("click", chat.sendMessage), $("#cbh_chat_msg").on("keyup", chat.sendMessageKeyboard), sound_chat_message && widgetSounds.add("chatMessage", "chat_message.mp3"))) : socketIo.connect(chat.connect)
            },
            enterChat: function() {
                chat.io.emit("chatJoin")
            },
            requestLogs: function(a, b) {
                chat.io.emit("chatRequestLogs", {
                    length: a,
                    beforeDate: b
                })
            },
            handleLogs: function(a) {
                chat.currentBacklog += a.length, a[0] && (chat.oldestMessage = a[0].date), a.reverse().forEach(chat.prependMessage);
                var b = $(".cbh-messages");
                if (chat.inited ? b.prop("scrollTop", 10) : (chat.inited = !0, b.prop("scrollTop", 1e3)), a.length == chat.perBatch && chat.currentBacklog < chat.maxBacklog) {
                    chat.loading = !1;
                    var c = function() {
                        0 != b.prop("scrollTop") || chat.loading || (chat.loading = !0, b.off("scroll", c), chat.requestLogs(chat.perBatch, chat.oldestMessage))
                    };
                    b.on("scroll", c)
                }
            },
            handleDisconnect: function() {
                $("#cbh_chat_msg").css("border-bottom", "none!important;")
            },
            handleJoinData: function(a) {
                chat.color = a.color, $("#cbh_chat_msg").css("border-bottom", "3px solid " + chat.color + "!important;"), chat.inited || chat.requestLogs(chat.perBatch)
            },
            handleIncomingMessage: function(a) {
                var b = chat.color == a.color ? "left" : "right";
                chat.addMessage(a.message, a.color, b), widgetSounds.play("chatMessage")
            },
            prependMessage: function(a) {
                var b = chat.color == a.color ? "left" : "right",
                    c = $('<div class="cbh-message cbh-' + b + '"><span style="color: #000; background-color: ' + a.color + ' !important;">' + linkify(a.message) + "</span></div>");
                $("#cbh_chat_messages").prepend(c)
            },
            sendMessageKeyboard: function(a) {
                return 13 == a.which || 13 == a.keyCode ? (chat.sendMessage(), !1) : !0
            },
            sendMessage: function() {
                if (!chat.canPost) return !1;
                chat.canPost = !1;
                var a = $("#cbh_chat_msg");
                if (a.exists()) {
                    var b = a.val();
                    return b.length ? (a.val(""), setTimeout(function() {
                        chat.canPost = !0
                    }, 1e3 * chat.timeout), chat.io.emit("chatMessage", b), b = b.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;"), chat.addMessage(b, chat.color, "left"), !1) : (chat.canPost = !0, !1)
                }
            },
            addMessage: function(a, b, c) {
                var d = $(".cbh-chat-messages"),
                    e = d.prop("scrollTop") + d.prop("clientHeight") == d.prop("scrollHeight"),
                    f = $('<div class="cbh-message cbh-' + c + '"><span style="color: #000; background-color: ' + b + ' !important;">' + linkify(a) + "</span></div>");
                $("#cbh_chat_messages").append(f), (e || "left" == c) && d.prop("scrollTop", d.prop("scrollHeight"))
            }
        },
        messageCall = {
            colors: {
                mine: "#2772BB",
                other: "#7CC478"
            },
            align: {
                mine: "left",
                other: "right"
            },
            chatId: "",
            autoPilot: !1,
            openChat: !1,
            role: "client",
            messages: [],
            sendData: {},
            init: function() {
                return socketIo.io ? void(this.io || (this.io = socketIo.io, this.io.on("mcManagerJoin", this.stop.bind(this)), this.io.on("mcAutoJoin", this.autoJoin.bind(this)), this.io.on("mcLogs", this.handleLogs.bind(this)), this.io.on("mcMessage", this.handleIncomingMessage.bind(this)), this.io.on("mcNoJoin", this.noJoin.bind(this)), $("#cbh_mc_start").on("click", this.startChat.bind(this)), $("#cbh_mc_send").on("click", this.sendMessage.bind(this)), $("#cbh_mc_msg").on("keyup", this.sendMessageKeyboard.bind(this)), $("#cbh_mc").addStyle({
                    height: "20%"
                }), sound_chat_message && widgetSounds.add("chatMessage", "chat_message.mp3"), this.io.emit("mcConnect"))) : socketIo.connect(this.init.bind(this))
            },
            autoJoin: function(a) {
                this.role = a, this.showChat(), this.io.emit("mcLogs")
            },
            noJoin: function() {
                this.addMessage(__("messageCall.noJoin"), "other")
            },
            managerJoin: function(a) {
                this.chatId = a, this.role = "manager", this.io.emit("mcCode", a), this.io.on("mcManagerJoined", function() {
                    this.io.emit("mcLogs")
                }.bind(this))
            },
            handleIncomingMessage: function(a) {
                this.addMessage(a.message, "other"), widgetSounds.play("chatMessage")
            },
            handleLogs: function(a) {
                $(".cbh-mc-messages").prop("scrollTop", 1e3), a.reverse().forEach(function(a) {
                    var b = a.from == this.role ? "mine" : "other";
                    this.prependMessage(a.message, b)
                }.bind(this))
            },
            sendMessageKeyboard: function(a) {
                return 13 == a.which || 13 == a.keyCode ? (this.openChat ? this.sendMessage() : this.startChat(), !1) : !0
            },
            getMessage: function() {
                var a = $("#cbh_mc_msg");
                if (!a.exists()) return !1;
                var b = a.val();
                return b.length ? (a.val(""), b) : !1
            },
            showChat: function() {
                $(".cbh-mc-chat").show(), $("#cbh_mc_start").hide(), $("#cbh_mc_send").show(), this.openChat = !0, $("#cbh_mc").addStyle({
                    height: "60%"
                })
            },
            startChat: function() {
                var a = this.getMessage();
                if (a) {
                    this.showChat();
                    var b = /^=(\d+)$/.exec(a);
                    if (b) return this.managerJoin(b[1]);
                    this.addMessage(a, "mine"), this.countdownObj = new Countdown({
                        elemId: "cbh_mc_timer",
                        time: 6e4,
                        template: '<div class="cbh-numbs">%minutes%</div><div class="cbh-d">:</div><div class="cbh-numbs">%seconds%</div><div class="cbh-d">:</div><div class="cbh-numbs">%ms%</div>'
                    }), this.countdownObj.start(function() {
                        this.startAutoPilot()
                    }.bind(this)), this.messages.push(a), this.io.emit("mcStart", a)
                }
            },
            sendMessage: function() {
                var a = this.getMessage();
                if (a) return this.autoPilot ? setTimeout(function() {
                    this.autoPilot(a)
                }.bind(this), 1e3) : (this.messages.push(a), this.io.emit("mcMessage", a)), this.addMessage(a, "mine"), !1
            },
            stop: function() {
                this.autoPilot || this.countdownObj && this.countdownObj.stop()
            },
            prependMessage: function(a, b) {
                var c = $('<div class="cbh-message cbh-' + this.align[b] + '"><span style="background-color: ' + this.colors[b] + ' !important;">' + linkify(a) + "</span></div>");
                $("#cbh_mc_messages").prepend(c)
            },
            addMessage: function(a, b) {
                a = a.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                var c = $(".cbh-mc-messages"),
                    d = !1;
                c.prop("scrollTop") + c.prop("clientHeight") == c.prop("scrollHeight") && (d = !0);
                var e = $('<div class="cbh-message cbh-' + this.align[b] + '"><span style="background-color: ' + this.colors[b] + ' !important;">' + linkify(a) + "</span></div>");
                $("#cbh_mc_messages").append(e), (d || "mine" == b) && c.prop("scrollTop", c.prop("scrollHeight"))
            },
            startAutoPilot: function() {
                var a;
                a = SCCore.user.name ? __("messageCall.autoPilot.start-name", {
                    name: SCCore.user.name
                }) : __("messageCall.autoPilot.start"), this.addMessage(a, "other"), setTimeout(function() {
                    this.addMessage(__("messageCall.autoPilot.writeHere"), "other")
                }.bind(this), 2e3), this.sendData.name = SCCore.user.name || "", this.sendData.question = this.messages.join(". "), this.autoPilot = this.checkEmailAutoPilot
            },
            checkEmailAutoPilot: function(a) {
                var b = a.trim();
                return /.*@.*\..*/.test(b) ? (dialogs.saveEmail(b), this.sendData.email = b, this.sendQuestion(), SCCore.user.name ? text = __("messageCall.autoPilot.writePhone-name", {
                    name: SCCore.user.name
                }) : text = __("messageCall.autoPilot.writePhone"), this.addMessage(text, "other"), void(this.autoPilot = this.checkPhoneAutoPilot)) : (SCCore.user.name ? text = __("messageCall.autoPilot.wrongEmail-name", {
                    name: SCCore.user.name
                }) : text = __("messageCall.autoPilot.wrongEmail"), void this.addMessage(text, "other"))
            },
            checkPhoneAutoPilot: function(a) {
                var b;
                this.sendData.phone = a, this.sendQuestion(), b = __("messageCall.autoPilot.thanks"), this.addMessage(b, "other"), this.autoPilot = function() {}
            },
            sendQuestion: function() {
                SCCore.server.send({
                    question: JSON.stringify(this.sendData)
                })
            }
        };
    return {
        init: function() {
            init()
        },
        showSimpleDialog: function() {
            showSimpleDialog()
        },
        showWidgetExit: function() {
            showWidgetExit()
        },
        showWidgetEnter: function() {
            showWidgetEnter()
        },
        showNamedDialog: function(a) {
            showNamedDialog(a)
        }
    }
}(this, this.document, this.location);