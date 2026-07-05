! function() {
    /* ===== webCV判定ガード（非webCVページでは誘導のみ表示して終了） ===== */
    /* hostnameを小文字化し、webCVのドメイン断片を含むかで判定する。パスは判定に使わない */
    var __pvHost = (location.hostname || "").toLowerCase();
    var __pvIsWebCV = -1 !== __pvHost.indexOf("inet-cvweb.jp") || -1 !== __pvHost.indexOf("cvweb.ntv.jp");
    if (!__pvIsWebCV) {
        /* 再実行時の重複防止: 既存の誘導オーバーレイ/スタイルがあれば除去 */
        var __pvOldOv = document.getElementById("__pvtool_overlay");
        __pvOldOv && __pvOldOv.parentNode && __pvOldOv.parentNode.removeChild(__pvOldOv);
        var __pvOldStyle = document.getElementById("__pvtool_guide_style");
        __pvOldStyle && __pvOldStyle.parentNode && __pvOldStyle.parentNode.removeChild(__pvOldStyle);
        /* webCVのURL定義（社内/社外） */
        var __pvUrls = [{
            label: "社内用(スターネット)",
            url: "https://snet-cvweb.ntv.jp"
        }, {
            label: "社外用(インターネット/VPN)",
            url: "https://www.inet-cvweb.jp"
        }];
        /* HTMLエスケープ（属性/本文への差し込み用） */
        var __pvEsc = function(s) {
            var d = document.createElement("div");
            d.textContent = null == s ? "" : String(s);
            return d.innerHTML
        };
        /* execCommandベースのコピー（無関係サイト上でも確実に動くフォールバック方式。既存コードと同方式） */
        var __pvCopy = function(text) {
            try {
                var ta = document.createElement("textarea");
                ta.value = null == text ? "" : String(text);
                ta.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;";
                document.body.appendChild(ta);
                ta.focus();
                ta.select();
                var ok = document.execCommand("copy");
                document.body.removeChild(ta);
                return ok
            } catch (e) {
                return !1
            }
        };
        /* 誘導ページ専用スタイル（既存パネルの見た目を踏襲。idを付けて再実行時に除去できるようにする） */
        var __pvStyle = document.createElement("style");
        __pvStyle.id = "__pvtool_guide_style";
        __pvStyle.textContent = '#__pvtool_overlay,#__pvtool_overlay *{box-sizing:border-box;font-family:-apple-system,"Segoe UI",Meiryo,sans-serif;}#__pvtool_overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;}#__pvtool_overlay .__pv_panel{width:560px;max-width:94vw;max-height:88vh;background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;}#__pvtool_overlay .__pv_head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#1e293b;color:#fff;}#__pvtool_overlay .__pv_title{font-size:15px;font-weight:700;letter-spacing:.02em;}#__pvtool_overlay .__pv_close{cursor:pointer;border:none;background:transparent;color:#cbd5e1;font-size:22px;line-height:1;padding:2px 6px;border-radius:6px;}#__pvtool_overlay .__pv_close:hover{background:rgba(255,255,255,.12);color:#fff;}#__pvtool_overlay .__pv_body{padding:20px 18px;overflow-y:auto;background:#fff;}#__pvtool_overlay .__pv_lead{font-size:15px;color:#0f172a;line-height:1.85;margin:0 0 18px;}#__pvtool_overlay .__pv_emph{font-weight:700;color:#dc2626;background:#fef2f2;border-bottom:2px solid #dc2626;padding:0 2px;}#__pvtool_overlay .__pv_urlrow{display:flex;align-items:center;gap:10px;padding:14px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:10px;background:#fff;cursor:pointer;transition:background .15s,border-color .15s,box-shadow .15s;}#__pvtool_overlay .__pv_urlrow:hover{background:#f8fafc;border-color:#93c5fd;box-shadow:0 2px 8px rgba(37,99,235,.12);}#__pvtool_overlay .__pv_urlmain{flex:1;min-width:0;}#__pvtool_overlay .__pv_urllabel{font-size:16px;color:#1e293b;font-weight:700;margin-bottom:4px;}#__pvtool_overlay .__pv_urllink{font-size:14px;color:#2563eb;text-decoration:underline;word-break:break-all;cursor:pointer;}#__pvtool_overlay .__pv_urllink:hover{color:#1d4ed8;}#__pvtool_overlay .__pv_copy{cursor:pointer;border:1px solid #cbd5e1;background:#fff;color:#334155;font-size:12px;font-weight:600;padding:7px 12px;border-radius:8px;white-space:nowrap;flex:none;}#__pvtool_overlay .__pv_copy:hover{background:#f8fafc;}#__pvtool_overlay .__pv_copy:disabled{opacity:.6;cursor:default;}#__pvtool_overlay .__pv_note{font-size:12px;color:#94a3b8;margin:14px 0 0;line-height:1.7;}';
        document.head.appendChild(__pvStyle);
        /* オーバーレイ生成 */
        var __pvOv = document.createElement("div");
        __pvOv.id = "__pvtool_overlay";
        /* URL行（ラベル＋クリックで遷移するリンク＋コピーボタン）を組み立て */
        var __pvRows = "";
        __pvUrls.forEach(function(u) {
            __pvRows += '<div class="__pv_urlrow" data-go="' + __pvEsc(u.url) + '"><div class="__pv_urlmain"><div class="__pv_urllabel">' + __pvEsc(u.label) + '</div><span class="__pv_urllink" data-go="' + __pvEsc(u.url) + '">' + __pvEsc(u.url) + '</span></div><button class="__pv_copy" data-copy="' + __pvEsc(u.url) + '">コピー</button></div>'
        });
        __pvOv.innerHTML = '<div class="__pv_panel"><div class="__pv_head"><div class="__pv_title">【webCV】メタコピーツール</div><button class="__pv_close" id="__pv_guide_close">×</button></div><div class="__pv_body"><p class="__pv_lead">webCVメタコピーツールは<span class="__pv_emph">webCVを開いた状態で実行</span>してください。</p>' + __pvRows + '<p class="__pv_note">webCVへアクセスしてから本ツールを再度実行してください。</p></div></div>';
        document.body.appendChild(__pvOv);
        /* 後始末: オーバーレイとスタイルをまとめて除去 */
        var __pvCloseGuide = function() {
            __pvOv.parentNode && __pvOv.parentNode.removeChild(__pvOv);
            __pvStyle.parentNode && __pvStyle.parentNode.removeChild(__pvStyle)
        };
        /* ×ボタン・背景クリックで閉じる */
        __pvOv.querySelector("#__pv_guide_close").onclick = __pvCloseGuide;
        __pvOv.onclick = function(ev) {
            ev.target === __pvOv && __pvCloseGuide()
        };
        /* タイル（行）全体クリックで現在タブを遷移。コピーボタンはstopPropagationで除外済み */
        Array.prototype.forEach.call(__pvOv.querySelectorAll(".__pv_urlrow"), function(el) {
            el.onclick = function() {
                location.href = el.getAttribute("data-go")
            }
        });
        /* コピーボタン: execCommandでコピーし、成功時はラベルを一時的に変更（既存のq()はこの時点で未定義のため独自フィードバック） */
        Array.prototype.forEach.call(__pvOv.querySelectorAll(".__pv_copy"), function(btn) {
            btn.onclick = function(ev) {
                ev.stopPropagation();
                var ok = __pvCopy(btn.getAttribute("data-copy"));
                var orig = btn.textContent;
                btn.textContent = ok ? "コピーしました" : "失敗";
                btn.disabled = !0;
                setTimeout(function() {
                    btn.textContent = orig;
                    btn.disabled = !1
                }, 1600)
            }
        });
        return; /* 非webCVではここで終了。以降の既存処理（フック/キャプチャ等）は一切実行しない */
    }
    /* ===== 以下、従来どおり（webCV上でのみ実行） ===== */
    var e = window;
    try {
        window.opener && !window.opener.closed && window.opener.location.origin === location.origin && (e = window.opener)
    } catch (e) {}
    if (!e.__previewHookInstalled) {
        e.__openedPreviews = [], e.__openedRegists = [];
        var t = e.open;
        e.open = function(n) {
            var a = t.apply(e, arguments);
            try {
                if (n && /\/material\/preview\?/.test(n)) {
                    var o = Object.fromEntries(new URL(n, e.location.origin).searchParams);
                    e.__openedPreviews.push({
                        url: n,
                        win: a,
                        materialNumber: o.materialNumber,
                        materialID: o.materialID,
                        materialSubNumber: o.materialSubNumber,
                        openedAt: (new Date).toISOString()
                    })
                } else n && -1 !== n.indexOf("original-material-regist") && e.__openedRegists.push({
                    win: a,
                    openedAt: (new Date).toISOString()
                })
            } catch (e) {}
            return a
        }, e.__previewHookInstalled = !0
    }
    var n = document.getElementById("__pvtool_overlay");
    n && n.parentNode.removeChild(n);
    var a = async function(e) {
        var t = e.win.document,
            n = function(e) {
                return Array.from(t.querySelectorAll(e))
            },
            a = function(e) {
                var n = t.querySelector('select[name="' + e + '"]');
                return n ? n.selectedOptions[0]?.text || "" : null
            },
            o = function(e) {
                for (var t = n("*").filter(function(t) {
                        return 0 === t.children.length && t.textContent.trim() === e
                    }), a = 0; a < t.length; a++) {
                    var o = t[a],
                        i = o.closest("tr, div.row, .row");
                    if (i)
                        for (var r = i.querySelectorAll("input:not([type=hidden]):not([type=radio]):not([type=checkbox]), textarea, select"), l = 0; l < r.length; l++) {
                            var c = r[l];
                            if (o.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING) return "SELECT" === c.tagName ? c.selectedOptions[0]?.text || "" : c.value
                        }
                }
                return null
            },
            i = function(e) {
                var t = n("a, button, li, span, div").filter(function(t) {
                        return t.textContent.trim() === e && t.children.length <= 2
                    }),
                    a = t.find(function(e) {
                        return "A" === e.tagName || "BUTTON" === e.tagName || "tab" === e.getAttribute("role")
                    }) || t[0];
                return !!a && (a.click(), !0)
            };
        i("素材内容"), await new Promise(function(e) {
            setTimeout(e, 400)
        });
        var r = n('input[type="radio"][name="ViewModel.SelectRadioItem"]'),
            l = r.find(function(e) {
                return e.checked
            })?.id,
            c = t.getElementById("LimitDetail"),
            d = c && !c.checked;
        d && (c.click(), await new Promise(function(e) {
            setTimeout(e, 400)
        }));
        var s = n("tr.specialnote-contents-row.bg-caution .detail-note-col").map(function(e) {
                return e.textContent.trim()
            }).filter(function(e) {
                return e.length > 0
            }),
            p = s.join("\n------\n"),
            _ = s.length > 0 ? "使用注意" : "制限なし",
            u = t.querySelector('select[name="ViewModel.MaterialTitleHeader"]'),
            v = null,
            f = null;
        if (u) {
            v = u.selectedOptions[0]?.text || "";
            var g = u.closest("tr")?.querySelector('input.form-control[type="text"]');
            g && (f = g.value)
        }
        for (var b = null, m = n("textarea.form-textarea.w-100"), y = 0; y < m.length; y++) {
            var x = m[y].closest("tr");
            if (x) {
                var h = x.querySelector("label");
                if (h && "配信制限特記" === h.textContent.replace(/\s+/g, "")) {
                    b = m[y].value;
                    break
                }
            }
        }
        for (var k = null, w = 0; w < m.length; w++) {
            var S = m[w].closest("tr");
            if (S) {
                var T = S.querySelector("label");
                if (T && "素材内容" === T.textContent.replace(/\s+/g, "")) {
                    k = m[w].value;
                    break
                }
            }
        }
        var E = function(e) {
                for (var n = t.querySelectorAll(e), a = 0; a < n.length; a++) {
                    var o = n[a].getBoundingClientRect();
                    if (o.width > 0 && o.height > 0) return n[a]
                }
                return n[0] || null
            },
            C = null,
            I = null,
            R = i("管理情報");
        R && await new Promise(function(e) {
            setTimeout(e, 500)
        });
        var A = E("input.item-main-code"),
            N = E("input.item-sub-code"); /* 主題・副題コード: 活性時はinput.value。inputが空(非活性で値は表示専用divにある)時はdiv群から非空テキストを採用。divは可視かつ非空を最優先、無ければ非空のものを返す(先頭の空プレースホルダdivを除外) */
        var readCodeText = function(sel) {
            for (var nodes = t.querySelectorAll(sel), first = null, j = 0; j < nodes.length; j++) {
                var txt = (nodes[j].textContent || "").trim();
                if (txt) {
                    if (null === first) first = txt;
                    var cr = nodes[j].getBoundingClientRect();
                    if (cr.width > 0 && cr.height > 0) return txt
                }
            }
            return first
        };
        C = A && "" !== A.value.trim() ? A.value : readCodeText("div.main_code_text");
        I = N && "" !== N.value.trim() ? N.value : readCodeText("div.sub_code_text");
        R && (i("素材内容"), await new Promise(function(e) {
            setTimeout(e, 400)
        }));
        var q = a("ViewModel.DeliveryRestrictionCode"),
            M = {
                materialNumber: e.materialNumber,
                materialID: e.materialID,
                materialTitle: (v || "") + (f || ""),
                materialTitleHeader: v,
                materialTitleBody: f,
                description: k,
                person: o("人物"),
                place: o("場所"),
                category: o("カテゴリ"),
                genre: o("ジャンル"),
                group: a("ViewModel.GroupId"),
                usageScope: a("ViewModel.UsageScopeId"),
                downloadScope: a("ViewModel.DownloadScopeId"),
                deliveryRestriction: q,
                deliveryRestrictionNote: "制限なし" === q ? null : b,
                producer: o("製作著作"),
                audioType: a("ViewModel.AudioTypeCode"),
                recordingType: a("ViewModel.RecordingTypeCode"),
                recordingDetail: o("収録詳細"),
                reporter: o("記者"),
                directorD: o("担当D"),
                cameraman: o("撮影者"),
                broadcastStation: o("発局"),
                archiveTarget: a("ViewModel.ArchiveTarget"),
                coverageDate: o("取材日"),
                broadcastDate: o("放送日"),
                recordingDate: o("収録日"),
                mainCode: C,
                subCode: I,
                usageRestrictionType: _,
                usageRestrictionNotes: s.length > 0 ? p : null,
                usageRestrictionCount: s.length,
                capturedAt: (new Date).toISOString()
            };
        return d && l && "LimitDetail" !== l && t.getElementById(l)?.click(), M
    }, o = [{
        key: "materialTitleHeader",
        label: "素材タイトル(ヘッダ)",
        type: "select",
        domId: "MaterialTitleHeader"
    }, {
        key: "materialTitleBody",
        label: "素材タイトル(本文)",
        type: "text",
        selector: "#MaterialTitleHeader",
        titleBody: !0
    }, {
        key: "description",
        label: "素材内容",
        type: "textarea",
        domId: "MaterialContent"
    }, {
        key: "usageRestrictionType",
        label: "使用制限",
        type: "select",
        domId: "UsageRestrictionId"
    }, {
        key: "usageRestrictionNotes",
        label: "使用制限特記",
        type: "textarea",
        restrictionNote: "usage"
    }, {
        key: "person",
        label: "人物",
        type: "text",
        domId: "Character"
    }, {
        key: "place",
        label: "場所",
        type: "text",
        domId: "Location"
    }, {
        key: "category",
        label: "カテゴリ",
        type: "select",
        domId: "CategoryCode"
    }, {
        key: "genre",
        label: "ジャンル",
        type: "select",
        domId: "GenreCode",
        parent: "category"
    }, {
        key: "group",
        label: "所有グループ",
        type: "select",
        domId: "GroupeId"
    }, {
        key: "usageScope",
        label: "利用範囲",
        type: "select",
        domId: "UsageScopeId"
    }, {
        key: "downloadScope",
        label: "ダウンロード範囲",
        type: "select",
        domId: "DownloadScopeId"
    }, {
        key: "deliveryRestriction",
        label: "配信制限",
        type: "select",
        domId: "DeliveryRestrictionCode"
    }, {
        key: "deliveryRestrictionNote",
        label: "配信制限特記",
        type: "textarea",
        domId: "DeliveryRestrictionSpecialNotes",
        restrictionNote: "delivery"
    }, {
        key: "producer",
        label: "製作著作",
        type: "text",
        labelRow: "製作著作"
    }, {
        key: "audioType",
        label: "音声区分",
        type: "select",
        domId: "AudioTypeCode"
    }, {
        key: "recordingType",
        label: "収録区分",
        type: "select",
        domId: "RecordingTypeCode"
    }, {
        key: "recordingDetail",
        label: "収録詳細",
        type: "select",
        domId: "RecordingDetailType",
        parent: "recordingType"
    }, {
        key: "reporter",
        label: "記者",
        type: "text",
        domId: "Journalist"
    }, {
        key: "directorD",
        label: "担当D",
        type: "text",
        domId: "Director"
    }, {
        key: "cameraman",
        label: "撮影者",
        type: "text",
        domId: "Cameraman"
    }, {
        key: "broadcastStation",
        label: "発局",
        type: "text",
        domId: "BroadCastStation"
    }, {
        key: "archiveTarget",
        label: "アーカイブ",
        type: "select",
        domId: "ArchiveTarget"
    }, {
        key: "coverageDate",
        label: "取材日",
        type: "date",
        domId: "CoverageDate"
    }, {
        key: "broadcastDate",
        label: "放送日",
        type: "date",
        domId: "OnAirDate"
    }, {
        key: "mainCode",
        label: "主題コード",
        type: "text",
        selector: "input.item-main-code"
    }, {
        key: "subCode",
        label: "副題コード",
        type: "text",
        selector: "input.item-sub-code",
        subCode: !0
    }, {
        key: "transcription",
        label: "文字起こし",
        type: "radio",
        selector: 'input[type="radio"][name="InputViewModel.Transcription"]'
    }], i = {};
    o.forEach(function(e) {
        i[e.key] = e
    });
    var r, l, c = function(e, t, n) {
            var a = e.key,
                o = n && n[a] ? n[a] : null,
                i = o ? o.mode : null;
            if (!i) {
                if (!(a in t)) return {
                    action: "skip"
                };
                var r = t[a];
                return null == r || "" === r ? {
                    action: "null"
                } : {
                    action: "set",
                    value: r
                }
            }
            if ("skip" === i) return {
                action: "skip"
            };
            if ("null" === i) return {
                action: "null"
            };
            if ("executed" === i && "date" === e.type) {
                var l = new Date;
                return {
                    action: "set",
                    value: l.getFullYear() + "-" + ("0" + (l.getMonth() + 1)).slice(-2) + "-" + ("0" + l.getDate()).slice(-2)
                }
            }
            if ("monthly" === i && e.subCode) {
                var c = new Date;
                return {
                    action: "set",
                    value: ("0" + c.getFullYear() % 100).slice(-2) + ("0" + (c.getMonth() + 1)).slice(-2)
                }
            }
            if ("set" === i) {
                var d = o && "value" in o ? o.value : t[a];
                return null == d || "" === d ? {
                    action: "null"
                } : {
                    action: "set",
                    value: d
                }
            }
            return {
                action: "skip"
            }
        },
        d = function(e, t) {
            if (t || (t = window.open("", "OriginalMaterialRegistWindow")), !t) return q("ウィンドウを開けません", !0), !1;
            var n = "";
            try {
                n = t.location.href
            } catch (e) {
                return q("アクセス失敗: " + e.message, !0), !1
            }
            if (-1 === n.indexOf("original-material-regist")) return t.close(), q("元素材登録画面が見つかりません。先に開いてから再実行してください。", !0), !1;
            var a = t.document,
                r = e.fieldConfig || {};

            function l(e, t) {
                if (e) {
                    e.disabled && (e.disabled = !1);
                    var n = "TEXTAREA" === e.tagName ? HTMLTextAreaElement.prototype : "SELECT" === e.tagName ? HTMLSelectElement.prototype : HTMLInputElement.prototype,
                        a = Object.getOwnPropertyDescriptor(n, "value");
                    a && a.set ? a.set.call(e, t) : e.value = t, e.dispatchEvent(new Event("change", {
                        bubbles: !0
                    })), e.dispatchEvent(new Event("input", {
                        bubbles: !0
                    }))
                }
            }

            function d(e, t) {
                if (!e) return !1;
                for (var n = 0; n < e.options.length; n++)
                    if (e.options[n].text.trim() === String(t).trim()) return l(e, e.options[n].value), !0;
                return !1
            }
            var s = i.materialTitleHeader,
                p = i.materialTitleBody,
                _ = c(s, e, r),
                u = c(p, e, r),
                v = a.getElementById("MaterialTitleHeader"),
                f = v ? v.closest("tr")?.querySelector('input[type="text"]') : null;
            if ("skip" !== _.action || "skip" !== u.action) {
                var g = "set" === _.action ? _.value : "",
                    b = "set" === u.action ? u.value : "",
                    m = !1;
                if (v && g)
                    for (var y = 0; y < v.options.length; y++)
                        if (v.options[y].text.trim() === String(g).trim() || v.options[y].value === String(g)) {
                            m = !0;
                            break
                        }
                "set" !== _.action || m ? ("set" === _.action && v ? d(v, g) || l(v, g) : "null" === _.action && v && l(v, ""), "set" === u.action && f ? l(f, b) : "null" === u.action && f && l(f, "")) : (v && l(v, ""), !f || "set" !== u.action && "null" !== u.action || l(f, String(g || "") + String(b || "")))
            }
            var x = function(e) {
                    for (var t = e.nextElementSibling; t;) {
                        if ("LABEL" === t.tagName) return t.textContent.trim();
                        t = t.nextElementSibling
                    }
                    return e.value || ""
                },
                h = {
                    materialTitleHeader: 1,
                    materialTitleBody: 1,
                    category: 1,
                    genre: 1,
                    recordingType: 1,
                    recordingDetail: 1,
                    usageRestrictionNotes: 1,
                    deliveryRestrictionNote: 1
                };
            o.forEach(function(t) {
                if (!h[t.key]) {
                    var n = c(t, e, r);
                    if ("skip" !== n.action)
                        if ("radio" !== t.type) {
                            var o = function(e) {
                                if (e.domId) return a.getElementById(e.domId);
                                if (e.labelRow) {
                                    for (var t = a.querySelectorAll("tr"), n = 0; n < t.length; n++)
                                        if (-1 !== t[n].textContent.indexOf(e.labelRow)) return t[n].querySelector('input[type="text"]');
                                    return null
                                }
                                if (e.selector) {
                                    for (var o = a.querySelectorAll(e.selector), i = 0; i < o.length; i++) {
                                        var r = o[i].getBoundingClientRect();
                                        if (r.width > 0 && r.height > 0) return o[i]
                                    }
                                    return o[0] || null
                                }
                                return null
                            }(t);
                            o && ("null" !== n.action ? "set" === n.action && ("select" === t.type && d(o, n.value) || l(o, n.value)) : l(o, ""))
                        } else {
                            var i = a.querySelectorAll(t.selector);
                            if ("null" === n.action)
                                for (var s = 0; s < i.length; s++) i[s].checked = !1, i[s].dispatchEvent(new Event("change", {
                                    bubbles: !0
                                }));
                            else if ("set" === n.action)
                                for (var p = 0; p < i.length; p++) {
                                    var _ = i[p];
                                    if (x(_) === String(n.value).trim()) {
                                        _.click();
                                        break
                                    }
                                }
                        }
                }
            });
            var k = c(i.recordingType, e, r),
                w = c(i.recordingDetail, e, r),
                S = function() {
                    if ("skip" === w.action);
                    else if ("null" === w.action) {
                        var e = a.getElementById("RecordingDetailType");
                        e && l(e, "")
                    } else if ("set" === w.action) {
                        var t = a.getElementById("RecordingDetailType");
                        t && (d(t, w.value) || l(t, w.value))
                    }
                };
            if ("set" === k.action) {
                var T = a.getElementById("RecordingTypeCode");
                T && (d(T, k.value) || l(T, k.value));
                var E = a.getElementById("RecordingDetailType");
                if (E && "set" === w.action) {
                    var C = new MutationObserver(function(e, t) {
                        E.options.length > 1 && (t.disconnect(), S())
                    });
                    C.observe(E, {
                        childList: !0,
                        subtree: !0
                    }), setTimeout(function() {
                        C.disconnect(), S()
                    }, 3e3)
                } else S()
            } else if ("null" === k.action) {
                var I = a.getElementById("RecordingTypeCode");
                I && l(I, ""), S()
            } else S();
            var R = c(i.category, e, r),
                A = c(i.genre, e, r),
                N = function() {
                    if ("skip" === A.action);
                    else if ("null" === A.action) {
                        var n = a.getElementById("GenreCode");
                        n && l(n, "")
                    } else if ("set" === A.action) {
                        var o = a.getElementById("GenreCode");
                        o && (d(o, A.value) || l(o, A.value))
                    }
                    var s = c(i.deliveryRestriction, e, r),
                        p = c(i.deliveryRestrictionNote, e, r);
                    if ("set" === s.action) {
                        var _ = a.getElementById("DeliveryRestrictionCode");
                        _ && (d(_, s.value) || l(_, s.value))
                    } else if ("null" === s.action) {
                        var u = a.getElementById("DeliveryRestrictionCode");
                        u && l(u, "")
                    }
                    var v = "set" === s.action ? s.value : e.deliveryRestriction || "";
                    ("配信注意" === v || "配信禁止" === v) && "skip" !== p.action && setTimeout(function() {
                        var e = a.getElementById("DeliveryRestrictionSpecialNotes");
                        e && (e.disabled && (e.disabled = !1), "set" === p.action ? l(e, p.value || "") : "null" === p.action && l(e, ""))
                    }, 500);
                    var f = c(i.usageRestrictionType, e, r),
                        g = c(i.usageRestrictionNotes, e, r),
                        b = "set" === f.action ? f.value : e.usageRestrictionType || "";
                    if ("使用注意" !== b && "使用禁止" !== b || "skip" === g.action) try {
                        t.focus()
                    } catch (e) {} else setTimeout(function() {
                        var e = function() {
                            for (var e = a.querySelectorAll("textarea"), t = 0; t < e.length; t++) {
                                var n = e[t].closest("tr");
                                if (n && -1 !== n.textContent.indexOf("簡易入力")) return e[t]
                            }
                            return null
                        }();
                        e && (e.disabled && (e.disabled = !1), "set" === g.action ? l(e, g.value || "") : "null" === g.action && l(e, ""));
                        try {
                            t.focus()
                        } catch (e) {}
                    }, 500)
                };
            if ("set" === R.action) {
                var M = a.getElementById("CategoryCode");
                M && (d(M, R.value) || l(M, R.value));
                var D = a.getElementById("GenreCode");
                if (D && "set" === A.action) {
                    var L = new MutationObserver(function(e, t) {
                        D.options.length > 1 && (t.disconnect(), N())
                    });
                    L.observe(D, {
                        childList: !0,
                        subtree: !0
                    }), setTimeout(function() {
                        L.disconnect(), N()
                    }, 3e3)
                } else N()
            } else if ("null" === R.action) {
                var O = a.getElementById("CategoryCode");
                O && l(O, ""), N()
            } else N();
            return !0
        },
        s = "__previewSaved",
        p = function() {
            try {
                return JSON.parse(localStorage.getItem(s) || "{}")
            } catch (e) {
                return {}
            }
        },
        _ = function(e) {
            localStorage.setItem(s, JSON.stringify(e));
            /* ローカルファイルミラーへ同期予約（未接続・非対応時はモジュール側でno-op。関数宣言のため巻き上げで参照可） */
            try {
                __pvFsScheduleWrite()
            } catch (e) {}
        },
        u = function(e) {
            var t = document.createElement("div");
            return t.textContent = null == e ? "" : String(e), t.innerHTML
        },
        v = function(e, t) {
            return (e = null == e ? "" : String(e)).length > t ? e.slice(0, t) + "…" : e
        },
        f = function(e, t) {
            var n = e.fieldConfig && e.fieldConfig[t];
            return n ? "set" === n.mode ? null == n.value ? "" : n.value : "" : null == e[t] ? "" : e[t]
        },
        g = function(e) {
            /* 旧TMPキー採番。後方互換のため残置（現行では未使用） */
            var t = {};
            Object.keys(e).forEach(function(e) {
                var n = /^TMP(\d+)$/.exec(e);
                n && (t[parseInt(n[1], 10)] = !0)
            });
            for (var n = 1; t[n];) n++;
            return "TMP" + (n < 1e4 ? ("000" + n).slice(-4) : String(n))
        },
        gId = function(e) {
            /* テンプレ用の不変・一意な内部ID（ストアキー）。実素材番号や旧TMPキーと衝突しない形式 */
            var n;
            do {
                n = "tpl_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8)
            } while (e[n]);
            return n
        },
        gName = function(e) {
            /* テンプレ名の自動採番。既存テンプレの templateName から「テンプレ名NNNN」を走査し最小の空き番号を採番（空き番採番） */
            var t = {};
            Object.keys(e).forEach(function(k) {
                var o = e[k];
                if (o && o.isTemplate) {
                    var m = /^テンプレ名(\d+)$/.exec(o.templateName || "");
                    m && (t[parseInt(m[1], 10)] = !0)
                }
            });
            for (var n = 1; t[n];) n++;
            return "テンプレ名" + (n < 1e4 ? ("000" + n).slice(-4) : String(n))
        };
    /* 起動時マイグレーション（冪等）：テンプレを内部IDキーへ移行。templateName 未設定なら旧キー(TMP000X等)を初期テンプレ名として引き継ぐ。materialNumber は保持（テンプレ表示は名前のみのため無害） */
    r = p(), l = !1, Object.keys(r).forEach(function(e) {
        var t = r[e];
        if (t && t.isTemplate && !/^tpl_/.test(e)) {
            null == t.templateName && (t.templateName = e);
            var n = gId(r);
            r[n] = t, delete r[e], l = !0
        }
    }), l && _(r);
    var b = function(e) {
            try {
                return !(!e || e.closed || -1 === e.location.href.indexOf("original-material-regist") || !e.document)
            } catch (e) {
                return !1
            }
        },
        m = function() {
            for (var t = e.__openedRegists || [], n = 0; n < t.length; n++)
                if (b(t[n].win)) return {
                    pop: t[n].win,
                    doc: t[n].win.document
                };
            try {
                var a = window.open("", "OriginalMaterialRegistWindow");
                if (!a) return null;
                var o = "";
                try {
                    o = a.location.href
                } catch (e) {
                    return null
                }
                return -1 === o.indexOf("original-material-regist") ? ("" !== o && "about:blank" !== o || a.close(), null) : (e.__openedRegists = e.__openedRegists || [], e.__openedRegists.push({
                    win: a,
                    openedAt: (new Date).toISOString()
                }), {
                    pop: a,
                    doc: a.document
                })
            } catch (e) {
                return null
            }
        },
        y = null,
        x = !1,
        h = !1,
        k = !1,
        w = [];

    function S() {
        w.splice(0).forEach(function(e) {
            try {
                e()
            } catch (e) {}
        })
    }

    function T() {
        if (!x) return null;
        try {
            var e = y.contentDocument;
            if (e && e.getElementById("CategoryCode")) return {
                pop: y.contentWindow,
                doc: e
            }
        } catch (e) {}
        return null
    }
    window.__pvToolRoot = e, (e.__openedRegists || []).some(function(e) {
        return b(e.win)
    }) || m();
    var E = document.createElement("div");
    E.id = "__pvtool_overlay";
    var C = document.createElement("style");
    C.textContent = '#__pvtool_overlay,#__pvtool_overlay *{box-sizing:border-box;font-family:-apple-system,"Segoe UI",Meiryo,sans-serif;}#__pvtool_overlay{position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.55);display:flex;align-items:center;justify-content:center;}.__pv_panel{width:760px;max-width:94vw;max-height:88vh;background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.35);display:flex;flex-direction:column;overflow:hidden;}.__pv_head{display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#1e293b;color:#fff;}.__pv_title{font-size:15px;font-weight:700;letter-spacing:.02em;}.__pv_close{cursor:pointer;border:none;background:transparent;color:#cbd5e1;font-size:22px;line-height:1;padding:2px 6px;border-radius:6px;}.__pv_close:hover{background:rgba(255,255,255,.12);color:#fff;}#__pvtool_overlay .__pv_titlewrap{display:flex;align-items:center;gap:8px;min-width:0;}#__pvtool_overlay .__pv_share{cursor:pointer;border:none;background:transparent;color:#cbd5e1;padding:2px 6px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;line-height:1;flex:none;}#__pvtool_overlay .__pv_share:hover{background:rgba(255,255,255,.12);color:#fff;}#__pvtool_overlay .__pv_share svg{display:block;}.__pv_tabs{display:flex;gap:4px;padding:10px 14px 0;background:#f1f5f9;}.__pv_tab{flex:1;cursor:pointer;border:none;background:transparent;padding:9px 8px;font-size:13px;font-weight:600;color:#64748b;border-radius:8px 8px 0 0;border-bottom:2px solid transparent;}.__pv_tab.act{background:#fff;color:#1e293b;border-bottom-color:#2563eb;}.__pv_body{padding:16px 18px;overflow-y:auto;background:#fff;}.__pv_hint{font-size:12px;color:#64748b;margin:0 0 12px;}.__pv_row{display:flex;align-items:center;gap:10px;padding:11px 12px;border:1px solid #e2e8f0;border-radius:10px;margin-bottom:8px;background:#fff;}.__pv_row.tpl{background:#fffbeb;border-color:#fcd34d;}.__pv_row .chk{width:16px;height:16px;flex:none;cursor:pointer;}.__pv_rmain{flex:1;min-width:0;}.__pv_rtop{display:flex;align-items:center;gap:8px;}.__pv_no{font-size:13px;font-weight:700;color:#0f172a;white-space:nowrap;}.__pv_ttl{font-size:13px;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.__pv_badge{flex:none;font-size:10px;font-weight:700;padding:2px 7px;border-radius:99px;}.__pv_badge.t{background:#f59e0b;color:#fff;}.__pv_badge.tmp{background:#cbd5e1;color:#334155;}.__pv_badge.warn{background:#ffff00;color:#000;}.__pv_badge.ban{background:rgb(255,0,0);color:#000;}.__pv_badge.none{background:#fff;color:#000;border:1px solid #cbd5e1;}.__pv_desc{font-size:12px;color:#94a3b8;margin-top:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}.__pv_metarow{display:flex;align-items:center;gap:8px;margin-top:3px;}.__pv_meta{font-size:11px;color:#64748b;}.__pv_meta b{color:#475569;font-weight:600;}.__pv_clickable{cursor:pointer;}.__pv_acts{display:flex;gap:6px;flex:none;}.__pv_btn{cursor:pointer;border:1px solid #cbd5e1;background:#fff;color:#334155;font-size:12px;font-weight:600;padding:6px 11px;border-radius:8px;white-space:nowrap;}.__pv_btn:hover{background:#f8fafc;}.__pv_btn.pri{background:#2563eb;border-color:#2563eb;color:#fff;}.__pv_btn.pri:hover{background:#1d4ed8;}.__pv_copyreg{font-size:15px;font-weight:700;line-height:1.25;white-space:normal;text-align:center;padding:7px 12px;border-radius:9px;box-shadow:0 2px 6px rgba(0,0,0,.3),0 6px 18px rgba(0,0,0,.5);}.__pv_copyreg:disabled{background:#94a3b8;border-color:#94a3b8;opacity:.5;cursor:not-allowed;box-shadow:none;}.__pv_btn.dng{border-color:#fecaca;color:#dc2626;}.__pv_btn.dng:hover{background:#fef2f2;}.__pv_btn.gld{border-color:#f59e0b;color:#b45309;}.__pv_btn.gld:hover{background:#fffbeb;}.__pv_btn:disabled{opacity:.45;cursor:not-allowed;}.__pv_empty{text-align:center;color:#94a3b8;font-size:13px;padding:36px 0;}.__pv_bar{display:flex;gap:8px;align-items:center;margin-bottom:12px;flex-wrap:wrap;}.__pv_spacer{flex:1;}.__pv_detail{margin-top:8px;padding:10px 12px;background:#f8fafc;border-radius:8px;border:1px solid #e2e8f0;display:none;}.__pv_detail.open{display:block;}.__pv_dgrid{display:grid;grid-template-columns:120px 1fr;gap:4px 12px;font-size:12px;}.__pv_dgrid dt{color:#64748b;}.__pv_dgrid dd{margin:0;color:#0f172a;word-break:break-all;white-space:pre-wrap;}.__pv_edit{display:grid;grid-template-columns:140px 90px 1fr;gap:6px 10px;font-size:12px;align-items:center;}.__pv_edit .lbl{color:#475569;font-weight:600;}.__pv_edit .mode select,.__pv_edit .val input,.__pv_edit .val select,.__pv_edit .val textarea{width:100%;padding:4px 6px;border:1px solid #cbd5e1;border-radius:6px;font-size:12px;background:#fff;color:#0f172a;}.__pv_edit .val textarea{min-height:48px;resize:vertical;}.__pv_edit .val .disabled-note{color:#94a3b8;font-size:11px;padding:4px 6px;background:#f1f5f9;border-radius:6px;border:1px dashed #cbd5e1;}.__pv_edit_bar{display:flex;gap:6px;align-items:center;margin-bottom:8px;padding-bottom:8px;border-bottom:1px solid #e2e8f0;}.__pv_edit_warn{font-size:11px;color:#b45309;background:#fffbeb;border:1px solid #fcd34d;padding:6px 8px;border-radius:6px;margin-bottom:8px;}.__pv_footer{display:flex;align-items:center;gap:8px;padding:12px 18px;border-top:1px solid #e2e8f0;background:#f8fafc;}.__pv_footer_left{display:flex;gap:8px;align-items:center;}.__pv_footer_right{display:flex;gap:8px;align-items:center;margin-left:auto;}.__pv_exp_chk{width:16px;height:16px;flex:none;cursor:pointer;margin-right:4px;}#__pvtool_overlay .__pv_headright{display:flex;align-items:center;gap:8px;flex:none;}#__pvtool_overlay .__pv_deflabel{font-size:12px;color:#cbd5e1;white-space:nowrap;}#__pvtool_overlay .__pv_defsel{font-size:12px;font-weight:600;color:#e2e8f0;background:#0f172a;border:1px solid #475569;border-radius:6px;padding:4px 8px;cursor:pointer;}#__pvtool_overlay .__pv_defsel:hover{border-color:#64748b;}#__pvtool_overlay .__pv_defsel option{color:#0f172a;background:#fff;}#__pvtool_overlay .__pv_syncbtn{cursor:pointer;font-size:12px;font-weight:600;border-radius:6px;padding:4px 8px;white-space:nowrap;border:1px solid #475569;background:#0f172a;color:#94a3b8;}#__pvtool_overlay .__pv_syncbtn.ok{border-color:#16a34a;color:#4ade80;}#__pvtool_overlay .__pv_syncbtn.warn{border-color:#f59e0b;color:#fbbf24;}#__pvtool_overlay .__pv_syncbtn:hover{filter:brightness(1.2);}', document.head.appendChild(C), E.innerHTML = '<div class="__pv_panel">  <div class="__pv_head">    <div class="__pv_titlewrap"><div class="__pv_title">【webCV】メタコピーツール</div><button class="__pv_share" id="__pv_share" type="button" title="手順ページを開く" aria-label="手順ページを開く"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg></button></div>    <div class="__pv_headright"><button class="__pv_syncbtn" id="__pv_sync" type="button" title="ローカルファイル連携の状態">…</button><label class="__pv_deflabel" for="__pv_defsel">起動タブ:</label><select class="__pv_defsel" id="__pv_defsel"><option value="capture">メタコピー</option><option value="list">保存一覧</option></select><button class="__pv_close" id="__pv_close">×</button></div>  </div>  <div class="__pv_tabs">    <button class="__pv_tab act" data-tab="capture">メタコピー(プレビュー画面から)</button>    <button class="__pv_tab" data-tab="list">保存メタ一覧</button>  </div>  <div class="__pv_body" id="__pv_body"></div>  <div class="__pv_footer" id="__pv_footer"></div></div>', document.body.appendChild(E);
    var I = E.querySelector("#__pv_body"),
        R = E.querySelector("#__pv_footer"),
        A = E.querySelectorAll(".__pv_tab"),
        N = function() {
            /* 起動デフォルトタブを保存値から取得（capture/list以外・未設定はcaptureにフォールバック＝従来動作維持） */
            try {
                var __dt = localStorage.getItem("__previewDefaultTab");
                return "list" === __dt ? "list" : "capture"
            } catch (e) {
                return "capture"
            }
        }(); /* 共有ボタン: 手順ページを新規タブで開くのみ（クリップボードコピー・トースト通知なし） */
    var __pvShareBtn = E.querySelector("#__pv_share");
    if (__pvShareBtn) {
        __pvShareBtn.onclick = function() {
            var __pvShareUrl = "https://web-cv-copy-meta.vercel.app";
            try {
                window.open(__pvShareUrl, "_blank", "noopener")
            } catch (e) {}
        }
    }
    /* 起動デフォルトタブ設定: selectの初期選択を現在の起動値(N)に合わせ、変更時はlocalStorageへ保存する。
       仕様により変更は次回起動から反映し、現在表示中のタブは切り替えない。 */
    var __pvDefSel = E.querySelector("#__pv_defsel");
    if (__pvDefSel) {
        __pvDefSel.value = N;
        __pvDefSel.onchange = function() {
            try {
                localStorage.setItem("__previewDefaultTab", "list" === __pvDefSel.value ? "list" : "capture")
            } catch (e) {}
            /* 起動タブ設定もミラー対象（仕様5）のため同期予約 */
            try {
                __pvFsScheduleWrite()
            } catch (e) {}
        }
    }
    /* ===== ローカルファイルミラー保存モジュール（File System Access API） =====
       方針: localStorageが常に「正」。保存系操作のたびにドキュメント配下のJSONファイルへ全量ミラーする。
       サイトデータ消去(②)後は localStorage が空になるが、ファイルは残るため再接続1回で全復元できる。
       既存ロジックへの介入は _()/起動タブ変更/全削除 への同期予約フックのみ（デグレ防止）。 */
    var __pvFsState = "unsupported", /* unsupported | unlinked | linked */
        __pvFsHandle = null,
        __pvFsTimer = null,
        __pvFsWriting = !1,
        __pvFsPending = !1,
        __pvFsAutoTried = !1, /* パネル内クリックによる自動権限要求は1実行につき1回のみ（拒否時のダイアログ連発防止） */
        __pvFsSupported = "function" == typeof window.showSaveFilePicker && !!window.indexedDB,
        __pvFsBtn = E.querySelector("#__pv_sync"),
        __pvFsFileName = "webcv-meta-backup.json",
        __pvFsTabKey = "__previewDefaultTab";

    /* 状態インジケータの表示更新（ヘッダー右側ボタン） */
    function __pvFsSetUI() {
        if (__pvFsBtn) {
            __pvFsBtn.classList.remove("ok", "warn");
            if ("linked" === __pvFsState) {
                __pvFsBtn.classList.add("ok");
                __pvFsBtn.textContent = "✓ファイル連携中";
                __pvFsBtn.title = "保存メタはローカルファイル(" + __pvFsFileName + ")へ自動バックアップされています。クリックで手動同期。"
            } else if ("unlinked" === __pvFsState) {
                __pvFsBtn.classList.add("warn");
                __pvFsBtn.textContent = "⚠未接続";
                __pvFsBtn.title = "クリックしてバックアップファイルと接続してください（ドキュメント配下推奨）。権限ダイアログでは「今後(次回以降)も許可」を選ぶと、以後は自動接続されます"
            } else {
                __pvFsBtn.textContent = "－連携不可";
                __pvFsBtn.title = "このブラウザはファイル連携(File System Access API)に対応していません。エクスポート/インポートで手動バックアップしてください。"
            }
        }
    }

    /* ハンドル永続化用IndexedDB（ツール専用DB。サイトデータ消去で消える＝消えたら再接続を促す） */
    function __pvFsDb() {
        return new Promise(function(res, rej) {
            var r = indexedDB.open("__pvtool_fs", 1);
            r.onupgradeneeded = function() {
                r.result.objectStoreNames.contains("handles") || r.result.createObjectStore("handles")
            };
            r.onsuccess = function() {
                res(r.result)
            };
            r.onerror = function() {
                rej(r.error)
            }
        })
    }

    function __pvFsLoadHandle() {
        return __pvFsDb().then(function(db) {
            return new Promise(function(res) {
                var t = db.transaction("handles", "readonly").objectStore("handles").get("backupFile");
                t.onsuccess = function() {
                    res(t.result || null)
                };
                t.onerror = function() {
                    res(null)
                }
            })
        }).catch(function() {
            return null
        })
    }

    function __pvFsSaveHandle(h) {
        return __pvFsDb().then(function(db) {
            return new Promise(function(res) {
                var t = db.transaction("handles", "readwrite");
                t.objectStore("handles").put(h, "backupFile");
                t.oncomplete = function() {
                    res(!0)
                };
                t.onerror = function() {
                    res(!1)
                }
            })
        }).catch(function() {
            return !1
        })
    }

    /* ファイルへ書き出す全量スナップショット（仕様: 保存メタ＋起動タブ設定、formatVersion/savedAt付与） */
    function __pvFsSnapshot() {
        var t = null;
        try {
            t = localStorage.getItem(__pvFsTabKey)
        } catch (e) {}
        return {
            formatVersion: 1,
            appName: "webCV-meta-tool",
            savedAt: (new Date).toISOString(),
            defaultTab: "list" === t || "capture" === t ? t : null,
            store: p()
        }
    }

    /* 同期予約: 連続書込(テンプレ名のキー入力等)をまとめるため400msの遅延結合。書込中の再要求はpendingで直列化 */
    function __pvFsScheduleWrite() {
        "linked" === __pvFsState && (__pvFsTimer && clearTimeout(__pvFsTimer), __pvFsTimer = setTimeout(function() {
            __pvFsTimer = null, __pvFsWriteNow()
        }, 400))
    }

    function __pvFsWriteNow() {
        if ("linked" === __pvFsState && __pvFsHandle) {
            if (__pvFsWriting) return void(__pvFsPending = !0);
            __pvFsWriting = !0;
            var body = JSON.stringify(__pvFsSnapshot(), null, 2);
            __pvFsHandle.createWritable().then(function(w) {
                return w.write(body).then(function() {
                    return w.close()
                })
            }).then(function() {
                __pvFsWriting = !1, __pvFsPending && (__pvFsPending = !1, __pvFsWriteNow())
            }).catch(function(err) {
                /* ファイル削除・権限失効等。localStorage動作は継続し、未接続表示に落として再接続を促す（仕様3,4） */
                __pvFsWriting = !1, __pvFsPending = !1, __pvFsState = "unlinked", __pvFsSetUI(), q("バックアップファイルへの書込に失敗しました。ヘッダーの「⚠未接続」から再接続してください\n(" + (err && err.name || "error") + ")", !0)
            })
        }
    }

    /* ファイルからの復元。localStorage優先の原則（仕様: 競合時はlocalStorageが正）:
       - 保存メタ: localStorageのストアが空の場合のみファイル内容を採用
       - 起動タブ: localStorageにキーが無い場合のみファイル内容を採用（次回起動から反映＝既存仕様踏襲） */
    function __pvFsRestoreFromData(data) {
        var n = 0;
        if (data && 1 === data.formatVersion && data.store && "object" == typeof data.store) {
            var localEmpty = 0 === Object.keys(p()).length,
                fileKeys = Object.keys(data.store);
            localEmpty && fileKeys.length > 0 && (localStorage.setItem(s, JSON.stringify(data.store)), n = fileKeys.length);
            var hasTab = null;
            try {
                hasTab = localStorage.getItem(__pvFsTabKey)
            } catch (e) {}
            null == hasTab && ("list" === data.defaultTab || "capture" === data.defaultTab) && function() {
                try {
                    localStorage.setItem(__pvFsTabKey, data.defaultTab)
                } catch (e) {}
            }()
        }
        return n
    }

    /* 接続確立後の突き合わせ: 空なら復元→最後に必ずlocalStorageの内容でファイルを上書き同期（正を一本化） */
    function __pvFsReconcile(isReconnect) {
        return __pvFsHandle.getFile().then(function(f) {
            return f.text()
        }).then(function(txt) {
            var data = null;
            if (txt && txt.trim()) try {
                data = JSON.parse(txt)
            } catch (e) {
                data = null
            }
            var n = data ? __pvFsRestoreFromData(data) : 0;
            __pvFsState = "linked", __pvFsSetUI(), n > 0 ? (q(n + "件をバックアップファイルから復元しました", !1, "#16a34a", 4e3), J()) : isReconnect && q("バックアップファイルと接続しました", !1, "#16a34a", 2500), __pvFsScheduleWrite()
        }).catch(function(err) {
            __pvFsState = "unlinked", __pvFsSetUI(), q("バックアップファイルの読込に失敗しました: " + (err && err.message || err), !0)
        })
    }

    /* 起動時初期化: ハンドルをIndexedDBから復元し、権限がgrantedなら無操作で連携再開（通常運用0クリック）。
       prompt状態や消去後は「⚠未接続」表示に留める（権限要求はユーザー操作起点でしか実行できないため） */
    function __pvFsInit() {
        if (!__pvFsSupported) return __pvFsState = "unsupported", __pvFsSetUI(), void q("このブラウザはファイル自動バックアップに未対応です。\nエクスポート/インポートで手動バックアップしてください", !0, "#b45309", 4e3);
        __pvFsLoadHandle().then(function(h) {
            if (h && h.queryPermission) {
                __pvFsHandle = h;
                return h.queryPermission({
                    mode: "readwrite"
                }).then(function(st) {
                    "granted" === st ? __pvFsReconcile(!1) : (__pvFsState = "unlinked", __pvFsSetUI())
                }).catch(function() {
                    __pvFsState = "unlinked", __pvFsSetUI()
                })
            }
            __pvFsState = "unlinked", __pvFsSetUI()
        })
    }

    /* インジケータクリック（ユーザー操作＝権限要求・ピッカー起動が可能な唯一の起点）:
       1) 既存ハンドルあり→権限再要求のみで接続（ダイアログ最小化）
       2) ハンドル無し/失効→保存ダイアログ（ドキュメント初期位置・ファイル名自動入力） */
    /* 権限ダイアログ直前の案内（永続許可の選択を促す）。ダイアログ表示中もトーストは残るため視認可能 */
    function __pvFsGuideToast() {
        q("表示される許可ダイアログで「今後(次回以降)も許可」を選ぶと\nブラウザ再起動後も自動でバックアップ連携されます", !1, "#0f172a", 5e3)
    }

    if (__pvFsBtn) __pvFsBtn.onclick = function() {
        if ("unsupported" === __pvFsState) return q("このブラウザはファイル連携に未対応です。エクスポート/インポートをご利用ください", !0);
        if ("linked" === __pvFsState) return __pvFsScheduleWrite(), void q("バックアップファイルへ同期しました", !1, "#16a34a", 2e3);
        var pick = function() {
            __pvFsGuideToast();
            window.showSaveFilePicker({
                suggestedName: __pvFsFileName,
                startIn: "documents",
                id: "pvtool-backup",
                types: [{
                    description: "webCVメタバックアップ",
                    accept: {
                        "application/json": [".json"]
                    }
                }]
            }).then(function(h) {
                __pvFsHandle = h, __pvFsSaveHandle(h), __pvFsReconcile(!0)
            }).catch(function(err) {
                /* キャンセル(AbortError)は無通知。それ以外はエラー表示 */
                err && "AbortError" !== err.name && q("ファイル指定に失敗しました: " + (err.message || err), !0)
            })
        };
        __pvFsHandle && __pvFsHandle.requestPermission ? (__pvFsGuideToast(), __pvFsHandle.requestPermission({
            mode: "readwrite"
        }).then(function(st) {
            "granted" === st ? __pvFsReconcile(!0) : pick()
        }).catch(function() {
            pick()
        })) : pick()
    };
    /* 未接続(ハンドルは生存・権限promptのみ)の場合、パネル内の最初のユーザークリックを契機に自動で権限要求→復帰する。
       ユーザーに接続操作を意識させないための措置。②発生後(ハンドル消失)はピッカー必須のため対象外（任意クリックで
       ファイル選択ダイアログが突然開くのを避け、従来どおり⚠ボタン起点とする）。captureフェーズで既存ハンドラと非干渉 */
    E.addEventListener("click", function(ev) {
        if (!__pvFsAutoTried && "unlinked" === __pvFsState && __pvFsHandle && __pvFsHandle.requestPermission && !(__pvFsBtn && __pvFsBtn.contains(ev.target))) {
            __pvFsAutoTried = !0;
            /* クリック直後のユーザーアクティベーションが有効なうちに権限要求（マイクロタスク経由は許容される） */
            __pvFsHandle.queryPermission({
                mode: "readwrite"
            }).then(function(st) {
                if ("granted" === st) return __pvFsReconcile(!0);
                "prompt" === st && (__pvFsGuideToast(), __pvFsHandle.requestPermission({
                    mode: "readwrite"
                }).then(function(st2) {
                    "granted" === st2 && __pvFsReconcile(!0)
                }).catch(function() {}))
            }).catch(function() {})
        }
    }, !0);
    __pvFsSetUI(), __pvFsInit();
    /* ===== ローカルファイルミラー保存モジュール ここまで ===== */
    try {
        e.__openedRegists = (e.__openedRegists || []).filter(function(e) {
            return e.win && !e.win.closed
        })
    } catch (e) {}

    function q(e, t, n, a) {
        var o = document.createElement("div");
        o.textContent = e, o.style.cssText = "position:fixed;left:50%;bottom:32px;transform:translateX(-50%);background:" + (n || (t ? "#dc2626" : "#0f172a")) + ';color:#fff;font-size:13px;padding:11px 18px;border-radius:10px;box-shadow:0 8px 24px rgba(0,0,0,.3);z-index:2147483647;max-width:80vw;white-space:pre-line;line-height:1.6;text-align:center;font-family:-apple-system,"Segoe UI",Meiryo,sans-serif;', document.body.appendChild(o), setTimeout(function() {
            o.parentNode && o.parentNode.removeChild(o)
        }, a || (t ? 3600 : 2200))
    }

    function M() {
        try {
            y && y.parentNode && y.parentNode.removeChild(y)
        } catch (e) {}
        y = null, x = !1, h = !1, k = !1, w = [], E.parentNode && E.parentNode.removeChild(E), C.parentNode && C.parentNode.removeChild(C)
    }
    var D = /Edg\//.test(navigator.userAgent) || !!(navigator.userAgentData && navigator.userAgentData.brands && navigator.userAgentData.brands.some(function(e) {
        return /Microsoft Edge/i.test(e.brand)
    }));

    function L() {
        if (!document.getElementById("__pv_edgeguide")) {
            var e = document.createElement("div");
            e.id = "__pv_edgeguide", e.style.cssText = "position:fixed;inset:0;z-index:2147483647;background:rgba(15,23,42,.6);display:flex;align-items:center;justify-content:center;font-family:-apple-system,'Segoe UI',Meiryo,sans-serif;", e.innerHTML = '<div style="width:560px;max-width:94vw;max-height:88vh;overflow:auto;background:#fff;border-radius:14px;box-shadow:0 20px 60px rgba(0,0,0,.4);"><div style="display:flex;align-items:center;justify-content:space-between;padding:14px 18px;background:#b45309;color:#fff;border-radius:14px 14px 0 0;"><div style="font-size:15px;font-weight:700;">⚠ Edgeでの必須設定（メタ保存を維持するために）</div><button id="__pv_eg_close" style="cursor:pointer;border:none;background:transparent;color:#fde68a;font-size:24px;line-height:1;padding:0 6px;">×</button></div><div style="padding:16px 18px;font-size:13px;color:#0f172a;line-height:1.75;"><p style="margin:0 0 14px;"><span style="font-weight:700;color:#b45309;font-size:20px;">Edge必須設定（1度だけでOK！）</span><br><span style="font-weight:700;font-size:11px;color:#64748b;">（Chromeは対象外）</span></p><ol style="margin:0;padding-left:20px;"><li style="margin-bottom:12px;">下記URLをコピーして、新規タブに貼り付け→Enter<div style="margin-top:6px;display:flex;align-items:center;gap:8px;"><code style="flex:1;background:#f1f5f9;border-radius:6px;padding:5px 8px;font-size:12px;word-break:break-all;">edge://settings/clearBrowsingDataOnClose</code><button class="__pv_btn __pv_eg_copy" data-copy="edge://settings/clearBrowsingDataOnClose">コピー</button></div></li><li style="margin-bottom:12px;">「Cookie およびその他のサイト データ」の<b>「解除しない」</b>にある<b>「追加」</b>ボタンを押します。</li><li style="margin-bottom:12px;">下の2つのURLを<b>1つずつ「コピー」</b>して、それぞれ「追加」欄に貼り付けて追加します。<div style="margin-top:8px;display:flex;flex-direction:column;gap:6px;"><div style="display:flex;align-items:center;gap:8px;"><code style="flex:1;background:#f1f5f9;border-radius:6px;padding:5px 8px;font-size:12px;word-break:break-all;">https://www.inet-cvweb.jp</code><button class="__pv_btn __pv_eg_copy" data-copy="https://www.inet-cvweb.jp">コピー</button></div><div style="display:flex;align-items:center;gap:8px;"><code style="flex:1;background:#f1f5f9;border-radius:6px;padding:5px 8px;font-size:12px;word-break:break-all;">https://snet-cvweb.ntv.jp</code><button class="__pv_btn __pv_eg_copy" data-copy="https://snet-cvweb.ntv.jp">コピー</button></div></div></li><li>追加できたら設定完了です。以降はブラウザを閉じても保存したメタは消えません。</li></ol><div style="margin-top:16px;text-align:right;"><button class="__pv_btn" id="__pv_eg_done">閉じる</button></div></div></div>', document.body.appendChild(e);
            var t = function() {
                e.parentNode && e.parentNode.removeChild(e)
            };
            e.querySelector("#__pv_eg_close").onclick = t, e.querySelector("#__pv_eg_done").onclick = t, e.querySelectorAll(".__pv_eg_copy").forEach(function(e) {
                e.onclick = function() {
                    var t = e.getAttribute("data-copy");
                    ! function(e) {
                        try {
                            var t = document.createElement("textarea");
                            t.value = null == e ? "" : String(e), t.style.cssText = "position:fixed;top:-9999px;left:-9999px;opacity:0;", document.body.appendChild(t), t.focus(), t.select();
                            var n = document.execCommand("copy");
                            return document.body.removeChild(t), n
                        } catch (e) {
                            return !1
                        }
                    }(t) ? q("コピーできませんでした。手動で選択してください", !0): q("コピーしました。" + (0 === t.indexOf("edge://") ? "新しいタブのアドレスバーに貼り付けてください" : "「追加」欄に貼り付けてください"), !1, "#16a34a", 2800)
                }
            })
        }
    }

    function O(e) {
        var t = window.__pvToolRoot || {},
            n = function() {
                for (var e = t.__openedRegists || [], n = e.length - 1; n >= 0; n--)
                    if (b(e[n].win)) return e[n].win;
                return null
            }();
        if (n) e(n);
        else {
            var a = Array.from(document.querySelectorAll("button.btnTitle")).find(function(e) {
                return "元素材登録" === e.textContent.trim()
            });
            if (a) {
                try {
                    window.open("", "OriginalMaterialRegistWindow")
                } catch (e) {}
                a.click();
                var o = 0,
                    i = setInterval(function() {
                        for (var n = t.__openedRegists || [], a = null, r = n.length - 1; r >= 0; r--) try {
                            var l = n[r].win;
                            if (l && !l.closed && -1 !== l.location.href.indexOf("original-material-regist") && l.document && l.document.getElementById("CategoryCode")) {
                                a = l;
                                break
                            }
                        } catch (e) {}
                        a ? (clearInterval(i), e(a)) : (o += 300) >= 1e4 && (clearInterval(i), q("元素材登録画面の読み込みを確認できませんでした。画面を確認して再実行してください", !0))
                    }, 300)
            } else q("元素材登録ボタンが見つかりませんでした。手動で開いてから再実行してください", !0)
        }
    }
    E.querySelector("#__pv_close").onclick = M, E.onclick = function(e) {
        e.target === E && M()
    }, A.forEach(function(e) {
        e.onclick = function() {
            N = e.dataset.tab, A.forEach(function(t) {
                t.classList.toggle("act", t === e)
            }), J()
        }
    });
    var B = [],
        z = !1,
        H = !1,
        j = !1,
        P = new Set,
        U = null;

    function V() {
        var e, t = p(),
            n = (e = t, Object.keys(e).sort(function(t, n) {
                var a = e[t].isTemplate ? 1 : 0,
                    o = e[n].isTemplate ? 1 : 0;
                if (a !== o) return o - a;
                var i = e[t].capturedAt || "",
                    r = e[n].capturedAt || "";
                return r < i ? -1 : r > i ? 1 : 0
            })),
            a = '<p class="__pv_hint">「反映」するとテンプレは消えませんが、一時保存データは自動削除されます。</p>',
            r = 0;
        if (n.forEach(function(e) {
                t[e].isTemplate && r++
            }), 0 === n.length) return a += '<div class="__pv_bar"><button class="__pv_btn pri" id="__pv_create">＋ テンプレ作成</button><span class="__pv_spacer"></span></div>', a += '<div class="__pv_empty">保存データはありません。</div>', I.innerHTML = a, Y(), void G(r);
        if (a += '<div class="__pv_bar"><button class="__pv_btn pri" id="__pv_create">＋ テンプレ作成</button><span class="__pv_spacer"></span><button class="__pv_btn" id="__pv_openall">全て開く</button><button class="__pv_btn" id="__pv_closeall">全て閉じる</button><button class="__pv_btn dng" id="__pv_delall">全削除</button></div>', n.forEach(function(e) {
                var n = t[e],
                    o = !!n.isTemplate,
                    i = "";
                if (j && o) {
                    var r = P.has(e) ? " checked" : "";
                    i = '<input type="checkbox" class="__pv_exp_chk" data-k="' + u(e) + '"' + r + ">"
                }
                var l, c = f(n, "materialTitleHeader") + f(n, "materialTitleBody"),
                    d = f(n, "description"),
                    s = f(n, "genre"),
                    p = "使用注意" === (l = f(n, "usageRestrictionType")) ? '<span class="__pv_badge warn">使用注意</span>' : "使用禁止" === l ? '<span class="__pv_badge ban">使用禁止</span>' : "制限なし" === l ? '<span class="__pv_badge none">制限なし</span>' : "" === l || null == l ? '<span class="__pv_meta">—</span>' : '<span class="__pv_meta">' + u(l) + "</span>",
                    _ = j ? " disabled" : "",
                    g = o ? "" : '<button class="__pv_btn __pv_toggle" data-k="' + u(e) + '"' + _ + ">テンプレ化</button>";
                a += '<div class="__pv_row' + (o ? " tpl" : "") + '" data-k="' + u(e) + '">' + i + '<div class="__pv_rmain"><div class="__pv_clickable __pv_open" data-k="' + u(e) + '"><div class="__pv_rtop">' + (o ? '<span class="__pv_badge t">テンプレ</span>' : '<span class="__pv_badge tmp">一時保存</span>') + '<span class="__pv_no">' + u(o ? n.templateName || "" : n.materialNumber || "") + '</span><span class="__pv_ttl">' + u(c || "(タイトルなし)") + '</span></div><div class="__pv_desc">' + u(v(d, 55) || "—") + '</div><div class="__pv_metarow"><span class="__pv_meta"><b>ジャンル:</b> ' + u(s || "—") + "</span>" + p + '</div></div><div class="__pv_detail" id="__pv_dt_' + u(e) + '"></div></div><div class="__pv_acts"><button class="__pv_btn pri __pv_apply" data-k="' + u(e) + '"' + _ + ">反映</button>" + g + '<button class="__pv_btn dng __pv_del" data-k="' + u(e) + '"' + _ + ">削除</button></div></div>"
            }), I.innerHTML = a, j) {
            var l = I.querySelector("#__pv_openall"),
                c = I.querySelector("#__pv_closeall"),
                b = I.querySelector("#__pv_delall");
            l && (l.disabled = !0), c && (c.disabled = !0), b && (b.disabled = !0)
        }
        var E = function() {
                return m()
            },
            C = function(e, t, n, a) {
                return new Promise(function(o) {
                    var i = e.getElementById(t),
                        r = e.getElementById(n);
                    if (i && r) {
                        var l = i.value,
                            c = Array.from(i.options).find(function(e) {
                                return e.text.trim() === String(a || "").trim()
                            });
                        if (c)
                            if (i.value !== c.value) {
                                var d = function(e, t) {
                                        var n = HTMLSelectElement.prototype,
                                            a = Object.getOwnPropertyDescriptor(n, "value");
                                        a && a.set ? a.set.call(e, t) : e.value = t, e.dispatchEvent(new Event("change", {
                                            bubbles: !0
                                        })), e.dispatchEvent(new Event("input", {
                                            bubbles: !0
                                        }))
                                    },
                                    s = !1,
                                    p = function() {
                                        if (!s) {
                                            s = !0;
                                            var e = Array.from(r.options).map(function(e) {
                                                return {
                                                    value: e.value,
                                                    text: e.text.trim()
                                                }
                                            });
                                            d(i, l), o(e)
                                        }
                                    },
                                    _ = new MutationObserver(function() {
                                        r.options.length > 1 && p()
                                    });
                                _.observe(r, {
                                    childList: !0,
                                    subtree: !0
                                }), d(i, c.value), setTimeout(function() {
                                    _.disconnect(), p()
                                }, 2500)
                            } else o(Array.from(r.options).map(function(e) {
                                return {
                                    value: e.value,
                                    text: e.text.trim()
                                }
                            }));
                        else o(Array.from(r.options).map(function(e) {
                            return {
                                value: e.value,
                                text: e.text.trim()
                            }
                        }))
                    } else o([])
                })
            },
            R = function(e, t) {
                var n = e.fieldConfig || {};
                if (n[t.key]) return n[t.key];
                if (!(t.key in e)) return {
                    mode: "skip"
                };
                var a = e[t.key];
                return null == a || "" === a ? {
                    mode: "null"
                } : {
                    mode: "set",
                    value: a
                }
            },
            A = function(e, t) {
                var n, a, r, l, c = p()[t];
                if (c) {
                    var d = E(),
                        s = "ready";
                    if (!d) {
                        var v = T();
                        v ? d = v : (s = k ? "failed" : "loading", (l = function() {
                            e && e.isConnected && e.classList.contains("open") && A(e, t)
                        }) && w.push(l), x || k ? S() : h || (h = !0, (y = document.createElement("iframe")).setAttribute("sandbox", "allow-same-origin allow-scripts allow-forms"), y.style.cssText = "position:fixed;left:-9999px;top:-9999px;width:1024px;height:768px;border:0;", y.src = location.origin + "/original-material-regist", y.onload = function() {
                            var e = 0,
                                t = setInterval(function() {
                                    var n = !1;
                                    try {
                                        n = y.contentDocument && !!y.contentDocument.getElementById("CategoryCode")
                                    } catch (e) {
                                        n = !1
                                    }
                                    n ? (clearInterval(t), h = !1, x = !0, S()) : (e += 300) >= 12e3 && (clearInterval(t), h = !1, k = !0, S())
                                }, 300)
                        }, document.body.appendChild(y)))
                    }
                    var f = !!d,
                        g = "";
                    /* テンプレのみ：詳細パネル先頭にテンプレ名の編集欄を表示（前後トリム・空許容・重複許容） */
                    c.isTemplate && (g += '<div style="margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid #e2e8f0;"><div class="lbl" style="font-size:11px;color:#475569;font-weight:600;margin-bottom:4px;">テンプレ名</div><input type="text" class="__pv_tplname" data-k="' + u(t) + '" value="' + u(c.templateName || "") + '" placeholder="（空欄も可）" style="width:100%;padding:6px 8px;border:1px solid #cbd5e1;border-radius:6px;font-size:13px;background:#fff;color:#0f172a;"></div>');
                    f || (g += "loading" === s ? '<div class="__pv_edit_warn">元素材登録画面のマスタデータを自動取得中です…（タブは開きません。完了後に自動で編集できるようになります）</div>' : '<div class="__pv_edit_warn">元素材登録画面のマスタ自動取得に失敗しました。<br><span id="__pv_openreg" style="color:#2563eb;text-decoration:underline;cursor:pointer;font-weight:700;">元素材登録画面を開く</span>と、画面から最新のマスタデータを取得して編集できるようになります。</div>'), g += '<div class="__pv_edit">', g += '<div class="lbl" style="grid-column:1/4;font-size:11px;color:#94a3b8;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:4px;">項目 / モード / 値</div>', o.forEach(function(e) {
                        var n = R(c, e),
                            a = n.mode,
                            o = !1;
                        if (e.restrictionNote) {
                            var r, l;
                            "usage" === e.restrictionNote ? (r = "usageRestrictionType", l = "制限なし") : "delivery" === e.restrictionNote && (r = "deliveryRestriction", l = "制限なし");
                            var d = R(c, i[r]),
                                s = "set" === d.mode && "value" in d ? d.value : c[r];
                            s && s !== l || (o = !0, a = "null")
                        }
                        var p = [
                            ["set", "上書き"],
                            ["null", "空(null)"],
                            ["skip", "何もしない"]
                        ];
                        "date" === e.type && (p = [
                            ["set", "指定日で上書き"],
                            ["executed", "実行日で上書き"],
                            ["null", "空(null)"],
                            ["skip", "何もしない"]
                        ]), e.subCode && (p = [
                            ["set", "固定値で上書き"],
                            ["monthly", "月副題(YYMM)"],
                            ["null", "空(null)"],
                            ["skip", "何もしない"]
                        ]);
                        var _ = o ? " disabled" : "",
                            v = '<select class="__pv_mode" data-k="' + u(t) + '" data-fk="' + u(e.key) + '"' + _ + ">";
                        p.forEach(function(e) {
                            v += '<option value="' + e[0] + '"' + (e[0] === a ? " selected" : "") + ">" + u(e[1]) + "</option>"
                        }), v += "</select>";
                        var b = "";
                        if ("set" === a) {
                            var m = "value" in n ? n.value : c[e.key];
                            null == m && (m = ""), b = "select" === e.type ? f ? '<select class="__pv_val" data-k="' + u(t) + '" data-fk="' + u(e.key) + '" data-loading="1"><option>読み込み中...</option></select>' : '<div class="disabled-note">現在値: ' + u(m || "(空)") + "</div>" : "textarea" === e.type ? '<textarea class="__pv_val" data-k="' + u(t) + '" data-fk="' + u(e.key) + '">' + u(m) + "</textarea>" : "date" === e.type ? '<input type="date" class="__pv_val" data-k="' + u(t) + '" data-fk="' + u(e.key) + '" value="' + u(m) + '">' : "radio" === e.type ? f ? '<select class="__pv_val" data-k="' + u(t) + '" data-fk="' + u(e.key) + '" data-loading="1"><option>読み込み中...</option></select>' : '<div class="disabled-note">現在値: ' + u(m || "(空)") + "</div>" : '<input type="text" class="__pv_val" data-k="' + u(t) + '" data-fk="' + u(e.key) + '" value="' + u(m) + '">'
                        } else "executed" === a ? b = '<div class="disabled-note">反映時に実行日(YYYY-MM-DD)が入ります</div>' : "monthly" === a ? b = '<div class="disabled-note">反映時に実行年月(YYMM)が入ります</div>' : "null" === a ? b = '<div class="disabled-note">反映時に空にします</div>' : "skip" === a && (b = '<div class="disabled-note">反映時に何もしません</div>');
                        g += '<div class="lbl">' + u(e.label) + "</div>", g += '<div class="mode">' + v + "</div>", g += '<div class="val" data-fk="' + u(e.key) + '">' + b + "</div>"
                    }), g += "</div>", e.innerHTML = g, f || (a = t, (r = (n = e).querySelector("#__pv_openreg")) && (r.onclick = function() {
                        var e = Array.from(document.querySelectorAll("button.btnTitle")).find(function(e) {
                            return "元素材登録" === e.textContent.trim()
                        });
                        if (e) {
                            try {
                                window.open("", "OriginalMaterialRegistWindow")
                            } catch (e) {}
                            e.click();
                            try {
                                window.focus()
                            } catch (e) {}
                            q("元素材登録画面を開いています…", !1, "#0f172a", 2e3);
                            var t = 0,
                                o = setInterval(function() {
                                    for (var e = (window.__pvToolRoot || {}).__openedRegists || [], i = !1, r = e.length - 1; r >= 0; r--) try {
                                        var l = e[r].win;
                                        if (l && !l.closed && -1 !== l.location.href.indexOf("original-material-regist") && l.document && l.document.getElementById("CategoryCode")) {
                                            i = !0;
                                            break
                                        }
                                    } catch (e) {}
                                    i ? (clearInterval(o), A(n, a)) : (t += 300) >= 1e4 && (clearInterval(o), q("元素材登録画面の読み込みを確認できませんでした。手動で詳細を開き直してください", !0))
                                }, 300)
                        } else q("元素材登録ボタンが見つかりませんでした。手動で開いてください", !0)
                    })), f && Array.from(e.querySelectorAll('select.__pv_val[data-loading="1"]')).forEach(function(e) {
                        var t = e.dataset.fk,
                            n = i[t],
                            a = R(c, n),
                            o = "value" in a ? a.value : c[n.key],
                            r = function(t) {
                                e.removeAttribute("data-loading"), e.innerHTML = '<option value="">(選択してください)</option>' + t.map(function(e) {
                                    var t = String(e.text).trim() === String(o || "").trim() ? " selected" : "";
                                    return '<option value="' + u(e.text) + '"' + t + ">" + u(e.text) + "</option>"
                                }).join("")
                            };
                        if ("radio" === n.type) {
                            var l = d.doc.querySelectorAll(n.selector),
                                s = [];
                            return l.forEach(function(e) {
                                for (var t = e.nextElementSibling, n = e.value || ""; t;) {
                                    if ("LABEL" === t.tagName) {
                                        n = t.textContent.trim();
                                        break
                                    }
                                    t = t.nextElementSibling
                                }
                                s.push({
                                    value: e.value || "",
                                    text: n
                                })
                            }), void r(s)
                        }
                        if (n.parent) {
                            var p = i[n.parent],
                                _ = R(c, p),
                                v = "value" in _ ? _.value : c[p.key];
                            return v ? void C(d.doc, p.domId, n.domId, v).then(r) : void r([])
                        }
                        r(function(e, t) {
                            var n = e.getElementById(t);
                            return n && "SELECT" === n.tagName ? Array.from(n.options).map(function(e) {
                                return {
                                    value: e.value,
                                    text: e.text.trim()
                                }
                            }) : []
                        }(d.doc, n.domId))
                    }), e.querySelectorAll(".__pv_mode").forEach(function(t) {
                        t.onchange = function(n) {
                            n.stopPropagation();
                            var a = t.dataset.k,
                                o = t.dataset.fk,
                                r = t.value,
                                l = p();
                            if (l[a]) {
                                l[a].fieldConfig || (l[a].fieldConfig = {});
                                var c, d, s = l[a].fieldConfig[o] || {};
                                if (s.mode = r, "set" === r && !("value" in s)) {
                                    var u = i[o];
                                    s.value = null != (c = l[a])[(d = u).key] ? c[d.key] : ""
                                }
                                l[a].fieldConfig[o] = s, _(l), A(e, a)
                            }
                        }, t.onclick = function(e) {
                            e.stopPropagation()
                        }
                    }), e.querySelectorAll(".__pv_val").forEach(function(t) {
                        t.onclick = function(e) {
                            e.stopPropagation()
                        };
                        var n = function(n) {
                            n.stopPropagation();
                            var a = t.dataset.k,
                                r = t.dataset.fk,
                                l = p();
                            if (l[a]) {
                                l[a].fieldConfig || (l[a].fieldConfig = {});
                                var c = l[a].fieldConfig[r] || {
                                    mode: "set"
                                };
                                c.value = t.value, l[a].fieldConfig[r] = c, _(l);
                                var d = o.some(function(e) {
                                    return e.parent === r
                                });
                                if ("usageRestrictionType" !== r && "deliveryRestriction" !== r) {
                                    if (d) {
                                        var s = E() || T();
                                        if (!s) return;
                                        o.forEach(function(n) {
                                            if (n.parent === r) {
                                                var o = e.querySelector('select.__pv_val[data-fk="' + n.key + '"]');
                                                if (o) {
                                                    var c = R(l[a], n),
                                                        d = "value" in c ? c.value : l[a][n.key];
                                                    o.setAttribute("data-loading", "1"), o.innerHTML = "<option>読み込み中...</option>", C(s.doc, i[r].domId, n.domId, t.value).then(function(e) {
                                                        o.removeAttribute("data-loading"), o.innerHTML = '<option value="">(選択してください)</option>' + e.map(function(e) {
                                                            var t = String(e.text).trim() === String(d || "").trim() ? " selected" : "";
                                                            return '<option value="' + u(e.text) + '"' + t + ">" + u(e.text) + "</option>"
                                                        }).join("")
                                                    })
                                                }
                                            }
                                        })
                                    }
                                } else A(e, a)
                            }
                        };
                        t.onchange = n, "INPUT" !== t.tagName && "TEXTAREA" !== t.tagName || (t.oninput = n)
                    }), e.querySelectorAll(".__pv_tplname").forEach(function(t) {
                        /* テンプレ名編集：即時保存し、一覧の番号バッジのみその場更新（詳細パネルは畳まない／スクロール維持） */
                        t.onclick = function(e) {
                            e.stopPropagation()
                        };
                        var save = function(trim) {
                            var a = t.dataset.k,
                                l = p();
                            if (l[a]) {
                                var v = t.value || "";
                                /* oninput中はトリムしない（語中の空白入力を妨げないため）。確定時(change/blur)のみ前後トリム */
                                trim && (v = v.trim(), t.value = v), l[a].templateName = v, _(l);
                                var b = I.querySelector('.__pv_row[data-k="' + CSS.escape(a) + '"] .__pv_no');
                                b && (b.textContent = v)
                            }
                        };
                        t.oninput = function() {
                            save(!1)
                        }, t.onchange = function() {
                            save(!0)
                        }
                    })
                }
            };
        if (I.querySelectorAll(".__pv_apply").forEach(function(e) {
                e.onclick = function() {
                    if (!j) {
                        var t = e.dataset.k,
                            n = p(),
                            a = n[t];
                        a ? O(function(e) {
                            if (d(a, e)) {
                                try {
                                    e && !e.closed && e.focus()
                                } catch (e) {}
                                a.isTemplate ? q("反映しました(テンプレは保持)") : (delete n[t], _(n), q("反映しました(一時保存を削除)")), M()
                            }
                        }) : q("データが見つかりません", !0)
                    }
                }
            }), I.querySelectorAll(".__pv_toggle").forEach(function(e) {
                e.onclick = function() {
                    if (!j) {
                        var t = function(e) {
                            var t = p(),
                                n = t[e];
                            if (!n) return null;
                            /* 内部IDで再キーし、テンプレ名を自動採番。実素材番号(materialNumber)は上書きせず保持する */
                            n.isTemplate = !0, n.templateName = gName(t);
                            var a = gId(t);
                            return delete t[e], t[a] = n, _(t), n.templateName
                        }(e.dataset.k);
                        t ? q("テンプレ化しました (" + t + ")") : q("データが見つかりません", !0), J()
                    }
                }
            }), I.querySelectorAll(".__pv_open").forEach(function(e) {
                e.onclick = function() {
                    var t = e.dataset.k,
                        n = I.querySelector("#__pv_dt_" + CSS.escape(t));
                    n && (n.classList.contains("open") ? n.classList.remove("open") : (A(n, t), n.classList.add("open")))
                }
            }), I.querySelectorAll(".__pv_del").forEach(function(e) {
                e.onclick = function() {
                    if (!j) {
                        /* 削除前に確認（キャンセル時は何もしない） */
                        if (!confirm("保存メタを削除します。\nよろしいですか？")) return;
                        var t = e.dataset.k,
                            n = p();
                        delete n[t], _(n), q("削除しました"), J()
                    }
                }
            }), I.querySelector("#__pv_openall").onclick = function() {
                j || n.forEach(function(e) {
                    ! function(e) {
                        var t = I.querySelector("#__pv_dt_" + CSS.escape(e));
                        t && (t.classList.contains("open") || (A(t, e), t.classList.add("open")))
                    }(e)
                })
            }, I.querySelector("#__pv_closeall").onclick = function() {
                j || n.forEach(function(e) {
                    ! function(e) {
                        var t = I.querySelector("#__pv_dt_" + CSS.escape(e));
                        t && t.classList.remove("open")
                    }(e)
                })
            }, I.querySelector("#__pv_delall").onclick = function() {
                /* 全削除前に確認（!jガード維持・キャンセル時は何もしない） */
                j || confirm("保存メタを全て削除します。\nよろしいですか？") && (localStorage.removeItem(s), function() {
                    /* 全削除もlocalStorage優先の原則どおりファイルへ反映（空ストアで上書き） */
                    try {
                        __pvFsScheduleWrite()
                    } catch (e) {}
                }(), q("全削除しました"), J())
            }, Y(), j && I.querySelectorAll(".__pv_exp_chk").forEach(function(e) {
                e.onclick = function(e) {
                    e.stopPropagation()
                }, e.onchange = function() {
                    var t = e.dataset.k;
                    e.checked ? P.add(t) : P.delete(t), G(r)
                }
            }), U) {
            var N = I.querySelector("#__pv_dt_" + CSS.escape(U));
            if (N) {
                A(N, U), N.classList.add("open");
                var D = I.querySelector('.__pv_row[data-k="' + CSS.escape(U) + '"]');
                D && D.scrollIntoView && D.scrollIntoView({
                    behavior: "smooth",
                    block: "center"
                })
            }
            U = null
        }
        G(r)
    }

    function Y() {
        var e = I.querySelector("#__pv_create");
        e && (j ? e.disabled = !0 : e.onclick = function() {
            if (!j) {
                var e = function() {
                    var e = p(),
                        t = gId(e),
                        nm = gName(e),
                        n = {
                            materialNumber: "",
                            templateName: nm,
                            isTemplate: !0,
                            capturedAt: (new Date).toISOString(),
                            fieldConfig: {}
                        };
                    return o.forEach(function(e) {
                        n.fieldConfig[e.key] = {
                            mode: "skip"
                        }
                    }), e[t] = n, _(e), {
                        id: t,
                        name: nm
                    }
                }();
                /* トーストにはテンプレ名、詳細自動展開用 U には内部IDを渡す */
                q("テンプレを作成しました (" + e.name + ")"), U = e.id, J()
            }
        })
    }

    function G(e) {
        if (R.style.display = "flex", j) {
            var t = P.size,
                n = 0 === t ? " disabled" : "";
            R.innerHTML = '<div class="__pv_footer_left"><button class="__pv_btn" id="__pv_exp_selall">全選択</button><button class="__pv_btn" id="__pv_exp_selnone">全解除</button></div><div class="__pv_footer_right"><button class="__pv_btn" id="__pv_exp_cancel">キャンセル</button><button class="__pv_btn pri" id="__pv_exp_run"' + n + ">選択をエクスポート(" + t + "件)</button></div>", R.querySelector("#__pv_exp_selall").onclick = function() {
                var e = p();
                Object.keys(e).forEach(function(t) {
                    e[t].isTemplate && P.add(t)
                }), J()
            }, R.querySelector("#__pv_exp_selnone").onclick = function() {
                P.clear(), J()
            }, R.querySelector("#__pv_exp_cancel").onclick = function() {
                j = !1, P.clear(), J()
            }, R.querySelector("#__pv_exp_run").onclick = function() {
                0 !== P.size && (function(e) {
                    var t = p(),
                        n = [];
                    e.forEach(function(e) {
                        t[e] && t[e].isTemplate && n.push(t[e])
                    });
                    var a = {
                            version: 1,
                            exportedAt: (new Date).toISOString(),
                            appName: "webCV-meta-tool",
                            templates: n
                        },
                        o = new Date,
                        i = function(e) {
                            return ("0" + e).slice(-2)
                        },
                        r = "webcv_templates_" + o.getFullYear() + i(o.getMonth() + 1) + i(o.getDate()) + "_" + i(o.getHours()) + i(o.getMinutes()) + i(o.getSeconds()) + ".json",
                        l = new Blob([JSON.stringify(a, null, 2)], {
                            type: "application/json"
                        }),
                        c = URL.createObjectURL(l),
                        d = document.createElement("a");
                    d.href = c, d.download = r, document.body.appendChild(d), d.click(), setTimeout(function() {
                        document.body.removeChild(d), URL.revokeObjectURL(c)
                    }, 100), q(n.length + "件エクスポートしました")
                }(Array.from(P)), j = !1, P.clear(), J())
            }
        } else {
            var a = 0 === e ? " disabled" : "",
                o = D ? '<button class="__pv_btn gld" id="__pv_edge_help" title="Edgeで閉じるときにサイトデータを削除する設定だと、保存したメタが消えます">⚠ Edgeでの必須設定（メタ保存を維持するために）</button>' : "";
            R.innerHTML = '<div class="__pv_footer_left">' + o + '</div><div class="__pv_footer_right"><button class="__pv_btn" id="__pv_import_btn">インポート</button><button class="__pv_btn gld" id="__pv_export_btn"' + a + '>エクスポート</button><input type="file" id="__pv_import_file" accept=".json,application/json" style="display:none"></div>';
            var i = R.querySelector("#__pv_edge_help");
            i && (i.onclick = L);
            var r = R.querySelector("#__pv_import_btn"),
                l = R.querySelector("#__pv_export_btn"),
                c = R.querySelector("#__pv_import_file");
            r.onclick = function() {
                c.click()
            }, c.onchange = function(e) {
                var t = e.target.files && e.target.files[0];
                t && function(e) {
                    if (/\.json$/i.test(e.name)) {
                        var t = new FileReader;
                        t.onload = function(e) {
                            var t;
                            try {
                                t = JSON.parse(e.target.result)
                            } catch (e) {
                                return void q("JSONの解析に失敗しました", !0)
                            }
                            if (1 === t.version)
                                if (Array.isArray(t.templates)) {
                                    var n = [],
                                        a = 0;
                                    if (t.templates.forEach(function(e) {
                                            /* 取り込み可否：templateName か materialNumber のいずれかがあればOK（新規作成テンプレは materialNumber 空のため） */
                                            e && "object" == typeof e && (e.templateName || e.materialNumber) ? n.push(e) : a++
                                        }), 0 !== n.length) {
                                        var o = p();
                                        n.forEach(function(e) {
                                            e.isTemplate = !0;
                                            /* テンプレ名：新形式は templateName をそのまま、旧形式は materialNumber(TMP000X等) を初期名に。内部IDは毎回新規生成 */
                                            e.templateName = null != e.templateName ? e.templateName : e.materialNumber || "";
                                            var t = gId(o);
                                            o[t] = e
                                        }), _(o);
                                        var i = n.length + "件取り込みました";
                                        a > 0 && (i += "（" + a + "件スキップ）"), q(i), j = !1, P.clear(), J()
                                    } else q("取り込み可能なデータがありません" + (a > 0 ? "（" + a + "件スキップ）" : ""), !0)
                                } else q("不正なフォーマットです", !0);
                            else q("対応していないバージョンです", !0)
                        }, t.onerror = function() {
                            q("ファイル読み込みに失敗しました", !0)
                        }, t.readAsText(e)
                    } else q("JSONファイルを選択してください", !0)
                }(t), c.value = ""
            }, l.onclick = function() {
                0 !== e && (j = !0, P.clear(), J())
            }
        }
    }

    function J() {
        "list" !== N && (j = !1, P.clear()), "capture" === N ? function() {
            e.__openedPreviews = (e.__openedPreviews || []).filter(function(e) {
                return e.win && !e.win.closed
            });
            var t = e.__openedPreviews,
                n = '<div class="__pv_empty"><div style="font-size:14px;color:#334155;font-weight:600;line-height:1.7;margin-bottom:14px;">プレビュー画面が未検知のため<br>プレビュー画面を開き直して、再度本ツールを実行してください。</div><div style="display:inline-block;text-align:left;max-width:560px;font-size:12px;color:#475569;background:#f1f5f9;border:1px solid #e2e8f0;border-radius:8px;padding:10px 12px;line-height:1.7;"><b style="color:#2563eb;">仕様</b>　本ツールを1度実行すれば「プレビュー画面検知モード」がスタートし<br>その後に開くプレビュー画面が検知できます。</div></div>',
                o = '<p class="__pv_hint">検知したプレビュー画面の内容を読み込んでいます…</p><div class="__pv_empty">読み込み中（' + t.length + "件）…</div>";

            function i() {
                var e;
                e = '<p class="__pv_hint">検知したプレビュー画面の一覧です。チェックを入れて「選択を保存」を押してください。</p>', e += '<div class="__pv_bar"><button class="__pv_btn" id="__pv_selall">全選択</button><button class="__pv_btn" id="__pv_selnone">全解除</button><span class="__pv_spacer"></span><button class="__pv_btn pri" id="__pv_savesel">選択を保存</button></div>', B.forEach(function(t, n) {
                    if (t.error) e += '<div class="__pv_row"><input type="checkbox" class="chk __pv_pchk" data-i="' + n + '" disabled><div class="__pv_rmain"><div class="__pv_rtop"><span class="__pv_no">' + u(t.p.materialNumber || "(番号不明)") + '</span></div><div class="__pv_meta" style="color:#dc2626">読み込み失敗: ' + u(t.error) + '</div></div><div class="__pv_acts"><button class="__pv_btn pri __pv_copyreg" data-i="' + n + '" disabled>メタコピーして<br>素材登録</button></div></div>';
                    else {
                        var a = t.data,
                            o = "使用注意" === a.usageRestrictionType;
                        e += '<div class="__pv_row"><input type="checkbox" class="chk __pv_pchk" data-i="' + n + '" checked><div class="__pv_rmain"><div class="__pv_rtop"><span class="__pv_no">' + u(a.materialNumber || "") + '</span><span class="__pv_ttl">' + u(a.materialTitle || "(タイトルなし)") + '</span></div><div class="__pv_desc">' + u(v(a.description, 55) || "—") + '</div><div class="__pv_metarow"><span class="__pv_meta"><b>ジャンル:</b> ' + u(a.genre || "—") + "</span>" + (o ? '<span class="__pv_badge warn">使用注意</span>' : '<span class="__pv_badge none">制限なし</span>') + '</div></div><div class="__pv_acts"><button class="__pv_btn pri __pv_copyreg" data-i="' + n + '">メタコピーして<br>素材登録</button></div></div>'
                    }
                }), I.innerHTML = e, I.querySelector("#__pv_selall").onclick = function() {
                    I.querySelectorAll(".__pv_pchk:not(:disabled)").forEach(function(e) {
                        e.checked = !0
                    })
                }, I.querySelector("#__pv_selnone").onclick = function() {
                    I.querySelectorAll(".__pv_pchk").forEach(function(e) {
                        e.checked = !1
                    })
                }, I.querySelector("#__pv_savesel").onclick = function() {
                    var e = Array.from(I.querySelectorAll(".__pv_pchk:checked")).map(function(e) {
                        return parseInt(e.dataset.i)
                    });
                    if (0 !== e.length) {
                        for (var t = p(), n = [], a = 0; a < e.length; a++) {
                            var o = B[e[a]];
                            if (o && o.data) {
                                var i = o.data;
                                i.isTemplate = !1, t[i.materialNumber] = i, n.push(i.materialNumber)
                            }
                        }
                        _(t), q(n.length + "件保存しました", !1, "#16a34a", 4e3), N = "list", A.forEach(function(e) {
                            e.classList.toggle("act", "list" === e.dataset.tab)
                        }), J()
                    } else q("保存対象が選択されていません", !0)
                }, I.querySelectorAll(".__pv_copyreg").forEach(function(e) {
                    e.onclick = function() {
                        ! function(e) {
                            var t = B[e];
                            if (t && t.data) {
                                var n = t.data,
                                    a = window.__pvToolRoot || {},
                                    o = function(e) {
                                        if (d(n, e)) {
                                            try {
                                                e && !e.closed && e.focus()
                                            } catch (e) {}
                                            M()
                                        }
                                    },
                                    i = function() {
                                        for (var e = a.__openedRegists || [], t = e.length - 1; t >= 0; t--)
                                            if (b(e[t].win)) return e[t].win;
                                        return null
                                    },
                                    r = i();
                                if (r) o(r);
                                else {
                                    var l = Array.from(document.querySelectorAll("button.btnTitle")).find(function(e) {
                                        return "元素材登録" === e.textContent.trim()
                                    });
                                    if (l) {
                                        try {
                                            window.open("", "OriginalMaterialRegistWindow")
                                        } catch (e) {}
                                        l.click();
                                        var c = 0,
                                            s = setInterval(function() {
                                                var e = i(),
                                                    t = !1;
                                                try {
                                                    t = e && e.document && !!e.document.getElementById("CategoryCode")
                                                } catch (e) {
                                                    t = !1
                                                }
                                                t ? (clearInterval(s), o(e)) : (c += 300) >= 1e4 && (clearInterval(s), q("元素材登録画面の読み込みを確認できませんでした。画面の起動状況を確認し、「反映」ボタンから実行してください", !0))
                                            }, 300)
                                    } else q("元素材登録ボタンが見つかりませんでした。手動で開いてから再実行してください", !0)
                                }
                            } else q("コピー対象のデータがありません", !0)
                        }(parseInt(e.dataset.i))
                    }
                })
            }
            R.innerHTML = "", R.style.display = "none", H ? B.length ? i() : I.innerHTML = n : 0 !== t.length ? z ? I.innerHTML = o : (z = !0, I.innerHTML = o, async function() {
                B = [];
                for (var e = 0; e < t.length; e++) {
                    var n = t[e];
                    try {
                        var o = await a(n);
                        B.push({
                            p: n,
                            data: o,
                            error: null
                        })
                    } catch (e) {
                        B.push({
                            p: n,
                            data: null,
                            error: e.message
                        })
                    }
                }
                B.sort(function(e, t) {
                    var n = e.data && e.data.capturedAt || e.p && e.p.openedAt || "",
                        a = t.data && t.data.capturedAt || t.p && t.p.openedAt || "";
                    return n > a ? -1 : n < a ? 1 : 0
                }), z = !1, H = !0, "capture" === N && i()
            }()) : I.innerHTML = n
        }() : V()
    }
    A.forEach(function(e) {
        e.classList.toggle("act", e.dataset.tab === N)
    }), J()
}();